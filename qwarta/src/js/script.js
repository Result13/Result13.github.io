const DOM = {
  headerBg: document.querySelector('.header__bg'),
  header: document.querySelector('.header'),
  tabs: document.querySelectorAll('.intarface__tab'),
  contents: document.querySelectorAll('.intarface__tab__content'),
  promo: document.querySelectorAll('.promo'),
  videoWrappers: document.querySelectorAll('.promo__video-wrapper'),
  video: document.querySelector('.promo__video'),
  enableSoundBtn: document.getElementById('enable-sound-btn'),
  standartContainer: document.querySelector('.standart__container'),
  standartSection: document.querySelector('.standartSec'),
  headerBgVariants: document.querySelectorAll('.header__bg_mb, .header__bg_lap, .header__bg_desk'),
  slides: document.querySelectorAll('.standart__first, .standart__second, .standart__third'),
  standartFirstSlides: document.querySelectorAll('.standartSec__first, .standartSec__second, .standartSec__third')
};

// ============================================================================
// 2. УПРАВЛЕНИЕ ТАЙМЕРАМИ
// ============================================================================
const TimerManager = {
  timers: {},

  set(key, callback, delay) {
    this.clear(key);
    this.timers[key] = setTimeout(callback, delay);
    return this.timers[key];
  },

  clear(key) {
    if (this.timers[key]) {
      clearTimeout(this.timers[key]);
      delete this.timers[key];
    }
  },

  clearAll() {
    Object.keys(this.timers).forEach(key => {
      clearTimeout(this.timers[key]);
    });
    this.timers = {};
  }
};

// ============================================================================
// 3. ИНИЦИАЛИЗАЦИЯ
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initSound();
  initVideoLoop();
  initVideoZoom();
  initPromoHeight();
  initSlides();
  initStandartSlides();
  initTextAnimations();
  initElementAnimations();
  initHeaderScroll();
  initStandartSection();
});

// ============================================================================
// 4. ТАБЫ
// ============================================================================
let currentTabIndex = 1;

function initTabs() {
  if (DOM.tabs.length === 0) return;

  DOM.tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(index));
  });
}

function selectTab(index) {
  DOM.contents.forEach((content, i) => {
    content.classList.remove('intarface__tab__content_active', 'exit-left', 'exit-right');

    if (i === index) {
      content.classList.add('intarface__tab__content_active');
    } else {
      content.classList.add(i < index ? 'exit-left' : 'exit-right');
    }
  });

  DOM.tabs.forEach(t => t.classList.remove('intarface__tab_active'));
  DOM.tabs[index].classList.add('intarface__tab_active');

  currentTabIndex = index;
}

// ============================================================================
// 5. ЗВУК
// ============================================================================
let hoverSound = null;
let soundInitialized = false;

function initSound() {
  if (!DOM.enableSoundBtn) return;

  hoverSound = new Audio('./sound/sound.mp3');
  hoverSound.volume = 0.8;

  DOM.enableSoundBtn.addEventListener('click', enableSound, { once: true });

  const buttons = document.querySelectorAll('.promo__btn, .promo__link');
  buttons.forEach(el => {
    el.addEventListener('mouseenter', playHoverSound, { passive: true });
  });
}

function enableSound() {
  hoverSound.play()
    .then(() => {
      hoverSound.pause();
      hoverSound.currentTime = 0;
      soundInitialized = true;
      DOM.enableSoundBtn.style.display = 'none';
      console.log('✅ Звук включён');
    })
    .catch(() => console.log('Звук не разрешён'));
}

function playHoverSound() {
  if (!soundInitialized || !hoverSound) return;

  hoverSound.currentTime = 0;
  hoverSound.play().catch(() => { });
}

// ============================================================================
// 6. ВИДЕО LOOP
// ============================================================================
function initVideoLoop() {
  if (!DOM.video) return;

  DOM.video.addEventListener('ended', () => {
    DOM.video.currentTime = 0;
    DOM.video.play().catch(() => { });
  });
}

// ============================================================================
// 7. ВИДЕО ZOOM НА СКРОЛЛЕ
// ============================================================================
function initVideoZoom() {
  if (DOM.videoWrappers.length === 0) return;

  DOM.videoWrappers.forEach(videoWrapper => {
    const video = videoWrapper.querySelector('.promo__video');
    if (!video) return;

    video.style.transition = 'transform 0.6s ease-out';
    let ticking = false;

    const updateZoom = () => {
      const rect = videoWrapper.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.bottom > 0) {
        let progress = 0;

        if (rect.top <= 0) {
          progress = Math.min(1, Math.abs(rect.top) / (windowHeight / 2));
        } else if (rect.top < windowHeight) {
          progress = 1 - (rect.top / windowHeight);
        }

        const scale = 1 + Math.max(0, Math.min(progress, 1)) * 0.5;
        video.style.transform = `scale(${scale})`;
      }

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateZoom);
        ticking = true;
      }
    }, { passive: true });

    updateZoom();
  });
}

