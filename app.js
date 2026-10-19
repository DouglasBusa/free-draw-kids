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
  const rect = canvas.getBoundingClientRect();
  if (rect.width > 0 && rect.height > 0) {
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }
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

// Drawing helpers
function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches ? e.touches[0] : e;
  return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
}
function startDraw(e) { e.preventDefault(); isDrawing = true; const pos = getPos(e); lastX = pos.x; lastY = pos.y; ctx.beginPath(); ctx.moveTo(lastX, lastY); }
function draw(e) {
  if (!isDrawing) return; e.preventDefault();
  const pos = getPos(e);
  ctx.lineWidth = isEraser ? brushSize * 2 : brushSize;
  ctx.strokeStyle = isEraser ? '#FFFFFF' : currentColor;
  ctx.lineTo(pos.x, pos.y); ctx.stroke();
  lastX = pos.x; lastY = pos.y;
}
function stopDraw() { isDrawing = false; ctx.beginPath(); }

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
document.getElementById('brushSize').addEventListener('input', (e) => { brushSize = parseInt(e.target.value); });
document.getElementById('eraserBtn').addEventListener('click', () => {
  isEraser = !isEraser;
  document.getElementById('eraserBtn').classList.toggle('active', isEraser);
});
document.getElementById('clearBtn').addEventListener('click', () => { ctx.clearRect(0, 0, canvas.width, canvas.height); });
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

