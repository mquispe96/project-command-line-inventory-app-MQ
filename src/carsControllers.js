const {nanoid} = require('nanoid');

const inform = console.log;

const create = (cars, carInfo) => {
	const [carYear, carMake, carModel] = carInfo.split(' ');
	const car = {
		id: nanoid(4),
		year: carYear,
		make: carMake,
		model: carModel
		};
	cars.push(car);
	return cars;
}

const index = cars => cars.map(car => `${car.id} - ${car.year} ${car.make} ${car.model}`).join('\n');

const show = (cars, carId) => {
	const car = cars.find(car => car.id === carId);
	return `${car.id} - ${car.year} ${car.make} ${car.model}`;
}

const destroy = (cars, carId)  => {
	const index = cars.findIndex(car => car.id === carId);
	if(index > -1){
		cars.splice(index, 1);
		inform('Car successfully removed from collection');
		return cars;
	}
	else{
		inform('Car not found. No action taken');
		return cars;
	}
}

const edit = (cars, carId, updatedCar) => {
	const [carYear, carMake, carModel] = updatedCar.split(' ');
	const index = cars.findIndex(car => car.id === carId);
	if(index > -1){
		cars[index].id = carId;
		cars[index].year = carYear === 'Same' ? cars[index].year : carYear;
		cars[index].make = carMake === 'Same' ? cars[index].make : carMake;
		cars[index].model = carModel === 'Same' ? cars[index].model : carModel;
		inform('Car successfully updated');
		return cars;
	}
	else{
		inform('Car not found. No action taken');
		return cars;
	}
}
		
module.exports = {
	create,
	index,
	show,
	destroy,
	edit
}

