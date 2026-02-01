"use client"
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
// import TextAnimation from './TextAnimation';

const Collection = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const images = [
    '/images/693aebf2932784e89c61bda4_mob-min.avif',
    '/images/6946aee2d5baa87147c2e8a6_012.avif',
    '/images/6954f278b16b2664ea9350dd_visionary.avif',
    '/images/6954f7a523a248a07c6595f5_imgi_1_66f15c862f910266b5b1aed8_awwwards_SOTD_cover-Retronova-Nicola-Romei.webp',
  ];

  const imageTexts = [
    'Mobile-first design approach with minimalist aesthetics and modern interface patterns. Creating seamless experiences across all devices with responsive layouts.',
    'Experimental typography and bold visual hierarchy create striking digital experiences. Pushing boundaries with innovative design solutions that captivate and engage users.',
    'Visionary attributes drive design beyond aesthetics. They challenge conventions, embrace innovation, and transform ideas into impactful visual stories that resonate deeply.',
    'Award-winning Retronova project showcasing futuristic design and immersive user experience. Recognized for excellence in digital creativity and innovative interaction design.',
  ];

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
      new Promise<void>((resolve, reject) => {
        textures[i] = textureLoader.load(
          url,
          () => {
            console.log(`Loaded: ${url}`);
            resolve();
          },
          undefined,
          (error) => {
            console.error(`Failed to load: ${url}`, error);
            reject(error);
          }
        );
      })
    );

    let cleanup: (() => void) | null = null;

    Promise.all(loadPromises).then(() => {
      console.log('All textures loaded', textures);
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
        
        // Animate text out
        if (textRef.current) {
          gsap.to(textRef.current, {
            x: -100,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.in'
          });
        }
        
        gsap.to(material.uniforms.progress, {
          value: 1,
          duration: 1,
          ease: 'power2.inOut',
          onComplete: () => {
            current = nextIndex;
            setCurrentIndex(nextIndex);
            material.uniforms.texture1.value = nextTexture;
            if (nextTexture.image) {
              material.uniforms.res1.value.set(nextTexture.image.width, nextTexture.image.height);
            }
            material.uniforms.progress.value = 0;
            isRunning = false;
            
            // Animate text in
            if (textRef.current) {
              gsap.fromTo(textRef.current, 
                { x: 100, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
              );
            }
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
        
        // Animate text out
        if (textRef.current) {
          gsap.to(textRef.current, {
            x: 100,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.in'
          });
        }
        
        gsap.to(material.uniforms.progress, {
          value: 1,
          duration: 1,
          ease: 'power2.inOut',
          onComplete: () => {
            current = prevIndex;
            setCurrentIndex(prevIndex);
            material.uniforms.texture1.value = prevTexture;
            if (prevTexture.image) {
              material.uniforms.res1.value.set(prevTexture.image.width, prevTexture.image.height);
            }
            material.uniforms.progress.value = 0;
            isRunning = false;
            
            // Animate text in
            if (textRef.current) {
              gsap.fromTo(textRef.current, 
                { x: -100, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
              );
            }
          }
        });
      };

      const nextBtn = document.getElementById('next');
      const prevBtn = document.getElementById('prev');
      if (nextBtn) nextBtn.addEventListener('click', next);
      if (prevBtn) prevBtn.addEventListener('click', prev);

      cleanup = () => {
        window.removeEventListener('resize', resize);
        if (nextBtn) nextBtn.removeEventListener('click', next);
        if (prevBtn) prevBtn.removeEventListener('click', prev);
        renderer.dispose();
        geometry.dispose();
        material.dispose();
      };
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <>
      <section className="min-h-screen relative bg-[#0a0a0a] flex">
        <div className="w-1/4 h-screen flex items-center justify-center px-8 overflow-hidden">
          <p ref={textRef} className="text-white text-lg font-light leading-relaxed">{imageTexts[currentIndex]}</p>
        </div>
        <main className="w-3/4 h-screen relative">
          <div className="absolute top-8 left-8 z-10">
            <span className="text-primary font-mono text-xs uppercase tracking-widest">Collection_01</span>
          </div>
          <div className="w-full h-full relative">
            <div 
              ref={sliderRef} 
              id="slider" 
              className="w-full h-full absolute inset-0"
              data-images={JSON.stringify(images)}
              />
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          </div>
          <div className="controls__wrap absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-10">
            <div id="prev" className="prev cursor-pointer">
              <div className="px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-black transition-all font-mono text-sm">
                PREV
              </div>
            </div>
            <div id="next" className="next cursor-pointer">
              <div className="px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-black transition-all font-mono text-sm">
                NEXT
              </div>
            </div>
          </div>
        </main>
      </section>
    </>
  );
};

export default Collection;
