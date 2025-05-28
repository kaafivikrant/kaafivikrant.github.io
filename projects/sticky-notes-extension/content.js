// Utility to convert RGB to Hex
function rgbToHex(rgb) {
    const [r, g, b] = rgb.match(/\d+/g).map(Number);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).padStart(6, '0')}`;
  }
  
  // Load existing notes
  chrome.storage.local.get([window.location.href], (result) => {
    const notes = result[window.location.href] || [];
    notes.forEach(note => createStickyNote(note.x, note.y, note.text, note.color));
  });
  
  // Create a sticky note
  function createStickyNote(x, y, text, color = "#ffcc99") {
    const note = document.createElement("div");
    note.className = "sticky-note";
    note.style.left = `${x}px`;
    note.style.top = `${y}px`;
    note.style.backgroundColor = color;
    note.innerHTML = `
      <div class="note-header">
        <input type="color" class="color-picker" value="${color}">
        <span class="delete-btn">×</span>
      </div>
      <textarea>${text}</textarea>
    `;
    document.body.appendChild(note);
  
    // Draggable
    note.querySelector(".note-header").onmousedown = (e) => {
      let shiftX = e.clientX - note.getBoundingClientRect().left;
      let shiftY = e.clientY - note.getBoundingClientRect().top;
  
      function moveAt(pageX, pageY) {
        note.style.left = pageX - shiftX + "px";
        note.style.top = pageY - shiftY + "px";
      }
  
      document.onmousemove = (e) => {
        moveAt(e.pageX, e.pageY);
      };
  
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
        saveNotes();
      };
    };
  
    // Color picker
    note.querySelector(".color-picker").onchange = (e) => {
      note.style.backgroundColor = e.target.value;
      saveNotes();
    };
  
    // Delete button
    note.querySelector(".delete-btn").onclick = () => {
      note.remove();
      saveNotes();
    };
  
    // Save on text change or resize
    note.querySelector("textarea").oninput = saveNotes;
    note.style.resize = "both";
    note.style.overflow = "auto";
    note.onresize = saveNotes;
  }
  
  // Save all notes
  function saveNotes() {
    const notes = Array.from(document.querySelectorAll(".sticky-note")).map(note => {
      const rect = note.getBoundingClientRect();
      const color = note.style.backgroundColor.startsWith("#") 
        ? note.style.backgroundColor 
        : rgbToHex(note.style.backgroundColor);
      return {
        x: rect.left,
        y: rect.top,
        text: note.querySelector("textarea").value,
        color: color
      };
    });
    chrome.storage.local.set({ [window.location.href]: notes });
  }
  
  // Listen for new note creation
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "addNoteAtPosition") {
      createStickyNote(message.x, message.y, "New note");
    }
  });