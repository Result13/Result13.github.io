document.addEventListener('DOMContentLoaded', () => {
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
