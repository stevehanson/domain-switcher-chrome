var app = angular.module('angOptions', []);


app.controller('ProjectsCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {
	var data = localStorage['domainSwitcher'];
	if(data != null) {
		$scope.projects = JSON.parse(data);
	} else {
		$scope.projects = [];
	}

	$scope.addEnv = function(project) {
		project.envs.push({url: ''});
		project.envs.push({color: ''});
		project.envs.push({bg_color: ''});
	};

	$scope.addProject = function(project) {
		$scope.projects.unshift({ name: '', editMode: true, envs: [ { url: '' }, { color: '' }, {bg_color: '' }]});
	};

	$scope.removeProject = function($index) {
		$scope.projects.splice($index, 1);
	};

	$scope.save = function() {
		$scope.removeEmptyUrls();
		localStorage['domainSwitcher'] = JSON.stringify($scope.projects, function (key, val) {
			if (key == '$$hashKey') { // remove angular hash-keys to prevent collisions when loading from storage
				return undefined;
			}
			return val;
		});

		chrome.storage.sync.set({'color': '#000'}, function() {
			console.log("Saved");
		});

		$('#save-success').fadeIn().delay(1000).fadeOut();
	};

	$scope.editName = function(project){
		project.editMode = true;
	};

	$scope.doneEditName = function(project){
		project.editMode = false;
	};

	$scope.removeEmptyUrls = function() {
		$scope.projects.forEach(function(project) {
			project.envs.forEach(function(env, index) {
				if(!env.url && !env.color && !env.bg_color) {
					project.envs.splice(index, 1);
				}
			});
		});
	};

}]);