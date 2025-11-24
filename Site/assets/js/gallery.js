/* ========================================
   Galeri JavaScript - gallery.js
   Aerodinamik Görseller Yönetimi
   ======================================== */

// Aerodinamik görselleri veritabanı
const aerodynamicsGallery = {
    aircraft: [
        {
            id: 1,
            title: "Uçak Kanat Aerodinamiği",
            description: "Uçak kanatları üzerindeki hava akışının detaylı analizi ve kaldırma kuvveti oluşumu",
            url: "https://blog-assets.solidworks.com/uploads/sites/2/2018/12/aircraft_blog_image4.png",
            category: "aircraft",
            tags: ["uçak", "kanat", "hava akışı", "kaldırma", "CFD"]
        },
        {
            id: 2,
            title: "F-16 Savaş Uçağı Aerodinamiği",
            description: "F-16 basınç katsayısı konturları - aktif hava girişi ve egzoz sistemi ile Mach koşullarında CFD analizi",
            url: "https://www.researchgate.net/profile/Shishir-Pandya/publication/259800412/figure/fig6/AS:669058135502856@1536527298278/Contours-of-the-coefficient-of-pressure-for-an-F-16-with-active-inlet-and-exhaust-at-M.ppm",
            category: "aircraft",
            tags: ["F-16", "savaş uçağı", "süpersonik", "aerodinamik", "CFD", "basınç katsayısı", "ResearchGate"]
        },
        {
            id: 3,
            title: "Boeing 747 Hava Akışı",
            description: "Boeing 747-200 CFD analizi - Mach 0.84 hızında ve 2.73° hücum açısında hava akış simülasyonu",
            url: "https://www.researchgate.net/profile/Antony-Jameson/publication/6096597/figure/fig2/AS:280673127550986@1443929096457/Flow-bast-a-Boeing-747-200-at-Mach-number-084-and-273-degrees-angle-of-attack-Top.png",
            category: "aircraft",
            tags: ["Boeing 747", "yolcu uçağı", "CFD", "Mach 0.84", "hücum açısı", "ResearchGate"]
        }
    ],
    cars: [
        {
            id: 4,
            title: "Formula 1 Aerodinamiği",
            description: "F1 aracının detaylı aerodinamik analizi - kanat konfigürasyonları ve hava akış dinamikleri",
            url: "https://th.bing.com/th/id/R.d73de07b7e79f5e9f5e32077a05f592e?rik=w%2bQrLH0iKWjLCQ&pid=ImgRaw&r=0",
            category: "cars",
            tags: ["Formula 1", "downforce", "arka kanat", "yarış", "CFD analizi", "aerodinamik paket"]
        },
        {
            id: 5,
            title: "Süper Otomobil Aerodinamiği",
            description: "Süper otomobilin CFD hava akış analizi - spoiler, diffüzör ve karoser aerodinamik optimizasyonu",
            url: "https://i.pinimg.com/originals/64/e9/b4/64e9b4272629c6200ca9b8693b2e7b64.jpg",
            category: "cars",
            tags: ["süper otomobil", "spoiler", "CFD", "hava akışı", "diffüzör", "aerodinamik optimizasyon"]
        }
    ],
    flow: [
        {
            id: 6,
            title: "Hava Akış Görselleştirmesi",
            description: "Rüzgar tünelinde beyaz uçak modeli etrafında duman akışı ile aerodinamik test görselleştirmesi",
            url: "https://thumbs.dreamstime.com/b/white-aircraft-sits-platform-wind-tunnel-smoke-trailing-behind-swirls-dances-air-creating-dramatic-320359122.jpg",
            category: "flow",
            tags: ["rüzgar tüneli", "duman akışı", "uçak modeli", "aerodinamik test", "smoke trail"]
        },
        {
            id: 7,
            title: "Silindir Etrafında Vortex",
            description: "Su akışında oluşan güçlü vortex yapısı ve dönüşlü akışkan dinamikleri görselleştirmesi",
            url: "https://www.aquaportail.com/pictures2307/vortex.jpg",
            category: "flow",
            tags: ["vortex", "su akışı", "dönüşlü akış", "akışkan dinamikleri", "hidrodinamik"]
        }
    ],
    simulation: [
        {
            id: 8,
            title: "CFD Basınç Analizi",
            description: "Bilgisayar destekli akışkanlar dinamiği ile basınç dağılımı analizi",
            url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
            category: "simulation",
            tags: ["CFD", "basınç analizi", "simülasyon", "ANSYS"]
        },
        {
            id: 9,
            title: "Velocity Field Simulation",
            description: "Hız vektör alanlarının görselleştirilmesi ve akış çizgilerinin detaylı analizi",
            url: "https://th.bing.com/th/id/R.ac628547aa03a24c501a8f784845054d?rik=%2fpPNS3A%2bP8t8gA&pid=ImgRaw&r=0",
            category: "simulation",
            tags: ["hız alanı", "velocity field", "vector field", "CFD", "akış çizgileri", "simülasyon"]
        }
    ]
};

