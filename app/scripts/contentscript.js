'use strict';

console.log('\'Allo \'Allo! Content script');

var url = '';
var color = '';
var bg_color = '';
var current_url      = window.location.href;
console.log(current_url);

chrome.runtime.sendMessage({method: "getLocalStorage", key: "domainSwitcher"}, function(response) {
	var result = JSON.parse(response.data);
	console.log(result);

	url = result[0]['envs'][0]['url'];
	color = result[0]['envs'][0]['color'];
	bg_color = result[0]['envs'][0]['bg_color'];
});

$(document).ready(function() {

	if (current_url == url) {
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