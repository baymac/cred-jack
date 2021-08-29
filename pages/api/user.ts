import { applySession } from 'next-iron-session';

export default async function user(req, res) {
  await applySession(req, res, {
    password: process.env.SESSION_PASSWORD,
    cookieName: 'id',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  });
  const user = req.session.get('user');

  if (user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    res.json({
      isLoggedIn: true,
      ...user,
    });
  } else {
    res.json({
      isLoggedIn: false,
    });
  }
}
