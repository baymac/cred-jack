import { NextApiRequest, NextApiResponse } from 'next';

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

export default async function verify(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { otp, token } = JSON.parse(req.body);
  const result = await verifyOtp({ otp, token });
  res.status(200).json({
    error: false,
    access_token: result.access_token,
    existing_user: result.existing_user,
  });
}
