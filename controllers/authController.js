const User = require('../models/User');
const Otp = require('../models/otp');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../utils/sendMail');
const { generateOTP } = require('../utils/generateOtp');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const storeOTP = async (userId, code) => {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await User.findByIdAndUpdate(userId, {
    otp: { code, expiresAt },
  });
};

// ✅ INSCRIPTION AVEC ENVOI EMAIL OTP
exports.register = async (req, res) => {
  try {
    console.log("📨 Données reçues:", req.body);

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nom, email et mot de passe sont requis",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Utilisateur avec cet email existe déjà",
      });
    }

    // Création de l'utilisateur
    const user = await User.create({ username, email, password });

    // 🔹 Envoi de l’OTP par email à chaque inscription
    const otpCode = generateOTP();
    await storeOTP(user._id, otpCode);

    const emailResult = await sendOTPEmail(email, otpCode, username);
    if (!emailResult.success) {
      console.warn("⚠️ Échec de l’envoi d’e-mail OTP");
    }

    return res.status(201).json({
      success: true,
      message: "Utilisateur créé. Code de vérification envoyé par email.",
      requiresOTP: true,
      data: { user: { id: user._id, username, email } },
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'inscription:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de l'inscription",
      error: error.message,
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Utilisateur non trouvé' });

    if (!user.isVerified) return res.status(401).json({ message: 'Compte non vérifié' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
