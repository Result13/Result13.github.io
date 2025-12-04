const headerBg = document.querySelector('.header__bg');
const header = document.querySelector('.header');


/* const resizeObserver = new ResizeObserver(() => {
  const bgHeight = headerBg.offsetHeight;
  header.style.height = `${bgHeight}px`;
});

resizeObserver.observe(headerBg); */







////

/* let ticking = false;

function updateHeaderHeight() {
  const header = document.querySelector('.header');
  const headerBg = document.querySelector('.header__bg_lap, .header__bg_mb , .header__bg_desc');
  
  if (!header || !headerBg) return;

  // 600ms = длительность анимации + буфер
  setTimeout(() => {
    header.style.height = `${headerBg.offsetHeight}px`;
  }, 600);
}

window.addEventListener('load', updateHeaderHeight);
window.addEventListener('resize', updateHeaderHeight); */

/* window.addEventListener('load', updateHeight); */



////tabs

document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll('.intarface__tab');
  const contents = document.querySelectorAll('.intarface__tab__content');
  let currentIndex = 1;

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', function () {
      const previousIndex = currentIndex;

      contents.forEach((content, i) => {
        content.classList.remove('intarface__tab__content_active', 'exit-left', 'exit-right');

        if (i === index) {

          content.classList.add('intarface__tab__content_active');
        } else {

          if (i < index) {
            content.classList.add('exit-left');
          } else {
            content.classList.add('exit-right');
          }
        }
      });

      tabs.forEach(t => t.classList.remove('intarface__tab_active'));
      this.classList.add('intarface__tab_active');

      currentIndex = index;
    });
  });
});


///
document.addEventListener('DOMContentLoaded', () => {
  const hoverSound = new Audio('./sound/sound.mp3');
  hoverSound.volume = 0.8;

  // Кнопка для разрешения звука
  const enableSoundBtn = document.getElementById('enable-sound-btn');
  if (enableSoundBtn) {
    enableSoundBtn.addEventListener('click', () => {
      hoverSound.play()
        .then(() => {
          hoverSound.pause();
          hoverSound.currentTime = 0;
          enableSoundBtn.style.display = 'none';
          console.log('✅ Звук включён');
        });
    });
  }

  document.querySelectorAll('.promo__btn, .promo__link').forEach(el => {
    el.addEventListener('mouseenter', () => {
      hoverSound.currentTime = 0;
      hoverSound.play().catch(() => {
        // Звук не разрешён
      });
    });
  });
});





const video = document.querySelector('.promo__video');
video.addEventListener('ended', () => {
  video.currentTime = 0;
  video.play();
});


///
document.addEventListener('DOMContentLoaded', () => {
  const sectionsConfig = [
  /*   {
      selector: '.intarface',
      activeClass: 'animate-intarface',
      animateSelector: '.intarface__bottom__item',
      animationDelay: 2000,
      itemDelay: 200
    }, */
/*     {
      selector: '.intarface__bottom__btn',
      activeClass: 'start-btn-animation',
      animateSelector: null, 
      animationDelay: 2000,
      itemDelay: 0
    } */

  ];

  sectionsConfig.forEach(({ selector, activeClass, animateSelector, animationDelay = 0, itemDelay = 0 }) => {
    const elements = document.querySelectorAll(selector);
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {

          entry.target.classList.add(activeClass);
          observer.unobserve(entry.target);
          if (animateSelector) {
            const items = entry.target.querySelectorAll(animateSelector);

            setTimeout(() => {
              items.forEach((item, idx) => {

                setTimeout(() => {
                  item.classList.add('start-animation');
                }, idx * itemDelay);
              });
            }, animationDelay);
          }
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
  });
});




///scroll video
document.addEventListener('DOMContentLoaded', () => {
  
  // ==================== ВИДЕО ZOOM НА СКРОЛЛЕ (ДЛЯ ВСЕХ ВИДЕО) ====================
/*   const videoWrappers = document.querySelectorAll('.promo__video-wrapper');

  if (videoWrappers.length === 0) {
    
    return;
  }

  videoWrappers.forEach(videoWrapper => {
    const video = videoWrapper.querySelector('.promo__video');
    
    if (!video) return;

    video.style.transition = 'transform 0.6s ease-out';
    
    let ticking = false;

    function updateZoom() {
      const rect = videoWrapper.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      console.log('rect.top:', rect.top, 'wrapper:', videoWrapper);

      // ✅ Зум работает, пока видео на странице или выше
      if (rect.bottom > 0) {
        // Видео ещё видимо или прошло выше
        let progress;
        
        if (rect.top <= 0) {
          // Видео выше экрана - полный зум
          progress = Math.min(1, Math.abs(rect.top) / (windowHeight / 2));
        } else if (rect.top >= windowHeight) {
          // Видео ещё не вошло - без зума
          progress = 0;
        } else {
          // Видео на экране - плавный переход
          progress = 1 - (rect.top / windowHeight);
        }

        const scale = 1 + Math.max(0, Math.min(progress, 1)) * 0.5;
        video.style.transform = `scale(${scale})`;
        
        console.log('Progress:', progress, 'Scale:', scale);
      }

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateZoom);
        ticking = true;
      }
    }, { passive: true });

    // ✅ Первый раз вызываем при загрузке
    updateZoom();
  }); */

  const videoWrappers = document.querySelectorAll('.promo__video-wrapper');

  if (videoWrappers.length === 0) {
    return;
  }

  videoWrappers.forEach(videoWrapper => {
    const video = videoWrapper.querySelector('.promo__video');
    
    if (!video) return;

    video.style.transition = 'transform 0.6s ease-out';
    
    let ticking = false;

    function updateZoom() {
      const rect = videoWrapper.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // ✅ Зум работает, пока видео на странице или выше
      if (rect.bottom > 0) {
        let progress = 0;
        
        if (rect.top <= 0) {
          // Видео прошло выше экрана - полный зум
          progress = Math.min(1, Math.abs(rect.top) / (windowHeight / 2));
        } else if (rect.top < windowHeight) {
          // Видео на экране - плавный зум от 0 к 1
          progress = 1 - (rect.top / windowHeight);
        }
        // Если rect.top >= windowHeight (видео ещё не вошло) - progress остается 0

        const scale = 1 + Math.max(0, Math.min(progress, 1)) * 0.5;
        video.style.transform = `scale(${scale})`;
      }

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateZoom);
        ticking = true;
      }
    }, { passive: true });

    // ✅ Первый раз вызываем при загрузке
    updateZoom();
  });





  // ==================== МАГНИТНЫЙ ЭФФЕКТ (ДОСКРОЛЛИВАНИЕ) ====================
