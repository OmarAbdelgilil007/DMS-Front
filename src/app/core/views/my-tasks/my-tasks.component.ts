import { MyTasksService } from './../../../services/My-tasks.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
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
import { ViewDocsNodeComponent } from '../client-list/view-docs-node/view-docs-node.component';
import { ConfirmationPopupComponent } from '../client-list/client-tree/confirmation-popup/confirmation-popup.component';
import { AddDocumentsComponent } from '../client-list/add-documents/add-documents.component';
import { UserManagementService } from 'src/app/services/user-management.service';
import { RouterLink } from '@angular/router';
import { ClientNodeComponent } from '../client-list/client-node/client-node.component';
import { AddTreeNodesComponent } from '../client-list/client-tree/add-tree-nodes/add-tree-nodes.component';
import { firstValueFrom } from 'rxjs';
import { ICreateNode } from 'src/app/models/ICreateNode';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSort,
    MatPaginator,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    TranslateModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './my-tasks.component.html',
  styleUrl: './my-tasks.component.scss',
})
export class MyTasksComponent implements OnInit {
  filteredModel: any[] = [];
  page: number = 1;
  totalCount: number = 0;
  pageSize: number = environment.PageSize;
  dataSource = new MatTableDataSource<any>();
  treeNodes: any;
  SelectedNode: any;
  toggleduplicate: boolean = true;
  toggleActions: boolean = false;
  toggleReject: boolean = true;
  toggleDocs: boolean = false;
  toggleExport: boolean = false;
  toggleAdminDocs: boolean = true;
  toggleAdmiexportnDocs: boolean = false;
  togglePublichednodes: boolean = true;
  Readonly = false;
  showContextMenu = false;
  toggleEditEndUser = false;
  currentUserId: number = 0;
  DublicatedNode: ICreateNode = {
    name: '',
    description: '',
    parentId: 0,
    height: 0,
    lastStateId: 0,
    adminId: 0,
    officerId: 0,
    qC1Id: 0,
    qC2Id: 0,
    endUserId: 0,
    rootId: 0,
  };
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  constructor(
    private _service: MyTasksService,
    public treesevice: NodeService,
    private dialogRef: MatDialog,
    private ClientService: ClientService,
    private UserService: UserManagementService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.UserService.getCurrentUser().subscribe((data: any) => {
      this.currentUserId = data;
    });
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  loadData(): void {
    this._service.GetTasks().subscribe((res: any) => {
      this.dataSource.data = res;
      this.totalCount = res.totalCount;
      if (this.paginator) {
        this.paginator.length = this.totalCount;
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

  onPageChange(event: any): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  downloadFile(NodeId: any) {
    this.treesevice.ExportDocs(NodeId).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'downloadedFile';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Download error:', error);
      }
    );
  }

  openViewDialog(NodeId: any): void {
    const dialogRef = this.dialogRef.open(ViewDocsNodeComponent, {
      width: '400px',
      data: Number(NodeId),
    });
  }

  OpenConfirmation(processName: string, id: number, type: string) {
    this.showContextMenu = false;
    const dialog = this.dialogRef.open(ConfirmationPopupComponent, {
      data: {
        id: id,
        processName: processName,
        NodeName: type,
      },
    });
    dialog.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  openAddDocumentsDialog(nodeId: any) {
    const dialogRef = this.dialogRef.open(AddDocumentsComponent, {
      data: { nodeId },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
      this.showContextMenu = false;
    });
  }

  onRightClick(NodeId: number): void {
    if (localStorage.getItem('userRole') == 'Admin') {
      this.toggleAdmiexportnDocs = true;
      this.treesevice.GetById(NodeId).subscribe((data: any) => {
        this.SelectedNode = data;
        if (data.height == 0) {
          this.toggleduplicate = false;
        } else {
          this.toggleduplicate = true;
        }
        if (
          this.SelectedNode.lastStateId == 1 ||
          this.SelectedNode.lastStateId == 42
        ) {
          if (data.height == 0 || data.height == 1) {
            this.toggleAdminDocs = false;
          } else {
            this.toggleAdminDocs = true;
          }
          this.togglePublichednodes = true;
          this.showContextMenu = true;
        } else {
          this.togglePublichednodes = false;
          this.showContextMenu = true;
          this.toggleduplicate = false;
          this.toggleAdminDocs = false;
        }
      });
    } else if (localStorage.getItem('userRole') != 'EndUser') {
      this.treesevice.GetById(NodeId).subscribe((data: any) => {
        if (data) {
        }

        if (
          data.lastStateId == 1 ||
          data.lastStateId == 51 ||
          data.lastStateId == 42
        ) {
          if (this.Readonly == true) {
            this.Readonly = false;
          } else {
            this.toggleActions = false;
            this.showContextMenu = false;
            this.toggleDocs = false;
            this.Readonly = true;
          }
        } else if (localStorage.getItem('userRole') == 'Officer') {
          if (
            data.lastStateId == 60 ||
            data.lastStateId == 71 ||
            data.lastStateId == 81 ||
            data.lastStateId == 92
          )
            this.toggleExport = true;
          this.toggleReject = false;
          if (data.lastStateId == 41) {
            this.toggleEditEndUser = true;
          } else {
            this.toggleEditEndUser = false;
          }
          this.showContextMenu = false;
          this.toggleActions = true;
          this.Readonly = false;
        } else {
          if (
            data.lastStateId == 60 ||
            data.lastStateId == 71 ||
            data.lastStateId == 81 ||
            data.lastStateId == 92
          )
            this.toggleExport = true;
          this.showContextMenu = false;
          this.toggleActions = true;
          this.Readonly = false;
        }
      });
    } else {
      this.treesevice.GetById(NodeId).subscribe((data: any) => {
        if (data.currentUserId == this.currentUserId) {
          if (
            data.lastStateId == 1 ||
            data.lastStateId == 52 ||
            data.lastStateId == 42
          ) {
            this.toggleActions = false;
            this.showContextMenu = false;
            this.toggleDocs = false;
            this.Readonly = true;
          } else {
            this.toggleDocs = true;

            this.showContextMenu = false;
            this.toggleActions = false;
          }
        }
      });
    }
  }

  edit(id: number) {
    var text = '';
    this.treesevice.GetById(Number(id)).subscribe((data: any) => {
      if (data.height == 0) {
        text = 'Client';
      } else if (data.height == 1) {
        text = 'Project';
      } else if (data.height == 2) {
        text = 'Container';
      } else if (data.height == 3) {
        text = 'Domain';
      } else {
        text = 'SubDomain / Item';
      }
      const dialogRef = this.dialogRef.open(ClientNodeComponent, {
        data: { id: Number(id), Text: text },
        width: '400px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.showContextMenu = false;
          this.ngOnInit();
        }
      });
    });
  }
  AddPopup(id: number, text: string) {
    const dialogRef = this.dialogRef.open(AddTreeNodesComponent, {
      data: { id: id, AddText: this.getText(text) },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
      this.showContextMenu = false;
    });
  }
  getText(text: string) {
    if (text == 'Container') {
      return 'Domains';
    } else {
      return 'Items';
    }
  }
  async Duplicate(id: number) {
    const data: any = await firstValueFrom(this.treesevice.GetById(id));
    const now = new Date();
    this.DublicatedNode = {
      name: data.name + '_' + now.getMinutes() + now.getSeconds(),
      description: data.description,
      parentId: data.parentId,
      height: data.height,
      lastStateId: data.lastStateId,
      adminId: data.adminId ? data.adminId : null,
      officerId: data.officerId ? data.officerId : null,
      qC1Id: data.qC1Id ? data.qC1Id : null,
      qC2Id: data.qC2Id ? data.qC2Id : null,
      endUserId: data.endUserId ? data.endUserId : null,
      rootId: data.rootId ? data.rootId : null,
    };

    // await this.GenerateRandomName(data.parentId);

    await firstValueFrom(this.ClientService.AddNode(this.DublicatedNode));

    this.showContextMenu = false;
    this.ngOnInit();
  }
}
