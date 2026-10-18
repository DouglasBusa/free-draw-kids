// Free Draw Kids - completely free, no ads, no tracking
const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');
const guideCanvas = document.getElementById('guideCanvas');
const guideCtx = guideCanvas.getContext('2d');

let isDrawing = false;
let currentColor = '#000000';
let brushSize = 8;
let isEraser = false;
let lastX = 0, lastY = 0;

// Resize canvases
function resizeCanvases() {
  const dpr = window.devicePixelRatio || 1;

  // Main drawing canvas
  const rect = canvas.getBoundingClientRect();
  if (rect.width > 0 && rect.height > 0) {
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  // Guide canvas (only if visible)
  if (guideCanvas && !guideCanvas.closest('.hidden')) {
    const gRect = guideCanvas.getBoundingClientRect();
    if (gRect.width > 0 && gRect.height > 0) {
      guideCanvas.width = gRect.width * dpr;
      guideCanvas.height = gRect.height * dpr;
      guideCtx.scale(dpr, dpr);
      guideCtx.lineCap = 'round';
      guideCtx.lineJoin = 'round';
    }
  }
}
window.addEventListener('resize', resizeCanvases);
resizeCanvases();

// Drawing
function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches ? e.touches[0] : e;
  return {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top
  };
}

function startDraw(e) {
  e.preventDefault();
  isDrawing = true;
  const pos = getPos(e);
  lastX = pos.x;
  lastY = pos.y;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
}

function draw(e) {
  if (!isDrawing) return;
  e.preventDefault();
  const pos = getPos(e);
  ctx.lineWidth = isEraser ? brushSize * 2 : brushSize;
  ctx.strokeStyle = isEraser ? '#FFFFFF' : currentColor;
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  lastX = pos.x;
  lastY = pos.y;
}

function stopDraw() {
  isDrawing = false;
  ctx.beginPath();
}

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDraw);
canvas.addEventListener('mouseleave', stopDraw);
canvas.addEventListener('touchstart', startDraw, { passive: false });
canvas.addEventListener('touchmove', draw, { passive: false });
canvas.addEventListener('touchend', stopDraw);

// Tools
document.querySelectorAll('.color-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentColor = btn.dataset.color;
    isEraser = false;
    document.getElementById('eraserBtn').classList.remove('active');
  });
});

document.getElementById('brushSize').addEventListener('input', (e) => {
  brushSize = parseInt(e.target.value);
});

document.getElementById('eraserBtn').addEventListener('click', () => {
  isEraser = !isEraser;
  document.getElementById('eraserBtn').classList.toggle('active', isEraser);
});

document.getElementById('clearBtn').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById('saveBtn').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'drawing.png';
  link.href = canvas.toDataURL();
  link.click();
});

// Tabs
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab + '-tab').classList.add('active');
  });
});

