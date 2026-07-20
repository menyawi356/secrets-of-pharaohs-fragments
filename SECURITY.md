# Security Architecture for Pharaohs' Fragments

This document outlines the security measures implemented in the application.

## Authentication Strategy

We implemented a **Passwordless Email Link Authentication** system using Firebase Auth.

### Why Passwordless?
1. **Mitigates Brute Force & Credential Stuffing**: There are no passwords to guess, steal, or leak.
2. **Eliminates Password Reuse**: Users often reuse passwords across sites. By removing the password, a breach elsewhere cannot compromise an account here.
3. **Phishing Resistance**: The magic link can only be used once, and its destination URL is strictly whitelisted in the Firebase console.

## Optional OTP Module

The OTP module is designed as an extra layer of verification, not as a primary authentication mechanism.

### Security Features:
- **Hashing**: OTPs and Emails are never stored in plaintext in the database. They are hashed using SHA-256 before storage.
- **Expiration**: OTPs expire automatically after 10 minutes.
- **One-Time Use**: OTPs are marked as `used: true` immediately after successful verification.
- **Attempt Limits**: OTPs are invalidated after 5 failed attempts.

## Rate Limiting

Client-side rate limiting is implemented to prevent abuse:
- **Login Links**: Maximum of 5 requests per 15 minutes per user.
- **OTP Requests**: Maximum of 3 requests per 1 minute per user.

*Note: For production environments, these should be supplemented with server-side rate limits (e.g., via Cloud Functions or a WAF).*

## XSS & CSRF Protection

- **XSS (Cross-Site Scripting)**: The application relies on React's automatic HTML escaping. We strictly avoid `dangerouslySetInnerHTML`.
- **Input Sanitization**: A generic `sanitizeInput` utility is provided to strip potentially harmful characters from string inputs before processing.
- **CSRF (Cross-Site Request Forgery)**: The application uses Firebase Auth, which automatically manages session tokens via IndexedDB/LocalStorage, mitigating traditional cookie-based CSRF attacks. A manual `generateCSRFToken` utility is provided for custom API endpoints if needed.

## Consistency & Trust

Maintaining the existing design system (Egyptian-themed dark UI, gold accents, Cinzel typography) across the new authentication pages is not just a UX requirement; it's a security feature. Consistent branding helps users verify they are on the genuine application and not a phishing site.
