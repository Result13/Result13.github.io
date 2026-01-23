document.addEventListener('DOMContentLoaded', function() {
  const modal = document.querySelector('.modal');
  const closeBtn = document.querySelector('.modal__close');
  const promoBtns = document.querySelectorAll('.promo__btn');

  function openModal() {
    modal.classList.add('active');
  }

  function closeModal() {
    modal.classList.remove('active');
  }
  promoBtns.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
});


document.addEventListener('DOMContentLoaded', function() {
  const burger = document.querySelector('.header__burger');
  const mobileMenu = document.querySelector('.header__mobile__menu');
  const wrapper = document.querySelector('.header__mobile__menu__wrapper');

  burger.addEventListener('click', function() {
    burger.classList.toggle('header__burger_active');
    mobileMenu.classList.toggle('active');
  });

  mobileMenu.addEventListener('click', function(e) {
    if (e.target === mobileMenu) {
      burger.classList.remove('header__burger_active');
      mobileMenu.classList.remove('active');
    }
  });

  const links = wrapper.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', function() {
      burger.classList.remove('header__burger_active');
      mobileMenu.classList.remove('active');
    });
  });
});




$(document).ready(function(){
    function initRoadmapSlider() {
        const slider = $('.promo__wrapper');
        
        if ($(window).width() < 768) {
            // Инициализация, если еще не создан
            if (!slider.hasClass('slick-initialized')) {
                slider.slick({
                    centerMode: true,      // Ключевой параметр для центровки
                    centerPadding: '20px', // На сколько выглядывают соседние слайды
                    slidesToShow: 1,
                    infinite: false,
                    dots: false,
                    arrows: true,
                    speed: 300,
                    prevArrow: $('.promo__prev'),
                    nextArrow: $('.promo__next'),
                });
            }
        } else {
            // Разрушаем слайдер на десктопе
            if (slider.hasClass('slick-initialized')) {
                slider.slick('unslick');
            }
        }
    }

    // Запуск при загрузке
    initRoadmapSlider();

    // Запуск при ресайзе
    $(window).on('resize', function() {
        initRoadmapSlider();
    });
});