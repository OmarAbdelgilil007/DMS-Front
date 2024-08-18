import { NodesTrackingComponent } from './core/views/client-list/nodes-tracking/nodes-tracking.component';
import { adminGuard } from './gaurds/admin.guard';
import { AuditsLogsComponent } from './core/views/audits-logs/audits-logs.component';
import { LoginLogsComponent } from './core/views/login-logs/login-logs.component';
import { MyTasksComponent } from './core/views/my-tasks/my-tasks.component';
import { NotificationTableComponent } from './core/views/notification-table/notification-table.component';
import { authGuard } from './gaurds/auth.guard';
import { ClientTreeComponent } from './core/views/client-list/client-tree/client-tree.component';
import { ClientListComponent } from './core/views/client-list/client-list.component';
import { RegisterUserComponent } from './core/views/userManagement/register-user/register-user.component';
import { DepartmentAddComponent } from './core/views/Departments/Add/department-add/department-add.component';
import { RoleAddComponent } from './core/views/Roles/Add/role-add/role-add.component';
import { RoleListComponent } from './core/views/Roles/List/role-list/role-list.component';
import { DepartementListComponent } from './core/views/Departments/List/departement-list/departement-list.component';
import { UserListComponent } from './core/views/userManagement/user-list/user-list.component';
import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { ClientNodeComponent } from './core/views/client-list/client-node/client-node.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home',
    },
    children: [
      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./views/dashboard/routes').then((m) => m.routes),
      },
      {
        path: 'User-management',
        canActivate: [adminGuard],
        component: UserListComponent,
      },
      {
        path: 'tasks',
        canActivate: [authGuard],
        component: MyTasksComponent,
      },
      {
        path: 'login-logs',
        canActivate: [adminGuard],
        component: LoginLogsComponent,
      },
      {
        path: 'audit-logs',
        canActivate: [adminGuard],
        component: AuditsLogsComponent,
      },
      
      {
        path: 'Departments',
        canActivate: [adminGuard],
        component: DepartementListComponent,
      },
      {
        path: 'Roles',
        canActivate: [adminGuard],
        component: RoleListComponent,
      },
      {
        path: 'clients',
        canActivate: [authGuard],
        component: ClientListComponent,
      },
      {
        path: 'Add-node',
        canActivate: [authGuard],
        component: ClientNodeComponent,
      },
      { path: 'node-tracking/:id', component: NodesTrackingComponent },
      {
        path: 'client-tree/:id',
        canActivate: [authGuard],
        component: ClientTreeComponent,
      },
      {
        path: 'Notification-List',
        canActivate: [authGuard],
        component: NotificationTableComponent,
      },

    ],
  },

  {
    path: '404',
    loadComponent: () =>
      import('./views/pages/page404/page404.component').then(
        (m) => m.Page404Component
      ),
    data: {
      title: 'Page 404',
    },
  },
  {
    path: '500',
    loadComponent: () =>
      import('./views/pages/page500/page500.component').then(
        (m) => m.Page500Component
      ),
    data: {
      title: 'Page 500',
    },
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./core/views/login/login.component').then(
        (m) => m.LoginComponent
      ),
    data: {
      title: 'Login Page',
    },
  },

  { path: '**', redirectTo: 'dashboard' },
];
