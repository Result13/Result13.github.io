document.addEventListener('DOMContentLoaded', () => {
  const controller = new ScrollMagic.Controller();
  const wrapper = document.querySelector('.scroll-wrapper');
  const container = document.querySelector('.standartSec');
  const panels = document.querySelectorAll('.screen');

  // Используем xPercent для надежности (как обсуждали ранее)
  const percentMove = -100 * (panels.length - 1) / panels.length;

  const tween = gsap.to(container, {
    xPercent: percentMove, 
    ease: 'none'
  });

  const scene = new ScrollMagic.Scene({
    triggerElement: wrapper,
    triggerHook: "onLeave",
    duration: "200%"
  })
  .setPin(wrapper)
  .setTween(tween)
  .addTo(controller);

  // --- 📱 ФИКС ДЛЯ МОБИЛЬНЫХ ---
  
  // Запоминаем начальную ширину
  let wWidth = window.innerWidth;

  window.addEventListener('resize', () => {
    // Если текущая ширина совпадает с прошлой, значит это
    // просто скачет адресная строка. ИГНОРИРУЕМ это событие.
    if (window.innerWidth === wWidth) {
        return; 
    }
    
    // Если ширина реально изменилась (поворот экрана), обновляем переменную
    wWidth = window.innerWidth;
    // И обновляем сцену
    controller.update(true);
  });
});
