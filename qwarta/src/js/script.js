const headerBg = document.querySelector('.header__bg');
const header = document.querySelector('.header');


/* const resizeObserver = new ResizeObserver(() => {
  const bgHeight = headerBg.offsetHeight;
  header.style.height = `${bgHeight}px`;
});

resizeObserver.observe(headerBg); */


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
    '.intarfave__tab-text'
    
  ]);
});




////

let ticking = false;

function updateHeight() {
  const bgHeight = headerBg.offsetHeight;
  header.style.height = `${bgHeight}px`;
  ticking = false;
}

function onScrollOrResize() {
  if (!ticking) {
    window.requestAnimationFrame(updateHeight);
    ticking = true;
  }
}

window.addEventListener('scroll', onScrollOrResize, { passive: true });
window.addEventListener('resize', onScrollOrResize);
window.addEventListener('load', updateHeight);



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
    {
      selector: '.intarface',
      activeClass: 'animate-intarface',
      animateSelector: '.intarface__bottom__item',
      animationDelay: 2000,
      itemDelay: 200
    },
    {
      selector: '.intarface__bottom__btn',
      activeClass: 'start-btn-animation',
      animateSelector: null, 
      animationDelay: 2000,
      itemDelay: 0
    }

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
    console.error('❌ Видео не найдено');
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
  });




  // ==================== МАГНИТНЫЙ ЭФФЕКТ (ДОСКРОЛЛИВАНИЕ) ====================
// ==================== МАГНИТНЫЙ ЭФФЕКТ (ДОСКРОЛЛИВАНИЕ) ====================
// ==================== МАГНИТНЫЙ ЭФФЕКТ (ДОСКРОЛЛИВАНИЕ) ====================
const sections = document.querySelectorAll('.promo, .intarface');
let isScrolling = false;
let hasTriggered = new Set();

window.addEventListener('scroll', () => {
  if (isScrolling) return;

  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    const visibilityPercent = Math.max(0, Math.min(100, 
      ((windowHeight - rect.top) / (windowHeight + rect.height)) * 100
    ));

    console.log(`Секция ${index}: ${visibilityPercent.toFixed(0)}%`);

    // ✅ Срабатывает ТОЛЬКО при 70% видимости
    if (visibilityPercent >= 80 && !hasTriggered.has(index)) {
      const nextSection = sections[index + 1];
      if (nextSection) {
        console.log(`🎯 Доскролливаем до секции ${index + 1}`);
        hasTriggered.add(index);

        isScrolling = true;
        const targetTop = nextSection.offsetTop;
        
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });

        setTimeout(() => {
          isScrolling = false;
        }, 1500);
      }
    }
  });
}, { passive: true });



});


///header
// ==================== BLUR HEADER НА СКРОЛЛ ====================
/* const headerBg = document.querySelector('.header__bg'); */
const headerBlurGroups = document.querySelectorAll('.header__blur-group');

if (headerBg && headerBlurGroups.length > 0) {
  const headerHeight = headerBg.clientHeight || 71; // высота хедера

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    headerBlurGroups.forEach(group => {
      // ✅ blur включается, когда проскроллили больше высоты хедера
      if (currentScrollY >= headerHeight) {
        // Затемнение + blur
        group.querySelector('rect').setAttribute('fill', 'rgba(28, 55, 89, 0.85)');
      } else {
        // Нет blur
        group.querySelector('rect').setAttribute('fill', 'rgba(0,0,0,0)');
      }
    });
  }, { passive: true });
}


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

  // ... остальной код
});
