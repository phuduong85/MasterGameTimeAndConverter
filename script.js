const timezones = [
    'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00', 'UTC-07:00', 'UTC-06:00', 
    'UTC-05:00', 'UTC-04:00', 'UTC-03:00', 'UTC-02:00', 'UTC-01:00', 'UTC+00:00', 'UTC+01:00', 
    'UTC+02:00', 'UTC+03:00', 'UTC+04:00', 'UTC+05:00', 'UTC+06:00', 'UTC+07:00', 'UTC+08:00', 
    'UTC+09:00', 'UTC+10:00', 'UTC+11:00', 'UTC+12:00'
];

let use24HourFormat = false;

function populateTimezones() {
    const fromTZ = document.getElementById('fromTZ');
    const toTZ = document.getElementById('toTZ');
    timezones.forEach(tz => {
        fromTZ.add(new Option(tz, tz));
        toTZ.add(new Option(tz, tz));
    });
    fromTZ.value = 'UTC-05:00';
    toTZ.value = 'UTC+08:00';
}

function populateTimeInputs() {
    const hourInput = document.getElementById('hour-input');
    const minuteInput = document.getElementById('minute-input');

    hourInput.innerHTML = '';
    for (let i = 1; i <= 12; i++) {
        const hour = i.toString().padStart(2, '0');
        hourInput.add(new Option(hour, hour));
    }

    minuteInput.innerHTML = '';
    for (let i = 0; i < 60; i += 5) {
        const minute = i.toString().padStart(2, '0');
        minuteInput.add(new Option(minute, minute));
    }
}

function updateLocalTime() {
    const localTimeElement = document.getElementById('local-time');
    const options = {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: !use24HourFormat
    };
    localTimeElement.textContent = new Date().toLocaleString('en-US', options);
}

function setCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    let hours = now.getHours();
    const minutes = (Math.floor(now.getMinutes() / 5) * 5).toString().padStart(2, '0');

    document.getElementById('date-input').value = `${year}-${month}-${day}`;
    document.getElementById('minute-input').value = minutes;

    if (use24HourFormat) {
        document.getElementById('hour-input').value = hours.toString().padStart(2, '0');
        document.getElementById('ampm-input').style.display = 'none';
    } else {
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        document.getElementById('hour-input').value = hours.toString().padStart(2, '0');
        document.getElementById('ampm-input').value = ampm;
        document.getElementById('ampm-input').style.display = 'block';
    }
}

function switchTimeZones() {
    const fromTZ = document.getElementById('fromTZ');
    const toTZ = document.getElementById('toTZ');
    [fromTZ.value, toTZ.value] = [toTZ.value, fromTZ.value];
    convertTime();
}

function convertTime() {
    const dateInput = document.getElementById('date-input').value;
    let hourInput = document.getElementById('hour-input').value;
    const minuteInput = document.getElementById('minute-input').value;
    const ampmInput = document.getElementById('ampm-input').value;
    const fromTZ = document.getElementById('fromTZ').value;
    const toTZ = document.getElementById('toTZ').value;

    if (!dateInput || !hourInput || !minuteInput) {
        document.getElementById('result').innerHTML = `
            <h5 class="mb-3 fw-bold text-center">Converted Time</h5>
            <div class="header-decoration mb-3">
                <span class="line"></span>
                <span class="icon"><i class="bi bi-arrow-left-right"></i></span>
                <span class="line"></span>
            </div>
            <div id="converted-time" class="d-flex flex-column align-items-center">
                Please select a date and time.
            </div>
        `;
        return;
    }

    if (!use24HourFormat) {
        hourInput = (parseInt(hourInput) % 12 + (ampmInput === 'PM' ? 12 : 0)).toString().padStart(2, '0');
    }

    const date = new Date(`${dateInput}T${hourInput}:${minuteInput}:00`);
    const fromOffset = parseInt(fromTZ.split(':')[0].replace('UTC', ''));
    const toOffset = parseInt(toTZ.split(':')[0].replace('UTC', ''));
    const offsetDiff = toOffset - fromOffset;
    const convertedDate = new Date(date.getTime() + offsetDiff * 60 * 60 * 1000);

    const options = {
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit',
        hour12: !use24HourFormat
    };

    const originalTime = date.toLocaleString('en-US', options);
    const convertedTime = convertedDate.toLocaleString('en-US', options);

    const [originalWeekday, ...originalRest] = originalTime.split(', ');
    const [convertedWeekday, ...convertedRest] = convertedTime.split(', ');

    document.getElementById('converted-time').innerHTML = `
        <div class="time-display">${originalRest.join(', ')}</div>
        <div class="weekday">${originalWeekday}</div>
        <div class="time-zone mb-2">${fromTZ}</div>
        <div class="arrow-icon-container mb-2">
            <i class="bi bi-arrow-down"></i>
        </div>
        <div class="time-display">${convertedRest.join(', ')}</div>
        <div class="weekday">${convertedWeekday}</div>
        <div class="time-zone">${toTZ}</div>
    `;
}


