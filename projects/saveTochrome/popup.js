document.addEventListener("DOMContentLoaded", () => {
    loadNotes();
    loadDarkMode();
  
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === "NOTE_SAVED") {
        showConfirmation();
        loadNotes();
      }
    });
  
    document.getElementById("export-btn").addEventListener("click", exportNotes);
    document.getElementById("dark-mode-toggle").addEventListener("click", toggleDarkMode);
  
    // Search with debouncing
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", debounce((e) => {
      loadNotes(e.target.value);
    }, 300));
  });
  
  // Load and display notes
  function loadNotes(searchTerm = "") {
    chrome.storage.local.get(["notes"], (result) => {
      let notes = result.notes || [];
      const container = document.getElementById("notes-container");
      container.innerHTML = "";
  
      // Filter notes by search term
      if (searchTerm) {
        notes = notes.filter((note) =>
          note.text.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
  
      // Sort: pinned notes first
      notes.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  
      if (notes.length === 0) {
        container.innerHTML = '<p class="text-muted">No notes found.</p>';
      } else {
        notes.forEach((note, index) => {
          const noteDiv = document.createElement("div");
          noteDiv.className = `note ${note.pinned ? "pinned" : ""}`;
          noteDiv.innerHTML = `
            <p>${note.text}</p>
            <small class="text-muted">Saved on: ${new Date(note.date).toLocaleString()} | From: <a href="${note.url}" target="_blank">Link</a></small>
            <button class="btn btn-danger btn-sm float-end delete-btn" data-index="${index}">Delete</button>
            <button class="btn btn-outline-warning btn-sm float-end pin-btn" data-index="${index}">${note.pinned ? "Unpin" : "Pin"}</button>
          `;
          container.appendChild(noteDiv);
        });
  
        // Add event listeners
        document.querySelectorAll(".delete-btn").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            deleteNote(parseInt(e.target.getAttribute("data-index")));
          });
        });
        document.querySelectorAll(".pin-btn").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            togglePin(parseInt(e.target.getAttribute("data-index")));
          });
        });
      }
    });
  }
  
  // Delete a note
  function deleteNote(index) {
    chrome.storage.local.get(["notes"], (result) => {
      let notes = result.notes || [];
      notes.splice(index, 1);
      chrome.storage.local.set({ notes: notes }, loadNotes);
    });
  }
  
  // Toggle pin status
  function togglePin(index) {
    chrome.storage.local.get(["notes"], (result) => {
      let notes = result.notes || [];
      notes[index].pinned = !notes[index].pinned;
      chrome.storage.local.set({ notes: notes }, loadNotes);
    });
  }
  
  // Export notes
  function exportNotes() {
    chrome.storage.local.get(["notes"], (result) => {
      const notes = result.notes || [];
      const dataStr = JSON.stringify(notes, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      chrome.downloads.download({
        url: url,
        filename: "saved_notes.json"
      });
    });
  }
  
  // Dark mode
  function toggleDarkMode() {
    const body = document.body;
    const isDark = body.classList.toggle("dark-mode");
    chrome.storage.local.set({ darkMode: isDark });
  }
  
  function loadDarkMode() {
    chrome.storage.local.get(["darkMode"], (result) => {
      if (result.darkMode) {
        document.body.classList.add("dark-mode");
      }
    });
  }
  
  // Show confirmation
  function showConfirmation() {
    const confirmation = document.getElementById("confirmation");
    confirmation.style.display = "block";
    setTimeout(() => {
      confirmation.style.display = "none";
    }, 2000);
  }
  
  // Debounce function
  function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }