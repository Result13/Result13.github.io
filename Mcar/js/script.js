/* document.addEventListener("DOMContentLoaded", () => {
  const burgerMenu = document.querySelector(".burger-menu");
  const mobileMenu = document.querySelector(".mobile__menu");
  const mobileNav = document.querySelector(".mobile__nav");

  burgerMenu.addEventListener("click", () => {
    burgerMenu.classList.toggle("burger-menu_active");
    mobileMenu.classList.toggle("mobile__menu_active");
    document.body.classList.toggle("no-scroll");
  });

  document.addEventListener("click", (event) => {
    burgerMenu.classList.toggle("burger-menu_active");
    if (!burgerMenu.contains(event.target) && !mobileNav.contains(event.target)) {
    
      mobileMenu.classList.toggle("mobile__menu_active");
        document.body.classList.toggle("no-scroll");
    }
  });

  mobileMenu.addEventListener("click", (event) => {
    burgerMenu.classList.toggle("burger-menu_active");
    if (!mobileNav.contains(event.target)) {
   
      mobileMenu.classList.toggle("mobile__menu_active");
        document.body.classList.toggle("no-scroll");
    }
  });
}); */

/* document.addEventListener('DOMContentLoaded', function() {
  // Проверяем, существуют ли элементы на странице
  const burgerMenu = document.querySelector('.burger-menu');
  const mobileMenu = document.querySelector('.mobile__menu');

  // Если элементы существуют, назначаем обработчики событий
  if (burgerMenu && mobileMenu) {
      function toggleMenu() {
          burgerMenu.classList.toggle('burger-menu_active');
          mobileMenu.classList.toggle('mobile__menu_active');
      }

      burgerMenu.addEventListener('click', toggleMenu);

      document.addEventListener('click', function(event) {
          const isClickInside = burgerMenu.contains(event.target) || mobileMenu.contains(event.target);

          if (!isClickInside) {
              burgerMenu.classList.remove('burger-menu_active');
              mobileMenu.classList.remove('mobile__menu_active');
          }
      });
  }
}); */




// phone mask
var element = document.getElementById("phone");

element.addEventListener("focus", function () {
  var maskOptions = {
    mask: "+7(000)000-00-00",
    lazy: false,
  };
  var mask = new IMask(element, maskOptions);
  element.maskInstance = mask;
});

element.addEventListener("blur", function () {
  if (element.value === "+7(___)___-__-__") {
    element.maskInstance.destroy();
    element.value = "";
  }
});

//
$(".slider").slick({
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: true,
  prevArrow: $(".slick-prev"),
  nextArrow: $(".slick-next"),
 /*  centerPadding: "0px", */
  responsive: [
    {
      breakpoint: 1199,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
       /*  centerMode: true, */
       /*  centerPadding: '-10px'  */
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
});


$('.promo__slider').slick({
  dots: false,
  infinite: true,
  speed: 300,
  slidesToShow: 1,
  centerMode: false,
  variableWidth: true,
  arrows: true,
  prevArrow: $(".promo__slider__prev"),
  nextArrow: $(".promo__slider__next"),
});

/* $(".slider").slick({
  dots: false,
  infinite: true,
  speed: 300,
  slidesToShow: 1,
  centerMode: false,
  variableWidth: true,
  autoplay: true,
  autoplaySpeed: 5000,
  arrows: true,
});
 */
const comparisonBlocks = document.querySelectorAll('.comparison__block');

if (comparisonBlocks.length > 0) {
  comparisonBlocks.forEach((slide) => {
    slide.addEventListener('scroll', () => {
      comparisonBlocks.forEach((s) => {
        s.classList.remove('comparison__block_active');
      });
      slide.classList.add('comparison__block_active');
    });
  });
  comparisonBlocks[0].classList.add('comparison__block_active');
}



$(function(){
  let nav = $(".mobile__menu");
  let navToggle = $(".burger-menu");

  navToggle.on("click", function(event){
    event.preventDefault();
    nav.toggleClass("mobile__menu_active");
    navToggle.toggleClass("burger-menu_active");
  });

  nav.on("click", function(event){
    nav.removeClass("mobile__menu_active");
    navToggle.removeClass("burger-menu_active");
  });
});
