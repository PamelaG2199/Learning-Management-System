export interface User {
  id?: string;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'lead';
}
