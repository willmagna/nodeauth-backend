import nodemailer from "../lib/mailer.js";

export async function sendRecoveryEmail(email: string, code: string) {
  console.log(`📧 Sending recovery code ${code} to ${email}`);

  const result = await nodemailer.sendMail({
    from: '"Maddison Foo Koch" <from@example.com >',
    to: "from@example.com ",
    subject: "Your recovey code has arrived",
    text: `Recovey code: ${code}`, // plain‑text body
    html: `<p>Recovey code: ${code}</p>`, // HTML body
  });

  console.log(result);
}

export async function sendInvitationEmail(
  email: string,
  invitationLink: string
) {
  console.log(`Sending invitation link to ${email}`);

  const result = await nodemailer.sendMail({
    from: '"Maddison Foo Koch" <from@example.com >',
    to: "from@example.com ",
    subject: "Your recovey invitation link has arrived",
    text: `Invitation link to signup into ScaleHub: ${invitationLink}`, // plain‑text body
    html: `<p>Invitation link to signup into ScaleHub: ${invitationLink}</p>`, // HTML body
  });

  console.log(result);
}
