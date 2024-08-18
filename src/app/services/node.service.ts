import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({
      // 'Content-Type': 'application/json',
    }),
  };

  GetTreeNodes(ClientId: number) {
    let url = `${environment.URL}/Node/TreeNodes?rootId=${ClientId}`;
    return this.http.get(url, this.httpOptions);
  }
  GetTreeData(ClientId: number) {
    let url = `${environment.URL}/Node/TreeData?rootId=${ClientId}`;
    return this.http.get(url, this.httpOptions);
  }
  GetById(NodeId: number) {
    let url = `${environment.URL}/Node/Documents/${NodeId}`;
    return this.http.get(url);
  }
  AddNodes(node: any, numberOfNodes: number) {
    let url = `${environment.URL}/Node/AddNodes?numberOfNodes=${numberOfNodes}`;
    return this.http.post(url, node, this.httpOptions);
  }
  GetNodeChilds(NodeId: number) {
    let url = `${environment.URL}/Node/GetNodeChilds?nodeId=${NodeId}`;
    return this.http.get(url, this.httpOptions);
  }
  DeleteNode(NodeId: number) {
    let url = `${environment.URL}/Node/delete/${NodeId}`;
    return this.http.delete(url, this.httpOptions);
  }
  NodeAction(NodeId: number, StateId: number, Comment?: string) {
    let url = `${environment.URL}/Node/NodeAction?nodeId=${NodeId}&stateId=${StateId}&comment=${Comment}`;
    return this.http.put(url, this.httpOptions);
  }
  getTreeDataByRoles(ClientId: number) {
    let url = `${environment.URL}/Node/TreeDataByRole?rootId=${ClientId}`;
    return this.http.get(url, this.httpOptions);
  }
  getTreeNodesByRoles(ClientId: number) {
    let url = `${environment.URL}/Node/TreeNodesByRole?rootId=${ClientId}`;
    return this.http.get(url, this.httpOptions);
  }
  ExportDocs(NodeId: number) {
    let url = `${environment.URL}/Node/exportDocuments/${NodeId}`;
    return this.http.get(url, {
      responseType: 'blob',
      headers: this.httpOptions.headers,
    });
  }
  GetAllNode() {
    let url = `${environment.URL}/Node/all`;
    return this.http.get(url, this.httpOptions);
  }

  AddDocs(
    nodeId: any,
    sampleDocument?: File,
    referenceDocument?: File,
    actualDocuments?: File[]
  ) {
    const url = `${environment.URL}/Node/AddDocument?nodeId=${nodeId}`;
    const formData = new FormData();

    if (sampleDocument) {
      formData.append('sampleDocument', sampleDocument, sampleDocument.name);
    }

    if (referenceDocument) {
      formData.append(
        'referenceDocument',
        referenceDocument,
        referenceDocument.name
      );
    }

    if (actualDocuments && actualDocuments.length > 0) {
      actualDocuments.forEach((doc, index) => {
        // formData.append(`actualDocuments${index}`, doc);
        formData.append(`actualDocuments`, doc);
      });
    }

    return this.http.post(url, formData, this.httpOptions);
  }

  GetNodeById(NodeId: string) {
    let url = `${environment.URL}/Node/Documents/${NodeId}`;
    return this.http.get(url);
  }

  DeleteDoc(documentId: number) {
    const url = `${environment.URL}/Node/DeleteDocument/${documentId}`;
    return this.http.delete(url, this.httpOptions);
  }
  GetNodeTrackingById(NodeId: any) {
    let url = `${environment.URL}/Node/GetNodesTrackingByNodeId?nodeId=${NodeId}`;
    return this.http.get(url);
  }
  Duplicate(id: number) {
    let url = `${environment.URL}/Node/Duplicate?id=${id}`;
    return this.http.post(url, this.httpOptions);
  }
}
