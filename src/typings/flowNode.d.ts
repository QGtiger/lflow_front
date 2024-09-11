interface FlowNode {
  id: string;
  connectorCode: string;
  actionCode: string;

  next?: string;
  parent?: string;
}