// Lessons data (Artie + Halloween)
const lessons = {
  snail: {
    title: "Happy Snail",
    steps: ["Draw a big circle for the shell.", "Draw a swirl inside the circle.", "Draw a long oval under the shell for the body.", "Add two little antenna lines with dots.", "Give it a big smile!"],
    draw: [
      (c,w,h) => { c.beginPath(); c.arc(w/2, h/2-20, 50, 0, Math.PI*2); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.arc(w/2, h/2-20, 25, 0.5, Math.PI*1.5); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.ellipse(w/2, h/2+40, 70, 25, 0, 0, Math.PI*2); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.moveTo(w/2-15, h/2-60); c.lineTo(w/2-25, h/2-90); c.stroke(); c.beginPath(); c.arc(w/2-25, h/2-90, 4, 0, Math.PI*2); c.stroke(); c.beginPath(); c.moveTo(w/2+15, h/2-60); c.lineTo(w/2+25, h/2-90); c.stroke(); c.beginPath(); c.arc(w/2+25, h/2-90, 4, 0, Math.PI*2); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.arc(w/2, h/2+30, 12, 0.2, Math.PI-0.2); c.stroke(); }
    ]
  },
  sun: {
    title: "Smiley Sun",
    steps: ["Draw a big circle.", "Add short rays all around.", "Draw two dots for eyes.", "Add a big happy smile.", "Color it yellow!"],
    draw: [
      (c,w,h) => { c.beginPath(); c.arc(w/2, h/2, 55, 0, Math.PI*2); c.stroke(); },
      (c,w,h) => { for(let i=0;i<10;i++){ const a=i*Math.PI/5; c.beginPath(); c.moveTo(w/2+Math.cos(a)*60, h/2+Math.sin(a)*60); c.lineTo(w/2+Math.cos(a)*85, h/2+Math.sin(a)*85); c.stroke(); } },
      (c,w,h) => { c.beginPath(); c.arc(w/2-15, h/2-10, 5, 0, Math.PI*2); c.stroke(); c.beginPath(); c.arc(w/2+15, h/2-10, 5, 0, Math.PI*2); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.arc(w/2, h/2+10, 20, 0.2, Math.PI-0.2); c.stroke(); },
      (c,w,h) => { c.fillStyle='#FFCC00'; c.beginPath(); c.arc(w/2, h/2, 55, 0, Math.PI*2); c.fill(); c.strokeStyle='#000'; c.stroke(); }
    ]
  },
  ladybug: {
    title: "Cute Ladybug",
    steps: ["Draw a big circle for the body.", "Add a half circle head.", "Draw a line down the middle.", "Add round dots.", "Draw two antennas."],
    draw: [
      (c,w,h) => { c.beginPath(); c.arc(w/2, h/2+10, 55, 0, Math.PI*2); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.arc(w/2, h/2-20, 30, Math.PI, 0); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.moveTo(w/2, h/2-20); c.lineTo(w/2, h/2+65); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.arc(w/2-20, h/2+10, 8, 0, Math.PI*2); c.stroke(); c.beginPath(); c.arc(w/2+20, h/2+15, 8, 0, Math.PI*2); c.stroke(); c.beginPath(); c.arc(w/2-10, h/2+35, 6, 0, Math.PI*2); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.moveTo(w/2-10, h/2-40); c.lineTo(w/2-20, h/2-60); c.stroke(); c.beginPath(); c.moveTo(w/2+10, h/2-40); c.lineTo(w/2+20, h/2-60); c.stroke(); }
    ]
  },
  monster: {
    title: "Silly Monster",
    steps: ["Draw a big wiggly blob.", "Add 1, 2, or 3 eyes.", "Draw a big mouth with triangle teeth.", "Add horns or spikes.", "Draw little arms and feet."],
    draw: [
      (c,w,h) => { c.beginPath(); c.ellipse(w/2, h/2, 70, 55, 0, 0, Math.PI*2); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.arc(w/2-20, h/2-15, 10, 0, Math.PI*2); c.stroke(); c.beginPath(); c.arc(w/2+15, h/2-10, 8, 0, Math.PI*2); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.arc(w/2, h/2+20, 25, 0.3, Math.PI-0.3); c.stroke(); c.beginPath(); c.moveTo(w/2-10, h/2+15); c.lineTo(w/2-5, h/2+25); c.lineTo(w/2, h/2+15); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.moveTo(w/2-30, h/2-40); c.lineTo(w/2-40, h/2-70); c.stroke(); c.beginPath(); c.moveTo(w/2+25, h/2-45); c.lineTo(w/2+35, h/2-75); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.moveTo(w/2-50, h/2+10); c.lineTo(w/2-80, h/2+20); c.stroke(); c.beginPath(); c.moveTo(w/2+50, h/2+10); c.lineTo(w/2+80, h/2+20); c.stroke(); }
    ]
  },
  icecream: {
    title: "Ice Cream Cone",
    steps: ["Draw an upside-down triangle cone.", "Add crisscross lines.", "Draw a circle scoop on top.", "Add another scoop if you want.", "Top with a cherry."],
    draw: [
      (c,w,h) => { c.beginPath(); c.moveTo(w/2-40, h/2+40); c.lineTo(w/2, h/2-40); c.lineTo(w/2+40, h/2+40); c.closePath(); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.moveTo(w/2-20, h/2); c.lineTo(w/2+20, h/2+20); c.stroke(); c.beginPath(); c.moveTo(w/2-10, h/2+10); c.lineTo(w/2+15, h/2+30); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.arc(w/2, h/2-20, 35, 0, Math.PI*2); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.arc(w/2, h/2-55, 28, 0, Math.PI*2); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.arc(w/2, h/2-85, 10, 0, Math.PI*2); c.stroke(); }
    ]
  },
  penguin: {
    title: "Little Penguin",
    steps: ["Draw a big oval body.", "Add a smaller oval tummy.", "Draw two dots for eyes.", "Add a triangle beak.", "Draw two small feet."],
    draw: [
      (c,w,h) => { c.beginPath(); c.ellipse(w/2, h/2, 45, 65, 0, 0, Math.PI*2); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.ellipse(w/2, h/2+15, 30, 40, 0, 0, Math.PI*2); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.arc(w/2-12, h/2-20, 6, 0, Math.PI*2); c.stroke(); c.beginPath(); c.arc(w/2+12, h/2-20, 6, 0, Math.PI*2); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.moveTo(w/2, h/2-5); c.lineTo(w/2-8, h/2+5); c.lineTo(w/2+8, h/2+5); c.closePath(); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.ellipse(w/2-20, h/2+60, 15, 8, 0, 0, Math.PI*2); c.stroke(); c.beginPath(); c.ellipse(w/2+20, h/2+60, 15, 8, 0, 0, Math.PI*2); c.stroke(); }
    ]
  },
  robot: {
    title: "Friendly Robot",
    steps: ["Draw a big square body.", "Add a smaller square head.", "Draw circle eyes and a line mouth.", "Add an antenna.", "Draw rectangle arms and legs."],
    draw: [
      (c,w,h) => { c.strokeRect(w/2-40, h/2, 80, 80); },
      (c,w,h) => { c.strokeRect(w/2-25, h/2-50, 50, 50); },
      (c,w,h) => { c.beginPath(); c.arc(w/2-10, h/2-30, 6, 0, Math.PI*2); c.stroke(); c.beginPath(); c.arc(w/2+10, h/2-30, 6, 0, Math.PI*2); c.stroke(); c.beginPath(); c.moveTo(w/2-15, h/2-15); c.lineTo(w/2+15, h/2-15); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.moveTo(w/2, h/2-50); c.lineTo(w/2, h/2-70); c.stroke(); c.beginPath(); c.arc(w/2, h/2-70, 5, 0, Math.PI*2); c.stroke(); },
      (c,w,h) => { c.strokeRect(w/2-55, h/2+20, 15, 40); c.strokeRect(w/2+40, h/2+20, 15, 40); c.strokeRect(w/2-20, h/2+80, 15, 25); c.strokeRect(w/2+5, h/2+80, 15, 25); }
    ]
  },
  bunny: {
    title: "Bouncy Bunny",
    steps: ["Draw a small circle head.", "Add a bigger circle body.", "Draw two long oval ears.", "Add eyes and a triangle nose.", "Draw a fluffy tail."],
    draw: [
      (c,w,h) => { c.beginPath(); c.arc(w/2, h/2-30, 30, 0, Math.PI*2); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.arc(w/2, h/2+30, 45, 0, Math.PI*2); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.ellipse(w/2-15, h/2-70, 10, 35, 0, 0, Math.PI*2); c.stroke(); c.beginPath(); c.ellipse(w/2+15, h/2-70, 10, 35, 0, 0, Math.PI*2); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.arc(w/2-8, h/2-35, 4, 0, Math.PI*2); c.stroke(); c.beginPath(); c.arc(w/2+8, h/2-35, 4, 0, Math.PI*2); c.stroke(); c.beginPath(); c.moveTo(w/2, h/2-25); c.lineTo(w/2-6, h/2-15); c.lineTo(w/2+6, h/2-15); c.closePath(); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.arc(w/2+40, h/2+20, 12, 0, Math.PI*2); c.stroke(); }
    ]
  },
  pumpkin: {
    title: "Happy Pumpkin",
    steps: ["Draw a big wide oval.", "Add curvy lines for bumps.", "Draw a stem on top.", "Add triangle eyes and nose.", "Give it a big smile."],
    draw: [
      (c,w,h) => { c.beginPath(); c.ellipse(w/2, h/2+10, 70, 50, 0, 0, Math.PI*2); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.moveTo(w/2-40, h/2-30); c.quadraticCurveTo(w/2-50, h/2+10, w/2-40, h/2+50); c.stroke(); c.beginPath(); c.moveTo(w/2, h/2-40); c.quadraticCurveTo(w/2-10, h/2+10, w/2, h/2+55); c.stroke(); c.beginPath(); c.moveTo(w/2+40, h/2-30); c.quadraticCurveTo(w/2+50, h/2+10, w/2+40, h/2+50); c.stroke(); },
      (c,w,h) => { c.strokeRect(w/2-8, h/2-55, 16, 20); },
      (c,w,h) => { c.beginPath(); c.moveTo(w/2-25, h/2-5); c.lineTo(w/2-15, h/2+5); c.lineTo(w/2-35, h/2+5); c.closePath(); c.stroke(); c.beginPath(); c.moveTo(w/2+25, h/2-5); c.lineTo(w/2+15, h/2+5); c.lineTo(w/2+35, h/2+5); c.closePath(); c.stroke(); c.beginPath(); c.moveTo(w/2, h/2+10); c.lineTo(w/2-6, h/2+18); c.lineTo(w/2+6, h/2+18); c.closePath(); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.arc(w/2, h/2+25, 20, 0.3, Math.PI-0.3); c.stroke(); }
    ]
  },
  ghost: {
    title: "Friendly Ghost",
    steps: ["Draw a big upside-down U shape.", "Make a wavy bottom.", "Add two oval eyes.", "Draw a little round mouth.", "Add wavy arms."],
    draw: [
      (c,w,h) => { c.beginPath(); c.arc(w/2, h/2, 60, Math.PI, 0); c.stroke(); c.lineTo(w/2+60, h/2+50); c.stroke(); c.lineTo(w/2-60, h/2+50); c.closePath(); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.moveTo(w/2-60, h/2+50); c.quadraticCurveTo(w/2-30, h/2+70, w/2, h/2+50); c.quadraticCurveTo(w/2+30, h/2+70, w/2+60, h/2+50); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.ellipse(w/2-15, h/2-10, 10, 14, 0, 0, Math.PI*2); c.stroke(); c.beginPath(); c.ellipse(w/2+15, h/2-10, 10, 14, 0, 0, Math.PI*2); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.arc(w/2, h/2+15, 12, 0, Math.PI*2); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.moveTo(w/2-50, h/2+10); c.quadraticCurveTo(w/2-70, h/2+20, w/2-50, h/2+30); c.stroke(); c.beginPath(); c.moveTo(w/2+50, h/2+10); c.quadraticCurveTo(w/2+70, h/2+20, w/2+50, h/2+30); c.stroke(); }
    ]
  },
  bat: {
    title: "Cute Bat",
    steps: ["Draw a circle body.", "Add two triangle ears.", "Draw zigzag wings.", "Add eyes and a smile.", "Optional little fangs."],
    draw: [
      (c,w,h) => { c.beginPath(); c.arc(w/2, h/2, 35, 0, Math.PI*2); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.moveTo(w/2-15, h/2-25); c.lineTo(w/2-25, h/2-50); c.lineTo(w/2-5, h/2-30); c.closePath(); c.stroke(); c.beginPath(); c.moveTo(w/2+15, h/2-25); c.lineTo(w/2+25, h/2-50); c.lineTo(w/2+5, h/2-30); c.closePath(); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.moveTo(w/2-35, h/2); c.lineTo(w/2-70, h/2-20); c.lineTo(w/2-50, h/2+10); c.lineTo(w/2-80, h/2+20); c.stroke(); c.beginPath(); c.moveTo(w/2+35, h/2); c.lineTo(w/2+70, h/2-20); c.lineTo(w/2+50, h/2+10); c.lineTo(w/2+80, h/2+20); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.arc(w/2-10, h/2-5, 5, 0, Math.PI*2); c.stroke(); c.beginPath(); c.arc(w/2+10, h/2-5, 5, 0, Math.PI*2); c.stroke(); c.beginPath(); c.arc(w/2, h/2+10, 10, 0.2, Math.PI-0.2); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.moveTo(w/2-5, h/2+12); c.lineTo(w/2-3, h/2+18); c.stroke(); c.beginPath(); c.moveTo(w/2+5, h/2+12); c.lineTo(w/2+3, h/2+18); c.stroke(); }
    ]
  },
  witchhat: {
    title: "Witch Hat",
    steps: ["Draw a tall triangle.", "Bend the tip a little.", "Add a long oval brim.", "Draw a band.", "Add a buckle."],
    draw: [
      (c,w,h) => { c.beginPath(); c.moveTo(w/2-30, h/2+40); c.lineTo(w/2, h/2-60); c.lineTo(w/2+30, h/2+40); c.closePath(); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.moveTo(w/2, h/2-60); c.quadraticCurveTo(w/2+15, h/2-70, w/2+10, h/2-50); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.ellipse(w/2, h/2+40, 60, 15, 0, 0, Math.PI*2); c.stroke(); },
      (c,w,h) => { c.strokeRect(w/2-25, h/2+5, 50, 12); },
      (c,w,h) => { c.strokeRect(w/2-8, h/2+7, 16, 8); }
    ]
  },
  candy: {
    title: "Yummy Candy",
    steps: ["Draw a circle for the candy.", "Add triangle wrappers on each side.", "Add crinkle lines.", "Draw stripes or dots.", "Color it!"],
    draw: [
      (c,w,h) => { c.beginPath(); c.arc(w/2, h/2, 40, 0, Math.PI*2); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.moveTo(w/2-40, h/2-20); c.lineTo(w/2-70, h/2); c.lineTo(w/2-40, h/2+20); c.closePath(); c.stroke(); c.beginPath(); c.moveTo(w/2+40, h/2-20); c.lineTo(w/2+70, h/2); c.lineTo(w/2+40, h/2+20); c.closePath(); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.moveTo(w/2-50, h/2-10); c.lineTo(w/2-55, h/2); c.stroke(); c.beginPath(); c.moveTo(w/2+50, h/2-10); c.lineTo(w/2+55, h/2); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.moveTo(w/2-20, h/2-20); c.lineTo(w/2+20, h/2+20); c.stroke(); c.beginPath(); c.moveTo(w/2-15, h/2+15); c.lineTo(w/2+15, h/2-15); c.stroke(); },
      (c,w,h) => { c.fillStyle='#FF69B4'; c.beginPath(); c.arc(w/2, h/2, 40, 0, Math.PI*2); c.fill(); c.strokeStyle='#000'; c.stroke(); }
    ]
  },
  spider: {
    title: "Friendly Spider",
    steps: ["Draw a big circle body.", "Add a smaller head.", "Draw four bendy legs on each side.", "Add two big eyes and a smile.", "Draw a hanging line."],
    draw: [
      (c,w,h) => { c.beginPath(); c.arc(w/2, h/2+10, 35, 0, Math.PI*2); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.arc(w/2, h/2-25, 22, 0, Math.PI*2); c.stroke(); },
      (c,w,h) => { for(let i=0;i<4;i++){ const y=h/2-5+i*15; c.beginPath(); c.moveTo(w/2-30, y); c.quadraticCurveTo(w/2-60, y-10, w/2-80, y+5); c.stroke(); c.beginPath(); c.moveTo(w/2+30, y); c.quadraticCurveTo(w/2+60, y-10, w/2+80, y+5); c.stroke(); } },
      (c,w,h) => { c.beginPath(); c.arc(w/2-8, h/2-30, 6, 0, Math.PI*2); c.stroke(); c.beginPath(); c.arc(w/2+8, h/2-30, 6, 0, Math.PI*2); c.stroke(); c.beginPath(); c.arc(w/2, h/2-15, 10, 0.2, Math.PI-0.2); c.stroke(); },
      (c,w,h) => { c.beginPath(); c.moveTo(w/2, h/2-47); c.lineTo(w/2, h/2-80); c.stroke(); }
    ]
  }
};

