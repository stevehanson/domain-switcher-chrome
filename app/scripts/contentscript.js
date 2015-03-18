'use strict';

console.log('\'Allo \'Allo! Content script');

var url = '';
var color = '';
var bg_color = '';
var current_url = window.location.href.replace(/(https?:\/\/w*.)/g, '');

chrome.runtime.sendMessage({method: "getLocalStorage", key: "domainSwitcher"}, function(response) {
	var response = JSON.parse(response.data);
	var envs = response[0]['envs'];

	$.each(envs, function(index, value) {
		if (current_url.indexOf(value['url']) == 0) {
			console.log(envs[index]['url']);

			url = envs[index]['url'];
			color = envs[index]['color'];
			bg_color = envs[index]['bg_color'];
		}
	});
});

$(document).ready(function() {
	if (current_url.indexOf(url) == 0) {
		var element = '<div class="domain-switcher-bar" style="background-color:'
		+ bg_color
		+ '; color:'
		+ color
		+ '">'
		+ url
		+ '</div>'
		$('body').append(element);
	}
});