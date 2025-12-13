export interface User {
  id: string;
  username: string;
  passwordHash: string;
  email: string;
}

export interface LocalCredentials {
  username: string;
  password: string;
}