// Lessons data
const lessons = {
  fish: {
    title: "Simple Fish",
    steps: [
      "Draw a big oval for the body.",
      "Add a triangle tail on the left.",
      "Draw a small triangle fin on top.",
      "Add a circle eye and a smile.",
      "Draw some wavy lines for water if you want!"
    ],
    draw: [
      (c, w, h) => { c.beginPath(); c.ellipse(w/2, h/2, 80, 50, 0, 0, Math.PI*2); c.stroke(); },
      (c, w, h) => { c.beginPath(); c.moveTo(w/2-80, h/2); c.lineTo(w/2-120, h/2-30); c.lineTo(w/2-120, h/2+30); c.closePath(); c.stroke(); },
      (c, w, h) => { c.beginPath(); c.moveTo(w/2, h/2-50); c.lineTo(w/2+20, h/2-80); c.lineTo(w/2+40, h/2-50); c.closePath(); c.stroke(); },
      (c, w, h) => { c.beginPath(); c.arc(w/2+30, h/2-10, 8, 0, Math.PI*2); c.stroke(); c.beginPath(); c.arc(w/2+40, h/2+10, 15, 0.2, Math.PI-0.2); c.stroke(); },
      (c, w, h) => { c.beginPath(); c.moveTo(50, h-40); c.quadraticCurveTo(100, h-60, 150, h-40); c.stroke(); }
    ]
  },
  cat: {
    title: "Happy Cat",
    steps: [
      "Draw a circle for the head.",
      "Add two triangles for ears.",
      "Draw two oval eyes.",
      "Add a small triangle nose and smile.",
      "Draw whiskers!"
    ],
    draw: [
      (c, w, h) => { c.beginPath(); c.arc(w/2, h/2, 70, 0, Math.PI*2); c.stroke(); },
      (c, w, h) => { c.beginPath(); c.moveTo(w/2-40, h/2-40); c.lineTo(w/2-70, h/2-90); c.lineTo(w/2-20, h/2-50); c.closePath(); c.stroke(); c.beginPath(); c.moveTo(w/2+40, h/2-40); c.lineTo(w/2+70, h/2-90); c.lineTo(w/2+20, h/2-50); c.closePath(); c.stroke(); },
      (c, w, h) => { c.beginPath(); c.ellipse(w/2-25, h/2-10, 12, 16, 0, 0, Math.PI*2); c.stroke(); c.beginPath(); c.ellipse(w/2+25, h/2-10, 12, 16, 0, 0, Math.PI*2); c.stroke(); },
      (c, w, h) => { c.beginPath(); c.moveTo(w/2, h/2+10); c.lineTo(w/2-8, h/2+22); c.lineTo(w/2+8, h/2+22); c.closePath(); c.stroke(); c.beginPath(); c.arc(w/2, h/2+30, 15, 0.2, Math.PI-0.2); c.stroke(); },
      (c, w, h) => { c.beginPath(); c.moveTo(w/2-40, h/2+10); c.lineTo(w/2-90, h/2); c.stroke(); c.beginPath(); c.moveTo(w/2+40, h/2+10); c.lineTo(w/2+90, h/2); c.stroke(); }
    ]
  },
  tree: {
    title: "Tree",
    steps: [
      "Draw a rectangle trunk.",
      "Add a big circle or cloud shape for leaves.",
      "Add a few more leaf bumps.",
      "Draw some branches if you like.",
      "Done! Add grass at the bottom."
    ],
    draw: [
      (c, w, h) => { c.strokeRect(w/2-15, h/2+20, 30, 80); },
      (c, w, h) => { c.beginPath(); c.arc(w/2, h/2-20, 70, 0, Math.PI*2); c.stroke(); },
      (c, w, h) => { c.beginPath(); c.arc(w/2-40, h/2-40, 40, 0, Math.PI*2); c.stroke(); c.beginPath(); c.arc(w/2+40, h/2-40, 40, 0, Math.PI*2); c.stroke(); },
      (c, w, h) => { c.beginPath(); c.moveTo(w/2, h/2+20); c.lineTo(w/2-40, h/2-10); c.stroke(); c.beginPath(); c.moveTo(w/2, h/2+20); c.lineTo(w/2+40, h/2-10); c.stroke(); },
      (c, w, h) => { c.beginPath(); c.moveTo(50, h-30); c.lineTo(w-50, h-30); c.stroke(); }
    ]
  },
  sun: {
    title: "Sun",
    steps: [
      "Draw a big circle.",
      "Add short lines around it for rays.",
      "Make the rays longer.",
      "Add a happy face if you want.",
      "Color it yellow!"
    ],
    draw: [
      (c, w, h) => { c.beginPath(); c.arc(w/2, h/2, 60, 0, Math.PI*2); c.stroke(); },
      (c, w, h) => { for(let i=0; i<8; i++) { const a = i * Math.PI/4; c.beginPath(); c.moveTo(w/2 + Math.cos(a)*65, h/2 + Math.sin(a)*65); c.lineTo(w/2 + Math.cos(a)*80, h/2 + Math.sin(a)*80); c.stroke(); } },
      (c, w, h) => { for(let i=0; i<8; i++) { const a = i * Math.PI/4; c.beginPath(); c.moveTo(w/2 + Math.cos(a)*65, h/2 + Math.sin(a)*65); c.lineTo(w/2 + Math.cos(a)*100, h/2 + Math.sin(a)*100); c.stroke(); } },
      (c, w, h) => { c.beginPath(); c.arc(w/2-15, h/2-10, 5, 0, Math.PI*2); c.stroke(); c.beginPath(); c.arc(w/2+15, h/2-10, 5, 0, Math.PI*2); c.stroke(); c.beginPath(); c.arc(w/2, h/2+15, 20, 0.3, Math.PI-0.3); c.stroke(); },
      (c, w, h) => { c.fillStyle = '#FFCC00'; c.beginPath(); c.arc(w/2, h/2, 60, 0, Math.PI*2); c.fill(); c.strokeStyle = '#000'; c.stroke(); }
    ]
  },
  house: {
    title: "House",
    steps: [
      "Draw a square for the house.",
      "Add a triangle roof.",
      "Draw a rectangle door.",
      "Add square windows.",
      "Optional chimney and path."
    ],
    draw: [
      (c, w, h) => { c.strokeRect(w/2-60, h/2, 120, 100); },
      (c, w, h) => { c.beginPath(); c.moveTo(w/2-70, h/2); c.lineTo(w/2, h/2-60); c.lineTo(w/2+70, h/2); c.closePath(); c.stroke(); },
      (c, w, h) => { c.strokeRect(w/2-15, h/2+40, 30, 60); },
      (c, w, h) => { c.strokeRect(w/2-45, h/2+15, 25, 25); c.strokeRect(w/2+20, h/2+15, 25, 25); },
      (c, w, h) => { c.strokeRect(w/2+40, h/2-40, 20, 40); c.beginPath(); c.moveTo(w/2, h/2+100); c.lineTo(w/2, h-20); c.stroke(); }
    ]
  }
};

