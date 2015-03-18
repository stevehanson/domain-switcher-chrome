'use strict';

var url = '';
var color = '';
var bg_color = '';
var text = '';
var current_url = window.location.href.replace(/(https?:\/\/w*.)/g, '');

chrome.runtime.sendMessage({method: "getLocalStorage", key: "domainSwitcher"}, function(response) {
	var response = JSON.parse(response.data);
	var envs = response[0]['envs'];

	$.each(envs, function(index, value) {
		if (current_url.indexOf(value['url']) == 0) {
			url = envs[index]['url'];
			color = envs[index]['color'];
			bg_color = envs[index]['bg_color'];
			text = envs[index]['text'];
		}
	});

	addBanner();
});

function addBanner () {
	$(document).ready(function() {
		if (current_url.indexOf(url) == 0) {
			var element = '<div class="domain-switcher-bar" style="background-color:'
			+ bg_color
			+ '; color:'
			+ color
			+ '">'
			+ text
			+ '</div>'
			$('body').append(element);
		}
	});
}