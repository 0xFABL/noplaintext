// 1. Listen for messages from the Popup (via background/popup.js)

const EXPECTED_SYMBOL_REGEX = '\$\<.+\>\$'

/**
 * Uses a TreeWalker to collect all meaningful text content from the DOM.
 * @returns {string} The collected text, separated by spaces.
 */
function collectAllPageText() {
  // We start the traversal at the document body
  const rootNode = document.body; 

  // 1. Create a filter function to determine which nodes to keep
  const textFilter = {
      // Must accept a filter function
      acceptNode: function(node) {
        // Check if the text is meaningful (not just empty or whitespace)
        if (node.nodeValue.trim() === '') {
            return NodeFilter.FILTER_SKIP;
        }
        
        // Check if the parent element is one we want to ignore
        const parentTagName = node.parentElement.tagName;
        if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'BUTTON'].includes(parentTagName)) {
            return NodeFilter.FILTER_SKIP;
        }

        // Accept the node
        return NodeFilter.FILTER_ACCEPT;
      }
  };

  // 2. Create the TreeWalker
  // The arguments are:
  // 1. rootNode: Where to start (document.body)
  // 2. NodeFilter.SHOW_TEXT: We only want Text Nodes (nodeType 3)
  // 3. textFilter: The custom object containing the acceptNode function
  const walker = document.createTreeWalker(
      rootNode,
      NodeFilter.SHOW_TEXT,
      textFilter, // The filter object
      false // deprecated/ignored in modern browsers
  );

  let allText = [];
  let currentNode;

  // 3. Traverse the tree and collect the text
  while (currentNode = walker.nextNode()) {
    // Push the text value, cleaning up extra whitespace
    allText.push(currentNode.nodeValue.trim().replace(/\s+/g, ' '));
  }

  // 4. Check if the text matches expected symbol regex.
  const matching_text = allText.filter((val) => {
    if (val.match(EXPECTED_SYMBOL_REGEX)) {
      return true
    }
    return false
  });

  return matching_text
}




// connection
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === "inputFromPopup") {
    const inputData = request.data;
    // console.log('Content Script received message from Popup:', inputData);

    // // Optional: Display confirmation on the current page
    alert(`Content Script received: "${inputData}". Now sending to Service Worker.`);

    const scrapedData = collectAllPageText();
    console.log(scrapedData);

    // // 2. Send the received data to the Service Worker
    // chrome.runtime.sendMessage({
    //   command: "inputFromContent",
    //   data: inputData
    // }, (response) => {
    //   // 3. (Optional) Get a response back from the Service Worker
    //   console.log('Response from Service Worker:', response);
    // });

    // Acknowledge receipt of the message
    sendResponse({ status: "Content script processed popup message" });
    return true; // Indicates asynchronous response
  }
});