// ==================== МАГНИТНЫЙ ЭФФЕКТ (ДОСКРОЛЛИВАНИЕ) ====================
// ==================== МАГНИТНЫЙ ЭФФЕКТ (ДОСКРОЛЛИВАНИЕ) ====================
let isScrolling = false;
let lastScrollTop = 0;
let lastManualScroll = 0;
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset;
  const isScrollingDown = scrollTop > lastScrollTop;
  
  // 🔑 Если пользователь скроллит вручную, сбрасываем флаг
  if (Math.abs(scrollTop - lastManualScroll) > 50) {
    isScrolling = false;
    lastManualScroll = scrollTop;
  }

  if (isScrolling) return;

  lastScrollTop = scrollTop;

  // Находим центральную секцию
  const windowCenter = window.innerHeight / 2;
  let currentIndex = -1;

  for (let i = 0; i < sections.length; i++) {
    const rect = sections[i].getBoundingClientRect();
    if (rect.top <= windowCenter && rect.bottom > windowCenter) {
      currentIndex = i;
      break;
    }
  }

  if (currentIndex === -1) return;

  const section = sections[currentIndex];
  const rect = section.getBoundingClientRect();
  const visibility = ((window.innerHeight - rect.top) / (window.innerHeight + rect.height)) * 100;

  // 🔽 ВНИЗ
  if (isScrollingDown && visibility >= 60 && currentIndex < sections.length - 1) {
    console.log(`✅ Магнит: ${currentIndex} → ${currentIndex + 1}`);
    isScrolling = true;

    window.scrollTo({
      top: sections[currentIndex + 1].offsetTop,
      behavior: 'smooth'
    });

    // 🔑 Разблокируем после плавного скролла + время на реакцию
    setTimeout(() => { 
      isScrolling = false; 
      console.log(`Разблокирован`);
    }, 1800);
  }
}, { passive: true });


/* let isScrolling = false;
let lastScrollTop = 0;
let lastManualScroll = 0;
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset;
  const isScrollingDown = scrollTop > lastScrollTop;
  const isScrollingUp = scrollTop < lastScrollTop;
  
  // Сбрасываем флаг при ручном скролле
  if (Math.abs(scrollTop - lastManualScroll) > 50) {
    isScrolling = false;
    lastManualScroll = scrollTop;
  }

  if (isScrolling) return;

  lastScrollTop = scrollTop;

  // Находим текущую секцию
  const windowCenter = window.innerHeight / 2;
  let currentIndex = -1;

  for (let i = 0; i < sections.length; i++) {
    const rect = sections[i].getBoundingClientRect();
    if (rect.top <= windowCenter && rect.bottom > windowCenter) {
      currentIndex = i;
      break;
    }
  }

  if (currentIndex === -1) return;

  const section = sections[currentIndex];
  const rect = section.getBoundingClientRect();
  const visibility = ((window.innerHeight - rect.top) / (window.innerHeight + rect.height)) * 100;

  console.log(`📍 Секция ${currentIndex}: ${visibility.toFixed(0)}%, скролл: ${isScrollingDown ? '🔽' : isScrollingUp ? '🔼' : '⏸'}`);

  // 🔽 ВНИЗ - переходим если видна на 60%
  if (isScrollingDown && visibility >= 60) {
    if (currentIndex < sections.length - 1) {
      console.log(`🔽 Переход: ${currentIndex} → ${currentIndex + 1}`);
      isScrolling = true;

      window.scrollTo({
        top: sections[currentIndex + 1].offsetTop,
        behavior: 'smooth'
      });

      setTimeout(() => { isScrolling = false; }, 1800);
    }
  }
  
  // 🔼 ВВЕРХ - переходим если видна на 60%
  if (isScrollingUp && visibility >= 60) {
    if (currentIndex > 0) {
      console.log(`🔼 Переход: ${currentIndex} → ${currentIndex - 1}`);
      isScrolling = true;

      window.scrollTo({
        top: sections[currentIndex - 1].offsetTop,
        behavior: 'smooth'
      });

      setTimeout(() => { isScrolling = false; }, 1800);
    }
  }
}, { passive: true }); */



