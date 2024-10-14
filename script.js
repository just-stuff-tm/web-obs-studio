const videoPreview = document.getElementById('videoPreview');
const startStreamButton = document.getElementById('startStream');
const stopStreamButton = document.getElementById('stopStream');
const addSourceButton = document.getElementById('addSource');
const removeSourceButton = document.getElementById('removeSource');

let mediaStream;

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

// Add source (basic example)
addSourceButton.addEventListener('click', () => {
    alert('Add source functionality is not yet implemented.');
});

// Remove source (basic example)
removeSourceButton.addEventListener('click', () => {
    alert('Remove source functionality is not yet implemented.');
});
