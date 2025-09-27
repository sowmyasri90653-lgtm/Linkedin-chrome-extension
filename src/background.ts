import { getErrorMessage } from './utils';

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action === 'getConnections') {
    chrome.storage.local.get('connections', (result) => {
      if (result.connections && result.connections.length > 0) {
        sendResponse(result.connections);
      } else {
        sendResponse({ error: getErrorMessage(new Error('No connections data available')) });
      }
    });
    return true; // Keep message channel open for async response
  }
});
