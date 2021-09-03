import { applySession } from 'next-iron-session';
import addSolAddr from '../../lib/addSolAddr';

export default async function addSolWallet(req, res) {
  await applySession(req, res, {
    password: process.env.SESSION_PASSWORD,
    cookieName: 'id',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  });
  const { phone, sol_addr } =
    typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const addResp = await addSolAddr({ phone, sol_addr });
  var user = req.session.get('user');
  //@ts-ignore
  req.session.set('user', {
    //@ts-ignore
    ...user,
    sol_addr: sol_addr,
  });
  //@ts-ignore
  await req.session.save();
  res.json(user);
}
