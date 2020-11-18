'use strict';

const setupSuperheroesListView = {
  type: 'modal',
  callback_id: 'view_setup',
  title: {
    type: 'plain_text',
    text: 'Setup your @Superbot'
  },
  blocks: [
    {
      type: 'section',
      block_id: 'section_users',
      text: {
        type: 'mrkdwn',
        text: 'Pick users from the list'
      },
      accessory: {
        action_id: 'users_action',
        type: 'multi_users_select',
        placeholder: {
          type: 'plain_text',
          text: 'Select users'
        }
      }
    }
  ],
  submit: {
    type: 'plain_text',
    text: 'Submit'
  }
};

module.exports = setupSuperheroesListView;
