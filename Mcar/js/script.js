"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var burgerMenu = document.querySelector(".burger-menu");
  var mobileMenu = document.querySelector(".mobile__menu");
  var mobileNav = document.querySelector(".mobile__nav");
  burgerMenu.addEventListener("click", function () {
    burgerMenu.classList.toggle("burger-menu_active");
    mobileMenu.classList.toggle("mobile__menu_active");
    document.body.classList.toggle("no-scroll");
  });
  document.addEventListener("click", function (event) {
    if (!burgerMenu.contains(event.target) && !mobileNav.contains(event.target)) {
      burgerMenu.classList.remove("burger-menu_active");
      mobileMenu.classList.remove("mobile__menu_active");
      document.body.classList.remove("no-scroll");
    }
  });
  mobileMenu.addEventListener("click", function (event) {
    if (!mobileNav.contains(event.target)) {
      burgerMenu.classList.remove("burger-menu_active");
      mobileMenu.classList.remove("mobile__menu_active");
      document.body.classList.remove("no-scroll");
    }
  });
});

// phone mask
var element = document.getElementById("phone");
element.addEventListener("focus", function () {
  var maskOptions = {
    mask: "+7(000)000-00-00",
    lazy: false
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
  responsive: [{
    breakpoint: 1199,
    settings: {
      slidesToShow: 2,
      slidesToScroll: 1
      /*  centerMode: true, */
      /*  centerPadding: '-10px'  */
    }
  }, {
    breakpoint: 768,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1
    }
  }]
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
  nextArrow: $(".promo__slider__next")
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