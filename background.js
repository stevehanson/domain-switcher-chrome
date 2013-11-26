function onInstall() {
	chrome.tabs.create({'url': chrome.extension.getURL("options.html") } );
}

function onUpdate() {
	console.log("Extension Updated");
}

function getVersion() {
	var details = chrome.app.getDetails();
	return details.version;
}

// Check if the version has changed.
var currVersion = getVersion();
var prevVersion = localStorage['version'];
if (currVersion != prevVersion) {
	// Check if we just installed this extension.
	if (typeof prevVersion == 'undefined') {
		onInstall();
	} else {
		onUpdate();
	}
	localStorage['version'] = currVersion;
}


// Called when new tab opened
function checkForValidUrl(tabId, changeInfo, tab) {
  var data =localStorage['domainSwitcher'];
  if(!data) return false; // no projects started
  var projects = JSON.parse(data);
  var envs = getEnvsForCurrentUrl(projects, tab.url);
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
	projects.forEach(function(project) {
		if(found) return false; // break
		project.envs.forEach(function(env) {
			var urlToMatch = addHttpIfNoProtocol(env.url);
			env = new Uri(urlToMatch);
			if(urlsMatch(currUrl, env)) {
				found = project.envs.map(function(env){
					if(env.url) // not empty or null 
						return env;
				}).filter(function(env) {
					return (env); // filter out empty or null
				});
				return false; // break
			}
		});
	});
	//console.log(found);
	return found;

}

function getCurrentUrlEntry(currentUrl) {
	var found = null;
	var currUrl = new Uri(currentUrl);
	var projects = JSON.parse(localStorage['domainSwitcher']);
	var envs = getEnvsForCurrentUrl(projects, currentUrl);
	envs.forEach(function(env) {
		var urlToMatch = addHttpIfNoProtocol(env.url);
		env = new Uri(urlToMatch);
		if(urlsMatch(currUrl, env)) {
			found = env;
			return false; // break		
		}
	});
	return found;
}

function urlsMatch(currUrl, match) {
	//console.log('Checking ' + currUrl.toString() + ' against domain ' + match.toString());
	if(!match.host()) return false; // if blank url
	match.setProtocol('http'); // don't care abt protocol
	currUrl.setProtocol('http'); // don't care abt protocol

	currUrl.host(stripWwwIfPresent(currUrl.host()));
	match.host(stripWwwIfPresent(match.host()));
	
	if(currUrl.path() === '') {
		currUrl.path('/'); // in case '/' added in options page, will still match 
	}
	return (currUrl.toString().indexOf(match.toString()) === 0);
}

function stripWwwIfPresent(url) {
	if(url.indexOf('www.') === 0) {
       url = url.substring(4);
    }
    return url;
}
function addHttpIfNoProtocol(url) {
	if(url.indexOf('://') == -1) {
		return 'http://' + url;
	} else {
		return url;
	}
}

chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	chrome.tabs.query({active:true, currentWindow: true},function(tabs){
		
		// update current URL to use host, domain, port, start of path of the selected environment.
		var uri = new Uri(tabs[0].url);
		var requestUrl = addHttpIfNoProtocol(request.url);
		var newUri = new Uri(requestUrl);
		var currUriEntry = getCurrentUrlEntry(tabs[0].url);
		
		// update uri to use host, port, protocol of selected ENV
		uri.host(newUri.host());
		uri.port(newUri.port());
		uri.protocol(newUri.protocol());


		// update uri to use start of path of selected ENV - if path in ENV url
		var currentPath = uri.path();
		if(currUriEntry.path() !== '') {
			currentPath = uri.path().replace(currUriEntry.path(), '');
		}
		uri.path(newUri.path() + currentPath);
		console.log('updating to ' + uri.toString());
		console.log(tabs);
        chrome.tabs.update(tabs[0].id, {url: uri.toString()});

  });
});

