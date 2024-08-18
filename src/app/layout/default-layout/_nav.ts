import { INavData } from '@coreui/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';


export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    
  },
  {
    name: 'Users Management',
    url: '/core/views',
    iconComponent: { name: 'cil-notes' },
    children: [
      {
        name: 'Departments',
        url: 'Departments',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Roles',
        url: 'Roles',
        icon: 'nav-icon-bullet'
      },
      
      {
        name: 'Users',
        url: 'User-management',
        icon: 'nav-icon-bullet'
      },
    ]
  },
  {
    name: 'Clients DMS',
    url: '/core/views',
    iconComponent: { name: 'cil-notes' },
    children: [
      {
        name: 'Clients',
        url: 'clients',
        icon: 'nav-icon-bullet'
      },
      
      

      
    ]
  },


  
  
];

export class usersRoles{
  constructor(private _AuthServiceService:AuthService){}


  isAdmin():boolean{
    console.log(this._AuthServiceService.role)
   return this._AuthServiceService.userRole == 'Admin' ? true:false;
  }
}
function isAdmin() {
  throw new Error('Function not implemented.');
}

