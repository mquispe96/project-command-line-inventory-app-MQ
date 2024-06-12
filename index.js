// const figlet = require('figlet');
// const chalk = require('chalk');
// const inquirer = require('inquirer');
// const spinners = require('cli-spinners');
// // const Table = require('cli-table');

const {readJSONFile, writeJSONFile} = require('./src/dataHandler');
const {create, index, show, destroy, edit, filterBy, sortBy	} = require('./src/carsControllers');
const {createTableDisplay} = require('./src/helperFunctions');

const inform = console.log;

const run = () => {
	const action = process.argv[2];
	const car = process.argv[3];
	const cars = readJSONFile('./data', "cars.json");
	let writeToFile = false;
	let updatedCars = [];

	// figlet('Pursuit Cars !', function(err, data) {
	// 		if (err) {
	// 				console.log(chalk.red.bold('Something went wrong...'));
	// 				console.dir(err);
	// 				return;
	// 		}
	// 		console.log(chalk.blue(data));
	// });


	switch(action){
		case 'index':
			const carsView = index(cars);
			inform(carsView);
			break;
		case 'create':
			updatedCars = create(cars, car);
			writeToFile = true;
			break;
		case 'show':
			const carView = show(cars, car)
			inform(carView);
			break;
		case 'update':
			updatedCars = edit(cars, car, process.argv[4]);
			writeToFile = true;
			break;
		case 'destroy':
			updatedCars = destroy(cars, car);
			writeToFile = true;
			break;
		case 'filter':
			const carsFilterView = filterBy(cars, car, process.argv[4]);
			inform(carsFilterView);
			break;
		case 'sort':
			const carsSortView = sortBy(cars, car, process.argv[4]);
			inform(carsSortView);
			break;
	}

	if (writeToFile) {
		writeJSONFile("./data", "cars.json", updatedCars);
		console.log(createTableDisplay(cars))
	}	

}

run();
