
$(document).ready(function() {

	$('.add-button').click(function(e) {
		alert('here');
		$('#fg-1').append('<input type="text" class="form-control">');
		e.preventDefault();
	});
});

var app = angular.module('angOptions', []);

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});


app.controller('ProjectsCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {
	$scope.projects = [
	{
		name: 'Chairs',
		envs: [
			{
				url: 'http://localhost:8080'
			},
			{
				url: 'http://test.chairs.com'
			},
			{
				url: 'http://chairs.com'
			},
		]
	},
	{
		name: 'Coffee App',
		envs: [
			{
				url: 'http://localhost:3000'
			},
			{
				url: 'http://test.coffee.com'
			},
			{
				url: 'http://coffee.com'
			},
		]
	}
	];

	$scope.addEnv = function(project) {
		project.envs.push({url: ''});
	}

	$scope.addProject = function(project) {
		$scope.projects.unshift({ name: 'New Project', envs: [ { url: '' }]});
	}

	$scope.removeProject = function($index) {
		console.log($index);
		$scope.projects.splice($index, 1);
	}
    
}]);