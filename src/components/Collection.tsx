"use client"


// import { useEffect, useRef, useState } from "react"
import React. {useEffect, useRef, useState} from "react"



// import React, { useRef, useEffect, useState } from 'react'
// import gsap from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'
// import { useGSAP } from '@gsap/react'

// gsap.registerPlugin(ScrollTrigger)

// const slides = [
//   { title: "First Verse", image: "img1.jpg" },
//   { title: "Second Verse", image: "img2.jpg" },
//   // ... more slides
// ];

// const Collection = () => {
//   const sliderRef = useRef<HTMLElement>(null)
//   const [activeSlide, setActiveSlide] = useState(0)

//   const animateNewSlide = (index: number) => {
//     // Animation logic for new slide
//     console.log('Animating to slide:', index)
//   }

//   useGSAP(() => {
//     if (typeof window === 'undefined') return
    
//     const pinDistance = window.innerHeight * slides.length;

//     ScrollTrigger.create({
//       trigger: ".slider",
//       start: "top top",
//       end: `+=${pinDistance}`,
//       pin: true,
//       scrub: true,
//       onUpdate: (self) => {
//         // 1. Update Progress Bar
//         gsap.to(".slider-progress", { scaleY: self.progress });

//         // 2. Calculate Active Slide
//         const index = Math.floor(self.progress * slides.length);
//         if (index !== activeSlide && index < slides.length) {
//           setActiveSlide(index);
//           animateNewSlide(index);
//         }
//       }
//     });
//   }, { scope: sliderRef })

//   return (
//     <section className="slider" ref={sliderRef}>
//       <div className="slider-images">
//         <img src="initial-image.jpg" alt="" />
//       </div>
//       <div className="slider-title">
//         <h1>Your First Title</h1>
//       </div>
//       <div className="slider-indicator">
//         <div className="slider-indexes"></div> 
//         <div className="slider-progress-bar">
//           <div className="slider-progress"></div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default Collection