let currentLesson = null;
let currentStep = 0;

function showLesson(key) {
  currentLesson = lessons[key];
  if (!currentLesson) return;
  currentStep = 0;
  document.querySelector('.lesson-list').classList.add('hidden');
  document.getElementById('lesson-viewer').classList.remove('hidden');
  document.getElementById('lessonTitle').textContent = currentLesson.title;
  setTimeout(() => { resizeCanvases(); renderStep(); }, 50);
}

function renderStep() {
  const w = guideCanvas.width / (window.devicePixelRatio || 1);
  const h = guideCanvas.height / (window.devicePixelRatio || 1);
  guideCtx.clearRect(0, 0, guideCanvas.width, guideCanvas.height);
  guideCtx.strokeStyle = '#333';
  guideCtx.lineWidth = 3;
  for (let i = 0; i <= currentStep; i++) {
    if (currentLesson.draw[i]) currentLesson.draw[i](guideCtx, w, h);
  }
  document.getElementById('stepText').textContent = `Step ${currentStep + 1}: ${currentLesson.steps[currentStep]}`;
}

document.querySelectorAll('.lesson-card').forEach(card => {
  const handler = (e) => { e.preventDefault(); showLesson(card.dataset.lesson); };
  card.addEventListener('click', handler);
  card.addEventListener('touchend', handler);
});

document.getElementById('backToLessons').addEventListener('click', () => {
  document.querySelector('.lesson-list').classList.remove('hidden');
  document.getElementById('lesson-viewer').classList.add('hidden');
});

document.getElementById('nextStep').addEventListener('click', () => {
  if (currentLesson && currentStep < currentLesson.steps.length - 1) { currentStep++; renderStep(); }
});

document.getElementById('prevStep').addEventListener('click', () => {
  if (currentStep > 0) { currentStep--; renderStep(); }
});

setTimeout(resizeCanvases, 100);