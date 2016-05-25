var app = angular.module('angOptions', []);


app.controller('ProjectsCtrl', ['$rootScope', '$scope', '$filter', function($rootScope, $scope, $filter) {
	var data = localStorage['domainSwitcher'];
	if(data != null) {
		$scope.projects = JSON.parse(data);
	} else {
		$scope.projects = [];
	}

	$scope.addEnv = function(project) {
		project.envs.push({url: ''});
	};

	$scope.makeTemplate = function(project) {
		$scope.projects.forEach(function(value, index) {
			$scope.projects[index].isTemplate = (project == value);
		});
	}
	$scope.getTemplate = function() {
		var templates = $filter('filter')($scope.projects, {isTemplate: true});
		if (templates.length > 1) {
			console.error('Multiple templates not supported, taking the first');
		}
		if (template = templates.pop()) {
			console.log('Template found', template);
			return template;
		}
	}

	$scope.addProject = function(project) {
		var data = { name: '', editMode: true, isTemplate: false, envs: []}
		var template = $scope.getTemplate();
		if (template) {
			var liveDomain = window.prompt('Enter the live domain to create from a template (or leave empty)');
			if (liveDomain) {
				template.envs.forEach(function(value) {
					var templateUrl = value.url;
					var generatedUrl = templateUrl.replace("$$", liveDomain.replace('www.', ''));
					generatedUrl = generatedUrl.replace("$", liveDomain);
					data.envs.push({url: generatedUrl});
				});
			} else {
				data.envs.push({ url: '' });
			}
		}
		$scope.projects.unshift(data);
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