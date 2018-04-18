# Protractor/Cucumber Slack Notification Tool

Simple JSON parser and slack notification bot. Designed to be used with a Slack Web API endpoint.

## Getting Started

Designed to be used as a dev dependency. Explore your options if you'd like.
```
npm install --save-dev cucumberjs-slack-bot
```

### Prerequisites

Designed for a specific use-case. If you are using Protractor with CucumberJS _and_ Slack, you might find this tool useful.

This tool requires a Slack Web API endpoint. [Read More](https://api.slack.com/web)

### Installing

To use simply require the module:

```
const slackBot = require('./bot');
```

Define your Slackbot configuratoin options:

```
const slackBotOptions = {
  githubInfo: [include github info (default is false): boolean]
  githubAccount: '[your account name: string]',
  githubRepo: '[your repo name: string]',
  title: '[title of the notification: string]',
  message: '[title of the notification: string]',
  cucumberJSON: '[filepath of Protractor JSON output: string]',
  slackEndpoint: 'https://hooks.slack.com/services/your/endpoint'
}
```

Then call the function:

```
slackBot.newSlackNotification(slackBotOptions);
```

## Built With

* [git-repo-info](https://www.npmjs.com/package/git-repo-info) - For git info
* [request](https://www.npmjs.com/package/request) - For hitting endpoint
* [request-promise](https://www.npmjs.com/package/request-promise) - Cause promises

## Contributing

Submit a PR on the github repo

## Authors

* **Taylor Buckner** - *WIP* - [tabuckner](https://github.com/tabuckner)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
