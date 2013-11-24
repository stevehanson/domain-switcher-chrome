var app = angular.module('angOptions', []);
//angular.module('LocalStorageModule').value('prefix', 'domainSwitcher');

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});


app.controller('ProjectsCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {
	$scope.projects = JSON.parse(localStorage['domainSwitcher']);

	$scope.addEnv = function(project) {
		project.envs.push({url: ''});
	};

	$scope.addProject = function(project) {
		$scope.projects.unshift({ name: 'New Project', editMode: true, envs: [ { url: '' }]});
	};

	$scope.removeProject = function($index) {
		console.log($index);
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
				if(!env.url) {
					project.envs.splice(index, 1);
				}
			});
		});
	};
    
}]);