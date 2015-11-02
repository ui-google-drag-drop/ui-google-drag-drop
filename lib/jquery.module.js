/*! angular-google-maps-drag-drop 2.1.5 2015-08-26
 *  AngularJS directives for JQuery
 *  git: https://github.com/
 */
var lodashCreator = function($window){ 
	var $j = jQuery;
	//delete $window.jQuery; //uncomment if you want to remove jQuery from the window object
	return $j;
	}

module = angular.module("jQuerymodule",[]);
module.factory('jQuery', ['$window',lodashCreator]);