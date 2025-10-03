// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    initHeroSlider();
    initSmoothScroll();
    initScrollAnimations();
});

// Fungsi untuk Hero Slider
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let isAnimating = false;

    // Fungsi untuk menampilkan slide
    function showSlide(index) {
        if (isAnimating) return;
        isAnimating = true;

        // Pastikan index dalam range
        if (index >= totalSlides) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = totalSlides - 1;
        } else {
            currentSlide = index;
        }

        // Update slides
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev', 'next');
            
            if (i === currentSlide) {
                slide.classList.add('active');
            } else if (i < currentSlide) {
                slide.classList.add('prev');
            } else {
                slide.classList.add('next');
            }
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });

        // Reset animating flag
        setTimeout(() => {
            isAnimating = false;
        }, 600);
    }

    // Event listener untuk tombol previous
    prevBtn.addEventListener('click', function() {
        showSlide(currentSlide - 1);
    });

    // Event listener untuk tombol next
    nextBtn.addEventListener('click', function() {
        showSlide(currentSlide + 1);
    });

    // Event listener untuk dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    });

    // Touch/Swipe support untuk mobile
    let touchStartX = 0;
    let touchEndX = 0;
    const sliderTrack = document.querySelector('.slider-track');

    sliderTrack.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderTrack.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextBtn.click();
            } else {
                // Swipe right - previous slide
                prevBtn.click();
            }
        }
    }

    // Auto-play (optional - uncomment untuk mengaktifkan)
    let autoplayInterval = setInterval(() => {
        nextBtn.click();
    }, 4500);

    // Pause autoplay saat hover
    const heroSlider = document.querySelector('.hero-slider');
    heroSlider.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });

    heroSlider.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(() => {
            nextBtn.click();
        }, 4500);
    });
}

// Smooth scroll untuk navigasi
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const targetPosition = targetSection.offsetTop;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state di navigation
                document.querySelectorAll('nav a').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
}

// Animasi fade in saat scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(item);
    });

    // Observe about sections
    const aboutSections = document.querySelectorAll('.about-text, .about-sidebar');
    aboutSections.forEach(section => {
        observer.observe(section);
    });
}

// Update active navigation saat scroll
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // Change header background on scroll
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'transparent';
        header.style.boxShadow = 'none';
    }
});

// Parallax effect pada background decoration
window.addEventListener('scroll', function() {
    const bgDecoration = document.querySelector('.bg-decoration');
    if (bgDecoration) {
        const scrollPosition = window.scrollY;
        bgDecoration.style.transform = `translateY(${scrollPosition * 0.3}px)`;
    }
});

// Preload images untuk smooth transition
function preloadImages() {
    const images = document.querySelectorAll('.hero-image');
    images.forEach(img => {
        const imgSrc = img.getAttribute('src');
        if (imgSrc) {
            const preloadImg = new Image();
            preloadImg.src = imgSrc;
        }
    });
}

// Jalankan preload saat halaman dimuat
preloadImages();

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});