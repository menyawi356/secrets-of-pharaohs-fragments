# EmailJS Template Setup Instructions

## File: `emailjs_template.html`

This file contains the ready-to-paste HTML for your EmailJS email template.
It automatically uses the variables sent from the website for each team member.

## Steps to Update Your EmailJS Template

1. Go to https://dashboard.emailjs.com
2. Navigate to **Email Templates** → select your template (`template_9qjq5m5`)
3. Switch to **HTML** mode in the template editor
4. **Paste the entire content** of `emailjs_template.html`
5. Save the template

## Variables Used in the Template

The website now sends these variables for EVERY team member (leader + member 2 + member 3):

| Variable              | Description                                      |
|-----------------------|--------------------------------------------------|
| `{{to_name}}`         | The individual member's full name                |
| `{{to_email}}`        | The individual member's email (auto-used by EJS) |
| `{{team_name}}`       | The registered team name                         |
| `{{country}}`         | The individual member's country                  |
| `{{ambassador_link}}` | Link to the Ambassador Program page              |
| `{{connect_instagram}}`     | Instagram URL                              |
| `{{connect_whatsapp}}`      | WhatsApp group link                        |
| `{{connect_whatsapp_ch}}`   | WhatsApp channel link                      |
| `{{connect_telegram_ch}}`   | Telegram channel link                      |
| `{{connect_telegram_chat}}` | Telegram chat link                         |
| `{{connect_linkedin}}`      | LinkedIn profile link                      |
| `{{connect_twitter}}`       | Twitter / X link                           |
| `{{connect_website}}`       | Website URL                                |
| `{{connect_email}}`         | Support email                              |

## What Changed in the Code

- `Register.jsx` → `sendConfirmationEmail()` now passes `country` + all social links to EmailJS.
- All 3 members (leader, member 2, member 3) receive their **own personalised email** with their name and country.
- The Ambassador Program link (`https://pharaohleague.org/ambassador`) is included in every email.
