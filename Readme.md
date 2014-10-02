
##Food-Trucks

###Description

Food-Trucks is a Web App that shows a user what food trucks are near his location in San Francisco, using data from [Data SF](https://data.sfgov.org/Permitting/Mobile-Food-Facility-Permit/rqzj-sfat). 

Based on HTML5 Geolocation it can find the user's coordinates [latitude and longitude] and spot him on the map. With the user's coordinates, the app will trigger an AJAX request to the back-end to query all the food trucks that are around him. If the user moves the map, a new request will be made to retrieve the trucks for the new location. All the information is stored in a NoSql database, that can perform geospatial queries based on a given coordinate and a distance.

###Live Demo
http://ancient-chamber-8416.herokuapp.com/

###Stack

	Front-end:  
		Backbone, RequireJS, Bootstrap

		code: 
			/views/index.handlebars
			/webapp/scripts

	Back-end: 
		Node.js, Express
		
		APIs:

		Retrieve Food Trucks from the data base.

			http://domain/api/trucks?lat=[latitude]&lon=[longitude]
		
		Update the database with the information from the SODA API(SF Data). 

			http://domain/api/trucks/update

		code: 
			/config/routes.js
			/app/controllers/trucks.js
			/app/models/truck.js


	Database: MongoDB

###Technical Choices

Libraries:

*Backbone to organize and handle all the user interaction dynamically.  

*RequireJS to manage dependencies (Backbone, google API, custom javascript code). Even though it's a small project, it's good to start with a structure.

*NodeJs with Express to create a light-weight REST/JSON API server. NodeJs is fast, and requires a small amount of memory to run.

*MongoDB to store all the records in a local database and have fast access to the data instead of requesting it to the SF Data API (decrease latency). MongoDB also has the capability to execute geospatial queries to find all the records that are near a given coordinate, instead of manually doing a query by coordinates and distance.


###Tests

A series of tests were created using "mocha". The tests are aimed at the backend, testing the API and the database CRUD operations. All tests execute the application in a "test" environment (different database)

```bash
  $ npm test
```
code: /tests

###Improvements

	*Query food trucks by different a different radius
	*Error handling to display a proper error message when something comes up
	*Create test cases for the front end.
	*Query food trucks by food items
	*Find a food truck by name
	*Full text search
	*Improve the UI
	*Add push notifications over websockets in case a truck's location changes.

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
