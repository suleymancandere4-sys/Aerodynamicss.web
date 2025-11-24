/* ========================================
   SESLİ ASİSTAN - voice-assistant.js
   Aerodinamik Website Sesli Rehber
   ======================================== */

class VoiceAssistant {
    constructor() {
        this.isListening = false;
        this.isSpeaking = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.voice = null;
        this.responses = this.initializeResponses();
        this.init();
    }

    init() {
        this.setupSpeechRecognition();
        this.setupVoiceSelection();
        this.createAssistantUI();
        this.setupKeyboardShortcuts();
    }

    setupSpeechRecognition() {
        // Ses tanıma özelliği kaldırıldı - sadece sayfa okuma
        this.recognition = null;
        console.log('Sesli asistan sadece sayfa okuma modunda çalışıyor.');
    }

    setupVoiceSelection() {
        // Türkçe ses seçimi
        const setVoice = () => {
            const voices = this.synthesis.getVoices();
            // Türkçe kadın sesi öncelikle
            this.voice = voices.find(voice => 
                voice.lang.includes('tr') && voice.name.includes('female')
            ) || voices.find(voice => voice.lang.includes('tr')) || voices[0];
        };
        
        setVoice();
        if (this.synthesis.onvoiceschanged !== undefined) {
            this.synthesis.onvoiceschanged = setVoice;
        }
    }

