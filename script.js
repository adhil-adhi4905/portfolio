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

            // Improved Scroll Animations with Staggering
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered delays to children if they are grid items
                if (entry.target.classList.contains('projects-grid') || entry.target.classList.contains('skills-container')) {
                     const children = entry.target.children;
                     Array.from(children).forEach((child, index) => {
                         child.style.transitionDelay = `${index * 0.1}s`;
                         child.classList.add('visible'); // Assuming children also have fade-in or similar
                     });
                }
                
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // Three.js Background Animation (Premium Wireframe Torus Knot)
    const initThreeJS = () => {
        const container = document.getElementById('canvas-container');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Group to hold all 3D objects
        const group = new THREE.Group();
        scene.add(group);

        // 1. Torus Knot Wireframe
        const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
        const material = new THREE.MeshBasicMaterial({
            color: 0x38bdf8, // Light Blue
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const torusKnot = new THREE.Mesh(geometry, material);
        group.add(torusKnot);

        // 2. Floating Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1500; // Increased count
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 60; // Wider spread
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            color: 0x818cf8, // Changed to secondary gradient color
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        group.add(particlesMesh);

        camera.position.z = 30;

        // Interaction
        let mouseX = 0;
        let mouseY = 0;

        // Smoother mouse tracking
        let targetX = 0;
        let targetY = 0;

        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - windowHalfX);
            mouseY = (event.clientY - windowHalfY);
        });

        // Animation Loop
        const clock = new THREE.Clock();

        const tick = () => {
            const elapsedTime = clock.getElapsedTime();

            targetX = mouseX * 0.001;
            targetY = mouseY * 0.001;

            // Self-rotation
            torusKnot.rotation.y += 0.005;
            torusKnot.rotation.z += 0.002;

            // Particles wave effect
            particlesMesh.rotation.y = -elapsedTime * 0.1;
            particlesMesh.position.y = Math.sin(elapsedTime * 0.5) * 2;

            // Smooth Mouse Parallax
            group.rotation.y += 0.05 * (targetX - group.rotation.y);
            group.rotation.x += 0.05 * (targetY - group.rotation.x);

            renderer.render(scene, camera);
            window.requestAnimationFrame(tick);
        };

        tick();

        // Handle Resize
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
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

    // Form Submission (Google Form + Popup)
    const form = document.getElementById('contactForm');
    const modal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');

    form.addEventListener('submit', () => {
        // Allow the form to submit to the hidden iframe naturally

        // Show Popup after short delay (to ensure submission starts)
        setTimeout(() => {
            modal.classList.add('active');
            form.reset();
        }, 500);
    });

    // Close Modal Logic
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Close clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});
