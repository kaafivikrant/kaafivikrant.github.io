// Clear existing context menu items to avoid duplicates
chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "add-sticky-note",
      title: "Add Sticky Note",
      contexts: ["all"]
    });
  });
  
  // Listen for context menu clicks
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "add-sticky-note") {
      chrome.tabs.sendMessage(tab.id, {
        action: "addNoteAtPosition",
        x: info.pageX,
        y: info.pageY
      });
    }
  });