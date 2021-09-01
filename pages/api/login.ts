import { NextApiRequest, NextApiResponse } from 'next';
import { applySession } from 'next-iron-session';
import getSolAddr from '../../lib/getSolAddr';

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

interface INonExistingUser {
  existing_user: boolean;
  phone: number;
}

export const getUserProfile = async ({
  access_token,
}): Promise<IUserResponse | INonExistingUser> => {
  const myHeaders = new Headers();
  myHeaders.append('credaccess-access-token', access_token);
  myHeaders.append('credaccess-secret-key', process.env.CRED_SECRET);

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
  const { otp, token, phone } =
    typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const result = await verifyOtp({ otp, token });
  const access_token = result.access_token;
  const user = await getUserProfile({ access_token });
  var sol_addr = undefined;
  if (user.existing_user) {
    const getSolAddrResp = await getSolAddr(phone);
    sol_addr = getSolAddrResp.sol_addr;
  }
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
  req.session.set('user', {
    ...user,
    isLoggedIn: true,
    access_token,
    sol_addr: sol_addr,
  });
  //@ts-ignore
  await req.session.save();
  res.json(user);
}
