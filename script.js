document.addEventListener('DOMContentLoaded', () => {

    // --- DYNAMIC YEAR ---
    const yearSpans = document.querySelectorAll('#year, #year-featured, #year-footer');
    yearSpans.forEach(span => {
        if (span) span.textContent = new Date().getFullYear();
    });

    // --- SESSION-BASED LOADING SCREEN ---
    const loadingScreen = document.querySelector('.loading-screen');
    const mainContainer = document.querySelector('.main-container');

    const showMainContent = () => {
        if (mainContainer) {
            mainContainer.style.opacity = '1';
        }
    };

    if (sessionStorage.getItem('visited')) {
        if(loadingScreen) loadingScreen.style.display = 'none';
        showMainContent();
    } else {
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                loadingScreen.addEventListener('transitionend', () => {
                    loadingScreen.style.display = 'none';
                }, { once: true });
            }
            showMainContent();
            sessionStorage.setItem('visited', 'true');
        }, 3500);
    }

    // --- ACCURATE CURSOR ---
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        window.addEventListener('mousemove', e => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        document.body.addEventListener('mouseleave', () => cursor.classList.add('hidden'));
        document.body.addEventListener('mouseenter', () => cursor.classList.remove('hidden'));
        document.querySelectorAll('a, button, .floating-menu-button, .card, .cta-button, .home-button, .spotify-widget').forEach(el => {
            el.addEventListener('mouseover', () => cursor.classList.add('hover'));
            el.addEventListener('mouseout', () => cursor.classList.remove('hover'));
        });
    }

    // --- GENERAL SCROLL-TRIGGERED ANIMATIONS ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // --- FASTER WORD-BY-WORD SCROLL REVEAL ---
    const wordRevealText = document.querySelector('.word-reveal-text');
    if (wordRevealText) {
        const words = wordRevealText.textContent.trim().split(' ');
        wordRevealText.innerHTML = words.map(word => `<span>${word}</span>`).join(' ');
        const wordSpans = wordRevealText.querySelectorAll('span');
        
        const handleWordRevealScroll = () => {
            const { top, height } = wordRevealText.getBoundingClientRect();
            // Animation completes when the middle of the element reaches the middle of the viewport
            const scrollPercent = Math.max(0, Math.min(1, (window.innerHeight / 2 - top) / (height / 2)));
            const wordsToShow = Math.ceil(wordSpans.length * scrollPercent);
            wordSpans.forEach((span, index) => {
                if (index < wordsToShow) {
                    span.classList.add('highlighted');
                }
            });
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    window.addEventListener('scroll', handleWordRevealScroll);
                    handleWordRevealScroll(); // Initial check
                } else {
                    window.removeEventListener('scroll', handleWordRevealScroll);
                }
            });
        }, { threshold: 0 });
        revealObserver.observe(wordRevealText);
    }

    // --- STAGGERED FADE-IN ANIMATION ---
    const staggeredContainer = document.querySelector('.staggered-fade-in');
    if (staggeredContainer) {
        const staggeredObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.parentElement.classList.add('is-visible');
                    const spans = entry.target.querySelectorAll('span');
                    spans.forEach((span, index) => {
                        span.style.transitionDelay = `${index * 0.05}s`;
                    });
                    staggeredObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        staggeredObserver.observe(staggeredContainer);
    }


    // --- SMOOTHER FLOATING MENU ---
    const menuButton = document.querySelector('.floating-menu-button');
    const menuOverlay = document.querySelector('.menu-overlay');
    if (menuButton && menuOverlay) {
        menuButton.addEventListener('click', () => {
            menuOverlay.classList.toggle('open');
        });
    }

    // --- SUBTLE PARTICLE CANVAS ---
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() * 0.5 - 0.25);
                this.speedY = (Math.random() * 0.5 - 0.25);
                this.color = `rgba(138, 176, 171, ${Math.random() * 0.5 + 0.1})`;
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
                this.x += this.speedX;
                this.y += this.speedY;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        
        resizeCanvas();
        animateParticles();
    }
});
