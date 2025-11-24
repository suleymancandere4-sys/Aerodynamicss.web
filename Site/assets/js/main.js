/* ========================================
   Ana JavaScript Dosyası - main.js
   Aerodinamik Web Sitesi
   ======================================== */

// DOM yüklendiğinde çalışacak fonksiyon
document.addEventListener('DOMContentLoaded', function() {
    // Mobil menü toggle
    initMobileMenu();
    
    // Smooth scroll
    initSmoothScroll();
    
    // Scroll animasyonları
    initScrollAnimations();
    
    // Navbar scroll efekti
    initNavbarScroll();
    
    // Form gönderimi
    initContactForm();
    
    console.log('🛩️ Aerodinamik web sitesi yüklendi!');
});

/* ========================================
   MOBİL MENÜ YÖNETİMİ
   ======================================== */
function initMobileMenu() {
    const navbarToggle = document.getElementById('navbar-toggle');
    const navbarMenu = document.getElementById('navbar-menu');
    
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function() {
            navbarToggle.classList.toggle('active');
            navbarMenu.classList.toggle('active');
        });
        
        // Menü linklerine tıklandığında menüyü kapat
        const navLinks = navbarMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navbarToggle.classList.remove('active');
                navbarMenu.classList.remove('active');
            });
        });
    }
}

/* ========================================
   SMOOTH SCROLL NAVİGASYON
   ======================================== */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Programatik scroll fonksiyonu (CTA buton için)
function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/* ========================================
   SCROLL ANIMASYONLARI
   ======================================== */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Eğer bu bir feature card ise, staggered animasyon ekle
                if (entry.target.classList.contains('features-grid')) {
                    const cards = entry.target.querySelectorAll('.feature-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('fade-in', 'visible');
                        }, index * 100);
                    });
                }
                
                // Eğer bu bir gallery ise, staggered animasyon ekle
                if (entry.target.classList.contains('gallery-grid')) {
                    const items = entry.target.querySelectorAll('.gallery-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('fade-in', 'visible');
                        }, index * 50);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Animasyon için elementleri gözlemle
    const elementsToAnimate = document.querySelectorAll('.section-title, .hero-content, .hero-media, .text-content, .features-grid, .gallery-grid, .media-item');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

/* ========================================
   NAVBAR SCROLL EFEKTİ
   ======================================== */
function initNavbarScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Scroll yönüne göre header'ı gizle/göster
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        // Scroll pozisyonuna göre header background'unu değiştir
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
}

/* ========================================
   İLETİŞİM FORMU YÖNETİMİ
   ======================================== */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Basit doğrulama
            if (!name || !email || !message) {
                showNotification('Lütfen tüm alanları doldurunuz.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Lütfen geçerli bir e-posta adresi giriniz.', 'error');
                return;
            }
            
            // Form gönderimi simülasyonu
            const submitBtn = contactForm.querySelector('.submit-button');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification(`Merhaba ${name}! Mesajınız başarıyla gönderildi. Size en kısa sürede dönüş yapacağız.`, 'success');
                contactForm.reset();
                
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

/* ========================================
   YARDIMCI FONKSİYONLAR
   ======================================== */

// E-posta doğrulama
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
                    transform: translateY(-100px);
                }
                
                .notification.show {
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(notificationStyles);
    }
    
    document.body.appendChild(notification);
    
    // Bildirimi göster
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Kapatma butonu
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    // Otomatik kapatma (5 saniye)
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Bildirim ikonu seçme
function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

/* ========================================
   HAVA AKIŞI ANİMASYON EFEKTLERİ
   ======================================== */

// Mouse takip eden hava akışı efekti
function createWindEffect(e) {
    const windParticle = document.createElement('div');
    windParticle.className = 'wind-particle';
    windParticle.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        width: 4px;
        height: 4px;
        background: linear-gradient(90deg, transparent, #06b6d4, transparent);
        border-radius: 2px;
        pointer-events: none;
        z-index: 9998;
        animation: windFlow 1.5s linear forwards;
    `;
    
    // Wind particle CSS animasyonu
    if (!document.querySelector('.wind-effect-styles')) {
        const windStyles = document.createElement('style');
        windStyles.className = 'wind-effect-styles';
        windStyles.textContent = `
            @keyframes windFlow {
                0% {
                    transform: translate(0, 0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(100px, -20px) scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(windStyles);
    }
    
    document.body.appendChild(windParticle);
    
    // Particle'ı temizle
    setTimeout(() => {
        windParticle.remove();
    }, 1500);
}

// Mouse hareket ettiğinde wind effect (throttled)
let windEffectThrottle = false;
document.addEventListener('mousemove', function(e) {
    if (!windEffectThrottle) {
        createWindEffect(e);
        windEffectThrottle = true;
        setTimeout(() => {
            windEffectThrottle = false;
        }, 100);
    }
});

/* ========================================
   PERFORMANS OPTİMİZASYONU
   ======================================== */

// Debounce fonksiyonu
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle fonksiyonu
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Lazy loading için intersection observer
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Sayfa yüklendiğinde lazy loading'i başlat
window.addEventListener('load', initLazyLoading);

/* ========================================
   BİLDİRİM SİSTEMİ
   ======================================== */
function showNotification(message, type = 'info', duration = 3000) {
    // Bildirim konteynerini bul veya oluştur
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(notificationContainer);
    }
    
    // Bildirim elementini oluştur
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Bildirim stillerini ekle
    notification.style.cssText = `
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        pointer-events: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 250px;
        max-width: 400px;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-left: 10px;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Bildirimi konteyenera ekle
    notificationContainer.appendChild(notification);
    
    // Animasyon ile göster
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Belirtilen süre sonra kaldır
    if (duration > 0) {
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, duration);
    }
    
    return notification;
}