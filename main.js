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
        { id: 'land-1', category: 'landscape', url: 'assets/images/landscape_add1.jpg', title: '(국가유산청 협업) 순천 용두항 갯벌', desc: '갯벌 위에 정박한 고기잡이 배들과 바다 위 인도교가 자아내는 평화로운 어촌 정취.' },
        { id: 'land-2', category: 'landscape', url: 'assets/images/landscape_add2.jpg', title: '무안 황토갯벌랜드 칠면초', desc: '무안 해안가를 온통 붉게 물들인 칠면초의 생명력 넘치는 대자연 풍경.' },
        { id: 'land-3', category: 'landscape', url: 'assets/images/landscape.jpg', title: '해남 산이정원 동백나무', desc: '남도의 계절감과 초록빛 생명력이 가득 내려앉은 정원의 동백나무 정취.' },
        { id: 'land-4', category: 'landscape', url: 'assets/images/landscape_add3.jpg', title: '(국가유산청) 순천갯벌 게', desc: '낙조 빛 아래 순천만 갯벌 위에서 포착한 작은 게의 생동감 넘치는 움직임.' },
        { id: 'land-5', category: 'landscape', url: 'assets/images/landscape_add4.jpg', title: '(국가유산청) 순천보성갯벌 은하수', desc: '순천과 보성을 잇는 밤하늘 아래 광활하게 펼쳐진 은하수와 갯벌의 신비로운 밤 정조.' },
        { id: 'land-6', category: 'landscape', url: 'assets/images/landscape_add5.jpg', title: '(국가유산청) 순천 와온해변', desc: '황금빛 일몰이 내려앉는 순천 와온해변의 나지막한 섬과 넓은 물결 풍경.' },
        { id: 'land-7', category: 'landscape', url: 'assets/images/landscape_add6.jpg', title: '영암 상대포역사공원', desc: '영암 상대포역사공원의 정자와 봄꽃이 물결 위 데칼코마니처럼 반사된 고즈넉한 봄날.' },
        { id: 'land-8', category: 'landscape', url: 'assets/images/landscape_add7.jpg', title: '목포 도시 해무', desc: '아침 해무에 휩싸여 구름 위로 솟구쳐 오른 듯한 목포 도심 건축물들의 신비로운 실루엣.' },
        { id: 'land-9', category: 'landscape', url: 'assets/images/landscape_add8.jpg', title: '해남 산이정원', desc: '해남 산이정원의 광활한 잔디 광장 위로 나뭇가지 사이 쏟아지는 눈부신 아침 햇살과 이국적인 조형물.' },
        { id: 'city-1', category: 'city', url: 'assets/images/city_add1.jpg', title: '성수구름다리 야경', desc: '성수동 구름다리 위에서 포착한 도로 위 차량 불빛 궤적과 도심 야경.' },
        { id: 'city-2', category: 'city', url: 'assets/images/city_add2.jpg', title: '성수구름다리 노을', desc: '황홀한 낙조가 내려앉은 하늘과 한강변 도로가 만드는 주황빛 실루엣.' },
        { id: 'city-3', category: 'city', url: 'assets/images/city.jpg', title: '목포 도심 야경', desc: '유달산 자락에서 내려다본 불 켜진 목포 시가지와 교량의 아름다운 밤 풍경.' },
        { id: 'city-4', category: 'city', url: 'assets/images/city_add3.jpg', title: '목포 원도심 야경', desc: '목포 원도심 너머 목포항 국제여객터미널과 바다의 푸른 밤 정취가 담긴 시가지 풍경.' },
        { id: 'city-5', category: 'city', url: 'assets/images/city_add4.jpg', title: '조선내화 목포공장', desc: '목포의 산업 역사 흔적을 고스란히 담고 있는 조선내화 옛 공장 부지의 낡은 구조물과 녹슨 철골 철길.' },
        { id: 'city-6', category: 'city', url: 'assets/images/city_add5.jpg', title: '목포 근대역사관 1관', desc: '붉은 벽돌의 웅장한 외관이 특징인 목포 근대역사관 1관 전경과 국도 1,2호선 기점 표지석.' },
        { id: 'city-7', category: 'city', url: 'assets/images/city_add6.jpg', title: '서울로7017', desc: '도심 속 공중 정원 서울로 7017 위에서 사색하는 사람과 빌딩숲 사이 멀리 보이는 남산타워.' },
        { id: 'city-8', category: 'city', url: 'assets/images/city_add7.jpg', title: '청계천', desc: '도심 빌딩숲 아래 흐르는 청계천 주변 야외 도서관에 둘러앉아 책을 읽고 사색하는 시민들의 일상.' },
        { id: 'col-1', category: 'collaboration', url: 'assets/images/col_add1.jpg', title: '목포 도시 야경', desc: '목포시 공식 관광 홍보 및 잡지 지면용으로 유달산 조망에서 촬영한 환상적인 골든아워 구도심 전경.' },
        { id: 'col-2', category: 'collaboration', url: 'assets/images/col_add2.jpg', title: '(화순관광 청년PD) 남산공원', desc: '화순관광 청년PD 프로젝트 일환으로 진행된 수국 정원의 생동감 넘치는 여름 풍경 화보.' }
    ];

    const CATEGORY_DISPLAY_NAMES = {
        landscape: 'LANDSCAPE & LOCAL',
        city: 'CITY & ARCHITECTURE',
        collaboration: 'COLLABORATION & DESIGN',
        space: 'SPACE & STAY'
    };

    let galleryDb = [];
    const storageKey = 'jihoon_portfolio_gallery_db_v10'; // 신규 해남 산이정원 사진 갱신을 위해 스토리지 버전을 v10로 승격
    
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

    function renderGallery() {
        if (!galleryGrid) return;
        galleryGrid.innerHTML = '';

        const filteredItems = galleryDb.filter(item => {
            return currentFilter === 'all' ? true : item.category === currentFilter;
        });

        if (filteredItems.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'gallery-empty-state';
            emptyState.innerHTML = `
                <span class="empty-icon">✦</span>
                <h4 class="empty-title">준비 중인 아카이브</h4>
                <p class="empty-desc">해당 카테고리의 프로젝트 화보는 현재 기획 단계에 있습니다. 하단의 협업 문의 양식을 기입해 주시면 관련 제안 자료와 포트폴리오 미디어 키트를 송부해 드리겠습니다.</p>
            `;
            galleryGrid.appendChild(emptyState);
            return;
        }

        filteredItems.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'gallery-grid-item fade-in-up active';
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

            card.addEventListener('click', () => {
                openLightbox(item.id, filteredItems);
            });

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



    // ==========================================================================
    // 8. B2B 협업 문의 폼 Web3Forms API 연동 (자동 메일 전송)
    // ==========================================================================
    const contactForm = document.getElementById('contact-inquiry-form');
    const submitBtn = document.getElementById('btn-submit-contact');
    const feedbackDiv = document.getElementById('form-feedback');

    if (contactForm && submitBtn && feedbackDiv) {
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

            let typeLabel = '';
            if (type === 'type-a') typeLabel = 'Type A. 로컬 크리에이티브 콘텐츠 패키지';
            else if (type === 'type-b') typeLabel = 'Type B. 고화질 로컬 라이브러리 공급';
            else typeLabel = '기타 비즈니스 협업 문의';

            // 로딩 상태 UI 전환
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            submitBtn.textContent = '전송 중';
            feedbackDiv.className = 'form-feedback-message';
            feedbackDiv.style.display = 'none';

            // Web3Forms 전송 데이터 생성
            const payload = {
                access_key: '39687b33-4bb7-45fc-8e6e-ea354d6c19a7',
                subject: `[로컬 아카이빙 협뢰] ${company}`,
                from_name: '포트폴리오 B2B 문의',
                '기관/업체명': company,
                '담당자 연락처': contact,
                '희망 일정 및 지역': schedule,
                '의뢰 유형': typeLabel,
                '상세 의뢰 내용': message || '없음'
            };

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    feedbackDiv.textContent = '✓ 문의가 성공적으로 전송되었습니다. 확인 후 24시간 이내에 제안서와 함께 연락드리겠습니다.';
                    feedbackDiv.classList.add('success');
                    contactForm.reset();
                } else {
                    console.error(response);
                    feedbackDiv.textContent = json.message || '메일 발송 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
                    feedbackDiv.classList.add('error');
                }
            })
            .catch((error) => {
                console.error(error);
                feedbackDiv.textContent = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인하고 다시 시도해 주세요.';
                feedbackDiv.classList.add('error');
            })
            .finally(() => {
                // UI 원복
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                submitBtn.textContent = '협업 문의 메일 보내기';
            });
        });
    }

    // 초기 렌더링 호출
    renderGallery();
});
