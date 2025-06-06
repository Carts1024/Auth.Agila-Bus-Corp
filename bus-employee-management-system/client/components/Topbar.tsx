/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useRef, useState } from 'react';
import "@/styles/topbar.css";

const Topbar = () => {
  const underlineRef = useRef<HTMLDivElement>(null);
  const [activeLink, setActiveLink] = useState('Human Resource'); // Set default active link

  const updateUnderline = (el: HTMLElement) => {
    if (underlineRef.current) {
      underlineRef.current.style.left = `${el.offsetLeft}px`;
      underlineRef.current.style.width = `${el.offsetWidth}px`;
    }
  };

  useEffect(() => {
    const topLinks = document.querySelectorAll('.top-link');
    const underline = underlineRef.current;

    const handleClick = (e: Event) => {
      e.preventDefault();
      const target = e.currentTarget as HTMLElement;
      setActiveLink(target.textContent || '');
      updateUnderline(target);
    };

    topLinks.forEach((link) => {
      link.addEventListener('click', handleClick);
    });

    const handleResize = () => {
      const activeElement = document.querySelector(`.top-link[data-link="${activeLink}"]`) as HTMLElement;
      if (activeElement) {
        requestAnimationFrame(() => updateUnderline(activeElement));
      }
    };

    // Watch sidebar class changes (e.g., collapse/expand)
    const sidebar = document.querySelector('.sidebar');
    const mutationObserver = new MutationObserver(() => handleResize());
    if (sidebar) {
      mutationObserver.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
    }

    // Watch top-links resizing (container changes)
    const topLinksContainer = document.querySelector('.top-links');
    const resizeObserver = new ResizeObserver(() => handleResize());
    if (topLinksContainer) {
      resizeObserver.observe(topLinksContainer);
    }

    // Initial positioning
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      topLinks.forEach((link) => {
        link.removeEventListener('click', handleClick);
      });
      window.removeEventListener('resize', handleResize);
      mutationObserver.disconnect();
      if (topLinksContainer) resizeObserver.unobserve(topLinksContainer);
    };
  }, [activeLink]);

  return (
    <div className="top-bar">
      <div className="top-links">
        <a 
          href="#" 
          className={`top-link ${activeLink === 'Dashboard' ? 'active' : ''}`}
          data-link="Dashboard"
        >
          Dashboard
        </a>
        <a 
          href="#" 
          className={`top-link ${activeLink === 'Accounting' ? 'active' : ''}`}
          data-link="Accounting"
        >
          Accounting
        </a>
        <a 
          href="#" 
          className={`top-link ${activeLink === 'Human Resource' ? 'active' : ''}`}
          data-link="Human Resource"
        >
          Human Resource
        </a>
        <a 
          href="#" 
          className={`top-link ${activeLink === 'Inventory' ? 'active' : ''}`}
          data-link="Inventory"
        >
          Inventory
        </a>
        <a 
          href="#" 
          className={`top-link ${activeLink === 'Operational' ? 'active' : ''}`}
          data-link="Operational"
        >
          Operational
        </a>
        <div className="link-underline" ref={underlineRef}></div>
      </div>
    </div>
  );
};

export default Topbar;