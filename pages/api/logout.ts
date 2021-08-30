import { applySession } from 'next-iron-session';

export default async function logout(req, res) {
  await applySession(req, res, {
    password: process.env.SESSION_PASSWORD,
    cookieName: 'id',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  });
  req.session.destroy();
  res.json({ isLoggedIn: false });
}
