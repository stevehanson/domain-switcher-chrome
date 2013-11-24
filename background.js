g='hello';
// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
	console.log('load page ' + tab.url);
  // If the letter 'g' is found in the tab's URL...

  projects = JSON.parse(localStorage['domainSwitcher']);
  envs = getEnvsForCurrentUrl(projects, tab.url);
  if(envs) {

	chrome.pageAction.show(tabId);
	chrome.pageAction.setTitle({
		tabId: tab.id,
		title: "url: " + tab.url
	});
	chrome.pageAction.setPopup({tabId: tab.id, popup: 'popup.html'});
  }
  
}

function getEnvsForCurrentUrl(projects, currentUrl) {

	var found = false;
	var currUrl = new Uri(currentUrl);
	console.log("Currenturl: " + currUrl.host() + " " + currUrl.port());
	console.log((currUrl.port() === ""));
	projects.forEach(function(project) {
		if(found) return false; // break
		project.envs.forEach(function(env) {
			env = new Uri(env.url);
			console.log('checking ' + env.host());
			if(urlsMatch(currUrl, env)) {
				console.log("host matched " + env.host());

				found = project.envs.map(function(env){ 
					if(env.url) // not empty or null 
						return env.url; 
				}).filter(function(env) {
					return (env); // filter out empty or null
				});
				return false; // break
			}
		});
	});
	return found;

}

function urlsMatch(currUrl, match) {
	if(!match.host()) return false; // if blank url
	match.setProtocol('http'); // don't care abt protocol
	currUrl.setProtocol('http'); // don't care abt protocol

	if(currUrl.host().indexOf('www.') === 0) {
		currUrl.host(currUrl.host().substring(4));
	}
	if(currUrl.path() === '') {
		currUrl.path('/'); // in case '/' added in options page, will still match 
	}

	console.log('Matching ' + currUrl.toString() + ' to (starts with) ' + match.toString());
	return (currUrl.toString().indexOf(match.toString()) === 0);

}

chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	chrome.tabs.query({active:true},function(tabs){
		var uri = new Uri(tabs[0].url);
		uri.host(request.url);
    chrome.tabs.update(tabs[0].id, {url: uri.toString()});
  });
});