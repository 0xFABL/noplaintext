// Stubbed-out Service Worker
console.log('Service Worker is running.');

let passphrase = null;


class EncryptDecryptMap {
  constructor(encrypted, decrypted) {
    this.encrypted = encrypted;
    this.decrypted = decrypted;
  }
}

const handle_decrypt_single = (data) => {
  return EncryptDecryptMap(
    encrypted=data,
    decrypted="ALKSDJLADSJDASKLDJASL", // stub for actual implementation
  )
} 

const handle_input_from_content = (request, sender, sendResponse) => {
  const dataReceived = request.data;
  const senderUrl = sender.url;
  console.log(dataReceived);
  const new_data = dataReceived.map((value) => {
    return handle_decrypt_single(value);
  })
  
  // Send a response back to the sender (content.js)
  sendResponse({ 
    data: new_data
  });

  return true; // Indicates asynchronous response
}

const handle_set_passphrase = (request, sender, sendResponse) => {
  const dataReceived = request.data;
  const senderUrl = sender.url; 
  passphrase = dataReceived;
  console.log(`new passphrase ${passphrase}`);
}

// Listen for messages from any part of the extension (e.g., content.js)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch(request.command) {
    case "inputFromContent": {
      handle_input_from_content(request, sender, sendResponse);
      break;
    }
    case "setPassphrase": {
      handle_set_passphrase(request, sender, sendResponse);
      break;
    }
  }
});