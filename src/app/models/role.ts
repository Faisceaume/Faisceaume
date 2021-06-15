export class Role {
  roleid: string;
  type: ROLE_TYPES_EN;
}

export enum ROLE_TYPES_EN {
  ADMIN = 'admin',
  DEV = 'dev',
  CLIENT = 'client',
  ANONYM = 'anonym'
};

export enum ROLE_TYPES_FR {
  ADMIN = 'Administrateur',
  DEV = 'Développeur',
  CLIENT = 'Client',
  ANONYM = 'Anonyme'
};