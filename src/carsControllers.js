// const {nanoid} = require('nanoid');
// const figlet = require('figlet');
// const chalk = require('chalk');
// const inquirer = require('inquirer');
import ora from 'ora';
import { nanoid } from 'nanoid';
import figlet from 'figlet';
import chalk from 'chalk';
import inquirer from 'inquirer';

// const {createTableDisplay} = require('./helperFunctions');
// const {writeJSONFile, readJSONFile} = require('../src/dataHandler');
import {createTableDisplay} from './helperFunctions.js';
import {writeJSONFile, readJSONFile} from '../src/dataHandler.js';
const cars = readJSONFile('./data', 'cars.json');

const startSession = run => {
	figlet('Pursuit Cars !', function(err, data) {
			if (err) {
					console.log(chalk.red.bold('Something went wrong...'));
					console.dir(err);
					return;
			}
			console.log(chalk.blue(data));
	});
	const spinner = ora('Loading app...').start();
	process.stdout.write('\r');
	setTimeout(() => {
		process.stdout.write('\r');
		spinner.stop();
		run()
	}, 1000);
}

const endSession = () => {
	figlet('See Yah !', function(err, data) {
			if (err) {
					console.log(chalk.red.bold('Something went wrong...'));
					console.dir(err);
					return;
			}
			console.log(chalk.blue(data));
	});
}

const inform = console.log;

const index = func => {
	const spinner = ora('Loading cars data...').start();
	setTimeout(() => {
		process.stdout.write('\r');
		spinner.succeed('Cars Loaded');
		inform(createTableDisplay(cars));
		func();
	}, 1500)
}

const show = func => {
	inquirer.prompt([
		{
			type: 'input',
			name: 'id',
			message: 'ID of car you want to see:'
		}
	])
		.then(answer => {
			const spinner = ora('Loading car data...').start();
			const carInfo = cars.find(car => car.id === answer.id);
			setTimeout(() => {
				process.stdout.write('\r');
				if(carInfo){
					spinner.succeed('Car Loaded');
					inform(createTableDisplay([carInfo]));
					func();
				}
				else{
					spinner.fail('ID did not match any car.');
					func();
				}
			}, 1500)

		})
}

const create = func => {
	inquirer.prompt([
		{
			type: 'input',
			name: 'year',
			message: 'Year of the car is:'
		},
		{
			type: 'input',
			name: 'make',
			message: 'Manufacturer of the car is:'
		},
		{
			type: 'input',
			name: 'model',
			message: 'Model of the car is:'
		},
		{
			type: 'input',
			name: 'price',
			message: 'Price of the car is:'
		},
		{
			type: 'input',
			name: 'inStock',
			message: 'Is car in Stock? Yes/No:'
		}
	])
		.then(answers => {
			const spinner = ora('Processing...').start();
			const newCar = {
				id: nanoid(6),
				...answers
			}
			setTimeout(() => {
				process.stdout.write('\r');
				for(const key in answers){
					if(answers[key] === ''){
						spinner.fail(`All fields are required.`);
						func();
						return
					}
				}
				cars.push(newCar);
				writeJSONFile('./data', 'cars.json', cars);
				spinner.succeed('Car successfully added.');
				inform(createTableDisplay(cars));
				func();
			}, 1500)
		})
}

const editPrompt = func => {
	inquirer.prompt([
		{
			type: 'input',
			name: 'id',
			message: 'What is the ID of the car:'
		}
	])
		.then(answer => {
			const spinner = ora('Finding Match...').start();
			const carIndex = cars.findIndex(car => car.id === answer.id);
			setTimeout(() => {
				process.stdout.write('\r');
				if(carIndex > -1){
					spinner.stop()
					process.stdout.write('\r');
					editCarInfo(answer.id, carIndex, func);
				}
				else{
					spinner.fail('ID did not match any car.');
					func();
				}
			}, 1500)
		})
}

