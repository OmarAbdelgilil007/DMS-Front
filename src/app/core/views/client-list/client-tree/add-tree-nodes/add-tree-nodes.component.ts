import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NodeService } from 'src/app/services/node.service';

@Component({
  selector: 'app-add-tree-nodes',
  standalone: true,
  imports: [MatDialogModule, CommonModule, ReactiveFormsModule, FormsModule,TranslateModule],
  templateUrl: './add-tree-nodes.component.html',
  styleUrl: './add-tree-nodes.component.scss',
})
export class AddTreeNodesComponent {
  Node: any;
  NodeChilds: number = 0;
  id: number = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      id: '';
      AddText: '';
    },
    public treesevice: NodeService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.id = Number(this.data.id);
    this.treesevice.GetById(this.id).subscribe((data: any) => {
      this.Node = data;
    });
  }
  changeNodeChilds() {
    if (this.NodeChilds < 0) {
      this.NodeChilds = 0;
    }
  }
  AddNodes() {
    this.treesevice
      .AddNodes(this.Node, this.NodeChilds)
      .subscribe((data: any) => {});
  }
}
