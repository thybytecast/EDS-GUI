// Data for the icons, with custom content for each program
const programs = [
    {
        name: "Info",
        id: "my-computer",
        label: "Project Nano",
        content: "<p>This program is only available in text mode.</p>",  
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
        url: "https://example.com",   // 👈 embed website here
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

    if (program.url) {
        // If the program has a URL, embed it in an iframe
        windowBody.innerHTML = `<iframe src="${program.url}" frameborder="0" style="width:100%; height:100%;"></iframe>`;
    } else {
        // Otherwise, use static content
        windowBody.innerHTML = program.content || `Welcome to ${programName}!`;
    }

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
