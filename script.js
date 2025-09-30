// Function to open a window (actually creating a window element)
function openWindow(programName) {
    const program = programs.find(p => p.name === programName);
    const existingWindow = document.getElementById(`${programName}-window`);
    if (existingWindow) {
        existingWindow.style.display = 'block';
        return;
    }

    // Create a new window
    const windowEl = document.createElement('div');
    windowEl.classList.add('window');
    windowEl.id = `${programName}-window`;
    windowEl.style.display = 'block';
    windowEl.style.position = 'absolute';
    windowEl.style.width = '400px';
    windowEl.style.height = '300px';
    windowEl.style.background = '#2b2b2b';
    windowEl.style.border = '1px solid #000';
    windowEl.style.resize = 'both';
    windowEl.style.overflow = 'hidden';

    // Window Header
    const windowHeader = document.createElement('div');
    windowHeader.classList.add('window-header');
    windowHeader.style.background = '#444';
    windowHeader.style.color = '#fff';
    windowHeader.style.padding = '4px';
    windowHeader.style.cursor = 'move';
    windowHeader.style.display = 'flex';
    windowHeader.style.justifyContent = 'space-between';
    windowHeader.style.alignItems = 'center';

    windowHeader.innerHTML = `<span>${programName}</span><button class="close-btn">X</button>`;

    // Window Body
    const windowBody = document.createElement('div');
    windowBody.classList.add('window-body');
    windowBody.style.background = '#2b2b2b';
    windowBody.style.position = 'relative';
    windowBody.style.width = '100%';
    // height will be set dynamically below

    // Content
    let contentEl;
    if (program.url) {
        contentEl = document.createElement('iframe');
        contentEl.src = program.url;
        contentEl.style.position = 'absolute';
        contentEl.style.top = '0';
        contentEl.style.left = '0';
        contentEl.style.width = '100%';
        contentEl.style.height = '100%';
        contentEl.style.border = 'none';
    } else {
        contentEl = document.createElement('div');
        contentEl.innerHTML = program.content || `Welcome to ${programName}!`;
        contentEl.style.padding = '8px';
        contentEl.style.color = '#fff';
    }

    windowBody.appendChild(contentEl);
    windowEl.appendChild(windowHeader);
    windowEl.appendChild(windowBody);

    document.body.appendChild(windowEl);

    // Make the window draggable
    makeDraggable(windowEl);

    // Close button functionality
    windowHeader.querySelector('.close-btn').addEventListener('click', () => {
        windowEl.style.display = 'none';
    });

    // --- Resize logic ---
    function adjustBodySize() {
        const headerHeight = windowHeader.offsetHeight;
        windowBody.style.height = (windowEl.clientHeight - headerHeight) + 'px';
        windowBody.style.top = headerHeight + 'px';
        windowBody.style.position = 'absolute';
    }

    // Initial adjust
    adjustBodySize();

    // Observe resize
    const resizeObserver = new ResizeObserver(adjustBodySize);
    resizeObserver.observe(windowEl);
}
