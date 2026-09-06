# Data Collection & Analytics

TcFlow uses Umami to collect anonymous usage statistics. This data is used solely to understand feature usage and improve the tool.

### Privacy

- **No cookies**: Umami does not use cookies to track users.
- **Anonymized**: All data is fully anonymized.
- **Content Privacy**: No workflow logic, node names, handler arguments, or any proprietary property values are ever collected or transmitted.

### Registered Events

The following actions trigger an anonymous event:

- **Workflow import/export**: Type of action and format (JSON, PLMXML, PNG or SVG).
- **Project interaction**: Creation of tasks, handlers, and workflows (tracking only the type of object).
- **UI interaction**: Theme toggling, PWA installation, and clicks on GitHub-related links.

> **Note**: A public analytics dashboard is a planned feature, so that users can audit the tool's usage statistics themselves.