/* let isScrolling = false;
const hasTriggered = new Set();
const sections = document.querySelectorAll('section');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  if (isScrolling) return;

  const scrollTop = window.pageYOffset;
  const isScrollingDown = scrollTop > lastScrollTop;
  lastScrollTop = scrollTop;

  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const visibilityPercent = Math.max(0, Math.min(100, 
      ((windowHeight - rect.top) / (windowHeight + rect.height)) * 100
    ));

    // Сбросить при скролле вверх
    if (!isScrollingDown && hasTriggered.has(index)) {
      hasTriggered.delete(index);
    }

    // Активировать при скролле вниз на 60%
    if (isScrollingDown && visibilityPercent >= 60 && !hasTriggered.has(index)) {
      const nextSection = sections[index + 1];
      if (nextSection) {
        hasTriggered.add(index);
        isScrolling = true;
        
        window.scrollTo({
          top: nextSection.offsetTop,
          behavior: 'smooth'
        });

        setTimeout(() => { isScrolling = false; }, 1500);
      }
    }
  });
}, { passive: true }); */

});


///header
// ==================== BLUR HEADER НА СКРОЛЛ ====================

///
document.addEventListener('DOMContentLoaded', () => {
  // ==================== ФИКСИРУЕМ ВЫСОТУ ЭКРАНА ====================
  function setPromoHeight() {
    const promos = document.querySelectorAll('.promo');
    
    promos.forEach(promo => {
      // ✅ Фиксируем высоту один раз при загрузке
      const height = promo.offsetHeight;
      promo.style.minHeight = `${height}px`;
      promo.style.height = `${height}px`;
    });
  }

  // Вызываем после загрузки всех ресурсов
  setPromoHeight();
  window.addEventListener('load', setPromoHeight);
  window.addEventListener('resize', setPromoHeight);

 
  




/* document.querySelectorAll('.standart__arrow').forEach((arrow, index) => {
    arrow.addEventListener('mouseenter', () => {
        document.querySelectorAll('.standart__arrow').forEach((a, i) => {
            // ✅ Паузируем анимацию вместо остановки
            a.style.animationPlayState = 'paused';
            
            const distance = Math.abs(i - index);
            
            if (i === index) {
                a.style.transform = 'scale(1)';
                a.style.opacity = '1';
            } else if (distance === 1) {
                a.style.transform = 'scale(0.698)';
                a.style.opacity = '0.7';
            } else {
                a.style.transform = 'scale(0.358)';
                a.style.opacity = '0.4';
            }
        });
    });
    
    arrow.addEventListener('mouseleave', () => {
        document.querySelectorAll('.standart__arrow').forEach((a) => {
            // ✅ Возобновляем анимацию
            a.style.animationPlayState = 'running';
            a.style.transform = '';
            a.style.opacity = '';
        });
    });
});
 */

////

/*  const slides = document.querySelectorAll('.standart__first, .standart__second, .standart__third');
    let currentSlide = 0;

    function goToSlide(index) {
        // Убираем активный класс со всех слайдов
        slides.forEach(slide => {
            slide.classList.remove('standart_active');
        });
        
        // Добавляем активный класс нужному слайду
        slides[index].classList.add('standart_active');
        currentSlide = index;
    }

    // Обработчики на стрелки
    document.querySelector('.standart__arrow--3').addEventListener('click', () => goToSlide(0));
    document.querySelector('.standart__arrow--2').addEventListener('click', () => goToSlide(1));
    document.querySelector('.standart__arrow--1').addEventListener('click', () => goToSlide(2));

    // Клавиатурная навигация
    document.addEventListener('keydown', (e) => {
        if (e.key === '3') goToSlide(0);
        if (e.key === '2') goToSlide(1);
        if (e.key === '1') goToSlide(2);
    });

    // Инициализация
    goToSlide(0); */
const slides = document.querySelectorAll('.standart__first, .standart__second, .standart__third');
let currentSlide = 0;
let autoSlideTimer;

function goToSlide(index) {
    slides.forEach(slide => slide.classList.remove('standart_active'));
    slides[index].classList.add('standart_active');
    currentSlide = index;
    resetAutoSlide();
}

function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
}

/* function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(nextSlide, 25000);
}
 */
// События
/* document.querySelector('.standart__arrow--3').addEventListener('click', () => goToSlide(0));
document.querySelector('.standart__arrow--2').addEventListener('click', () => goToSlide(1));
document.querySelector('.standart__arrow--1').addEventListener('click', () => goToSlide(2)); */

/* document.addEventListener('keydown', (e) => {
    const keyMap = { '3': 0, '2': 1, '1': 2 };
    if (keyMap[e.key] !== undefined) goToSlide(keyMap[e.key]);
}); */

// Пауза при наведении
const container = document.querySelector('.standart__container');
container?.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
container?.addEventListener('mouseleave', resetAutoSlide);

// Старт
goToSlide(0);
resetAutoSlide();









  ////
  ///animation

  
});
/* document.addEventListener('DOMContentLoaded', function () {
  const elementsToAnimate = [
    { selector: '.title', visibleClass: 'title_visible', delay: 0 },
    { selector: '.intarface__right__bottom', visibleClass: 'intarface__right__bottom_visible', delay: 0 },
    { selector: '.intarface__subtitle', visibleClass: 'intarface__subtitle_visible', delay: 0 },
    { selector: '.intarfave__tab-text', visibleClass: 'intarfave__tab-text_visible', delay: 0 },
    { selector: '.intarface__text', visibleClass: 'intarface__text_visible', delay: 0 },
    { selector: '.intarface__fade-up', visibleClass: 'intarface__fade-up_visible', delay: 0 },
    { selector: '.intarface__fade-up_second', visibleClass: 'intarface__fade-up_second_visible', delay: 0 },
    { selector: '.intarface__svg-center', visibleClass: 'intarface__svg-center_visible', delay: 0 },
    { selector: '.intarface__svg-up', visibleClass: 'intarface__svg-up_visible', delay: 0 },
    { selector: '.intarface__svg-down', visibleClass: 'intarface__svg-down_visible', delay: 0 },
    { selector: '.intarface__bottom__item', visibleClass: 'intarface__bottom__item_visible', delay: 0 }
  ];

  function checkVisibility() {
    elementsToAnimate.forEach(({ selector, visibleClass, delay }) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        // Пропускаем, если уже добавлен класс
        if (element.classList.contains(visibleClass)) return;

        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
          if (delay) {
            setTimeout(() => element.classList.add(visibleClass), delay);
          } else {
            element.classList.add(visibleClass);
          }
        }
      });
    });
  }

  window.addEventListener('scroll', checkVisibility);
  checkVisibility(); // Проверка при загрузке страницы
});
 */
