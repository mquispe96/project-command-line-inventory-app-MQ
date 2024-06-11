const {readJSONFile, writeJSONFile} = require('./src/dataHandler');
const {create, index, show, destroy, edit} = require('./src/carsControllers');

const inform = console.log;

const run = () => {
	const action = process.argv[2];
	const car = process.argv[3];
	const cars = readJSONFile('./data', "cars.json");
	let writeToFile = false;
	let updatedCars = [];

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
	}

	if (writeToFile) {
		writeJSONFile("./data", "cars.json", updatedCars);
	}	
}

run();