function toggleTimeFormat() {
    use24HourFormat = !use24HourFormat;
    populateTimeInputs();
    setCurrentDateTime();
    updateLocalTime();
    convertTime();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

function changeFont(fontName) {
    document.body.style.fontFamily = `'${fontName}', sans-serif`;
}

function loadGameData() {
    displayGameData();
    setInterval(updateTimeUntilReset, 1000);
}

function displayGameData() {
    const gameGrid = document.getElementById('game-grid');
    const template = document.getElementById('game-cont');

    gameData.forEach(game => {
        const gameElement = template.content.cloneNode(true);
        gameElement.querySelector('.game-icon img').src = `/MasterGameTimeAndConverter/gamedata/img/${game.icon}.png`;
        gameElement.querySelector('h3').textContent = game.game;
        gameElement.querySelector('h4').textContent = game.server;

        // Add this new code to set the overlay image
        // Add this new code to set the overlay image
        // Add this new code to set the overlay image
        const serverOverlayImg = gameElement.querySelector('.server-overlay-img');
        const serverName = game.server.toLowerCase();
        let overlayImageName;

        if (serverName.includes('america')) {
            overlayImageName = 'america.png';
        } else if (serverName.includes('global')) {
            overlayImageName = 'global.png';
        } else if (serverName.includes('asia')) {
            overlayImageName = 'asia.png';
        } else {
            overlayImageName = 'default.png'; // A default image if the server doesn't match
        }

        serverOverlayImg.src = `/MasterGameTimeAndConverter/gamedata/img/${overlayImageName}`;
        // ... rest of your existing code ...
        // ... rest of your existing code ...
        // ... rest of your existing code ...

        const localResetTime = convertToLocalTime(game.dailyreset, game.timezone);
        gameElement.querySelector('.local-reset-time').textContent = formatTime(localResetTime);
        gameElement.querySelector('.server-reset-time').textContent = formatServerResetTime(game.dailyreset);

        const container = gameElement.querySelector('.game-container');
        container.dataset.serverResetTime = game.dailyreset;
        container.dataset.timezone = game.timezone;

        gameGrid.appendChild(gameElement);
    });

    updateTimeUntilReset();
}

function convertToLocalTime(time, timezone) {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setUTCHours(hours, minutes, 0, 0);
    const offset = parseInt(timezone.replace('UTC', ''));
    date.setUTCHours(date.getUTCHours() - offset);
    return new Date(date.toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }));
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatServerResetTime(time) {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

function updateTimeUntilReset() {
    const now = new Date();
    const containers = document.querySelectorAll('.game-container');

    containers.forEach(container => {
        const serverResetTime = container.dataset.serverResetTime;
        const timezone = container.dataset.timezone;
        const resetDate = convertToLocalTime(serverResetTime, timezone);
        let timeDiff = resetDate - now;

        if (timeDiff < 0) {
            resetDate.setDate(resetDate.getDate() + 1);
            timeDiff = resetDate - now;
        }

        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        const timeUntilReset = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        container.querySelector('.time-until-reset').textContent = timeUntilReset;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const fontSelector = document.getElementById('fontSelector');
    darkModeToggle.addEventListener('change', toggleDarkMode);
    fontSelector.addEventListener('change', (e) => changeFont(e.target.value));

    populateTimezones();
    populateTimeInputs();
    setCurrentDateTime();

    ['date-input', 'hour-input', 'minute-input', 'ampm-input', 'fromTZ', 'toTZ'].forEach(id => {
        document.getElementById(id).addEventListener('change', convertTime);
    });

    document.getElementById('switchBtn').addEventListener('click', switchTimeZones);
    document.getElementById('timeFormatToggle').addEventListener('change', toggleTimeFormat);

    convertTime();
    updateLocalTime();
    setInterval(updateLocalTime, 1000);

    loadGameData();
});

document.querySelectorAll('.server-overlay').forEach(overlay => {
    overlay.addEventListener('mousemove', (e) => {
        const bounds = overlay.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;
        const rotateY = (mouseX / bounds.width - 0.5) * 20;
        const rotateX = (mouseY / bounds.height - 0.5) * -20;

        overlay.querySelector('.overlay-3d').style.transform = 
            `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    overlay.addEventListener('mouseleave', () => {
        overlay.querySelector('.overlay-3d').style.transform = 
            'perspective(500px) rotateY(-15deg) rotateX(5deg)';
    });
});
