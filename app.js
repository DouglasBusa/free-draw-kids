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

function resizeCanvases() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const newW = Math.round(rect.width * dpr);
  const newH = Math.round(rect.height * dpr);
  // Only resize when the size really changed (mobile browsers fire 'resize'
  // when the address bar moves), and copy the drawing so it isn't wiped.
  if (newW > 0 && newH > 0 && (newW !== canvas.width || newH !== canvas.height)) {
    const saved = document.createElement('canvas');
    saved.width = canvas.width;
    saved.height = canvas.height;
    saved.getContext('2d').drawImage(canvas, 0, 0);
    canvas.width = newW;
    canvas.height = newH;
    ctx.drawImage(saved, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
document.getElementById('clearBtn').addEventListener('click', () => {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
});
document.getElementById('saveBtn').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'drawing.png';
  link.href = canvas.toDataURL();
  link.click();
});

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab + '-tab').classList.add('active');
  });
});

const lessons = {
  snail: {
    title: "Happy Snail",
    steps: ["Draw a big circle for the shell.", "Draw a swirl inside the circle.", "Draw a long oval under the shell for the body.", "Add two little antenna lines with dots.", "Give it a big smile!"],
    draw: [
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.arc(x + 0.08*s, y - 0.04*s, 0.2*s, 0, Math.PI*2); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h), cx = x + 0.08*s, cy = y - 0.04*s; c.beginPath(); for (let t = 0; t <= Math.PI*6; t += 0.05) { const r = 0.16*s * (t/(Math.PI*6)); const px = cx + r*Math.cos(t), py = cy + r*Math.sin(t); t===0 ? c.moveTo(px,py) : c.lineTo(px,py); } c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.ellipse(x - 0.02*s, y + 0.18*s, 0.34*s, 0.06*s, 0, 0, Math.PI*2); c.stroke(); c.beginPath(); c.arc(x - 0.27*s, y + 0.07*s, 0.08*s, 0, Math.PI*2); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.moveTo(x - 0.31*s, y); c.lineTo(x - 0.36*s, y - 0.13*s); c.moveTo(x - 0.23*s, y); c.lineTo(x - 0.2*s, y - 0.13*s); c.stroke(); c.beginPath(); c.arc(x - 0.36*s, y - 0.13*s, 0.02*s, 0, Math.PI*2); c.fill(); c.beginPath(); c.arc(x - 0.2*s, y - 0.13*s, 0.02*s, 0, Math.PI*2); c.fill(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.arc(x - 0.3*s, y + 0.05*s, 0.012*s, 0, Math.PI*2); c.fill(); c.beginPath(); c.arc(x - 0.24*s, y + 0.05*s, 0.012*s, 0, Math.PI*2); c.fill(); c.beginPath(); c.arc(x - 0.27*s, y + 0.08*s, 0.03*s, 0.15*Math.PI, 0.85*Math.PI); c.stroke(); }
    ]
  },
  sun: {
    title: "Smiley Sun",
    steps: ["Draw a big circle.", "Add short rays all around.", "Draw two dots for eyes.", "Add a big happy smile.", "Color it yellow!"],
    draw: [
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.arc(x, y, 0.2*s, 0, Math.PI*2); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); for (let i = 0; i < 12; i++) { const a = (i/12)*Math.PI*2; c.moveTo(x + Math.cos(a)*0.26*s, y + Math.sin(a)*0.26*s); c.lineTo(x + Math.cos(a)*0.36*s, y + Math.sin(a)*0.36*s); } c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.fillStyle = '#333'; [-0.07, 0.07].forEach(dx => { c.beginPath(); c.arc(x + dx*s, y - 0.05*s, 0.02*s, 0, Math.PI*2); c.fill(); }); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.arc(x, y + 0.01*s, 0.1*s, 0.15*Math.PI, 0.85*Math.PI); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); 
        c.fillStyle = '#FFD93B'; c.beginPath(); c.arc(x, y, 0.2*s, 0, Math.PI*2); c.fill();
        c.strokeStyle = '#333'; c.beginPath(); c.arc(x, y, 0.2*s, 0, Math.PI*2); c.stroke();
        c.fillStyle = '#333'; [-0.07, 0.07].forEach(dx => { c.beginPath(); c.arc(x + dx*s, y - 0.05*s, 0.02*s, 0, Math.PI*2); c.fill(); });
        c.beginPath(); c.arc(x, y + 0.01*s, 0.1*s, 0.15*Math.PI, 0.85*Math.PI); c.stroke();
      }
    ]
  },
  ladybug: {
    title: "Cute Ladybug",
    steps: ["Draw a big circle for the body.", "Add a half circle head.", "Draw a line down the middle.", "Add round dots.", "Draw two antennas."],
    draw: [
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.arc(x, y + 0.06*s, 0.25*s, 0, Math.PI*2); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.arc(x, y - 0.17*s, 0.11*s, Math.PI, 0); c.closePath(); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.moveTo(x, y - 0.17*s); c.lineTo(x, y + 0.31*s); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); [[-0.12,-0.03],[-0.15,0.1],[-0.07,0.2],[0.12,-0.03],[0.15,0.1],[0.07,0.2]].forEach(([dx,dy]) => { c.beginPath(); c.arc(x + dx*s, y + dy*s, 0.035*s, 0, Math.PI*2); c.fill(); }); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.moveTo(x - 0.04*s, y - 0.27*s); c.quadraticCurveTo(x - 0.06*s, y - 0.36*s, x - 0.12*s, y - 0.37*s); c.moveTo(x + 0.04*s, y - 0.27*s); c.quadraticCurveTo(x + 0.06*s, y - 0.36*s, x + 0.12*s, y - 0.37*s); c.stroke(); c.beginPath(); c.arc(x - 0.12*s, y - 0.37*s, 0.018*s, 0, Math.PI*2); c.fill(); c.beginPath(); c.arc(x + 0.12*s, y - 0.37*s, 0.018*s, 0, Math.PI*2); c.fill(); }
    ]
  },
  monster: {
    title: "Silly Monster",
    steps: ["Draw a big wiggly blob.", "Add 1, 2, or 3 eyes.", "Draw a big mouth with triangle teeth.", "Add horns or spikes.", "Draw little arms and feet."],
    draw: [
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); for (let a = 0; a <= Math.PI*2 + 0.01; a += 0.05) { const k = 1 + 0.05*Math.sin(a*5); const px = x + Math.cos(a)*0.24*s*k, py = y + Math.sin(a)*0.27*s*k; a===0 ? c.moveTo(px,py) : c.lineTo(px,py); } c.closePath(); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); [[-0.1,-0.08,0.055],[0.1,-0.08,0.055],[0,-0.18,0.045]].forEach(([dx,dy,r]) => { c.beginPath(); c.arc(x + dx*s, y + dy*s, r*s, 0, Math.PI*2); c.stroke(); c.beginPath(); c.arc(x + dx*s, y + dy*s, r*0.4*s, 0, Math.PI*2); c.fill(); }); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.moveTo(x - 0.13*s, y + 0.05*s); c.quadraticCurveTo(x, y + 0.22*s, x + 0.13*s, y + 0.05*s); c.closePath(); c.stroke(); c.beginPath(); [-0.08,0,0.08].forEach(dx => { c.moveTo(x + (dx-0.03)*s, y + 0.05*s); c.lineTo(x + dx*s, y + 0.1*s); c.lineTo(x + (dx+0.03)*s, y + 0.05*s); }); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); [-1,1].forEach(d => { c.beginPath(); c.moveTo(x + d*0.17*s, y - 0.2*s); c.lineTo(x + d*0.15*s, y - 0.36*s); c.lineTo(x + d*0.08*s, y - 0.25*s); c.stroke(); }); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); [-1,1].forEach(d => { c.beginPath(); c.moveTo(x + d*0.24*s, y + 0.02*s); c.lineTo(x + d*0.34*s, y - 0.08*s); c.stroke(); c.beginPath(); c.ellipse(x + d*0.1*s, y + 0.3*s, 0.07*s, 0.035*s, 0, 0, Math.PI*2); c.stroke(); }); }
    ]
  },
  icecream: {
    title: "Ice Cream Cone",
    steps: ["Draw an upside-down triangle cone.", "Add crisscross lines.", "Draw a circle scoop on top.", "Add another scoop if you want.", "Top with a cherry."],
    draw: [
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.moveTo(x - 0.15*s, y + 0.01*s); c.lineTo(x + 0.15*s, y + 0.01*s); c.lineTo(x, y + 0.37*s); c.closePath(); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.save(); c.beginPath(); c.moveTo(x - 0.15*s, y + 0.01*s); c.lineTo(x + 0.15*s, y + 0.01*s); c.lineTo(x, y + 0.37*s); c.closePath(); c.clip(); c.beginPath(); for (let i = -4; i <= 4; i++) { const o = i * 0.07*s; c.moveTo(x - 0.2*s + o, y + 0.01*s); c.lineTo(x + 0.2*s + o, y + 0.37*s); c.moveTo(x + 0.2*s + o, y + 0.01*s); c.lineTo(x - 0.2*s + o, y + 0.37*s); } c.stroke(); c.restore(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); const rx = 0.18*s, ry = 0.14*s, base = y - 0.01*s, d = 0.02*s, n = 5, step = (2*rx)/n; c.beginPath(); c.moveTo(x - rx, base); c.ellipse(x, base, rx, ry, 0, Math.PI, Math.PI*2); for (let i = 0; i < n; i++) { const x0 = x + rx - step*i; c.quadraticCurveTo(x0 - step/2, base + 2*d, x0 - step, base); } c.closePath(); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); const rx = 0.14*s, ry = 0.11*s, base = y - 0.165*s, d = 0.015*s, n = 4, step = (2*rx)/n; c.beginPath(); c.moveTo(x - rx, base); c.ellipse(x, base, rx, ry, 0, Math.PI, Math.PI*2); for (let i = 0; i < n; i++) { const x0 = x + rx - step*i; c.quadraticCurveTo(x0 - step/2, base + 2*d, x0 - step, base); } c.closePath(); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.arc(x, y - 0.31*s, 0.035*s, 0, Math.PI*2); c.stroke(); c.beginPath(); c.moveTo(x, y - 0.345*s); c.quadraticCurveTo(x + 0.01*s, y - 0.39*s, x + 0.05*s, y - 0.4*s); c.stroke(); }
    ]
  },
  penguin: {
    title: "Little Penguin",
    steps: ["Draw a big oval body.", "Add a smaller oval tummy.", "Draw two dots for eyes.", "Add a triangle beak.", "Draw two small feet."],
    draw: [
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.ellipse(x, y, 0.2*s, 0.3*s, 0, 0, Math.PI*2); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.ellipse(x, y + 0.06*s, 0.13*s, 0.21*s, 0, 0, Math.PI*2); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.arc(x - 0.05*s, y - 0.17*s, 0.018*s, 0, Math.PI*2); c.fill(); c.beginPath(); c.arc(x + 0.05*s, y - 0.17*s, 0.018*s, 0, Math.PI*2); c.fill(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.moveTo(x - 0.035*s, y - 0.12*s); c.lineTo(x + 0.035*s, y - 0.12*s); c.lineTo(x, y - 0.07*s); c.closePath(); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); [-1,1].forEach(d => { c.beginPath(); c.ellipse(x + d*0.21*s, y + 0.04*s, 0.045*s, 0.13*s, -d*0.3, 0, Math.PI*2); c.stroke(); c.beginPath(); c.ellipse(x + d*0.08*s, y + 0.31*s, 0.07*s, 0.03*s, 0, 0, Math.PI*2); c.stroke(); }); }
    ]
  },
  robot: {
    title: "Friendly Robot",
    steps: ["Draw a big square body.", "Add a smaller square head.", "Draw circle eyes and a line mouth.", "Add an antenna.", "Draw rectangle arms and legs."],
    draw: [
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.rect(x - 0.18*s, y - 0.05*s, 0.36*s, 0.3*s); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.rect(x - 0.12*s, y - 0.3*s, 0.24*s, 0.19*s); c.stroke(); c.beginPath(); c.rect(x - 0.03*s, y - 0.11*s, 0.06*s, 0.06*s); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.arc(x - 0.05*s, y - 0.23*s, 0.028*s, 0, Math.PI*2); c.stroke(); c.beginPath(); c.arc(x + 0.05*s, y - 0.23*s, 0.028*s, 0, Math.PI*2); c.stroke(); c.beginPath(); c.moveTo(x - 0.05*s, y - 0.155*s); c.lineTo(x + 0.05*s, y - 0.155*s); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.moveTo(x, y - 0.3*s); c.lineTo(x, y - 0.38*s); c.stroke(); c.beginPath(); c.arc(x, y - 0.4*s, 0.025*s, 0, Math.PI*2); c.fill(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.rect(x - 0.26*s, y - 0.03*s, 0.08*s, 0.2*s); c.rect(x + 0.18*s, y - 0.03*s, 0.08*s, 0.2*s); c.rect(x - 0.12*s, y + 0.25*s, 0.07*s, 0.12*s); c.rect(x + 0.05*s, y + 0.25*s, 0.07*s, 0.12*s); c.stroke(); }
    ]
  },
  bunny: {
    title: "Bouncy Bunny",
    steps: ["Draw a small circle head.", "Add a bigger circle body.", "Draw two long oval ears.", "Add eyes and a triangle nose.", "Draw a fluffy tail."],
    draw: [
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.arc(x, y - 0.1*s, 0.12*s, 0, Math.PI*2); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.arc(x, y + 0.17*s, 0.17*s, 0, Math.PI*2); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); [-1,1].forEach(d => { c.beginPath(); c.ellipse(x + d*0.055*s, y - 0.32*s, 0.04*s, 0.12*s, d*0.15, 0, Math.PI*2); c.stroke(); }); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.arc(x - 0.045*s, y - 0.12*s, 0.016*s, 0, Math.PI*2); c.fill(); c.beginPath(); c.arc(x + 0.045*s, y - 0.12*s, 0.016*s, 0, Math.PI*2); c.fill(); c.beginPath(); c.moveTo(x - 0.018*s, y - 0.08*s); c.lineTo(x + 0.018*s, y - 0.08*s); c.lineTo(x, y - 0.06*s); c.closePath(); c.fill(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.arc(x + 0.19*s, y + 0.22*s, 0.045*s, 0, Math.PI*2); c.stroke(); }
    ]
  },
  pumpkin: {
    title: "Happy Pumpkin",
    steps: ["Draw a big wide oval.", "Add curvy lines for bumps.", "Draw a stem on top.", "Add triangle eyes and nose.", "Give it a big smile."],
    draw: [
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.ellipse(x, y + 0.04*s, 0.3*s, 0.24*s, 0, 0, Math.PI*2); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.ellipse(x, y + 0.04*s, 0.17*s, 0.24*s, 0, 0, Math.PI*2); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.moveTo(x - 0.03*s, y - 0.2*s); c.lineTo(x - 0.02*s, y - 0.3*s); c.lineTo(x + 0.03*s, y - 0.3*s); c.lineTo(x + 0.03*s, y - 0.2*s); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); const tri = (cx, cy, r) => { c.beginPath(); c.moveTo(cx - r, cy + r*0.8); c.lineTo(cx + r, cy + r*0.8); c.lineTo(cx, cy - r); c.closePath(); c.stroke(); }; tri(x - 0.1*s, y - 0.03*s, 0.045*s); tri(x + 0.1*s, y - 0.03*s, 0.045*s); tri(x, y + 0.05*s, 0.025*s); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.moveTo(x - 0.15*s, y + 0.1*s); c.quadraticCurveTo(x, y + 0.26*s, x + 0.15*s, y + 0.1*s); c.stroke(); }
    ]
  },
  ghost: {
    title: "Friendly Ghost",
    steps: ["Draw a big upside-down U shape.", "Make a wavy bottom.", "Add two oval eyes.", "Draw a little round mouth.", "Add wavy arms."],
    draw: [
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.moveTo(x - 0.2*s, y + 0.25*s); c.lineTo(x - 0.2*s, y - 0.08*s); c.arc(x, y - 0.08*s, 0.2*s, Math.PI, 0); c.lineTo(x + 0.2*s, y + 0.25*s); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.moveTo(x + 0.2*s, y + 0.25*s); for (let i = 0; i < 4; i++) c.quadraticCurveTo(x + (0.15 - 0.1*i)*s, y + (i%2 ? 0.2 : 0.32)*s, x + (0.1 - 0.1*i)*s, y + 0.25*s); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.ellipse(x - 0.07*s, y - 0.09*s, 0.028*s, 0.045*s, 0, 0, Math.PI*2); c.fill(); c.beginPath(); c.ellipse(x + 0.07*s, y - 0.09*s, 0.028*s, 0.045*s, 0, 0, Math.PI*2); c.fill(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.ellipse(x, y + 0.03*s, 0.03*s, 0.04*s, 0, 0, Math.PI*2); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); [-1,1].forEach(d => { c.beginPath(); c.moveTo(x + d*0.2*s, y + 0.04*s); c.quadraticCurveTo(x + d*0.27*s, y + 0.06*s, x + d*0.3*s, y - 0.04*s); c.stroke(); }); }
    ]
  },
  bat: {
    title: "Cute Bat",
    steps: ["Draw a circle body.", "Add two triangle ears.", "Draw zigzag wings.", "Add eyes and a smile.", "Optional little fangs."],
    draw: [
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.arc(x, y, 0.12*s, 0, Math.PI*2); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); [-1,1].forEach(d => { c.beginPath(); c.moveTo(x + d*0.09*s, y - 0.08*s); c.lineTo(x + d*0.08*s, y - 0.2*s); c.lineTo(x + d*0.03*s, y - 0.115*s); c.stroke(); }); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); [-1,1].forEach(d => { c.beginPath(); c.moveTo(x + d*0.115*s, y - 0.04*s); c.quadraticCurveTo(x + d*0.25*s, y - 0.18*s, x + d*0.4*s, y - 0.12*s); c.quadraticCurveTo(x + d*0.36*s, y - 0.02*s, x + d*0.36*s, y + 0.04*s); c.quadraticCurveTo(x + d*0.3*s, y - 0.02*s, x + d*0.24*s, y + 0.04*s); c.quadraticCurveTo(x + d*0.18*s, y - 0.01*s, x + d*0.115*s, y + 0.04*s); c.stroke(); }); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.arc(x - 0.045*s, y - 0.03*s, 0.018*s, 0, Math.PI*2); c.fill(); c.beginPath(); c.arc(x + 0.045*s, y - 0.03*s, 0.018*s, 0, Math.PI*2); c.fill(); c.beginPath(); c.arc(x, y + 0.01*s, 0.05*s, 0.2*Math.PI, 0.8*Math.PI); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); [-0.022,0.022].forEach(dx => { c.beginPath(); c.moveTo(x + (dx-0.01)*s, y + 0.055*s); c.lineTo(x + dx*s, y + 0.08*s); c.lineTo(x + (dx+0.01)*s, y + 0.055*s); c.stroke(); }); }
    ]
  },
  witchhat: {
    title: "Witch Hat",
    steps: ["Draw a tall triangle.", "Bend the tip a little.", "Add a long oval brim.", "Draw a band.", "Add a buckle."],
    draw: [
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.moveTo(x - 0.17*s, y + 0.18*s); c.lineTo(x - 0.06*s, y - 0.15*s); c.moveTo(x + 0.17*s, y + 0.18*s); c.lineTo(x + 0.06*s, y - 0.15*s); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.moveTo(x - 0.06*s, y - 0.15*s); c.quadraticCurveTo(x - 0.02*s, y - 0.3*s, x + 0.2*s, y - 0.32*s); c.quadraticCurveTo(x + 0.04*s, y - 0.25*s, x + 0.06*s, y - 0.15*s); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.ellipse(x, y + 0.2*s, 0.32*s, 0.07*s, 0, 0, Math.PI*2); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.moveTo(x - 0.137*s, y + 0.08*s); c.lineTo(x + 0.137*s, y + 0.08*s); c.moveTo(x - 0.16*s, y + 0.15*s); c.lineTo(x + 0.16*s, y + 0.15*s); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.rect(x - 0.045*s, y + 0.065*s, 0.09*s, 0.1*s); c.stroke(); }
    ]
  },
  candy: {
    title: "Yummy Candy",
    steps: ["Draw a circle for the candy.", "Add triangle wrappers on each side.", "Add crinkle lines.", "Draw stripes or dots.", "Color it!"],
    draw: [
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.arc(x, y, 0.14*s, 0, Math.PI*2); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); [-1,1].forEach(d => { c.beginPath(); c.moveTo(x + d*0.135*s, y - 0.04*s); c.lineTo(x + d*0.32*s, y - 0.13*s); c.lineTo(x + d*0.32*s, y + 0.13*s); c.lineTo(x + d*0.135*s, y + 0.04*s); c.stroke(); }); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); [-1,1].forEach(d => { c.moveTo(x + d*0.2*s, y - 0.03*s); c.lineTo(x + d*0.28*s, y - 0.07*s); c.moveTo(x + d*0.2*s, y); c.lineTo(x + d*0.29*s, y); c.moveTo(x + d*0.2*s, y + 0.03*s); c.lineTo(x + d*0.28*s, y + 0.07*s); }); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.save(); c.beginPath(); c.arc(x, y, 0.14*s, 0, Math.PI*2); c.clip(); c.beginPath(); [-0.1,-0.03,0.04,0.11].forEach(o => { c.moveTo(x + (o-0.12)*s, y + 0.15*s); c.lineTo(x + (o+0.12)*s, y - 0.15*s); }); c.stroke(); c.restore(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.fillStyle = '#FF69B4'; c.beginPath(); c.arc(x, y, 0.14*s, 0, Math.PI*2); c.fill(); c.strokeStyle = '#000'; c.stroke(); }
    ]
  },
  spider: {
    title: "Friendly Spider",
    steps: ["Draw a big circle body.", "Add a smaller head.", "Draw four bendy legs on each side.", "Add two big eyes and a smile.", "Draw a hanging line."],
    draw: [
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.arc(x, y + 0.07*s, 0.15*s, 0, Math.PI*2); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.arc(x, y - 0.13*s, 0.08*s, 0, Math.PI*2); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); [-1,1].forEach(d => { for (let i = 0; i < 4; i++) { const sy = y + (0.0 + i*0.05)*s; c.moveTo(x + d*0.14*s, sy); c.quadraticCurveTo(x + d*0.27*s, sy - 0.1*s, x + d*0.33*s, sy + (0.02 + i*0.03)*s); } }); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.arc(x - 0.03*s, y - 0.15*s, 0.025*s, 0, Math.PI*2); c.stroke(); c.beginPath(); c.arc(x + 0.03*s, y - 0.15*s, 0.025*s, 0, Math.PI*2); c.stroke(); c.beginPath(); c.arc(x, y - 0.11*s, 0.03*s, 0.15*Math.PI, 0.85*Math.PI); c.stroke(); },
      (c, w, h) => { const x = w/2, y = h/2, s = Math.min(w,h); c.beginPath(); c.moveTo(x, y - 0.21*s); c.lineTo(x, 0); c.stroke(); }
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
  guideCtx.fillStyle = '#333';
  for (let i = 0; i <= currentStep; i++) {
    if (currentLesson.draw[i]) currentLesson.draw[i](guideCtx, w, h);
  }
  document.getElementById('stepText').textContent = `Step ${currentStep + 1}: ${currentLesson.steps[currentStep]}`;
  const nextBtn = document.getElementById('nextStep');
  if (currentStep >= currentLesson.steps.length - 1) {
    nextBtn.style.display = 'none';
  } else {
    nextBtn.style.display = '';
    nextBtn.textContent = 'Next Step';
  }
  document.getElementById('prevStep').disabled = currentStep === 0;
}

