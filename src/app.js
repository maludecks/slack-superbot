'use strict';

const { App } = require('@slack/bolt');
const EmptyMembersListError = require('./errors/emptyMembersListError');
const NoSuperheroSelectedError = require('./errors/noSuperheroSelectedError');
const { slack: slackConfig } = require('../etc/superbotConfig');
const superheroService = require('./services/superheroService');
const slackMessageFormatter = require('./utils/slackMessageFormatter');
const basicModal = require('./utils/modals/basicModal');
const setupSuperheroesListModal = require('./utils/modals/setupSuperheroesListModal');

const app = new App({
  token: slackConfig.token,
  signingSecret: slackConfig.signingSecret
});

async function pick(say) {
  try {
    const newlyPicked = superheroService.pick();

    return say(`It's with you, ${slackMessageFormatter.mention(newlyPicked)}!`);
  } catch (e) {
    console.error(e);

    if (e instanceof EmptyMembersListError) {
      return say(`Oh no, I can't see any superhero options, try \`/superbot setup\` first`);
    }
  }
}

async function setup(botToken, triggerId) {
  try {
    return await app.client.views.open(
      setupSuperheroesListModal(botToken, triggerId)
    );
  } catch (e) {
    console.error(e);

    return await app.client.views.open(
      basicModal(botToken, triggerId, {
        title: 'Oh no...',
        text: `I couldn't initiate the setup now :( try again later!`
      })
    );
  }
}

app.event('app_mention', async ({ event, context }) => {
  try {
    const superheroes = superheroService.current();

    return await app.client.chat.postMessage({
      token: context.botToken,
      channel: event.channel,
      thread_ts: event.thread_ts,
      text: `${slackMessageFormatter.mention(superheroes)} will take a look!`
    });
  }
  catch (e) {
    console.error(e);

    if (e instanceof NoSuperheroSelectedError) {
      return await app.client.chat.postMessage({
        token: context.botToken,
        channel: event.channel,
        thread_ts: event.thread_ts,
        text: `Oh no, I couldn't find any superheroes to help you :(`
      });
    }
  }
});

app.view('view_setup', async ({ ack, body, view, context }) => {
  await ack();

  const { values } = view.state;
  const selectedUsers = values['section_users']['users_action']['selected_users'] || [];

  try {
    await superheroService.setup(selectedUsers, 1);

    return await app.client.views.open(
      basicModal(context.botToken, body.trigger_id, {
        title: `Ok, I'm ready!`,
        text: `Mention me (\`@superbot\`) or use \`/superbot pick\` to start!`
      })
    );
  } catch (e) {
    console.error(e);

    if (e instanceof EmptyMembersListError) {
      return await app.client.views.open(
        basicModal(context.botToken, body.trigger_id, {
          title: `Oh no...`,
          text: `You need to select at least one user so I can start.`
        })
      );
    }
  }
});

app.command('/superbot', async ({ command, ack, say, context }) => {
  await ack();

  const { text: commandText, trigger_id: triggerId } = command;
  const { botToken } = context;

  switch (commandText) {
    case 'pick':
      return await pick(say);
    case 'setup':
      return await setup(botToken, triggerId);
    default:
      return await app.client.views.open(
        basicModal(botToken, triggerId, {
          title: 'Oh no...',
          text: `I couldn't identify what you want me to do for you :(`
        })
      );
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);

  console.log('⚡️Superbot is running!');
})();
