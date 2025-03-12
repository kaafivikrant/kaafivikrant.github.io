Todo

Add a favicon to the page
```html
<link rel="icon" href="favicon.ico" type="image/x-icon">
```

add a support for the mobile view
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

Remove the edit button, just click the task to edit and time to edit
```javascript
taskCard.querySelector('.edit-button').remove();
```

if not completed, then task goes to overdue task

Your todo list is already robust with task editing, pause/resume timers, persistent storage, and a functioning loader bar. Here are some additional features you could add to enhance its functionality, usability, and appeal, tailored to different use cases:

---

### 1. Task Categories/Tags
- **Description**: Allow users to assign categories or tags (e.g., "Work," "Personal," "Urgent") to tasks for better organization.
- **Implementation**:
  - Add an input field for tags in the input section.
  - Display tags as colored badges on task cards.
  - Add a filter dropdown or buttons to show tasks by tag.
- **Benefit**: Helps group related tasks and filter them easily.
- **Example**:
  ```html
  <input type="text" id="tagInput" placeholder="Tags (comma-separated)">
  ```
  ```javascript
  function addTasks() {
      // ... existing code ...
      const tags = document.getElementById('tagInput').value.split(',').map(t => t.trim());
      taskCard.dataset.tags = JSON.stringify(tags);
      tags.forEach(tag => {
          const tagSpan = document.createElement('span');
          tagSpan.className = 'tag';
          tagSpan.textContent = tag;
          taskCard.querySelector('.task-content').appendChild(tagSpan);
      });
  }
  ```

---

### 2. Task Prioritization
- **Description**: Add priority levels (e.g., High, Medium, Low) to tasks.
- **Implementation**:
  - Add a dropdown in the input section.
  - Color-code task borders or add icons based on priority.
  - Sort tasks by priority in the UI.
- **Benefit**: Highlights important tasks visually.
- **Example**:
  ```html
  <select id="priorityInput">
      <option value="low">Low</option>
      <option value="medium" selected>Medium</option>
      <option value="high">High</option>
  </select>
  ```
  ```css
  .task-card.high { border-left: 4px solid #e53e3e; }
  .task-card.medium { border-left: 4px solid #ecc94b; }
  .task-card.low { border-left: 4px solid #48bb78; }
  ```

---

### 3. Due Date and Time
- **Description**: Replace or complement the hour-based timer with a specific due date and time.
- **Implementation**:
  - Add `<input type="datetime-local">` to set a due date.
  - Calculate remaining time based on the due date instead of a fixed duration.
  - Update the timer and bar to reflect the time until the due date.
- **Benefit**: More precise scheduling for deadlines.
- **Example**:
  ```html
  <input type="datetime-local" id="dueDateInput">
  ```
  ```javascript
  function addTasks() {
      const dueDate = new Date(document.getElementById('dueDateInput').value).getTime();
      const remainingSeconds = Math.max(0, (dueDate - Date.now()) / 1000);
      // Use remainingSeconds instead of timeInHours * 3600
  }
  ```

---

### 4. Notifications
- **Description**: Alert users when a task is nearing completion or overdue.
- **Implementation**:
  - Use the Notification API (with permission).
  - Check remaining time in the timer interval and trigger notifications (e.g., 5 minutes before due).
- **Benefit**: Keeps users on track without needing to check the app constantly.
- **Example**:
  ```javascript
  function startTimer(id) {
      // ... existing code ...
      const timer = setInterval(() => {
          // ... existing code ...
          if (remainingSeconds === 300 && Notification.permission === 'granted') {
              new Notification(`Task "${card.querySelector('.task-text').textContent}" due in 5 minutes!`);
          }
      }, 1000);
  }
  ```

---

### 5. Progress Dashboard
- **Description**: Show a summary of total tasks, completed tasks, and total remaining time.
- **Implementation**:
  - Add a stats section above the tasks.
  - Update it dynamically as tasks change.
