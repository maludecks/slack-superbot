'use strict';

const _ = require('lodash');
const superheroRepository = require('./superheroRepository');
const EmptyMembersListError = require('../errors/emptyMembersListError');
const NoSuperheroSelectedError = require('../errors/noSuperheroSelectedError');

function current() {
  const currentSelection = superheroRepository.getCurrentSelection();

  if (currentSelection.length === 0) {
    throw new NoSuperheroSelectedError();
  }

  return currentSelection;
}

function pick() {
  const membersList = superheroRepository.getMembersList();

  if (membersList.length === 0) {
    throw new EmptyMembersListError();
  }

  const currentSelection = superheroRepository.getCurrentSelection();
  const numberOfHeroes = superheroRepository.getTotalNumber();

  const newSelection = _.sampleSize(
    membersList.filter(hero => !currentSelection.includes(hero)),
    numberOfHeroes
  );

  superheroRepository.saveNewSelection(newSelection);

  return newSelection;
}

function setup(users, numberOfHeroes) {
  if (users.length === 0) {
    throw new EmptyMembersListError();
  }

  return superheroRepository.saveConfiguration(users, numberOfHeroes);
}

module.exports = {
  current,
  pick,
  setup
};
