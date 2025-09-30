// script.js — replace your existing JS with this file

'use strict';

/* ---------- utilities ---------- */
const slugify = name => String(name).toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
let zIndexCounter = 1000;

/* ---------- programs (editable) ---------- */
const programs = [
    { name: "Info", id: "my-computer", label: "Project Nano", content: "<p>This program is only available in text mode.</p>" },
    { name: "Terminal", id: "term-command", label: "Command Prompt", content: "<p>Please power off to enter text mode.</p>" },
    { name: "Torchwood files", id: "wormhole", label: "Torchwood", url: "https://example.com" }, // change to the URL you want
    { name: "EDS", id: "recycle-bin", label: "Employee Defence System", content: "<p>Access denied.</p>" }
];

/* ---------- add icons to desktop ---------- */
function addIcons() {
    const desktop = document.getElementById('desktop');
    if (!desktop) return;

    // clear old icons (prevents duplicates if this runs twice)
    desktop.innerHTML = '';

    programs.forEach(program => {
        const iconElement = document.createElement('div');
        iconElement.className = 'icon';
        // prefer provided id; fall back to slug of name
        iconElement.id = program.id || `${slugify(program.name)}-icon`;

        const iconLabel = document.createElement('div');
        iconLabel.className = 'icon-label';
        iconLabel.textContent = program.label || program.name;

        iconElement.appendChild(iconLabel);
        iconElement.addEventListener('click', () => openWindow(program.name));

        desktop.appendChild(iconElement);
    });

    // Ensure desktop has a low z-index so windows go above it
    desktop.style.zIndex = '1';
}

/* ---------- open window (with iframe support + scaling) ---------- */
function openWindow(programName) {
    if (!programName) return;
    const program = programs.find(p => p.name === programName);
    if (!program) return;

    const windowId = `${slugify(programName)}-window`;
    const existing = document.getElementById(windowId);
    if (existing) {
        existing.style.display = 'block';
        bringToFront(existing);
        return;
    }

    // create window container
    const win = document.createElement('div');
    win.className = 'window';
    win.id = windowId;
    Object.assign(win.style, {
        position: 'absolute',
        left: '80px',
        top: '80px',
        width: '480px',
        height: '340px',
        background: '#222',
        border: '2px solid #00ff00',
        resize: 'both',
        overflow: 'hidden',
        display: 'block',
        zIndex: String(++zIndexCounter),
        boxSizing: 'border-box'
    });

    // header (titlebar)
    const header = document.createElement('div');
    header.className = 'window-header';
    header.innerHTML = `<span>${programName}</span><button class="close-btn">X</button>`;
    Object.assign(header.style, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 8px',
        background: '#333',
        color: '#33ff00',
        cursor: 'move',
        boxSizing: 'border-box'
    });

    // body (will be sized dynamically to the area under header)
    const body = document.createElement('div');
    body.className = 'window-body';
    Object.assign(body.style, {
        position: 'absolute',
        left: '0',
        right: '0',
        top: '0',       // will be set in adjustBody()
        height: '0',    // will be set in adjustBody()
        overflow: 'hidden',
        background: '#2b2b2b',
        boxSizing: 'border-box'
    });

    // content: iframe or simple div
    let contentEl;
    if (program.url) {
        contentEl = document.createElement('iframe');
        contentEl.src = program.url;
        Object.assign(contentEl.style, {
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block'
        });
    } else {
        contentEl = document.createElement('div');
        contentEl.innerHTML = program.content || `Welcome to ${programName}!`;
        Object.assign(contentEl.style, {
            padding: '10px',
            color: '#33ff00',
            width: '100%',
            height: '100%',
            overflow: 'auto',
            boxSizing: 'border-box'
        });
    }

    body.appendChild(contentEl);
    win.appendChild(header);
    win.appendChild(body);
    document.body.appendChild(win);

    // ensure start menu/taskbar stay above windows
    const taskbar = document.getElementById('taskbar');
    if (taskbar) taskbar.style.zIndex = '2000';
    const startMenuPopup = document.getElementById('start-menu-popup');
    if (startMenuPopup) startMenuPopup.style.zIndex = '3000';

    // bring to front on mousedown
    win.addEventListener('mousedown', () => bringToFront(win));

    // close button (also clean up observers/intervals)
    header.querySelector('.close-btn').addEventListener('click', () => {
        // disconnect ResizeObserver or clear poll if set
        if (win._ro && typeof win._ro.disconnect === 'function') win._ro.disconnect();
        if (win._poll) { clearInterval(win._poll); win._poll = null; }
        win.remove();
    });

    // dragging
    makeDraggable(win, header);

    // sizing: compute body height = win.clientHeight - header.offsetHeight
    function adjustBody() {
        // header offsetHeight is reliable after element is in the DOM
        const h = header.offsetHeight || 0;
        body.style.top = h + 'px';
        body.style.height = (win.clientHeight - h) + 'px';
    }
    // initial adjust
    adjustBody();

    // ResizeObserver if available; fallback to a small polling loop
    if (typeof ResizeObserver === 'function') {
        const ro = new ResizeObserver(adjustBody);
        ro.observe(win);
        win._ro = ro;
    } else {
        // fallback polling (detect local size changes)
        let prevW = win.clientWidth, prevH = win.clientHeight;
        win._poll = setInterval(() => {
            if (win.clientWidth !== prevW || win.clientHeight !== prevH) {
                prevW = win.clientWidth; prevH = win.clientHeight;
                adjustBody();
            }
        }, 150);
    }

    // ensure content (iframe) fills body area (defensive)
    if (contentEl.tagName === 'IFRAME') {
        contentEl.style.width = '100%';
        contentEl.style.height = '100%';
    }

    // finally, bring to front
    bringToFront(win);
    return win;
}

/* ---------- bring a window to front ---------- */
function bringToFront(el) {
    if (!el) return;
    zIndexCounter++;
    el.style.zIndex = String(zIndexCounter);
}

/* ---------- draggable helper ---------- */
function makeDraggable(windowEl, headerEl) {
    const header = headerEl || windowEl.querySelector('.window-header');
    if (!header) return;

    let dragging = false;
    let startX = 0, startY = 0, startLeft = 0, startTop = 0;

    header.addEventListener('mousedown', (ev) => {
        ev.preventDefault();
        dragging = true;
        startX = ev.clientX;
        startY = ev.clientY;
        startLeft = windowEl.offsetLeft;
        startTop = windowEl.offsetTop;
        bringToFront(windowEl);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    });

    function onMove(ev) {
        if (!dragging) return;
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        windowEl.style.left = (startLeft + dx) + 'px';
        windowEl.style.top = (startTop + dy) + 'px';
    }

    function onUp() {
        dragging = false;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
    }
}

/* ---------- init: DOM ready ---------- */
document.addEventListener('DOMContentLoaded', () => {
    try {
        addIcons();

        // safe binding for Start button
        const startButton = document.querySelector('.start-button');
        const startMenu = document.getElementById('start-menu-popup');
        if (startButton && startMenu) {
            // ensure popup hidden initially (defensive)
            startMenu.style.display = startMenu.style.display || 'none';
            startButton.addEventListener('click', () => {
                startMenu.style.display = (startMenu.style.display === 'block') ? 'none' : 'block';
            });
        }

        // shutdown button binding
        const shutdown = document.getElementById('shutdown-button');
        if (shutdown) {
            shutdown.addEventListener('click', () => {
                window.location.href = 'https://thybytecast.github.io/EDS-active-terminal/';
            });
        }
    } catch (err) {
        console.error('Initialization error:', err);
    }
});