document.addEventListener('DOMContentLoaded', () => {
  function wrapWordsInSpans(selectors) {
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);

      elements.forEach(el => {
        const text = el.innerText;
        const words = text.split(/(\s+)/);

        const html = words.map((word, index) => {
          // Возвращаем пробелы без спанов
          if (/^\s+$/.test(word)) {
            return word;
          }
          return `<span style="animation-delay:${(index * 0.1).toFixed(1)}s">${word}</span>`;
          
        }).join('');

        el.innerHTML = html;
      });
    });
  }

  wrapWordsInSpans([
    '.promo__subtitle__text_small',
    '.intarface__right__bottom',
    '.intarface__text',
    '.intarface__subtitle',
    '.intarfave__tab-text',
    '.title',
    '.standart__subtitle',
    '.standart__interoco__desc',
    '.title-anim-th'
    
  ]);
});
document.addEventListener('DOMContentLoaded', function () {
  const elementsToAnimate = [
    { selector: '.title', visibleClass: 'title_visible', delay: 0 },
    { selector: '.intarface__right__bottom', visibleClass: 'intarface__right__bottom_visible', delay: 0 },
    { selector: '.intarface__subtitle', visibleClass: 'intarface__subtitle_visible', delay: 0 },
    { selector: '.intarfave__tab-text', visibleClass: 'intarfave__tab-text_visible', delay: 0 },
    { selector: '.intarface__text', visibleClass: 'intarface__text_visible', delay: 0 },
    { selector: '.intarface__fade-up', visibleClass: 'intarface__fade-up_visible', delay: 0 },
    { selector: '.intarface__fade-up_second', visibleClass: 'intarface__fade-up_second_visible', delay: 0 },
    { selector: '.intarface__svg-center', visibleClass: 'intarface__svg-center_visible', delay: 0 },
    { selector: '.intarface__svg-up', visibleClass: 'intarface__svg-up_visible', delay: 0 },
    { selector: '.intarface__svg-down', visibleClass: 'intarface__svg-down_visible', delay: .3 },
    { selector: '.intarface__bottom__btn', visibleClass: 'intarface__bottom__btn_visible', delay: 0 }
  ];

  const bottomItemsSet = new Set(); // Для отслеживания анимированных элементов

  function checkVisibility() {
    elementsToAnimate.forEach(({ selector, visibleClass, delay }) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element.classList.contains(visibleClass)) return;

        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
          if (delay) {
            setTimeout(() => element.classList.add(visibleClass), delay);
          } else {
            element.classList.add(visibleClass);
          }
        }
      });
    });
  }

  function animateBottomItems() {
    const container = document.querySelector('.intarface__bottom');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible) {
      const items = container.querySelectorAll('.intarface__bottom__item');
      items.forEach((item, index) => {
        // Пропускаем, если уже анимирован
        if (bottomItemsSet.has(item)) return;

        setTimeout(() => {
          item.classList.add('intarface__bottom__item_visible');
          bottomItemsSet.add(item); // Отмечаем как анимированный
        }, index * 400); // 200ms между элементами
      });
    }
  }

  window.addEventListener('scroll', () => {
    checkVisibility();
    animateBottomItems();
  });

  checkVisibility();
  animateBottomItems();
});
/* document.addEventListener('DOMContentLoaded', function () {
  const elementsToAnimate = [
    { selector: '.standart.title', visibleClass: 'standart, title_visible', delay: 0 },
    { selector: '.standart__subtitle', visibleClass: 'standart__subtitle_visible', delay: 500 },
    { selector: '.standart__img__men', visibleClass: 'standart__img__men_visible', delay: 1000 },
    { selector: '.standart__interoco', visibleClass: 'standart__interoco_visible', delay: 1200 },
    { selector: '.standart__garmon__block', visibleClass: 'standart__garmon__block_visible', delay: 1200 },

  ];

  const bottomItemsSet = new Set(); // Для отслеживания анимированных элементов

  function checkVisibility() {
    elementsToAnimate.forEach(({ selector, visibleClass, delay }) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element.classList.contains(visibleClass)) return;

        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
          if (delay) {
            setTimeout(() => element.classList.add(visibleClass), delay);
          } else {
            element.classList.add(visibleClass);
          }
        }
      });
    });
  }



  window.addEventListener('scroll', () => {
    checkVisibility();
    animateBottomItems();
  });

  checkVisibility();
  animateBottomItems();
}); */

