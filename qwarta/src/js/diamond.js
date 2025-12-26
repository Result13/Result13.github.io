const diamonds = document.querySelectorAll('.diamond');
const scaleSection = document.querySelector('.scale');
const scaleInteractive = document.querySelector('.scale__interactive');
const containerScale = document.querySelector('.container-scale');
const pathShifter = document.querySelector('.scale__path-shifter');

let targetScroll = 0;
let currentScroll = 0;
let isNumberAnimated = false;
let isNumberAnimatedMob = false;
let lastScrollUpdate = 0;
let cachedRects = new Map();
let needsCacheUpdate = false;
const mapItems = document.querySelectorAll('.scale__map__item');
const TRANSFORM_THRESHOLD = 85;
const VISIBLE_THRESHOLD = 0.02;
const SCROLL_DELAY = 150;
const SCROLL_THROTTLE = 50; // ms - обновляем только каждые 50ms вместо каждого события

// ============ THROTTLE ДЛЯ SCROLL ============
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ============ OPTIMIZED SCROLL LISTENER ============
const handleScroll = throttle(() => {
    if (!scaleSection) return;
    const rect = scaleSection.getBoundingClientRect();
    const scrolledInside = -rect.top;
    const scrollDuration = (scaleSection.offsetHeight - window.innerHeight) - SCROLL_DELAY;

    let progress = 0;
    if (scrolledInside > SCROLL_DELAY) {
        progress = (scrolledInside - SCROLL_DELAY) / scrollDuration;
    }
    targetScroll = Math.max(0, Math.min(1, progress));
    
    // Отметить, что нужно обновить кеш для большого прыжка
    if (Math.abs(targetScroll - currentScroll) > 0.15) {
        needsCacheUpdate = true;
    }
}, SCROLL_THROTTLE);

window.addEventListener('scroll', handleScroll, { passive: true });

// ============ SCALE SETTINGS ============
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

// ============ BATCH DOM UPDATES ============
function updateScaleInteractive(settings, isMobileLayout, blockProgress, delayProgress, textProgress) {
    if (!scaleInteractive) return;

    const blockEndThreshold = 0.9;
    const titleContainer = document.querySelector('.scale__title');
    const titlePrev = document.querySelector('.scale__title__prev:not(.scale__title__prev_mob)');
    const titleFirst = document.querySelector('.scale__title_first');
    const titleSecond = document.querySelector('.scale__title_second');
    const titlePrevMob = document.querySelector('.scale__title__prev_mob');

    if (currentScroll > 0.01) {
        scaleInteractive.classList.add('is-active');

        // Обновляем всё через cssText чтобы избежать reflows
        if (titleContainer) {
            const width = settings.titleWidth === '100%' ? '100%' : (textProgress > 0.1 ? settings.titleWidth : '50%');
            const gap = `${parseFloat(settings.gap) * delayProgress}px`;
            titleContainer.style.cssText = `width: ${width}; gap: ${gap};`;
        }

        if (titlePrev) {
            const width = `${settings.prevTargetWidth * delayProgress}px`;
            const opacity = delayProgress;
            const transform = `translateX(${-50 + (50 * delayProgress)}px)`;
            titlePrev.style.cssText = `width: ${width}; opacity: ${opacity}; transform: ${transform};`;

            if (delayProgress > 0.1 && !isNumberAnimated) {
                isNumberAnimated = true;
                const numbValue = titlePrev.querySelector('.scale__title__numb__value');
                if (numbValue) animateNumber(numbValue, 0, 500, 1200);
            }
        }

        if (titleFirst) titleFirst.style.opacity = 1 - textProgress;
        if (titleSecond) {
            titleSecond.style.opacity = textProgress;
            titleSecond.style.pointerEvents = textProgress > 0.5 ? 'auto' : 'none';
        }

        if (isMobileLayout) {
            const fadeOut = Math.min(currentScroll * 8, 1);
            scaleInteractive.style.cssText = `opacity: ${1 - fadeOut}; max-height: ${(1 - fadeOut) * 100}vh; overflow: hidden; margin: 0;`;
            if (pathShifter) pathShifter.style.opacity = fadeOut;
        } else {
            scaleInteractive.style.cssText = `zoom: ${1 - (0.5 * blockProgress)}; opacity: ${1 - blockProgress}; max-height: ${blockProgress >= 0.95 ? '0px' : 'none'};`;
            if (pathShifter) pathShifter.style.opacity = '1';
        }
        scaleInteractive.style.visibility = (parseFloat(scaleInteractive.style.opacity) <= 0.01) ? 'hidden' : 'visible';

        if (titlePrevMob) {
            titlePrevMob.style.cssText = `opacity: ${blockProgress}; transform: translateY(${20 - (110 * blockProgress)}px);`;
            if (blockProgress > 0.5 && !isNumberAnimatedMob) {
                isNumberAnimatedMob = true;
                const mobNumbValue = titlePrevMob.querySelector('.scale__title__numb__value');
                if (mobNumbValue) animateNumber(mobNumbValue, 0, 500, 1200);
            }
        }

    } else {
        scaleInteractive.classList.remove('is-active');
        isNumberAnimated = false;
        isNumberAnimatedMob = false;

        const resetStyles = {
            titleContainer: `width: ${settings.titleWidth === '100%' ? '100%' : '50%'}; gap: 0px;`,
            titlePrev: `opacity: 0; width: 0px; transform: translateX(-100px);`,
            titlePrevMob: `opacity: 0; transform: translateY(20px);`,
            scaleInteractive: `opacity: 1; visibility: visible; max-height: none;`
        };

        if (titleContainer) titleContainer.style.cssText = resetStyles.titleContainer;
        if (titlePrev) titlePrev.style.cssText = resetStyles.titlePrev;
        if (titlePrevMob) titlePrevMob.style.cssText = resetStyles.titlePrevMob;
        if (titleFirst) titleFirst.style.opacity = '1';
        if (titleSecond) titleSecond.style.opacity = '0';
        if (pathShifter) pathShifter.style.opacity = isMobileLayout ? '0' : '1';
        scaleInteractive.style.cssText = resetStyles.scaleInteractive;
    }
}

