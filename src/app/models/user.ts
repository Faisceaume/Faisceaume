export class User {
  uid: string;
  roleid: string;
  email: string;
  timestamp: number;
}

export class AuthUser extends User {
  roletypefrench: string;
  roletype: string;
}