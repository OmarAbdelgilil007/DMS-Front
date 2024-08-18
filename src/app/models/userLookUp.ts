export interface UserRoleLookup {
    userId: number;
    roleId: number;
  }
  
  export interface UserModelLookup {
    id: any;
    fullname: string;
    userRoles: UserRoleLookup[];
  }