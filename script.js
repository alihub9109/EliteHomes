// Header Scroll Effect
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Add this to your existing JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const tourCards = document.querySelectorAll('.tour-card');
    
    tourCards.forEach(card => {
        const iframe = card.querySelector('iframe');
        
        // Check if iframe failed to load
        setTimeout(() => {
            if (!iframe || iframe.contentDocument && iframe.contentDocument.body.innerHTML.includes('not available')) {
                card.innerHTML = `
                    <div class="tour-fallback">
                        <i class="fas fa-home"></i>
                        <h3>3D Tour Currently Unavailable</h3>
                        <p>Please contact us to schedule an in-person viewing</p>
                        <a href="#contact" class="cta-button">Contact Agent</a>
                    </div>
                    ${card.innerHTML}
                `;
            }
        }, 3000); // Check after 3 seconds
    });
});

// Testimonial Slider
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.testimonial-nav button');
let currentTestimonial = 0;

function showTestimonial(index) {
    testimonials.forEach(testimonial => testimonial.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    testimonials[index].classList.add('active');
    dots[index].classList.add('active');
    currentTestimonial = index;
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showTestimonial(index));
});

// Auto-rotate testimonials
setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}, 5000);

// Property Modal
const modal = document.getElementById('property-modal');
const closeModal = document.querySelector('.close-modal');
const propertyCards = document.querySelectorAll('.property-card');
const thumbnails = document.querySelectorAll('.modal-thumbnail');
const mainImage = document.querySelector('.modal-main-image img');

propertyCards.forEach(card => {
    card.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
        thumbnails.forEach(t => t.classList.remove('active'));
        thumbnail.classList.add('active');
        mainImage.src = thumbnail.querySelector('img').src;
    });
});

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Section animations
gsap.utils.toArray('.section').forEach(section => {
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none"
        },
        opacity: 0,
        y: 50,
        duration: 1
    });
});

// Property card animations
gsap.utils.toArray('.property-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none none"
        },
        opacity: 0,
        y: 50,
        duration: 0.5,
        delay: i * 0.1
    });
});

// 3D Hero Animation
const heroCanvas = document.getElementById('hero-canvas');
const aboutCanvas = document.getElementById('about-canvas');

if (heroCanvas && aboutCanvas) {
    // Hero Scene
    const heroScene = new THREE.Scene();
    const heroCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const heroRenderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true });
    heroRenderer.setSize(window.innerWidth, window.innerHeight);
    heroRenderer.setClearColor(0x000000, 0);

    // Hero Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    heroScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    heroScene.add(directionalLight);

    // Hero Model (simplified for demo)
    const geometry = new THREE.BoxGeometry(3, 2, 3);
    const material = new THREE.MeshPhongMaterial({ 
        color: 0xd4af37,
        emissive: 0x000000,
        specular: 0xffffff,
        shininess: 30,
        wireframe: true
    });
    const house = new THREE.Mesh(geometry, material);
    heroScene.add(house);

    heroCamera.position.z = 5;

    // Animate Hero
    function animateHero() {
        requestAnimationFrame(animateHero);
        house.rotation.x += 0.005;
        house.rotation.y += 0.01;
        heroRenderer.render(heroScene, heroCamera);
    }

    animateHero();

    // About Scene
    const aboutScene = new THREE.Scene();
    const aboutCamera = new THREE.PerspectiveCamera(75, aboutCanvas.clientWidth / aboutCanvas.clientHeight, 0.1, 1000);
    const aboutRenderer = new THREE.WebGLRenderer({ canvas: aboutCanvas, alpha: true });
    aboutRenderer.setSize(aboutCanvas.clientWidth, aboutCanvas.clientHeight);
    aboutRenderer.setClearColor(0x000000, 0);

    // About Lighting
    const aboutAmbientLight = new THREE.AmbientLight(0x404040);
    aboutScene.add(aboutAmbientLight);

    const aboutDirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
    aboutDirectionalLight.position.set(1, 1, 1);
    aboutScene.add(aboutDirectionalLight);

    // About Model (simplified for demo)
    const aboutGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const aboutMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xd4af37,
        emissive: 0x000000,
        specular: 0xffffff,
        shininess: 30,
        wireframe: true
    });
    const sphere = new THREE.Mesh(aboutGeometry, aboutMaterial);
    aboutScene.add(sphere);

    aboutCamera.position.z = 3;

    // Animate About
    function animateAbout() {
        requestAnimationFrame(animateAbout);
        sphere.rotation.x += 0.005;
        sphere.rotation.y += 0.005;
        aboutRenderer.render(aboutScene, aboutCamera);
    }

    animateAbout();

    // Handle window resize
    window.addEventListener('resize', () => {
        // Hero
        heroCamera.aspect = window.innerWidth / window.innerHeight;
        heroCamera.updateProjectionMatrix();
        heroRenderer.setSize(window.innerWidth, window.innerHeight);

        // About
        aboutCamera.aspect = aboutCanvas.clientWidth / aboutCanvas.clientHeight;
        aboutCamera.updateProjectionMatrix();
        aboutRenderer.setSize(aboutCanvas.clientWidth, aboutCanvas.clientHeight);
    });
}

// Form submission
document.getElementById('inquiry-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your inquiry. Our team will contact you shortly.');
    this.reset();
});