/* document.addEventListener('DOMContentLoaded', function () {
  const elementsToAnimate = [
    { selector: '.standart__first .title', visibleClass: 'title_visible', delay: 0 },
    { selector: '.standart__first .standart__subtitle', visibleClass: 'standart__subtitle_visible', delay: 500 },
    { selector: '.standart__first .standart__img__men', visibleClass: 'standart__img__men_visible', delay: 1000 },
    { selector: '.standart__first .standart__interoco', visibleClass: 'standart__interoco_visible', delay: 1200 },
    { selector: '.standart__second .title', visibleClass: 'title_visible', delay: 0 },
    { selector: '.standart__second .standart__img__men', visibleClass: 'standart__img__men_visible', delay: 0 },
    { selector: '.standart__second .standart__garmon__block', visibleClass: 'standart__garmon__block_visible', delay: 1000 },
  ];

  const slides = document.querySelectorAll('.standart__first, .standart__second, .standart__third');
  let currentSlide = 0;
  let autoSlideTimer;
  let observerActive = true;

  // Intersection Observer для отслеживания видимости
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    if (!observerActive) return;

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Найти соответствующий элемент в конфигурации
        elementsToAnimate.forEach(({ selector, visibleClass, delay }) => {
          if (entry.target.matches(selector) && !entry.target.classList.contains(visibleClass)) {
            if (delay) {
              setTimeout(() => entry.target.classList.add(visibleClass), delay);
            } else {
              entry.target.classList.add(visibleClass);
            }
          }
        });
      }
    });
  }, observerOptions);

  // Функция для запуска наблюдения за элементами активного слайда
  function observeSlideElements(slideIndex) {
    // Остановить старое наблюдение
    document.querySelectorAll('[data-observed]').forEach(el => {
      observer.unobserve(el);
      el.removeAttribute('data-observed');
    });

    // Получить активный слайд
    const activeSlide = slides[slideIndex];
    
    // Добавить наблюдение за всеми анимируемыми элементами в активном слайде
    elementsToAnimate.forEach(({ selector }) => {
      activeSlide.querySelectorAll(selector).forEach(element => {
        if (!element.hasAttribute('data-observed')) {
          observer.observe(element);
          element.setAttribute('data-observed', 'true');
        }
      });
    });
  }

  function goToSlide(index) {
    slides.forEach(slide => slide.classList.remove('standart_active'));
    slides[index].classList.add('standart_active');
    currentSlide = index;
    
    // Очистить классы анимации в неактивных слайдах
    slides.forEach((slide, i) => {
      if (i !== index) {
        elementsToAnimate.forEach(({ visibleClass }) => {
          slide.querySelectorAll('.' + visibleClass).forEach(el => {
            el.classList.remove(visibleClass);
          });
        });
      }
    });

    // Запустить наблюдение для активного слайда
    observeSlideElements(index);
    resetAutoSlide();
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  /// function resetAutoSlide() {
   // clearInterval(autoSlideTimer);
   // autoSlideTimer = setInterval(nextSlide, 25000);
  //} 

  // События кликов по стрелкам
  document.querySelector('.standart__arrow--3')?.addEventListener('click', () => goToSlide(0));
  document.querySelector('.standart__arrow--2')?.addEventListener('click', () => goToSlide(1));
  document.querySelector('.standart__arrow--1')?.addEventListener('click', () => goToSlide(2));

  // Клавиатурное управление
  document.addEventListener('keydown', (e) => {
    const keyMap = { '3': 0, '2': 1, '1': 2 };
    if (keyMap[e.key] !== undefined) goToSlide(keyMap[e.key]);
  });

  // Пауза при наведении
  const container = document.querySelector('.standart__container');
  container?.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
  container?.addEventListener('mouseleave', resetAutoSlide);

  // Старт
  goToSlide(0);
});
 */
