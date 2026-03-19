import nodemailer from 'nodemailer';
import { PASSWORD_RESET_EXPIRY_LABEL } from '@/lib/auth-constants';

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function passwordResetEmailHtml(resetUrl: string, userName: string): string {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Passwort zurücksetzen – Arkanum Akademie</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0f1a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f1a;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#1a1a2e;border-radius:16px;overflow:hidden;border:1px solid rgba(139,92,246,0.2);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed,#6d28d9);padding:32px 40px;text-align:center;">
              <div style="display:inline-flex;align-items:center;gap:8px;">
                <div style="width:36px;height:36px;background:rgba(255,255,255,0.2);border-radius:8px;display:inline-block;text-align:center;line-height:36px;font-size:18px;font-weight:bold;color:#fff;">A</div>
                <span style="font-size:20px;font-weight:700;color:#fff;margin-left:8px;">Arkanum Akademie</span>
              </div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h1 style="margin:0 0 8px;font-size:22px;color:#f1f5f9;">Passwort zurücksetzen</h1>
              <p style="margin:0 0 24px;color:#94a3b8;font-size:15px;">Hallo ${userName},</p>
              <p style="margin:0 0 24px;color:#cbd5e1;font-size:15px;line-height:1.6;">
                Wir haben eine Anfrage erhalten, das Passwort für dein Konto zurückzusetzen.
                Klicke auf den Button unten, um ein neues Passwort zu erstellen.
              </p>
              <p style="margin:0 0 32px;color:#cbd5e1;font-size:15px;line-height:1.6;">
                Der Link ist <strong style="color:#a78bfa;">${PASSWORD_RESET_EXPIRY_LABEL}</strong> gültig.
              </p>
              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                <tr>
                  <td style="background:linear-gradient(135deg,#7c3aed,#6d28d9);border-radius:12px;padding:0;">
                    <a href="${resetUrl}" style="display:inline-block;padding:14px 32px;color:#fff;font-size:15px;font-weight:600;text-decoration:none;border-radius:12px;">
                      Jetzt Passwort zurücksetzen ✦
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;color:#64748b;font-size:13px;">
                Falls der Button nicht funktioniert, kopiere diesen Link in deinen Browser:
              </p>
              <p style="margin:0 0 32px;font-size:12px;word-break:break-all;">
                <a href="${resetUrl}" style="color:#a78bfa;text-decoration:underline;">${resetUrl}</a>
              </p>
              <hr style="border:none;border-top:1px solid rgba(139,92,246,0.15);margin:0 0 24px;" />
              <p style="margin:0;color:#475569;font-size:13px;line-height:1.6;">
                Falls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren.
                Dein Passwort bleibt unverändert.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid rgba(139,92,246,0.1);text-align:center;">
              <p style="margin:0;color:#334155;font-size:12px;">
                © ${new Date().getFullYear()} Arkanum Akademie. Alle Rechte vorbehalten.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendPasswordResetEmail(
  toEmail: string,
  userName: string,
  resetToken: string
): Promise<{ success: boolean; previewUrl?: string }> {
  const appUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
  const resetUrl = `${appUrl}/passwort-reset?token=${resetToken}`;

  const transporter = createTransporter();

  if (!transporter) {
    // No SMTP configured – use Ethereal test account in development
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SMTP is not configured. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS.');
    }

    const testAccount = await nodemailer.createTestAccount();
    const devTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });

    const info = await devTransporter.sendMail({
      from: `"Arkanum Akademie" <${testAccount.user}>`,
      to: toEmail,
      subject: 'Passwort zurücksetzen – Arkanum Akademie',
      html: passwordResetEmailHtml(resetUrl, userName),
      text: `Hallo ${userName},\n\nKlicke auf folgenden Link, um dein Passwort zurückzusetzen (gültig für 60 Minuten):\n${resetUrl}\n\nFalls du diese Anfrage nicht gestellt hast, ignoriere diese E-Mail.`,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
    console.log('[dev] Password reset email preview:', previewUrl);
    return { success: true, previewUrl };
  }

  const fromAddress = process.env.SMTP_USER!;
  await transporter.sendMail({
    from: `"Arkanum Akademie" <${fromAddress}>`,
    to: toEmail,
    subject: 'Passwort zurücksetzen – Arkanum Akademie',
    html: passwordResetEmailHtml(resetUrl, userName),
    text: `Hallo ${userName},\n\nKlicke auf folgenden Link, um dein Passwort zurückzusetzen (gültig für 60 Minuten):\n${resetUrl}\n\nFalls du diese Anfrage nicht gestellt hast, ignoriere diese E-Mail.`,
  });

  return { success: true };
}
