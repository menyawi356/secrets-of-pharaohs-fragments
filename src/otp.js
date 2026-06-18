import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

// Generate a random 6-digit OTP
export function generateOTP() {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  // Get a 6-digit number by taking modulo 1000000 and padding with zeros
  const otp = (array[0] % 1000000).toString().padStart(6, '0');
  return otp;
}

// Hash string using SHA-256
export async function hashString(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Simple in-memory rate limiting for OTP requests
const otpRequestMap = new Map();
const MAX_REQUESTS_PER_MIN = 3;
const WINDOW_MS = 60 * 1000;

function canRequestOTP(email) {
    const now = Date.now();
    const requests = otpRequestMap.get(email) || [];
    // Filter out requests older than the window
    const recentRequests = requests.filter(time => now - time < WINDOW_MS);
    
    if (recentRequests.length >= MAX_REQUESTS_PER_MIN) {
        return false;
    }
    
    recentRequests.push(now);
    otpRequestMap.set(email, recentRequests);
    return true;
}

export async function storeOTP(email, code) {
  if (!canRequestOTP(email)) {
      throw new Error("Rate limit exceeded. Please wait a minute before requesting another OTP.");
  }

  const emailHash = await hashString(email.toLowerCase().trim());
  const codeHash = await hashString(code);
  const now = Date.now();
  // Expires in 10 minutes
  const expiresAt = new Date(now + 10 * 60 * 1000);

  try {
    await addDoc(collection(db, 'otp_codes'), {
      emailHash,
      codeHash,
      createdAt: serverTimestamp(),
      expiresAt,
      attempts: 0,
      used: false
    });
    return true;
  } catch (error) {
    console.error("Error storing OTP:", error);
    throw new Error("Failed to store OTP");
  }
}

export async function verifyOTP(email, code) {
  const emailHash = await hashString(email.toLowerCase().trim());
  const codeHash = await hashString(code);
  
  try {
    const q = query(collection(db, 'otp_codes'), 
                    where("emailHash", "==", emailHash),
                    where("used", "==", false));
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        return { success: false, error: "Invalid or expired OTP." };
    }

    // Find the most recent valid OTP
    let validDoc = null;
    let maxTime = 0;

    querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        // Check expiration
        if (data.expiresAt.toDate() > new Date() && data.attempts < 5) {
             const time = data.createdAt ? data.createdAt.toMillis() : 0;
             if (time > maxTime) {
                 maxTime = time;
                 validDoc = { id: docSnap.id, data };
             }
        }
    });

    if (!validDoc) {
         return { success: false, error: "OTP expired or too many attempts." };
    }

    const { id, data } = validDoc;

    if (data.codeHash === codeHash) {
        // Mark as used
        await updateDoc(doc(db, 'otp_codes', id), { used: true });
        return { success: true };
    } else {
        // Increment attempts
        await updateDoc(doc(db, 'otp_codes', id), { attempts: data.attempts + 1 });
        return { success: false, error: "Invalid OTP code." };
    }

  } catch (error) {
      console.error("Error verifying OTP:", error);
      return { success: false, error: "Verification failed due to an internal error." };
  }
}
