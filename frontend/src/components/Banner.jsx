import React, { useState, useEffect } from 'react';
import './Banner.css';

const Banner = () => {
  const images = [
    '/portadas/portada1.png',
    '/portadas/portada2.png',
    '/portadas/portada3.png'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <section className="banner">
      <div className="banner-side banner-side-left" aria-hidden="true" />
      <div className="banner-side banner-side-right" aria-hidden="true" />
  {images.map((img, index) => (
    <div
      key={index}
      className={`banner-image ${index === currentImageIndex ? "active" : ""}`}
      style={{ backgroundImage: `url(${img})` }}
    />
  ))}

  <div className="banner-content">
    <div className="banner-logo-wrapper">
      <div className="banner-reel">
        <div className="banner-reel-ring" />
      </div>
      <h1>Pelis<span>Online</span></h1>
    </div>
    <p>Tu catálogo de películas favoritas en un solo lugar</p>
    <button className="btn-primary" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>Ver Catálogo</button>
  </div>
</section>

  );
};

export default Banner;