- **Benefit**: Provides an at-a-glance overview of workload.
- **Example**:
  ```html
  <div class="stats">
      <span>Total: <span id="totalTasks">0</span></span>
      <span>Completed: <span id="completedTasksCount">0</span></span>
      <span>Time Left: <span id="totalTimeLeft">0h 0m 0s</span></span>
  </div>
  ```
  ```javascript
  function updateStats() {
      const total = document.querySelectorAll('.task-card').length;
      const completed = document.querySelectorAll('#completedTasks .task-card').length;
      const remaining = Array.from(document.querySelectorAll('#activeTasks .time-display'))
          .reduce((sum, el) => sum + parseInt(el.dataset.remaining), 0);
      document.getElementById('totalTasks').textContent = total;
      document.getElementById('completedTasksCount').textContent = completed;
      document.getElementById('totalTimeLeft').textContent = formatTime(remaining);
  }
  ```

---

### 6. Dark Mode
- **Description**: Add a toggle for light/dark themes.
- **Implementation**:
  - Use CSS variables and a toggle button to switch themes.
  - Save the preference in `localStorage`.
- **Benefit**: Improves usability in different lighting conditions.
- **Example**:
  ```css
  :root {
      --bg: #f7fafc;
      --card-bg: rgba(255, 255, 255, 0.95);
      --text: #2d3748;
  }
  body.dark {
      --bg: #1a202c;
      --card-bg: rgba(45, 55, 72, 0.95);
      --text: #e2e8f0;
  }
  ```
  ```javascript
  document.getElementById('themeToggle').addEventListener('click', () => {
      document.body.classList.toggle('dark');
      localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });
  ```

---

### 7. Drag and Drop Reordering
- **Description**: Allow users to reorder tasks manually.
- **Implementation**:
  - Use HTML5 Drag and Drop API or a library like SortableJS.
  - Update the task order in `localStorage`.
- **Benefit**: Customizable task prioritization.
- **Example**:
  ```javascript
  const activeTasks = document.getElementById('activeTasks');
  new Sortable(activeTasks, {
      animation: 150,
      onEnd: () => saveTasks()
  });
  ```

---

### 8. Subtasks
- **Description**: Allow tasks to have collapsible subtasks.
- **Implementation**:
  - Add a button to expand/collapse subtasks on each task card.
  - Store subtasks in `localStorage` as part of the task object.
- **Benefit**: Breaks complex tasks into manageable parts.
- **Example**:
  ```javascript
  function createTaskCard(id, text, timeInHours, subtasks = []) {
      // ... existing code ...
      const subtaskList = document.createElement('div');
      subtaskList.className = 'subtasks';
      subtasks.forEach(sub => {
          const subItem = document.createElement('div');
          subItem.textContent = sub;
          subtaskList.appendChild(subItem);
      });
      card.appendChild(subtaskList);
  }
  ```

---

### 9. Sound Alerts
- **Description**: Play a sound when a task completes or is near due.
- **Implementation**:
  - Add an audio element or use the Web Audio API.
  - Trigger it in the timer interval.
- **Benefit**: Audible cues for task management.
- **Example**:
  ```html
  <audio id="alertSound" src="alert.mp3"></audio>
  ```
  ```javascript
  function startTimer(id) {
      // ... existing code ...
      if (remainingSeconds === 0) {
          document.getElementById('alertSound').play();
      }
  }
  ```

---

### 10. Export/Import Tasks
- **Description**: Allow users to export tasks to a file and import them later.
- **Implementation**:
  - Add buttons to download `localStorage` as JSON and upload a file to restore it.
- **Benefit**: Backup and portability across devices.
- **Example**:
  ```javascript
  function exportTasks() {
      const data = {
          activeTasks: JSON.parse(localStorage.getItem('activeTasks')),
          completedTasks: JSON.parse(localStorage.getItem('completedTasks'))
      };
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tasks.json';
      a.click();
  }
  ```

