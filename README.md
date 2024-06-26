# Pursuit Cars Inventory - Command Line Application Project

## Project Description

A command line application to navigate and edit/view all the cars in the inventory. With the help of the Filing System library from Nodejs, user is able to write and read a JSON file, where all cars are stored.
In addition, to have a better user experience, the implementation of the following libraries were made:

- Inquirer: Allows application to gather user input, by giving a quick and easy user interaction.
- Cli-table: Allows application to create a data table of all cars, which serves as a better visual for when data is presented to the user.
- Ora: Allows application to have a loading feature and succed/fail messages, which serves as a way to let user know what's going on.

## How to Get Application Running

- npm run start: User needs to input this in the command line, which will get application running.

## Main Application Commands

Once application is running, these will be the main commands to choose from, in order to navigate the application.

- View All Cars: This command will create a table of all the cars in the inventory.
- View a Car: This command will first make user pick a car's ID from a list provided, and then create a table to display the selected car.
- Inventory's Net Worth: This command will calcualte and show the net worth of the inventory in dollars.
- Compare Cars: This command will first ask for two required car's ID, and then with the option of adding more or not. Once selections were made, it will create a table displaying the cars selected.
- Filter Cars: This command will first ask user to choose a category: Year, Make, and Stock. Then ask user to pick a value from a list provided. Once choice was made, it will create a table of all cars that met the criteria.
- Sort Cars: This command will first ask user to choose a category: Year, Make, Price, and Stock. Then ask user, the direction they desire the list to go, ascending or descending. Once choices were made, it will create a table to display the cars sorted the way user intended.
- Add Car to Inventory: This command will ask user to input data relevant to the car being added, data like: Year, Manufacturer, Model, Price, In/Out Stock. If all fields were filled, car will be added, if not, command will start over from the beginning.
- Update Car Info: This command will first ask for a car's ID, then allow user to fill each field required when car was first created. However, command won't start over if a field or fields were left empty, instead it will assume user wants that field to stay the same. Therefore, the previous data for those fields or field will be kept.
- Delete Car/s from Inventory: This command will ask user to pick a car's ID from a list provided, and then ask if user wants to pick another car to be deleted. If yes, command will start over as many times user wants to. Else, it will delete all cars, or car, selected from the inventory.
- Add Car/s to Cart: This command allows user to add in-stock car/s, (also prevents user to add cars that are already in the cart), to a cart, and then check if user is content with the selections. User can choose to confirm selections, which will add selected cars to the cart and then display the cart(See Cart command called). User can choose to edit selections by removing specific car/s not to be added to cart. Finally, user can choose to cancel the process, which won't add anything to the cart.
- See Cart: This command allows user to see all cars in the cart and the total worth of the cart. User can choose to buy the car/s, which will empty the cart and also remove bought car/s from inventory. User can choose to remove car/s from cart by emptying the cart with just one command or manually choose which car/s to remove. Finally, user can also choose to not change cart at all, and come back to it later, since data is store in JSON file.
- Remove Car/s from Cart: This command allows user to remove car/s from cart, either all at once or manually choose the cars. This is to give the user an easy access to removing car/s from the cart, instead of having to go through the process of first seeing the cart.

Finally, after all these commands, the application will always ask user to choose whether or not they want to perfom another command. If user decides not to, the application will end, otherwise, it will keep running as long as the user chooses to.
