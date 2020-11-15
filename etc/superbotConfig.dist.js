'use strict';

const config = {
  slack: {
    token: process.env.SLACK_BOT_TOKEN || 'test-slack-token',
    signingSecret: process.env.SLACK_SIGNING_SECRET || 'test-signing-secret'
  }
};

module.exports = config;
