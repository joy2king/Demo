
angular.module('MyApp',['ngMaterial','ngMessages'])

    .controller('AppCtrl', function($scope) {
        $scope.project = {
            description: 'Nuclear Missile Defense System',
            rate: 500,
            special: true
        };

        $scope.submit = function(){

            $scope.data = [
                ["Description", $scope.project.description],
                ["Rate", $scope.project.rate],
                ["Special", $scope.project.special],
                ["Client Name",$scope.project.clientName],
                ["Project Type",$scope.project.type],
                ["Client Email",$scope.project.clientEmail]
            ];
             $scope.listMajors();
        };

        // Client ID and API key from the Developer Console
        var CLIENT_ID = '619070640622-hhtu3sirvj0ujhkbt4aorj66tkovhtp4.apps.googleusercontent.com';

        // Array of API discovery doc URLs for APIs used by the quickstart
        var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

        // Authorization scopes required by the API; multiple scopes can be
        // included, separated by spaces.
        var SCOPES = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.profile";

        var  googleAuth = null;

        var googleUser = null;
        $scope.userInfo = null;

        var authorizeButton = document.getElementById('authorize-button');
        var signoutButton = document.getElementById('signout-button');

        /**
         *  On load, called to load the auth2 library and API client library.
         */
        $scope.handleClientLoad = function () {
            gapi.load('client:auth2', $scope.initClient);
        };

        /**
         *  Initializes the API client library and sets up sign-in state
         *  listeners.
         */
        $scope.initClient = function() {
            gapi.client.init({
                discoveryDocs: DISCOVERY_DOCS,
                clientId: CLIENT_ID,
                scope: SCOPES
            }).then(function () {
                // Listen for sign-in state changes.
                googleAuth = gapi.auth2.getAuthInstance();
                googleUser = googleAuth.currentUser.get();
                $scope.userInfo = googleUser.getBasicProfile();
                setTimeout(function(){
                    $scope.$apply();
                },1000)
                googleAuth.isSignedIn.listen($scope.updateSigninStatus);


                // Handle the initial sign-in state.
                $scope.updateSigninStatus(googleAuth.isSignedIn.get());
                authorizeButton.onclick = $scope.handleAuthClick;
                signoutButton.onclick = $scope.handleSignoutClick;
            });
        };

        /**
         *  Called when the signed in status changes, to update the UI
         *  appropriately. After a sign-in, the API is called.
         */
        $scope.updateSigninStatus = function (isSignedIn) {

            if (isSignedIn) {
                authorizeButton.style.display = 'none';
                signoutButton.style.display = 'block';

            } else {
                authorizeButton.style.display = 'block';
                signoutButton.style.display = 'none';
            }
        };

        /**
         *  Sign in the user upon button click.
         */
        $scope.handleAuthClick = function(event) {
            googleAuth.signIn();
            googleUser = googleAuth.currentUser.get();
            $scope.userInfo = googleUser.getBasicProfile();
            setTimeout(function(){
                $scope.$apply();
            },1000)
        };

        /**
         *  Sign out the user upon button click.
         */
        $scope.handleSignoutClick = function(event) {
            googleAuth.signOut();
            $scope.userInfo = null;
            $scope.$apply();
        };

        /**
         * Append a pre element to the body containing the given message
         * as its text node. Used to display the results of the API call.
         *
         * @param {string} message Text to be placed in pre element.
         */
        $scope.appendPre = function (message) {
            var pre = document.getElementById('content');
            var textContent = document.createTextNode(message + '\n');
            pre.appendChild(textContent);
        };

        //noinspection JSAnnotator
        /**
         * Print the names and majors of students in a sample spreadsheet:
         * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
         */
        $scope.listMajors = function(){
            gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: '1MyPIjWxlr5Yxr8QCVg5ZrgxZlwHFrAnW_AefOBwPLlk',
                range: 'DATA1!A1:H7',
                valueInputOption:"USER_ENTERED",

                resource:{
                    "majorDimension":"COLUMNS",
                    "range":"DATA1!A1:H7",
                    "values":$scope.data

                }

            }).then(function(response) {
                window.alert("Data Submitted !");
            }, function(response) {
                appendPre('Error: ' + response.result.error.message);
            });
        }
        $scope.handleClientLoad();

    })
    .config(function($mdThemingProvider) {

        // Configure a dark theme with primary foreground yellow

        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('yellow')
            .dark();

    });


/**
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that can be foundin the LICENSE file at http://material.angularjs.org/HEAD/license.
 **/
