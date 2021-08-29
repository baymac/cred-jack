import { NextApiRequest, NextApiResponse } from 'next';
import { applySession } from 'next-iron-session';

export interface IVerifyOtpResponse {
  access_token: string;
  existing_user: boolean;
}

const verifyOtp = async ({ otp, token }): Promise<IVerifyOtpResponse> => {
  const myHeaders = new Headers();
  myHeaders.append('credaccess-secret-key', '6bb90d09c8ea279ffc87b364944b5ae0');
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    otp,
    token,
  });

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  const res = await fetch(
    'https://credaccess.web.app/auth/verifyOtp',
    requestOptions
  )
    .then((response) => response.json())
    .catch((error) => console.log('error', error));
  return res;
};

interface IUserResponse {
  last_name: string;
  phone: string;
  first_name: string;
  email: string;
  coins: number;
  trust_score: number;
  existing_user: boolean;
}

const getUserProfile = async ({ access_token }): Promise<IUserResponse> => {
  const myHeaders = new Headers();
  myHeaders.append('credaccess-access-token', access_token);
  myHeaders.append('credaccess-secret-key', '6bb90d09c8ea279ffc87b364944b5ae0');

  const requestOptions: RequestInit = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  const res = await fetch('https://credaccess.web.app/profile', requestOptions)
    .then((response) => response.json())
    .catch((error) => console.log('error', error));
  return res;
};

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  const { otp, token } = req.body;
  const result = await verifyOtp({ otp, token });
  const access_token = result.access_token;
  const user = await getUserProfile({ access_token });
  await applySession(req, res, {
    password: process.env.SESSION_PASSWORD,
    cookieName: 'id',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  });
  res.setHeader(
    'set-cookie',
    `at=${access_token}; Secure=${
      process.env.NODE_ENV === 'production'
    }; Path='/'; SameSite=Lax; Max-Age=${15 * 24 * 3600}`
  );
  //@ts-ignore
  req.session.set('user', { ...user, isLoggedIn: true, access_token });
  //@ts-ignore
  await req.session.save();
  res.json(user);
}
