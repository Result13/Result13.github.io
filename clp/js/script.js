$(document).ready(function () {
    var $slider = $(".blog__wrapper"); // Определяем переменную $slider
    $(".slider-dots-art").empty();
    if ($slider.hasClass('slick-initialized')) {
      $slider.slick('unslick');
    }
    
    $slider.slick({
      infinite: true,
      slidesToShow: 4,
      slidesToScroll: 1,
      centerMode: true,
      variableWidth: false,
      arrows: false, // Отключаем стандартные стрелки
      dots: true, // Включаем, чтобы работал `customPaging`
      appendDots: $(".slider-dots-art"), // Теперь он реально добавит доты
      customPaging: function (slider, i) {
        return '<button class="dot-art"></button>'; // Свои доты
      },
      responsive: [
        {
          breakpoint: 1199,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            /*  centerMode: true, */
            /*  centerPadding: '-10px'  */
          },
        },
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  
    $(".slider-prev.slider-prev-art").click(function () {
      $slider.slick("slickPrev");
    });
  
    $(".slider-next.slider-next-art").click(function () {
      $slider.slick("slickNext");
    });
  
    // Подключаем кастомные доты
    $(".slider-dots-art").on("click", ".dot-art", function () {
      let index = $(this).index();
      $slider.slick("slickGoTo", index);
    });
  });

  $(document).ready(function () {
    var $slider = $(".reviews__wrapper"); // Определяем переменную $slider
    $(".slider-dots-rev").empty();
    $slider.slick({
      infinite: true,
      slidesToShow: 2,
      slidesToScroll: 1,
      centerMode: false,
      variableWidth: false,
      arrows: false, // Отключаем стандартные стрелки
      dots: true, // Включаем, чтобы работал `customPaging`
      appendDots: $(".slider-dots-rev"), // Теперь он реально добавит доты
      customPaging: function (slider, i) {
        return '<button class="dot-rev"></button>'; // Свои доты
      },
      responsive: [
        {
          breakpoint: 1199,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            /*  centerMode: true, */
            /*  centerPadding: '-10px'  */
          },
        },
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  
    $(".slider-prev.slider-prev-rev").click(function () {
      $slider.slick("slickPrev");
    });
  
    $(".slider-next.slider-next-rev").click(function () {
      $slider.slick("slickNext");
    });
  
    // Подключаем кастомные доты
    $(".slider-dots-rev").on("click", ".dot-rev", function () {
      let index = $(this).index();
      $slider.slick("slickGoTo", index);
    });

   
  });
  $(document).ready(function () {
    var $slider = $(".cours__wrapper"); // Определяем переменную $slider
    $(".slider-dots-course").empty();
    $slider.slick({
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      centerMode: false,
      variableWidth: false,
      arrows: false, // Отключаем стандартные стрелки
      dots: true, // Включаем, чтобы работал `customPaging`
      appendDots: $(".slider-dots-course"), // Теперь он реально добавит доты
      customPaging: function (slider, i) {
        return '<button class="dot-course"></button>'; // Свои доты
      },
      responsive: [
        {
          breakpoint: 1199,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            /*  centerMode: true, */
            /*  centerPadding: '-10px'  */
          },
        },
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  
    $(".slider-prev.slider-prev-course").click(function () {
      $slider.slick("slickPrev");
    });
  
    $(".slider-next.slider-next-course").click(function () {
      $slider.slick("slickNext");
    });
  
    // Подключаем кастомные доты
    $(".slider-dots-course").on("click", ".dot-course", function () {
      let index = $(this).index();
      $slider.slick("slickGoTo", index);
    });

   
  });