// DOM yüklendiğinde galeriyi başlat
document.addEventListener('DOMContentLoaded', function() {
    initGallery();
    initGalleryTabs();
    initGalleryModal();
});

/* ========================================
   GALERİ İNİSYALİZASYONU
   ======================================== */
function initGallery() {
    // İlk olarak aircraft kategorisini yükle
    loadGalleryCategory('aircraft');
}

/* ========================================
   GALERİ TAB YÖNETİMİ
   ======================================== */
function initGalleryTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Aktif tab'ı güncelle
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // İlgili kategoriyi yükle
            const category = this.getAttribute('data-tab');
            loadGalleryCategory(category);
        });
    });
}

/* ========================================
   KATEGORİ YÜKLEME
   ======================================== */
function loadGalleryCategory(category) {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return;
    
    // Loading göster
    galleryGrid.innerHTML = '<div class="loading-spinner">🔄 Yükleniyor...</div>';
    
    setTimeout(() => {
        const images = aerodynamicsGallery[category] || [];
        
        if (images.length === 0) {
            galleryGrid.innerHTML = `
                <div class="no-images">
                    <p>Bu kategori için henüz görsel bulunmamaktadır.</p>
                    <p>Yakında eklenecek! 🚀</p>
                </div>
            `;
            return;
        }
        
        // Görselleri render et
        galleryGrid.innerHTML = images.map(image => `
            <div class="gallery-item" data-id="${image.id}">
                <img src="${image.url}" alt="${image.title}" loading="lazy">
                <div class="gallery-info">
                    <h4>${image.title}</h4>
                    <p>${image.description}</p>
                    <div class="gallery-tags">
                        ${image.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <button class="view-button" onclick="openImageModal(${image.id})">
                        <i class="fas fa-expand"></i> Detayları Gör
                    </button>
                </div>
            </div>
        `).join('');
        
        // Fade-in animasyonu ekle
        const items = galleryGrid.querySelectorAll('.gallery-item');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 500); // Simulated loading delay
}

/* ========================================
   MODAL YÖNETİMİ
   ======================================== */
function initGalleryModal() {
    // Modal HTML'ini body'e ekle
    const modalHTML = `
        <div id="imageModal" class="image-modal">
            <div class="modal-content">
                <span class="modal-close" onclick="closeImageModal()">&times;</span>
                <div class="modal-image-container">
                    <img id="modalImage" src="" alt="">
                </div>
                <div class="modal-info">
                    <h3 id="modalTitle"></h3>
                    <p id="modalDescription"></p>
                    <div id="modalTags" class="modal-tags"></div>
                    <div class="modal-actions">
                        <button onclick="downloadImage()" class="download-btn">
                            <i class="fas fa-download"></i> İndir
                        </button>
                        <button onclick="shareImage()" class="share-btn">
                            <i class="fas fa-share"></i> Paylaş
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Modal CSS'ini ekle
    if (!document.querySelector('.modal-styles')) {
        const modalStyles = document.createElement('style');
        modalStyles.className = 'modal-styles';
        modalStyles.textContent = `
            .image-modal {
                display: none;
                position: fixed;
                z-index: 10000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(5px);
            }
            
            .image-modal.active {
                display: flex;
                align-items: center;
                justify-content: center;
                animation: modalFadeIn 0.3s ease;
            }
            
            @keyframes modalFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .modal-content {
                background: white;
                border-radius: 15px;
                max-width: 90vw;
                max-height: 90vh;
                overflow: hidden;
                position: relative;
                display: grid;
                grid-template-columns: 2fr 1fr;
                box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
            }
            
            .modal-close {
                position: absolute;
                top: 15px;
                right: 20px;
                color: white;
                font-size: 30px;
                font-weight: bold;
                cursor: pointer;
                z-index: 10001;
                background: rgba(0, 0, 0, 0.5);
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.3s ease;
            }
            
            .modal-close:hover {
                background: rgba(0, 0, 0, 0.8);
            }
            
            .modal-image-container {
                position: relative;
                background: #000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            #modalImage {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
            
            .modal-info {
                padding: 30px;
                background: white;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            
            #modalTitle {
                color: var(--primary-color);
                margin-bottom: 15px;
                font-size: 1.5rem;
            }
            
            #modalDescription {
                color: var(--text-secondary);
                margin-bottom: 20px;
                line-height: 1.6;
            }
            
            .modal-tags {
                margin-bottom: 30px;
            }
            
            .modal-tags .tag {
                display: inline-block;
                background: var(--accent-color);
                color: white;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 12px;
                margin: 2px;
            }
            
            .modal-actions {
                display: flex;
                gap: 10px;
            }
            
            .download-btn, .share-btn {
                flex: 1;
                padding: 12px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                transition: transform 0.2s ease;
            }
            
            .download-btn {
                background: var(--primary-color);
                color: white;
            }
            
            .share-btn {
                background: var(--accent-color);
                color: white;
            }
            
            .download-btn:hover, .share-btn:hover {
                transform: translateY(-2px);
            }
            
            @media (max-width: 768px) {
                .modal-content {
                    grid-template-columns: 1fr;
                    grid-template-rows: 2fr 1fr;
                    max-width: 95vw;
                    max-height: 95vh;
                }
                
                .modal-info {
                    padding: 20px;
                }
            }
        `;
        document.head.appendChild(modalStyles);
    }
}

/* ========================================
   MODAL FONKSİYONLARI
   ======================================== */
function openImageModal(imageId) {
    const image = findImageById(imageId);
    if (!image) return;
    
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalTags = document.getElementById('modalTags');
    
    // Modal içeriğini güncelle
    modalImage.src = image.url;
    modalImage.alt = image.title;
    modalTitle.textContent = image.title;
    modalDescription.textContent = image.description;
    modalTags.innerHTML = image.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    // Modal'ı göster
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Escape tuşu ile kapat
    document.addEventListener('keydown', handleModalEscape);
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    document.removeEventListener('keydown', handleModalEscape);
}

function handleModalEscape(e) {
    if (e.key === 'Escape') {
        closeImageModal();
    }
}

function findImageById(id) {
    for (const category in aerodynamicsGallery) {
        const image = aerodynamicsGallery[category].find(img => img.id === id);
        if (image) return image;
    }
    return null;
}

function downloadImage() {
    const modalImage = document.getElementById('modalImage');
    const link = document.createElement('a');
    link.href = modalImage.src;
    link.download = 'aerodinamik-gorsel.jpg';
    link.click();
}

function shareImage() {
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    
    if (navigator.share) {
        navigator.share({
            title: modalTitle.textContent,
            text: 'Aerodinamik görselini inceleyin!',
            url: modalImage.src
        });
    } else {
        // Fallback: URL'yi panoya kopyala
        navigator.clipboard.writeText(modalImage.src).then(() => {
            showNotification('Görsel URL\'si panoya kopyalandı!', 'success');
        });
    }
}

/* ========================================
   ARAMA VE FİLTRELEME
   ======================================== */
function searchGallery(query) {
    const allImages = Object.values(aerodynamicsGallery).flat();
    const filteredImages = allImages.filter(image => 
        image.title.toLowerCase().includes(query.toLowerCase()) ||
        image.description.toLowerCase().includes(query.toLowerCase()) ||
        image.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    
    displaySearchResults(filteredImages);
}

function displaySearchResults(images) {
    const galleryGrid = document.getElementById('gallery-grid');
    
    if (images.length === 0) {
        galleryGrid.innerHTML = `
            <div class="no-results">
                <p>Arama kriterlerinizle eşleşen görsel bulunamadı.</p>
                <p>Farklı anahtar kelimeler deneyin. 🔍</p>
            </div>
        `;
        return;
    }
    
    galleryGrid.innerHTML = images.map(image => `
        <div class="gallery-item" data-id="${image.id}">
            <img src="${image.url}" alt="${image.title}" loading="lazy">
            <div class="gallery-info">
                <h4>${image.title}</h4>
                <p>${image.description}</p>
                <div class="gallery-tags">
                    ${image.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <button class="view-button" onclick="openImageModal(${image.id})">
                    <i class="fas fa-expand"></i> Detayları Gör
                </button>
            </div>
        </div>
    `).join('');
}