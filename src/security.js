// Input Sanitization
export function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Email Validation
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  // Strict regex for email validation
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase()) && email.length <= 254;
}

// Rate Limiter
export class RateLimiter {
  constructor(maxAttempts, windowMs) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.attempts = new Map();
  }

  isRateLimited(key) {
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || [];
    
    // Filter out attempts outside the window
    const recentAttempts = userAttempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return true;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return false;
  }
  
  getRemainingAttempts(key) {
      const now = Date.now();
      const userAttempts = this.attempts.get(key) || [];
      const recentAttempts = userAttempts.filter(time => now - time < this.windowMs);
      return Math.max(0, this.maxAttempts - recentAttempts.length);
  }
  
  reset(key) {
      this.attempts.delete(key);
  }
}

// Global instances
export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 min

// CSRF Token Management
export function generateCSRFToken() {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    const token = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
    sessionStorage.setItem('csrf_token', token);
    return token;
}

export function validateCSRFToken(token) {
    const storedToken = sessionStorage.getItem('csrf_token');
    return storedToken && token === storedToken;
}
