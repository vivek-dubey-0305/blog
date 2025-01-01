import { Link } from "react-router-dom";
import lightPageImageNotFound from "../imgs/404-light.png";
import darkPageImageNotFound from "../imgs/404-dark.png";
import lightFullLogo from "../imgs/full-logo-light.png";
import darkFullLogo from "../imgs/full-logo-dark.png";
import { useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../App";
import * as THREE from "three";

const PageNotFound = () => {
  let { theme } = useContext(ThemeContext);
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    if (canvasRef.current) {
      canvasRef.current.appendChild(renderer.domElement);
    }

    // Enhanced particles with varying sizes
    const particleCount = 1000;
    const particlesGeometry = new THREE.BufferGeometry();
    const sizes = new Float32Array(particleCount);
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 250;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 250;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 250;
      sizes[i] = Math.random() * 3;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particlesMaterial = new THREE.PointsMaterial({
      color: theme === "light" ? 0x582c8e : 0x8b46ff,
      size: 2.5,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.z = 60;

    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      
      // Smooth rotation following mouse
      targetRotationX = mouseY * 0.5;
      targetRotationY = mouseX * 0.5;
      
      particles.rotation.x += (targetRotationX - particles.rotation.x) * 0.05;
      particles.rotation.y += (targetRotationY - particles.rotation.y) * 0.05;
      
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, [theme]);

  return (
    <section className="min-h-screen relative p-6 md:p-10 flex flex-col items-center justify-center gap-12 text-center bg-gradient-to-b from-transparent to-background transition-colors duration-300">
      <div
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full -z-10"
      />

      <div className="relative group">
        <img
          src={theme === "light" ? darkPageImageNotFound : lightPageImageNotFound}
          alt="404Page"
          className="select-none border-2 border-grey w-48 md:w-72 aspect-square object-cover rounded-lg shadow-xl transform transition-all duration-500 hover:scale-105 animate-float"
        />
        <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <h1 className="text-4xl md:text-6xl font-gelasio leading-snug bg-gradient-to-r from-purple to-pink-500 bg-clip-text text-transparent animate-fade-in">
        Oops! Page Not Found
      </h1>

      <p className="text-dark-grey text-lg md:text-2xl leading-7 max-w-lg animate-fade-in-up">
        The page you are trying to reach doesn't exist. Head back to the
        <Link
          to="/"
          className="text-purple underline hover:text-purple/80 transition-colors duration-300 ml-1 relative group"
        >
          Home Page
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </Link>
        .
      </p>

      <div className="mt-auto animate-fade-in">
        <img
          src={theme === "light" ? darkFullLogo : lightFullLogo}
          alt="Logo"
          className="h-8 md:h-12 object-contain block mx-auto select-none hover:opacity-80 transition-opacity duration-300"
        />
        <p className="mt-3 md:mt-5 text-dark-grey text-sm md:text-base">
          Discover millions of stories around the globe!
        </p>
      </div>
    </section>
  );
};

export default PageNotFound;