import ora from 'ora';
import {nanoid} from 'nanoid';
import figlet from 'figlet';
import chalk from 'chalk';
import inquirer from 'inquirer';

import {
  createTableDisplay,
  createChoices,
  formatWords,
} from './helperFunctions.js';
import {writeJSONFile, readJSONFile} from '../src/dataHandler.js';
const cars = readJSONFile('./data', 'cars.json');
const cart = readJSONFile('./data', 'cart.json');

const startSession = run => {
  figlet('Pursuit Cars !', function (err, data) {
    if (err) {
      console.log(chalk.red.bold('Something went wrong...'));
      console.dir(err);
      return;
    }
    console.log(chalk.blue(data));
  });
  const spinner = ora('Loading App...').start();
  process.stdout.write('\r');
  setTimeout(() => {
    process.stdout.write('\r');
    spinner.stop();
    run();
  }, 1000);
};

const endSession = () => {
  figlet('See Yah !', function (err, data) {
    if (err) {
      console.log(chalk.red.bold('Something went wrong...'));
      console.dir(err);
      return;
    }
    console.log(chalk.blue(data));
  });
};

const inform = console.log;

const index = func => {
  if (!cars.length) {
    inform('No cars are in the inventory.');
    inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'decision',
          message: 'Would you like to add a car to the inventory?',
          default: true,
        },
      ])
      .then(answer => {
        if (answer.decision) {
          create(func);
        } else {
          func();
        }
      });
  } else {
    const spinner = ora('Loading Cars...').start();
    setTimeout(() => {
      process.stdout.write('\r');
      spinner.succeed('Cars Loaded');
      inform(createTableDisplay(cars, 'inventory'));
      func();
    }, 1500);
  }
};

const show = func => {
  if (!cars.length) {
    inform('No cars are in the inventory.');
    inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'decision',
          message: 'Would you like to add a car to the inventory?',
          default: true,
        },
      ])
      .then(answer => {
        if (answer.decision) {
          create(func);
        } else {
          func();
        }
      });
  } else {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'id',
          message: 'Choose an ID:',
          choices: createChoices(cars, 'id'),
        },
      ])
      .then(answer => {
        const spinner = ora('Loading Car...').start();
        const carInfo = cars.find(car => car.id === answer.id);
        setTimeout(() => {
          process.stdout.write('\r');
          spinner.succeed('Car Loaded');
          inform(createTableDisplay([carInfo], 'inventory'));
          func();
        }, 1500);
      });
  }
};

const create = func => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'year',
        message: 'Year of the car is:',
      },
      {
        type: 'input',
        name: 'make',
        message: 'Manufacturer of the car is:',
      },
      {
        type: 'input',
        name: 'model',
        message: 'Model of the car is:',
      },
      {
        type: 'input',
        name: 'price',
        message: 'Price of the car is:',
      },
      {
        type: 'list',
        name: 'inStock',
        message: 'Is car in Stock?:',
        choices: ['Yes', 'No'],
      },
    ])
    .then(answers => {
      const spinner = ora('Processing...').start();
      for (const key in answers) {
        if (answers[key] === '') {
          spinner.fail(`All fields are required.`);
          setTimeout(() => {
            create(func);
          }, 1500);
          return;
        } else if (key !== 'year' || key !== 'price') {
          answers[key] = formatWords(answers[key]);
        }
      }
      const newCar = {
        id: nanoid(6),
        ...answers,
      };
      setTimeout(() => {
        process.stdout.write('\r');
        cars.push(newCar);
        writeJSONFile('./data', 'cars.json', cars);
        spinner.succeed('Car successfully added.');
        inform(createTableDisplay(cars, 'inventory'));
        func();
      }, 1500);
    });
};

