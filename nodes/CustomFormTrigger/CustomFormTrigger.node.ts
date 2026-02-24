import type {
  IWebhookFunctions,
  IWebhookResponseData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
} from "n8n-workflow";
import { NodeConnectionTypes } from "n8n-workflow";

import type { FormConfig, FormSubmissionResponse } from "./types";

export class BetterFormsTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: "BetterForms Trigger",
    name: "BetterFormsTrigger",
    icon: "file:customform.svg",
    group: ["trigger"],
    version: 1,
    description:
      "BetterForms Trigger node to establish a JSON form definition with advanced field types",
    defaults: {
      name: "BetterForms Trigger",
    },
    inputs: [],
    outputs: [NodeConnectionTypes.Main],
    webhooks: [
      {
        name: "setup",
        httpMethod: "GET",
        responseMode: "onReceived",
        path: '={{$parameter["path"]}}',
      },
      {
        name: "default",
        httpMethod: "POST",
        responseMode: "onReceived",
        path: '={{$parameter["path"]}}',
      },
    ],
    credentials: [
      {
        name: "betterFormsApi",
        required: true,
      },
    ],
    properties: [
      {
        displayName: "Form API Path",
        name: "path",
        type: "string",
        default: "custom-form",
        placeholder: "my-form",
        description: "The path for the Form API URL",
        required: true,
      },
      {
        displayName: "Form Configuration (JSON)",
        name: "formConfig",
        type: "json",
        default: JSON.stringify(
          {
            formTitle: "Contact Us",
            formDescription: "Please fill out the form below.",
            submitLabel: "Submit",
            successMessage: "Thank you! Your submission has been received.",
            theme: {
              primaryColor: "#4f46e5",
              backgroundColor: "#f9fafb",
              fontFamily: "system-ui, sans-serif",
              borderRadius: 8,
            },
            fields: [
              {
                type: "text",
                label: "First Name",
                fieldName: "first_name",
                required: true,
                width: "half",
              },
              {
                type: "text",
                label: "Last Name",
                fieldName: "last_name",
                required: true,
                width: "half",
              },
              {
                type: "email",
                label: "Email",
                fieldName: "email",
                required: true,
              },
              {
                type: "textarea",
                label: "Message",
                fieldName: "message",
                rows: 4,
              },
            ],
          },
          null,
          2,
        ),
        typeOptions: {
          rows: 25,
        },
        description: "Paste the JSON configuration from the Form Builder",
      },
    ],
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const webhookName = this.getWebhookName();
    const req = this.getRequestObject();
    const res = this.getResponseObject();

    // Verify API key from credentials
    const credentials = await this.getCredentials("betterFormsApi");
    const expectedApiKey = credentials.apiKey as string;
    const queryData = this.getQueryData() as { apiKey?: string };
    const providedApiKey =
      (req.headers["x-api-key"] as string) ||
      queryData.apiKey ||
      "";

    if (!expectedApiKey || providedApiKey !== expectedApiKey) {
      res
        .status(401)
        .json({ error: "Unauthorized: Invalid or missing API key" });
      return { noWebhookResponse: true };
    }

    // Handle GET (config request)
    if (webhookName === "setup") {
      try {
        const formConfigJson = this.getNodeParameter(
          "formConfig",
          "{}",
        ) as string;
        const formConfig = JSON.parse(formConfigJson) as FormConfig;

        // Add the submit URL
        formConfig.submitUrl = this.getNodeWebhookUrl("default") || "";

        // Return the raw form configuration JSON
        res.status(200).json(formConfig);
      } catch (error) {
        res.status(400).json({ error: "Invalid form configuration JSON" });
      }
      return { noWebhookResponse: true };
    }

    // Handle POST (form submission)
    if (webhookName === "default") {
      const body = this.getBodyData() as IDataObject;

      let formConfig: FormConfig;
      try {
        const formConfigJson = this.getNodeParameter(
          "formConfig",
          "{}",
        ) as string;
        formConfig = JSON.parse(formConfigJson) as FormConfig;
      } catch {
        formConfig = {
          formTitle: "",
          formDescription: "",
          submitLabel: "Submit",
          successMessage: "Thank you!",
          redirectUrl: "",
          submitUrl: "",
          theme: {
            primaryColor: "#4f46e5",
            backgroundColor: "#f9fafb",
            fontFamily: "system-ui, sans-serif",
            borderRadius: 8,
          },
          fields: [],
        };
      }

      const response: FormSubmissionResponse = {
        success: true,
        message:
          formConfig.successMessage ||
          "Thank you! Your submission has been received.",
      };

      if (formConfig.redirectUrl) {
        response.redirectUrl = formConfig.redirectUrl;
      }

      res.status(200).json(response);

      // Merge submission data with form field definitions
      const mergedFields: IDataObject[] = formConfig.fields.map((field) => ({
        fieldName: field.fieldName,
        label: field.label,
        type: field.type,
        value: body[field.fieldName] ?? null,
        required: field.required ?? false,
        options: field.options,
      }));

      // Return merged data to the workflow
      return {
        workflowData: [
          [
            {
              json: {
                submission: body,
                formConfig: {
                  formTitle: formConfig.formTitle,
                  formDescription: formConfig.formDescription,
                },
                fields: mergedFields,
              },
            },
          ],
        ],
        noWebhookResponse: true,
      };
    }

    // Unknown webhook
    res.status(404).json({ error: "Not found" });
    return { noWebhookResponse: true };
  }
}
