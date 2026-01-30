document.addEventListener('DOMContentLoaded', () => {

    // Typing Effect
    const textElement = document.querySelector('.typing-text');
    const texts = ['Software Engineer', 'MERN Stack Developer', 'Public Speaker', 'Tech Enthusiast'];
    let count = 0;
    let index = 0;
    let currentText = '';
    let letter = '';

    (function type() {
        if (count === texts.length) {
            count = 0;
        }
        currentText = texts[count];
        letter = currentText.slice(0, ++index);

        textElement.textContent = letter;
        if (letter.length === currentText.length) {
            count++;
            index = 0;
            setTimeout(type, 2000); // Pause at end of word
        } else {
            setTimeout(type, 100); // Typing speed
        }
    })();

    // Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');

        // Animate links
        links.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    });

    // Close menu when link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Scroll Animations
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // Three.js Background Animation
    const initThreeJS = () => {
        const container = document.getElementById('canvas-container');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Particles
        const geometry = new THREE.BufferGeometry();
        const particlesCount = 700; // Efficient number of particles
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            // Spread particles in a wider area
            posArray[i] = (Math.random() - 0.5) * 15;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        // Material
        const material = new THREE.PointsMaterial({
            size: 0.05, // Small refined dots
            color: 0x38bdf8, // Accent color (Light Blue)
            transparent: true,
            opacity: 0.8,
        });

        // Mesh
        const sphere = new THREE.Points(geometry, material);
        scene.add(sphere);

        camera.position.z = 3;

        // Interaction
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;
        });

        // Animation Loop
        const tick = () => {
            const elapsedTime = Date.now() * 0.0005;

            // Rotate entire sphere slowly
            sphere.rotation.y = .2 * elapsedTime;
            sphere.rotation.x = .1 * elapsedTime;

            // Mouse Interaction (Parallax)
            // Determine rotation based on percentage of screen width/height
            const targetX = (mouseX / window.innerWidth - 0.5) * 2;
            const targetY = (mouseY / window.innerHeight - 0.5) * 2;

            // Smoothly interpolate
            sphere.rotation.y += 0.05 * (targetX - sphere.rotation.y);
            sphere.rotation.x += 0.05 * (targetY - sphere.rotation.x);

            renderer.render(scene, camera);
            window.requestAnimationFrame(tick);
        };

        tick();

        // Handle Resize
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    };

    // Initialize Three.js after DOM content loaded (which this block is already inside)
    initThreeJS();

    // Smooth scroll for anchor links (if browser support is partial)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form Submission (Visual Feedback only)
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.textContent;

        btn.textContent = 'Message Sent!';
        btn.style.background = '#10b981'; // Success Green

        setTimeout(() => {
            form.reset();
            btn.textContent = originalText;
            btn.style.background = ''; // Revert to gradient
        }, 3000);
    });
});
