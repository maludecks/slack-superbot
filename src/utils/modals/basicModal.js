'use strict';

const basicModal = (botToken, triggerId, modalContent) => {
  const { title, text } = modalContent;

  return {
    token: botToken,
    trigger_id: triggerId,
    view: {
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
};

module.exports = basicModal;
