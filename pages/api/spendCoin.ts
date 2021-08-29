import { NextApiRequest, NextApiResponse } from 'next';

export interface IVerifyOtpResponse {
  success: boolean;
  coins_remaining: number;
}

const verifyOtp = async ({
  access_token,
  coins,
}): Promise<IVerifyOtpResponse> => {
  const myHeaders = new Headers();
  myHeaders.append('credaccess-access-token', access_token);
  myHeaders.append('credaccess-secret-key', '6bb90d09c8ea279ffc87b364944b5ae0');
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    coins,
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

export default async function verify(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { coins } = req.body;
  // get it from user cookie
  const access_token = '';
  const result = await verifyOtp({ access_token, coins });
  res.status(200).json({
    error: result.success,
    coins_remaining: result.coins_remaining,
  });
}