// ============ DIAMONDS RENDERING (OPTIMIZED) ============
function updateDiamonds() {
    const isMobileLayout = window.innerWidth <= 992;
    // Предварительно находим все элементы карты (лучше вынести в глобальные переменные)
    const mapItems = document.querySelectorAll('.scale__map__item');
    
    diamonds.forEach((diamond, index) => {
        const baseOffset = parseFloat(diamond.getAttribute('data-offset')) || 0;
        let pos = (currentScroll * 100) + baseOffset;
        if (pos > 100) pos = 100;

        diamond.style.offsetDistance = `${pos}%`;

        // --- ЛОГИКА КАРТЫ (МАРКЕРОВ) ---
        const currentMapItem = mapItems[index];
        if (currentMapItem) {
            // Перемещаем полоску вслед за ромбом по горизонтали
            currentMapItem.style.left = `${pos}%`;
            
            // Активируем, когда ромб начинает раскрываться
            if (pos > TRANSFORM_THRESHOLD) {
                currentMapItem.classList.add('scale__map__item_active');
            } else {
                currentMapItem.classList.remove('scale__map__item_active');
            }
        }
        // ------------------------------

        if (currentScroll > VISIBLE_THRESHOLD) {
            diamond.classList.add('is-visible');
        } else {
            diamond.classList.remove('is-visible', 'is-block');
            diamond.style.width = '16px';
            diamond.style.height = '16px';
            return;
        }

        if (pos > TRANSFORM_THRESHOLD) {
            diamond.classList.add('is-block');
            const progress = Math.min(Math.max((pos - TRANSFORM_THRESHOLD) / (100 - TRANSFORM_THRESHOLD), 0), 1);

            let targetWidth = 347;
            let startWidth = 322;
            let targetHeight = 275;
            let startHeight = 188;

            if (window.innerWidth < 375) {
                targetWidth = 300;
                startWidth = 280;
                targetHeight = 238;
                startHeight = 160;
            }

            diamond.style.width = `${startWidth + (targetWidth - startWidth) * progress}px`;
            diamond.style.height = `${startHeight + (targetHeight - startHeight) * progress}px`;

        } else if (diamond.classList.contains('is-visible')) {
            diamond.classList.remove('is-block');
            diamond.style.width = '16px';
            diamond.style.height = '16px';
        }
    });
}

// ============ OPTIMIZED DIAMOND OVERLAP LOGIC ============
// Выполняем это реже - только при значительных изменениях
function updateDiamondOverlap() {
    const activeBlocks = Array.from(diamonds).filter(d => d.classList.contains('is-block'));
    
    if (activeBlocks.length < 3) {
        // Если меньше 3 блоков, нет смысла проверять перекрытие
        return;
    }

    // Кешируем значения getBoundingClientRect для избежания повторных вычислений
    const blockData = [];
    activeBlocks.forEach(block => {
        const rect = block.getBoundingClientRect();
        blockData.push({
            el: block,
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2,
            z: parseInt(window.getComputedStyle(block).zIndex) || 0
        });
    });

    const groups = [];
    blockData.forEach(data => {
        let added = false;
        for (let group of groups) {
            const first = group[0];
            if (Math.abs(data.centerX - first.centerX) < 15 && Math.abs(data.centerY - first.centerY) < 15) {
                group.push(data);
                added = true;
                break;
            }
        }
        if (!added) groups.push([data]);
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

// ============ ANIMATION FRAME LOOP ============
let overlapCheckCounter = 0;
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

            updateScaleInteractive(settings, isMobileLayout, blockProgress, delayProgress, textProgress);
        }

        updateDiamonds();

        // Проверяем перекрытие только когда нужно (реже)
        overlapCheckCounter++;
        if (overlapCheckCounter > 5 || needsCacheUpdate) { // Каждый 6-й кадр или при большом скачке
            updateDiamondOverlap();
            overlapCheckCounter = 0;
            needsCacheUpdate = false;
        }
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