/* document.addEventListener('DOMContentLoaded', function () {
  const elementsToAnimate = [
    { selector: '.standart__first .title-anim-first ', visibleClass: 'title_visible', delay: 0 },
    { selector: '.standart__first .standart__subtitle', visibleClass: 'standart__subtitle_visible', delay: 500 },
    { selector: '.standart__first .standart__img__men', visibleClass: 'standart__img__men_visible', delay: 1000 },
    { selector: '.standart__first .standart__interoco', visibleClass: 'standart__interoco_visible', delay: 1200 },
    { selector: '.standart__second .title-anim-sec', visibleClass: 'title_visible', delay: 200 },
    { selector: '.standart__second .standart__img__men', visibleClass: 'standart__img__men_visible', delay: 0 },
    { selector: '.standart__second .standart__garmon__block', visibleClass: 'standart__garmon__block_visible', delay: 1000 },
    { selector: '.standart__third .standart__img__men', visibleClass: 'standart__img__men_visible', delay: 0 },
     { selector: '.standart__third .standart__wrapper', visibleClass: 'standart__wrapper_visible', delay: 300 },
     { selector: '.standart__third .title-anim-th', visibleClass: 'title_visible', delay: 500 },
       { selector: '.standart__third .standart__natural__item', visibleClass: 'standart__natural__item_visible', delay: 2000 },
       { selector: '.standart__third .standart__btn', visibleClass: 'standart__btn_visible', delay: 3400 },
  ];

  const slides = document.querySelectorAll('.standart__first, .standart__second, .standart__third');
  let currentSlide = 0;
  let autoSlideTimer;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        elementsToAnimate.forEach(({ selector, visibleClass, delay }) => {
          if (entry.target.matches(selector) && !entry.target.classList.contains(visibleClass)) {
            if (delay) {
              setTimeout(() => {
                entry.target.classList.add(visibleClass);
              }, delay);
            } else {
              entry.target.classList.add(visibleClass);
            }
          }
        });
      }
    });
  }, observerOptions);

  function observeSlideElements(slideIndex) {
    document.querySelectorAll('[data-observed]').forEach(el => {
      observer.unobserve(el);
      el.removeAttribute('data-observed');
    });

    const activeSlide = slides[slideIndex];
    
    elementsToAnimate.forEach(({ selector }) => {
      activeSlide.querySelectorAll(selector).forEach(element => {
        if (!element.hasAttribute('data-observed')) {
          observer.observe(element);
          element.setAttribute('data-observed', 'true');
        }
      });
    });
  }

  function resetAnimation(element) {
    // Клонировать элемент для полного сброса анимации
    const clone = element.cloneNode(true);
    element.parentNode.replaceChild(clone, element);
    return clone;
  }

  function goToSlide(index) {
    // Очистить ВСЕ классы анимации ВО ВСЕХ слайдах
    slides.forEach((slide) => {
      elementsToAnimate.forEach(({ visibleClass }) => {
        slide.querySelectorAll('.' + visibleClass).forEach(el => {
          el.classList.remove(visibleClass);
          // Клонируем элемент для полного сброса
          resetAnimation(el);
        });
      });
    });

    // Переключить активный слайд
    slides.forEach(slide => slide.classList.remove('standart_active'));
    slides[index].classList.add('standart_active');
    currentSlide = index;

    // Запустить наблюдение для активного слайда
    setTimeout(() => {
      observeSlideElements(index);
    }, 10);

    resetAutoSlide();
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(nextSlide, 25000);
  }

  document.querySelector('.standart__arrow--3')?.addEventListener('click', () => goToSlide(0));
  document.querySelector('.standart__arrow--2')?.addEventListener('click', () => goToSlide(1));
  document.querySelector('.standart__arrow--1')?.addEventListener('click', () => goToSlide(2));

  document.addEventListener('keydown', (e) => {
    const keyMap = { '3': 0, '2': 1, '1': 2 };
    if (keyMap[e.key] !== undefined) goToSlide(keyMap[e.key]);
  });

  const container = document.querySelector('.standart__container');
  container?.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
  container?.addEventListener('mouseleave', resetAutoSlide);

  goToSlide(0);
}); */

