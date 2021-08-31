import firebase from '../firebase/clientApp';
import { IGenericAPIResponse } from './utils';

export interface IAddSolAddrRequest {
  phone: string;
  sol_addr: string;
}

export interface IAddSolAddrResponse extends IGenericAPIResponse {}

export default async function getSolAddr({
  phone,
  sol_addr,
}: IAddSolAddrRequest): Promise<IAddSolAddrResponse> {
  const db = firebase.firestore();
  try {
    // Add subscriber and then send verification email
    const result = await db
      .collection('links')
      .doc(phone)
      .set({
        sol_addr,
        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
        updatedAt: firebase.firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        return {
          error: false,
          message: 'Added sol addr',
        };
      })
      .catch((error) => {
        return {
          error: true,
          message: 'Sol Addr could not be added. ' + error.message,
        };
      });
    return result;
  } catch (error) {
    return {
      error: true,
      message: 'Some error occurred: ' + error.message,
    };
  }
}
