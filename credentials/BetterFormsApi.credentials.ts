import type { ICredentialType, INodeProperties } from "n8n-workflow";

export class BetterFormsApi implements ICredentialType {
  name = "betterFormsApi";

  displayName = "BetterForms API";

  properties: INodeProperties[] = [
    {
      displayName: "API Key",
      name: "apiKey",
      type: "string",
      typeOptions: { password: true },
      default: "",
      description: "API key for authenticating form requests",
    },
  ];
}
