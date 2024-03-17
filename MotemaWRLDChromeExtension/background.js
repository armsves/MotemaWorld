chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === 'openNewTab') {
        chrome.tabs.create({ url: request.url });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'changeIcon') {
      if (request.color === 'green') {
        chrome.browserAction.setIcon({path: 'images/motemawrld_16green.png'});
      } else if (request.color === 'red') {
        chrome.browserAction.setIcon({path: 'images/motemawrld_16red.png'});
      }
    }
  });
