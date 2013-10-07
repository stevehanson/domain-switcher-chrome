$(document).ready(function() {

	$('ul.domains li').click(function() {
		url = $(this).text();
		console.log("Clicked url: " + url);
		// chrome.tabs.getCurrent(function(tab) {
		// 	chrome.tabs.update(tab.id, {url: url});
		// });

		// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		//   chrome.tabs.sendMessage(tabs[0].id, {url: url}, function(response) {
		//     console.log("received response");
		//   });
		// });

		chrome.runtime.sendMessage({url: url}, function(response) {
		  console.log("response received");
		});


	});

});

