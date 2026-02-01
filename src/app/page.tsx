'use client'
import { useEffect, useRef, useState } from "react";
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from '@gsap/react'
import Lenis from '@studio-freight/lenis'


gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const titleRef = useRef<HTMLHeadElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const sliderRef = useRef<HTMLElement>(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const philosophyRef = useRef<HTMLDivElement>(null)

const lenis = new Lenis();

lenis.on('scroll', (e: any) => {
  console.log(e);
});

lenis.on('scroll', ScrollTrigger.update);

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

gsap.ticker.add((time: number) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0)

  const slides = [
    { title: "First Verse", image: "img1.jpg" },
    { title: "Second Verse", image: "img2.jpg" },
    // ... more slides
  ];
  

  const animateNewSlide = (index: number) => {
    // Animation logic for new slide
    console.log('Animating to slide:', index)
  }

  useGSAP(() => {
    if (typeof window === 'undefined') return
    
    const pinDistance = window.innerHeight * slides.length;

    ScrollTrigger.create({
      trigger: ".slider",
      start: "top top",
      end: `+=${pinDistance}`,
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        // 1. Update Progress Bar
        gsap.to(".slider-progress", { scaleY: self.progress });

        // 2. Calculate Active Slide
        const index = Math.floor(self.progress * slides.length);
        if (index !== activeSlide && index < slides.length) {
          setActiveSlide(index);
          animateNewSlide(index);
        }
      }
    });
  }, { scope: sliderRef })

useEffect(() => {
  if(titleRef.current && subtitleRef.current) {
    gsap.to(titleRef.current, {
      color: "#fff",
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top center",
        end: "bottom center",
        scrub: true,
      },
    });
    gsap.to(subtitleRef.current, {
      color: "#fff",
      scrollTrigger: {
        trigger: subtitleRef.current,
        start: "top center",
        end: "bottom center",
        scrub: true,
      }
    })
  }

  // Typewriter animation
  const text = "VISIONARY BY DESIGN";
  const typewriterElement = document.querySelector('.typewriter-text');
  
  if (typewriterElement) {
    ScrollTrigger.create({
      trigger: '.typewriter-container',
      start: 'top 70%',
      onEnter: () => {
        let i = 0;
        const typeInterval = setInterval(() => {
          typewriterElement.textContent = text.slice(0, i + 1);
          i++;
          if (i >= text.length) {
            clearInterval(typeInterval);
          }
        }, 100);
      }
    });
  }
}, [])

  return (
    <main>
      {/* overlaty container */}
      <div className="">
            {/* Background Video */}
      {/* <div className="fixed inset-0 -z-10 w-full h-full   bg-black/60">
        <video
        src="/videos/7565451-hd_2048_1080_25fps.mp4"
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
        />
      </div> */}
      
      {/* Dark Interactive Animation */}
      <div className="fixed inset-0 -z-10 w-full h-full bg-black overflow-hidden">
        <div className="absolute inset-0">
          {Array.from({ length: 200 }).map((_, i) => {
            const size = Math.random() * 3 + 1;
            const opacity = Math.random() * 0.8 + 0.2;
            const isGray = Math.random() > 0.6;
            const speed = Math.random() * 10;
            return (
              <div
                key={i}
                className={`absolute rounded-full ${isGray ? 'bg-primary' : 'bg-white'}`}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity,
                  animation: `moveStars ${speed}s linear infinite`
                }}
              />
            );
          })}
        </div>
      </div>
      
      </div>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-7xl md:text-[12rem] font-display font-black tracking-tighter leading-none mb-4 uppercase">
            LUMOS
          </h1>
          <p className="text-xs md:text-sm font-mono tracking-[0.5em] uppercase opacity-80">
            Avant-Garde Seeking perfection
          </p>
          <div className="mt-8">
            {/* enter the void arrow thingie */}
            <button className="group flex items-center gap-4 mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest group-hover:text-primary transition-colors">ENTER THE VOID</span>
              <div className="size-10 border border-white/20 rounded-full flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-black transition-all">
              <span className="material-symbols-outlined text-sm">arrow_downward</span>
              </div>
              <div className="absolute bottom-10 left-12 hidden md:block">
              <div className="flex gap-4 items-center">
                <span className="text-[10px] font-mono opacity-100">SCROLL TO DISCOVER</span>
                {/* sencond div for the line */}
                <div className="w-12 h-[1px] bg-white"></div>
              </div>

              </div>
            </button>
          </div>
        </div>
      </div>

      <section className="slider" ref={sliderRef}>
      <div className="slider-images">
        <img src="initial-image.jpg" alt="" />
      </div>
      <div className="slider-title px-6 md:px-12 mb-16 flex justify-between items-end">
      <span className="text-primary font-mono text-xs uppercase tracking-widest mb-4 block">Series_01</span>
        {/* <h1>Your First Title</h1> */}
      </div>
      <div className="slider-indicator">
        <div className="slider-indexes"></div> 
        <div className="slider-progress-bar">
          <div className="slider-progress"></div>
        </div>
      </div>
    </section>

    {/* Philosophy Section */}
    <section className="min-h-screen flex items-center justify-center px-6 md:px-12 py-32" ref={philosophyRef}>
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-primary font-mono text-xs uppercase tracking-widest mb-8 block">Philosophy</span>
        <div className="typewriter-container">
          <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight leading-tight mb-12">
            <span className="typewriter-text"></span>
          </h2>
        </div>
        <p className="text-lg md:text-xl opacity-80 leading-relaxed max-w-3xl mx-auto">
          We don't just create products. We craft visions that transcend the ordinary, 
          pushing boundaries between reality and imagination. LUMOS represents the fusion 
          of cutting-edge technology with visionary design philosophy.
        </p>
      </div>
    </section>

    </main>
  )
}