const editCarInfo = (id, carIndex, func) => {
	inquirer.prompt([
		{
			type: 'input',
			name: 'year',
			message: 'Year of the car is:'
		},
		{
			type: 'input',
			name: 'make',
			message: 'Manufacturer of the car is:'
		},
		{
			type: 'input',
			name: 'model',
			message: 'Model of the car is:'
		},
		{
			type: 'input',
			name: 'price',
			message: 'Price of the car is:'
		},
		{
			type: 'input',
			name: 'inStock',
			message: 'Is car in Stock? Yes/No:'
		}
	])
	.then(answers => {
		const spinner = ora('Processing...').start();
		const updatedCarInfo = {
			id: id,
			...answers
		}
		Object.keys(answers).forEach(key => {
			if(!answers[key]) {
				updatedCarInfo[key] = cars[carIndex][key];
			}
		})
		cars.splice(carIndex, 1, updatedCarInfo);
		writeJSONFile('./data', 'cars.json', cars);
		setTimeout(() => {
			process.stdout.write('\r');
			spinner.succeed('Car successfully updated.');
			inform(createTableDisplay(cars));
			func();
		}, 1500)
	})
}

const destroy = func  => {
	inquirer.prompt([
		{
			type: 'input',
			name: 'id',
			message: 'What is the ID of the car:'
		}
	])
		.then(answer => {
			const spinner = ora('Finding Match...').start();
			const carIndex = cars.findIndex(car => car.id === answer.id);
			setTimeout(() => {
				process.stdout.write('\r');
				if(carIndex > -1){
					cars.splice(carIndex, 1);
					writeJSONFile('./data', 'cars.json', cars);
					spinner.succeed('Car successfully removed from collection.');
					inform(createTableDisplay(cars));
					setTimeout(() => func(), 1500);
				}
				else{
					spinner.fail('Car not found. No action taken.');
					func();
				}
			}, 1500);
		})
}
		
const filterBy = func => {
	inquirer.prompt([
		{
			type: 'list',
			name: 'category',
			message: 'Filter by:',
			choices: ['Year', 'Make', 'Stock']
		},
		{
			type: 'input',
			name: 'value',
			message: 'What are you looking for?'
		}
	])
		.then(answers => {
			const spinner = ora('Processing...').start();
			const {category, value} = answers;
			let filteringMatches = [];
			switch(category){
				case 'Year':
					filteringMatches = cars.filter(car => car.year === value);
					break;
				case 'Make':
					filteringMatches = cars.filter(car => car.make.toLowerCase() === value.toLowerCase());
					break;
				case 'Stock':
					filteringMatches = cars.filter(car => car.inStock.toLowerCase() === value.toLowerCase());
					break;
			}
			setTimeout(() => {
				process.stdout.write('\r');
				if(!filteringMatches.length){
					spinner.fail('No matches found.');
					func();
				}
				spinner.succeed('Matches found.');
				inform(createTableDisplay(filteringMatches));
				func();
			}, 1500);
		})
}

const sortBy = func => {
	inquirer.prompt([
		{
			type: 'list',
			name: 'category',
			message: 'Sort by:',
			choices: ['Year', 'Make', 'Price','Stock']
		},
		{
			type: 'list',
			name: 'direction',
			message: 'What way should it be sorted?',
			choices: ['Ascending', 'Descending']
		}
	])
		.then(answers => {
			const spinner = ora('Processing...').start();
			const {category, direction} = answers;
			const sortOrder = direction === 'Ascending' ? 1 : -1;
			const sortedCars = cars.sort((a, b) => {
				let valA, valB;
				switch (category) {
					case 'Year':
						valA = a.year;
						valB = b.year;
						break;
					case 'Make':
						valA = a.make;
						valB = b.make;
						return sortOrder * valA.localeCompare(valB);
					case 'Price':
						valA = a.price;
						valB = b.price;
						break;
					case 'Stock':
						valA = a.inStock;
						valB = b.inStock;
						return sortOrder * valA.localeCompare(valB);
					default:
						return 0; 
				}
				return sortOrder * (valA - valB);
			})
			setTimeout(() => {
				process.stdout.write('\r');
				spinner.succeed('Cars sorted.');
				inform(createTableDisplay(sortedCars));
				func();
			}, 1500);
		})
}

export {
	startSession,
	endSession,
	index,
	show,
	create,
	editPrompt,
	destroy,
	filterBy,
	sortBy
}

