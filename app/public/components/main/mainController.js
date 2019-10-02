(function() {
  'use strict';

  function mainController($scope, $http) {
    var self = this;

    // Set all public methods of the controller
    self.init = init;
    self.nextWeek = nextWeek;
    self.prevWeek = prevWeek;
    self.array = array;
    self.createDriver = createDriver;
    self.deleteDriver = deleteDriver;

    // Reference for each day as to which driver was most recently clicked
    self.selectedDriver = [];

    // A customizable list representing the days of the week that have practice
    self.week = [
      {
        name: 'Mon',
        numDrivers: 2
      },
      {
        name: 'Tues',
        numDrivers: 0
      },
      {
        name: 'Wed',
        numDrivers: 2
      },
      {
        name: 'Thurs',
        numDrivers: 2
      },
      {
        name: 'Fri',
        numDrivers: 0
      },
      {
        name: 'Sat',
        numDrivers: 0
      },
      {
        name: 'Sun',
        numDrivers: 2
      }
    ];

    init();

    // Initialize the app for today's date
    function init() {
      self.today = moment();
      var monday = moment(self.today).startOf('isoWeek');
      loadWeek(monday);
    }

    // Based off of the given start day (should be a Monday), assign date values
    // for all days in self.week
    function loadWeek(startDay) {
      for (var i = 0; i < self.week.length; i++) {
        if (self.week[i].name === 'Mon') {
          self.week[i].date = moment(startDay);
        } else if (self.week[i].name === 'Wed') {
          self.week[i].date = moment(startDay).add(2, 'day');
        } else if (self.week[i].name === 'Thurs') {
          self.week[i].date = moment(startDay).add(3, 'day');
        } else if (self.week[i].name === 'Sun') {
          self.week[i].date = moment(startDay).add(6, 'day');
        }

        // self.week[i].date = moment(startDay);
        // startDay.add(1, 'day');
      }
      getDrivers();
    }

    // Loads the previous week
    function prevWeek() {
      var prevMonday = self.week[0].date.subtract(1, 'week');
      loadWeek(prevMonday);
    }

    // Loads the next week
    function nextWeek() {
      var nextMonday = self.week[0].date.add(1, 'week');
      loadWeek(nextMonday);
    }

    // Display a green, success status message with the given text
    function statusSuccess(text) {
      self.statusSuccess = text;
      self.statusFailure = '';
    }

    // Display a red, failure status message with the given text
    function statusFailure(text) {
      self.statusSuccess = '';
      self.statusFailure = text;
    }

    // Creates an empty array of length n (for use in HTML)
    function array(n) {
      return new Array(n);
    }

    // Gets all drivers for the current week
    function getDrivers() {
      self.driverPlaceholder = 'Loading...';
      $http.get('/drivers/week/' + self.week[0].date.format('MM-DD-YYYY'))
        .then(getDriversSuccess)
        .catch(getDriversFailure);
    }

    // Callback to be called if getDrivers succeeds
    function getDriversSuccess(res) {
      self.driverPlaceholder = '<none>';
      for (var i = 0; i < self.week.length; i++) {
        self.week[i].drivers = res.data[i];
      }
    }

    // Callback to be called if getDrivers fails
    function getDriversFailure(err) {
      self.driverPlaceholder = 'Error!';
      statusFailure('Failed to get drivers. ' + err.status);
      console.log(err);
    }

    // Creates a new driver with the given name and date
    function createDriver(name, date) {
      if (!name || !date) {
        statusFailure('Invalid name!');
        return;
      }

      $http.post('/drivers', {
        name: name,
        date: date.format('MM-DD-YYYY')
      }, {
        'Content-Type': 'application/json'
      }).then(createDriverSuccess)
        .catch(createDriverFailure);
    }

    // Callback to be called if createDriver succeeds
    function createDriverSuccess(res) {
      statusSuccess('Saved new driver: ' + res.data.name);
      self.statusFailure = '';
      getDrivers();
    }

    // Callback to be called if createDriver fails
    function createDriverFailure(err) {
      statusFailure('Failed to create driver. ' + err.status);
      console.log(err);
    }

    // Deletes the given driver
    function deleteDriver(driver) {
      $http.delete('/drivers/' + driver._id)
        .then(deleteDriverSuccess)
        .catch(deleteDriverFailure);
    }

    // Callback to be called if deleteDriver succeeds
    function deleteDriverSuccess() {
      statusSuccess('Driver deleted.');
      getDrivers();
    }

    // Callback to be called if deleteDriver fails
    function deleteDriverFailure(err) {
      statusFailure('Failed to delete driver. ' + err.status);
      console.log(err);
    }
  }

  angular.module('main').controller('mainController', mainController);
})();
