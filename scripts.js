document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('tab-active'));
      tabContents.forEach(tc => tc.classList.remove('active'));

      tab.classList.add('tab-active');
      document.getElementById(tab.getAttribute('data-target')).classList.add('active');
    });
  });

  // Fetching announcements from Google Sheets
  const sheetId = '1Z3e-BJe0PhSuse2d7idTAvd_q2c6Rqg0knqq8KVgNyc';
  const apiKey = 'AIzaSyDf05OjK82WvtCm9c2Ho9kT7FlUsgy6HOs'; 

  const range = 'Sheet1!A1:Z1000'; 
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

  async function fetchAnnouncements() {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('API Response:', data);

      if (data.values) {
        const announcements = data.values.map(row => row[0]).join(' | ');
        console.log('Announcements:', announcements);
        document.querySelector('#announcement-marquee div').textContent = announcements;
      } else {
        console.error('No data found');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  fetchAnnouncements();
});

document.addEventListener('DOMContentLoaded', () => {
  // Opportunity Board Form
  const opportunityForm = document.getElementById('opportunityForm');
  const opportunityList = document.getElementById('opportunityListItems');

  opportunityForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const problemDescription = document.getElementById('problemDescription').value;
    const impact = document.getElementById('impact').value;
    const team = document.getElementById('team').value;
    const solution = document.getElementById('solution').value;

    const listItem = document.createElement('li');
    listItem.textContent = `Problem: ${problemDescription}, Impact: ${impact}, Team: ${team}, Solution: ${solution}`;
    opportunityList.appendChild(listItem);

    opportunityForm.reset();
  });

  // Leaderboard Form
  const leaderboardForm = document.getElementById('leaderboardForm');
  const leaderboardList = document.getElementById('leaderboardListItems');

  leaderboardForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const steps = document.getElementById('steps').value;
    const pagesRead = document.getElementById('pagesRead').value;
    const pomodoro = document.getElementById('pomodoro').value;

    const listItem = document.createElement('li');
    listItem.textContent = `Steps: ${steps}, Pages Read: ${pagesRead}, Pomodoro Timers: ${pomodoro}`;
    leaderboardList.appendChild(listItem);

    leaderboardForm.reset();
  });

  // TIL Corner Form
  const tilForm = document.getElementById('tilForm');
  const tilList = document.getElementById('tilListItems');

  tilForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const tilContent = document.getElementById('tilContent').value;
    const tilSummary = document.getElementById('tilSummary').value;

    const listItem = document.createElement('li');
    listItem.innerHTML = `<strong>Content:</strong> ${tilContent}<br><strong>Summary:</strong> ${tilSummary}`;
    tilList.appendChild(listItem);

    tilForm.reset();
  });
});


document.getElementById('tilForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting the traditional way

  // Get values from the form
  const content = document.getElementById('tilContent').value;
  const summary = document.getElementById('tilSummary').value;

  // Create a new list item
  const li = document.createElement('li');
  li.innerHTML = `<strong>${content}</strong><p>${summary}</p>`;

  // Add the new list item to the list
  document.getElementById('tilListItems').appendChild(li);

  // Clear the form inputs
  document.getElementById('tilContent').value = '';
  document.getElementById('tilSummary').value = '';
});


// Handle option saving
const timeOption = document.getElementById("time-option");
const saveBtn = document.getElementById("save-btn");

timeOption.addEventListener("change", (event) => {
  const val = event.target.value;
  if (val < 1 || val > 60) {
    timeOption.value = 25;
  }
});

saveBtn.addEventListener("click", () => {
  chrome.storage.local.set({
    timer: 0,
    timeOption: timeOption.value,
    isRunning: false,
  }, () => {
    console.log("Options saved");
  });
});

chrome.storage.local.get(["timeOption"], (res) => {
  timeOption.value = res.timeOption || 25;
});

// Handle timer functionality
let timer;
let timeLeft;
const timerDisplay = document.getElementById("timer-display");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");

function startTimer(duration) {
  timeLeft = duration * 60; // convert minutes to seconds
  timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
  if (timeLeft <= 0) {
    clearInterval(timer);
    timerDisplay.textContent = "00:00";
    alert('Time is up!');
    return;
  }
  timeLeft--;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

startBtn.addEventListener("click", () => {
  chrome.storage.local.get(["timeOption"], (res) => {
    if (res.timeOption) {
      startTimer(res.timeOption);
    }
  });
});

pauseBtn.addEventListener("click", () => {
  clearInterval(timer);
});

resetBtn.addEventListener("click", () => {
  clearInterval(timer);
  timerDisplay.textContent = "25:00";
});
