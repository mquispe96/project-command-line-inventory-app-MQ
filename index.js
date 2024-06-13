import inquirer from 'inquirer';

import {create, index, show, destroy, editPrompt, filterBy, sortBy, startSession, endSession} from './src/carsControllers.js';

const perfomAnotherCommand = () => {
	inquirer.prompt([
		{
			type: 'list',
			name: 'command',
			message: 'Anything Else?',
			choices: ['Yes', 'No']
		}
	])
		.then(ans => ans.command === 'Yes' ? run() : endSession())
}

const run = () => {
	inquirer.prompt([
		{
			type: 'list',
			name: 'command',
			message: 'What would you like to do?',
			choices: ['View All Cars', 'View a Car', 'Add a Car', 'Update Car Info', 'Delete a Car', 'Filter Cars', 'Sort Cars']
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
				case 'Delete a Car':
					destroy(perfomAnotherCommand);
					break;
				case 'Filter Cars':
					filterBy(perfomAnotherCommand);
					break;
				case 'Sort Cars':
					sortBy(perfomAnotherCommand);
					break;
			}
		})
}

startSession(run)
