import { RoleModel } from './../../../../../models/RoleModel';
 
import { Component, Inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoleService } from 'src/app/services/role.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-role-add',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule, CommonModule,MatDialogModule],
  templateUrl: './role-add.component.html',
  styleUrl: './role-add.component.css'
})
export class RoleAddComponent {
  submitted = false;
  roleModel: RoleModel = {
    name: '',
    slug: '123',
    id: ''
  };
  roleForm = new FormGroup({
    name: new FormControl(this.roleModel.name, [Validators.required]),
    slug: new FormControl(this.roleModel.slug, [Validators.required]),
  });

  constructor(
    private _roleService: RoleService,
    public dialogRef: MatDialogRef<RoleAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.id) {
      this._roleService.getbyid(this.data.id).subscribe((res) => {
        this.roleModel.name = res.roleName;
        this.roleModel.id = res.id;
        this.roleForm.patchValue(this.roleModel);
      });
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.roleModel.id === null || this.roleModel.id === '') {
      this._roleService.AddRole(this.roleForm.value as RoleModel).subscribe((res: any) => {
        this.dialogRef.close(true);
      });
    } else {
      this._roleService.Update(this.roleForm.value as RoleModel).subscribe((res: any) => {
        this.dialogRef.close(true);
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
