export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role?: Role;
  idToken?: string;
}

export enum Role {
  superUser = 'superUser',
  admin = 'admin',
  user = 'user',
}