const editPrompt = func => {
  if (!cars.length) {
    inform('No cars are in the inventory.');
    inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'decision',
          message: 'Would you like to add a car to the inventory?',
          default: true,
        },
      ])
      .then(answer => {
        if (answer.decision) {
          create(func);
        } else {
          func();
        }
      });
  } else {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'id',
          message: 'Choose an ID:',
          choices: createChoices(cars, 'id'),
        },
      ])
      .then(answer => {
        const spinner = ora('Processing...').start();
        const carIndex = cars.findIndex(car => car.id === answer.id);
        setTimeout(() => {
          spinner.stop();
          process.stdout.write('\r');
          editCarInfo(answer.id, carIndex, func);
        }, 1500);
      });
  }
};

const editCarInfo = (id, carIndex, func) => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'year',
        message: 'Year of the car is:',
      },
      {
        type: 'input',
        name: 'make',
        message: 'Manufacturer of the car is:',
      },
      {
        type: 'input',
        name: 'model',
        message: 'Model of the car is:',
      },
      {
        type: 'input',
        name: 'price',
        message: 'Price of the car is:',
      },
      {
        type: 'list',
        name: 'inStock',
        message: 'Is car in Stock?:',
        choices: ['Yes', 'No', 'No Change'],
      },
    ])
    .then(answers => {
      const spinner = ora('Processing...').start();
      const updatedCarInfo = {
        id: id,
        ...answers,
      };
      Object.keys(answers).forEach(key => {
        if (!answers[key]) {
          updatedCarInfo[key] = cars[carIndex][key];
        }
        if (answers.inStock === 'No Change') {
          updatedCarInfo.inStock = cars[carIndex].inStock;
        }
      });
      cars.splice(carIndex, 1, updatedCarInfo);
      writeJSONFile('./data', 'cars.json', cars);
      setTimeout(() => {
        process.stdout.write('\r');
        spinner.succeed('Car successfully updated.');
        inform(createTableDisplay(cars, 'inventory'));
        func();
      }, 1500);
    });
};

const destroy = (func, selectedIDs = []) => {
  if (!cars.length) {
    inform('No cars are in the inventory to remove.');
    func();
  } else {
    const opts = cars.filter(car => !selectedIDs.includes(car.id));
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'id',
          message: 'Choose an ID:',
          choices: createChoices(opts, 'id'),
        },
        {
          type: 'confirm',
          name: 'continue',
          message: 'Delete another car?',
          default: true,
        },
      ])
      .then(answers => {
        selectedIDs.push(answers.id);
        if (answers.continue && selectedIDs.length !== cars.length) {
          destroy(func, selectedIDs);
        } else {
          let spinner = undefined;
          if (answers.continue) {
            spinner = ora('All cars were selected, processing...').start();
          } else {
            spinner = ora('Processing...').start();
          }
          selectedIDs.forEach(id => {
            const carIndex = cars.findIndex(car => car.id === id);
            cars.splice(carIndex, 1);
          });
          writeJSONFile('./data', 'cars.json', cars);
          setTimeout(() => {
            process.stdout.write('\r');
            if (!cars.length) {
              spinner.succeed('Inventory is empty.');
              func();
            } else {
              spinner.succeed('Car/s successfully removed.');
              inform(createTableDisplay(cars, 'inventory'));
              func();
            }
          }, 1500);
        }
      });
  }
};

const filterBy = func => {
  if (!cars.length) {
    inform('No cars are in the inventory.');
    inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'decision',
          message: 'Would you like to add a car to the inventory?',
          default: true,
        },
      ])
      .then(answer => {
        if (answer.decision) {
          create(func);
        } else {
          func();
        }
      });
  } else {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'category',
          message: 'Filter by:',
          choices: ['Year', 'Make', 'Stock'],
        },
      ])
      .then(answer => {
        const category = answer.category;
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'value',
              message: 'What are you looking for?',
              choices: createChoices(cars, category),
            },
          ])
          .then(answer => {
            const spinner = ora('Processing...').start();
            let filteringMatches = [];
            switch (category) {
              case 'Year':
                filteringMatches = cars.filter(
                  car => car.year === answer.value,
                );
                break;
              case 'Make':
                filteringMatches = cars.filter(
                  car => car.make === answer.value,
                );
                break;
              case 'In-Stock':
                filteringMatches = cars.filter(
                  car => car.inStock === answer.value,
                );
                break;
            }
            setTimeout(() => {
              process.stdout.write('\r');
              spinner.succeed('Cars filtered.');
              inform(createTableDisplay(filteringMatches, 'inventory'));
              func();
            }, 1500);
          });
      });
  }
};

