
SF Food Trucks is a WebApp that tells a user what food trucks are neer his location.

###Live Demo
http://107.170.174.64:3000

###Description

A user wants to find the food trucks closest to him. Based on HTML5 Geolocation we can find the user's coordinates [latituted and longuitud] and spot him on the map, then we can query all the food trucks that are within a half mile radius to him.

To retrieve the list of nearby trucks the front-end will call the back-end trucks api, with a given coordinate. The API will return the list of food trucks orderd by closet distance to the user, so the front-end can dislay add a marker for each truck in the list.

Clicking on a marker will display the trucks information, and it will find the trucks info on the left list.

###Stack

	Front-end: Backbone 
		Used Backbone with RequireJS to handle dependency managment

		code: 
			/views/index.handlebars
			/webapp/scripts

	Back-end: Node.js 
		
		APIs:
		Retrieve Food Trucks

		http://domain/api/trucks
		http://domain/api/trucks?limit=50	
		http://domain/api/trucks?lat=[latitude]&lon=[longitude]
		http://domain/api/trucks?lat=[latitude]&lon=[longitude]&radius=[radius]
		
		Populate the database with the list of trucks from the API service. This should be invoked the first time the app is initialzed or whenever there is a need to update all the food trucks information or new food trucks are added.

		http://domain/api/trucks/update

		code: 
			/config/routes.js
			/app/controllers/trucks.js
			/app/models/truck.js


	Database: MongoDB


###Tests

A series of tests were created using mocha. The tests are amid at at the backend, testing the API and the database CRUD operations.

When a test is executed it runs the application in a "test" enviroment, meaning that that port and database are different than "development" or "production".

```bash
  $ npm test
```
code: /tests

###Improvements

Based on a time limitation.
	
	*Find a food truck by name
	*Filter food trucks by food items
	*Full text search
	*Error handling to display a proper error message when something comes up
	*Improve the UI
	*Create test cases for the front end.

#### Installation
```bash
  $ git clone https://github.com/rubenesc/sf-food-trucks.git
  $ cd sf-food-trucks
  $ npm install
  $ bower install
  $ cp config/config.js.example config/config.js
  $ npm start
```
Edit config/config.js with your preferences and configuration.

####Start development server
```bash
  $ ./bin/devserver
```

Visit http://localhost:3000/