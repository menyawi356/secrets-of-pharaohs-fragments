import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { participantData } = req.body;
    
    const { data, error } = await resend.emails.send({
      from: 'Pharaohs\' Fragments <noreply@yourdomain.com>',
      to: participantData.leader_email,
      subject: 'Registration Confirmation - Pharaohs\' Fragments',
      html: `
        <h1>Registration Confirmed!</h1>
        <p>Dear ${participantData.leader_name},</p>
        <p>Your registration for the Pharaohs' Fragments physics competition has been received successfully.</p>
        <p>Team: ${participantData.team_name}</p>
        <p>We will contact you with further details about the competition schedule.</p>
        <p>Best regards,<br/>Pharaohs' Fragments Team</p>
      `,
    });

    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}