// ============================================================================
// 8. ФИКСИРОВАННАЯ ВЫСОТА PROMO
// ============================================================================
function initPromoHeight() {
  const setPromoHeight = () => {
    DOM.promo.forEach(promo => {
      const height = promo.offsetHeight;
      promo.style.minHeight = `${height}px`;
      promo.style.height = `${height}px`;
    });
  };

  setPromoHeight();
  window.addEventListener('load', setPromoHeight, { once: false });
  window.addEventListener('resize', setPromoHeight, { passive: true });
}

// ============================================================================
// 9. СЛАЙДЕР (простой)
// ============================================================================
const SlideManager = {
  slides: DOM.slides,
  currentSlide: 0,
  autoSlideTimer: null,

  init() {
    if (this.slides.length === 0) return;

    this.goToSlide(0);
    this.startAutoSlide();

    if (DOM.standartContainer) {
      DOM.standartContainer.addEventListener('mouseenter', () => this.pauseAutoSlide());
      DOM.standartContainer.addEventListener('mouseleave', () => this.startAutoSlide());
    }
  },

  goToSlide(index) {
    this.slides.forEach(slide => slide.classList.remove('standart_active'));
    this.slides[index].classList.add('standart_active');
    this.currentSlide = index;
  },

  nextSlide() {
    this.goToSlide((this.currentSlide + 1) % this.slides.length);
  },

  startAutoSlide() {
    if (this.autoSlideTimer) return;

    this.autoSlideTimer = setInterval(() => {
      this.nextSlide();
    }, 5000);
  },

  pauseAutoSlide() {
    if (this.autoSlideTimer) {
      clearInterval(this.autoSlideTimer);
      this.autoSlideTimer = null;
    }
  },

  destroy() {
    this.pauseAutoSlide();
  }
};

function initSlides() {
  SlideManager.init();
}

// ============================================================================
// 10. СЛАЙДЕР СО СЛОЖНОЙ АНИМАЦИЕЙ (standartSec)
// ИСПРАВЛЕННО - ГАРАНТИРУЕТ ДОБАВЛЕНИЕ ВСЕХ КЛАССОВ
// ============================================================================
const StandartSlideManager = {
  slides: DOM.standartFirstSlides,
  currentSlide: 0,
  observer: null,
  activeSlide: null,

  init() {
    if (this.slides.length === 0) return;

    this.setupObserver();
    this.goToSlide(0);
  },

  setupObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.activeSlide = entry.target;
          entry.target.style.zIndex = '9';

          // ДОБАВЛЯЕМ КЛАССЫ ВИДИМОСТИ ВСЕМ ЭЛЕМЕНТАМ
          this.animateAllElements(entry.target);
        } else {
          entry.target.style.zIndex = '';
        }
      });
    }, observerOptions);

    this.slides.forEach(slide => {
      this.observer.observe(slide);
    });
  },

  animateAllElements(slide) {
    // КОНФИГУРАЦИЯ: Селектор класса + задержка
    const animationConfig = [
      { selector: '.title-anim-first', class: 'title_visible', delay: 0 },
      { selector: '.title-anim-sec', class: 'title_visibleSec', delay: 200 },
      { selector: '.title-anim-th', class: 'title_visible', delay: 500 },

      { selector: '.standart__subtitle', class: 'standart__subtitle_visible', delay: 500 },

      { selector: '.standart__interoco', class: 'standart__interoco_visible', delay: 1200 },
      { selector: '.standart__garmon__block', class: 'standart__garmon__block_visible', delay: 1000 },

      { selector: '.standart__img__men', class: 'standart__img__men_visible', delay: 1000 },

      { selector: '.standart__wrapper', class: 'standart__wrapper_visible', delay: 300 },

      { selector: '.standart__natural__item', class: 'standart__natural__item_visible', delay: 2000 },

      { selector: '.standart__btn', class: 'standart__btn_visible', delay: 3400 }
    ];

    // ГАРАНТИРУЕМ: Применяем классы ко всем найденным элементам
    animationConfig.forEach(({ selector, class: className, delay }) => {
      const elements = slide.querySelectorAll(selector);

      elements.forEach((element, index) => {
        // Проверяем, не добавили ли уже этот класс
        if (!element.classList.contains(className)) {
          TimerManager.set(
            `anim-${slide.className}-${selector}-${index}`,
            () => {
              element.classList.add(className);
              console.log(`✅ Добавлен класс ${className} к ${selector}`);
            },
            delay
          );
        }
      });
    });
  },

  goToSlide(index) {
    this.slides.forEach(slide => slide.classList.remove('standart_active'));
    this.slides[index].classList.add('standart_active');
    this.currentSlide = index;
  },

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
};

