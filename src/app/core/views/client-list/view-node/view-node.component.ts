import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Iclient } from 'src/app/models/Iclient';
import { UserModelLookup } from 'src/app/models/userLookUp';
import { ClientService } from 'src/app/services/client.service';
import { UserManagementService } from 'src/app/services/user-management.service';

@Component({
  selector: 'app-view-node',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './view-node.component.html',
  styleUrl: './view-node.component.scss'
})
export class ViewNodeComponent implements OnInit {
  clientModel!: Iclient;
  qc1Name: string = '';
  qc2Name: string = '';
  officerName: string = '';
  endUserName: string = '';

  constructor(
    public dialogRef: MatDialogRef<ViewNodeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _nodeService: ClientService,
    private _userService: UserManagementService
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.id) {
      this.loadClientData(this.data.id);
    }
  }

  loadClientData(id: number) {
    this._nodeService.GetNodeById(id).subscribe(
      (response: any) => {
        this.clientModel = response;
        this.loadUserNames();
      },
      (error) => {
      }
    );
  }

  loadUserNames() {
    const userIds = [
      this.clientModel.qC1Id,
      this.clientModel.qC2Id,
      this.clientModel.officerId,
      this.clientModel.endUserId
    ];
  
    // this._userService.GetUserList(1, '').subscribe(
    //   (response: any) => {
    //     if (response && response.items && Array.isArray(response.items)) {
    //       const users = response.items as UserModelLookup[];
    //       userIds.forEach(id => {
    //         const user = users.find(u => u.id === id);
    //         if (user) {
    //           if (id === this.clientModel.qC1Id) {
    //             this.qc1Name = user.fullname;
    //           } else if (id === this.clientModel.qC2Id) {
    //             this.qc2Name = user.fullname;
    //           } else if (id === this.clientModel.officerId) {
    //             this.officerName = user.fullname;
    //           } else if (id === this.clientModel.endUserId) {
    //             this.endUserName = user.fullname;
    //           }
    //         }
    //       });
    //     }
    //   },
    //   (error) => {
    //     // Handle error
    //   }
    // );
    this._userService.getUserById(this.data.qC1Id).subscribe((response: any) => {
      this.qc1Name = response.fullname
      
    },
    (error) => {
    }
  );
  this._userService.getUserById(this.data.officerId).subscribe((response: any) => {
    this.officerName = response.fullname
    
  },
  (error) => {
  }
);
this._userService.getUserById(this.data.qC2Id).subscribe((response: any) => {
  this.qc2Name = response.fullname
  
},
(error) => {
}
);
this._userService.getUserById(this.data.endUserId).subscribe((response: any) => {
  this.endUserName = response.fullname
  
},
(error) => {
}
);
  }

  

  onClose(): void {
    this.dialogRef.close();
  }
}