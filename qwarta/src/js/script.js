const headerBg = document.querySelector('.header__bg');
const header = document.querySelector('.header');


const resizeObserver = new ResizeObserver(() => {
  const bgHeight = headerBg.offsetHeight;
  header.style.height = `${bgHeight}px`;
});

resizeObserver.observe(headerBg);


document.addEventListener('DOMContentLoaded', () => {
  function wrapWordsInSpans(selectors) {
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      
      elements.forEach(el => {
        const text = el.innerText;
        const words = text.split(/(\s+)/); 

        const html = words.map((word, index) => {
 
          if (/^\s+$/.test(word)) {
            return word;
          }

          return `<span>${word}</span>`;
        }).join('');
        
        el.innerHTML = html;
      });
    });
  }

  wrapWordsInSpans([
    '.promo__subtitle__text_small',
   
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
