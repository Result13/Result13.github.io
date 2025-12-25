const diamonds = document.querySelectorAll('.diamond');
const scaleSection = document.querySelector('.scale');
const scaleInteractive = document.querySelector('.scale__interactive');
const containerScale = document.querySelector('.container-scale');
const pathShifter = document.querySelector('.scale__path-shifter'); // Убедитесь, что этот селектор верный

let targetScroll = 0;
let currentScroll = 0;
let isNumberAnimated = false;
let isNumberAnimatedMob = false;

const TRANSFORM_THRESHOLD = 85;
const VISIBLE_THRESHOLD = 0.02;
const SCROLL_DELAY = 150;

window.addEventListener('scroll', () => {
    if (!scaleSection) return;
    const rect = scaleSection.getBoundingClientRect();
    const scrolledInside = -rect.top;
    const scrollDuration = (scaleSection.offsetHeight - window.innerHeight) - SCROLL_DELAY;

    let progress = 0;
    if (scrolledInside > SCROLL_DELAY) {
        progress = (scrolledInside - SCROLL_DELAY) / scrollDuration;
    }
    targetScroll = Math.max(0, Math.min(1, progress));
});

const scaleSettings = {
    desktop: { minWidth: 1400, titleWidth: 'calc(100% - 377px)', gap: '75px', prevTargetWidth: 277 },
    mediumDesktop: { minWidth: 1200, titleWidth: 'calc(100% - 377px)', gap: '40px', prevTargetWidth: 277 },
    miniDesktop: { minWidth: 992, titleWidth: 'calc(100% - 377px)', gap: '10px', prevTargetWidth: 277 },
    tablet: { minWidth: 769, titleWidth: '100%', gap: '10px', prevTargetWidth: 220 },
    mobile: { minWidth: 577, titleWidth: '100%', gap: '20px', prevTargetWidth: 180 },
    small: { minWidth: 0, titleWidth: '100%', gap: '10px', prevTargetWidth: 150 }
};

function getCurrentSettings() {
    const width = window.innerWidth;
    if (width >= scaleSettings.desktop.minWidth) return scaleSettings.desktop;
    if (width >= scaleSettings.mediumDesktop.minWidth) return scaleSettings.mediumDesktop;
    if (width >= scaleSettings.miniDesktop.minWidth) return scaleSettings.miniDesktop;
    if (width >= scaleSettings.tablet.minWidth) return scaleSettings.tablet;
    if (width >= scaleSettings.mobile.minWidth) return scaleSettings.mobile;
    return scaleSettings.small;
}