// Lesson cards open on 'click' only (fires once for a mouse click, a tap,
// or Enter/Space on the button). If a finger moved more than 10px or the
// list scrolled, it was a scroll, not a tap, so we ignore it.
let touchStartX = 0, touchStartY = 0, touchStartScroll = 0, touchMoved = false, wasTouch = false;
document.querySelectorAll('.lesson-card').forEach(card => {
  card.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartScroll = window.scrollY;
    touchMoved = false;
    wasTouch = true;
  }, { passive: true });
  card.addEventListener('touchmove', (e) => {
    const dx = e.touches[0].clientX - touchStartX;
    const dy = e.touches[0].clientY - touchStartY;
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) touchMoved = true;
  }, { passive: true });
  card.addEventListener('click', () => {
    const scrolled = wasTouch && Math.abs(window.scrollY - touchStartScroll) > 10;
    const ignore = touchMoved || scrolled;
    touchMoved = false;
    wasTouch = false;
    if (ignore) return;
    showLesson(card.dataset.lesson);
  });
});

document.getElementById('backToLessons').addEventListener('click', () => {
  document.querySelector('.lesson-list').classList.remove('hidden');
  document.getElementById('lesson-viewer').classList.add('hidden');
});

document.getElementById('nextStep').addEventListener('click', () => {
  if (!currentLesson) return;
  if (currentStep < currentLesson.steps.length - 1) {
    currentStep++;
    renderStep();
  } else {
    document.querySelector('.lesson-list').classList.remove('hidden');
    document.getElementById('lesson-viewer').classList.add('hidden');
  }
});

