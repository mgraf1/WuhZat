function getWikiSearchString(searchString) {
  let formattedSearchString = encodeURIComponent(searchString).split('%20').join('+');
  return `https://www.wikipedia.org/wiki/Special:Search?search=${formattedSearchString}`;
}

function getWikiApiString(searchString) {
  return  `https://en.wikipedia.org/w/api.php?action=opensearch&search=${searchString}&limit=1&namespace=0&format=json`;
}

function getWikiUrlFromResponse(response) {
  return response[3][0];
}

function buildErrorString(str) {
  let errString = str;
  if (errString.length > 20) {
    errString = str.substring(0, 20) + '...';
  }
  return `"${errString}" not found!`;
} 

function getWikipediaUrl(searchString, callback, errorCallback) {

  let searchUrl = getWikiApiString(searchString);

  let x = new XMLHttpRequest();
  x.open('GET', searchUrl, true);
  x.responseType = 'json';
  x.onload = function() {
    let url = getWikiUrlFromResponse(x.response);
    if (!url) {
      url = getWikiSearchString(searchString);
    }
    callback(url);
  }

  x.send();
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function onClickHandler(info, tab) {
  if (info.menuItemId === 'wiki') {
    getWikipediaUrl(info.selectionText,
      function(url) {
        chrome.tabs.create({ url: url });
      },
      function(err) {
        renderStatus(err);
      });
  }
}

chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.removeAll(function() {
    chrome.contextMenus.create({
      title: 'Wikipedia: %s', 
      contexts:['selection'],
      id: 'wiki',
    });
  });
});