function initStandartSlides() {
  StandartSlideManager.init();
}

// ============================================================================
// 11. АНИМАЦИЯ ТЕКСТА - Оборачиваем слова в SPAN
// ============================================================================
function initTextAnimations() {
  const selectors = [
    '.promo__subtitle__text_small',
    '.intarface__right__bottom',
    '.intarface__text',
    '.intarface__subtitle',
    '.intarfave__tab-text',
    '.title',
    '.standart__subtitle',
    '.standart__interoco__desc',
    '.title-anim-th',
    '.title-scale',
    '.power__bottom__img__text'
  ];

  selectors.forEach(selector => {
    wrapWordsInSpans(selector);
  });
}

function wrapWordsInSpans(selector) {
  const elements = document.querySelectorAll(selector);

  elements.forEach(el => {
    const text = el.innerText;
    const words = text.split(/(\s+)/);

    const html = words.map((word, index) => {
      if (/^\s+$/.test(word)) {
        return word;
      }
      return `<span style="animation-delay:${(index * 0.1).toFixed(1)}s">${word}</span>`;
    }).join('');

    el.innerHTML = html;
  });
}

// ============================================================================
// 12. ЭЛЕМЕНТЫ, ВИДИМЫЕ ПРИ СКРОЛЛЕ - ЕДИНЫЙ OBSERVER
// ============================================================================
function animateNumber(el, from = 0, to = 300, duration = 1200) {
  const start = performance.now();
  el.textContent = from + '%'; // стартовое значение

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.round(from + (to - from) * progress);
    el.textContent = value + '%';

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}