    createAssistantUI() {
        const assistantHTML = `
            <div id="voiceAssistant" class="voice-assistant">
                <div class="assistant-button" id="assistantButton">
                    <div class="assistant-icon">
                        <i class="fas fa-microphone" id="micIcon"></i>
                    </div>
                    <div class="assistant-pulse" id="assistantPulse"></div>
                </div>
                        <div class="assistant-tooltip">
                    Sayfa Okuyucusu<br>
                    <small>Sayfayı sesli oku</small>
                </div>
                <div class="assistant-panel" id="assistantPanel">
                    <div class="panel-header">
                        <h4>📖 Sayfa Okuyucusu</h4>
                        <button class="close-panel" id="closePanel">&times;</button>
                    </div>
                    <div class="panel-content">
                        <div class="assistant-status" id="assistantStatus">
                            Sayfayı sesli olarak okumak için tıklayın!
                        </div>
                        <div class="quick-commands">
                            <h5>Okuma Seçenekleri:</h5>
                            <div class="command-buttons">
                                <button onclick="voiceAssistant.readAboutSection()">Aerodinamik Nedir?</button>
                                <button onclick="voiceAssistant.readTheorySection()">Formüller</button>
                                <button onclick="voiceAssistant.readHistorySection()">Tarihçe</button>
                                <button onclick="voiceAssistant.startPageReading()">Tüm Sayfayı Oku</button>
                            </div>
                        </div>
                        <div class="voice-controls">
                            <button id="startListening" class="voice-btn primary">
                                <i class="fas fa-play"></i> Okumaya Başla
                            </button>
                            <button id="stopSpeaking" class="voice-btn secondary">
                                <i class="fas fa-stop"></i> Durdur
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', assistantHTML);
        this.setupEventListeners();
        this.addAssistantStyles();
    }

    setupEventListeners() {
        const assistantButton = document.getElementById('assistantButton');
        const assistantPanel = document.getElementById('assistantPanel');
        const closePanel = document.getElementById('closePanel');
        const startListening = document.getElementById('startListening');
        const stopSpeaking = document.getElementById('stopSpeaking');

        if (assistantButton) {
            // Sol tık ile dinlemeyi başlat/durdur
            assistantButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('Assistant button clicked - starting page reading');
                
                // Direkt sayfa okumayı başlat
                this.startPageReading();
            });

            // Sağ tık ile paneli aç/kapat
            assistantButton.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (assistantPanel) {
                    assistantPanel.classList.toggle('show');
                }
            });
        }

        if (closePanel) {
            closePanel.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (assistantPanel) {
                    assistantPanel.classList.remove('show');
                }
            });
        }

        if (startListening) {
            startListening.addEventListener('click', (e) => {
                e.preventDefault();
                this.startPageReading();
            });
        }

        if (stopSpeaking) {
            stopSpeaking.addEventListener('click', (e) => {
                e.preventDefault();
                this.stopSpeaking();
            });
        }

        // Panel dışına tıklayınca kapat
        document.addEventListener('click', (e) => {
            if (assistantPanel && assistantButton && 
                !assistantPanel.contains(e.target) && 
                !assistantButton.contains(e.target)) {
                assistantPanel.classList.remove('show');
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Space tuşu ile sayfa okumayı başlat (sadece form elemanları dışında)
            if (e.code === 'Space' && !e.target.matches('input, textarea, select, button')) {
                e.preventDefault();
                console.log('Space key pressed - starting page reading');
                this.startPageReading();
            }
            
            // Escape tuşu ile okumayı durdur
            if (e.code === 'Escape') {
                e.preventDefault();
                this.stopSpeaking();
                
                // Panel'i de kapat
                const assistantPanel = document.getElementById('assistantPanel');
                if (assistantPanel) {
                    assistantPanel.classList.remove('show');
                }
            }
        });
    }

    startListening() {
        console.log('Starting listening...', this.recognition, this.isListening);
        
        if (!this.recognition) {
            this.showNotification('❌ Tarayıcınız ses tanımayı desteklemiyor.', 'error');
            return;
        }
        
        if (this.isListening) {
            console.log('Already listening, ignoring request');
            return;
        }

        try {
            // Önce mevcut konuşmayı durdur
            if (this.synthesis.speaking) {
                this.synthesis.cancel();
            }
            
            this.recognition.start();
            console.log('Speech recognition started');
        } catch (error) {
            console.error('Ses tanıma başlatma hatası:', error);
            
            // Eğer zaten çalışıyorsa, önce durdur sonra tekrar başlat
            if (error.name === 'InvalidStateError') {
                setTimeout(() => {
                    try {
                        this.recognition.start();
                    } catch (retryError) {
                        console.error('Retry error:', retryError);
                        this.showNotification('❌ Ses tanıma başlatılamadı.', 'error');
                    }
                }, 100);
            } else {
                this.showNotification('❌ Mikrofon iznine ihtiyaç var.', 'error');
            }
        }
    }

    stopListening() {
        console.log('Stopping listening...', this.isListening);
        
        if (this.recognition && this.isListening) {
            try {
                this.recognition.stop();
            } catch (error) {
                console.error('Ses tanıma durdurma hatası:', error);
            }
        }
        
        // UI'yi güncelle
        this.isListening = false;
        this.updateAssistantUI();
    }

    speak(text, options = {}) {
        if (this.synthesis.speaking) {
            this.synthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.voice;
        utterance.rate = options.rate || 0.9;
        utterance.pitch = options.pitch || 1;
        utterance.volume = options.volume || 1;

        utterance.onstart = () => {
            this.isSpeaking = true;
            this.updateAssistantUI();
            this.updateStatus('🗣️ Konuşuyor...');
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            this.updateAssistantUI();
            this.updateStatus('Dinlemeye hazır');
        };

        this.synthesis.speak(utterance);
    }

    stopSpeaking() {
        if (this.synthesis.speaking) {
            this.synthesis.cancel();
            this.isSpeaking = false;
            this.updateAssistantUI();
            this.updateStatus('Durduruldu');
        }
    }

    processCommand(command) {
        console.log('Komut alındı:', command);
        
        // Özel komutlar önce kontrol edilir
        if (command.includes('sayfayı oku') || command.includes('okumaya başla') || command.includes('baştan oku')) {
            this.startPageReading();
            return;
        }
        
        if (command.includes('durdur') || command.includes('dur') || command.includes('kes')) {
            this.stopSpeaking();
            this.stopListening();
            return;
        }
        
        // Komut eşleştirme
        let response = this.responses.default;
        
        for (const [key, value] of Object.entries(this.responses)) {
            if (key !== 'default' && value.keywords) {
                if (value.keywords.some(keyword => command.includes(keyword))) {
                    response = value.response;
                    break;
                }
            }
        }

        // Navigasyon komutları
        if (command.includes('galeri') || command.includes('resim')) {
            const galleryElement = document.getElementById('gallery');
            if (galleryElement) {
                galleryElement.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (command.includes('video') || command.includes('medya')) {
            const mediaElement = document.getElementById('media');
            if (mediaElement) {
                mediaElement.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (command.includes('formül') || command.includes('teori')) {
            const theoryElement = document.getElementById('theory');
            if (theoryElement) {
                theoryElement.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (command.includes('ana sayfa') || command.includes('başa dön')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (command.includes('geri bildirim')) {
            const contactElement = document.getElementById('contact');
            if (contactElement) {
                contactElement.scrollIntoView({ behavior: 'smooth' });
            }
        }

        this.speak(response);
    }

    initializeResponses() {
        return {
            greetings: {
                keywords: ['merhaba', 'selam', 'hey'],
                response: 'Merhaba! Aerodinamik dünyasına hoş geldiniz. Size nasıl yardımcı olabilirim?'
            },
            
            about: {
                keywords: ['site hakkında', 'web site', 'sayfa hakkında'],
                response: 'Bu site aerodinamik bilimi hakkında kapsamlı bir eğitim platformudur. Bernoulli denklemi, kaldırma kuvveti gibi temel formülleri, CFD analizlerini ve gerçek dünya uygulamalarını bulabilirsiniz.'
            },
            
            aerodynamics: {
                keywords: ['aerodinamik nedir', 'aerodinamik', 'hava akışı'],
                response: 'Aerodinamik, akışkanların, özellikle havanın hareketini ve bu hareketin katı cisimler üzerindeki etkilerini inceleyen bilim dalıdır. Uçak tasarımından otomobil aerodinamiğine kadar birçok alanda kullanılır.'
            },
            
            formulas: {
                keywords: ['formül', 'denklem', 'matematik', 'hesaplama'],
                response: 'Sayfamızda Bernoulli denklemi, sürükleme kuvveti, kaldırma kuvveti ve Reynolds sayısı gibi temel aerodinamik formüllerini bulabilirsiniz. Her formülün pratik uygulamaları ve gerçek dünya örnekleri de mevcuttur.'
            },
            
            gallery: {
                keywords: ['galeri', 'resim', 'görsel', 'fotoğraf'],
                response: 'Galerimizde F-16 savaş uçağı, Boeing 747, Formula 1 araçları ve çeşitli akış simülasyonları gibi profesyonel CFD analizlerini görüntüleyebilirsiniz.'
            },
            
            media: {
                keywords: ['video', 'medya', 'ses', 'film'],
                response: 'Video bölümünde uçak ve araba aerodinamiği ile ilgili eğitici videolar bulunmaktadır. Hem teorik bilgiler hem de görsel simülasyonlar mevcuttur.'
            },
            
            history: {
                keywords: ['tarih', 'tarihçe', 'geçmiş', 'bilim insanı'],
                response: 'Aerodinamik tarihi bölümünde Daniel Bernoulli, Wright Kardeşler, Theodore von Kármán gibi önemli bilim insanlarının yaşamları ve katkıları anlatılmaktadır.'
            },
            
            aircraft: {
                keywords: ['uçak', 'aircraft', 'havacılık'],
                response: 'Uçak aerodinamiği bölümünde kanat tasarımı, kaldırma kuvveti oluşumu, hava akış dinamikleri ve modern havacılık teknolojileri hakkında detaylı bilgiler bulabilirsiniz.'
            },
            
            cars: {
                keywords: ['araba', 'otomobil', 'formula', 'yarış'],
                response: 'Otomobil aerodinamiği bölümünde Formula 1 teknolojileri, downforce üretimi, sürükleme azaltma yöntemleri ve modern araç tasarımı konularını inceleyebilirsiniz.'
            },
            
            feedback: {
                keywords: ['geri bildirim', 'yorum', 'öneri', 'mesaj'],
                response: 'Geri bildirim bölümünde isminizi ve site hakkındaki düşüncelerinizi paylaşabilirsiniz. Görüşleriniz bizim için çok değerlidir.'
            },
            
            help: {
                keywords: ['yardım', 'nasıl', 'ne yapabilirim', 'komut'],
                response: 'Bana "galeriyi göster", "formülleri anlat", "aerodinamik nedir" gibi sorular sorabilirsiniz. Ayrıca Space tuşuna basarak beni aktif hale getirebilirsiniz.'
            },
            
            readPage: {
                keywords: ['sayfayı oku', 'okumaya başla', 'baştan oku', 'tümünü oku'],
                response: 'Sayfayı baştan okumaya başlıyorum. Durdurmak için "durdur" deyin veya Escape tuşuna basın.'
            },
            
            thanks: {
                keywords: ['teşekkür', 'sağol', 'mersi'],
                response: 'Rica ederim! Başka bir konuda yardıma ihtiyacınız olursa her zaman buradayım.'
            },
            
            goodbye: {
                keywords: ['görüşürüz', 'bay bay', 'hoşçakal'],
                response: 'Görüşürüz! Aerodinamik öğrenme yolculuğunuzda başarılar dilerim.'
            },
            
            default: 'Üzgünüm, tam olarak anlayamadım. "Yardım" diyerek neler yapabileceğimi öğrenebilirsiniz.'
        };
    }

    updateAssistantUI() {
        const micIcon = document.getElementById('micIcon');
        const assistantPulse = document.getElementById('assistantPulse');
        const assistantButton = document.getElementById('assistantButton');

        if (this.isListening) {
            micIcon.className = 'fas fa-microphone-slash';
            assistantButton.classList.add('listening');
            assistantPulse.classList.add('active');
        } else if (this.isSpeaking) {
            micIcon.className = 'fas fa-volume-up';
            assistantButton.classList.add('speaking');
            assistantPulse.classList.add('active');
        } else {
            micIcon.className = 'fas fa-microphone';
            assistantButton.classList.remove('listening', 'speaking');
            assistantPulse.classList.remove('active');
        }
    }

    updateStatus(status) {
        const statusElement = document.getElementById('assistantStatus');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }

    addAssistantStyles() {
        if (document.querySelector('.voice-assistant-styles')) return;

        const styles = document.createElement('style');
        styles.className = 'voice-assistant-styles';
        styles.textContent = `
            .voice-assistant {
                position: fixed;
                bottom: 30px;
                right: 30px;
                z-index: 10000;
            }

            .assistant-button {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
                transition: all 0.3s ease;
                position: relative;
                border: 3px solid white;
            }

            .assistant-button:hover {
                transform: scale(1.1);
                box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
            }

            .assistant-button.listening {
                background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
                animation: listening-pulse 1s infinite;
            }

            .assistant-button.speaking {
                background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
                animation: speaking-wave 0.5s infinite alternate;
            }

            @keyframes listening-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.15); }
            }

            @keyframes speaking-wave {
                0% { transform: scale(1); }
                100% { transform: scale(1.05); }
            }

            .assistant-icon {
                color: white;
                font-size: 24px;
                z-index: 2;
                position: relative;
            }

            .assistant-pulse {
                position: absolute;
                top: -5px;
                left: -5px;
                right: -5px;
                bottom: -5px;
                border: 2px solid rgba(102, 126, 234, 0.6);
                border-radius: 50%;
                opacity: 0;
                transform: scale(1);
            }

            .assistant-pulse.active {
                animation: pulse-ring 2s infinite;
            }

            @keyframes pulse-ring {
                0% {
                    transform: scale(1);
                    opacity: 0.7;
                }
                100% {
                    transform: scale(2);
                    opacity: 0;
                }
            }

            .assistant-tooltip {
                position: absolute;
                bottom: 70px;
                right: 0;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 8px;
                font-size: 12px;
                text-align: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                white-space: nowrap;
            }

            .voice-assistant:hover .assistant-tooltip {
                opacity: 1;
                visibility: visible;
            }

            .assistant-panel {
                position: absolute;
                bottom: 70px;
                right: 0;
                width: 320px;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                opacity: 0;
                visibility: hidden;
                transform: translateY(20px);
                transition: all 0.3s ease;
            }

            .assistant-panel.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .panel-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 20px;
                border-radius: 15px 15px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .panel-header h4 {
                margin: 0;
                font-size: 16px;
            }

            .close-panel {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .close-panel:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .panel-content {
                padding: 20px;
            }

            .assistant-status {
                background: #f8f9fa;
                padding: 10px;
                border-radius: 8px;
                margin-bottom: 15px;
                font-size: 14px;
                text-align: center;
                color: #495057;
            }

            .quick-commands h5 {
                margin: 0 0 10px 0;
                color: #333;
                font-size: 14px;
            }

            .command-buttons {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                margin-bottom: 15px;
            }

            .command-buttons button {
                background: #e9ecef;
                border: none;
                padding: 8px;
                border-radius: 6px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .command-buttons button:hover {
                background: #667eea;
                color: white;
            }

            .voice-controls {
                display: flex;
                gap: 10px;
            }

            .voice-btn {
                flex: 1;
                padding: 10px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
            }

            .voice-btn.primary {
                background: #667eea;
                color: white;
            }

            .voice-btn.secondary {
                background: #6c757d;
                color: white;
            }

            .voice-btn:hover {
                transform: translateY(-2px);
            }

            @media (max-width: 768px) {
                .voice-assistant {
                    bottom: 20px;
                    right: 20px;
                }

                .assistant-panel {
                    width: 280px;
                    right: -60px;
                }

                .assistant-button {
                    width: 50px;
                    height: 50px;
                }

                .assistant-icon {
                    font-size: 20px;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    // Sayfa okuma fonksiyonları
    startPageReading() {
        // Önce mevcut konuşmayı durdur
        this.stopSpeaking();
        
        // Ana içeriği topla
        const pageContent = this.extractPageContent();
        
        // Okumaya başla
        this.speak('Sayfayı baştan okumaya başlıyorum.');
        
        // Kısa bir gecikme sonra içeriği okumaya başla
        setTimeout(() => {
            this.readContent(pageContent);
        }, 2000);
        
        // Okuma durumunu göster
        this.updateStatus('📖 Sayfa okunuyor...');
        this.showNotification('📖 Sayfa okuma başlatıldı', 'info');
    }
    
    readAboutSection() {
        this.stopSpeaking();
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            const title = aboutSection.querySelector('h2');
            const content = aboutSection.querySelector('.about-content p');
            const text = `${title ? title.textContent : 'Aerodinamik Nedir'}: ${content ? content.textContent : 'İçerik bulunamadı'}`;
            this.speak(text);
            this.updateStatus('📖 Aerodinamik tanımı okunuyor...');
        }
    }
    
    readTheorySection() {
        this.stopSpeaking();
        const theorySection = document.getElementById('theory');
        if (theorySection) {
            const title = theorySection.querySelector('h2');
            const formulas = theorySection.querySelectorAll('.formula-card h4');
            let text = `${title ? title.textContent : 'Temel Formüller'} bölümü: `;
            
            if (formulas.length > 0) {
                const formulaList = Array.from(formulas).map(f => f.textContent.trim()).join(', ');
                text += `Bu bölümde ${formulaList} formülleri ve bunların pratik uygulamaları açıklanmaktadır.`;
            } else {
                text += 'Formül bilgileri yükleniyor.';
            }
            
            this.speak(text);
            this.updateStatus('📖 Formüller okunuyor...');
        }
    }
    
    readHistorySection() {
        this.stopSpeaking();
        const historyItems = document.querySelectorAll('.timeline-item');
        let text = 'Aerodinamik Tarihi: ';
        
        if (historyItems.length > 0) {
            text += `Bu bölümde ${historyItems.length} önemli tarihsel olay ve bilim insanı hakkında bilgi bulunmaktadır. `;
            text += 'Daniel Bernoulli, Wright Kardeşler ve Theodore von Kármán gibi aerodinamik biliminin öncüleri anlatılmaktadır.';
        } else {
            text += 'Tarihsel bilgiler yükleniyor.';
        }
        
        this.speak(text);
        this.updateStatus('📖 Aerodinamik tarihi okunuyor...');
    }
    
    extractPageContent() {
        const content = [];
        
        // Ana başlık
        const mainTitle = document.querySelector('h1');
        if (mainTitle) {
            content.push(`Ana başlık: ${mainTitle.textContent.trim()}`);
        }
        
        // Hero bölümü
        const heroText = document.querySelector('.hero-content p');
        if (heroText) {
            content.push(`Giriş: ${heroText.textContent.trim()}`);
        }
        
        // Aerodinamik Nedir bölümü
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            const aboutTitle = aboutSection.querySelector('h2');
            const aboutText = aboutSection.querySelector('.about-content p');
            if (aboutTitle && aboutText) {
                content.push(`${aboutTitle.textContent.trim()}: ${aboutText.textContent.trim()}`);
            }
        }
        
        // Temel formüller bölümü
        const theorySection = document.getElementById('theory');
        if (theorySection) {
            const theoryTitle = theorySection.querySelector('h2');
            if (theoryTitle) {
                content.push(`${theoryTitle.textContent.trim()} bölümü.`);
                
                // Formül kartları
                const formulaCards = theorySection.querySelectorAll('.formula-card h4');
                if (formulaCards.length > 0) {
                    const formulas = Array.from(formulaCards).map(card => card.textContent.trim()).join(', ');
                    content.push(`Bu bölümde şu formüller bulunmaktadır: ${formulas}.`);
                }
            }
        }
        
        // Aerodinamik tarihi
        const historyItems = document.querySelectorAll('.timeline-item');
        if (historyItems.length > 0) {
            content.push('Aerodinamik tarihi bölümünde önemli bilim insanları ve keşifleri anlatılmaktadır.');
        }
        
        // Galeri bölümü
        const gallerySection = document.getElementById('gallery');
        if (gallerySection) {
            const galleryTitle = gallerySection.querySelector('h2');
            if (galleryTitle) {
                content.push(`${galleryTitle.textContent.trim()} bölümünde profesyonel CFD analizleri ve aerodinamik görselleri bulunmaktadır.`);
            }
        }
        
        // Video bölümü
        const mediaSection = document.getElementById('media');
        if (mediaSection) {
            const mediaTitle = mediaSection.querySelector('h2');
            if (mediaTitle) {
                content.push(`${mediaTitle.textContent.trim()} bölümünde uçak ve araba aerodinamiği ile ilgili eğitici videolar yer almaktadır.`);
            }
        }
        
        // Geri bildirim bölümü
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const contactTitle = contactSection.querySelector('h2');
            if (contactTitle) {
                content.push(`${contactTitle.textContent.trim()} bölümünde görüşlerinizi paylaşabilirsiniz.`);
            }
        }
        
        // AI araçları bilgisi
        content.push('Bu web sitesi Claude Sonnet, Canva AI, Pollo AI ve Play.ht gibi yapay zeka araçları kullanılarak geliştirilmiştir.');
        
        return content.join(' ');
    }
    
    readContent(content) {
        // İçeriği cümleler halinde böl
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
        let currentIndex = 0;
        
        const readNextSentence = () => {
            if (currentIndex < sentences.length && !this.synthesis.paused) {
                const sentence = sentences[currentIndex].trim();
                if (sentence) {
                    const utterance = new SpeechSynthesisUtterance(sentence);
                    utterance.voice = this.voice;
                    utterance.rate = 0.8; // Biraz daha yavaş okuma
                    utterance.pitch = 1;
                    utterance.volume = 1;
                    
                    utterance.onend = () => {
                        currentIndex++;
                        // Cümleler arası kısa duraklama
                        setTimeout(readNextSentence, 500);
                    };
                    
                    utterance.onerror = () => {
                        currentIndex++;
                        setTimeout(readNextSentence, 100);
                    };
                    
                    this.synthesis.speak(utterance);
                    
                    // İlerleme göster
                    const progress = Math.round((currentIndex / sentences.length) * 100);
                    this.updateStatus(`📖 Okuma devam ediyor... ${progress}%`);
                }
            } else {
                // Okuma tamamlandı
                this.updateStatus('✅ Sayfa okuma tamamlandı');
                this.showNotification('✅ Sayfa okuma tamamlandı', 'success');
            }
        };
        
        readNextSentence();
    }

    // Bildirim gösterme
    showNotification(message, type = 'info') {
        // Mevcut showNotification fonksiyonunu kullan veya basit alert
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }
}

// Sesli asistanı başlat
let voiceAssistant;

function initializeVoiceAssistant() {
    try {
        voiceAssistant = new VoiceAssistant();
        console.log('Voice assistant initialized successfully');
        
        // Hoş geldin mesajı (isteğe bağlı)
        setTimeout(() => {
            if (voiceAssistant && !localStorage.getItem('page-reader-welcomed')) {
                voiceAssistant.speak('Aerodinamik web sitesine hoş geldiniz! Sayfayı sesli olarak dinlemek için sağ alttaki butona tıklayabilir veya Space tuşunu kullanabilirsiniz.');
                localStorage.setItem('page-reader-welcomed', 'true');
            }
        }, 3000);
        
    } catch (error) {
        console.error('Voice assistant initialization error:', error);
    }
}

// DOM yüklendiğinde ve sayfa tamamen yüklendiğinde başlat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeVoiceAssistant);
} else {
    initializeVoiceAssistant();
}

// Sayfa tamamen yüklendikten sonra da kontrol et
window.addEventListener('load', () => {
    if (!voiceAssistant) {
        setTimeout(initializeVoiceAssistant, 1000);
    }
});