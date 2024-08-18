

export class UserModel {
    id: any;
    username: string = "";
    passwordHash: string = "";
    fullname: string = "";
    phone: number | undefined = 0;
    email: string = "";
    address: string = "";
    departmentId: number = 0;
    managerId: number = 0;
    roleIds: any;
    [key: string]: any;


}