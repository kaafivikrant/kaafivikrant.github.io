chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GET_SELECTED_TEXT") {
      const selectedText = window.getSelection().toString().trim();
      sendResponse({ text: selectedText });
    }
  });