// Data for the icons, with custom content for each program
const programs = [
    {
        name: "Info",
        id: "my-computer",
        label: "Project Nano",
        content: "<p>this program is only avalible in text mode.</p>",  // Custom content for "My Computer"
        action: () => openWindow('Info')
    },
    {
        name: "Terminal",
        id: "Terminal",
        label: "Terminal",
        content: "<embed src="https://thybytecast.github.io/EDS-active-terminal/" style="width:500px; height: 300px;">",  // Custom content for "My Computer"
        action: () => openWindow('Info')
    },
    {
        name: "EDS",
        id: "recycle-bin",
        label: "Employee Defence System",
        content: "<p>Access denied.</p>",  // Custom content for "Recycle Bin"
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

// Function to open a window (actually creating a window element)
function openWindow(programName) {
    const program = programs.find(p => p.name === programName);
    const existingWindow = document.getElementById(`${programName}-window`);
    if (existingWindow) {
        existingWindow.style.display = 'block';
        return;  // Don't open a new window if it's already open
    }

    // Create a new window
    const window = document.createElement('div');
    window.classList.add('window');
    window.id = `${programName}-window`;
    window.style.display = 'block';

    // Window Header
    const windowHeader = document.createElement('div');
    windowHeader.classList.add('window-header');
    windowHeader.innerHTML = `<span>${programName}</span><button class="close-btn">X</button>`;
    
    // Window Body
    const windowBody = document.createElement('div');
    windowBody.classList.add('window-body');
    windowBody.innerHTML = program.content || `Welcome to ${programName}!`;  // Use custom content or fallback

    window.appendChild(windowHeader);
    window.appendChild(windowBody);
    
    // Add the window to the body
    document.body.appendChild(window);

    // Make the window draggable
    makeDraggable(window);

    // Close button functionality
    windowHeader.querySelector('.close-btn').addEventListener('click', () => {
        window.style.display = 'none';
    });
}

// Function to make a window draggable
function makeDraggable(element) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    element.querySelector('.window-header').addEventListener('mousedown', function(e) {
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

// Add icons when the page loads
window.onload = addIcons;

// Toggle Start Menu
document.querySelector('.start-button').addEventListener('click', function() {
    const startMenu = document.getElementById('start-menu-popup');
    startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
});

// Redirect for "Shut Down..." button
document.getElementById('shutdown-button').addEventListener('click', function() {
    window.location.href = 'https://thybytecast.github.io/EDS-active-terminal/';
});
