// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Investor = require('../models/Investor');
const asyncHandler = require('../utils/asyncHandler');

const createAccessToken = user => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
const createRefreshToken = user => jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

const cookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === 'true', // set true in production (HTTPS)
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

  if (await Investor.findOne({ email })) return res.status(400).json({ error: 'Email exists' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await Investor.create({ name, email, password: passwordHash, role });
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('refreshToken', refreshToken, cookieOptions);
  res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, accessToken });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await Investor.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('refreshToken', refreshToken, cookieOptions);
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, accessToken });
});

exports.refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: 'No refresh token' });

  let payload;
  try { payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET); } catch (e) { return res.status(401).json({ error: 'Invalid refresh token' }); }

  const user = await Investor.findById(payload.id);
  if (!user || user.refreshToken !== token) return res.status(401).json({ error: 'Invalid refresh token' });

  const newAccess = createAccessToken(user);
  const newRefresh = createRefreshToken(user);
  user.refreshToken = newRefresh;
  await user.save();

  res.cookie('refreshToken', newRefresh, cookieOptions);
  res.json({ accessToken: newAccess });
});

exports.logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      await Investor.findByIdAndUpdate(payload.id, { $unset: { refreshToken: '' }});
    } catch (e) { /* ignore */ }
  }
  res.clearCookie('refreshToken', cookieOptions);
  res.json({ message: 'Logged out' });
});
