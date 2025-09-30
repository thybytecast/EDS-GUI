// Data for the icons, with optional URL for iframe embedding
const programs = [
    {
        name: "Info",
        id: "my-computer",
        label: "Project Nano",
        content: "<p>This program is only available in text mode.</p>"
    },
    {
        name: "Terminal",
        id: "term-command",
        label: "Command Prompt",
        url: "https://thybytecast.github.io/EDS-active-terminal/"
    },
    {
        name: "Torchwood files",
        id: "wormhole",
        label: "Torchwood",
        url: "https://example.com" // 👈 put a real URL if you want an iframe here
    },
    {
        name: "EDS",
        id: "recycle-bin",
        label: "Employee Defence System",
        content: "<p>Access denied.</p>"
    }
];

// Function to add icons to the desktop
function addIcons() {
    const desktop = document.getElementById('desktop');
    programs.forEach(program => {
        const iconElement = document.createElement('div');
        iconElement.classList.add('icon');
        iconElement.id = program.id;

        const iconLabel = document.createElement('div');
        iconLabel.classList.add('icon-label');
        iconLabel.textContent = program.label;

        iconElement.appendChild(iconLabel);
        iconElement.addEventListener('click', () => openWindow(program.name));

        desktop.appendChild(iconElement);
    });
}

// Function to open a window
function openWindow(programName) {
    const program = programs.find(p => p.name === programName);
    if (!program) return;

    const existingWindow = document.getElementById(`${programName}-window`);
    if (existingWindow) {
        existingWindow.style.display = 'block';
        return;
    }

    // Create window
    const windowEl = document.createElement('div');
    windowEl.classList.add('window');
    windowEl.id = `${programName}-window`;
    Object.assign(windowEl.style, {
        display: 'block',
        position: 'absolute',
        width: '400px',
        height: '300px',
        background: '#2b2b2b',
        border: '1px solid #000',
        resize: 'both',
        overflow: 'hidden'
    });

    // Header
    const windowHeader = document.createElement('div');
    windowHeader.classList.add('window-header');
    Object.assign(windowHeader.style, {
        background: '#444',
        color: '#fff',
        padding: '4px',
        cursor: 'move',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    });
    windowHeader.innerHTML = `<span>${programName}</span><button class="close-btn">X</button>`;

    // Body
    const windowBody = document.createElement('div');
    windowBody.classList.add('window-body');
    Object.assign(windowBody.style, {
        background: '#2b2b2b',
        position: 'relative',
        width: '100%'
    });

    let contentEl;
    if (program.url) {
        contentEl = document.createElement('iframe');
        contentEl.src = program.url;
        Object.assign(contentEl.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            border: 'none'
        });
    } else {
        contentEl = document.createElement('div');
        contentEl.innerHTML = program.content || `Welcome to ${programName}!`;
        Object.assign(contentEl.style, {
            padding: '8px',
            color: '#fff'
        });
    }

    windowBody.appendChild(contentEl);
    windowEl.appendChild(windowHeader);
    windowEl.appendChild(windowBody);
    document.body.appendChild(windowEl);

    makeDraggable(windowEl);

    // Close button
    windowHeader.querySelector('.close-btn').addEventListener('click', () => {
        windowEl.style.display = 'none';
    });

    // Resize logic
    function adjustBodySize() {
        const headerHeight = windowHeader.offsetHeight;
        windowBody.style.height = (windowEl.clientHeight - headerHeight) + 'px';
        windowBody.style.top = headerHeight + 'px';
        windowBody.style.position = 'absolute';
    }
    adjustBodySize();
    const resizeObserver = new ResizeObserver(adjustBodySize);
    resizeObserver.observe(windowEl);
}

// Make window draggable
function makeDraggable(element) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    const header = element.querySelector('.window-header');

    header.addEventListener('mousedown', e => {
        isDragging = true;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (isDragging) {
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        }
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
}

// Init
window.onload = addIcons;

// Start menu toggle
document.querySelector('.start-button').addEventListener('click', function() {
    const startMenu = document.getElementById('start-menu-popup');
    startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
});

// Shutdown
document.getElementById('shutdown-button').addEventListener('click', function() {
    window.location.href = 'https://thybytecast.github.io/EDS-active-terminal/';
});
