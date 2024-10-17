interface IPaasSchema {
  code: string | string[];
  name: string;
  type: FieldType;
  description?: string;
  required?: boolean;

  group?: string;
  visibleRules?: string; // 可见规则

  editor: EditorTypeConfig;

  validateRules?: string; // 校验规则
}

type IPaaSConnectorAction = {
  code: string;
  name: string;
  description: string;
  group: string;

  inputs: Array<IPaasSchema>;
  excuteProtocol: ExcuteInfer;
  outputs: OutputStrcut[];
};

interface IPaaSConnector {
  code: string;
  name: string;
  description: string;
  logo: string;
  actions: IPaaSConnectorAction[];
}
