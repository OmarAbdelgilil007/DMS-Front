export interface ICreateNode {
  name: string;
  description: string;
  height: number;
  lastStateId: number;
  parentId: number;
  adminId?: number;
  officerId?: number;
  qC1Id?: number;
  qC2Id?: number;
  endUserId?: number;
  rootId: number;
}
