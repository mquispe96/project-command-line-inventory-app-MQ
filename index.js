import inquirer from 'inquirer';

import {create, index, show, destroy, editPrompt, filterBy, sortBy, startSession, endSession, compareCars, getInventoryNetWorth} from './src/carsControllers.js';

const perfomAnotherCommand = () => {
	inquirer.prompt([
		{
			type: 'list',
			name: 'decision',
			message: 'Anything Else?',
			choices: ['Yes', 'No']
		}
	])
		.then(answer => answer.decision === 'Yes' ? run() : endSession())
}

const choicesList = ['View All Cars', 'View a Car', 'Inventory\'s Net Worth','Compare Cars','Add a Car', 'Update Car Info', 'Delete Car/s', 'Filter Cars', 'Sort Cars'];

const run = () => {
	inquirer.prompt([
		{
			type: 'list',
			name: 'command',
			message: 'What would you like to do?',
			choices: choicesList,
			pageSize: choicesList.length
		}
	])
		.then(ans => {
			const commandChosed = ans.command;
			switch(commandChosed){
				case 'View All Cars':
					index(perfomAnotherCommand);
					break;
				case 'View a Car':
					show(perfomAnotherCommand);
					break;
				case 'Add a Car':
					create(perfomAnotherCommand);
					break;
				case 'Update Car Info':
					editPrompt(perfomAnotherCommand);
					break;
				case 'Delete Car/s':
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
					case 'Inventory\'s Net Worth':
					getInventoryNetWorth(perfomAnotherCommand);
					break;
			}
		})
}

startSession(run)
