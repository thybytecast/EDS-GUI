// Data for the icons, with custom content for each program
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
        content: "<p>Please power off to enter text mode.<p>",
        action: () => openWindow('Terminal')
    },
    {
        name: "Torchwood files",
        id: "wormhole",
        label: "Torchwood",
        content: "<p>TO BE ADDED.<p>",
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

    const window = document.createElement('div');
    window.classList.add('window');
    window.id = `${programName}-window`;
    window.style.display = 'block';

    const windowHeader = document.createElement('div');
    windowHeader.classList.add('window-header');
    windowHeader.innerHTML = `<span>${programName}</span><button class="close-btn">X</button>`;

    const windowBody = document.createElement('div');
    windowBody.classList.add('window-body');
    windowBody.innerHTML = program.content || `Welcome to ${programName}!`;

    window.appendChild(windowHeader);
    window.appendChild(windowBody);

    document.body.appendChild(window);

    makeDraggable(window);

    windowHeader.querySelector('.close-btn').addEventListener('click', () => {
        window.style.display = 'none';
    });
}

// Function to make a window draggable
function makeDraggable(element) {
    let isDragging = false;
    let offsetX = 0, offsetY = 0;
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

// ✅ Run only after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    addIcons();

    document.querySelector('.start-button').addEventListener('click', function() {
        const startMenu = document.getElementById('start-menu-popup');
        startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
    });

    document.getElementById('shutdown-button').addEventListener('click', function() {
        window.location.href = 'https://thybytecast.github.io/EDS-active-terminal/';
    });
});