### 11. Recurring Tasks
- **Description**: Allow tasks to repeat daily, weekly, or monthly.
- **Implementation**:
  - Add a "Recurring" checkbox and dropdown for frequency (e.g., "Daily," "Weekly").
  - When a recurring task completes, reset its timer and move it back to "Active Tasks."
  - Store the recurrence rule in `localStorage`.
- **Benefit**: Ideal for habits or routine tasks like "Daily Standup" or "Weekly Report."
- **Example**:
  ```html
  <label><input type="checkbox" id="recurring"> Recurring</label>
  <select id="frequency">
      <option value="daily">Daily</option>
      <option value="weekly">Weekly</option>
      <option value="monthly">Monthly</option>
  </select>
  ```
  ```javascript
  function completeTask(id) {
      const card = document.querySelector(`.task-card[data-id="${id}"]`);
      if (card.dataset.recurring === 'true') {
          card.dataset.startTimestamp = Date.now();
          card.dataset.paused = 'false';
          startTimer(id);
          document.getElementById('activeTasks').appendChild(card);
      } else {
          // Existing complete logic
      }
  }
  ```

---

### 12. Pomodoro Integration
- **Description**: Add a Pomodoro timer mode (e.g., 25-minute work, 5-minute break) for focused task work.
- **Implementation**:
  - Add a "Pomodoro Mode" button per task.
  - Overlay a 25-minute timer that pauses the main timer during work sessions.
  - Track Pomodoro cycles completed per task.
- **Benefit**: Boosts productivity with timeboxing.
- **Example**:
  ```javascript
  function startPomodoro(id) {
      const card = document.querySelector(`.task-card[data-id="${id}"]`);
      clearInterval(card.dataset.timer);
      let pomodoroSeconds = 25 * 60;
      const pomodoroTimer = setInterval(() => {
          pomodoroSeconds--;
          if (pomodoroSeconds <= 0) {
              clearInterval(pomodoroTimer);
              alert('Pomodoro complete! Take a break.');
              startTimer(id); // Resume main timer
          }
      }, 1000);
  }
  ```

---

### 13. Task Dependencies
- **Description**: Allow tasks to depend on others, locking them until prerequisites are completed.
- **Implementation**:
  - Add a "Depends On" dropdown listing active tasks.
  - Disable locked tasks (grayed out) until their dependencies are completed.
  - Store dependencies in `localStorage`.
