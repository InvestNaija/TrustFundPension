export interface ResetPasswordDTO {
  newPassword: string;
  key: string;
}

export interface ResetPasswordResponseDO {
  data: object;
  message: string;
  full_name: string;
  home_page: string;
  msg: string;
}