const sortBy = func => {
  if (!cars.length) {
    inform('No cars are in the inventory.');
    inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'decision',
          message: 'Would you like to add a car to the inventory?',
          default: true,
        },
      ])
      .then(answer => {
        if (answer.decision) {
          create(func);
        } else {
          func();
        }
      });
  } else {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'category',
          message: 'Sort by:',
          choices: ['Year', 'Make', 'Price', 'Stock'],
        },
        {
          type: 'list',
          name: 'direction',
          message: 'What way should it be sorted?',
          choices: ['Ascending', 'Descending'],
        },
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
        });
        setTimeout(() => {
          process.stdout.write('\r');
          spinner.succeed('Cars sorted.');
          inform(createTableDisplay(sortedCars, 'inventory'));
          func();
        }, 1500);
      });
  }
};

const compareCars = (func, selectedIDs = []) => {
  if (!cars.length) {
    inform('No cars are in the inventory.');
    inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'decision',
          message: 'Would you like to add a car to the inventory?',
          default: true,
        },
      ])
      .then(answer => {
        if (answer.decision) {
          create(func);
        } else {
          func();
        }
      });
  } else {
    const opts = cars.filter(car => !selectedIDs.includes(car.id));
    if (selectedIDs.length < 1) {
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'id',
            message: 'Choose car ID:',
            choices: createChoices(opts, 'id'),
          },
        ])
        .then(answer => {
          selectedIDs.push(answer.id);
          compareCars(func, selectedIDs);
        });
    } else {
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'id',
            message: 'Choose car ID:',
            choices: createChoices(opts, 'id'),
          },
          {
            type: 'confirm',
            name: 'continue',
            message: 'Do you want to add another car?',
            default: true,
          },
        ])
        .then(answers => {
          selectedIDs.push(answers.id);
          if (answers.continue && selectedIDs.length !== cars.length) {
            compareCars(func, selectedIDs);
          } else {
            let spinner = undefined;
            if (answers.continue) {
              spinner = ora('All cars were chosen, processing...').start();
            } else {
              spinner = ora('Processing...').start();
            }
            const selectedCarsInfo = cars.filter(car =>
              selectedIDs.includes(car.id),
            );
            setTimeout(() => {
              process.stdout.write('\r');
              spinner.succeed('Comparison Ready.');
              inform(createTableDisplay(selectedCarsInfo, 'inventory'));
              func();
            }, 1500);
          }
        });
    }
  }
};

const getInventoryNetWorth = func => {
  if (!cars.length) {
    inform('No cars are in the inventory.');
    inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'decision',
          message: 'Would you like to add a car to the inventory?',
          default: true,
        },
      ])
      .then(answer => {
        if (answer.decision) {
          create(func);
        } else {
          func();
        }
      });
  } else {
    const spinner = ora("Calculating Inventory's Net Worth...").start();
    setTimeout(() => {
      const netWorth = cars.reduce(
        (total, car) => total + Number(car.price),
        0,
      );
      process.stdout.write('\r');
      spinner.succeed(`The Inventory's Net Worth is: $${netWorth}`);
      func();
    }, 1500);
  }
};