- **Benefit**: Manages workflows with sequential steps.
- **Example**:
  ```javascript
  function createTaskCard(id, text, timeInHours, dependsOn = null) {
      // ... existing code ...
      card.dataset.dependsOn = dependsOn || '';
      if (dependsOn && document.querySelector(`#completedTasks .task-card[data-id="${dependsOn}"]`) === null) {
          card.classList.add('locked');
      }
  }
  function completeTask(id) {
      // ... existing code ...
      document.querySelectorAll(`.task-card[data-depends-on="${id}"]`).forEach(card => card.classList.remove('locked'));
  }
  ```

---

### 14. Voice Commands
- **Description**: Add voice input to create tasks and control actions (e.g., "Add task: Call John").
- **Implementation**:
  - Use the Web Speech API for speech recognition.
  - Map commands to functions (e.g., "pause" to `toggleTimer`).
- **Benefit**: Hands-free operation for accessibility and convenience.
- **Example**:
  ```javascript
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.onresult = (event) => {
      const command = event.results[0][0].transcript;
      if (command.startsWith('add task')) {
          document.getElementById('taskInput').value = command.replace('add task', '').trim();
          addTasks();
      }
  };
  document.getElementById('voiceBtn').addEventListener('click', () => recognition.start());
  ```

---

### 15. Collaboration Mode
- **Description**: Allow multiple users to share and edit tasks in real-time.
- **Implementation**:
  - Use a backend (e.g., Firebase) to sync tasks across users.
  - Add a "Share" button to generate a unique link or invite code.
  - Update `localStorage` to sync with the server.
- **Benefit**: Great for team projects or household chores.
- **Example**:
  ```javascript
  import { initializeApp } from 'firebase/app';
  import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
  const db = getFirestore();
  onSnapshot(doc(db, 'tasks', 'sharedList'), (doc) => {
      const data = doc.data();
      localStorage.setItem('activeTasks', JSON.stringify(data.activeTasks));
      loadTasks();
  });
  ```

---

### 16. Task Notes
- **Description**: Add a notes section to each task for additional details.
- **Implementation**:
  - Add a collapsible textarea under each task card.
  - Save notes in `localStorage` with the task data.
- **Benefit**: Keeps extra context without cluttering the main view.
- **Example**:
  ```javascript
  function createTaskCard(id, text, timeInHours, notes = '') {
      // ... existing code ...
      const notesDiv = document.createElement('div');
      notesDiv.className = 'notes';
      notesDiv.innerHTML = `<textarea placeholder="Notes">${notes}</textarea>`;
      card.appendChild(notesDiv);
  }
  ```

---

### 17. Gamification
- **Description**: Add points, badges, or levels for completing tasks.
- **Implementation**:
  - Award points based on task duration or priority.
  - Display a score and badges in a dashboard.
  - Store progress in `localStorage`.
- **Benefit**: Motivates users through rewards.
- **Example**:
  ```javascript
  let score = parseInt(localStorage.getItem('score')) || 0;
  function completeTask(id) {
      // ... existing code ...
      score += parseInt(card.querySelector('.time-display').dataset.initial) / 3600;
      localStorage.setItem('score', score);
      document.getElementById('score').textContent = score;
  }
  ```

---

### 18. Custom Timer Colors
- **Description**: Let users choose colors for the timer bar per task.
- **Implementation**:
  - Add a color picker input when adding tasks.
  - Apply the color to the `timer-bar` background.
- **Benefit**: Visual personalization and differentiation.
- **Example**:
  ```html
  <input type="color" id="timerColor" value="#4c51bf">
  ```
  ```javascript
  function createTaskCard(id, text, timeInHours, color = '#4c51bf') {
      // ... existing code ...
      timerBar.style.background = color;
  }
  ```

---

### 19. Task Search/Filter
- **Description**: Add a search bar to filter tasks by text or tags.
- **Implementation**:
  - Add an input field above the task lists.
  - Hide non-matching tasks dynamically.
- **Benefit**: Quick access to specific tasks in a long list.
- **Example**:
  ```html
  <input type="text" id="search" placeholder="Search tasks...">
  ```
  ```javascript
  document.getElementById('search').addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      document.querySelectorAll('.task-card').forEach(card => {
          card.style.display = card.querySelector('.task-text').textContent.toLowerCase().includes(query) ? '' : 'none';
      });
  });
  ```

---

### 20. Offline Mode Indicator
- **Description**: Show a visual cue when the app is offline and sync status.
- **Implementation**:
  - Use the `navigator.onLine` API to detect connectivity.
  - Display a banner or icon when offline.
- **Benefit**: Useful if you add collaboration later; informs users of state.
- **Example**:
  ```javascript
  const offlineIndicator = document.createElement('div');
  offlineIndicator.textContent = 'Offline';
  offlineIndicator.style.display = navigator.onLine ? 'none' : 'block';
  document.body.appendChild(offlineIndicator);
  window.addEventListener('online', () => offlineIndicator.style.display = 'none');
  window.addEventListener('offline', () => offlineIndicator.style.display = 'block');
  ```

---

### Recommendations:
- **Fun and Engaging**: Gamification, Pomodoro, Voice Commands.
- **Advanced Workflow**: Recurring Tasks, Dependencies, Collaboration.
- **User Experience**: Task Notes, Custom Colors, Search/Filter.

### Recommendations:
- **Quick Wins**: Progress Dashboard, Dark Mode, Sound Alerts (easy to implement, high impact).
- **Productivity Boosters**: Categories/Tags, Prioritization, Due Date (enhance organization).
- **Advanced Features**: Subtasks, Drag and Drop, Notifications (more complex but powerful).




Since you’ve already implemented a timer and a visual “older” effect on tasks to trigger a sense of anxiety and push yourself to complete them, I’ll suggest additional UX features that build on this foundation. These ideas use psychological principles like scarcity, loss aversion, and discomfort to mentally force you into action. Here’s a list of features you can implement:

---

### 1. Visual Countdown Enhancements
Make the timer more intense to amplify urgency:
- **Color Shift**: Change the task’s background or border from green (plenty of time) to yellow (warning) to red (critical) as the deadline approaches.
- **Pulsing Timer**: Add a subtle pulsing animation to the timer when time is running low (e.g., under 10 minutes).
- **Shrinking Progress**: Display a bar that shrinks faster as time decreases, giving a sense of acceleration.
  
**Why It Works**: These visual cues tap into your instinct to avoid losing time, making the task feel more pressing.

---

### 2. Penalty for Delay
Introduce consequences for not finishing tasks on time:
- **Points Loss**: Start each day with a point pool (e.g., 100 points). Unfinished tasks deduct points, and you can’t “win” the day unless you keep a certain amount.
- **Feature Lock**: Prevent adding new tasks until overdue ones are cleared.
- **Missed Task Badge**: Show a persistent “Missed Tasks” counter or badge that only disappears when you catch up.

**Why It Works**: Losing something (points, freedom to add tasks) feels worse than not gaining a reward, pushing you to act.

---

### 3. Escalating Notifications
Make overdue tasks impossible to ignore:
- **Frequent Alerts**: Increase notification frequency for overdue tasks (e.g., every 5 minutes).
- **Pop-up Interruptions**: Display a modal window with the overdue task that you must dismiss to continue using the app.
- **Sound Escalation**: Play a ticking clock or alarm that gets louder or faster as the deadline nears.

**Why It Works**: Persistent annoyance creates discomfort, motivating you to resolve the task to stop it.

---

### 4. Limited Task Capacity
Restrict how many tasks you can have active:
- **Task Slots**: Set a maximum (e.g., 5 tasks). You can’t add a new task until one is completed, and a “Slots Full” message appears if you try.
- **Visual Cue**: Show locked slots in gray with a “Complete a task to unlock” label.

**Why It Works**: Scarcity of space creates pressure to finish tasks and free up slots.

---

### 5. Stressful Timer Display
Amplify the timer’s anxiety factor:
- **Growing Numbers**: Increase the timer’s font size as time runs out, making it dominate the screen.
- **Blinking Effect**: Make the timer blink when it’s under a threshold (e.g., 5 minutes left).
- **Ticking Sound**: Add a ticking noise that speeds up as the deadline approaches.

**Why It Works**: Heightened sensory input (sight and sound) makes the deadline feel more immediate and stressful.

---

### 6. Task Decay Visualization
Enhance your “older” effect with more dramatic aging:
- **Fading Text**: Gradually fade the task’s text or background the longer it’s incomplete.
- **Cracked Look**: Overlay a cracked or weathered texture on overdue tasks.
- **Decay Animation**: Make the task card appear to “rot” or “crumble” over time with subtle animations.

**Why It Works**: Seeing a task degrade visually creates a sense of urgency to “save” it by completing it.

---

### 7. Anxiety-Inducing Messages
Add text to provoke action:
- **Procrastination Quotes**: Show random quotes like “The time to act is now, or never” when a task is overdue.
- **Consequence Warnings**: List potential downsides (e.g., “If you don’t finish this, you’ll regret it tomorrow”).
- **Random Nudges**: Pop up messages like “You’re running out of time!” at unpredictable intervals.

**Why It Works**: Fear of failure or regret can mentally push you to act.

---

### 8. Daily Task Minimum
Set a quota to enforce daily progress:
- **Task Goal**: Require a minimum number of tasks (e.g., 3) to be completed daily.
- **Progress Bar**: Show a bar that fills as you complete tasks, with a “Day Failed” label if unmet by midnight.
- **Feature Restriction**: Lock non-essential features (e.g., customization) until the quota is hit.

**Why It Works**: A daily challenge creates a sense of urgency to avoid “failing” the day.

---

### Design Tips to Enhance These Features
- **Colors**: Use red for urgency, yellow for caution, and green for completed tasks to signal status instantly.
- **Sounds**: Add subtle, anxiety-inducing audio (e.g., a low hum or ticking) that intensifies as deadlines near.
- **Clarity**: Keep the interface simple so the focus stays on the timers and penalties.
- **Feedback**: Provide instant visual or audio feedback (e.g., a color shift or chime) when a task nears its deadline or is completed.

---

### A Word of Caution
Too much pressure might backfire and cause stress overload. Consider adding a “Low Anxiety Mode” toggle to disable these intense features when you need a break. You could also let yourself adjust the intensity (e.g., notification frequency, sound volume) to keep it motivating rather than overwhelming.


Given your request for features that make it *super difficult* to ignore tasks—crushing your soul if you don’t complete them—I’ve crafted a set of relentless, psychologically intense features for your app. These are designed to evoke urgency, dread, and discomfort, ensuring procrastination isn’t just inconvenient but borderline unbearable. Here’s what I’ve come up with:

---

### 1. **The Screaming Deadline**
   - **Feature**: When a task nears its deadline (e.g., 30 minutes left), the app emits a piercing, human-like scream that repeats every minute until the task is done.
   - **Why It Crushes Your Soul**: The sound is jarring and impossible to tune out—like a banshee haunting your inaction. It’s not just noise; it’s a visceral reminder of failure.
   - **Enhancement**: The scream gets louder and more distorted as the deadline closes in, with a final, gut-wrenching wail when time runs out.

---

### 2. **Screen Possession**
   - **Feature**: An overdue task hijacks your entire screen, overlaying a cracked, blood-red filter with the task text in massive, trembling font.
   - **Why It Crushes Your Soul**: You can’t use your device for anything else—no apps, no browsing—until the task is completed. It’s like your device is possessed by your failure.
   - **Enhancement**: The screen shakes subtly, and faint whispers of “Do it… do it…” play in the background.

---

### 3. **The Wall of Shame**
   - **Feature**: Every overdue task gets plastered across a full-screen “Wall of Shame” that appears every time you open the app, listing your failures in bold, accusing text.
   - **Why It Crushes Your Soul**: Seeing “You failed to [task] on [date]” in a growing list is a relentless guilt trip. It’s public within the app, staring you down.
   - **Enhancement**: Add a “Confess” button that forces you to type why you didn’t finish, which the app then displays next to the task forever.

---

### 4. **The Phantom Vibration**
   - **Feature**: Your phone vibrates aggressively every 10 minutes for overdue tasks, even if notifications are off, with no way to disable it short of completion.
   - **Why It Crushes Your Soul**: The constant buzzing feels like your conscience physically nagging you. It’s inescapable and maddening.
   - **Enhancement**: Pair it with a ghostly voice saying your name and the task title through your phone’s speaker.

---

### 5. **Task Multiplication Curse**
   - **Feature**: For every hour a task remains overdue, it duplicates itself with a tighter deadline (e.g., half the original time).
   - **Why It Crushes Your Soul**: One missed task becomes a swarm of urgent demands, overwhelming you with the consequences of delay.
   - **Enhancement**: Each duplicate adds a mocking note like “You thought one was bad?” or “This is your fault.”

---

### 6. **The Eye of Judgment**
   - **Feature**: An animated, unblinking eye appears on-screen, staring at you whenever a task is overdue, following your cursor or gaze (via webcam if available).
   - **Why It Crushes Your Soul**: The eye’s silent, judgmental glare makes you feel watched and exposed. It’s creepy and unrelenting.
   - **Enhancement**: The eye narrows or sheds a single tear when the task is hours late, amplifying the guilt.

---

### 7. **The Soul Debt Counter**
   - **Feature**: A counter tracks “Soul Debt” in points for every minute a task is overdue, with a grim message like “Your soul owes 142 minutes of failure.”
   - **Why It Crushes Your Soul**: Watching the debt pile up feels like you’re selling your worth to procrastination. It’s a tangible measure of your shame.
   - **Enhancement**: Clearing the debt requires completing extra “penance tasks” the app assigns, like “Write ‘I will not fail’ 10 times.”

---

### 8. **The Doomsday Clock**
   - **Feature**: A global countdown timer starts when any task goes overdue, threatening a “catastrophic reset” (e.g., deleting all progress or data) if you don’t clear it in 24 hours.
   - **Why It Crushes Your Soul**: The stakes are apocalyptic—lose everything or act now. The ticking clock looms over every action.
   - **Enhancement**: Show a “Last Chance” warning at the 1-hour mark with a siren and a plea: “Save yourself. Finish it.”

---

### 9. **The Betrayal Broadcast**
   - **Feature**: Overdue tasks trigger automated texts or calls to a pre-selected “accountability contact” (e.g., a friend or boss) confessing your failure.
   - **Why It Crushes Your Soul**: The humiliation of someone else knowing—and possibly judging you—is a gut punch you can’t ignore.
   - **Enhancement**: The message escalates with each missed deadline, from “I’m behind” to “I’ve completely failed. Please help.”

---

### 10. **The Blackout Penalty**
   - **Feature**: If a task is overdue by more than an hour, the app dims your screen to near-black, making your device barely usable until the task is done.
   - **Why It Crushes Your Soul**: Your phone or computer becomes a hostage to your inaction, crippling your digital life.
   - **Enhancement**: A faint, taunting message flickers: “This is what failure feels like. Fix it.”

---

### 11. **The Graveyard of Tasks**
   - **Feature**: Overdue tasks move to a “Graveyard” section with tombstones displaying their names and epitaphs like “Died of Neglect.”
   - **Why It Crushes Your Soul**: Seeing your tasks buried in a virtual cemetery is a haunting visual of your shortcomings.
   - **Enhancement**: Resurrecting a task requires a “ritual” (e.g., completing two other tasks first), making redemption painful.

---

### 12. **The Heartbeat of Doom**
   - **Feature**: A throbbing heartbeat sound plays whenever a task is overdue, speeding up as more time passes.
   - **Why It Crushes Your Soul**: The pounding mimics rising panic, making you feel like your time—and soul—are running out.
   - **Enhancement**: Sync the heartbeat to your phone’s vibration for a full-body assault on your senses.

---

### Design Elements to Amplify the Pain
- **Visuals**: Use jagged fonts, dark crimson tones, and glitchy animations for overdue tasks. Make them look alive and angry.
- **Intrusion**: Overdue tasks trigger full-screen pop-ups that can’t be dismissed—only completed.
- **No Mercy**: Remove all snooze, delay, or mute options. The only escape is action.
- **Personal Sting**: Incorporate your name and past failures (e.g., “You’ve let [task] die before, [Your Name]. Not again.”).

---

### A Tiny Lifeline
These features are soul-crushing by design, but to avoid total despair, you could include a “Surrender Switch” that pauses all effects for 24 hours—once per month. Using it, however, adds a permanent “Coward’s Mark” to your profile, visible every time you open the app.

---

These features will make ignoring tasks feel like a descent into torment. Your soul won’t rest until every box is checked. Want me to push the intensity even higher? Let me know!
