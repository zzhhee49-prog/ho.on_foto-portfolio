document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 0. Hero 대형 대표 사진 자동 3.5초 페이드 슬라이드쇼 루프
    // ==========================================================================
    const heroSignatureImg = document.getElementById('hero-signature-img');

    let heroImages = [
        'assets/images/slide1.jpg',
        'assets/images/slide2.jpg',
        'assets/images/slide3.jpg',
        'assets/images/slide4.jpg',
        'assets/images/slide5.jpg'
    ];

    let currentHeroIndex = 0;
    let slideshowInterval = null;

    if (heroSignatureImg) {
        heroSignatureImg.src = heroImages[0];
    }

    function startHeroSlideshow() {
        if (slideshowInterval) clearInterval(slideshowInterval);
        
        slideshowInterval = setInterval(() => {
            if (!heroSignatureImg) return;
            
            currentHeroIndex = (currentHeroIndex + 1) % heroImages.length;
            
            heroSignatureImg.style.opacity = '0';
            
            setTimeout(() => {
                heroSignatureImg.src = heroImages[currentHeroIndex];
                heroSignatureImg.style.opacity = '1';
            }, 800);
        }, 3500);
    }

    startHeroSlideshow();

    // ==========================================================================
    // 1. 모바일 드로어 내비게이션 토글
    // ==========================================================================
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            const isActive = mainNav.classList.toggle('active');
            mobileMenuToggle.setAttribute('aria-label', isActive ? '메뉴 닫기' : '메뉴 열기');
            const bars = mobileMenuToggle.querySelectorAll('.bar');
            if (isActive) {
                bars[0].style.transform = 'translateY(7px) rotate(45deg)';
                bars[1].style.transform = 'translateY(-7px) rotate(-45deg)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.transform = 'none';
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            if (mobileMenuToggle) {
                const bars = mobileMenuToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.transform = 'none';
            }
        });
    });

    // ==========================================================================
    // 2. Intersection Observer (스크롤 페이드인 연동)
    // ==========================================================================
    const animatedElements = document.querySelectorAll('.fade-in-up');
    
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animatedElements.forEach(el => scrollObserver.observe(el));

    // ==========================================================================
    // 3. 갤러리 아카이브 데이터베이스 & 로컬스토리지 CRUD 관리 로직
    // ==========================================================================
    const DEFAULT_GALLERY_DATA = [
        { id: 'land-1', category: 'landscape', url: 'assets/images/landscape_add1.jpg', title: '칠산바다 갯벌의 포구', desc: '갯벌 위에 정박한 고기잡이 배들과 바다 위 인도교가 자아내는 평화로운 어촌 정취.' },
        { id: 'land-2', category: 'landscape', url: 'assets/images/landscape_add2.jpg', title: '순천만 칠면초 군락의 붉은 융단', desc: '순천만 갯벌을 붉게물들인 칠면초의 생명력 넘치는 대자연 풍경.' },
        { id: 'land-3', category: 'landscape', url: 'assets/images/landscape.jpg', title: '잔디 언덕과 나홀로 나무', desc: '경이로운 대자연 속에 외로이 서 있는 생명력의 미학, 올림픽공원.' },
        { id: 'land-4', category: 'landscape', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', title: '안개 낀 아침 강가', desc: '산허리를 감싸며 흐르는 아침 서리와 빛이 교차하는 평화로운 정취.' },
        { id: 'land-5', category: 'landscape', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80', title: '산맥의 웅장한 능선', desc: '구름 위로 솟구쳐 오른 자연 고유의 선과 깊이 있는 실루엣.' },
        { id: 'city-1', category: 'city', url: 'assets/images/city_add1.jpg', title: '뚝섬 한강공원에서 바라본 롯데타워 야경', desc: '한강의 물결 너머로 화려하게 솟아오른 랜드마크 롯데타워와 강변북로의 궤적.' },
        { id: 'city-2', category: 'city', url: 'assets/images/city_add2.jpg', title: '동호대교의 노을과 서울 N타워', desc: '노을 지는 한강의 주황빛 물결 위를 가로지르는 동호대교와 남산타워 실루엣.' },
        { id: 'city-3', category: 'city', url: 'assets/images/city.jpg', title: '목포대교의 황혼과 도심 야경', desc: '서해안 유달산 자락에서 바라본 주황빛 낙조와 목포대교의 화려한 조화.' },
        { id: 'city-4', category: 'city', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80', title: '골목길의 고요한 가로등', desc: '오래된 도시 골목 구석구석이 품고 있는 노란빛 가로등의 감성.' },
        { id: 'city-5', category: 'city', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', title: '기하학적인 도심 건축물', desc: '도시 속 차가운 현대적 구조물들 사이에서 발견한 조형미의 시선.' },
        { id: 'col-1', category: 'collaboration', url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80', title: '전통 고택 아카이브 화보', desc: '한국관광공사 사진기자 이력으로 제작한 공공 배포용 로컬 기와 가옥 명소 비주얼.' },
        { id: 'col-2', category: 'collaboration', url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80', title: '지자체 배포용 자연 관광지 컷', desc: '지역 활성화 책자 및 SNS 채널에 즉각 라이선스 프리로 매핑 가능한 고화질 로컬 소스.' },
        { id: 'space-1', category: 'space', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', title: '고요한 해변의 공간감', desc: '자연이 주는 가장 넓은 전시장, 바다가 자아내는 평화로운 고유 공간.' },
        { id: 'space-2', category: 'space', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80', title: '오후의 사색이 깃든 나무 숲', desc: '빛이 갈래갈래 찢어지며 쏟아지는 감성적인 숲 속 로케이션.' }
    ];

    const CATEGORY_DISPLAY_NAMES = {
        landscape: 'LANDSCAPE & LOCAL',
        city: 'CITY & ARCHITECTURE',
        collaboration: 'COLLABORATION & DESIGN',
        space: 'SPACE & STAY'
    };

    let galleryDb = [];
    const storageKey = 'jihoon_portfolio_gallery_db_v4'; // 플랫 데이터 포맷 이전을 위해 버전을 v4로 변경
    
    function loadGalleryDb() {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                galleryDb = JSON.parse(stored);
                if (!Array.isArray(galleryDb)) {
                    throw new Error('Data format invalid');
                }
            } catch (e) {
                galleryDb = JSON.parse(JSON.stringify(DEFAULT_GALLERY_DATA));
                saveGalleryDb();
            }
        } else {
            const v3Stored = localStorage.getItem('jihoon_portfolio_gallery_db_v3');
            if (v3Stored) {
                try {
                    const v3Data = JSON.parse(v3Stored);
                    const migrated = [];
                    const orderKeys = ['landscape', 'city', 'collaboration', 'space'];
                    orderKeys.forEach(cat => {
                        if (v3Data[cat]) {
                            v3Data[cat].forEach((item, idx) => {
                                migrated.push({
                                    id: cat + '-' + idx + '-' + Date.now(),
                                    url: item.url,
                                    title: item.title,
                                    desc: item.desc,
                                    category: cat
                                });
                            });
                        }
                    });
                    galleryDb = migrated;
                } catch (err) {
                    galleryDb = JSON.parse(JSON.stringify(DEFAULT_GALLERY_DATA));
                }
            } else {
                galleryDb = JSON.parse(JSON.stringify(DEFAULT_GALLERY_DATA));
            }
            saveGalleryDb();
        }
    }

    function saveGalleryDb() {
        localStorage.setItem(storageKey, JSON.stringify(galleryDb));
    }

    loadGalleryDb();

    // ==========================================================================
    // 4. 갤러리 피드 그리드 렌더링 & 실시간 필터링 엔진
    // ==========================================================================
    const galleryGrid = document.getElementById('gallery-grid');
    const filterTabs = document.querySelectorAll('.filter-tab');
    let currentFilter = 'all';
    let isAdminModeActive = false;

    // 라이트박스 및 모달 제어용 변수
    const lightboxModal = document.getElementById('gallery-lightbox');
    const lightboxClose = document.getElementById('lightbox-close-btn');
    const sliderMainImg = document.getElementById('slider-main-img');
    const sliderCatTitle = document.getElementById('slider-cat-title');
    const sliderImgTitle = document.getElementById('slider-img-title');
    const sliderDesc = document.getElementById('slider-img-desc');
    const sliderCounter = document.getElementById('slider-counter');
    const sliderPrevBtn = document.getElementById('slider-prev-btn');
    const sliderNextBtn = document.getElementById('slider-next-btn');

    let activeList = [];
    let activeSlideIndex = 0;

    // 관리자 에디터 전용 모달 DOM 객체
    const adminEditModal = document.getElementById('admin-edit-modal');
    const adminModalClose = document.getElementById('admin-modal-close');
    const adminModalTitle = document.getElementById('admin-modal-title');
    const editImgCategory = document.getElementById('edit-img-category');
    const editImgFile = document.getElementById('edit-img-file');
    const editImgUrl = document.getElementById('edit-img-url');
    const editImgTitle = document.getElementById('edit-img-title');
    const editImgDesc = document.getElementById('edit-img-desc');
    const btnSaveImage = document.getElementById('btn-save-image');
    const btnDeleteImage = document.getElementById('btn-delete-image');
    const btnCancelEdit = document.getElementById('btn-cancel-edit');

    let editingItemId = null;

    if (editImgFile && editImgUrl) {
        editImgFile.addEventListener('change', (e) => {
            const files = e.currentTarget.files;
            if (files && files.length > 0) {
                const file = files[0];
                if (!file.type.startsWith('image/')) {
                    alert('이미지 파일만 등록할 수 있습니다.');
                    e.currentTarget.value = '';
                    return;
                }
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    editImgUrl.value = reader.result;
                };
            }
        });
    }

    function renderGallery() {
        if (!galleryGrid) return;
        galleryGrid.innerHTML = '';

        const filteredItems = galleryDb.filter(item => {
            return currentFilter === 'all' ? true : item.category === currentFilter;
        });

        if (isAdminModeActive) {
            const addPlaceholder = document.createElement('div');
            addPlaceholder.className = 'gallery-grid-item add-card-placeholder fade-in-up active';
            addPlaceholder.innerHTML = `
                <svg viewBox="0 0 24 24" class="add-card-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span class="add-card-text">새 작품 등록</span>
            `;
            addPlaceholder.addEventListener('click', () => openAdminModal(null));
            galleryGrid.appendChild(addPlaceholder);
        }

        filteredItems.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'gallery-grid-item fade-in-up active';
            if (isAdminModeActive) {
                card.classList.add('admin-draggable');
                card.setAttribute('draggable', 'true');
            }
            card.setAttribute('data-id', item.id);
            card.setAttribute('data-index', index);

            card.innerHTML = `
                <img src="${item.url}" alt="${item.title}" loading="lazy">
                <div class="grid-item-overlay">
                    <span class="grid-item-category">${CATEGORY_DISPLAY_NAMES[item.category]}</span>
                    <h4 class="grid-item-title">${item.title}</h4>
                    <p class="grid-item-desc">${item.desc}</p>
                </div>
            `;

            if (isAdminModeActive) {
                const actionContainer = document.createElement('div');
                actionContainer.className = 'grid-item-actions';

                const editBtn = document.createElement('button');
                editBtn.className = 'grid-action-btn edit-btn';
                editBtn.title = '수정';
                editBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                `;
                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openAdminModal(item.id);
                });

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'grid-action-btn delete-btn';
                deleteBtn.title = '삭제';
                deleteBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                `;
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteArchiveItem(item.id);
                });

                actionContainer.appendChild(editBtn);
                actionContainer.appendChild(deleteBtn);
                card.appendChild(actionContainer);
            }

            card.addEventListener('click', () => {
                if (!isAdminModeActive) {
                    openLightbox(item.id, filteredItems);
                }
            });

            if (isAdminModeActive) {
                card.addEventListener('dragstart', handleDragStart);
                card.addEventListener('dragover', handleDragOver);
                card.addEventListener('dragleave', handleDragLeave);
                card.addEventListener('drop', handleDrop);
                card.addEventListener('dragend', handleDragEnd);
            }

            galleryGrid.appendChild(card);
        });
    }

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.getAttribute('data-filter');
            renderGallery();
        });
    });

    let dragSrcId = null;

    function handleDragStart(e) {
        const target = e.currentTarget;
        target.classList.add('dragging');
        dragSrcId = target.getAttribute('data-id');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', dragSrcId);
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    function handleDragEnd(e) {
        e.currentTarget.classList.remove('dragging');
        const items = document.querySelectorAll('.gallery-grid-item');
        items.forEach(item => {
            item.classList.remove('drag-over');
            item.classList.remove('dragging');
        });
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const target = e.currentTarget;
        target.classList.remove('drag-over');
        
        const targetId = target.getAttribute('data-id');
        const sourceId = (dragSrcId !== null) ? dragSrcId : e.dataTransfer.getData('text/plain');
        
        if (!sourceId || sourceId === targetId) return;
        
        const sourceIndexInDb = galleryDb.findIndex(item => item.id === sourceId);
        const targetIndexInDb = galleryDb.findIndex(item => item.id === targetId);
        
        if (sourceIndexInDb === -1 || targetIndexInDb === -1) return;
        
        const [movedItem] = galleryDb.splice(sourceIndexInDb, 1);
        galleryDb.splice(targetIndexInDb, 0, movedItem);
        
        saveGalleryDb();
        renderGallery();
    }

    // ==========================================================================
    // 5. 작품 라이트박스 팝업 (Pure Reader Viewer)
    // ==========================================================================
    function openLightbox(itemId, currentList) {
        activeList = currentList;
        activeSlideIndex = activeList.findIndex(item => item.id === itemId);
        if (activeSlideIndex === -1) return;

        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        
        renderSlide();
    }

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });

    function renderSlide() {
        const slide = activeList[activeSlideIndex];
        if (!slide) return;

        sliderMainImg.style.opacity = '0';
        setTimeout(() => {
            sliderMainImg.src = slide.url;
            sliderMainImg.alt = slide.title;
            sliderMainImg.style.opacity = '1';
        }, 150);

        sliderCatTitle.textContent = CATEGORY_DISPLAY_NAMES[slide.category];
        sliderImgTitle.textContent = slide.title;
        sliderDesc.textContent = slide.desc;
        sliderCounter.textContent = `${activeSlideIndex + 1} / ${activeList.length}`;
    }

    if (sliderPrevBtn && sliderNextBtn) {
        sliderPrevBtn.addEventListener('click', () => {
            if (activeList.length > 0) {
                activeSlideIndex = (activeSlideIndex - 1 + activeList.length) % activeList.length;
                renderSlide();
            }
        });

        sliderNextBtn.addEventListener('click', () => {
            if (activeList.length > 0) {
                activeSlideIndex = (activeSlideIndex + 1) % activeList.length;
                renderSlide();
            }
        });
    }

    window.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') {
            sliderPrevBtn.click();
        } else if (e.key === 'ArrowRight') {
            sliderNextBtn.click();
        } else if (e.key === 'Escape') {
            closeLightbox();
        }
    });

    // ==========================================================================
    // 6. 관리자 모드 토글 & 에디터 모달 핸들러 (CRUD)
    // ==========================================================================
    const adminToggleBtn = document.getElementById('admin-mode-toggle');

    if (adminToggleBtn) {
        adminToggleBtn.addEventListener('click', () => {
            isAdminModeActive = !isAdminModeActive;
            adminToggleBtn.classList.toggle('active', isAdminModeActive);
            
            if (isAdminModeActive) {
                alert('아카이브 관리자 모드가 활성화되었습니다. 이제 갤러리 내 각 작품의 카드를 자유롭게 재정렬하거나 첫 칸의 [+ 새 작품 등록] 또는 카드 내 [수정/삭제] 버튼을 활용하실 수 있습니다.');
            }
            renderGallery();
        });
    }

    function openAdminModal(itemId) {
        editingItemId = itemId;
        
        if (!itemId) {
            adminModalTitle.textContent = '새로운 작품 등록';
            editImgCategory.value = currentFilter !== 'all' ? currentFilter : 'landscape';
            editImgFile.value = '';
            editImgUrl.value = '';
            editImgTitle.value = '';
            editImgDesc.value = '';
            btnDeleteImage.style.display = 'none';
        } else {
            const item = galleryDb.find(i => i.id === itemId);
            if (!item) return;

            adminModalTitle.textContent = '작품 정보 편집';
            editImgCategory.value = item.category;
            editImgFile.value = '';
            editImgUrl.value = item.url;
            editImgTitle.value = item.title;
            editImgDesc.value = item.desc;
            btnDeleteImage.style.display = 'inline-block';
        }

        if (adminEditModal) {
            adminEditModal.style.display = 'flex';
            adminEditModal.setAttribute('aria-hidden', 'false');
        }
    }

    function closeAdminModal() {
        if (adminEditModal) {
            adminEditModal.style.display = 'none';
            adminEditModal.setAttribute('aria-hidden', 'true');
        }
        editingItemId = null;
    }

    if (adminModalClose) {
        adminModalClose.addEventListener('click', closeAdminModal);
    }
    if (btnCancelEdit) {
        btnCancelEdit.addEventListener('click', closeAdminModal);
    }
    if (adminEditModal) {
        adminEditModal.addEventListener('click', (e) => {
            if (e.target === adminEditModal) {
                closeAdminModal();
            }
        });
    }

    if (btnSaveImage) {
        btnSaveImage.addEventListener('click', () => {
            const categoryVal = editImgCategory.value;
            const urlVal = editImgUrl.value.trim();
            const titleVal = editImgTitle.value.trim();
            const descVal = editImgDesc.value.trim();

            if (!urlVal) {
                alert('사진 파일을 선택하여 업로드해 주세요.');
                return;
            }
            if (!titleVal) {
                alert('작품 제목을 입력해 주세요.');
                return;
            }

            if (!editingItemId) {
                const newItem = {
                    id: 'item-' + Date.now(),
                    category: categoryVal,
                    url: urlVal,
                    title: titleVal,
                    desc: descVal
                };
                galleryDb.unshift(newItem);
                alert('새 작품이 갤러리에 성공적으로 등록되었습니다.');
            } else {
                const item = galleryDb.find(i => i.id === editingItemId);
                if (item) {
                    item.category = categoryVal;
                    item.url = urlVal;
                    item.title = titleVal;
                    item.desc = descVal;
                }
                alert('작품 정보가 정상적으로 수정되었습니다.');
            }

            saveGalleryDb();
            closeAdminModal();
            renderGallery();
        });
    }

    function deleteArchiveItem(itemId) {
        if (!confirm('정말로 이 작품을 아카이브 갤러리에서 삭제하시겠습니까?')) {
            return;
        }

        const idx = galleryDb.findIndex(item => item.id === itemId);
        if (idx !== -1) {
            galleryDb.splice(idx, 1);
            saveGalleryDb();
            renderGallery();
            alert('작품이 정상적으로 삭제되었습니다.');
        }
    }

    if (btnDeleteImage) {
        btnDeleteImage.addEventListener('click', () => {
            if (editingItemId) {
                deleteArchiveItem(editingItemId);
                closeAdminModal();
            }
        });
    }

    // ==========================================================================
    // 8. B2B 협업 문의 폼 메일 전송 연동 (mailto)
    // ==========================================================================
    const contactForm = document.getElementById('contact-inquiry-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const company = document.getElementById('contact-company').value.trim();
            const contact = document.getElementById('contact-phone').value.trim();
            const schedule = document.getElementById('contact-schedule').value.trim();
            const type = document.getElementById('contact-type').value;
            const message = document.getElementById('contact-message').value.trim();

            if (!company || !contact || !schedule || !type) {
                alert('필수 기입 항목(기관/업체명, 담당자 연락처, 희망 작업 일정/지역, 의뢰 유형)을 모두 채워주세요.');
                return;
            }

            const emailReceiver = 'zzhhee@naver.com';
            const subject = encodeURIComponent(`[로컬 아카이빙 협업 의뢰] ${company} - 담당자 문의`);
            
            let bodyText = `안녕하세요 정지훈 작가님,\n\n포트폴리오를 보고 협업을 의뢰하고자 문의 남깁니다.\n\n`;
            bodyText += `■ 기관/업체명: ${company}\n`;
            bodyText += `■ 담당자 연락처: ${contact}\n`;
            bodyText += `■ 희망 작업 일정 및 지역: ${schedule}\n`;
            
            let typeLabel = '';
            if (type === 'type-a') typeLabel = 'Type A. 로컬 크리에이티브 콘텐츠 패키지';
            else if (type === 'type-b') typeLabel = 'Type B. 고화질 로컬 라이브러리 공급';
            else typeLabel = '기타 비즈니스 협업 문의';
            
            bodyText += `■ 의뢰 유형: ${typeLabel}\n\n`;
            if (message) {
                bodyText += `■ 상세 문의 및 요청 내용:\n${message}\n\n`;
            }
            bodyText += `확인 후 24시간 이내에 제안서와 함께 연락주시기 바랍니다.\n감사합니다.`;

            const body = encodeURIComponent(bodyText);
            const mailtoUrl = `mailto:${emailReceiver}?subject=${subject}&body=${body}`;
            
            // 메일 전송 창 열기
            window.location.href = mailtoUrl;
        });
    }

    // 초기 렌더링 호출
    renderGallery();
});
