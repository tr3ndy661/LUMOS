"use client"

import React, {useState, useRef, useEffect} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import './menu.css'
import { useTextScramble } from '@/hooks/useTextScramble'
const menuLinks = [
  {path: "/", label: "LUMOS"},
  {path: "/", label: "Collection"},
  {path: "/", label: "Manifesto"},
  {path: "/", label: "Lab"}
]

const NavBar = () => {
  const container = useRef<HTMLDivElement | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scramble } = useTextScramble(); 
  const tl = useRef<gsap.core.Timeline | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget;
    const originalText = target.getAttribute('data-text') || target.innerText;
    scramble(target, originalText);
  };

  useGSAP(() => {
    gsap.set(".menu-link-item-holder a", { y: 75 });

    tl.current = gsap.timeline({ paused: true })
      .to(".menu-overlay", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1.25,
        ease: "power4.inOut",
      })
      .to(".menu-link-item-holder a", {
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power4.inOut",
        delay: -0.75,
      });
  }, { scope: container });

  useEffect(() => {
    if (isMenuOpen) {
      tl.current?.play();
    } else {
      tl.current?.reverse();
    }
  }, [isMenuOpen]);

  return (
    <div className='menu-container' ref={container}>
      
      {/* Top Bar (Always Visible) */}
      <div className='menu-bar'>
        <div className='menu-logo'>
          <Image 
            src="/images/logo.svg" 
            alt="LUMOS LOGO" 
            width={32}
            height={32}
            className="invert"
            priority
          />
          <Link href="/" className="font-bold tracking-tighter uppercase text-white">LUMOS</Link>
        </div>
         <div className="flex items-center gap-4">
        <button className='px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-all font-mono text-sm'>SHOP</button>
        <div className='menu-open' onClick={toggleMenu}>
          <div className="hamburger-icon">
            <span className={`hamburger-line ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`hamburger-line ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`hamburger-line ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </div>
      </div>
      </div>

      {/* Full Screen Overlay */}
      <div className='menu-overlay'>
        
        {/* Overlay Top Bar */}
        <div className='menu-overlay-bar'>
          <div className='menu-logo'>
            <Image 
              src="/images/logo.svg" 
              alt="LUMOS LOGO" 
              width={32}
              height={32}
              className="invert-0"
            />
            <Link href="/">LUMOS</Link>
          </div>
          <div className='menu-close' onClick={toggleMenu}>
            <div className="hamburger-icon">
              <span className={`hamburger-line ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`hamburger-line ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`hamburger-line ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </div>
        </div>

        {/* Big GitHub Link */}
        <div className='menu-close-icon'>
          <a href="https://github.com/tr3ndy661" target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-70 transition-opacity">
            View GitHub ↗
          </a>
        </div>

        {/* Links Section */}
        <div className='menu-copy'>
          <div className='menu-links'>
            {menuLinks.map((link, index) => (
              <div className='menu-link-item' key={index}>
                <div className="menu-link-item-holder" onClick={toggleMenu}>
                  <Link href={link.path} className='menu-link'
                    onMouseEnter={handleLinkHover}>
                    {link.label}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Info Section */}
          <div className='menu-info'>
            <div className="menu-info-col">
              <a href="#" onMouseEnter={handleLinkHover} data-text="X ↗">X &#8599;</a>
                  <a href="#" onMouseEnter={handleLinkHover} data-text="Instagram ↗">Instagram &#8599;</a>
                  <a href="#" onMouseEnter={handleLinkHover} data-text="LinkedIn ↗">LinkedIn &#8599;</a>
                  <a href="#" onMouseEnter={handleLinkHover} data-text="Dribble ↗">Dribble &#8599;</a>
            </div>
            <div className="menu-info-col">
              <p>shop@lumos.com</p>
              <p>+20 1553873166</p>
            </div>
          </div>
        </div>

        {/* Preview Section (Bottom Right) */}
        <div className='menu-preview'>
          <a href="https://github.com/tr3ndy661/LUMOS" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity text-black">
            Site Source Code
          </a>
        </div>
      </div>
     
    </div>
  )
}

export default NavBar
