import { NextApiRequest, NextApiResponse } from 'next';
import { applySession } from 'next-iron-session';

export interface ISpendCoinResponse {
  success: boolean;
  coins_remaining: number;
}

const sendCoin = async ({
  access_token,
  coins,
}): Promise<ISpendCoinResponse> => {
  const myHeaders = new Headers();
  myHeaders.append('credaccess-access-token', access_token);
  myHeaders.append('credaccess-secret-key', process.env.CRED_SECRET);
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    coins: coins,
  });

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  const res = await fetch(
    'https://credaccess.web.app/profile/coins/burn',
    requestOptions
  )
    .then((response) => response.json())
    .catch((error) => console.log('error', error));
  return res;
};

export default async function spendCoin(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { coins } = JSON.parse(req.body);
  await applySession(req, res, {
    password: process.env.SESSION_PASSWORD,
    cookieName: 'id',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  });

  // @ts-ignore
  const access_token = req.cookies.at;
  const result = await sendCoin({ access_token, coins });

  //@ts-ignore
  const user = req.session.get('user');
  //@ts-ignore
  req.session.set('user', {
    ...user,
    coins: result.coins_remaining,
  });
  //@ts-ignore
  await req.session.save();
  res.status(200).json({
    ...user,
    coins: result.coins_remaining,
  });
}
