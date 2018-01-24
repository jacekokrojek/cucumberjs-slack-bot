exports.newSlackNotification = function (slackBotOptions) {
  const rp = require('request-promise');
  const getRepoInfo = require('git-repo-info');
  const info = getRepoInfo();
  let githubBaseUrl = slackBotOptions.githubAccount;
  let repoName = slackBotOptions.githubRepo;
  let commitHash = info.sha;
  let branch = info.branch;
  let abbrevSha = info.abbreviatedSha;
  let author = (info.author).split('<')[0];
  let commitLink = "<https://github.com/" + githubBaseUrl + "/" + repoName + "/commit/" + commitHash + "|" + abbrevSha + ">"
  let branchLink = "<https://github.com/" + githubBaseUrl + "/" + repoName + "/tree/" + branch + "|" + branch + ">"
  let message = author + "authored commit " + commitLink + " in branch " + branchLink + ".";
  const parser = require('./parse');
  let badReport = require(slackBotOptions.cucumberJSON);
  let summary = parser.parseRawJSON(badReport);
  let options = {
    uri: slackBotOptions.slackEndpoint,
    method: 'POST',
    body: {
      'attachments': [
        {
          'title': 'E2E Test Results',
          "fallback": "E2E Test Results - Auto-Posted by QA-Notification Bot.",
          "text": message,
          "pretext": "*E2E Test Results Summary*",
          "color": "#61ae7d",
          "fields": [
            {
              "title": "Feature Summary: " + summary.feature.grade + "% Passed",
              "value": ":white_check_mark: " + summary.feature.passed + ", :x: " + summary.feature.failed + ", :warning: " + summary.feature.affected + "",
              "short": true
            },
            {
              "title": "Scenario Summary: " + summary.scenario.grade + "% Passed",
              "value": ":white_check_mark: " + summary.scenario.passed + ", :x: " + summary.scenario.failed + ", :black_right_pointing_double_triangle_with_vertical_bar: " + summary.scenario.skipped + ", :interrobang: " + summary.scenario.inconclusive + "",
              "short": true // Optional flag indicating whether the `value` is short enough to be displayed side-by-side with other values
            },
            {
              "title": "Step Summary: " + summary.step.grade + "% Passed",
              "value": ":white_check_mark: " + summary.step.passed + ", :x: " + summary.step.failed + ", :black_right_pointing_double_triangle_with_vertical_bar: " + summary.step.skipped + "",
              "short": true // Optional flag indicating whether the `value` is short enough to be displayed side-by-side with other values
            },
            {
              "title": "Hook Summary",
              "value": ":white_check_mark: " + summary.hook.passed + ", :x: " + summary.hook.failed + "",
              "short": true
            },
            // {
            //   "title": "HTML Report",
            //   "value": "<https://alert-system.com/alerts/1234|Click here> for E2E Report on S3!",
            //   "short": false // Optional flag indicating whether the `value` is short enough to be displayed side-by-side with other values
            // },
          ]
        }
      ],

    },
    channel: '#notifications',
    username: 'E2E Bot',
    mrkdwn: true,
    json: true
  };

  // send to slack...
  return rp(options)
    .then(function (res) {
      console.log(res);
    })
    .catch(function (err) {
      console.log(err);
    });
}
