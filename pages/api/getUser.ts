import { NextApiRequest, NextApiResponse } from 'next';

export interface IUserResponse {
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

export default async function getUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // get it from user cookie
  const access_token = '';
  const result = await getUserProfile({ access_token });
  res.status(200).json({
    error: false,
    user_data: result,
  });
}
