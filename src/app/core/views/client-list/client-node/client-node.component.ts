import { adminGuard } from './../../../../gaurds/admin.guard';
import { IAddClient } from './../../../../models/IAddClient';
import { UserModelLookup } from './../../../../models/userLookUp';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Iclient } from 'src/app/models/Iclient';
import { UserModel } from 'src/app/models/UserModel';
import { ClientService } from 'src/app/services/client.service';
import { UserManagementService } from 'src/app/services/user-management.service';

@Component({
  selector: 'app-client-node',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,
    TranslateModule,
  ],
  templateUrl: './client-node.component.html',
  styleUrl: './client-node.component.scss',
})
export class ClientNodeComponent implements OnInit {
  userRole = localStorage.getItem('userRole');
  submitted = false;
  payload: any;
  clientModel: Iclient = {
    id: this.data.id,
    name: '',
    description: '',
    height: 0,
    lastStateId: 1,
    parentId: 0,
    adminId: '',
    officerId: 0,
    qC1Id: 0,
    qC2Id: 0,
    endUserId: 0,
    rootId: 0,
    startDate: '',
    endDate: '',
  };
  AddClient: IAddClient = {
    name: '',
    description: '',
    height: 0,
    lastStateId: 1,
  };

  admins: UserModelLookup[] = [];
  officers: UserModelLookup[] = [];
  qc1s: UserModelLookup[] = [];
  qc2s: UserModelLookup[] = [];
  endUsers: UserModelLookup[] = [];
  headerFlag: boolean = false;
  nodeForm = new FormGroup({
    id: new FormControl(this.clientModel.id, [Validators.required]),
    name: new FormControl({
      value: this.clientModel.name,
      disabled: this.userRole === 'Officer',
    }),
    description: new FormControl({
      value: this.clientModel.description,
      disabled: this.userRole === 'Officer',
    }),
    adminId: new FormControl(this.clientModel.adminId ?? ''),
    officerId: new FormControl({
      value: this.clientModel.officerId,
      disabled: this.userRole === 'Officer',
    }),
    qC1Id: new FormControl({
      value: this.clientModel.qC1Id,
      disabled: this.userRole === 'Officer',
    }),
    qC2Id: new FormControl({
      value: this.clientModel.qC2Id,
      disabled: this.userRole === 'Officer',
    }),
    endUserId: new FormControl(this.clientModel.endUserId ?? ''),
    startDate: new FormControl({
      value: this.clientModel.startDate,
      disabled: this.userRole === 'Officer',
    }),
    endDate: new FormControl({
      value: this.clientModel.endDate,
      disabled: this.userRole === 'Officer',
    }),
  });

  constructor(
    private _nodeService: ClientService,
    private _userService: UserManagementService,
    public dialogRef: MatDialogRef<ClientNodeComponent>,
    private toastr: ToastrService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    if (this.data && this.data.id) {
      this.loadClientData(this.data.id);
      this.nodeForm.get('adminId')?.disable();
    }
    this.headerFlag = this.clientModel.id ? true : false;
  }

  loadUsers() {
    this._userService.GetUserList(1, '').subscribe(
      (response: any) => {
        if (response && response.items && Array.isArray(response.items)) {
          const users = response.items as UserModelLookup[];
          this.admins = users.filter((user) =>
            user.userRoles.some((role) => role.roleId === 1)
          );
          this.qc1s = users.filter((user) =>
            user.userRoles.some((role) => role.roleId === 2)
          );
          this.qc2s = users.filter((user) =>
            user.userRoles.some((role) => role.roleId === 3)
          );
          this.officers = users.filter((user) =>
            user.userRoles.some((role) => role.roleId === 4)
          );
          this.endUsers = users.filter((user) =>
            user.userRoles.some((role) => role.roleId === 5)
          );
        }
      },
      (error) => {}
    );
  }

  loadClientData(id: number) {
    this._nodeService.GetNodeById(id).subscribe(
      (response: any) => {
        if (response) {
          this.clientModel = {
            ...response,
            adminId: response.adminId ?? null,
            officerId: response.officerId ?? null,
            qC1Id: response.qC1Id ?? null,
            qC2Id: response.qC2Id ?? null,
            endUserId: response.endUserId ?? null,
            startDate: response.startDate
              ? new Date(response.startDate).toISOString().substring(0, 10)
              : null,
            endDate: response.endDate
              ? new Date(response.endDate).toISOString().substring(0, 10)
              : null,
          };

          this.nodeForm.patchValue({
            name: this.clientModel.name,
            description: this.clientModel.description,
            adminId: this.clientModel.adminId,
            officerId: this.clientModel.officerId,
            qC1Id: this.clientModel.qC1Id,
            qC2Id: this.clientModel.qC2Id,
            endUserId: this.clientModel.endUserId,
            startDate: this.clientModel.startDate,
            endDate: this.clientModel.endDate,
          });
        }
      },
      (error) => {}
    );
  }

  onSubmit() {
    this.submitted = true;
    const formValue = this.nodeForm.value;

    this.payload =
      this.userRole === 'Officer'
        ? {
            ...formValue,
            officerId: this.clientModel.officerId || null,
            qC1Id: this.clientModel.qC1Id || null,
            qC2Id: this.clientModel.qC2Id || null,
            endUserId: formValue.endUserId || null,
            name: this.clientModel.name || '',
            description: this.clientModel.description || '',
            id: this.clientModel.id || undefined,
            adminId: this.clientModel.adminId || null,
            startDate: this.clientModel.startDate || null,
            endDate: this.clientModel.endDate || null,
          }
        : {
            ...formValue,
            officerId: formValue.officerId || null,
            qC1Id: formValue.qC1Id || null,
            qC2Id: formValue.qC2Id || null,
            endUserId: formValue.endUserId || null,
            name: formValue.name || '',
            description: formValue.description || '',
            id: this.clientModel.id || undefined,
            adminId: this.clientModel.adminId || null,
            startDate: formValue.startDate || null,
            endDate: formValue.endDate || null,
          };

    if (this.clientModel.id) {
      this.clientModel = {
        ...this.clientModel,
        ...this.payload,
      };

      this._nodeService.Update(this.clientModel).subscribe(
        (res: any) => {
          this.dialogRef.close(true);
          this.toastr.success(this.translate.instant('client.updateSuccess'), this.translate.instant('success'), {
            closeButton: true,
          });
        },
        (error) => {
          this.toastr.error(this.translate.instant('client.updateError'), this.translate.instant('error'), {
            closeButton: true,
          });
        }
      );
    } else {
      const addClientPayload: IAddClient = {
        name: this.payload.name!,
        description: this.payload.description!,
        height: this.clientModel.height,
        lastStateId: this.clientModel.lastStateId,
      };

      this._nodeService.AddNode(addClientPayload).subscribe(
        (res: any) => {
          this.dialogRef.close(true);
          this.toastr.success(this.translate.instant('client.addSuccess'), this.translate.instant('success'), {
            closeButton: true,
          });
        },
        (error) => {
          this.toastr.error(this.translate.instant('client.addError'), this.translate.instant('error'), {
            closeButton: true,
          });
        }
      );
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
