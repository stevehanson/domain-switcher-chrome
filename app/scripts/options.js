var app = angular.module('angOptions', []);


app.controller('ProjectsCtrl', ['$rootScope', '$scope', '$filter', '$location', function($rootScope, $scope, $filter, $location) {
	var data = localStorage['domainSwitcher'];

	$scope.templateSamples = ['Eg: $', 'Eg: $$.staging.example.com', 'Eg: localhost/$', 'Eg: $$.testing.example.com',
		'Eg: $.something.example.com', 'Eg: $.somedeveloper.example.com', 'Eg: test-at-live.$', 'no more examples',
		'really', 'stop it', 'thanks'];

	if(data != null) {
		$scope.projects = JSON.parse(data);
	} else {
		$scope.projects = [];
	}

	$scope.addEnv = function(project) {
		project.envs.push({url: ''});
	};

	$scope.addTemplate = function() {
		var data = { name: '', editMode: true, isTemplate: true,
			envs: [ { url: '' }, { url: '' }, { url: '' } ]}; // Show 3 samples
		$scope.projects.unshift(data);
	}

	$scope.getTemplate = function() {
		var templates = $filter('filter')($scope.projects, {isTemplate: true});
		if (templates.length > 1) {
			console.error('Multiple templates not supported, taking the first');
		}
		if (template = templates.pop()) {
			return template;
		}
	}

	/**
	 * Start drafting a new project
	 * If mainDomain
	 */
	$scope.draftProject = function(domain) {
		var data = { name: '', editMode: true, isTemplate: false, envs: []};
		data.envs = angular.copy($scope.getTemplate().envs);

		$(draftModal).modal().show();

		$scope.draftingProject = data;

		if (domain) {

			// detect main domain (if matching any pattern, longest string first)
			var envs = angular.copy($scope.getTemplate().envs);
			envs.sort(function(a, b){
				return b.url.length - a.url.length;
			});
			envs.some(function(env) {
				var pattern = env.url.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\|]/g, "\\$&");
				pattern = pattern.replace('$$', "(.*)");
				pattern = pattern.replace('$', "(.*)");
				var matches = domain.match(pattern);
				if (matches) {
					domain = matches[1];
					return true;
				}
			});

			$scope.draftingProject.mainDomain = domain;
			$scope.updateDraft();
		}
	};

	/**
	 * Update a draft's data (regenerate final URLs based on mainDomain)
     */
	$scope.updateDraft = function()
	{
		var liveDomain = $scope.draftingProject.mainDomain;
		var i = 0;
		template = $scope.getTemplate();
		template.envs.forEach(function(value) {
			var templateUrl = value.url;
			var generatedUrl = templateUrl.replace("$$", liveDomain.replace('www.', ''));
			generatedUrl = generatedUrl.replace("$", liveDomain);
			$scope.draftingProject.envs[i].url = generatedUrl;
			i++;
		});
	}

	/**
	 * Add the current draft as new project and reset draft
     */
	$scope.submitDraft = function() {
		$(draftModal).modal('hide');
		$scope.projects.unshift(angular.copy($scope.draftingProject));
		$scope.draftingProject = null;
	}

	$scope.addProject = function(liveDomain) {
		var data = { name: '', editMode: true, isTemplate: false, envs: []}
		var template = $scope.getTemplate();
		if (template) {
			var liveDomain = window.prompt('Enter the live domain to create from a template (or leave empty)', liveDomain);
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
		} else {
			if (liveDomain) {
				data.envs.push({ url: liveDomain });
			} else {
				data.envs.push({ url: '' });
			}
		}
		$scope.projects.unshift(data);
	};

	$scope.removeProject = function($project) {
		var $index = $scope.projects.indexOf($project);
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

	$scope.init = function() {
		angular.element(document).ready(function () {
			// via add new environment function
			$scope.$apply(function() {
				if ($location.search().newDomain) {
					$scope.draftProject($location.search().newDomain);
				}
			});
		});
	}

}]);