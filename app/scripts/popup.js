$(document).ready(function() {
	$('#settings').blur();
});
	

var app = angular.module('angOptions', []);


app.controller('UrlsCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {
	$scope.projects = JSON.parse(localStorage['domainSwitcher']);

	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
		var url = tabs[0].url;
		$scope.url = new Uri(url);
		$scope.envs = chrome.extension.getBackgroundPage().getEnvsForCurrentUrl($scope.projects, url);
		$scope.updateActive();
		$scope.$apply();
	});

	$scope.selectEnv = function(url, event) {
		console.log('selectEnv:', url, event);
		chrome.runtime.sendMessage({
			url: url,
			openInNewTab: (event.altKey || event.ctrlKey || event.metaKey)
		}, function(rsp){});
		window.close();
	};

	$scope.addProject = function() {
		chrome.tabs.create({'url': chrome.extension.getURL("options.html#?newDomain=" + $scope.url.host()) } );
	};

	$scope.loadSettings = function() {
		chrome.tabs.create({'url': chrome.extension.getURL("options.html") } );
	};

	$scope.urlMatches = function(url) {
		if(url.indexOf('://') == -1) {
			url = 'http://' + url;
		}
		return chrome.extension.getBackgroundPage().urlsMatch($scope.url, new Uri(url));
	};

	$scope.updateActive = function() {
		$scope.envs.forEach(function(env) {
			if($scope.urlMatches(env.url)) {
				env.active = true;
			} else {
				env.active = false;
			}
		});
	};
    
}]);