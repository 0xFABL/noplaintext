// Stubbed-out Service Worker
console.log('Service Worker is running.');

const handle_input_from_content = (request, sender, sendResponse) => {
  const dataReceived = request.data;
  const senderUrl = sender.url;

  console.log('--- Service Worker Received Data ---');
  console.log(`Source URL: ${senderUrl}`);
  console.log(`Received Data: ${dataReceived}`);
  console.log('------------------------------------');

  // **STUBBED FUNCTIONALITY GOES HERE**
  // e.g., Save to storage, make an API call, etc.
  // For this example, we just log and send a simple response.
  
  // Send a response back to the sender (content.js)
  sendResponse({ status: "Service Worker received and logged the data." });
  return true; // Indicates asynchronous response
}

// Listen for messages from any part of the extension (e.g., content.js)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === "inputFromContent") {
    handle_input_from_content(request, sender, sendResponse);
  }
});