document.addEventListener('DOMContentLoaded', function () {
  const elementsToAnimate = [
    { selector: '.standart__first .title-anim-first ', visibleClass: 'title_visible', delay: 0 },
    { selector: '.standart__first .standart__subtitle', visibleClass: 'standart__subtitle_visible', delay: 500 },
    
    { selector: '.standart__first .standart__interoco', visibleClass: 'standart__interoco_visible', delay: 1200 },
    { selector: '.standart__img_first .standart__img__men', visibleClass: 'standart__img__men_visible', delay: 1000 },
    { selector: '.standart__second .title-anim-sec', visibleClass: 'title_visible', delay: 200 },
    { selector: '.standart__second .standart__img__men', visibleClass: 'standart__img__men_visible', delay: 0 },
    { selector: '.standart__second .standart__garmon__block', visibleClass: 'standart__garmon__block_visible', delay: 1000 },
    { selector: '.standart__third .standart__img__men', visibleClass: 'standart__img__men_visible', delay: 0 },
    { selector: '.standart__third .standart__wrapper', visibleClass: 'standart__wrapper_visible', delay: 300 },
    { selector: '.standart__third .title-anim-th', visibleClass: 'title_visible', delay: 500 },
    { selector: '.standart__third .standart__natural__item', visibleClass: 'standart__natural__item_visible', delay: 2000 },
    { selector: '.standart__third .standart__btn', visibleClass: 'standart__btn_visible', delay: 3400 },
  ];

  const standartSection = document.querySelector('.standart');
  const slides = document.querySelectorAll('.standart__first, .standart__second, .standart__third');
  let currentSlide = 0;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        elementsToAnimate.forEach(({ selector, visibleClass, delay }) => {
          if (entry.target.matches(selector) && !entry.target.classList.contains(visibleClass)) {
            if (delay) {
              setTimeout(() => {
                entry.target.classList.add(visibleClass);
              }, delay);
            } else {
              entry.target.classList.add(visibleClass);
            }
          }
        });
      }
    });
    
  }, observerOptions);

 /*  function observeSlideElements(slideIndex) {
    document.querySelectorAll('[data-observed]').forEach(el => {
      observer.unobserve(el);
      el.removeAttribute('data-observed');
    });

    const activeSlide = slides[slideIndex];
    
    elementsToAnimate.forEach(({ selector }) => {
      activeSlide.querySelectorAll(selector).forEach(element => {
        if (!element.hasAttribute('data-observed')) {
          observer.observe(element);
          element.setAttribute('data-observed', 'true');
        }
      });
    });
  } */
  function observeSlideElements(slideIndex) {
  document.querySelectorAll('[data-observed]').forEach(el => {
    observer.unobserve(el);
    el.removeAttribute('data-observed');
  });

  const activeSlide = slides[slideIndex];
  
  elementsToAnimate.forEach(({ selector }) => {
    activeSlide.querySelectorAll(selector).forEach(element => {
      if (!element.hasAttribute('data-observed')) {
        observer.observe(element);
        element.setAttribute('data-observed', 'true');
      }
    });
  });

  // ← ДОБАВЬ ВОТ ЗДЕСЬ:
  if (slideIndex === 0) {
    const imgFirstElement = document.querySelector('.standart__img_first .standart__img__men');
    if (imgFirstElement && !imgFirstElement.hasAttribute('data-observed')) {
      observer.observe(imgFirstElement);
      imgFirstElement.setAttribute('data-observed', 'true');
    }
  }
}
  function goToSlide(index) {
   /*  slides.forEach((slide) => {
      elementsToAnimate.forEach(({ visibleClass }) => {
        slide.querySelectorAll('.' + visibleClass).forEach(el => {
          el.classList.remove(visibleClass);
        });
      });
    }); */

    slides.forEach(slide => slide.classList.remove('standart_active'));
    slides[index].classList.add('standart_active');
    currentSlide = index;

    observeSlideElements(index);
  }

  // ========== SCROLL-BASED SLIDE CHANGE ==========
  let lastScrollTime = 0;
  let scrollAccumulator = 0;
  const scrollThreshold = 100;
  const scrollDebounce = 1200; // ← Увеличил
  const transitionDelay = 1500; // ← Задержка перед включением скролла
  let isOverSection = false;
  let wasOverSection = false;
  let scrollEnabled = false; // ← Флаг для включения скролла

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    isOverSection = entry.isIntersecting;
    
    if (entry.isIntersecting && !wasOverSection) {
      // КЛЮЧ: Мгновенно показываем первый слайд БЕЗ ЗАДЕРЖКИ
      goToSlide(0);
      
      scrollAccumulator = 0;
      lastScrollTime = Date.now();
      scrollEnabled = false;
      
      setTimeout(() => {
        scrollEnabled = true;
      }, transitionDelay);
    }
    
    wasOverSection = entry.isIntersecting;
  });
}, { threshold: 0.5 });  // ← Измени на 0.1, чтобы срабатывал раньше


sectionObserver.observe(standartSection);


  sectionObserver.observe(standartSection);

/*   window.addEventListener('wheel', (e) => {
    if (!isOverSection || !scrollEnabled) { // ← Проверяем оба флага
      return;
    }

    const now = Date.now();
    if (now - lastScrollTime < scrollDebounce) {
      return;
    }

    scrollAccumulator += Math.abs(e.deltaY);

    if (scrollAccumulator < scrollThreshold) {
      e.preventDefault();
      return;
    }

    scrollAccumulator = 0;
    lastScrollTime = now;

    e.preventDefault();

    if (e.deltaY > 0) {
      if (currentSlide < slides.length - 1) {
        goToSlide(currentSlide + 1);
      }
    } else {
      if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }
    }
  }, { passive: false }); */


