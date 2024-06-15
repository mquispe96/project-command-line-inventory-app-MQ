import inquirer from 'inquirer';

import {
  create,
  index,
  show,
  destroy,
  editPrompt,
  filterBy,
  sortBy,
  startSession,
  endSession,
  compareCars,
  getInventoryNetWorth,
  addToCart,
  removeFromCart,
  seeCart,
} from './src/carsControllers.js';

const perfomAnotherCommand = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'decision',
        message: 'Would you like to do something else?',
        choices: ['Yes', 'No'],
      },
    ])
    .then(answer => (answer.decision === 'Yes' ? run() : endSession()));
};

const choicesList = [
  'View All Cars',
  'View a Car',
  "Inventory's Net Worth",
  'Compare Cars',
  'Filter Cars',
  'Sort Cars',
  'Add Car to Inventory',
  'Update Car Info',
  'Delete Car/s from Inventory',
  'Add Car/s to Cart',
  'See Cart',
  'Remove Car/s from Cart',
];

const run = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'command',
        message: 'What would you like to do?',
        choices: choicesList,
        pageSize: choicesList.length,
      },
    ])
    .then(ans => {
      const commandChosed = ans.command;
      switch (commandChosed) {
        case 'View All Cars':
          index(perfomAnotherCommand);
          break;
        case 'View a Car':
          show(perfomAnotherCommand);
          break;
        case 'Add Car to Inventory':
          create(perfomAnotherCommand);
          break;
        case 'Update Car Info':
          editPrompt(perfomAnotherCommand);
          break;
        case 'Delete Car/s from Inventory':
          destroy(perfomAnotherCommand);
          break;
        case 'Filter Cars':
          filterBy(perfomAnotherCommand);
          break;
        case 'Sort Cars':
          sortBy(perfomAnotherCommand);
          break;
        case 'Compare Cars':
          compareCars(perfomAnotherCommand);
          break;
        case "Inventory's Net Worth":
          getInventoryNetWorth(perfomAnotherCommand);
          break;
        case 'Add Car/s to Cart':
          addToCart(perfomAnotherCommand);
          break;
        case 'See Cart':
          seeCart(perfomAnotherCommand);
          break;
        case 'Remove Car/s from Cart':
          removeFromCart(perfomAnotherCommand);
          break;
      }
    });
};

startSession(run);
