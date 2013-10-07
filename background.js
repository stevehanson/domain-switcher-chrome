
// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  // If the letter 'g' is found in the tab's URL...
  if(tab.url.indexOf("plantour") > -1) {
  	chrome.pageAction.show(tabId);
		chrome.pageAction.setTitle({
			tabId: tab.id,
			title: "url: " + tab.url
		});
		chrome.pageAction.setPopup({tabId: tab.id, popup: 'popup.html'});	
  }
  
}

chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	chrome.tabs.query({active:true},function(tabs){
		var uri = new Uri(tabs[0].url);
		uri.host(request.url);
    chrome.tabs.update(tabs[0].id, {url: uri.toString()});
  });
});