document.getElementById('prevStep').addEventListener('click', () => {
  if (currentStep > 0) { currentStep--; renderStep(); }
});

setTimeout(resizeCanvases, 100);

// Dark mode (only changes the page around the canvases; canvases stay white)
const darkModeBtn = document.getElementById('darkModeBtn');
function setDarkMode(on) {
  document.body.classList.toggle('dark-mode', on);
  darkModeBtn.textContent = on ? '☀️ Light Mode' : '🌙 Dark Mode';
  try { localStorage.setItem('darkMode', on ? '1' : '0'); } catch (e) {}
}
let savedDark = false;
try { savedDark = localStorage.getItem('darkMode') === '1'; } catch (e) {}
setDarkMode(savedDark);
darkModeBtn.addEventListener('click', () => {
  setDarkMode(!document.body.classList.contains('dark-mode'));
});

// Background music (play() only runs from a click, so browsers allow it)
const audio = document.getElementById('lofiAudio');
const musicBtn = document.getElementById('musicBtn');
function updateMusicBtn() {
  musicBtn.textContent = audio.paused ? '🎵 Play Music' : '⏸ Pause Music';
}
audio.volume = 0.3;
audio.addEventListener('play', updateMusicBtn);
audio.addEventListener('pause', updateMusicBtn);
audio.addEventListener('error', () => { musicBtn.textContent = '🎵 Music unavailable'; });
musicBtn.addEventListener('click', () => {
  if (audio.paused) {
    const playing = audio.play();
    if (playing) {
      playing.catch(err => {
        console.warn('Music could not play:', err);
        updateMusicBtn();
      });
    }
  } else {
    audio.pause();
  }
});
updateMusicBtn();