function update() {
    if (scaleSection && scaleSection.classList.contains('scale_visible')) {
        currentScroll += (targetScroll - currentScroll) * 0.05;
        const settings = getCurrentSettings();
        const isMobileLayout = window.innerWidth <= 992;

        if (scaleInteractive) {
            const blockEndThreshold = 0.9;
            const blockProgress = Math.min(currentScroll / blockEndThreshold, 1);

            const delayStart = 0.15;
            const textFastStart = 0.25;
            const textFastEnd = 0.5;

            const delayProgress = Math.min(Math.max((currentScroll - delayStart) / (blockEndThreshold - delayStart), 0), 1);
            const textProgress = Math.min(Math.max((currentScroll - textFastStart) / (textFastEnd - textFastStart), 0), 1);

            const titleContainer = document.querySelector('.scale__title');
            const titlePrev = document.querySelector('.scale__title__prev:not(.scale__title__prev_mob)');
            const titleFirst = document.querySelector('.scale__title_first');
            const titleSecond = document.querySelector('.scale__title_second');
            const titlePrevMob = document.querySelector('.scale__title__prev_mob');

            if (currentScroll > 0.01) {
                scaleInteractive.classList.add('is-active');

                // 1. КОНТЕЙНЕР TITLE
                if (titleContainer) {
                    titleContainer.style.width = settings.titleWidth === '100%' ? '100%' : (textProgress > 0.1 ? settings.titleWidth : '50%');
                    titleContainer.style.gap = `${parseFloat(settings.gap) * delayProgress}px`;
                }

                // 2. ПЛАШКА PREV (ДЕСКТОП)
                if (titlePrev) {
                    titlePrev.style.width = `${settings.prevTargetWidth * delayProgress}px`;
                    titlePrev.style.opacity = delayProgress;
                    titlePrev.style.transform = `translateX(${-50 + (50 * delayProgress)}px)`;

                    if (delayProgress > 0.1 && !isNumberAnimated) {
                        isNumberAnimated = true;
                        const numbValue = titlePrev.querySelector('.scale__title__numb__value');
                        if (numbValue) animateNumber(numbValue, 0, 500, 1200);
                    }
                }

                // 3. CROSSFADE ЗАГОЛОВКОВ
                if (titleFirst) titleFirst.style.opacity = 1 - textProgress;
                if (titleSecond) {
                    titleSecond.style.opacity = textProgress;
                    titleSecond.style.pointerEvents = textProgress > 0.5 ? 'auto' : 'none';
                }

                // 4. МАСШТАБ, СКРЫТИЕ И ПУТЬ
                if (isMobileLayout) {
                    const fadeOut = Math.min(currentScroll * 8, 1);
                    scaleInteractive.style.opacity = 1 - fadeOut;
                    scaleInteractive.style.maxHeight = `${(1 - fadeOut) * 100}vh`;
                    scaleInteractive.style.overflow = 'hidden';
                    scaleInteractive.style.margin = '0';

                    if (pathShifter) pathShifter.style.opacity = fadeOut;
                } else {
                    scaleInteractive.style.zoom = 1 - (0.5 * blockProgress);
                    scaleInteractive.style.opacity = 1 - blockProgress;
                    scaleInteractive.style.maxHeight = blockProgress >= 0.95 ? '0px' : 'none';
                    if (pathShifter) pathShifter.style.opacity = '1';
                }
                scaleInteractive.style.visibility = (parseFloat(scaleInteractive.style.opacity) <= 0.01) ? 'hidden' : 'visible';

                // 5. МОБИЛЬНАЯ ПЛАШКА
                if (titlePrevMob) {
                    titlePrevMob.style.opacity = blockProgress;
                    titlePrevMob.style.transform = `translateY(${20 - (110 * blockProgress)}px)`;
                    if (blockProgress > 0.5 && !isNumberAnimatedMob) {
                        isNumberAnimatedMob = true;
                        const mobNumbValue = titlePrevMob.querySelector('.scale__title__numb__value');
                        if (mobNumbValue) animateNumber(mobNumbValue, 0, 500, 1200);
                    }
                }

            } else {
                // СБРОС СОСТОЯНИЙ
                scaleInteractive.classList.remove('is-active');
                isNumberAnimated = false;
                isNumberAnimatedMob = false;

                if (titleContainer) {
                    titleContainer.style.width = settings.titleWidth === '100%' ? '100%' : '50%';
                    titleContainer.style.gap = '0px';
                }
                if (titlePrev) {
                    titlePrev.style.opacity = '0';
                    titlePrev.style.width = '0px';
                    titlePrev.style.transform = 'translateX(-100px)';
                }
                if (titlePrevMob) {
                    titlePrevMob.style.opacity = '0';
                    titlePrevMob.style.transform = 'translateY(20px)';
                }
                if (titleFirst) titleFirst.style.opacity = '1';
                if (titleSecond) titleSecond.style.opacity = '0';
                if (pathShifter) pathShifter.style.opacity = isMobileLayout ? '0' : '1';

                scaleInteractive.style.opacity = '1';
                scaleInteractive.style.visibility = 'visible';
                scaleInteractive.style.maxHeight = 'none';
                scaleInteractive.style.removeProperty('zoom');
                scaleInteractive.style.removeProperty('margin');
            }
        }

        // --- БЛОК РОМБОВ ---
        diamonds.forEach((diamond) => {
            const baseOffset = parseFloat(diamond.getAttribute('data-offset')) || 0;
            let pos = (currentScroll * 100) + baseOffset;
            if (pos > 100) pos = 100;

            diamond.style.opacity = "";
            diamond.style.visibility = "";

            if (currentScroll > VISIBLE_THRESHOLD) {
                diamond.classList.add('is-visible');
            } else {
                diamond.classList.remove('is-visible', 'is-block');
                diamond.style.width = '16px';
                diamond.style.height = '16px';
            }

            if (pos > TRANSFORM_THRESHOLD) {
                diamond.classList.add('is-block');
                const progress = Math.min(Math.max((pos - TRANSFORM_THRESHOLD) / (100 - TRANSFORM_THRESHOLD), 0), 1);

                // Определяем целевые размеры в зависимости от ширины экрана
                let targetWidth = 347;
                let startWidth = 322;
                let targetHeight = 275;
                let startHeight = 188;

                if (window.innerWidth < 375) {
                    targetWidth = 300;     // Ширина на экранах < 375
                    startWidth = 280;      // Начальная ширина при трансформации для маленьких экранов
                    targetHeight = 238;    // Пропорционально уменьшенная высота (примерно)
                    startHeight = 160;
                }

                // Применяем расчет с учетом прогресса
                diamond.style.width = `${startWidth + (targetWidth - startWidth) * progress}px`;
                diamond.style.height = `${startHeight + (targetHeight - startHeight) * progress}px`;

            } else if (diamond.classList.contains('is-visible')) {
                diamond.classList.remove('is-block');
                diamond.style.width = '16px';
                diamond.style.height = '16px';
            }
            diamond.style.offsetDistance = `${pos}%`;
        });

        // ЛОГИКА ПЕРЕКРЫТИЯ
        const activeBlocks = Array.from(diamonds).filter(d => d.classList.contains('is-block'));
        const groups = [];
        activeBlocks.forEach(block => {
            const rect = block.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            let added = false;
            for (let group of groups) {
                const first = group[0].rect;
                if (Math.abs(centerX - first.x) < 15 && Math.abs(centerY - first.y) < 15) {
                    group.push({ el: block, z: parseInt(window.getComputedStyle(block).zIndex) });
                    added = true;
                    break;
                }
            }
            if (!added) groups.push([{ el: block, rect: { x: centerX, y: centerY }, z: parseInt(window.getComputedStyle(block).zIndex) }]);
        });

        groups.forEach(group => {
            if (group.length >= 3) {
                group.sort((a, b) => a.z - b.z);
                for (let i = 0; i < group.length - 2; i++) {
                    group[i].el.style.opacity = "0";
                    group[i].el.style.visibility = "hidden";
                }
            }
        });
    }
    requestAnimationFrame(update);
}

function animateNumber(el, from = 0, to = 500, duration = 1200) {
    const start = performance.now();
    function frame(now) {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.round(from + (to - from) * progress);
        el.textContent = '+ ' + value;
        if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

update();