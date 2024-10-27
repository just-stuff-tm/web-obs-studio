let scenes = [];
let currentSceneIndex = -1;
let audioSources = [];

// Add new scene
document.getElementById('addScene').addEventListener('click', function() {
  const sceneName = prompt("Enter scene name:");
  if (sceneName) {
    scenes.push({ name: sceneName, sources: [], audioSources: [] });
    renderScenes();
  }
});

function renderScenes() {
  const scenesList = document.getElementById('scenesList');
  scenesList.innerHTML = '';

  scenes.forEach((scene, index) => {
    const li = document.createElement('li');
    li.textContent = scene.name;
    li.addEventListener('click', function() {
      currentSceneIndex = index;
      renderSources();
      renderPreview();
    });
    scenesList.appendChild(li);
  });
}

// Add new source
document.getElementById('addSource').addEventListener('click', function() {
  if (currentSceneIndex === -1) {
    alert('Please select a scene first.');
    return;
  }

  const sourceType = prompt("Enter source type (text, image, video, browser):");
  let source = { type: sourceType, content: '', visible: true };

  switch (sourceType) {
    case 'text':
      source.content = prompt("Enter text:");
      break;
    case 'image':
      source.content = prompt("Enter image URL:");
      break;
    case 'video':
      source.content = prompt("Enter video URL:");
      break;
    case 'browser':
      source.content = prompt("Enter webpage URL:");
      break;
    default:
      alert("Invalid source type.");
      return;
  }

  scenes[currentSceneIndex].sources.push(source);
  renderSources();
  renderPreview();
});

// Toggle visibility
function toggleVisibility(index) {
  scenes[currentSceneIndex].sources[index].visible = !scenes[currentSceneIndex].sources[index].visible;
  renderPreview();
}

// Render sources
function renderSources() {
  const sourcesList = document.getElementById('sourcesList');
  sourcesList.innerHTML = '';

  scenes[currentSceneIndex].sources.forEach((source, index) => {
    const li = document.createElement('li');
    li.textContent = `${source.type}: ${source.content} (${source.visible ? 'Visible' : 'Hidden'})`;

    // Add visibility toggle
    const toggleButton = document.createElement('button');
    toggleButton.textContent = source.visible ? 'Hide' : 'Show';
    toggleButton.addEventListener('click', () => toggleVisibility(index));
    li.appendChild(toggleButton);

    sourcesList.appendChild(li);
  });
}

// Render preview
function renderPreview() {
  const previewCanvas = document.getElementById('previewCanvas');
  previewCanvas.innerHTML = '';

  scenes[currentSceneIndex].sources.forEach(source => {
    if (!source.visible) return;

    let element;
    if (source.type === 'text') {
      element = document.createElement('div');
      element.textContent = source.content;
      element.className = 'draggable text-source';
    } else if (source.type === 'image') {
      element = document.createElement('img');
      element.src = source.content;
      element.className = 'draggable image-source';
    } else if (source.type === 'video') {
      element = document.createElement('video');
      element.src = source.content;
      element.controls = true;
      element.className = 'draggable video-source';
    } else if (source.type === 'browser') {
      element = document.createElement('iframe');
      element.src = source.content;
      element.className = 'draggable browser-source';
    }

    // Make the element draggable
    element.style.position = 'absolute';
    element.style.top = '0px';
    element.style.left = '0px';

    previewCanvas.appendChild(element);
    makeDraggable(element);
  });
}

// Draggable function for sources
function makeDraggable(element) {
  element.onmousedown = function(event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
      element.style.left = pageX - shiftX + 'px';
      element.style.top = pageY - shiftY + 'px';
    }

    moveAt(event.pageX, event.pageY);

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    element.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      element.onmouseup = null;
    };
  };

  element.ondragstart = function() {
    return false;
  };
}

// Download scene configuration
document.getElementById('downloadConfig').addEventListener('click', () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scenes));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', 'scenes-config.json');
  downloadAnchor.click();
});

// Upload scene configuration
document.getElementById('uploadConfig').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      scenes = JSON.parse(e.target.result);
      renderScenes();
    };
    reader.readAsText(file);
  }
});