const addToCart = (func, selectedIDs = []) => {
  if (!cars.length) {
    inform('No cars are in the inventory.');
    func();
  } else {
    const inStockCars = cars.filter(car => car.inStock === 'Yes');
    if (!inStockCars.length) {
      inform('No cars in-stock, come back soon!');
      func();
    } else {
      const inStockCarsIDs = createChoices(inStockCars, 'id');
      const cartCarIDs = createChoices(cart, 'id');
      const notInCartIDs = inStockCarsIDs.filter(
        id => !cartCarIDs.includes(id),
      );
      if (!notInCartIDs.length) {
        inform('Looks like all available cars are already in your cart.');
        seeCart(func);
      } else {
        const opts = notInCartIDs.filter(id => !selectedIDs.includes(id));
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'id',
              message: 'Choose car ID:',
              choices: opts,
            },
            {
              type: 'confirm',
              name: 'continue',
              message: 'Do you want to add another car?',
              default: true,
            },
          ])
          .then(answers => {
            selectedIDs.push(answers.id);
            if (
              answers.continue &&
              selectedIDs.length !== notInCartIDs.length
            ) {
              addToCart(func, selectedIDs);
            } else {
              let spinner = undefined;
              if (answers.continue) {
                spinner = ora(
                  'All available cars were chosen, processing...',
                ).start();
              } else {
                spinner = ora('Processing...').start();
              }
              const selectedCarsInfo = cars.filter(car =>
                selectedIDs.includes(car.id),
              );
              setTimeout(() => {
                process.stdout.write('\r');
                spinner.succeed(
                  'Car/s successfully selected, and ready to be added to cart.',
                );
                inquirer
                  .prompt([
                    {
                      type: 'list',
                      name: 'decision',
                      message: 'Add cars to cart?',
                      choices: ['Yes', 'Remove Car/s', 'Cancel'],
                    },
                  ])
                  .then(answer => {
                    const spinner = ora('Processing...').start();
                    const {decision} = answer;
                    setTimeout(() => {
                      process.stdout.write('\r');
                      if (decision === 'Yes') {
                        selectedCarsInfo.forEach(car => cart.push(car));
                        writeJSONFile('./data', 'cart.json', cart);
                        spinner.succeed('Cars added to cart');
                        seeCart(func);
                      } else if (decision === 'Remove Car/s') {
                        spinner.stop();
                        removeSelections(selectedCarsInfo, func);
                      } else {
                        spinner.stop();
                        func();
                      }
                    }, 1500);
                  });
              }, 1500);
            }
          });
      }
    }
  }
};

const removeSelections = (selectedCarsInfo, func, selectedIDs = []) => {
  const opts = selectedCarsInfo.filter(car => !selectedIDs.includes(car.id));
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'id',
        message: 'Choose an ID:',
        choices: createChoices(opts, 'id'),
      },
      {
        type: 'confirm',
        name: 'continue',
        message: 'Do you want to remove another car?',
        default: true,
      },
    ])
    .then(answers => {
      selectedIDs.push(answers.id);
      if (answers.continue && selectedIDs.length !== selectedCarsInfo.length) {
        removeSelections(selectedCarsInfo, func, selectedIDs);
      } else {
        let spinner = undefined;
        if (answers.continue) {
          spinner = ora(
            'All selections are set to be remove already...',
          ).start();
        } else {
          spinner = ora('Removing selections...').start();
        }
        selectedIDs.forEach(id => {
          const carIndex = selectedCarsInfo.findIndex(car => car.id === id);
          selectedCarsInfo.splice(carIndex, 1);
        });
        setTimeout(() => {
          process.stdout.write('\r');
          if (!selectedCarsInfo.length) {
            spinner.succeed('No selections left to be added to cart.');
            func();
          } else {
            spinner.succeed('Selections were removed.');
            inquirer
              .prompt([
                {
                  type: 'list',
                  name: 'decision',
                  message: 'What to do next?',
                  choices: [
                    'Add selections to cart',
                    'Remove another car',
                    'Do not add anything to cart',
                  ],
                },
              ])
              .then(answer => {
                const spinner = ora('Processing...').start();
                const {decision} = answer;
                setTimeout(() => {
                  if (decision === 'Add selections to cart') {
                    process.stdout.write('\r');
                    selectedCarsInfo.forEach(car => cart.push(car));
                    writeJSONFile('./data', 'cart.json', cart);
                    const cartTotal = cart.reduce(
                      (total, car) => total + Number(car.price),
                      0,
                    );
                    spinner.succeed('Cars added to cart');
                    inform(createTableDisplay(cart, 'cart'));
                    inform(`Cart Total is: $${cartTotal}`);
                    func();
                  } else if (decision === 'Remove another car') {
                    removeSelections(selectedCarsInfo, func, selectedIDs);
                  } else {
                    func();
                  }
                }, 1500);
              });
          }
        }, 1500);
      }
    });
};

