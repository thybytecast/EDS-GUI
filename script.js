// Data for the icons, with custom content or URL for embedding
const programs = [
    {
        name: "Info",
        id: "my-computer",
        label: "Project Nano",
        content: "<p>this program is only available in text mode.</p>",
        action: () => openWindow('Info')
    },
    {
        name: "Terminal",
        id: "term-command",
        label: "Command Prompt",
        content: "<p>Please power off to enter text mode.</p>",
        action: () => openWindow('Terminal')
    },
    {
        name: "Torchwood files",
        id: "wormhole",
        label: "Torchwood",
        url: "https://example.com", // <-- Website to embed
        action: () => openWindow('Torchwood files')
    },
    {
        name: "EDS",
        id: "recycle-bin",
        label: "Employee Defence System",
        content: "<p>Access denied.</p>",
        action: () => openWindow('EDS')
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
        iconElement.addEventListener('click', program.action);

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

    const win = document.createElement('div');
    win.classList.add('window');
    win.id = `${programName}-window`;
    win.style.display = 'block';
    win.style.resize = 'both'; // <-- resizable
    win.style.overflow = 'hidden'; // ensures no scrollbars when resized

    const windowHeader = document.createElement('div');
    windowHeader.classList.add('window-header');
    windowHeader.innerHTML = `<span>${programName}</span><button class="close-btn">X</button>`;

    const windowBody = document.createElement('div');
    windowBody.classList.add('window-body');
    windowBody.style.height = "calc(100% - 40px)"; // leave space for header

    if (program.url) {
        // Embed website inside an iframe
        const iframe = document.createElement('iframe');
        iframe.src = program.url;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        windowBody.appendChild(iframe);
    } else {
        // text/html content
        windowBody.innerHTML = program.content || `Welcome to ${programName}!`;
        windowBody.style.overflow = "auto"; // scroll if text overflows
    }

    win.appendChild(windowHeader);
    win.appendChild(windowBody);
    document.body.appendChild(win);

    makeDraggable(win);

    // Close button functionality
    windowHeader.querySelector('.close-btn').addEventListener('click', () => {
        win.style.display = 'none';
    });
}

// Function to make a window draggable
function makeDraggable(element) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const header = element.querySelector('.window-header');
    header.addEventListener('mousedown', function(e) {
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

// Run after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    addIcons();

    const startButton = document.querySelector('.start-button');
    if (startButton) {
        startButton.addEventListener('click', () => {
            const startMenu = document.getElementById('start-menu-popup');
            startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
        });
    }

    const shutdownBtn = document.getElementById('shutdown-button');
    if (shutdownBtn) {
        shutdownBtn.addEventListener('click', () => {
            window.location.href = 'https://thybytecast.github.io/EDS-active-terminal/';
        });
    }
});