// ← ДОБАВЬ: Вычисляем границы секции

/*   window.addEventListener('wheel', (e) => {
  if (!isOverSection || !scrollEnabled) {
    return;
  }

  const now = Date.now();
  if (now - lastScrollTime < scrollDebounce) {
    e.preventDefault();  // ← ДОБАВЬ ЗДЕСЬ
    return;
  }

  scrollAccumulator += Math.abs(e.deltaY);

  if (scrollAccumulator < scrollThreshold) {
    e.preventDefault();
    return;
  }

  scrollAccumulator = 0;
  lastScrollTime = now;

  e.preventDefault();

  if (e.deltaY > 0) {
    if (currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1);
    }
  } else {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }
}, { passive: false });
 */

let touchStartY = 0;
let touchEndY = 0;

// ← TOUCH события для мобильных
document.addEventListener('touchstart', (e) => {
  if (!isOverSection) return;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
  if (!isOverSection || !scrollEnabled) return;
  
  touchEndY = e.touches[0].clientY;
  const diff = touchStartY - touchEndY;

  scrollAccumulator += Math.abs(diff);

  if (scrollAccumulator < scrollThreshold) {
    e.preventDefault();
    return;
  }

  scrollAccumulator = 0;

  // ← Свайп вниз (diff < 0)
  if (diff < 0 && currentSlide < slides.length - 1) {
    e.preventDefault();
    goToSlide(currentSlide + 1);
    touchStartY = touchEndY;
  } 
  // ← Свайп вверх (diff > 0)
  else if (diff > 0 && currentSlide > 0) {
    e.preventDefault();
    goToSlide(currentSlide - 1);
    touchStartY = touchEndY;
  }
}, { passive: false });

// ← WHEEL события для ПК (оставляй старый код)
window.addEventListener('wheel', (e) => {
  if (!isOverSection || !scrollEnabled) {
    return;
  }

  const now = Date.now();
  if (now - lastScrollTime < scrollDebounce) {
    e.preventDefault();
    return;
  }

  scrollAccumulator += Math.abs(e.deltaY);

  if (scrollAccumulator < scrollThreshold) {
    e.preventDefault();
    return;
  }

  scrollAccumulator = 0;
  lastScrollTime = now;

  if (e.deltaY > 0 && currentSlide < slides.length - 1) {
    e.preventDefault();
    goToSlide(currentSlide + 1);
  } else if (e.deltaY < 0 && currentSlide > 0) {
    e.preventDefault();
    goToSlide(currentSlide - 1);
  }
}, { passive: false });


/*   document.addEventListener('keydown', (e) => {
    if (!isOverSection || !scrollEnabled) return;
    
    if (e.key === 'ArrowDown' && currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1);
    } else if (e.key === 'ArrowUp' && currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }); */

/*   document.querySelector('.standart__arrow--3')?.addEventListener('click', () => goToSlide(0));
  document.querySelector('.standart__arrow--2')?.addEventListener('click', () => goToSlide(1));
  document.querySelector('.standart__arrow--1')?.addEventListener('click', () => goToSlide(2)); */

  goToSlide(0);
});






/////
let scrolled = false;
/* window.addEventListener('scroll', () => {
    const header = document.querySelector('.header__bg_mb');
    if (window.scrollY > 100 && !scrolled) {
        header.classList.add('scrolled');
        scrolled = true;
    } else if (window.scrollY <= 100 && scrolled) {
        header.classList.remove('scrolled');
        scrolled = false;
    }
}); */
// Надёжный JS


document.addEventListener('DOMContentLoaded', () => {
    const selectors = ['.header__bg_mb', '.header__bg_lap', '.header__bg_desk'];
    const elements = selectors.map(selector => document.querySelector(selector)).filter(Boolean);

    window.addEventListener('scroll', () => {
        const isAtTop = window.scrollY === 0;
        
        elements.forEach(element => {
            if (isAtTop) {
                element.classList.remove('scrolled');
            } else {
                element.classList.add('scrolled');
            }
        });
    }, { passive: true });
});
/* // Проверь, что элементы найдены
console.log('Elements found:', document.querySelectorAll('.header__bg_mb, .header__bg_lap, .header__bg_desk'));

// Проверь скролл
window.addEventListener('scroll', () => {
    console.log('ScrollY:', window.scrollY, 'Class added:', window.scrollY > 0);
});
 */
// ← Добавь этот код

const standartSection = document.querySelector('.standart');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // ← Когда на секции standart, меняем класс
      header.classList.add('header--on-standart');
    } else {
      // ← Когда уходим, убираем класс
      header.classList.remove('header--on-standart');
    }
  });
}, { threshold: 0.1 });

sectionObserver.observe(standartSection);
