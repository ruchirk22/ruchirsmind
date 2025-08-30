// Enhanced Portfolio JavaScript with Performance Optimizations
document.addEventListener('DOMContentLoaded', () => {
    
    // --- PERFORMANCE & UTILITY FUNCTIONS ---
    
    const throttle = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };
    
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };
    
    // Intersection Observer for animations
    const createObserver = (callback, options = {}) => {
        return new IntersectionObserver(callback, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
            ...options
        });
    };
    
    // --- LOADING SCREEN ---
    
    const loadingScreen = document.querySelector('.loading-screen');
    const progressBar = document.querySelector('.loading-progress');
    
    // Simulate loading progress
    const simulateLoading = () => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(hideLoadingScreen, 500);
            }
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
        }, 100);
    };
    
    const hideLoadingScreen = () => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            document.body.style.overflow = 'visible';
            // Start other animations after loading is complete
            initScrollAnimations();
            initTypingAnimation();
        }
    };
    
    // Check if page was already visited in this session
    if (sessionStorage.getItem('portfolioVisited')) {
        hideLoadingScreen();
    } else {
        sessionStorage.setItem('portfolioVisited', 'true');
        simulateLoading();
    }
    
    // --- SCROLL PROGRESS INDICATOR ---
    
    const scrollProgress = document.querySelector('.scroll-progress-bar');
    
    const updateScrollProgress = throttle(() => {
        if (!scrollProgress) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        
        scrollProgress.style.width = `${Math.min(progress, 100)}%`;
    }, 16); // ~60fps
    
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    
    // --- NAVIGATION ---
    
    const header = document.querySelector('.main-header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    // Header scroll behavior
    let lastScrollY = 0;
    const handleHeaderScroll = throttle(() => {
        const currentScrollY = window.pageYOffset;
        
        if (header) {
            if (currentScrollY > 100) {
                header.style.background = 'rgba(15, 23, 42, 0.95)';
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.background = 'rgba(15, 23, 42, 0.8)';
                header.style.backdropFilter = 'blur(12px)';
            }
        }
        
        lastScrollY = currentScrollY;
    }, 16);
    
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    
    // Mobile menu toggle
    let mobileMenuOpen = false;
    
    const toggleMobileMenu = () => {
        mobileMenuOpen = !mobileMenuOpen;
        
        if (mobileMenuBtn) {
            mobileMenuBtn.setAttribute('aria-expanded', mobileMenuOpen.toString());
        }
        
        if (mobileNav) {
            mobileNav.classList.toggle('active', mobileMenuOpen);
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'visible';
    };
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuOpen) {
                toggleMobileMenu();
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenuOpen && !header?.contains(e.target)) {
            toggleMobileMenu();
        }
    });
    
    // --- SMOOTH SCROLLING ---
    
    const smoothScrollTo = (targetId, offset = 80) => {
        const target = document.getElementById(targetId.replace('#', ''));
        if (target) {
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    };
    
    // Handle smooth scrolling for anchor links
    document.addEventListener('click', (e) => {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            if (targetId !== '#') {
                smoothScrollTo(targetId);
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    });
    
    // --- TYPING ANIMATION ---
    
    let typingAnimation;
    
    const initTypingAnimation = () => {
        const typingText = document.querySelector('.typing-text');
        if (!typingText) return;
        
        const texts = [
            'AI Solutions Architect',
            'Machine Learning Engineer',
            'Cybersecurity Specialist',
            'Technical Consultant'
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const typeText = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500; // Pause before next text
            }
            
            typingAnimation = setTimeout(typeText, typeSpeed);
        };
        
        // Start typing animation after a delay
        setTimeout(typeText, 1000);
    };
    
    // --- SCROLL ANIMATIONS ---
    
    const initScrollAnimations = () => {
        const animateOnScroll = createObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });
        
        // Apply initial styles and observe elements
        const animatedElements = document.querySelectorAll(
            '.service-card, .project-card, .testimonial-card, .hero-badge, .hero-title, .hero-description, .hero-cta, .hero-stats'
        );
        
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.8s ease-out ${index * 0.1}s, transform 0.8s ease-out ${index * 0.1}s`;
            animateOnScroll.observe(el);
        });
    };
    
    // --- PROJECT FILTERING ---
    
    const initProjectFiltering = () => {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        const filterProjects = (category) => {
            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                const shouldShow = category === 'all' || cardCategory === category;
                
                if (shouldShow) {
                    card.classList.remove('filtered-out');
                    card.style.display = 'block';
                } else {
                    card.classList.add('filtered-out');
                    setTimeout(() => {
                        if (card.classList.contains('filtered-out')) {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
        };
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter projects
                const category = btn.getAttribute('data-filter');
                filterProjects(category);
            });
        });
    };
    
    initProjectFiltering();
    
    // --- CONTACT FORM ---
    
    const initContactForm = () => {
        const contactForm = document.querySelector('.contact-form');
        
        if (!contactForm) return;
        
        const handleFormSubmit = async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('.form-submit');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            try {
                // Simulate form submission (replace with actual endpoint)
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Success state
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.background = 'var(--success)';
                contactForm.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('loading');
                }, 3000);
                
            } catch (error) {
                // Error state
                submitBtn.textContent = 'Error - Try Again';
                submitBtn.style.background = 'var(--error)';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('loading');
                }, 3000);
            }
        };
        
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Add input validation feedback
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.checkValidity()) {
                    input.style.borderColor = 'var(--success)';
                } else {
                    input.style.borderColor = 'var(--error)';
                }
            });
            
            input.addEventListener('focus', () => {
                input.style.borderColor = 'var(--primary)';
            });
        });
    };
    
    initContactForm();
    
    // --- PARTICLE CANVAS ---
    
    const initParticleCanvas = () => {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;
        
        // Reduce particles on mobile for better performance
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 30 : 50;
        
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(45, 212, 191, ${this.opacity})`;
                ctx.fill();
            }
        }
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };
        
        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            animationId = requestAnimationFrame(animate);
        };
        
        // Initialize
        resizeCanvas();
        animate();
        
        // Handle resize
        const debouncedResize = debounce(resizeCanvas, 250);
        window.addEventListener('resize', debouncedResize);
        
        // Pause animation when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animate();
            }
        });
    };
    
    // Only init particles on desktop for better mobile performance
    if (window.innerWidth >= 768) {
        initParticleCanvas();
    }
    
    // --- PERFORMANCE MONITORING ---
    
    const logPerformance = () => {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('Page Load Performance:', {
                        'DOM Content Loaded': perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        'Load Complete': perfData.loadEventEnd - perfData.loadEventStart,
                        'Total Time': perfData.loadEventEnd - perfData.fetchStart
                    });
                }, 1000);
            });
        }
    };
    
    // Enable performance logging in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        logPerformance();
    }
    
    // --- ACCESSIBILITY ENHANCEMENTS ---
    
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById('main-content');
            if (target) {
                target.focus();
                target.scrollIntoView();
            }
        });
    }
    
    // Keyboard navigation for interactive elements
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenuOpen) {
            toggleMobileMenu();
        }
    });
    
    // Announce dynamic content changes to screen readers
    const announceToScreenReader = (message) => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => document.body.removeChild(announcement), 1000);
    };
    
    // --- LAZY LOADING FOR IMAGES ---
    
    const initLazyLoading = () => {
        if ('IntersectionObserver' in window) {
            const imageObserver = createObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    };
    
    initLazyLoading();
    
    // --- CLEANUP ---
    
    // Clean up resources when page is unloaded
    window.addEventListener('beforeunload', () => {
        if (typingAnimation) {
            clearTimeout(typingAnimation);
        }
    });
    
    // Initialize everything after DOM is ready
    console.log('Portfolio initialized successfully');
});