(function () {
    'use strict';

    // Временно true — сразу открывается визитка, без «Начать» и сердца
    const SKIP_INTRO = false;

    const HEART_SVG_PATH = 'M 12 21 C 12 21 2 13 2 7.5 C 2 4.5 4.5 2 7.5 2 C 9.5 2 11 3.5 12 5 C 13 3.5 14.5 2 16.5 2 C 19.5 2 22 4.5 22 7.5 C 22 13 12 21 12 21 Z';

    const introScreen = document.getElementById('intro-screen');
    const heartScreen = document.getElementById('heart-screen');
    const mainContent = document.getElementById('main-content');
    const btnStart = document.getElementById('btn-start');
    const floatingContainer = document.getElementById('floating-hearts');
    const heartCanvas = document.getElementById('heart-canvas');
    const heartCaption = document.querySelector('.heart-caption');

    /* ─── Плавающие сердечки (экран 1) ─── */
    function createFloatingHearts() {
        const count = 18;
        for (let i = 0; i < count; i++) {
            const el = document.createElement('span');
            el.className = 'floating-heart';
            el.textContent = '♥';
            el.style.cssText = `
                left: ${Math.random() * 100}%;
                --size: ${10 + Math.random() * 14}px;
                --duration: ${3 + Math.random() * 4}s;
                --delay: ${Math.random() * 5}s;
                --drift: ${-40 + Math.random() * 80}px;
                --rotate: ${-30 + Math.random() * 60}deg;
                --peak-opacity: ${0.4 + Math.random() * 0.5};
            `;
            floatingContainer.appendChild(el);
        }
    }

    /* ─── Точки по контуру сердца (экран 2) ─── */
    function getHeartContourPoints(count) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', HEART_SVG_PATH);
        svg.appendChild(path);
        document.body.appendChild(svg);

        const totalLength = path.getTotalLength();
        const points = [];

        for (let i = 0; i < count; i++) {
            const pt = path.getPointAtLength((totalLength * i) / count);
            points.push({ x: pt.x, y: pt.y });
        }

        document.body.removeChild(svg);
        return points;
    }

    function shuffleArray(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function buildHeartAnimation() {
        heartCanvas.innerHTML = '';
        const canvasW = heartCanvas.offsetWidth;
        const canvasH = heartCanvas.offsetHeight;
        const scale = Math.min(canvasW, canvasH) / 28;
        const offsetX = (canvasW - 24 * scale) / 2;
        const offsetY = (canvasH - 22 * scale) / 2;

        const rawPoints = getHeartContourPoints(80);
        const shuffled = shuffleArray(rawPoints.map((p, i) => ({ ...p, index: i })));

        shuffled.forEach((pt, order) => {
            const el = document.createElement('span');
            el.className = 'heart-particle';
            el.textContent = '♥';
            const size = 10 + Math.random() * 8;
            const rot = -25 + Math.random() * 50;
            el.style.cssText = `
                left: ${offsetX + pt.x * scale - size / 2}px;
                top: ${offsetY + pt.y * scale - size / 2}px;
                --size: ${size}px;
                --rot: ${rot}deg;
                --delay: ${order * 0.035}s;
                font-size: ${size}px;
            `;
            heartCanvas.appendChild(el);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => el.classList.add('appear'));
            });
        });

        setTimeout(() => heartCaption.classList.add('visible'), 1500);
    }

    /* ─── Переходы между экранами ─── */
    function showScreen(screen) {
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active', 'leaving');
        });
        screen.classList.add('active');
    }

    function hideScreen(screen) {
        screen.classList.add('leaving');
        screen.classList.remove('active');
    }

    function showMainContent() {
        hideScreen(heartScreen);
        setTimeout(() => {
            heartScreen.style.display = 'none';
            introScreen.style.display = 'none';
            mainContent.classList.remove('hidden');
            initSlideDeck();
        }, 800);
    }

    /* ─── Particle heart (слайд 23, из heart.html) ─── */
    function initParticleHeartSlide() {
        const canvas = document.getElementById('particle-heart-canvas');
        const stage = canvas && canvas.closest('.particle-heart-stage');
        if (!canvas || !stage) return null;

        const ctx = canvas.getContext('2d');
        const particles = [];
        const heartPoints = [];
        const particleCount = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches ? 280 : 600;
        let animId = null;
        let assembleTimer = null;
        let phase = 'scatter';
        let size = 0;
        let canvasW = 0;
        let canvasH = 0;

        class Particle {
            constructor(x, y) {
                this.originalX = x;
                this.originalY = y;
                this.x = Math.random() * canvasW;
                this.y = Math.random() * canvasH;
                this.size = Math.random() * 2.5 + 1;
                this.velocityX = 0;
                this.velocityY = 0;
                this.color = `hsl(${340 + Math.random() * 40}, 100%, ${50 + Math.random() * 30}%)`;
                this.pickRandomTarget();
            }

            pickRandomTarget() {
                this.targetX = Math.random() * canvasW;
                this.targetY = Math.random() * canvasH;
            }

            update() {
                const dx = this.targetX - this.x;
                const dy = this.targetY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > 1) {
                    this.velocityX = dx * 0.04;
                    this.velocityY = dy * 0.04;
                } else if (phase === 'scatter') {
                    this.pickRandomTarget();
                } else {
                    this.velocityX = (Math.random() * 2 - 1) * 0.25;
                    this.velocityY = (Math.random() * 2 - 1) * 0.25;
                }

                this.x += this.velocityX;
                this.y += this.velocityY;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            scatter() {
                this.pickRandomTarget();
            }

            assemble() {
                this.targetX = this.originalX;
                this.targetY = this.originalY;
            }
        }

        function isPointInHeart(x, y, centerX, centerY, scale) {
            const rx = (x - centerX) / scale;
            const ry = (centerY - y) / scale;
            const v1 = Math.pow(rx * rx + ry * ry - 1, 3);
            const v2 = rx * rx * Math.pow(ry, 3);
            return v1 - v2 < 0;
        }

        function createHeartPoints() {
            heartPoints.length = 0;
            const centerX = canvasW / 2;
            const centerY = canvasH / 2;
            const scale = size / 20;

            for (let t = 0; t < Math.PI * 2; t += 0.01) {
                const x = 16 * Math.pow(Math.sin(t), 3);
                const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
                heartPoints.push({
                    x: centerX + x * scale,
                    y: centerY - y * scale
                });
            }

            for (let i = 0; i < 200; i++) {
                const randomAngle = Math.random() * Math.PI * 2;
                const randomRadius = Math.random() * size / 3;
                const x = centerX + Math.cos(randomAngle) * randomRadius;
                const y = centerY - Math.sin(randomAngle) * randomRadius;
                if (isPointInHeart(x, y, centerX, centerY, scale)) {
                    heartPoints.push({ x, y });
                }
            }
        }

        function initParticles() {
            createHeartPoints();
            particles.length = 0;

            for (let i = 0; i < particleCount; i++) {
                const point = heartPoints[Math.floor(Math.random() * heartPoints.length)];
                particles.push(new Particle(point.x, point.y));
            }
        }

        function resize() {
            const rect = stage.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvasW = rect.width;
            canvasH = rect.height;
            canvas.width = canvasW * dpr;
            canvas.height = canvasH * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            size = Math.min(canvasW, canvasH) * 0.48;
            initParticles();
        }

        function scheduleAssemble() {
            clearTimeout(assembleTimer);
            assembleTimer = setTimeout(() => {
                phase = 'heart';
                particles.forEach(p => p.assemble());
            }, 1600);
        }

        function animate() {
            ctx.clearRect(0, 0, canvasW, canvasH);
            for (const particle of particles) {
                particle.update();
                particle.draw();
            }
            animId = requestAnimationFrame(animate);
        }

        function start() {
            if (animId) return;
            phase = 'scatter';
            resize();
            scheduleAssemble();
            animate();
        }

        function stop() {
            clearTimeout(assembleTimer);
            if (animId) {
                cancelAnimationFrame(animId);
                animId = null;
            }
        }

        canvas.addEventListener('click', () => {
            if (!particles.length) return;
            if (phase === 'heart') {
                phase = 'scatter';
                particles.forEach(p => p.scatter());
                scheduleAssemble();
            }
        });

        window.addEventListener('resize', () => {
            if (animId) {
                phase = 'scatter';
                resize();
                scheduleAssemble();
            }
        });

        return { start, stop };
    }

    /* ─── Слайды: подъём поверх предыдущего, без скролла ─── */
    function initSlideDeck() {
        const slides = [...mainContent.querySelectorAll('.slide')];
        const dotsContainer = document.getElementById('slide-dots');
        const particleHeart = initParticleHeartSlide();
        const heartSlide = document.getElementById('slide-23');
        const isMobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
        let current = 0;
        let isAnimating = false;
        const TRANSITION_MS = isMobile ? 500 : 750;
        const WHEEL_THRESHOLD = 40;
        const SWIPE_THRESHOLD = 50;

        if (isMobile) document.body.classList.add('is-mobile');

        /* Ленивая загрузка картинок — телефон не тянет 24 слайда сразу */
        slides.forEach((slide, slideIndex) => {
            slide.querySelectorAll('img[src]').forEach(img => {
                if (img.id === 'card-photo') return;
                img.loading = 'lazy';
                img.decoding = 'async';
                if (slideIndex > 1) {
                    img.dataset.lazySrc = img.getAttribute('src');
                    img.removeAttribute('src');
                }
            });
        });

        function syncSlideMedia() {
            slides.forEach((slide, i) => {
                const shouldLoad = Math.abs(i - current) <= 1;
                slide.querySelectorAll('img[data-lazy-src]').forEach(img => {
                    if (shouldLoad) {
                        if (!img.getAttribute('src')) img.src = img.dataset.lazySrc;
                    } else if (img.getAttribute('src')) {
                        img.removeAttribute('src');
                    }
                });
            });
        }

        function setSlideVisibility() {
            slides.forEach((slide, i) => {
                const visible = Math.abs(i - current) <= 1;
                slide.hidden = !visible;
            });
        }

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Слайд ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        });
        const dots = [...dotsContainer.querySelectorAll('.slide-dot')];

        function updateSlides() {
            const topZ = slides.length + 10;

            slides.forEach((slide, i) => {
                slide.classList.remove('active', 'past', 'future');

                if (i < current) {
                    slide.classList.add('past');
                    slide.style.zIndex = String(i + 1);
                } else if (i === current) {
                    slide.classList.add('active');
                    slide.style.zIndex = String(topZ);
                } else {
                    slide.classList.add('future');
                    slide.style.zIndex = String(i + 1);
                }
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === current);
            });

            const hint = slides[0].querySelector('.scroll-hint');
            if (hint) hint.style.opacity = current === 0 ? '1' : '0';

            if (particleHeart) {
                if (heartSlide && heartSlide.classList.contains('active')) {
                    particleHeart.start();
                } else {
                    particleHeart.stop();
                }
            }

            setSlideVisibility();
            syncSlideMedia();
        }

        function goTo(index) {
            if (isAnimating || index === current || index < 0 || index >= slides.length) return;
            isAnimating = true;
            current = index;
            updateSlides();
            setTimeout(() => { isAnimating = false; }, TRANSITION_MS);
        }

        function next() { goTo(current + 1); }
        function prev() { goTo(current - 1); }

        function getScrollableBox(el) {
            const box = el && el.closest('.card, .panel');
            if (!box || box.scrollHeight <= box.clientHeight + 1) return null;
            return box;
        }

        function canNavigateFromBox(box, direction) {
            if (!box) return true;
            const atTop = box.scrollTop <= 0;
            const atBottom = box.scrollTop + box.clientHeight >= box.scrollHeight - 2;
            if (direction > 0) return atBottom;
            if (direction < 0) return atTop;
            return true;
        }

        let wheelLocked = false;
        mainContent.addEventListener('wheel', (e) => {
            const box = getScrollableBox(e.target);
            if (box && !canNavigateFromBox(box, e.deltaY)) return;

            e.preventDefault();
            if (wheelLocked || isAnimating) return;
            if (e.deltaY > WHEEL_THRESHOLD) {
                next();
                wheelLocked = true;
            } else if (e.deltaY < -WHEEL_THRESHOLD) {
                prev();
                wheelLocked = true;
            }
            setTimeout(() => { wheelLocked = false; }, TRANSITION_MS + 150);
        }, { passive: false });

        let touchStartY = 0;
        let touchStartX = 0;
        let touchBox = null;

        mainContent.addEventListener('touchstart', (e) => {
            if (e.target.closest('.accordion-header, [data-fancybox], .fancybox__container')) return;
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            touchBox = getScrollableBox(e.target);
        }, { passive: true });

        mainContent.addEventListener('touchend', (e) => {
            if (e.target.closest('.accordion-header, [data-fancybox], .fancybox__container')) return;
            const dy = touchStartY - e.changedTouches[0].clientY;
            const dx = Math.abs(touchStartX - e.changedTouches[0].clientX);
            if (dx > Math.abs(dy) || Math.abs(dy) < SWIPE_THRESHOLD || isAnimating) return;
            if (!canNavigateFromBox(touchBox, dy)) return;
            if (dy > 0) next();
            else prev();
        }, { passive: true });

        document.addEventListener('keydown', (e) => {
            if (mainContent.classList.contains('hidden')) return;
            if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); next(); }
            if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); prev(); }
        });

        updateSlides();
    }

    /* ─── Аккордеоны ─── */
    function initAccordions() {
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const body = header.nextElementSibling;
                const isOpen = header.getAttribute('aria-expanded') === 'true';

                document.querySelectorAll('.accordion-header').forEach(h => {
                    h.setAttribute('aria-expanded', 'false');
                    h.nextElementSibling.classList.remove('open');
                });

                if (!isOpen) {
                    header.setAttribute('aria-expanded', 'true');
                    body.classList.add('open');
                }
            });
        });
    }

    /* ─── Фото: локальная заглушка без внешних запросов ─── */
    const cardPhoto = document.getElementById('card-photo');
    if (cardPhoto) {
        cardPhoto.addEventListener('error', () => {
            cardPhoto.style.display = 'none';
            cardPhoto.closest('.card-photo-wrap').classList.add('no-photo');
        }, { once: true });
    }

    /* ─── Fancybox: слайд 22 ─── */
    function initFancybox() {
        if (typeof Fancybox === 'undefined') return;
        Fancybox.bind('[data-fancybox="photos-22"]', {
            Carousel: { infinite: true },
            Images: { zoom: true }
        });
    }

    document.body.style.overflow = 'hidden';
    initAccordions();
    initFancybox();

    if (SKIP_INTRO) {
        introScreen.style.display = 'none';
        heartScreen.style.display = 'none';
        mainContent.classList.remove('hidden');
        initSlideDeck();
    } else {
        createFloatingHearts();
        btnStart.addEventListener('click', () => {
            hideScreen(introScreen);
            setTimeout(() => {
                introScreen.style.display = 'none';
                showScreen(heartScreen);
                buildHeartAnimation();
                setTimeout(showMainContent, 5000);
            }, 800);
        });
    }
})();
