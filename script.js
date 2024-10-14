const videoPreview = document.getElementById('videoPreview');
const startStreamButton = document.getElementById('startStream');
const stopStreamButton = document.getElementById('stopStream');
const addSourceButton = document.getElementById('addSource');
const removeSourceButton = document.getElementById('removeSource');
const sceneNameInput = document.getElementById('sceneName');
const addSceneButton = document.getElementById('addScene');
const sceneSelector = document.getElementById('sceneSelector');
const sourceTypeSelector = document.getElementById('sourceType');

let mediaStream;
let scenes = {};
let activeScene = null;

// Start streaming from the user's webcam
startStreamButton.addEventListener('click', async () => {
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoPreview.srcObject = mediaStream;
    } catch (error) {
        console.error('Error accessing media devices.', error);
    }
});

// Stop the stream
stopStreamButton.addEventListener('click', () => {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        videoPreview.srcObject = null;
    }
});

// Add a new scene
addSceneButton.addEventListener('click', () => {
    const sceneName = sceneNameInput.value.trim();
    if (sceneName && !scenes[sceneName]) {
        scenes[sceneName] = { sources: [] };
        const option = document.createElement('option');
        option.value = sceneName;
        option.textContent = sceneName;
        sceneSelector.appendChild(option);
        sceneNameInput.value = '';
    }
});

// Switch to selected scene
sceneSelector.addEventListener('change', (event) => {
    const selectedScene = event.target.value;
    if (scenes[selectedScene]) {
        activeScene = selectedScene;
        updateVideoPreview();
    }
});

// Add a source to the active scene
addSourceButton.addEventListener('click', () => {
    if (!activeScene) return;

    const sourceType = sourceTypeSelector.value;
    const source = { type: sourceType, content: '' }; // Adjust this to accept user input for content (e.g., URL for images/videos)
    scenes[activeScene].sources.push(source);
    updateVideoPreview();
});

// Remove a source from the active scene
removeSourceButton.addEventListener('click', () => {
    if (!activeScene) return;
    scenes[activeScene].sources.pop(); // Just removes the last added source for simplicity
    updateVideoPreview();
});

// Function to update the video preview based on the active scene
function updateVideoPreview() {
    const sources = scenes[activeScene]?.sources || [];
    // Logic to render sources in the preview
    console.log(`Active Scene: ${activeScene}`, sources);
}

// You may also want to implement WebRTC for streaming
