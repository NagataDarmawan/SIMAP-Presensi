export interface Admin {
  id: number;
  username: string;
  nama: string;
  role: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}