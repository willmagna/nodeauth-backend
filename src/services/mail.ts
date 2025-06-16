import nodemailer from "../config/mail.js";

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
