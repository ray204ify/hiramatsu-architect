// 年号
document.addEventListener('DOMContentLoaded', () => {
  const y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();
});

/* ===== ヒーロー：自動ドリフト + 弱めのマウス追従 ===== */
(() => {
  const hero = document.getElementById('heroCanvas');
  if (!hero) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const layers = hero.querySelectorAll('[data-depth]');
  let mx = 0, my = 0, tx = 0, ty = 0, t = 0;
  let running = true;

  // 画面内だけ動かす（省エネ）
  const io = new IntersectionObserver(entries => {
    running = entries[0]?.isIntersecting ?? true;
  }, { threshold: 0.05 });
  io.observe(hero);

  // マウスの影響は弱め（自動がメイン）
  window.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    mx = (e.clientX - (r.left + r.width / 2)) * 0.35;
    my = (e.clientY - (r.top  + r.height / 2)) * 0.35;
  }, { passive: true });

  function loop() {
    if (running && !reduceMotion) {
      t += 0.008;
      tx += (mx - tx) * 0.06;
      ty += (my - ty) * 0.06;

      const driftX = Math.cos(t * 1.3) * 12;
      const driftY = Math.sin(t * 1.0) * 10;

      layers.forEach(el => {
        const d = parseFloat(el.dataset.depth || '0.05');
        const x = (-tx * d) + (driftX * d * 2.2);
        const y = (-ty * d) + (driftY * d * 2.2);

        if (el.classList.contains('hero-photo')) {
          el.style.transform = `translate(-50%,-50%) translate3d(${x}px, ${y}px, 0)`;
        } else {
          el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
      });
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
