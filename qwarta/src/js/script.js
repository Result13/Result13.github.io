/* const headerBg = document.querySelector('.header__bg');
const header = document.querySelector('.header'); */


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
document.querySelectorAll('.promo__btn, .promo__link').forEach(el => {
  const hoverSound = new Audio('path/to/hover-sound.mp3');
  el.addEventListener('mouseenter', () => {
    hoverSound.currentTime = 0; // чтобы звук играл с начала
    hoverSound.play();
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
