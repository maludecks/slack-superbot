'use strict';

const { App, ExpressReceiver } = require('@slack/bolt');
const { slack: slackConfig } = require('../etc/superbotConfig');
const slackService = require('./services/slackService');

const receiver = new ExpressReceiver({
  signingSecret: slackConfig.signingSecret
});

const app = new App({
  token: slackConfig.token,
  receiver
});

app.event('app_mention', async ({ event, context }) => {
  return await app.client.chat.postMessage(
      slackService.mention(context.botToken, event.channel, event.thread_ts)
    );
});

app.view('view_setup', async ({ ack, body, view, context }) => {
  await ack();

  return await app.client.views.open(
    await slackService.setup(context.botToken, body.trigger_id, view.state.values)
  );
});

app.command('/superbot', async ({ command, ack, context, respond }) => {
  await ack();

  try {
    switch (command.text) {
      case 'pick':
        return await respond(slackService.pick());
      case 'setup':
        return await app.client.views.open(
          slackService.initSetup(context.botToken, command.trigger_id)
        );
      default:
        return respond({
          text: `Oh no...I don't understand what you asked me to do :(`,
          response_type: 'ephemeral'
        });
    }
  } catch (e) {
    console.error(`Error on trying to define command: ${e.stack}`);

    return respond({
      response_type: 'ephemeral',
      text: `Oh no, something is wrong with me, try again later :(`
    });
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);

  console.log('⚡️Superbot is running!');
})();
