// Ждем загрузки DOM, чтобы переменные не были пустыми
document.addEventListener('DOMContentLoaded', () => {
    const diamonds = document.querySelectorAll('.diamond');
    const scaleSection = document.querySelector('.scale');
    const scaleInteractive = document.querySelector('.scale__interactive');
    const pathShifter = document.querySelector('.scale__path-shifter');
    const titleContainer = document.querySelector('.scale__title');
    const titlePrev = document.querySelector('.scale__title__prev:not(.scale__title__prev_mob)');
    const titleFirst = document.querySelector('.scale__title_first');
    const titleSecond = document.querySelector('.scale__title_second');
    const titlePrevMob = document.querySelector('.scale__title__prev_mob');

    let targetScroll = 0;
    let currentScroll = 0;
    let isNumberAnimated = false;
    let isNumberAnimatedMob = false;

    const TRANSFORM_THRESHOLD = 85;
    const VISIBLE_THRESHOLD = 0.02;
    const SCROLL_DELAY = 150;

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
        if (width >= 1400) return scaleSettings.desktop;
        if (width >= 1200) return scaleSettings.mediumDesktop;
        if (width >= 992) return scaleSettings.miniDesktop;
        if (width >= 769) return scaleSettings.tablet;
        if (width >= 577) return scaleSettings.mobile;
        return scaleSettings.small;
    }

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
    }, { passive: true });

    function update() {
        if (scaleSection && scaleSection.classList.contains('scale_visible')) {
            currentScroll += (targetScroll - currentScroll) * 0.07;
            const settings = getCurrentSettings();
            const isMobileLayout = window.innerWidth <= 992;

            if (scaleInteractive) {
                const blockEndThreshold = 0.9;
                const blockProgress = Math.min(currentScroll / blockEndThreshold, 1);

                if (currentScroll > 0.01) {
                    scaleInteractive.classList.add('is-active');

                    // Текстовая логика
                    const textProgress = Math.min(Math.max((currentScroll - 0.25) / 0.25, 0), 1);
                    const delayProgress = Math.min(Math.max((currentScroll - 0.15) / 0.75, 0), 1);

                    if (titleContainer) {
                        titleContainer.style.width = isMobileLayout ? '100%' : (textProgress > 0.1 ? settings.titleWidth : '50%');
                        titleContainer.style.gap = `${parseFloat(settings.gap) * delayProgress}px`;
                    }

                    if (titlePrev) {
                        titlePrev.style.width = `${settings.prevTargetWidth * delayProgress}px`;
                        titlePrev.style.opacity = delayProgress;
                        titlePrev.style.transform = `translateX(${-50 + (50 * delayProgress)}px)`;
                    }

                    if (titleFirst) titleFirst.style.opacity = 1 - textProgress;
                    if (titleSecond) titleSecond.style.opacity = textProgress;

                    // Скрытие блока
                    if (isMobileLayout) {
                        const fadeOut = Math.min(currentScroll * 8, 1);
                        scaleInteractive.style.opacity = 1 - fadeOut;
                        scaleInteractive.style.maxHeight = `${(1 - fadeOut) * 100}vh`;
                    } else {
                        scaleInteractive.style.opacity = 1 - blockProgress;
                        scaleInteractive.style.maxHeight = blockProgress >= 0.95 ? '0px' : 'none';
                    }
                    scaleInteractive.style.visibility = (parseFloat(scaleInteractive.style.opacity) <= 0.01) ? 'hidden' : 'visible';

                    if (titlePrevMob) {
                        titlePrevMob.style.opacity = blockProgress;
                        titlePrevMob.style.transform = `translateY(${20 - (40 * blockProgress)}px)`;
                    }
                } else {
                    // Сброс
                    scaleInteractive.style.opacity = '1';
                    scaleInteractive.style.maxHeight = 'none';
                    scaleInteractive.style.visibility = 'visible';
                    if (titlePrevMob) titlePrevMob.style.opacity = '0';
                    if (pathShifter) pathShifter.style.opacity = isMobileLayout ? '0' : '1';
                }
            }

            // Ромбы
            diamonds.forEach((diamond, index) => {
                const baseOffset = parseFloat(diamond.getAttribute('data-offset')) || 0;
                let pos = (currentScroll * 100) + baseOffset;
                if (pos > 100) pos = 100;

                // Появление пути по 1-му ромбу
                if (index === 0 && pathShifter && isMobileLayout) {
                    if (pos > 95) {
                        pathShifter.style.opacity = (pos - 95) / 5;
                        pathShifter.style.visibility = 'visible';
                    } else {
                        pathShifter.style.opacity = '0';
                        pathShifter.style.visibility = 'hidden';
                    }
                }

                if (currentScroll > VISIBLE_THRESHOLD) {
                    diamond.classList.add('is-visible');
                } else {
                    diamond.classList.remove('is-visible', 'is-block');
                }

                if (pos > TRANSFORM_THRESHOLD) {
                    diamond.classList.add('is-block');
                    const progress = (pos - TRANSFORM_THRESHOLD) / (100 - TRANSFORM_THRESHOLD);
                    
                    let targetW = 347, startW = 322, targetH = 275, startH = 188;
                    if (window.innerWidth < 375) {
                        targetW = 300; startW = 280; targetH = 238; startH = 160;
                    }

                    diamond.style.width = `${startW + (targetW - startW) * progress}px`;
                    diamond.style.height = `${startH + (targetH - startH) * progress}px`;
                }
                diamond.style.offsetDistance = `${pos}%`;
            });
        }
        requestAnimationFrame(update);
    }
    update();
});