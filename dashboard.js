(function() {
  if (typeof gsap !== "undefined" && gsap.from) {
    gsap.from(".stat-card, .card", { y: 24, opacity: 0, stagger: 0.15, duration: 0.5, ease: "power2.out" });
  }
  document.querySelectorAll(".counter").forEach(function(counter) {
    var target = parseInt(counter.getAttribute("data-target"), 10) || 0;
    var count = 0;
    function update() {
      if (count < target) {
        count += Math.max(1, Math.ceil(target / 30));
        if (count > target) count = target;
        counter.innerText = count;
        requestAnimationFrame(update);
      } else {
        counter.innerText = target;
      }
    }
    update();
  });
})();
