import { HelperService } from './../../services/helper.service';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';

import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  standalone: true,
  imports: [NgxSpinnerModule,MatIconModule,
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    RouterLink,
    IconDirective,
    NgScrollbar,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    DefaultHeaderComponent,
    ShadowOnScrollDirective,
    ContainerComponent,
    RouterOutlet,
    DefaultFooterComponent,
    CommonModule,
    TranslateModule
  ],
  
})
export class DefaultLayoutComponent {
  userRole = localStorage.getItem('userRole');
  activeNavItem: string | null = null;
  userManagementOpen: boolean = false;
  clientsManagementOpen: boolean = false;
  logsManagementOpen: boolean = false;

  userManagementItems = [
    { name: 'Users', label: 'Users', icon: 'person', link: '/User-management' },
    { name: 'Roles', label: 'Roles', icon: 'manage_accounts', link: '/Roles' },
    { name: 'Departments', label: 'Departments', icon: 'business', link: '/Departments' }
  ];

  logsManagementItems = [
    { name: 'LoginLogs', label: 'Login Logs', icon: 'login', link: '/login-logs' },
    { name: 'AuditLogs', label: 'Audit Logs', icon: 'fact_check', link: '/audit-logs' }
  ];

  clientsManagementItems = [
    { name: 'Clients', label: 'Clients', icon: 'groups', link: '/clients' },
    { name: 'Tasks', label: 'My Tasks', icon: 'task', link: '/tasks' }
  ];
  lang: any= localStorage.getItem('lang');
  sidebarPlacement: string | undefined;
  constructor(private helperService: HelperService, private _TranslateService: TranslateService, private spinner: NgxSpinnerService) {
    _TranslateService.onLangChange.subscribe((event:LangChangeEvent)=>{
      this.lang=event.lang
    });
  }

  private updateDirection() {
    this.lang = localStorage.getItem('lang') ; 
  }
  

  toggleManagement(section: string) {
    if (section === 'Users') {
      this.userManagementOpen = !this.userManagementOpen;
      if (this.userManagementOpen) {
        this.clientsManagementOpen = false;
        this.logsManagementOpen = false;
      }
    } else if (section === 'Clients') {
      this.clientsManagementOpen = !this.clientsManagementOpen;
      if (this.clientsManagementOpen) {
        this.userManagementOpen = false;
        this.logsManagementOpen = false;
      }
    } else if (section === 'Logs') {
      this.logsManagementOpen = !this.logsManagementOpen;
      if (this.logsManagementOpen) {
        this.userManagementOpen = false;
        this.clientsManagementOpen = false;
      }
    }
  }

  setActiveNavItem(item: string) {
    this.activeNavItem = item;
  }
  ngOnInit(): void {
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
    
  }
}

