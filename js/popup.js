
// chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
//     var url = tabs[0].url;
//     console.log('URL from popup::::::::: ');
//     console.log(url);
// });

// chrome.tabs.getSelected(null,function(tab) {
//     var tablink = tab.url;
//     console.log('URL from popup::::::::: ');
//     console.log(tablink);
// });

// var url = null;
// chrome.windows.getCurrent(function(win) {
//     chrome.tabs.query({'windowId': win.id, 'active': true}, function(tabs){
//           url = tabs[0].url;
// 		  console.log('URL from popup::::::::: ');
//     	  console.log(url);
//     });
//   });

$(document).ready(function() {

	//console.log("PAGE LOADED::: " + url);

	$('ul.domains li').click(function() {
		url = $(this).text();
		//console.log("Clicked url: " + url);
		// chrome.tabs.getCurrent(function(tab) {
		//	chrome.tabs.update(tab.id, {url: url});
		// });

		// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		//   chrome.tabs.sendMessage(tabs[0].id, {url: url}, function(response) {
		//     console.log("received response");
		//   });
		// });

		chrome.runtime.sendMessage({url: url}, function(response) {
			console.log("response received " + url);
		});


	});

	$('#settings').click(function(e) {
		chrome.tabs.create({'url': chrome.extension.getURL("options.html") } );
		e.preventDefault();
	});

});

var app = angular.module('angOptions', []);


app.controller('UrlsCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {
	$scope.projects = JSON.parse(localStorage['domainSwitcher']);
	console.log('----------------angular init-----------');
	//$scope.envs = getEnvsForCurrentUrl(document.URL);
	//$scope.envs = ['plantour.dev', 'uat2.plantour.com'];
	

	$scope.getEnvsForCurrentUrl = function(currentUrl) {


		// get active tab ID from current window
// chrome.tabs.query({
// 	active: true,	// select active tabs
// 	windowID: win	// in current window
// }, function(array_of_Tabs) {
// 	tab = array_of_Tabs[0];	// array should have only 1 element
// 	console.log("CURRENT TAB::");
// 	console.log(tab);
// });


		console.log('herererer');
		var found = false;
		var projects = $scope.projects;
		console.log("current url: " + currentUrl);
		var currentUrl = new Uri(currentUrl);
		console.log("current url: " + currentUrl.host());
		projects.forEach(function(project) {
			if(found) return false; // break
			project.envs.forEach(function(env) {
				env = new Uri(env.url);
				console.log('checking ' + env.host());
				if(env.host() == currentUrl.host()) {
					console.log("host matched " + env.host());

					found = project.envs.map(function(env){ 
						if(env.url) // not empty or null 
							return env.url; 
					}).filter(function(env) {
						return (env); // filter out empty or null
					});
					return false; // break
				}
			});
		});
		console.log('done');
		console.log(found);
		console.log('done done');
		return found;
	};

	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
	    var url = tabs[0].url;
	    console.log('URL from popup::::::::: ');
	    console.log(url);
	    console.log($scope);
	    $scope.envs = $scope.getEnvsForCurrentUrl(url);
	    $scope.$apply();
	});
	
    
}]);