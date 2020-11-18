'use strict';

const basicModalView = ({ title, text }) => {
  return {
    type: 'modal',
    callback_id: 'view_basic_modal',
    title: {
      type: 'plain_text',
      text: title
    },
    blocks: [
      {
        block_id: 'block_basic_modal',
        type: 'section',
        text: {
          type: 'mrkdwn',
          text
        }
      }
    ]
  }
};

module.exports = basicModalView;
