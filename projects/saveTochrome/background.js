chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "save-text",
      title: "Save to Notes",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "save-text") {
      saveNote(info.selectionText, tab.url);
    }
  });
  
  // Handle keyboard shortcut
  chrome.commands.onCommand.addListener((command) => {
    if (command === "save-note") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: "GET_SELECTED_TEXT" }, (response) => {
          if (response && response.text) {
            saveNote(response.text, tabs[0].url);
          }
        });
      });
    }
  });
  
  function saveNote(text, url) {
    chrome.storage.local.get(["notes"], (result) => {
      let notes = result.notes || [];
      const newNote = {
        text: text,
        date: new Date().toISOString(),
        url: url,
        pinned: false // Default pinned state
      };
      notes.push(newNote);
      chrome.storage.local.set({ notes: notes }, () => {
        console.log("Note saved:", newNote);
        chrome.runtime.sendMessage({
          type: "NOTE_SAVED",
          note: newNote
        });
      });
    });
  }