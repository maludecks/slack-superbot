# Superbot 🦾

[![Build Status](https://travis-ci.com/maludecks/slack-superbot.svg?branch=master)](https://travis-ci.com/github/maludecks/slack-superbot)

A slack app which picks random* channel members (a.k.a superheroes) and assigns them to take care of any reported bugs and tasks for a day. @Superbot is built in Javascript, runs on Node.js and uses [bolt-js](https://slack.dev/bolt-js/) to interact with [Slack API](https://api.slack.com/).

## Setup
```sh
# Install dependencies
npm install

# Run the slack app
npm start
```

In order to be able to interact with @Superbot locally, you need to setup your own Slack app, follow the steps on [bolt-js documentation](https://slack.dev/bolt-js/tutorial/getting-started).

## Commands & Mentions
@Superbot will respond to the following commands and direct mentions:

### /superbot setup (WIP)
Stores the list of members of the channel who can be picked to be superheroes. The list of members is required, and optionally, you can provide a number of heroes to be picked (default is 1).

### /superbot pick
Picks a random* selection of superheroes from the list provided at `setup`. The number of heroes depends on wether the parameter was set in the setup, otherwise the default is 1.

### @superbot
Sends a message mentioning the current superheroes in the channel (or thread) where @Superbot was mentioned.

## Contributing
If you have suggestions for how @Superbot could be improved, or want to report a bug, open an issue; Feel welcome to contribute to this repository by submitting a PR!

## License
[ISC](LICENSE) © 2020 Malu Decks <maludecks@gmail.com> (https://github.com/maludecks/slack-superbot)
