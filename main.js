/* ===============================
   INDIAN ARMY RADAR BACKGROUND
================================ */
var canvas = document.getElementById("army-bg");
var ctx = canvas && canvas.getContext("2d");
var w, h, angle = 0;

function resizeCanvas() {
  if (!canvas) return;
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
if (window) window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function drawRadar() {
  if (!ctx || !w || !h) return requestAnimationFrame(drawRadar);
  ctx.clearRect(0, 0, w, h);
  var cx = w / 2, cy = h / 2, radius = Math.min(w, h) / 3;
  ctx.strokeStyle = "rgba(0,255,180,0.06)";
  for (var i = 0; i < radius; i += 40) {
    ctx.beginPath();
    ctx.arc(cx, cy, i, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(cx - radius, cy);
  ctx.lineTo(cx + radius, cy);
  ctx.moveTo(cx, cy - radius);
  ctx.lineTo(cx, cy + radius);
  ctx.stroke();
  var sweepAngle = angle % (Math.PI * 2);
  var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  grad.addColorStop(0, "rgba(0,255,180,0.18)");
  grad.addColorStop(1, "rgba(0,255,180,0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, radius, sweepAngle, sweepAngle + 0.35);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(201,162,39,0.06)";
  ctx.beginPath();
  ctx.arc(cx, cy, radius + 25, 0, Math.PI * 2);
  ctx.stroke();
  angle += 0.006;
  requestAnimationFrame(drawRadar);
}
drawRadar();

/* ===============================
   GSAP PAGE ANIMATIONS
================================ */
(function() {
  if (typeof gsap === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  var badge = document.querySelector('[data-animate="badge"]');
  var title = document.querySelector('[data-animate="title"]');
  var subtitle = document.querySelector('[data-animate="subtitle"]');
  var cta = document.querySelector('[data-animate="cta"]');
  var footer = document.querySelector('[data-animate="footer"]');
  var cards = document.querySelectorAll(".animate-card");
  var statNumbers = document.querySelectorAll(".stat-number");
  var timelineItems = document.querySelectorAll(".landing-timeline .timeline-item");

  gsap.set([badge, title, subtitle, cta, footer], { opacity: 0, y: 30 });
  gsap.set(cards, { opacity: 0, y: 50, scale: 0.92 });

  var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.to(badge, { opacity: 1, y: 0, duration: 0.6 })
    .to(title, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
    .to(subtitle, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35")
    .to(cta, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
    .to(footer, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2");

  gsap.to(cards, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.6,
    stagger: 0.15,
    delay: 0.8,
    ease: "back.out(1.2)"
  });

  if (document.querySelector(".hero-btn")) {
    gsap.to(".hero-btn", {
      boxShadow: "0 0 20px rgba(201,162,39,0.4), 0 4px 16px rgba(0,0,0,0.4)",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 2
    });
  }

  if (cards.length) {
    gsap.set(".landing .cards", { perspective: 1000 });
    gsap.set(cards, { transformStyle: "preserve-3d" });
    cards.forEach(function(card) {
      card.addEventListener("mousemove", function(e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotateX: -y * 10,
          rotateY: x * 10,
          scale: 1.03,
          duration: 0.3,
          ease: "power2.out"
        });
      });
      card.addEventListener("mouseleave", function() {
        gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.4, ease: "power2.out" });
      });
    });
  }

  if (statNumbers.length) {
    statNumbers.forEach(function(el) {
      var target = parseInt(el.getAttribute("data-target"), 10) || 0;
      ScrollTrigger.create({
        trigger: "#landingStats",
        start: "top 80%",
        once: true,
        onEnter: function() {
          gsap.fromTo(el, { textContent: 0 }, {
            textContent: target,
            duration: 2,
            ease: "power1.out",
            snap: { textContent: 1 },
            onUpdate: function() {
              el.textContent = Math.floor(el.textContent);
            }
          });
        }
      });
    });
  }

  if (timelineItems.length) {
    timelineItems.forEach(function(item, idx) {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        x: idx % 2 === 0 ? -30 : 30,
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      });
    });
  }
})();
