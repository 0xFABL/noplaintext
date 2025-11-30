document.getElementById('decrypt').addEventListener('click', () => {
  const messageText = document.getElementById('input-box').value;

  // Query for the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      const activeTabId = tabs[0].id;
      
      // Send a message to the content script in the active tab
      chrome.tabs.sendMessage(activeTabId, {
        command: "inputFromPopup",
        data: messageText
      }, (response) => {
        // Optional: Check for a response from content.js
        console.log('Response from content script:', response);
      });
    }
  });
});

document.getElementById('input-box').addEventListener('change', () => {
  const messageText = document.getElementById('input-box').value; 
  console.log("alksjdlkajs")
  chrome.runtime.sendMessage({
    command: 'setPassphrase',
    data: messageText
  })
})