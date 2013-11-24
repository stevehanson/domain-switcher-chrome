var app = angular.module('angOptions', []);


app.controller('UrlsCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {
	$scope.projects = JSON.parse(localStorage['domainSwitcher']);

	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
		var url = tabs[0].url;
		console.log('URL from popup::::::::: ');
		console.log(url);
		console.log($scope);
		$scope.envs = chrome.extension.getBackgroundPage().getEnvsForCurrentUrl($scope.projects, url);
		$scope.$apply();
	});
	
	$scope.selectEnv = function(url) {
		console.log("Clicked url: " + url);

		chrome.runtime.sendMessage({url: url}, function(response) {
			console.log("response received " + url);
		});
	};

	$scope.loadSettings = function() {
		chrome.tabs.create({'url': chrome.extension.getURL("options.html") } );
	};
    
}]);