'use strict';

const slackService = require('../slackService');
const superheroService = require('../superheroService');
const NoSuperheroSelectedError = require('../../errors/noSuperheroSelectedError');
const EmptyMembersListError = require('../../errors/emptyMembersListError');
const setupModalView = require('../..//utils/modals/setupModalView');
const basicModalView = require('../..//utils/modals/basicModalView');

describe('slackService', () => {
  let botToken, thread, channel, triggerId;

  beforeAll(() => {
    botToken = 'bot-token';
    thread = 'thread-id';
    channel = 'channel-id';
    triggerId = 'trigger-id';
    console.error = jest.fn();
  });

  test('mention() returns successful response', () => {
    jest.spyOn(superheroService, 'current').mockReturnValue(['USERID1', 'USERID2']);

    const response = slackService.mention(botToken, channel, thread);

    expect(response).toEqual({
      text: `<@USERID1> and <@USERID2> will take a look!`,
      token: botToken,
      thread_ts: thread,
      channel,
    });
  });

  test('mention() returns error response when no superheroes selected', () => {
    jest.spyOn(superheroService, 'current').mockImplementation(() => {
      throw new NoSuperheroSelectedError();
    });

    const response = slackService.mention(botToken, channel, thread);

    expect(response).toEqual({
      text: `Oh no, I couldn't find any superheroes to help you :(`,
      token: botToken,
      thread_ts: thread,
      channel,
    });
  });

  test('initSetup() returns successful response', () => {
    const response = slackService.initSetup(botToken, triggerId);

    expect(response).toEqual({
      token: botToken,
      trigger_id: triggerId,
      view: setupModalView
    });
  });

  test('setup() returns successful response', async () => {
    jest.spyOn(superheroService, 'setup').mockReturnValue(true);

    const values = {
      section_users: {
        users_action: {
          selected_users: ['USERID1', 'USERID2']
        }
      }
    };

    const response = await slackService.setup(botToken, triggerId, values);

    expect(response).toEqual({
      token: botToken,
      trigger_id: triggerId,
      view: basicModalView({
        title: `Ok, I'm ready!`,
        text: `Mention me (\`@superbot\`) or use \`/superbot pick\` to start!`
      })
    });
  });

  test('setup() returns error response when no superheroes found', async () => {
    jest.spyOn(superheroService, 'setup').mockImplementation(() => {
      throw new EmptyMembersListError();
    });

    const values = {
      section_users: {
        users_action: {
          selected_users: ['USERID1', 'USERID2']
        }
      }
    };

    const response = await slackService.setup(botToken, triggerId, values);

    expect(response).toEqual({
      token: botToken,
      trigger_id: triggerId,
      view: basicModalView({
        title: `Oh no...`,
        text: `You need to select at least one user so I can start.`
      })
    });
  });

  test('pick() returns successful response', () => {
    jest.spyOn(superheroService, 'pick').mockReturnValue(['USERID3']);

    const response = slackService.pick();

    expect(response).toEqual({
      response_type: 'in_channel',
      text: `It's with you, <@USERID3>!`
    });
  });

  test('pick() returns error response when no superheroes found', () => {
    jest.spyOn(superheroService, 'pick').mockImplementation(() => {
      throw new EmptyMembersListError();
    });

    const response = slackService.pick();

    expect(response).toEqual({
      response_type: 'ephemeral',
      text: `Oh no, I can't see any superheroes, try \`/superbot setup\` first`
    });
  });
});
