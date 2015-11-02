/*! angular-google-maps-drag-drop 2.1.5 2015-08-26
 *  AngularJS directives for Loadash
 *  git: https://github.com/
 */
var lodashCreator = function($window){ 
	var _ = $window._;
	//delete $window._; //uncomment if you want to remove _ from the window object
	return _;
	}

module = angular.module("lodashmodule",[]);
module.factory('lodash', ['$window',lodashCreator]);