let currentLesson = null;
let currentStep = 0;

function showLesson(key) {
  currentLesson = lessons[key];
  currentStep = 0;
  document.querySelector('.lesson-list').classList.add('hidden');
  document.getElementById('lesson-viewer').classList.remove('hidden');
  document.getElementById('lessonTitle').textContent = currentLesson.title;
  // Force resize now that the viewer is visible
  setTimeout(() => {
    resizeCanvases();
    renderStep();
  }, 50);
}

function renderStep() {
  const w = guideCanvas.width / (window.devicePixelRatio || 1);
  const h = guideCanvas.height / (window.devicePixelRatio || 1);
  guideCtx.clearRect(0, 0, guideCanvas.width, guideCanvas.height);
  guideCtx.strokeStyle = '#333';
  guideCtx.lineWidth = 3;
  guideCtx.fillStyle = '#333';
  // Draw all steps up to current
  for (let i = 0; i <= currentStep; i++) {
    if (currentLesson.draw[i]) currentLesson.draw[i](guideCtx, w, h);
  }
  document.getElementById('stepText').textContent = `Step ${currentStep + 1}: ${currentLesson.steps[currentStep]}`;
}

// Use both click and touch for better iPad reliability
document.querySelectorAll('.lesson-card').forEach(card => {
  const handler = (e) => {
    e.preventDefault();
    showLesson(card.dataset.lesson);
  };
  card.addEventListener('click', handler);
  card.addEventListener('touchend', handler);
});

document.getElementById('backToLessons').addEventListener('click', () => {
  document.querySelector('.lesson-list').classList.remove('hidden');
  document.getElementById('lesson-viewer').classList.add('hidden');
});

document.getElementById('nextStep').addEventListener('click', () => {
  if (currentLesson && currentStep < currentLesson.steps.length - 1) {
    currentStep++;
    renderStep();
  }
});

document.getElementById('prevStep').addEventListener('click', () => {
  if (currentStep > 0) {
    currentStep--;
    renderStep();
  }
});

// Initial resize after load
setTimeout(resizeCanvases, 100);