export interface User {
  userId: string;
  email: string;
  displayName: string;
  photoURL: string;
  role?: Role;
  idToken?: string;
}

export enum Role {
  admin = 'admin',
  user = 'user',
}
