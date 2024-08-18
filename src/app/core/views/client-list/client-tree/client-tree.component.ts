import { ViewDocsNodeComponent } from './../view-docs-node/view-docs-node.component';
import { AddDocumentsComponent } from './../add-documents/add-documents.component';
import { filter } from 'rxjs/operators';
import { ClientService } from './../../../../services/client.service';
import { ICreateNode } from './../../../../models/ICreateNode';
import { ConfirmationPopupComponent } from './confirmation-popup/confirmation-popup.component';
import { AddTreeNodesComponent } from './add-tree-nodes/add-tree-nodes.component';
import { NodeService } from './../../../../services/node.service';
import { ITreeData } from './../../../../models/TreeData';
import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HCSankey from 'highcharts/modules/sankey';
import HCOrganization from 'highcharts/modules/organization';
import { ITreeNodes } from './../../../../models/TreeNodes';
import Exporting from 'highcharts/modules/exporting';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientNodeComponent } from '../client-node/client-node.component';
import { firstValueFrom } from 'rxjs';
import { UserManagementService } from 'src/app/services/user-management.service';
import { ConfirmNameComponent } from '../confirm-name/confirm-name.component';
import { ConfrimDeleteNodeComponent } from '../confrim-delete-node/confrim-delete-node.component';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

