// Stubbed-out Service Worker
console.log('Service Worker is running.');

let passphrase = null;

import { encrypted_to_base64 } from './aesgcm.js';


class EncryptDecryptMap {
  constructor(encrypted, decrypted) {
    this.encrypted = encrypted;
    this.decrypted = decrypted;
  }
}

const handle_decrypt_single = async (data) => {
  const decrypted = await encrypted_to_base64(data, passphrase);
  
  console.log(decrypted)
  return new EncryptDecryptMap(
    encrypted=data,
    decrypted=decrypted, // stub for actual implementation
  )
} 

const handle_input_from_content = async (request, sender, sendResponse) => {
  const dataReceived = request.data;
  const senderUrl = sender.url;
  console.log(dataReceived);
  const new_data = dataReceived.map(async (value) => {
    return await handle_decrypt_single(value);
  })

  // send a new message to active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      const activeTabId = tabs[0].id;
      
      // Send a message to the content script in the active tab
      chrome.tabs.sendMessage(activeTabId, {
        command: "inputFromDecryption",
        data: new_data
      }, (response) => {});
    }
  });

  
  // Send a response back to the sender (content.js)
  sendResponse("ok");

  return true; // Indicates asynchronous response
}

const handle_set_passphrase = (request, sender, sendResponse) => {
  const dataReceived = request.data;
  const senderUrl = sender.url; 
  passphrase = dataReceived;
  console.log(`new passphrase ${passphrase}`);
}

// Listen for messages from any part of the extension (e.g., content.js)
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  switch(request.command) {
    case "inputFromContent": {
      await handle_input_from_content(request, sender, sendResponse);
      break;
    }
    case "setPassphrase": {
      handle_set_passphrase(request, sender, sendResponse);
      break;
    }
  }
});