const rp = require('request-promise');
const notification = require('./notification');

exports.newSlackNotification = function (slackBotOptions) {

  let notificationContent = notification.create(slackBotOptions);

  let options = {
    uri: slackBotOptions.slackEndpoint,
    method: 'POST',
    body: notificationContent,
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