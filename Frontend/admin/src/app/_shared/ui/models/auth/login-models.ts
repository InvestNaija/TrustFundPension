export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponseDO {
  message: Message;
  exc:     string;
}

export interface Message {
  success_key: number;
  message:     string;
  token:       string;
  username:    string;
  email:       string;
}

