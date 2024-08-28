interface UserInfo {
  id: number;

  username: string;

  email: string;

  isAdmin: boolean;

  createTime: number;

  roles: string[];

  permissions: string[];
}

interface UserLoginRes {
  userInfo: UserInfo;
  accessToken: string;
  refreshToken: string;
}
