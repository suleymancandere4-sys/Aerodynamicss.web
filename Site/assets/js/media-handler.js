/* ========================================
   Medya Yönetici - media-handler.js
   Video ve Ses İçerikleri
   ======================================== */

// Video ve ses içerikleri veritabanı
const mediaContent = {
    videos: [
        {
            id: 'v1',
            title: 'Uçak Kanatları Üzerindeki Hava Akışı',
            description: 'CFD simülasyonu ile uçak kanatları etrafındaki hava akışının görselleştirilmesi',
            type: 'video',
            category: 'aircraft',
            poster: './assets/images/aircraft/wing-flow-poster.jpg',
            sources: [
                { src: './assets/videos/aircraft/wing-aerodynamics.mp4', type: 'video/mp4' },
                { src: './assets/videos/aircraft/wing-aerodynamics.webm', type: 'video/webm' }
            ]
        },
        {
            id: 'v2',
            title: 'Formula 1 Aerodinamik Analizi',
            description: 'F1 aracının downforce üretimi ve DRS sisteminin çalışma prensibi',
            type: 'video',
            category: 'cars',
            poster: './assets/images/cars/f1-aero-poster.jpg',
            sources: [
                { src: './assets/videos/cars/f1-aerodynamics.mp4', type: 'video/mp4' },
                { src: './assets/videos/cars/f1-aerodynamics.webm', type: 'video/webm' }
            ]
        }
    ],
    audios: [
        {
            id: 'a1',
            title: 'Rüzgar Tüneli Sesleri',
            description: 'Gerçek rüzgar tüneli test ortamından kaydedilmiş sesler',
            type: 'audio',
            category: 'wind-tunnel',
            sources: [
                { src: './assets/audio/wind-tunnel-sound.mp3', type: 'audio/mpeg' },
                { src: './assets/audio/wind-tunnel-sound.ogg', type: 'audio/ogg' }
            ]
        },
        {
            id: 'a2',
            title: 'Jet Motor Sesi',
            description: 'Çeşitli jet motorlarının ses spektrumu ve analizi',
            type: 'audio',
            category: 'aircraft',
            sources: [
                { src: './assets/audio/jet-engine.mp3', type: 'audio/mpeg' },
                { src: './assets/audio/jet-engine.ogg', type: 'audio/ogg' }
            ]
        }
    ]
};

// DOM yüklendiğinde medya oynatıcıları başlat
document.addEventListener('DOMContentLoaded', function() {
    initMediaPlayers();
    initFileUpload();
    initFeedbackForm();
});

/* ========================================
   MEDYA OYNATICILARI
   ======================================== */
function initMediaPlayers() {
    // Video oynatıcıları için özel kontroller
    const videoPlayers = document.querySelectorAll('video[controls]');
    videoPlayers.forEach(video => {
        video.addEventListener('loadstart', function() {
            console.log('Video yükleniyor:', this.src);
        });
        
        video.addEventListener('error', function() {
            this.parentNode.innerHTML = `
                <div class="media-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Video yüklenemiyor</p>
                    <small>Lütfen daha sonra tekrar deneyin</small>
                </div>
            `;
        });
        
        // Video bittiğinde öneriler göster
        video.addEventListener('ended', function() {
            showVideoSuggestions(this);
        });
    });
    
    // Ses oynatıcıları için özel kontroller
    const audioPlayers = document.querySelectorAll('audio[controls]');
    audioPlayers.forEach(audio => {
        audio.addEventListener('error', function() {
            this.parentNode.innerHTML = `
                <div class="media-error">
                    <i class="fas fa-volume-mute"></i>
                    <p>Ses dosyası yüklenemiyor</p>
                    <small>Farklı bir tarayıcı deneyin</small>
                </div>
            `;
        });
    });
}

/* ========================================
   DOSYA YÜKLEME
   ======================================== */
