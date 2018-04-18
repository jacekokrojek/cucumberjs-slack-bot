const js = require("jasmine-snapshot");
const snapshots = require('./data/output/test.snapshot')

describe('Notification', function () {

    const notification = require('../notification');

    beforeAll(() => {
        js.registerSnapshots(snapshots, "notification");
    });

    it('should return default values', function () {
        slackBotOptions = {
            cucumberJSON: './spec/data/input/summary.json',
            slackEndpoint: ''
        }
        let notificationContent = notification.create(slackBotOptions);
        js.expectjs(notificationContent).toMatchSnapshot();
    });

    it('should return values set via options', function () {
        slackBotOptions = {
            title: 'Latest run on IE',
            message: 'Additonal information',
            cucumberJSON: './spec/data/input/summary.json',
            slackEndpoint: ''
        }
        let notificationContent = notification.create(slackBotOptions);
        js.expectjs(notificationContent).toMatchSnapshot();
    });
});