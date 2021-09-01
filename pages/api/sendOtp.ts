import { NextApiRequest, NextApiResponse } from 'next';

export interface IGenerateOtpResponse {
  token: string;
}

const generateOtp = async ({ phone }): Promise<IGenerateOtpResponse> => {
  const myHeaders = new Headers();
  myHeaders.append('credaccess-secret-key', process.env.CRED_SECRET);
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    phone,
  });

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  const res = await fetch(
    'https://credaccess.web.app/auth/generateOtp',
    requestOptions
  )
    .then((response) => response.json())
    .catch((error) => console.log('error', error));
  return res;
};

export default async function resend(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { phone } = JSON.parse(req.body);
  const result = await generateOtp({ phone });
  res.status(200).json({ error: false, token: result.token });
}
