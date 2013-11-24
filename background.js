g='hello';
// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
	console.log('load page ' + tab.url);
  // If the letter 'g' is found in the tab's URL...

  envs = getEnvsForCurrentUrl(tab.url);
  if(envs) {

	chrome.pageAction.show(tabId);
	chrome.pageAction.setTitle({
		tabId: tab.id,
		title: "url: " + tab.url
	});
	chrome.pageAction.setPopup({tabId: tab.id, popup: 'popup.html'});
  }
  
}

function getEnvsForCurrentUrl(currentUrl) {
	var found = false;
	var currentUrl = new Uri(currentUrl);
	console.log('host: ' + currentUrl.host());
	projects = JSON.parse(localStorage['domainSwitcher']);
	console.log(projects);
	projects.forEach(function(project) {
		if(found) return false; // break
		project.envs.forEach(function(env) {
			env = new Uri(env.url);
			console.log('checking ' + env.host());
			if(env.host() == currentUrl.host()) {
				console.log("host matched " + env.host());
				found = project;
				return false; // break
			}
		});
	});
	console.log('done');
	return found;
}

chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	chrome.tabs.query({active:true},function(tabs){
		var uri = new Uri(tabs[0].url);
		uri.host(request.url);
    chrome.tabs.update(tabs[0].id, {url: uri.toString()});
  });
});