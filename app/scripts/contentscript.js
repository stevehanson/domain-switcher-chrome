'use strict';

console.log('\'Allo \'Allo! Content script');

var url = '';
var color = '';
var bg_color = '';

chrome.runtime.sendMessage({method: "getLocalStorage", key: "domainSwitcher"}, function(response) {
  var result = JSON.parse(response.data);
  console.log(result);
  
  url = result[0]['envs'][0]['url'];
  color = result[0]['envs'][0]['color'];
  bg_color = result[0]['envs'][0]['bg_color'];
});

$(document).ready(function() {
	var element = '<div class="domain-switcher-bar" style="background-color:'
		+ bg_color
		+ '; color:'
		+ color
		+ '">'
		+ url
		+ '</div>'
	$('body').append(element);
});