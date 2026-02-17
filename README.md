# n8n-nodes-betterforms

A simple n8n trigger node that provides GET and POST endpoints for JSON-based form workflows. Built for internal use at the Leadership Institute, but anyone is welcome to use it.

## What It Does

This node creates two webhook endpoints:

- **GET** `/{path}` — Returns the JSON you stored in the node (plus the POST URL as `submitUrl`)
- **POST** `/{path}` — Accepts a JSON body, merges it with your stored field definitions, and passes it to the workflow

## Installation

Follow the [n8n community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

Or set the environment variable:
```
N8N_COMMUNITY_PACKAGES=n8n-nodes-betterforms
```

## Credentials

Requires a **BetterForms API** credential with an API key. All requests must include the key via:
- `x-api-key` header, or
- `apiKey` query parameter

## Usage

1. Add the **BetterForms Trigger** node to your workflow
2. Set the **Form API Path** (e.g., `my-form`)
3. Add your API credentials
4. Paste your form config JSON

## How the POST Transform Works

The node expects your stored config to have a `fields` array where each field has a `fieldName` property:

```json
{
  "formTitle": "Contact Us",
  "formDescription": "...",
  "successMessage": "Thanks!",
  "fields": [
    { "fieldName": "first_name", "label": "First Name", "type": "text", "required": true },
    { "fieldName": "email", "label": "Email", "type": "email", "required": true }
  ]
}
```

When a POST comes in with:
```json
{ "first_name": "John", "email": "john@example.com" }
```

The workflow receives:
```json
{
  "submission": {
    "first_name": "John",
    "email": "john@example.com"
  },
  "formConfig": {
    "formTitle": "Contact Us",
    "formDescription": "..."
  },
  "fields": [
    {
      "fieldName": "first_name",
      "label": "First Name",
      "type": "text",
      "required": true,
      "value": "John"
    },
    {
      "fieldName": "email",
      "label": "Email",
      "type": "email",
      "required": true,
      "value": "john@example.com"
    }
  ]
}
```

The `fields` array merges each stored field definition with the corresponding submitted value (matched by `fieldName`). The raw submission is also available untouched in `submission`.

## License

MIT
