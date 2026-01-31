"use client"
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Collection = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  const images = [
    '/images/neon-x-sunglasses.jpg',
    '/images/void-01-sunglasses.jpg',
    '/images/spectrum-y-sunglasses.jpg'
  ];

  // exact code from bundle.js for text animation
  useEffect(() => {
    const scope = document.querySelector('.mwg_effect005');
    if (!scope) return;

    const paragraph = scope.querySelector('.paragraph');
    if (!paragraph) return;

    if (!paragraph.querySelector('.word')) {
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
    let animComplete = false;

    function measure() {
      const rect = pinHeight.getBoundingClientRect();
      const y = window.scrollY;
      startY = y + rect.top - window.innerHeight * 0.7;
      endY = y + rect.bottom - window.innerHeight;
      range = Math.max(1, endY - startY);
    }

    function update() {
      ticking = false;
      const t = clamp01((window.scrollY - startY) / range);
      const n = words.length;
      const stagger = 0.05; // slower
      const totalStagger = stagger * (n - 1);
      const animWindow = Math.max(0.0001, 1 - totalStagger);

      let allComplete = true;
      for (let i = 0; i < n; i++) {
        const localStart = i * stagger;
        const p = clamp01((t - localStart) / animWindow);
        const eased = easeInOut4(p);
        setX[i](baseX[i] * (1 - eased));
        setO[i](eased);
        if (eased < 1) allComplete = false;
      }

      if (allComplete && !animComplete) {
        animComplete = true;
        document.body.style.overflow = '';
      }
    }

    function onScroll(e: Event) {
      if (!animComplete) {
        e.preventDefault();
        window.scrollTo(0, window.scrollY);
      }
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

    document.body.style.overflow = 'hidden';
    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: false });
    window.addEventListener('resize', onResize);

    // auto animate on load
    setTimeout(() => {
      window.scrollTo(0, startY + range);
    }, 100);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.body.style.overflow = '';
      gsap.set(words, { clearProps: 'all' });
    };
  }, []);

  // three.js carousel
  useEffect(() => {
    if (!sliderRef.current || typeof window === 'undefined' || typeof THREE === 'undefined') return;

    const container = sliderRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, container.offsetWidth / container.offsetHeight, 0.001, 1000);
    camera.position.set(0, 0, 2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setClearColor(0x0a0a0a, 1);

    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    const textureLoader = new THREE.TextureLoader();
    const textures: THREE.Texture[] = [];
    let current = 0;
    let isRunning = false;

    const loadPromises = images.map((url, i) => 
      new Promise<void>(resolve => {
        textures[i] = textureLoader.load(url, () => resolve());
      })
    );

    Promise.all(loadPromises).then(() => {
      const displacement = textureLoader.load('https://uploads-ssl.webflow.com/5dc1ae738cab24fef27d7fd2/5dcae913c897156755170518_disp1.jpg');

      const w1 = textures[0].image?.width || 1;
      const h1 = textures[0].image?.height || 1;
      const w2 = textures[1].image?.width || 1;
      const h2 = textures[1].image?.height || 1;

      const material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: {
          progress: { value: 0 },
          intensity: { value: 1 },
          texture1: { value: textures[0] },
          texture2: { value: textures[1] },
          displacement: { value: displacement },
          res1: { value: new THREE.Vector2(w1, h1) },
          res2: { value: new THREE.Vector2(w2, h2) },
          resolution: { value: new THREE.Vector4() },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float progress;
          uniform float intensity;
          uniform sampler2D texture1;
          uniform sampler2D texture2;
          uniform sampler2D displacement;
          uniform vec4 resolution;
          uniform vec2 res1;
          uniform vec2 res2;
          varying vec2 vUv;

          mat2 getRotM(float angle) {
            float s = sin(angle);
            float c = cos(angle);
            return mat2(c, -s, s, c);
          }

          vec2 getCoverUV(vec2 uv, vec2 screenRes, vec2 imgRes) {
            float sAspect = screenRes.x / screenRes.y;
            float iAspect = imgRes.x / imgRes.y;
            float rs = sAspect / iAspect;
            vec2 newScale = vec2(1.0);
            if (rs > 1.0) { 
              newScale.y = 1.0 / rs; 
            } else { 
              newScale.x = rs; 
            }
            return (uv - 0.5) * newScale + 0.5;
          }

          const float PI = 3.1415;
          const float angle1 = PI * 0.25;
          const float angle2 = -PI * 0.75;

          void main() {
            vec2 newUV = vUv;
            vec4 disp = texture2D(displacement, newUV);
            vec2 dispVec = vec2(disp.r, disp.g);
            vec2 distVector1 = getRotM(angle1) * dispVec * intensity * progress;
            vec2 distVector2 = getRotM(angle2) * dispVec * intensity * (1.0 - progress);
            float rgbShiftStrength = 0.03 * intensity;
            vec2 uvCover1 = getCoverUV(newUV, resolution.xy, res1);
            vec2 uvCover2 = getCoverUV(newUV, resolution.xy, res2);
            vec2 uv1 = uvCover1 + distVector1;
            vec4 t1 = vec4(
              texture2D(texture1, uv1 + distVector1 * rgbShiftStrength).r,
              texture2D(texture1, uv1).g,
              texture2D(texture1, uv1 - distVector1 * rgbShiftStrength).b,
              1.0
            );
            vec2 uv2 = uvCover2 + distVector2;
            vec4 t2 = vec4(
              texture2D(texture2, uv2 + distVector2 * rgbShiftStrength).r,
              texture2D(texture2, uv2).g,
              texture2D(texture2, uv2 - distVector2 * rgbShiftStrength).b,
              1.0
            );
            gl_FragColor = mix(t1, t2, progress);
          }
        `
      });

      const geometry = new THREE.PlaneGeometry(1, 1, 2, 2);
      const plane = new THREE.Mesh(geometry, material);
      scene.add(plane);

      const resize = () => {
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        material.uniforms.resolution.value.x = width;
        material.uniforms.resolution.value.y = height;
        const dist = camera.position.z;
        camera.fov = 2 * (180 / Math.PI) * Math.atan(1 / (2 * dist));
        plane.scale.x = camera.aspect;
        plane.scale.y = 1;
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener('resize', resize);

      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();

      const next = () => {
        if (isRunning) return;
        isRunning = true;
        const nextIndex = (current + 1) % images.length;
        const nextTexture = textures[nextIndex];
        material.uniforms.texture2.value = nextTexture;
        if (nextTexture.image) {
          material.uniforms.res2.value.set(nextTexture.image.width, nextTexture.image.height);
        }
        gsap.to(material.uniforms.progress, {
          value: 1,
          duration: 1,
          ease: 'power2.inOut',
          onComplete: () => {
            current = nextIndex;
            material.uniforms.texture1.value = nextTexture;
            if (nextTexture.image) {
              material.uniforms.res1.value.set(nextTexture.image.width, nextTexture.image.height);
            }
            material.uniforms.progress.value = 0;
            isRunning = false;
          }
        });
      };

      const prev = () => {
        if (isRunning) return;
        isRunning = true;
        const prevIndex = current === 0 ? images.length - 1 : current - 1;
        const prevTexture = textures[prevIndex];
        material.uniforms.texture2.value = prevTexture;
        if (prevTexture.image) {
          material.uniforms.res2.value.set(prevTexture.image.width, prevTexture.image.height);
        }
        gsap.to(material.uniforms.progress, {
          value: 1,
          duration: 1,
          ease: 'power2.inOut',
          onComplete: () => {
            current = prevIndex;
            material.uniforms.texture1.value = prevTexture;
            if (prevTexture.image) {
              material.uniforms.res1.value.set(prevTexture.image.width, prevTexture.image.height);
            }
            material.uniforms.progress.value = 0;
            isRunning = false;
          }
        });
      };

      const nextBtn = document.getElementById('next');
      const prevBtn = document.getElementById('prev');
      if (nextBtn) nextBtn.addEventListener('click', next);
      if (prevBtn) prevBtn.addEventListener('click', prev);

      return () => {
        window.removeEventListener('resize', resize);
        if (nextBtn) nextBtn.removeEventListener('click', next);
        if (prevBtn) prevBtn.removeEventListener('click', prev);
        renderer.dispose();
        geometry.dispose();
        material.dispose();
      };
    });
  }, []);

  return (
    <>
      <section id="concept" className="section mwg_effect005 bg-white text-black">
        <div className="pin-height">
          <div id="w-node-bc88ac12-87e5-4bab-38ec-eaa72f660d8d-bfe841e8" className="container">
            <p className="paragraph is--xxl">
              A retro-futurist vision shaped through AI imagery, cinematic motion and luminous soundscapes. Metallic silhouettes, fashion influences and synthetic memories merge into an immersive environment where nostalgia bends toward a future that never existed but still feels strangely real.
            </p>
          </div>
        </div>
      </section>
      
      <section className="min-h-screen relative bg-[#0a0a0a] flex items-center justify-center">
        <main className="w-full h-screen relative">
        <div className="absolute top-8 left-8 z-10">
          <span className="text-primary font-mono text-xs uppercase tracking-widest">Collection_01</span>
        </div>
        <div className="controls__wrap absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-10">
          <div id="next" className="next cursor-pointer">
            <div className="px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-black transition-all font-mono text-sm">
              PREV
            </div>
          </div>
          <div id="prev" className="prev cursor-pointer">
            <div className="px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-black transition-all font-mono text-sm">
              NEXT
            </div>
          </div>
        </div>
        <div 
          ref={sliderRef} 
          id="slider" 
          className="w-full h-full relative"
          data-images={JSON.stringify(images)}
        />
        </main>
      </section>
    </>
  );
};

export default Collection;
