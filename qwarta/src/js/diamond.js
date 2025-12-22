const diamonds = document.querySelectorAll('.diamond');
const scaleSection = document.querySelector('.scale');
const scaleInteractive = document.querySelector('.scale__interactive');
const containerScale = document.querySelector('.container-scale');

let targetScroll = 0;
let currentScroll = 0;

const TRANSFORM_THRESHOLD = 85; // Порог для блока
const VISIBLE_THRESHOLD = 0.02; // Порог появления (2% пути)
const SCROLL_DELAY = 150;
let isNumberAnimated = false; // Контролирует, запустилась ли анимация


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




function update() {
    if (scaleSection && scaleSection.classList.contains('scale_visible')) {
        currentScroll += (targetScroll - currentScroll) * 0.05;

        // --- ВОЗВРАЩЕННЫЙ БЛОК АНИМАЦИИ КОНТЕЙНЕРОВ ---

        if (scaleInteractive) {
            const blockEndThreshold = 0.9;
            const blockProgress = Math.min(currentScroll / blockEndThreshold, 1);

            // --- НАСТРОЙКИ ТАЙМИНГОВ ---
            const delayStart = 0.15; // Задержка для плашки и ширины (примерно 50px скролла)
            const textFastStart = 0.25; // Текст начинает меняться
            const textFastEnd = 0.5;   // Текст заканчивает меняться (быстрее, чем всё остальное)

            // Прогресс для ширины и плашки (начинается позже)
            const delayProgress = Math.min(Math.max((currentScroll - delayStart) / (blockEndThreshold - delayStart), 0), 1);

            // Прогресс для текста (короткий отрезок = высокая скорость)
            const textProgress = Math.min(Math.max((currentScroll - textFastStart) / (textFastEnd - textFastStart), 0), 1);

            const titleContainer = document.querySelector('.scale__title');
            const titlePrev = document.querySelector('.scale__title__prev');
            const titleFirst = document.querySelector('.scale__title_first');
            const titleSecond = document.querySelector('.scale__title_second');

            if (currentScroll > 0.01) {
                scaleInteractive.classList.add('is-active');

                // --- 1. АНИМАЦИЯ КОНТЕЙНЕРА TITLE (с задержкой delayProgress) ---
                if (titleContainer) {
                    // Плавно меняем ширину от 50% до (100% - 377px)
                    const addedWidthPercent = 50 * delayProgress;
                    const subtractedPixels = 377 * delayProgress;
                    titleContainer.style.width = `calc(50% + ${addedWidthPercent}% - ${subtractedPixels}px)`;

                    // Гэп растет от 0 до 75px
                    titleContainer.style.gap = `${75 * delayProgress}px`;
                }

                // --- 2. ПОЯВЛЕНИЕ ПЛАШКИ PREV (с задержкой delayProgress) ---
                if (titlePrev) {
                    titlePrev.style.opacity = delayProgress;
                    const translateX = -100 + (100 * delayProgress);
                    titlePrev.style.transform = `translateX(${translateX}px)`;
                    titlePrev.style.pointerEvents = delayProgress > 0.8 ? 'auto' : 'none';
                    if (delayProgress > 0.1 && !isNumberAnimated) {
                        isNumberAnimated = true;
                        const numbValue = document.querySelector('.scale__title__numb__value');
                        if (numbValue) {
                            animateNumber(numbValue, 0, 500, 1200);
                        }
                    }

                }

                // --- 3. CROSSFADE ЗАГОЛОВКОВ (ускоренный textProgress) ---
                if (titleFirst) {
                    titleFirst.style.opacity = 1 - textProgress;
                }
                if (titleSecond) {
                    titleSecond.style.opacity = textProgress;
                    titleSecond.style.pointerEvents = textProgress > 0.5 ? 'auto' : 'none';
                }

                // --- 4. МАСШТАБ ОСНОВНОГО БЛОКА (постоянный blockProgress) ---
                const currentScale = 1 - (0.5 * blockProgress);
                scaleInteractive.style.zoom = currentScale;
                scaleInteractive.style.opacity = 1 - blockProgress;

                if (blockProgress >= 1) {
                    scaleInteractive.style.visibility = 'hidden';
                } else {
                    scaleInteractive.style.visibility = 'visible';
                }

            } else {
                // СБРОС СОСТОЯНИЙ
                scaleInteractive.classList.remove('is-active');
                if (titleContainer) {
                    titleContainer.style.width = '50%';
                    titleContainer.style.gap = '0px';
                }
                if (titlePrev) {
                    titlePrev.style.opacity = '0';
                    titlePrev.style.transform = 'translateX(-100px)';
                }
                if (titleFirst) titleFirst.style.opacity = '1';
                if (titleSecond) titleSecond.style.opacity = '0';

                scaleInteractive.style.removeProperty('zoom');
                scaleInteractive.style.removeProperty('opacity');
                scaleInteractive.style.removeProperty('visibility');
            }
        }
        // --- БЛОК РОМБОВ (diamonds) ---
        diamonds.forEach((diamond) => {
            const baseOffset = parseFloat(diamond.getAttribute('data-offset')) || 0;
            let pos = (currentScroll * 100) + baseOffset;
            if (pos > 100) pos = 100;

            // ВАЖНО: Сбрасываем стили скрытия от предыдущего кадра, 
            // чтобы логика перекрытия могла рассчитать их заново
            diamond.style.opacity = "";
            diamond.style.visibility = "";

            // Появление ромбов
            if (currentScroll > VISIBLE_THRESHOLD) {
                diamond.classList.add('is-visible');
            } else {
                diamond.classList.remove('is-visible', 'is-block');
                diamond.style.width = '16px';
                diamond.style.height = '16px';
                // Если мы в самом верху, гарантируем сброс
                diamond.style.opacity = "";
                diamond.style.visibility = "";
            }

            // Рост ромбов в блоки
            if (pos > TRANSFORM_THRESHOLD) {
                diamond.classList.add('is-block');
                const range = 100 - TRANSFORM_THRESHOLD;
                const progress = Math.min(Math.max((pos - TRANSFORM_THRESHOLD) / range, 0), 1);

                const currentDiamondW = 322 + (347 - 322) * progress;
                const currentDiamondH = 188 + (275 - 188) * progress;

                diamond.style.width = `${currentDiamondW}px`;
                diamond.style.height = `${currentDiamondH}px`;
            } else if (diamond.classList.contains('is-visible')) {
                diamond.classList.remove('is-block');
                diamond.style.width = '16px';
                diamond.style.height = '16px';
            }

            diamond.style.offsetDistance = `${pos}%`;
        });

        if (containerScale) {
            // Вычисляем прогресс относительно blockEndThreshold (например, 0.9)
            const blockEndThreshold = 0.9;
            const blockProgress = Math.min(currentScroll / blockEndThreshold, 1);

            // Поднимаем на 121px (или больше), используя blockProgress
            // Теперь, когда блок исчезнет, контейнер гарантированно пройдет все 121px
            //containerScale.style.transform = `translateY(${-21 * blockProgress}px)`;
        }
        // ----------------------------------------------

        // 1. Обновление позиций ромбов
        /*      diamonds.forEach((diamond) => {
                    const baseOffset = parseFloat(diamond.getAttribute('data-offset')) || 0;
                    let pos = (currentScroll * 100) + baseOffset;
                    if (pos > 100) pos = 100;
        
                    // Видимость базового ромба
                    if (currentScroll > VISIBLE_THRESHOLD) {
                        diamond.classList.add('is-visible');
                    } else {
                        diamond.classList.remove('is-visible');
                        diamond.classList.remove('is-block');
                        // Сбрасываем инлайновые размеры при исчезновении
                        diamond.style.width = '';
                        diamond.style.height = '';
                    }
        
                    // Логика превращения в блок и его роста
                    if (pos > TRANSFORM_THRESHOLD) {
                        diamond.classList.add('is-block');
        
                        // ВЫЧИСЛЯЕМ РОСТ:
                        // progress будет от 0 (в точке порога) до 1 (в конце пути)
                        const range = 100 - TRANSFORM_THRESHOLD;
                        const progress = (pos - TRANSFORM_THRESHOLD) / range;
                        const clampedProgress = Math.min(Math.max(progress, 0), 1);
        
                        // Интерполяция: Start + (End - Start) * progress
                        const currentW = 322 + (347 - 322) * clampedProgress;
                        const currentH = 188 + (275 - 188) * clampedProgress;
        
                        diamond.style.width = `${currentW}px`;
                        diamond.style.height = `${currentH}px`;
                    } else {
                        diamond.classList.remove('is-block');
                        // Сбрасываем инлайновые размеры, если мы еще не дошли до порога блока
                        if (diamond.classList.contains('is-visible')) {
                            diamond.style.width = ''; // вернется к 16px из CSS
                            diamond.style.height = '';
                        }
                    }
        
                    diamond.style.offsetDistance = `${pos}%`;
        
                    // Сброс инлайновых стилей перед проверкой наложений
                    // ВАЖНО: не сбрасываем width/height здесь, так как мы задали их выше
                    diamond.style.removeProperty('opacity');
                    diamond.style.removeProperty('visibility');
                }); */

        // 2. Логика перекрытия (группировка по координатам)
        const activeBlocks = Array.from(diamonds).filter(d => d.classList.contains('is-block'));
        const groups = [];

        activeBlocks.forEach(block => {
            const rect = block.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            let addedToGroup = false;
            for (let group of groups) {
                const first = group[0].rect;
                // Погрешность увеличена до 15px для более стабильного срабатывания
                if (Math.abs(centerX - first.x) < 15 && Math.abs(centerY - first.y) < 15) {
                    group.push({ el: block, z: parseInt(window.getComputedStyle(block).zIndex) });
                    addedToGroup = true;
                    break;
                }
            }

            if (!addedToGroup) {
                groups.push([{ el: block, rect: { x: centerX, y: centerY }, z: parseInt(window.getComputedStyle(block).zIndex) }]);
            }
        });

        // 3. Скрытие нижних блоков (оставляем только 2 верхних)
        groups.forEach(group => {
            if (group.length >= 3) {
                group.sort((a, b) => a.z - b.z);
                const toHideCount = group.length - 2;

                for (let i = 0; i < toHideCount; i++) {
                    const item = group[i];
                    // Эти стили теперь будут корректно перетираться в начале следующего кадра
                    item.el.style.opacity = "0";
                    item.el.style.visibility = "hidden";
                }
            }
        });
    }
    requestAnimationFrame(update);
}

update();


function animateNumber(el, from = 0, to = 500, duration = 1200) {
  const start = performance.now();
  // Сразу ставим плюс для начального значения
  el.textContent = '+ ' + from; 

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.round(from + (to - from) * progress);
    
    // Добавляем плюс перед числом
    el.textContent = '+ ' + value;

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}