function initFileUpload() {
    const fileInput = document.getElementById('media-upload');
    const uploadLabel = document.querySelector('.upload-label');
    const uploadPreview = document.getElementById('upload-preview');
    
    if (!fileInput || !uploadLabel || !uploadPreview) return;
    
    // Drag & Drop olayları
    uploadLabel.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });
    
    uploadLabel.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
    });
    
    uploadLabel.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        handleFileUpload(files, uploadPreview);
    });
    
    // Dosya seçimi
    fileInput.addEventListener('change', function(e) {
        const files = e.target.files;
        handleFileUpload(files, uploadPreview);
    });
}

function handleFileUpload(files, previewContainer) {
    previewContainer.innerHTML = '';
    
    Array.from(files).forEach(file => {
        if (isValidMediaFile(file)) {
            createFilePreview(file, previewContainer);
        } else {
            showNotification(`${file.name} desteklenmeyen dosya formatı!`, 'error');
        }
    });
}

function isValidMediaFile(file) {
    const validTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/webm', 'video/ogg',
        'audio/mp3', 'audio/wav', 'audio/ogg'
    ];
    
    return validTypes.includes(file.type);
}

function createFilePreview(file, container) {
    const previewItem = document.createElement('div');
    previewItem.className = 'upload-preview-item';
    
    const fileType = file.type.split('/')[0];
    let previewContent = '';
    
    switch (fileType) {
        case 'image':
            previewContent = `
                <img src="${URL.createObjectURL(file)}" alt="${file.name}">
                <div class="file-info">
                    <h4>${file.name}</h4>
                    <p>Boyut: ${formatFileSize(file.size)}</p>
                </div>
            `;
            break;
            
        case 'video':
            previewContent = `
                <video src="${URL.createObjectURL(file)}" controls></video>
                <div class="file-info">
                    <h4>${file.name}</h4>
                    <p>Boyut: ${formatFileSize(file.size)}</p>
                </div>
            `;
            break;
            
        case 'audio':
            previewContent = `
                <div class="audio-preview">
                    <i class="fas fa-music"></i>
                    <audio src="${URL.createObjectURL(file)}" controls></audio>
                </div>
                <div class="file-info">
                    <h4>${file.name}</h4>
                    <p>Boyut: ${formatFileSize(file.size)}</p>
                </div>
            `;
            break;
    }
    
    previewItem.innerHTML = `
        ${previewContent}
        <div class="file-actions">
            <button onclick="analyzeFile('${file.name}')" class="analyze-btn">
                <i class="fas fa-search"></i> Analiz Et
            </button>
            <button onclick="removePreview(this)" class="remove-btn">
                <i class="fas fa-trash"></i> Kaldır
            </button>
        </div>
    `;
    
    container.appendChild(previewItem);
    
    // Fade-in animasyonu
    setTimeout(() => {
        previewItem.style.opacity = '0';
        previewItem.style.transform = 'translateY(20px)';
        previewItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        setTimeout(() => {
            previewItem.style.opacity = '1';
            previewItem.style.transform = 'translateY(0)';
        }, 50);
    }, 100);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function removePreview(button) {
    const previewItem = button.closest('.upload-preview-item');
    previewItem.style.transform = 'scale(0)';
    previewItem.style.opacity = '0';
    
    setTimeout(() => {
        previewItem.remove();
    }, 300);
}

function analyzeFile(filename) {
    showNotification(`${filename} analiz ediliyor... 🔬`, 'info');
    
    // Simulated analysis
    setTimeout(() => {
        const analysisResults = {
            'Format': 'MP4 / H.264',
            'Çözünürlük': '1920x1080',
            'Frame Rate': '30 fps',
            'Bitrate': '5.2 Mbps',
            'Codec': 'H.264 (AVC)',
            'Aerodinamik İçerik': 'Tespit edildi ✓'
        };
        
        showAnalysisModal(filename, analysisResults);
    }, 2000);
}

function showAnalysisModal(filename, results) {
    const modalHTML = `
        <div id="analysisModal" class="analysis-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>📊 Dosya Analizi: ${filename}</h3>
                    <button onclick="closeAnalysisModal()" class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="analysis-results">
                        ${Object.entries(results).map(([key, value]) => `
                            <div class="result-item">
                                <span class="key">${key}:</span>
                                <span class="value">${value}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="analysis-suggestions">
                        <h4>💡 Öneriler</h4>
                        <ul>
                            <li>Bu dosya aerodinamik analiz için uygun görünüyor</li>
                            <li>CFD simülasyon verisi tespit edildi</li>
                            <li>Yüksek çözünürlük kalitesi mevcut</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Modal stillerini ekle
    if (!document.querySelector('.analysis-modal-styles')) {
        const modalStyles = document.createElement('style');
        modalStyles.className = 'analysis-modal-styles';
        modalStyles.textContent = `
            .analysis-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: modalFadeIn 0.3s ease;
            }
            
            .analysis-modal .modal-content {
                background: white;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #eee;
                background: var(--gradient-primary);
                color: white;
                border-radius: 15px 15px 0 0;
            }
            
            .modal-header h3 {
                margin: 0;
                color: white;
            }
            
            .modal-header .modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
            }
            
            .modal-body {
                padding: 20px;
            }
            
            .analysis-results {
                margin-bottom: 20px;
            }
            
            .result-item {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .result-item .key {
                font-weight: 600;
                color: var(--primary-color);
            }
            
            .result-item .value {
                color: var(--text-secondary);
            }
            
            .analysis-suggestions h4 {
                color: var(--primary-color);
                margin-bottom: 10px;
            }
            
            .analysis-suggestions ul {
                list-style: none;
                padding: 0;
            }
            
            .analysis-suggestions li {
                padding: 5px 0;
                position: relative;
                padding-left: 20px;
            }
            
            .analysis-suggestions li::before {
                content: '✓';
                position: absolute;
                left: 0;
                color: var(--success-color);
                font-weight: bold;
            }
        `;
        document.head.appendChild(modalStyles);
    }
}

function closeAnalysisModal() {
    const modal = document.getElementById('analysisModal');
    if (modal) {
        modal.remove();
    }
}

/* ========================================
   VİDEO ÖNERİLERİ
   ======================================== */
function showVideoSuggestions(videoElement) {
    const suggestions = [
        'CFD Analizi Temelleri',
        'Rüzgar Tüneli Testleri',
        'Süpersonik Aerodinamik',
        'Formula 1 Teknolojileri'
    ];
    
    const suggestionsHTML = `
        <div class="video-suggestions">
            <h4>🎥 İlginizi Çekebilir</h4>
            <div class="suggestions-list">
                ${suggestions.map(title => `
                    <div class="suggestion-item">
                        <i class="fas fa-play-circle"></i>
                        <span>${title}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Video'nun parent container'ına önerileri ekle
    const container = videoElement.closest('.media-item');
    if (container && !container.querySelector('.video-suggestions')) {
        container.insertAdjacentHTML('beforeend', suggestionsHTML);
        
        setTimeout(() => {
            const suggestionsElement = container.querySelector('.video-suggestions');
            if (suggestionsElement) {
                suggestionsElement.remove();
            }
        }, 10000); // 10 saniye sonra kaldır
    }
}

/* ========================================
   GERİ BİLDİRİM FORMU
   ======================================== */
function initFeedbackForm() {
    const feedbackForm = document.getElementById('feedback-form');
    if (!feedbackForm) return;
    
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Sayfa yönlendirmesini engelle
        
        // Form verilerini al
        const formData = new FormData(feedbackForm);
        const name = formData.get('name');
        const feedback = formData.get('feedback');
        const rating = formData.get('rating');
        
        // Validasyon
        if (!name || !feedback || !rating) {
            showNotification('⚠️ Lütfen tüm alanları doldurun!', 'error');
            return;
        }
        
        // Gönderim işlemini simüle et
        submitFeedback(name, feedback, rating);
    });
}

