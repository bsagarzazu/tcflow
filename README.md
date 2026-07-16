# <a href="https://bsagarzazu.github.io/tcflow" target="_blank"><img src="src/assets/banner.svg" height="120"></a>

Web-based Teamcenter workflow editor built with [Siemens iX](https://github.com/siemens/ix), [React Flow](https://github.com/xyflow/xyflow) and [Zustand](https://github.com/pmndrs/zustand).

<a href="https://bsagarzazu.github.io/tcflow" target="_blank"><img src="public/og-image.png" width="100%"></a>

## Features

- **Workflow editor**: Edit multiple workflows, managing tasks, handlers and arguments.
- **Independent**: Edit workflows without needing a Teamcenter environment.
- **Interoperability**: Export & import PLMXML files for Teamcenter.
- **Rich saving**: Export & import workflows as `.tcflow` JSON files.
- **Privacy-first**: Your workflows don't leave your browser.
- **PWA support**: Works fully offline.
- **Productivity**: Full undo & redo support.
- **Image support**: Download your workflows as PNG or SVG.
- **Themes**: Dark and light mode support.
- **Free & open-source**: Licensed under AGPLv3.

Umami is used to collect anonymous usage statistics. See the detailed list of registered events [here](./ANALYTICS.md).

> **Note**: As a beta release, TcFlow is expected to have multiple bugs, mainly related to the PLMXML interoperability, as well as the following limitations:
>
> - PLMXML interoperability is not yet supported for:
>   - PLMXML files containing multiple workflows.
>   - Complex Task types such as Review Tasks and Condition Tasks.
>   - Rule Handlers and complex Business Rules.
> - At the moment, only True and False condition values are supported for condition tasks.
> - Only Start, Perform, Skip and Complete actions are currently supported.
> - Task coordinates might require adjustments after importing in both TcFlow and Teamcenter.

## Reporting Bugs & Feature Requests

Please [create an Issue](https://github.com/bsagarzazu/tcflow/issues/new/choose) if you found a bug or want to request a new feature.

I include the features I plan to add in the [Backlog Milestone](https://github.com/bsagarzazu/tcflow/milestone/8). Expressing your interest in them by reacting to the corresponding Issue might lead me to implement them first.

> **Note**: TcFlow is a personal project. While I plan to actively maintain it and fix bugs, PRs are currently not accepted. Please open an issue to discuss any ideas first.

## Sponsors & Support

If you find this tool useful in your daily work, consider [becoming a sponsor](https://github.com/sponsors/bsagarzazu).

## Companies using TcFlow

I would love to hear if you are using TcFlow at your organization! Let me know to feature your company [here](https://www.linkedin.com/in/bsagarzazu/).

## License

TcFlow is licensed under the [AGPLv3 License](LICENSE), which means that any modifications must be open source and shared under the same license.

If your company requires using TcFlow without these open-source restrictions, [contact me for a commercial license](https://www.linkedin.com/in/bsagarzazu/).

> **Disclaimer**: TcFlow is a personal project and is not affiliated with, associated with, authorized by, sponsored by, or in any way connected with Siemens AG or Siemens Digital Industries Software.
