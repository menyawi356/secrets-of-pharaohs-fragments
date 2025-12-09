import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'your-email@example.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { contactData } = req.body;
    
    // Send to admin
    const { data, error } = await resend.emails.send({
      from: 'Website Contact <noreply@yourdomain.com>',
      to: ADMIN_EMAIL,
      subject: `New Contact: ${contactData.subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>From:</strong> ${contactData.name} (${contactData.email})</p>
        <p><strong>Subject:</strong> ${contactData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${contactData.message}</p>
      `,
    });

    if (error) throw error;

    // Send auto-reply to sender
    await resend.emails.send({
      from: 'Pharaohs\' Fragments <noreply@yourdomain.com>',
      to: contactData.email,
      subject: 'Message Received - Pharaohs\' Fragments',
      html: `
        <h1>Thank you for your message!</h1>
        <p>Dear ${contactData.name},</p>
        <p>We have received your message and will get back to you within 48 hours.</p>
        <p>Best regards,<br/>Pharaohs' Fragments Team</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}