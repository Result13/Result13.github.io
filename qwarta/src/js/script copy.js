const headerBg = document.querySelector('.header__bg');
const header = document.querySelector('.header');

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
/* let isScrolling = false;
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
if (document.body.classList.contains('scroll-magic-active')) {
    lastScrollTop = scrollTop; // Обновляем позицию, чтобы не дергало потом
    return; // Выходим, не даем магниту сработать
}
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
 */








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


document.addEventListener('DOMContentLoaded', function () {
  const elementsToAnimate = [
    { selector: '.standartSec__first .title-anim-first', visibleClass: 'title_visible', delay: 0 },
    { selector: '.standartSec__first .standart__subtitle', visibleClass: 'standart__subtitle_visible', delay: 500 },
    { selector: '.standartSec__first .standart__interoco', visibleClass: 'standart__interoco_visible', delay: 1200 },
    { selector: '.standartSec__first .standart__img__men', visibleClass: 'standart__img__men_visible', delay: 1000 },
    
    { selector: '.standartSec__second .title-anim-sec', visibleClass: 'title_visibleSec', delay: 200 },
    { selector: '.standartSec__second .standart__img__men', visibleClass: 'standart__img__men_visible', delay: 0 },
    { selector: '.standartSec__second .standart__garmon__block', visibleClass: 'standart__garmon__block_visible', delay: 1000 },
    
    { selector: '.standartSec__third .standart__img__men', visibleClass: 'standart__img__men_visible', delay: 0 },
    { selector: '.standartSec__third .standart__wrapper', visibleClass: 'standart__wrapper_visible', delay: 300 },
    { selector: '.standartSec__third .title-anim-th', visibleClass: 'title_visible', delay: 500 },
    { selector: '.standartSec__third .standart__natural__item', visibleClass: 'standart__natural__item_visible', delay: 2000 },
    { selector: '.standartSec__third .standart__btn', visibleClass: 'standart__btn_visible', delay: 3400 },
  ];

  const slides = document.querySelectorAll('.standartSec__first, .standartSec__second, .standartSec__third');
  let currentSlide = 0;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
  };

  // ← ГЛАВНЫЙ OBSERVER: Наблюдает за слайдами
  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // ← Когда слайд видна - добавляй классы всем элементам внутри
        elementsToAnimate.forEach(({ selector, visibleClass, delay }) => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            // Проверяем, находится ли элемент внутри видимого слайда
            if (entry.target.contains(element) && !element.classList.contains(visibleClass)) {
              setTimeout(() => {
                element.classList.add(visibleClass);
              }, delay);
            }
          });
        });
      } else {
        // ← Когда слайд не видна - убираем классы
        elementsToAnimate.forEach(({ selector, visibleClass }) => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            if (entry.target.contains(element)) {
              element.classList.remove(visibleClass);
            }
          });
        });
      }
    });
  }, observerOptions);

  // ← Наблюдаем за каждым слайдом
  slides.forEach(slide => {
    slideObserver.observe(slide);
  });

  function goToSlide(index) {
    slides.forEach(slide => slide.classList.remove('standart_active'));
    slides[index].classList.add('standart_active');
    currentSlide = index;
  }

  // Инициализация
  
  goToSlide(0);
});


document.addEventListener('DOMContentLoaded', function () {
  const slides = document.querySelectorAll('.standartSec__first, .standartSec__second, .standartSec__third');
  
  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // ← Убираем z-index у всех
        slides.forEach(slide => {
          slide.style.zIndex = '';
        });
        // ← Добавляем z-index активному слайду
        entry.target.style.zIndex = '9';
      }
    });
  }, { threshold: 0.5 });

  slides.forEach(slide => {
    slideObserver.observe(slide);
  });
});




/////
let scrolled = false;



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


const standartSection = document.querySelector('.standartSec');

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
