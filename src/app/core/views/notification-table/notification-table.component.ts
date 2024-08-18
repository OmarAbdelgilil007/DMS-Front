import { NotificationsService } from './../../../services/Notifications.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from 'src/app/environments/environment.development';
import { NodeService } from 'src/app/services/node.service';

@Component({
  selector: 'app-notification-table',
  standalone: true,
  imports: [MatFormFieldModule,MatInputModule,MatSort,MatPaginator,MatTableModule,MatButtonModule,MatIconModule,MatMenuModule,TranslateModule,CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './notification-table.component.html',
  styleUrl: './notification-table.component.scss'
})
export class NotificationTableComponent implements OnInit {
  filteredModel: any[] = [];
  page: number = 1;
  totalCount: number = 0;
  pageSize: number = environment.PageSize;
  dataSource: any;
  treeNodes: any;
  notificationCount:any

  constructor(private _service: NotificationsService, private _nodeService: NodeService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this._service.GetNotification().subscribe(
      (notifications: any) => {
        this.dataSource = notifications;
        this.loadTreeNodes();
        this.applyStoredNotificationStatus(); // Apply stored read/unread status
      },
      (error) => {
        console.error('Error loading notifications:', error);
      }
    );
  }

  loadTreeNodes(): void {
    this._service.GetAllNode().subscribe(
      (response: any) => {
        if (response && response.items && Array.isArray(response.items)) {
          this.treeNodes = response.items;
          this.updateNotificationNodeNames();
        } else {
          console.error('Invalid response format for tree nodes:', response);
        }
      },
      (error) => {
        console.error('Error loading tree nodes:', error);
      }
    );
  }

  updateNotificationNodeNames(): void {
    this.dataSource.forEach((notification: any) => {
      const matchedNode = this.treeNodes.find((node: any) => node.id === notification.nodeId);
      if (matchedNode) {
        notification.nodeName = matchedNode.name;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
  }

  markAsRead(id: number): void {
    this._service.MarkAsRead(id).subscribe(() => {
      const notification = this.dataSource.find((notif: any) => notif.id === id);
      if (notification) {
        notification.read = true;
        this.updateNotificationLocalStorage(id, true);
        
      }
    });
  }

  markAsUnread(id: number): void {
    this._service.MarkAsUnRead(id).subscribe(() => {
      const notification = this.dataSource.find((notif: any) => notif.id === id);
      if (notification) {
        notification.read = false;
        this.updateNotificationLocalStorage(id, false);
      }
    });
  }

  updateNotificationLocalStorage(id: number, readStatus: boolean): void {
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '{}');
    storedNotifications[id] = readStatus;
    localStorage.setItem('notifications', JSON.stringify(storedNotifications));
  }

  applyStoredNotificationStatus(): void {
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '{}');
    this.dataSource.forEach((notification: any) => {
      if (storedNotifications.hasOwnProperty(notification.id)) {
        notification.read = storedNotifications[notification.id];
      }
    });
  }
 
}