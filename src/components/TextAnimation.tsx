"use client"
import { useEffect } from 'react';

const TextAnimation = () => {
  useEffect(() => {
    if (typeof gsap === 'undefined') return;
    const scope = document.querySelector('.mwg_effect005');
    if (!scope) return;
    const paragraph = scope.querySelector('.paragraph');
    if (paragraph && !paragraph.querySelector('.word')) {
      const text = (paragraph.textContent || '').trim();
      paragraph.innerHTML = text
        .split(/\s+/)
        .map((word) => `<span class="word">${word}</span>`)
        .join(' ');
    }
    const pinHeight = scope.querySelector('.pin-height');
    const container = scope.querySelector('.container');
    const words = scope.querySelectorAll('.word');
    if (!(pinHeight && container && words.length)) return;
    (container as HTMLElement).style.position = 'sticky';
    (container as HTMLElement).style.top = '0';
    const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const easeInOut4 = (p: number) =>
      p < 0.5 ? 8 * p * p * p * p : 1 - Math.pow(-2 * p + 2, 4) / 2;
    const getTranslateX = (el: Element) => {
      const t = getComputedStyle(el).transform;
      if (!t || t === 'none') return 0;
      if (t.startsWith('matrix(')) return parseFloat(t.split(',')[4]) || 0;
      if (t.startsWith('matrix3d(')) return parseFloat(t.split(',')[12]) || 0;
      return 0;
    };
    let baseX = Array.from(words, (el) => getTranslateX(el));
    baseX.forEach((x, i) => gsap.set(words[i], { x }));
    let setX = Array.from(words, (el) => gsap.quickSetter(el, 'x', 'px'));
    let setO = Array.from(words, (el) => gsap.quickSetter(el, 'opacity'));
    let startY = 0;
    let endY = 0;
    let range = 1;
    let ticking = false;
    function measure() {
      const rect = (pinHeight as HTMLElement).getBoundingClientRect();
      const y = window.scrollY;
      startY = y + rect.top - window.innerHeight * 0.7; 
      endY = y + rect.bottom - window.innerHeight; 
      range = Math.max(1, endY - startY);
    }
    function update() {
      ticking = false;
      const t = clamp01((window.scrollY - startY) / range);
      const n = words.length;
      const stagger = 0.02;
      const totalStagger = stagger * (n - 1);
      const animWindow = Math.max(0.0001, 1 - totalStagger);
      for (let i = 0; i < n; i++) {
        const localStart = i * stagger;
        const p = clamp01((t - localStart) / animWindow);
        const eased = easeInOut4(p);
        setX[i](baseX[i] * (1 - eased));
        setO[i](eased);
      }
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }
    function onResize() {
      gsap.set(words, { clearProps: 'transform,opacity' });
      measure();
      baseX = Array.from(words, (el) => getTranslateX(el));
      baseX.forEach((x, i) => gsap.set(words[i], { x }));
      setX = Array.from(words, (el) => gsap.quickSetter(el, 'x', 'px'));
      setO = Array.from(words, (el) => gsap.quickSetter(el, 'opacity'));
      update();
    }
    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      gsap.set(words, { clearProps: 'all' });
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        .mwg_effect005 .word {
          display: inline-block;
          transform: translate(calc(100vw - 25px), 0);
          opacity: 0;
          will-change: transform, opacity;
        }
      `}</style>
      
      <section id="concept" className="section mwg_effect005">
        <div className="pin-height">
          <div id="w-node-bc88ac12-87e5-4bab-38ec-eaa72f660d8d-bfe841e8" className="container">
            <p className="paragraph is--xxl">
              A retro-futurist vision shaped through AI imagery, cinematic motion and luminous soundscapes. Metallic silhouettes, fashion influences and synthetic memories merge into an immersive environment where nostalgia bends toward a future that never existed but still feels strangely real.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default TextAnimation;