const VisibilityManager = {
  observer: null,

  init() {
    const options = { threshold: 0.1 };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
        }
      });
    }, options);

    this.observeElements();
  },

  observeElements() {
    const elementsConfig = [
      { selector: '.title-anim', visibleClass: 'title_visible' },
      { selector: '.title-power', visibleClass: 'title_visible' },

      { selector: '.intarface__right__bottom', visibleClass: 'intarface__right__bottom_visible' },
      { selector: '.intarface__subtitle', visibleClass: 'intarface__subtitle_visible' },
      { selector: '.intarfave__tab-text', visibleClass: 'intarfave__tab-text_visible' },
      { selector: '.intarface__text', visibleClass: 'intarface__text_visible' },
      { selector: '.intarface__fade-up', visibleClass: 'intarface__fade-up_visible' },
      { selector: '.intarface__fade-up_second', visibleClass: 'intarface__fade-up_second_visible' },
      { selector: '.intarface__svg-center', visibleClass: 'intarface__svg-center_visible' },
      { selector: '.intarface__svg-up', visibleClass: 'intarface__svg-up_visible' },
      { selector: '.intarface__svg-down', visibleClass: 'intarface__svg-down_visible' },
      { selector: '.intarface__bottom__btn', visibleClass: 'intarface__bottom__btn_visible' },
      { selector: '.intarface__bottom__item', visibleClass: 'intarface__bottom__item_visible' },
      { selector: '.intarface__tab', visibleClass: 'intarface__tab_visible' },
      { selector: '.power__block_grey', visibleClass: 'power__block_grey_visible' },
      { selector: '.power__block_blue', visibleClass: 'power__block_blue_visible' },
      { selector: '.power__right', visibleClass: 'power__right_visible' },
      { selector: '.power__graph', visibleClass: 'power__graph_visible' },
      { selector: '.power__bottom__btn', visibleClass: 'power__bottom__btn_visible' },
      { selector: '.intarface__right__name', visibleClass: 'intarface__right__name_visible' },
      { selector: '.intarface__right__perc', visibleClass: 'intarface__right__perc_visible' },
      { selector: '.scale__interactive', visibleClass: 'scale__interactive_visible' },
      { selector: '.power__desc__title', visibleClass: 'power__desc__title_visible' },
      { selector: '.power__text', visibleClass: 'power__text_visible' },
      { selector: '.power__right__central', visibleClass: 'power__right__central_visible' },
      { selector: '.power__bottom__img-ai', visibleClass: 'power__bottom__img-ai_visible' },
      { selector: '.power__bottom__img__text', visibleClass: 'power__bottom__img__text_visible' },
      { selector: '.power__bottom__img__wave', visibleClass: 'power__bottom__img__wave_visible' },
      { selector: '.power__bottom__value__profile', visibleClass: 'power__bottom__value__profile_visible' },
      { selector: '.power__bottom__long-wave', visibleClass: 'power__bottom__long-wave_visible' },
      { selector: '.power__bottom__card', visibleClass: 'power__bottom__card_visible' },
      { selector: '.power__right__line', visibleClass: 'power__right__line_visible' },
      { selector: '.power__right__people', visibleClass: 'power__right__people_visible' },
      { selector: '.power__right-graph', visibleClass: 'power__right-graph_visible' },
      { selector: '.power__right__lines', visibleClass: 'power__right__lines_visible' },
      { selector: '.power__bottom__first-btn', visibleClass: 'power__bottom__first-btn_visible' },
      { selector: '.power__right__central__line', visibleClass: 'power__right__central__line_visible' },
     { selector: '.power__right__second', visibleClass: 'power__right__second_visible' },
     { selector: '.scale', visibleClass: 'scale_visible' },
     { selector: '.scale__interactive', visibleClass: 'scale__interactive_visible' },
     { selector: '.title-scale', visibleClass: 'title-scale_visible' },
     { selector: '.scale__subtitle', visibleClass: 'scale__subtitle_visible' }
    ];

    elementsConfig.forEach(({ selector, visibleClass }) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (this.observer) {
          el.dataset.visibleClass = visibleClass;
          this.observer.observe(el);
        }
      });
    });
  },

  /* animateElement(element) {
    const visibleClass = element.dataset.visibleClass;
    if (visibleClass && !element.classList.contains(visibleClass)) {
      element.classList.add(visibleClass);

      if (visibleClass === 'intarface__right__perc_visible') {
        // задержка 2.2 секунды перед числовой анимацией
        setTimeout(() => {
          animateNumber(element, 0, 300, 1200);
        }, 2200);
      }
      if (visibleClass === 'power__bottom__value__profile_visible') {
        const waveElement = document.querySelector('.power__bottom__img__wave');
        if (waveElement) {
          element.addEventListener('animationend', function handler() {
            // Убираем visible и добавляем fadeout
            waveElement.classList.remove('power__bottom__img__wave_visible');
            waveElement.classList.add('power__bottom__img__wave_fadeout');

            // Удаляем слушатель после срабатывания
            element.removeEventListener('animationend', handler);
          }, { once: true });
        }
      }
      if (visibleClass === 'power__bottom__value__profile_visible') {
        const backElement = document.querySelector('.power__bottom__value__back');
        if (backElement) {
          backElement.classList.add('power__bottom__value__back_visible');
        }
      }
      setTimeout(() => {
        document.querySelector('.power__bottom__value__back').classList.add('exit');
      }, 5000); // 5 сек после появления


      this.observer.unobserve(element);
    }
  } */
  animateElement(element) {
    const visibleClass = element.dataset.visibleClass;
    if (visibleClass && !element.classList.contains(visibleClass)) {
      element.classList.add(visibleClass);

      if (visibleClass === 'intarface__right__perc_visible') {
        setTimeout(() => {
          animateNumber(element, 0, 300, 1200);
        }, 2200);
      }
      if (visibleClass === 'power__bottom__card_visible') {
        setTimeout(() => {
          const cardFlip = element.querySelector('.power__bottom__card__img-flip');
          const text1 = element.querySelector('.power__bottom__card__text_1');
          const text2 = element.querySelector('.power__bottom__card__text_2');

          // Переворот картинок
          cardFlip.classList.add('flipped');

          // Анимация текста
          text1.classList.add('fade-out');
          text2.classList.add('fade-in');
        }, 5000); // 5 секунд ожидания
      }

      if (visibleClass === 'power__right__central_visible') {
        // Через 13 секунд добавляем класс exit
        setTimeout(() => {
          element.classList.add('power__right__central_exit');
        }, 13000); // 13 секунд
      }
       if (visibleClass === 'power__right__central__line_visible') {
        // Через 13 секунд добавляем класс exit
        setTimeout(() => {
          element.classList.add('power__right__central_exit');
        }, 13000); // 13 секунд
      }
  

      if (visibleClass === 'power__bottom__value__profile_visible') {
        // 1. Синхронизация wave с окончанием profile
        const waveElement = document.querySelector('.power__bottom__img__wave');
        if (waveElement) {
          element.addEventListener('animationend', function handler() {
            waveElement.classList.remove('power__bottom__img__wave_visible');
            waveElement.classList.add('power__bottom__img__wave_fadeout');
            element.removeEventListener('animationend', handler);
          }, { once: true });
        }

        // 2. Добавляем back элемент
        const backElement = document.querySelector('.power__bottom__value__back');
        if (backElement) {
          backElement.classList.add('power__bottom__value__back_visible');

          // 3. Слушатель на ::after анимацию (через родителя back__item)
          const backItem = backElement.querySelector('.power__bottom__value__back__item');
          if (backItem) {
            backItem.addEventListener('animationend', function handler(e) {
              if (e.animationName === 'backFlip') {
                // Через 2 секунды после окончания borderRotate
                setTimeout(() => {
                  // Исчезает изображение
                  const imgElement = document.querySelector('.power__bottom__value__profile__img');
                  if (imgElement) {
                    imgElement.style.opacity = '0';
                    imgElement.style.animation = 'fadeOut 1s ease-in forwards';
                  }

                  // Откатываем profile назад
                  setTimeout(() => {
                    const imgElement = document.querySelector('.power__bottom__value__profile__img');
                    if (imgElement) {
                      imgElement.style.animation = 'fadeOut 1s ease-in forwards';
                    }

                    setTimeout(() => {
                      // Установите текущее состояние element в начало resetProfile
                      element.style.animation = 'none'; // Отключите profileSequence
                      backElement.classList.add('power__bottom__value__back_exit');
                      // Даёте браузеру время обновить стили
                      requestAnimationFrame(() => {
                        element.style.animation = 'resetProfile 2s ease-in forwards';
                      });

                      backElement.classList.remove('power__bottom__value__back_visible');
                    }, 400);
                  }, 2000);


                }, 2000);
              }
            }, { once: true });
          }
        }
      }

      this.observer.unobserve(element);
    }
  }

  ,

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
};


