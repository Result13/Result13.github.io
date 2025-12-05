/* document.addEventListener('DOMContentLoaded', () => {
  const controller = new ScrollMagic.Controller();
  const wrapper = document.querySelector('.scroll-wrapper');
  const container = document.querySelector('.standartSec');
  const panels = document.querySelectorAll('.screen');

  const percentMove = -100 * (panels.length - 1) / panels.length;

  // Создаём таймлайн вместо простого tween'а для большей контроля
  const timeline = gsap.timeline();
  
  // 0-30% времени: контент не движется (первая секция в центре)
  timeline.to(container, {
    xPercent: 0, 
    ease: 'none',
    duration: 0.3
  }, 0);
  
  // 30-100% времени: контент движется влево
  timeline.to(container, {
    xPercent: percentMove, 
    ease: 'none',
    duration: 0.7
  }, 0.3);

  const scene = new ScrollMagic.Scene({
    triggerElement: wrapper,
    triggerHook: "onLeave",
    duration: "250%"
  })
  .setPin(wrapper)
  .setTween(timeline)
  .addTo(controller);

  let wWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth === wWidth) return;
    wWidth = window.innerWidth;
    controller.update(true);
  });
});
 */

/* document.addEventListener('DOMContentLoaded', () => {
  const controller = new ScrollMagic.Controller();
  const wrapper = document.querySelector('.scroll-wrapper');
  const container = document.querySelector('.standartSec');
  const panels = document.querySelectorAll('.screen'); // Все 3 блока

  const percentMove = -100 * (panels.length - 1) / panels.length;

  const timeline = gsap.timeline();
  
  // 0-30% времени: первая секция активна (opacity 1), остальные прозрачные
  timeline.to(panels[0], { opacity: 1, duration: 0.3 }, 0);  // 1-я видна
  timeline.to(panels[1], { opacity: 0, duration: 0.3 }, 0);  // 2-я скрыта
  timeline.to(panels[2], { opacity: 0, duration: 0.3 }, 0);  // 3-я скрыта
  
  // 30-60%: вторая секция активна
  timeline.to(panels[0], { opacity: 0, duration: 0.3 }, 0.3);
  timeline.to(panels[1], { opacity: 1, duration: 0.3 }, 0.3);
  timeline.to(panels[2], { opacity: 0, duration: 0.3 }, 0.3);
  
  // 60-100%: третья секция активна
  timeline.to(panels[0], { opacity: 0, duration: 0.3 }, 0.6);
  timeline.to(panels[1], { opacity: 0, duration: 0.3 }, 0.6);
  timeline.to(panels[2], { opacity: 1, duration: 0.3 }, 0.6);

  // Движение контейнера (как было)
  timeline.to(container, {
    xPercent: percentMove, 
    ease: 'none',
    duration: 0.7
  }, 0.3);

  const scene = new ScrollMagic.Scene({
    triggerElement: wrapper,
    triggerHook: "onLeave",
    duration: "250%"
  })
  .setPin(wrapper)
  .setTween(timeline)
  .addTo(controller);

  // resize handler...
}); */



//////2


/* document.addEventListener('DOMContentLoaded', () => {
  const controller = new ScrollMagic.Controller();
  const wrapper = document.querySelector('.scroll-wrapper');
  const container = document.querySelector('.standartSec');
  const panels = document.querySelectorAll('.screen'); 
  const arrows = document.querySelector('.standart__arrows'); // <--- Находим стрелки

  const percentMove = -100 * (panels.length - 1) / panels.length;

  const timeline = gsap.timeline({
    defaults: { ease: "none" }
  });
  
  // --- 0-30% ---
  timeline.to(panels[0], { opacity: 1, duration: 0.1 }, 0);
  timeline.to(panels[1], { opacity: 0, duration: 0.1 }, 0);
  timeline.to(panels[2], { opacity: 0, duration: 0.1 }, 0);
  
  // --- 30-60%: Переход ко 2-му экрану ---
  timeline.to(panels[0], { opacity: 0, duration: 0.3 }, 0.3);
  timeline.to(panels[1], { opacity: 1, duration: 0.3 }, 0.3);
  
  // --- 60-100%: Переход к 3-му экрану ---
  // В этот момент (0.6) начинаем скрывать стрелки
  timeline.to(arrows, { autoAlpha: 0, duration: 0.2 }, 0.6); // <--- ДОБАВЛЕНО

  timeline.to(panels[1], { opacity: 0, duration: 0.3 }, 0.6);
  timeline.to(panels[2], { opacity: 1, duration: 0.2 }, 0.6);

  // --- Движение контейнера ---
  timeline.to(container, {
    xPercent: percentMove, 
    duration: 0.7 
  }, 0.3);

  const scene = new ScrollMagic.Scene({
    triggerElement: wrapper,
    triggerHook: "onLeave",
    duration: "250%"
  })
  .setPin(wrapper)
  .setTween(timeline)
  .addTo(controller);

  
});
 */




/////3


document.addEventListener('DOMContentLoaded', () => {

    
  const controller = new ScrollMagic.Controller();
  const wrapper = document.querySelector('.scroll-wrapper');
  const container = document.querySelector('.standartSec');
  const panels = document.querySelectorAll('.screen');
  const arrows = document.querySelector('.standart__arrows');

  // Шаг сдвига (для 3 экранов это 33.33%, 66.66% и т.д.)
  const stepPercent = -100 / panels.length; 

  const timeline = gsap.timeline();

  // --- 1. ПАУЗА НА 1-М ЭКРАНЕ ---
  // Пользователь скроллит, но ничего не происходит (задержка)
  timeline.to({}, { duration: 0.3 });

  // --- 2. ПЕРЕХОД 1 -> 2 ---
  // Теперь начинаем движение
  timeline
    .to(container, { xPercent: stepPercent, ease: 'none', duration: 1 }, 'move1')
    .to(panels[0], { opacity: 0, ease: 'none', duration: 0.5 }, 'move1')      
    .to(panels[1], { opacity: 1, ease: 'none', duration: 0.5 }, 'move1+=0.5'); 

  // --- 3. ПАУЗА НА 2-М ЭКРАНЕ ---
  // Снова даем пользователю почитать второй экран
  timeline.to({}, { duration: 0.3 });

  // --- 4. ПЕРЕХОД 2 -> 3 ---
  timeline
    .to(container, { xPercent: stepPercent * 2, ease: 'none', duration: 1 }, 'move2')
    .to(panels[1], { opacity: 0, ease: 'none', duration: 0.5 }, 'move2')     
    .to(panels[2], { opacity: 1, ease: 'none', duration: 0.5 }, 'move2+=0.5')
    
    // Скрываем стрелки во время перехода к 3 экрану
    .to(arrows, { autoAlpha: 0, duration: 0.3 }, 'move2+=0.2');


  new ScrollMagic.Scene({
    triggerElement: wrapper,
    triggerHook: "onLeave",
    duration: "400%" // Увеличил еще немного, так как добавили паузу в начало
  })
  .setPin(wrapper)
  .setTween(timeline)
  .addTo(controller);
});