const removeFromCart = func => {
  if (!cart.length) {
    inform('Cart is empty');
    func();
  } else {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'decision',
          message: 'What would you like to do?',
          choices: ['Empty Cart', 'Remove Car/s'],
        },
      ])
      .then(answer => {
        const {decision} = answer;
        const spinner = ora('Processing...').start();
        setTimeout(() => {
          process.stdout.write('\r');
          if (decision === 'Empty Cart') {
            cart.length = 0;
            writeJSONFile('./data', 'cart.json', cart);
            spinner.succeed('Cart emptied');
            func();
          } else {
            spinner.stop();
            removeCar(func);
          }
        }, 1500);
      });
  }
};

const removeCar = (func, selectedIDs = []) => {
  const opts = cart.filter(car => !selectedIDs.includes(car.id));
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'id',
        message: 'Choose an ID:',
        choices: createChoices(opts, 'id'),
      },
      {
        type: 'confirm',
        name: 'continue',
        message: 'Would you like to remove another car?',
        default: true,
      },
    ])
    .then(answers => {
      selectedIDs.push(answers.id);
      if (answers.continue && selectedIDs.length !== cart.length) {
        removeCar(func, selectedIDs);
      } else {
        let spinner = undefined;
        if (answers.continue) {
          spinner = ora('All cars were selected, processing...').start();
        } else {
          spinner = ora('Processing...').start();
        }
        selectedIDs.forEach(id => {
          const carIndex = cart.findIndex(car => car.id === id);
          cart.splice(carIndex, 1);
        });
        writeJSONFile('./data', 'cars.json', cart);
        setTimeout(() => {
          process.stdout.write('\r');
          if (!cart.length) {
            spinner.succeed('Cart emptied');
            func();
          } else {
            spinner.succeed('Cars remove from cart successfully.');
            seeCart(func);
          }
        }, 1500);
      }
    });
};

const seeCart = func => {
  if (!cart.length) {
    inform('Cart is empty.');
    inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'decision',
          message: 'Would you like to add a car to the cart?',
          default: true,
        },
      ])
      .then(answer => {
        if (answer.decision) {
          addToCart(func);
        } else {
          func();
        }
      });
  } else {
    const spinner = ora('Creating Cart table...').start();
    const cartTotal = cart.reduce((total, car) => total + Number(car.price), 0);
    setTimeout(() => {
      process.stdout.write('\r');
      spinner.succeed('Cart ready.');
      inform(createTableDisplay(cart, 'cart'));
      inform(`Cart's total is: ${cartTotal}`);
      buyDecision(func);
    }, 1500);
  }
};

const buyDecision = func => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'decision',
        message: 'What would you like to do?',
        choices: ['Buy Cars', 'Remove Car/s', 'Leave Cart Window'],
      },
    ])
    .then(answer => {
      const {decision} = answer;
      const spinner = ora('Processing...').start();
      setTimeout(() => {
        process.stdout.write('\r');
        if (decision === 'Buy Cars') {
          const carsBought = cart.map(car => car.id);
          carsBought.forEach(id => {
            const carIndex = cars.findIndex(car => car.id === id);
            cars.splice(carIndex, 1);
          });
          cart.length = 0;
          writeJSONFile('./data', 'cars.json', cars);
          writeJSONFile('./data', 'cart.json', cart);
          spinner.succeed('Car/s successfully bought, congrats.');
          func();
        } else if (decision === 'Remove Car/s') {
          spinner.stop();
          removeFromCart(func);
        } else {
          spinner.stop();
          func();
        }
      }, 1500);
    });
};

export {
  startSession,
  endSession,
  index,
  show,
  create,
  editPrompt,
  destroy,
  filterBy,
  sortBy,
  compareCars,
  getInventoryNetWorth,
  addToCart,
  removeFromCart,
  seeCart,
};
