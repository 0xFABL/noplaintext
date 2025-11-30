// 1. Listen for messages from the Popup (via background/popup.js)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === "inputFromPopup") {
    const inputData = request.data;
    console.log('Content Script received message from Popup:', inputData);

    // Optional: Display confirmation on the current page
    alert(`Content Script received: "${inputData}". Now sending to Service Worker.`);

    // 2. Send the received data to the Service Worker
    chrome.runtime.sendMessage({
      command: "inputFromContent",
      data: inputData
    }, (response) => {
      // 3. (Optional) Get a response back from the Service Worker
      console.log('Response from Service Worker:', response);
    });

    // Acknowledge receipt of the message
    sendResponse({ status: "Content script processed popup message" });
    return true; // Indicates asynchronous response
  }
});