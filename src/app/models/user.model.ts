export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role?: Role;
}

export enum Role {
  superUser = 'superUser',
  admin = 'admin',
  customer = 'customer',
}
