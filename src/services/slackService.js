'use strict';

const superheroService = require('./superheroService');
const slackMessageFormatter = require('../utils/slackMessageFormatter');
const setupModalView = require('../utils/modals/setupModalView');
const basicModalView = require('../utils/modals/basicModalView');
const NoSuperheroSelectedError = require('../errors/noSuperheroSelectedError');
const EmptyMembersListError = require('../errors/emptyMembersListError');

function mention(botToken, channel, thread) {
  try {
    const superheroes = superheroService.current();

    return {
      text: `${slackMessageFormatter.mention(superheroes)} will take a look!`,
      token: botToken,
      thread_ts: thread,
      channel,
    };
  }
  catch (e) {
    console.error(e);

    if (e instanceof NoSuperheroSelectedError) {
      return {
        text: `Oh no, I couldn't find any superheroes to help you :(`,
        token: botToken,
        thread_ts: event.thread_ts,
        channel,
      };
    }
  }
}

function initSetup(botToken, triggerId) {
  try {
    return {
      token: botToken,
      trigger_id: triggerId,
      view: setupModalView
    }
  } catch (e) {
    console.error(e);

    return {
      token: botToken,
      trigger_id: triggerId,
      view: basicModalView({
        title: 'Oh no...',
        text: `I couldn't initiate the setup now :( try again later!`
      })
    };
  }
}

async function setup(botToken, triggerId, values) {
  const selectedUsers = values['section_users']['users_action']['selected_users'] || [];

  try {
    await superheroService.setup(selectedUsers, 1);

    return {
      token: botToken,
      trigger_id: triggerId,
      view: basicModalView({
        title: `Ok, I'm ready!`,
        text: `Mention me (\`@superbot\`) or use \`/superbot pick\` to start!`
      })
    };
  } catch (e) {
    console.error(e);

    if (e instanceof EmptyMembersListError) {
      return {
        token: botToken,
        trigger_id: triggerId,
        view: basicModalView({
          title: `Oh no...`,
          text: `You need to select at least one user so I can start.`
        })
      };
    }
  }
}

function pick() {
  try {
    const newlyPicked = superheroService.pick();

    return {
      response_type: 'in_channel',
      text: `It's with you, ${slackMessageFormatter.mention(newlyPicked)}!`
    };
  } catch (e) {
    console.error(e);

    if (e instanceof EmptyMembersListError) {
      return {
        response_type: 'ephemeral',
        text: `Oh no, I can't see any superheroes, try \`/superbot setup\` first`
      };
    }

    return {
      response_type: 'ephemeral',
      text: `Oh no, something is wrong with me, try again later :(`
    };
  }
}

module.exports = {
  mention,
  initSetup,
  setup,
  pick,
}
