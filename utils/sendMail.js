// utils/email.js
const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // ex: "gmail"
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

exports.sendOTPEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Votre code de vérification Toumai',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Vérification de votre compte Toumai</h2>
          <p>Bonjour,</p>
          <p>Utilisez le code suivant pour vérifier votre compte :</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #2563eb; margin: 0; font-size: 32px;">${otp}</h1>
          </div>
          <p>Ce code expirera dans 10 minutes.</p>
          <p>Si vous n'avez pas créé de compte, veuillez ignorer cet email.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px;">L'équipe Toumai</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email OTP envoyé avec succès à:', email);

    return { success: true };
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    return { success: false, error: error.message };
  }
};
