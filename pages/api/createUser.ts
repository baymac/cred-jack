import { NextApiRequest, NextApiResponse } from 'next';
import { applySession } from 'next-iron-session';
import addSolAddr from '../../lib/addSolAddr';
import { getUserProfile } from './login';

interface IUserResponse {
  last_name: string;
  phone: string;
  first_name: string;
  email: string;
  coins: number;
  trust_score: number;
  existing_user: boolean;
}

const createUserProfile = async (
  first_name: string,
  last_name: string,
  email: string,
  access_token: string
): Promise<{ success: boolean }> => {
  const myHeaders = new Headers();
  myHeaders.append('credaccess-access-token', access_token);
  myHeaders.append('credaccess-secret-key', process.env.CRED_SECRET);
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    first_name,
    last_name,
    email,
  });

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow',
    body: raw,
  };

  const res = await fetch('https://credaccess.web.app/profile', requestOptions)
    .then((response) => response.json())
    .catch((error) => console.log('error', error));
  return res;
};

export default async function createUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { first_name, last_name, email, sol_addr, phone } = req.body;
  await applySession(req, res, {
    password: process.env.SESSION_PASSWORD,
    cookieName: 'id',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  });
  //@ts-ignore
  const access_token = req.session.get('user').access_token;
  const createUserResp = await createUserProfile(
    first_name,
    last_name,
    email,
    access_token
  );
  //@ts-ignore
  var user = { ...req.session.get('user') };
  if (createUserResp.success) {
    user = await getUserProfile({ access_token });
  }
  const addSolAddrResp = await addSolAddr({ phone, sol_addr });
  if (!addSolAddrResp.error) {
    //@ts-ignore
    req.session.set('user', {
      //@ts-ignore
      ...user,
      access_token,
      sol_addr,
    });
    //@ts-ignore
    await req.session.save();
  }
  res.json(user);
}
