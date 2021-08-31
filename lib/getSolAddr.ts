import firebase from '../firebase/clientApp';

export interface IGetSolAddrResponse {
  phone: string;
  sol_addr: string;
}

export default function getSolAddr(
  phone: string
): Promise<IGetSolAddrResponse | null> {
  const db = firebase.firestore();
  return db
    .collection('links')
    .doc(phone)
    .get()
    .then((querySnapshot) => {
      return {
        phone: querySnapshot.id,
        ...querySnapshot.data(),
      } as IGetSolAddrResponse;
    });
}
