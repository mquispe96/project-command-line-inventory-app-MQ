// const Table = require('cli-table');
import Table from "cli-table";

const createTableDisplay = cars => {
	const table = new Table({
		head: ['CarID', 'Year', 'Make', 'Model', 'Price', 'In-Stock?'],
		colWidths: [10, 10, 20, 20, 20, 20],
		chars: {
        'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗',
        'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝',
        'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼',
        'right': '║', 'right-mid': '╢', 'middle': '│'
    },
    style: {
        head: ['green'],
        border: ['white']
    }
	});

	cars.forEach(car => {
		const formattedPrice = `$ ${car.price}`;
		table.push([car.id, car.year, car.make, car.model, formattedPrice, car.inStock])
	});

	return table.toString();
}

export {
	createTableDisplay
}
