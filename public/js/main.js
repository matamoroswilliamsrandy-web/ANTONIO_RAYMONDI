document.addEventListener('DOMContentLoaded', () => {

    /* --- Mobile Menu Toggle --- */
    const menuToggle = document.getElementById('mobile-menu');
    const navWrapper = document.querySelector('.nav-wrapper');
    const navOverlay = document.getElementById('nav-overlay');
    const header = document.getElementById('main-header');
    const bottomNavMore = document.getElementById('bn-menu');
    const waBtn = document.querySelector('.whatsapp-float');

    function openDrawer() {
        if (!navWrapper) return;
        navWrapper.classList.add('active');
        if (navOverlay) navOverlay.classList.add('active');
        if (bottomNavMore) bottomNavMore.classList.add('active');
        if (waBtn) waBtn.style.display = 'none';
        const icon = menuToggle ? menuToggle.querySelector('i') : null;
        if (icon) icon.classList.replace('fa-bars', 'fa-times');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        if (!navWrapper) return;
        navWrapper.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        if (bottomNavMore) bottomNavMore.classList.remove('active');
        if (waBtn) waBtn.style.display = '';
        const icon = menuToggle ? menuToggle.querySelector('i') : null;
        if (icon) icon.classList.replace('fa-times', 'fa-bars');
        document.body.style.overflow = '';
    }

    // Toggle drawer al presionar el botón hamburger (desktop/viejo móvil)
    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (navWrapper && navWrapper.classList.contains('active')) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });
    }

    // Toggle drawer al presionar el botón del bottom nav (nuevo móvil)
    if (bottomNavMore) {
        bottomNavMore.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (navWrapper && navWrapper.classList.contains('active')) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });
    }

    // Cerrar drawer al tocar FUERA del drawer (en el overlay o en la página)
    document.addEventListener('touchstart', (e) => {
        if (navWrapper && navWrapper.classList.contains('active')) {
            if (!navWrapper.contains(e.target) && (!menuToggle || !menuToggle.contains(e.target)) && (!bottomNavMore || !bottomNavMore.contains(e.target))) {
                closeDrawer();
            }
        }
    }, { passive: true });

    document.addEventListener('click', (e) => {
        if (navWrapper && navWrapper.classList.contains('active')) {
            if (!navWrapper.contains(e.target) && (!menuToggle || !menuToggle.contains(e.target)) && (!bottomNavMore || !bottomNavMore.contains(e.target))) {
                closeDrawer();
            }
        }
    });

    // Cerrar drawer con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navWrapper && navWrapper.classList.contains('active')) {
            closeDrawer();
        }
    });


    /* --- Sticky Header Effect --- */
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* --- Carousel Logic --- */
    const slides = document.querySelectorAll('.carousel-slide');
    const nextBtn = document.querySelector('.next-slide');
    const prevBtn = document.querySelector('.prev-slide');
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        // Handle wrap-around
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        slides[currentSlide].classList.add('active');
    };

    const nextSlide = () => {
        showSlide(currentSlide + 1);
    };

    const prevSlide = () => {
        showSlide(currentSlide - 1);
    };

    // Event Listeners for Controls
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });
    }

    // Auto Play
    const startInterval = () => {
        slideInterval = setInterval(nextSlide, 5000); // Change every 5 seconds
    };

    const resetInterval = () => {
        clearInterval(slideInterval);
        startInterval();
    };

    if (slides.length > 0) {
        startInterval();
    }

    /* --- Scroll Reveal Animation --- */
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        revealElements.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    /* --- Stats Counter Animation --- */
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    let started = false;

    if (statsSection) {
        window.addEventListener('scroll', () => {
            if (window.scrollY >= statsSection.offsetTop - 500 && !started) {
                statNumbers.forEach(num => startCount(num));
                started = true;
            }
        });
    };

    function startCount(el) {
        const target = +el.getAttribute('data-target');
        const count = +el.innerText;
        const increment = target / 100; // Speed

        if (count < target) {
            el.innerText = Math.ceil(count + increment);
            setTimeout(() => startCount(el), 20); // Delay
        } else {
            el.innerText = target;
        }
    }

    /* --- Shattered Hero Carousel (New Version) --- */
    const heroContainer = document.getElementById('heroCarousel');
    const shatterOverlay = document.getElementById('shatterOverlay');
    const heroSlides = document.querySelectorAll('.hero-main-carousel .carousel-slide');
    let activeHeroSlide = 0;

    const createShatterEffect = (imageUrl) => {
        shatterOverlay.innerHTML = '';
        const rows = 8; // High density: smaller and more shards
        const cols = 10;
        const totalShards = rows * cols;

        for (let i = 0; i < totalShards; i++) {
            const shard = document.createElement('div');
            shard.className = 'shard';

            const row = Math.floor(i / cols);
            const col = i % cols;

            const w = 100 / cols;
            const h = 100 / rows;
            const left = col * w;
            const top = row * h;

            shard.style.width = `${w}%`;
            shard.style.height = `${h}%`;
            shard.style.left = `${left}%`;
            shard.style.top = `${top}%`;

            shard.style.backgroundImage = `url("${imageUrl}")`;

            const bgX = cols > 1 ? (col / (cols - 1)) * 100 : 0;
            const bgY = rows > 1 ? (row / (rows - 1)) * 100 : 0;

            shard.style.backgroundPosition = `${bgX}% ${bgY}%`;
            shard.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;

            // Initial Chaos - slight tilt
            const initR = (Math.random() - 0.5) * 10;
            const initScale = 1.05;
            shard.style.transform = `rotate(${initR}deg) scale(${initScale})`;

            shatterOverlay.appendChild(shard);

            // Explosive physics - Instant fly off
            const tx = (Math.random() - 0.5) * 2500;
            const ty = (Math.random() - 0.5) * 2500;
            const r = (Math.random() - 0.5) * 1440;
            const s = 0.1 + Math.random() * 2;

            // Synchronized trigger: use very small timeout to ensure DOM renders init state
            setTimeout(() => {
                shard.style.transform = `translate(${tx}px, ${ty}px) rotate(${r}deg) scale(${s})`;
                shard.style.opacity = '0';
            }, 20);
        }

        // Auto-cleanup shards
        setTimeout(() => {
            shatterOverlay.innerHTML = '';
        }, 1600);
    };

    const triggerHeroShatter = () => {
        if (heroSlides.length === 0) return;

        const currentActive = heroSlides[activeHeroSlide];
        const currentImgBg = getComputedStyle(currentActive).backgroundImage;
        const match = currentImgBg.match(/url\((['"]?)(.*?)\1\)/);
        const currentImgUrl = match ? match[2] : "";

        // Trigger explosion BEFORE switching slide for better perceived sync
        if (currentImgUrl) {
            createShatterEffect(currentImgUrl);
        }

        currentActive.classList.remove('active');
        activeHeroSlide = (activeHeroSlide + 1) % heroSlides.length;
        heroSlides[activeHeroSlide].classList.add('active');
    };

    if (heroSlides.length > 0) {
        setInterval(triggerHeroShatter, 7000);
    }

    /* --- 3D Tilt Effect for Stat Cards --- */
    const statCards = document.querySelectorAll('.stat-card');

    statCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
        });
    });

    console.log('Shattered Hero Transition & 3D Stats (v3) Loaded');
});
