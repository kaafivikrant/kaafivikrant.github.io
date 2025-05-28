document.getElementById("addNotes").addEventListener("click", () => {
    const count = parseInt(document.getElementById("noteCount").value) || 1;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        for (let i = 0; i < count; i++) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            { action: "addNote" },
            (response) => {
              if (chrome.runtime.lastError) {
                console.log("Error sending message:", chrome.runtime.lastError.message);
              }
            }
          );
        }
      } else {
        console.log("No active tab found.");
      }
    });
  });