require('dotenv').config()
const { App } = require('@slack/bolt')
const ShortcutController = require('./controllers/shortcutController')
const ViewController = require('./controllers/viewController')
const ActionController = require('./controllers/actionController')

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

(async () => {
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();

app.shortcut('book_leave', async ({ shortcut, ack, client }) => {
  ShortcutController.openModal({ shortcut, ack, client })
});

app.view('view_1', async ({ ack, body, view, client }) => {
  ViewController.storeLeaveRequest({ ack, body, view, client })
});

app.action('approve', async ({ action, ack, client }) => {
  ActionController.handleApprovedLeaveRequest({ action, ack, client  })
});

app.action('deny', async ({ action, ack, client }) => {
  ActionController.handleDeniedLeaveRequest({ action, ack, client  })
});
