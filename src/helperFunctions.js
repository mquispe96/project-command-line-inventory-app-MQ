import Table from 'cli-table';

const createTableDisplay = (cars, type) => {
  const table = new Table({
    head:
      type === 'cart'
        ? ['CarID', 'Year', 'Make', 'Model', 'Price']
        : ['CarID', 'Year', 'Make', 'Model', 'Price', 'In-Stock?'],
    colWidths:
      type === 'cart' ? [10, 10, 20, 20, 20] : [10, 10, 20, 20, 20, 20],
    chars: {
      top: '═',
      'top-mid': '╤',
      'top-left': '╔',
      'top-right': '╗',
      bottom: '═',
      'bottom-mid': '╧',
      'bottom-left': '╚',
      'bottom-right': '╝',
      left: '║',
      'left-mid': '╟',
      mid: '─',
      'mid-mid': '┼',
      right: '║',
      'right-mid': '╢',
      middle: '│',
    },
    style: {
      head: ['green'],
      border: ['white'],
    },
  });

  if (type === 'inventory') {
    cars.forEach(car => {
      const formattedPrice = `$ ${car.price}`;
      table.push([
        car.id,
        car.year,
        car.make,
        car.model,
        formattedPrice,
        car.inStock,
      ]);
    });
  } else {
    cars.forEach(car => {
      const formattedPrice = `$ ${car.price}`;
      table.push([car.id, car.year, car.make, car.model, formattedPrice]);
    });
  }

  return table.toString();
};

const formatWords = word =>
  word !== '' ? word[0].toUpperCase() + word.slice(1) : '';

const createChoices = (cars, choiceType) => {
  let choices = [];
  switch (choiceType) {
    case 'id':
      choices = cars.reduce((collect, car) => {
        if (!collect.includes(car.id)) {
          collect.push(car.id);
        }
        return collect;
      }, []);
      break;
    case 'Year':
      choices = cars.reduce((collect, car) => {
        if (!collect.includes(car.year)) {
          collect.push(car.year);
        }
        return collect;
      }, []);
      break;
    case 'Make':
      choices = cars.reduce((collect, car) => {
        if (!collect.includes(car.make)) {
          collect.push(car.make);
        }
        return collect;
      }, []);
      break;
    case 'Stock':
      choices = ['Yes', 'No'];
      break;
  }
  return choices;
};

export {createTableDisplay, createChoices, formatWords};