function initElementAnimations() {
  VisibilityManager.init();
}


// ============================================================================
// 13. HEADER - Blur НА СКРОЛЛЕ
// ============================================================================
function initHeaderScroll() {
  window.addEventListener('scroll', () => {
    const isAtTop = window.scrollY === 0;

    DOM.headerBgVariants.forEach(element => {
      if (isAtTop) {
        element.classList.remove('scrolled');
      } else {
        element.classList.add('scrolled');
      }
    });
  }, { passive: true });
}

// ============================================================================
// 14. HEADER - СМЕНА КЛАССА НА STANDART СЕКЦИИ
// ============================================================================
function initStandartSection() {
  if (!DOM.standartSection || !DOM.header) return;

  const options = { threshold: 0.1 };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        DOM.header.classList.add('header--on-standart');
      } else {
        DOM.header.classList.remove('header--on-standart');
      }
    });
  }, options);

  sectionObserver.observe(DOM.standartSection);
}

// ============================================================================
// 15. ОЧИСТКА (для SPA)
// ============================================================================
function cleanupAll() {
  TimerManager.clearAll();
  SlideManager.destroy();
  StandartSlideManager.destroy();
  VisibilityManager.destroy();
  console.log('✅ Все ресурсы очищены');
}

// ============================================================================
// ОТЛАДКА - ФУНКЦИИ ПРОВЕРКИ
// ============================================================================
function debugAnimationClasses() {
  console.log('=== ПРОВЕРКА КЛАССОВ ВИДИМОСТИ ===');

  const checkSelectors = [
    '.standart__natural__item',
    '.standart__garmon__block',
    '.standart__btn',
    '.standart__img__men',
    '.standart__wrapper',
    '.standart__subtitle'
  ];

  checkSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    console.log(`${selector}: найдено ${elements.length} элементов`);

    elements.forEach((el, index) => {
      const hasClass = el.className;
      console.log(`  [${index}] классы: ${hasClass}`);
    });
  });
}

// ============================================================================
// ЭКСПОРТИРУЕМ ГЛОБАЛЬНО
// ============================================================================
window.AppManager = {
  cleanup: cleanupAll,
  timerManager: TimerManager,
  slideManager: SlideManager,
  standartSlideManager: StandartSlideManager,
  visibilityManager: VisibilityManager,
  debug: debugAnimationClasses
};
