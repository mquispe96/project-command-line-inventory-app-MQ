const {nanoid} = require('nanoid');

const {createTableDisplay} = require('./helperFunctions');

const inform = console.log;

const create = (cars, carInfo) => {
	const [carYear, carMake, carModel, carPrice, carStock] = carInfo.split(' ');
	const car = {
		id: nanoid(6),
		year: carYear,
		make: carMake,
		model: carModel,
		price: carPrice,
		inStock: carStock
	};
	cars.push(car);
	return cars;
}

const index = cars => createTableDisplay(cars);

const show = (cars, carId) => {
	const car = cars.find(car => car.id === carId);
	return createTableDisplay([car]);
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
	const [carYear, carMake, carModel, carPrice, carStock] = updatedCar.split(' ');
	const index = cars.findIndex(car => car.id === carId);
	if(index > -1){
		cars[index].id = carId;
		cars[index].year = carYear === '-' ? cars[index].year : carYear;
		cars[index].make = carMake === '-' ? cars[index].make : carMake;
		cars[index].model = carModel === '-' ? cars[index].model : carModel;
		cars[index].price = carPrice === '-' ? cars[index].price : carPrice;
		cars[index].inStock = carStock === '-' ? cars[index].inStock : carStock;
		inform('Car successfully updated');
		return cars;
	}
	else{
		inform('Car not found. No action taken');
		return cars;
	}
}
		
const filterBy = (cars, filterCategory, filterValue) => {
	let filteringMatches = [];
	switch(filterCategory){
		case 'year':
			filteringMatches = cars.filter(car => car.year === filterValue);
			break;
		case 'make':
			filteringMatches = cars.filter(car => car.make.toLowerCase() === filterValue.toLowerCase());
			break;
		case 'stock':
			filteringMatches = cars.filter(car => car.inStock.toLowerCase() === filterValue.toLowerCase());
			break
	}
	if(!filteringMatches.length) return 'No matches found.';
	return createTableDisplay(filteringMatches);
}

const sortBy = (cars, sortCategory, direction) => {
  if (!['a', 'd'].includes(direction)) {
    return 'Sorting direction needs to be "a" for ascending or "d" for descending';
  }
  const sortOrder = direction === 'a' ? 1 : -1;
  const sortedCars = cars.sort((a, b) => {
    let valA, valB;
    switch (sortCategory) {
      case 'year':
        valA = a.year;
        valB = b.year;
        break;
      case 'make':
        valA = a.make;
        valB = b.make;
        return sortOrder * valA.localeCompare(valB);
      case 'price':
        valA = a.price;
        valB = b.price;
        break;
      case 'stock':
        valA = a.inStock;
        valB = b.inStock;
        return sortOrder * valA.localeCompare(valB);
      default:
        return 0; 
    }
    return sortOrder * (valA - valB);
  });
  return createTableDisplay(sortedCars);
};

module.exports = {
	create,
	index,
	show,
	destroy,
	edit,
	filterBy,
	sortBy
}

