const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
let bolts = [];
let flash = 0;

// =======================
// ⭐ ESTRELLAS
// =======================
for (let i = 0; i < 60; i++) {
  let z = Math.random();

  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    z: z,
    speed: 0.2 + z * 1.2,
    size: 0.5 + z * 1.8,
    drift: (Math.random() - 0.5) * 0.3
  });
}

// =======================
// ⚡ RAYOS (SOLO BORDES)
// =======================
function createLightning() {
  const edge = Math.floor(Math.random() * 4);

  let startX, startY, endX, endY;

  const margin = 0;

  // ARRIBA
  if (edge === 0) {
    startX = Math.random() * canvas.width;
    startY = margin;
    endX = Math.random() * canvas.width;
    endY = Math.random() * canvas.height * 0.6;
  }

  // ABAJO
  if (edge === 1) {
    startX = Math.random() * canvas.width;
    startY = canvas.height - margin;
    endX = Math.random() * canvas.width;
    endY = Math.random() * canvas.height * 0.4;
  }

  // IZQUIERDA
  if (edge === 2) {
    startX = margin;
    startY = Math.random() * canvas.height;
    endX = Math.random() * canvas.width * 0.6;
    endY = Math.random() * canvas.height;
  }

  // DERECHA
  if (edge === 3) {
    startX = canvas.width - margin;
    startY = Math.random() * canvas.height;
    endX = Math.random() * canvas.width * 0.4;
    endY = Math.random() * canvas.height;
  }

  const points = [];
  const segments = 18;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;

    let x = startX + (endX - startX) * t;
    let y = startY + (endY - startY) * t;

    x += (Math.random() - 0.5) * 90;
    y += (Math.random() - 0.5) * 25;

    points.push({ x, y });
  }

  bolts.push({
    points,
    life: 18,
    width: Math.random() * 2 + 1.5
  });

  flash = 1;
}

setInterval(createLightning, 1500 + Math.random() * 900);

// =======================
// 🎬 ANIMACIÓN
// =======================
function animate() {
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // =======================
  // 🌟 GLOW CENTRAL (CENTRO ILUMINADO)
  // =======================
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  const pulse = 0.08 + Math.abs(Math.sin(Date.now() * 0.002)) * 0.08;

  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    canvas.width * 0.6
  );

  gradient.addColorStop(0, `rgba(180,220,255,${pulse})`);
  gradient.addColorStop(0.4, "rgba(120,160,255,0.05)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // flash
  if (flash > 0) {
    ctx.fillStyle = `rgba(255,255,255,${flash * 0.18})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    flash -= 0.04;
  }

  // ⭐ estrellas
  stars.forEach(star => {
    star.y += star.speed;
    star.x += star.drift;

    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }

    if (star.x > canvas.width) star.x = 0;
    if (star.x < 0) star.x = canvas.width;

    ctx.beginPath();
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(255,255,255,0.6)";
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // ⚡ rayos
  bolts.forEach((bolt, index) => {
    bolt.life -= 1;

    ctx.shadowBlur = 50;
    ctx.shadowColor = "rgba(180,220,255,1)";

    for (let layer = 0; layer < 3; layer++) {
      ctx.beginPath();

      ctx.strokeStyle = `rgba(200,230,255,${0.7 - layer * 0.25})`;
      ctx.lineWidth = bolt.width + layer * 2;

      ctx.moveTo(bolt.points[0].x, bolt.points[0].y);

      for (let i = 1; i < bolt.points.length; i++) {
        ctx.lineTo(bolt.points[i].x, bolt.points[i].y);
      }

      ctx.stroke();
    }

    if (bolt.life <= 0) {
      bolts.splice(index, 1);
    }
  });

  requestAnimationFrame(animate);
}

animate();

// =======================
// ⭐ BOTÓN PARTICULAS
// =======================
const button = document.querySelector(".btn");

button.addEventListener("mouseenter", () => {
  for (let i = 0; i < 25; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: canvas.height,
      z: Math.random(),
      speed: 1 + Math.random() * 2,
      size: 1 + Math.random() * 2,
      drift: (Math.random() - 0.5) * 0.5
    });
  }
});

// =======================
// 📱 RESPONSIVE
// =======================
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// =======================
// ✨ TEXTO LETRA POR LETRA + GLOW
// =======================
window.addEventListener("load", () => {
  const letters = document.querySelectorAll(".tagline span");

  letters.forEach((letter, index) => {
    letter.style.opacity = "0";
    letter.style.transform = "translateY(30px)";
    letter.style.filter = "blur(8px)";

    setTimeout(() => {
      letter.classList.add("show");

      letter.style.opacity = "1";
      letter.style.transform = "translateY(0)";
      letter.style.filter = "blur(0)";

      letter.classList.add("glow");
    }, index * 70);
  });
});