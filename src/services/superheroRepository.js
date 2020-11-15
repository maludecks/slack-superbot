'use strict';

const fs = require('fs');

// As an MVP, the bot will be reading/storing the @superheroes in a file
const CONFIG_FILE_PATH = __dirname + '/../../etc/superheroesConfig.json';

function readConfig() {
  return JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, 'utf-8'));
}

function getTotalNumber() {
  return readConfig().numberOfHeroes;
}

function getCurrentSelection() {
  return readConfig().currentSelection;
}

function getMembersList() {
  return readConfig().membersList;
}

async function saveNewSelection(newSelection) {
  const config = readConfig();

  config.currentSelection = newSelection;
  config.lastModified = (new Date).toISOString();

  return fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(config, null, 2), function (err) {
    if (err) return console.log(err);
  });
}

async function saveConfiguration(membersList, numberOfHeroes) {
  const config = readConfig();

  config.membersList = membersList;
  config.numberOfHeroes = numberOfHeroes;
  config.lastModified = (new Date).toISOString();

  return fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(config, null, 2), function (err) {
    if (err) return console.log(err);
  });
}

module.exports = {
  getTotalNumber,
  getCurrentSelection,
  getMembersList,
  saveNewSelection,
  saveConfiguration
};