Exporting(Highcharts);
HCSankey(Highcharts);
HCOrganization(Highcharts);
@Component({
  selector: 'app-client-tree',
  standalone: true,
  imports: [
    SharedModule,
    FormsModule,
    CommonModule,
    HighchartsChartModule,
    MatDialogModule,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './client-tree.component.html',
  styleUrl: './client-tree.component.scss',
})
export class ClientTreeComponent implements OnInit {
  dataSource: any;
  value: number = 0;
  data: ITreeData[] = [];
  nodes: ITreeNodes[] = [];
  isDataLoaded: boolean = false;
  isNodesLoaded: boolean = false;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  highestheight: number = 0;
  AddText: string = '';
  SelectedNodeId: string = '';
  SelectedNode: any;
  finalTitle = 'Item';
  baseTitles = ['Client', 'Project', 'Container', 'Domain'];
  NodeDetails: any;
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
  toggleduplicate: boolean = true;
  toggleActions: boolean = false;
  toggleReject: boolean = true;
  toggleDocs: boolean = false;
  toggleExport: boolean = false;
  toggleAdminDocs: boolean = true;
  toggleAdmiexportnDocs: boolean = false;
  togglePublichednodes: boolean = true;
  toggleEditEndUser = false;
  Readonly = false;
  showCPMenu = true;
  constructor(
    public treesevice: NodeService,
    private dialogRef: MatDialog,
    private route: ActivatedRoute,
    private ClientService: ClientService,
    private UserService: UserManagementService,
    private toastr: ToastrService,
    private router: Router,
    private translate: TranslateService

  ) {}

  ngOnInit(): void {
    this.showContextMenu = false;
    this.toggleActions = false;
    this.toggleDocs = false;
    this.Readonly = false;
    this.showCPMenu = false;
    this.loadNodeData();
    // (this.chartOptions as any)._component = this;
    this.baseTitles = ['Client', 'Project', 'Container', 'Domain'];
    this.UserService.getCurrentUser().subscribe((data: any) => {
      this.currentUserId = data;
    });
    this.route.params.subscribe((params) => {
      this.value = params['id'];
    });
    if (localStorage.getItem('userRole') == 'Admin') {
      this.treesevice.GetTreeData(this.value).subscribe((data: any) => {
        this.data = data;
        if (this.data.length == 0) {
          this.data = [
            { from: this.value.toString(), to: this.value.toString() },
          ];
        }
        this.isDataLoaded = true;
        this.updateChart();
      });
      this.treesevice.GetTreeNodes(this.value).subscribe((data: any) => {
        this.nodes = data;
        this.highestheight = this.getHighestHeight();
        this.generateTitles(this.highestheight);
        this.SetNodeTitle(this.nodes);
        this.setNodeColor(this.nodes);
        this.isNodesLoaded = true;
        this.updateChart();
      });
    } else {
      this.treesevice.getTreeDataByRoles(this.value).subscribe((data: any) => {
        this.data = data;
        if (this.data.length == 0) {
          this.data = [
            { from: this.value.toString(), to: this.value.toString() },
          ];
        }
        this.isDataLoaded = true;
        this.updateChart();
      });
      this.treesevice.getTreeNodesByRoles(this.value).subscribe((data: any) => {
        this.nodes = data;
        this.highestheight = this.getHighestHeight();
        this.generateTitles(this.highestheight);
        this.SetNodeTitle(this.nodes);
        this.setNodeColor(this.nodes);
        this.isNodesLoaded = true;
        this.updateChart();
      });
    }
  }
  click() {}
  updateChart(): void {
    if (this.isDataLoaded && this.isNodesLoaded) {
      this.chartOptions = {
        title: {
          text: '',
        },
        chart: {
          height: 600,
          inverted: true,
        },
        series: [
          {
            type: 'organization',
            name: '',
            keys: ['parentid', 'id'],
            data: [...this.data],
            nodes: [...this.nodes],
            colorByPoint: false,
            dataLabels: {
              color: 'white',
            },
            borderColor: 'white',
            nodeWidth: 65,
            events: {
              click: (event: any) =>
                this.onRightClick(event, event.point.options.id),
            },
          },
        ],
        tooltip: {
          enabled: false,
        },
        exporting: {
          enabled: true,
        },
      };
    }
  }
  showContextMenu = false;
  contextMenuPosition = { x: 0, y: 0 };

  onRightClick(event: MouseEvent, NodeId: string): void {
    this.SelectedNodeId = NodeId;
    if (localStorage.getItem('userRole') == 'Admin') {
      this.toggleAdmiexportnDocs = true;
      this.SelectedNodeId = NodeId;
      this.treesevice
        .GetById(Number(this.SelectedNodeId))
        .subscribe((data: any) => {
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
              if (this.showCPMenu) {
                this.showCPMenu = false;
              } else {
                this.showCPMenu = true;
                this.Readonly = false;
                this.showContextMenu = false;
                this.toggleActions = false;
                this.AddText = this.getTitleByHeight(
                  this.nodes.find((x) => x.id == NodeId)!.position + 1
                );
                event.preventDefault();
                this.contextMenuPosition = {
                  x: event.clientX,
                  y: event.clientY,
                };
              }
            } else {
              this.toggleAdminDocs = true;
              if (this.showContextMenu) {
                this.showContextMenu = false;
              } else {
                this.togglePublichednodes = true;
                this.showContextMenu = true;
                this.showCPMenu = false;
                this.AddText = this.getTitleByHeight(
                  this.nodes.find((x) => x.id == NodeId)!.position + 1
                );
                console.log(this.AddText);

                event.preventDefault();
                this.contextMenuPosition = {
                  x: event.clientX,
                  y: event.clientY,
                };
              }
            }
          } else {
            if (this.showContextMenu) {
              this.showContextMenu = false;
            } else {
              this.togglePublichednodes = false;
              this.showContextMenu = true;
              this.showCPMenu = false;
              this.toggleduplicate = false;
              this.toggleAdminDocs = false;
              this.AddText = this.getTitleByHeight(
                this.nodes.find((x) => x.id == NodeId)!.position + 1
              );

              event.preventDefault();
              this.contextMenuPosition = {
                x: event.clientX,
                y: event.clientY,
              };
            }
          }
        });
    } else if (localStorage.getItem('userRole') != 'EndUser') {
      if (this.toggleActions == true) {
        this.toggleActions = false;
      } else {
        this.SelectedNodeId = NodeId;
        this.treesevice
          .GetById(Number(this.SelectedNodeId))
          .subscribe((data: any) => {
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
                this.showCPMenu = false;
                event.preventDefault();
                this.contextMenuPosition = {
                  x: event.clientX,
                  y: event.clientY,
                };
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
              this.showCPMenu = false;
              this.Readonly = false;
              event.preventDefault();
              this.contextMenuPosition = {
                x: event.clientX,
                y: event.clientY,
              };
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
              this.showCPMenu = false;
              this.Readonly = false;
              event.preventDefault();
              this.contextMenuPosition = {
                x: event.clientX,
                y: event.clientY,
              };
            }
          });
      }
    } else {
      if (this.toggleDocs == true) {
        this.toggleDocs = false;
      } else {
        this.SelectedNodeId = NodeId;
        this.treesevice
          .GetById(Number(this.SelectedNodeId))
          .subscribe((data: any) => {
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
                this.showCPMenu = false;
                event.preventDefault();
                this.contextMenuPosition = {
                  x: event.clientX,
                  y: event.clientY,
                };
              } else {
                this.toggleDocs = true;

                this.showContextMenu = false;
                this.toggleActions = false;
                this.showCPMenu = false;
                event.preventDefault();
                this.contextMenuPosition = {
                  x: event.clientX,
                  y: event.clientY,
                };
              }
            }
          });
      }
    }
    this.SelectedNodeId = NodeId;
  }

  // tooltipfunction(NodeId: string) {
  //   let node: any;
  //   this.treesevice.GetById(Number(NodeId)).subscribe((data: any) => {
  //     node = data;
  //     if (node.lastStateId! == 1 || node.lastStateId! == 51) {
  //       console.log('hello');
  //       console.log(this.GetUserName(node.adminId));

  //       return this.GetUserName(node.adminId);
  //     } else if (node.lastStateId! == 42) {
  //       return this.GetUserName(node.endUserId);
  //     } else if (node.lastStateId! == 2 || node.lastStateId! == 60) {
  //       return this.GetUserName(node.qc1Id);
  //     } else if (node.lastStateId! == 41 || node.lastStateId! == 81) {
  //       return this.GetUserName(node.officerId);
  //     }
  //     return this.GetUserName(node.qc2Id);
  //   });
  // }

  // GetUserName(id: number) {
  //   let user = '';
  //   this.UserService.getUserById(id).subscribe((data: any) => {
  //     user = data.fullname;
  //   });
  // }
  AddPopup() {
    this.showContextMenu = false;
    this.toggleActions = false;
    this.toggleDocs = false;
    this.Readonly = false;
    this.showCPMenu = false;
    const dialogRef = this.dialogRef.open(AddTreeNodesComponent, {
      data: { id: this.SelectedNodeId, AddText: this.AddText },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
      this.showContextMenu = false;
    });
  }
  OpenConfirmation(processName: string) {
    this.showContextMenu = false;
    this.toggleActions = false;
    this.toggleDocs = false;
    this.Readonly = false;
    this.showCPMenu = false;
    const NodeTitle = this.nodes.find(
      (x) => x.id == this.SelectedNodeId
    )!.title;

    if (processName == 'Delete' && NodeTitle == 'Client') {
      this.treesevice
        .GetById(Number(this.SelectedNodeId))
        .subscribe((data: any) => {
          var name = data.name;
          const nameConfirmationDialogRef = this.dialogRef.open(
            ConfirmNameComponent,
            {
              width: '400px',
              data: { name: name },
            }
          );

          nameConfirmationDialogRef
            .afterClosed()
            .subscribe((isNameConfirmed) => {
              if (isNameConfirmed) {
                const deleteDialogRef = this.dialogRef.open(
                  ConfrimDeleteNodeComponent,
                  {
                    width: '400px',
                    data: { id: Number(this.SelectedNodeId), name: name },
                  }
                );

                deleteDialogRef.afterClosed().subscribe((isDeleted) => {
                  if (isDeleted) {
                    this.ClientService.delete(
                      +Number(this.SelectedNodeId)
                    ).subscribe(
                      () => {
                        this.toastr.success(this.translate.instant('toastrMessages.success'), this.translate.instant('success'), {
                          closeButton: true
                        });
                        this.router.navigate(['/clients']);
                      },
                      (error: any) => {
                        this.toastr.success(this.translate.instant('toastrMessages.error'), this.translate.instant('error'), {
                          closeButton: true
                        });
                      }
                    );
                  }
                });
              }
            });
        });
    } else {
      const dialog = this.dialogRef.open(ConfirmationPopupComponent, {
        data: {
          id: this.SelectedNodeId,
          processName: processName,
          NodeName: NodeTitle,
        },
      });
      dialog.afterClosed().subscribe((result) => {
        if (processName != 'Publish') {
          this.router.navigate(['/clients']);
        } else {
          this.ngOnInit();
        }
      });
    }
  }
  async Duplicate() {
    this.showContextMenu = false;
    this.toggleActions = false;
    this.toggleDocs = false;
    this.Readonly = false;
    this.showCPMenu = false;
    this.treesevice.Duplicate(Number(this.SelectedNodeId)).subscribe(
      (data: any) => {
        this.toastr.success('Duplicated successfully.', 'Success', {
          closeButton: true,
        });
        this.ngOnInit();
      },
      (error) => {
        this.toastr.error('Error when trying duplicating.', 'error', {
          closeButton: true,
        });
        this.ngOnInit();
      }
    );
  }

  // GenerateRandomName(parentId: number): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     this.treesevice.GetNodeChilds(parentId).subscribe(
  //       (data: any) => {
  //         const node = data.find(
  //           (x: { name: string }) => x.name === this.DublicatedNode.name
  //         );
  //         if (node) {
  //           const randomSuffix = Math.floor(Math.random() * 1000);
  //           this.DublicatedNode.name = `${this.DublicatedNode.name}_${randomSuffix}`;
  //         }
  //         resolve();
  //       },
  //       (error) => {
  //         reject(error);
  //       }
  //     );
  //   });
  // }
  edit() {
    this.showContextMenu = false;
    this.toggleActions = false;
    this.toggleDocs = false;
    this.Readonly = false;
    this.showCPMenu = false;
    var text = '';
    this.treesevice
      .GetById(Number(this.SelectedNodeId))
      .subscribe((data: any) => {
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
          data: { id: Number(this.SelectedNodeId), Text: text },
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
  setNodeColor(Nodes: ITreeNodes[]) {
    Nodes.forEach((element) => {
      if (element.lastState == 1) {
        element.color = '#000066';
      } else if (element.lastState == 2) {
        element.color = '#0000aa';
      } else if (element.lastState == 31) {
        element.color = '#002200';
      } else if (element.lastState == 32) {
        element.color = '#220000';
      } else if (element.lastState == 41) {
        element.color = '#005500';
      } else if (element.lastState == 42) {
        element.color = '#550000';
      } else if (element.lastState == 51) {
        element.color = '#008800';
      } else if (element.lastState == 60) {
        element.color = '#0000ff';
      } else if (element.lastState == 71) {
        element.color = '#00bb00';
      } else if (element.lastState == 72) {
        element.color = '#bb0000';
      } else if (element.lastState == 81) {
        element.color = '#00cc00';
      } else if (element.lastState == 82) {
        element.color = '#cc0000';
      } else if (element.lastState == 91) {
        element.color = '#00ff00';
      } else {
        element.color = '#000088';
      }
    });
  }
  getHighestHeight(): number {
    return Math.max(...this.nodes.map((node) => node.position));
  }
  generateTitles(maxHeight: number) {
    while (this.baseTitles.length < maxHeight) {
      this.baseTitles.push(`Sub domain`);
    }
    this.baseTitles.push(this.finalTitle);
  }

  SetNodeTitle(Nodes: ITreeNodes[]) {
    Nodes.forEach((element) => {
      element.title = this.baseTitles[element.position];
    });
  }
  getTitleByHeight(height: number): string {
    return height < this.baseTitles.length
      ? this.baseTitles[height]
      : this.finalTitle;
  }

  openAddDocumentsDialog(nodeId: any) {
    this.showContextMenu = false;
    this.toggleActions = false;
    this.toggleDocs = false;
    this.Readonly = false;
    this.showCPMenu = false;
    const dialogRef = this.dialogRef.open(AddDocumentsComponent, {
      data: { nodeId },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
      this.showContextMenu = false;
    });
  }
  loadNodeData(): void {
    this.treesevice.GetAllNode().subscribe(
      (notifications: any) => {
        this.dataSource = notifications;
      },
      (error) => {
        console.error('Error loading notifications:', error);
      }
    );
  }
  downloadFile(NodeId: any) {
    this.showContextMenu = false;
    this.toggleActions = false;
    this.toggleDocs = false;
    this.Readonly = false;
    this.showCPMenu = false;
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
    this.showContextMenu = false;
    this.toggleActions = false;
    this.toggleDocs = false;
    this.Readonly = false;
    this.showCPMenu = false;
    const dialogRef = this.dialogRef.open(ViewDocsNodeComponent, {
      width: '400px',
      data: Number(NodeId),
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }
  navigateToNodeTracking(nodeId: string): void {
    this.router.navigate(['node-tracking', Number(nodeId)]);
  }
}