function submitFeedback(name, feedback, rating) {
    // Loading durumu göster
    const submitBtn = document.querySelector('.submit-button');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
    submitBtn.disabled = true;
    
    // E-posta verilerini hazırla
    const feedbackData = {
        name: name,
        feedback: feedback,
        rating: rating,
        timestamp: new Date().toLocaleString('tr-TR'),
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    
    // Yerel kayıt
    saveFeedbackLocally(feedbackData);
    
    // E-posta gönderim deneme
    setTimeout(() => {
        sendEmailNotification(feedbackData).then(() => {
            // Başarılı gönderim
            showSuccessMessage(name, rating, true);
        }).catch(() => {
            // Hata durumunda mailto fallback
            showMailtoFallback(feedbackData);
            showSuccessMessage(name, rating, false);
        }).finally(() => {
            // Formu sıfırla ve button'u eski haline getir
            document.getElementById('feedback-form').reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    }, 1500);
}

function showMailtoFallback(data) {
    // E-posta gönderiminde sorun varsa mailto ile aç
    const subject = 'Aerodinamik Website - Geri Bildirim';
    const body = `
Merhaba,

Aerodinamik web siteniz için geri bildirimimi paylaşmak istiyorum:

👤 İsim: ${data.name}
⭐ Değerlendirme: ${data.rating}/5 yıldız
📅 Tarih: ${data.timestamp}

💬 Geri Bildirim:
${data.feedback}

🔧 Teknik Bilgiler:
• Sayfa: ${data.url}
• Tarayıcı: ${data.userAgent.substring(0, 100)}

Teşekkürler!
    `.trim();
    
    const mailtoLink = `mailto:suleymancandere4@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // 2 saniye sonra mailto linkini aç
    setTimeout(() => {
        window.open(mailtoLink, '_blank');
    }, 2000);
}

function saveFeedbackLocally(data) {
    // localStorage'a kaydet
    let feedbacks = JSON.parse(localStorage.getItem('aerodynamic-feedbacks') || '[]');
    feedbacks.push(data);
    localStorage.setItem('aerodynamic-feedbacks', JSON.stringify(feedbacks));
}

function sendEmailNotification(data) {
    // Çoklu e-posta servisi denemesi
    console.log('📧 E-posta gönderiliyor:', {
        to: 'suleymancandere4@gmail.com',
        subject: 'Aerodinamik Website - Yeni Geri Bildirim',
        data: data
    });
    
    // 1. EmailJS Servisi (Öncelikli)
    if (typeof emailjs !== 'undefined') {
        emailjs.send('service_id', 'template_id', {
            to_email: 'suleymancandere4@gmail.com',
            from_name: data.name,
            message: data.feedback,
            rating: data.rating,
            timestamp: data.timestamp
        }).then(function(response) {
            console.log('EmailJS başarılı:', response);
        }).catch(function(error) {
            console.log('EmailJS hatası:', error);
            tryAlternativeServices(data);
        });
    } else {
        tryAlternativeServices(data);
    }
}

function tryAlternativeServices(data) {
    // 2. Formspree Servisi
    fetch('https://formspree.io/f/your_form_id', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: 'suleymancandere4@gmail.com',
            message: `
Yeni Geri Bildirim - Aerodinamik Website

👤 İsim: ${data.name}
⭐ Değerlendirme: ${data.rating}/5
📅 Tarih: ${data.timestamp}

💬 Geri Bildirim:
${data.feedback}

🔧 Teknik Detaylar:
• Sayfa URL: ${data.url}
• Tarayıcı: ${navigator.userAgent.substring(0, 80)}
• IP Adresi: Kullanıcı tarafından gizli
            `
        })
    }).then(response => {
        if (response.ok) {
            console.log('Formspree başarılı');
        } else {
            throw new Error('Formspree hatası');
        }
    }).catch(error => {
        console.log('Formspree hatası:', error);
        // 3. Netlify Forms alternatifi
        tryNetlifyForms(data);
    });
}

function tryNetlifyForms(data) {
    // 3. Netlify Forms (eğer Netlify'da host ediliyorsa)
    fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            'form-name': 'feedback',
            'name': data.name,
            'feedback': data.feedback,
            'rating': data.rating,
            'timestamp': data.timestamp,
            'url': data.url
        })
    }).then(response => {
        if (response.ok) {
            console.log('Netlify Forms başarılı');
        } else {
            throw new Error('Netlify Forms hatası');
        }
    }).catch(error => {
        console.log('Netlify Forms hatası:', error);
        // 4. Son çare: Basit HTTP isteği
        trySimpleEmail(data);
    });
}

function trySimpleEmail(data) {
    // 4. Web3Forms (Ücretsiz alternatif)
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            access_key: 'YOUR_ACCESS_KEY', // Web3Forms'dan alınacak
            name: data.name,
            email: 'noreply@aerodynamic-website.com',
            message: `
🎯 Aerodinamik Website Geri Bildirimi

👤 Gönderen: ${data.name}
⭐ Puan: ${data.rating}/5
📅 Zaman: ${data.timestamp}

💭 Mesaj:
${data.feedback}

📊 Sistem Bilgileri:
• Sayfa: ${data.url}
• Platform: ${navigator.platform}
• Dil: ${navigator.language}
            `,
            to: 'suleymancandere4@gmail.com'
        })
    }).then(response => response.json())
    .then(result => {
        console.log('Web3Forms sonucu:', result);
    }).catch(error => {
        console.error('Tüm e-posta servisleri başarısız:', error);
        // Yine de kullanıcıya başarı mesajı göster (UX için)
    });
}

function showSuccessMessage(name, rating, emailSent = true) {
    // Başarı bildirimi oluştur
    const emailStatus = emailSent ? 
        '📧 Geri bildiriminiz e-posta olarak gönderildi!' : 
        '📧 E-posta istemciniz açılıyor... Lütfen gönderi düğmesine tıklayın.';
    
    const successHTML = `
        <div id="successMessage" class="success-message">
            <div class="success-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>🎉 Teşekkürler ${name}!</h3>
                <p>Geri bildiriminiz başarıyla hazırlandı.</p>
                <p class="rating-display">Puanınız: ${'⭐'.repeat(parseInt(rating))}</p>
                <p class="email-info ${emailSent ? 'success' : 'fallback'}">${emailStatus}</p>
                <button onclick="closeSuccessMessage()" class="close-success-btn">
                    <i class="fas fa-times"></i> Kapat
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', successHTML);
    
    // Başarı mesajı stillerini ekle
    if (!document.querySelector('.success-message-styles')) {
        const successStyles = document.createElement('style');
        successStyles.className = 'success-message-styles';
        successStyles.textContent = `
            .success-message {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: successFadeIn 0.5s ease;
            }
            
            @keyframes successFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .success-content {
                background: white;
                border-radius: 20px;
                padding: 40px;
                text-align: center;
                max-width: 450px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: successSlideUp 0.5s ease;
            }
            
            @keyframes successSlideUp {
                from { 
                    transform: translateY(50px);
                    opacity: 0;
                }
                to { 
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            .success-icon {
                font-size: 64px;
                color: #22c55e;
                margin-bottom: 20px;
                animation: successBounce 1s ease;
            }
            
            @keyframes successBounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }
            
            .success-content h3 {
                color: var(--primary-color);
                margin-bottom: 15px;
                font-size: 24px;
            }
            
            .success-content p {
                color: var(--text-secondary);
                margin-bottom: 10px;
                line-height: 1.5;
            }
            
            .rating-display {
                font-size: 20px;
                margin: 15px 0 !important;
            }
            
            .email-info {
                padding: 12px;
                border-radius: 8px;
                font-weight: 500;
                margin: 20px 0 !important;
                transition: all 0.3s ease;
            }
            
            .email-info.success {
                background: #e0f2fe;
                color: #0369a1 !important;
            }
            
            .email-info.fallback {
                background: #fef3c7;
                color: #d97706 !important;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            
            .close-success-btn {
                background: var(--primary-color);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 25px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                margin-top: 20px;
                transition: all 0.3s ease;
            }
            
            .close-success-btn:hover {
                background: var(--primary-dark);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
            }
            
            @media (max-width: 768px) {
                .success-content {
                    padding: 30px 20px;
                    margin: 20px;
                }
                
                .success-icon {
                    font-size: 48px;
                }
                
                .success-content h3 {
                    font-size: 20px;
                }
            }
        `;
        document.head.appendChild(successStyles);
    }
    
    // 10 saniye sonra otomatik kapat
    setTimeout(() => {
        closeSuccessMessage();
    }, 10000);
}

function closeSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.style.animation = 'successFadeIn 0.3s ease reverse';
        setTimeout(() => {
            successMessage.remove();
        }, 300);
    }
}

function openDirectEmail() {
    // Form verilerini al
    const form = document.getElementById('feedback-form');
    const formData = new FormData(form);
    
    const name = formData.get('name') || 'Ziyaretçi';
    const feedback = formData.get('feedback') || '';
    const rating = formData.get('rating') || '5';
    
    // E-posta içeriğini hazırla
    const subject = 'Aerodinamik Website - Geri Bildirim';
    const body = `
Merhaba,

Aerodinamik web siteniz için geri bildirimimi paylaşmak istiyorum:

👤 İsim: ${name}
⭐ Değerlendirme: ${rating}/5 yıldız
📅 Tarih: ${new Date().toLocaleString('tr-TR')}

💬 Geri Bildirim:
${feedback}

🔧 Teknik Bilgiler:
• Sayfa: ${window.location.href}
• Tarayıcı: ${navigator.userAgent.substring(0, 100)}

Teşekkürler!
    `.trim();
    
    // Mailto linkini oluştur ve aç
    const mailtoLink = `mailto:suleymancandere4@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
    
    // Kullanıcıya bilgi mesajı göster
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-envelope toast-icon"></i>
            <div class="toast-text">
                <strong>E-posta İstemciniz Açılıyor!</strong>
                <p>Lütfen açılan e-postayı gönderin 📧</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Toast animasyonu
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 5000);
}

/* ========================================
   YARDIMCI FONKSİYONLAR
   ======================================== */

// CSS stilleri için upload preview
const uploadPreviewStyles = `
    .upload-preview-item {
        background: white;
        border-radius: 10px;
        padding: 15px;
        margin: 10px 0;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        display: grid;
        grid-template-columns: 120px 1fr auto;
        gap: 15px;
        align-items: center;
    }
    
    .upload-preview-item img,
    .upload-preview-item video {
        width: 120px;
        height: 80px;
        object-fit: cover;
        border-radius: 5px;
    }
    
    .audio-preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }
    
    .audio-preview i {
        font-size: 24px;
        color: var(--accent-color);
    }
    
    .file-info h4 {
        margin: 0 0 5px 0;
        color: var(--primary-color);
        font-size: 14px;
    }
    
    .file-info p {
        margin: 0;
        color: var(--text-secondary);
        font-size: 12px;
    }
    
    .file-actions {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    
    .analyze-btn, .remove-btn {
        padding: 5px 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.3s ease;
    }
    
    .analyze-btn {
        background: var(--primary-color);
        color: white;
    }
    
    .remove-btn {
        background: #ef4444;
        color: white;
    }
    
    .analyze-btn:hover, .remove-btn:hover {
        transform: scale(1.05);
    }
    
    .drag-over {
        background: rgba(6, 182, 212, 0.1) !important;
        border-color: var(--accent-color) !important;
    }
    
    .media-error {
        text-align: center;
        padding: 30px;
        color: var(--text-light);
    }
    
    .media-error i {
        font-size: 48px;
        margin-bottom: 15px;
        opacity: 0.5;
    }
    
    .video-suggestions {
        margin-top: 20px;
        padding: 15px;
        background: var(--background-secondary);
        border-radius: 10px;
    }
    
    .suggestions-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    
    .suggestion-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px;
        background: white;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .suggestion-item:hover {
        background: var(--primary-color);
        color: white;
    }
    
    .suggestion-item i {
        color: var(--accent-color);
    }
    
    .suggestion-item:hover i {
        color: white;
    }
`;

// Stilleri head'e ekle
if (!document.querySelector('.upload-preview-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.className = 'upload-preview-styles';
    styleSheet.textContent = uploadPreviewStyles;
    document.head.appendChild(styleSheet);
}