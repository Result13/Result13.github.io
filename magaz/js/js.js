
const close = document.querySelector('.close'),
catalog = document.querySelector('.catalog'),
catalogMenu = document.querySelector('.catalog-item'),
body = document.querySelector('body'),
hamburger = document.querySelector('.hamburger'),
catalogItemWrapper = document.querySelector('.catalog-item__wrapper'),
closeCity = document.querySelector('.close__city'),
city= document.querySelector('.city'),
city__wrapper=document.querySelector('.city__wrapper'),
scale= document.querySelector('.filter__scale__wrapper'),
category = document.querySelector('.filter__category__wrapper'),
filterMenu = document.querySelector('.filter__menu');
categoryMenu = document.querySelector('.category__menu');
arrow = document.querySelectorAll('.arrow');
/* scale.addEventListener('click', (event) => {
  filterMenu.classList.toggle('filter__menu_active');
  // предположим, что arrow[0] привязана к scale
    event.stopPropagation();
  if (filterMenu.classList.contains('filter__menu_active')) {
    arrow[0].style.transform = 'rotate(180deg)';
  } else {
    arrow[0].style.transform = 'rotate(0deg)';
  }
})

category.addEventListener('click', (event) => {
  categoryMenu.classList.toggle('filter__menu_active');
  // предположим, что arrow[1] привязана к category
    event.stopPropagation();
  if (categoryMenu.classList.contains('filter__menu_active')) {
    arrow[1].style.transform = 'rotate(180deg)';
  } else {
    arrow[1].style.transform = 'rotate(0deg)';
  }
  
}) */
scale.addEventListener('click', (event) => {
  filterMenu.classList.toggle('filter__menu_active');
  // предположим, что arrow[0] привязана к scale
  event.stopPropagation();
  if (filterMenu.classList.contains('filter__menu_active')) {
    arrow[0].style.transform = 'rotate(180deg)';
    filterMenu.style.zIndex = '1'; // Добавлено
  } else {
    arrow[0].style.transform = 'rotate(0deg)';
    setTimeout(() => {
      filterMenu.style.zIndex = '-1'; // Добавлено
    }, 400); // Задержка в 0.4 секунды
  }
})

category.addEventListener('click', (event) => {
  categoryMenu.classList.toggle('filter__menu_active');
  // предположим, что arrow[1] привязана к category
  event.stopPropagation();
  if (categoryMenu.classList.contains('filter__menu_active')) {
    arrow[1].style.transform = 'rotate(180deg)';
    categoryMenu.style.zIndex = '1'; // Добавлено
  } else {
    arrow[1].style.transform = 'rotate(0deg)';
    setTimeout(() => {
     categoryMenu.style.zIndex = '-1'; // Добавлено
    }, 400); // Задержка в 0.4 секунды
  }
})

closeCity.addEventListener('click',closeMenu);

catalogItemWrapper.addEventListener('click', function(event) {
event.stopPropagation();

});
city.addEventListener('click', openCitys);
catalog.addEventListener('click', openMenu);
hamburger.addEventListener('click', openMenu);
  function openCitys(){
    city__wrapper.classList.toggle('city__wrapper_active');
  }
  function openMenu(){
    catalogMenu.classList.toggle('catalog-item_active');
    body.classList.toggle('body');
   
  };
  
  function closeMenu(event){
     if (event.target.classList.contains('catalog-item__wrapper')) {
    // Если да, то просто вернитесь и не закрывайте меню
    return;
  }
    catalogMenu.classList.remove('catalog-item_active');
    city__wrapper.classList.remove('city__wrapper_active');
  }
  close.addEventListener('click', closeMenu);
  catalogMenu.addEventListener('click', closeMenu);



window.onload = function() {
  $('.slider').slick({
    arrows:true,
    dots: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true
    
  });

  $('.small__slider').slick({
    arrows:false,
    dots: true,
    speed: 500,
    autoplay: false,
  });
  var lastMousePosition = 0;
  var sensitivity = 0; // Увеличьте это значение, чтобы уменьшить чувствительность

  $('.small__slider').on('mousemove', function(e) {
    var mousePosition = e.pageX;

    if (Math.abs(mousePosition - lastMousePosition) > sensitivity) {
      if (mousePosition > lastMousePosition) {
        $(this).slick('slickNext');
      } else if (mousePosition < lastMousePosition) {
        $(this).slick('slickPrev');
      }

      lastMousePosition = mousePosition;
    }
  });
  
};
// toggle

/* document.addEventListener('DOMContentLoaded', function() {
  var tabs = document.querySelectorAll('ul.new__tabs li');
  tabs.forEach(function(tab, index) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(innerTab, innerIndex) {
        innerTab.classList.toggle('new__tab_active', index === innerIndex);
      });
      var contents = this.closest('div.container').querySelectorAll('div.new__content');
      contents.forEach(function(content, contentIndex) {
        content.classList.toggle('new__content_active', index === contentIndex);
      });
    });
  });
}); */
//табы одиночные
/* document.addEventListener('DOMContentLoaded', function() {
  var tabsNew = document.querySelectorAll('ul.new__tabs li');
  var tabsHit = document.querySelectorAll('ul.hit__tabs li');
  tabsNew.forEach(function(tabNew, index) {
    tabNew.addEventListener('click', function() {
      tabsNew.forEach(function(innerTabNew, innerIndex) {
        innerTabNew.classList.toggle('new__tab_active', index === innerIndex);
      });
      var contents = this.closest('div.container').querySelectorAll('div.new__content');
      contents.forEach(function(content, contentIndex) {
        var isActive = index === contentIndex;
        content.classList.toggle('new__content_active', isActive);
        if (isActive) {
          var sliders = content.querySelectorAll('.slider, .small__slider');
          sliders.forEach(function(slider) {
            $(slider).slick('refresh');
          });
        }
      });
    });
  });
  tabsHit.forEach(function(tabHit, index) {
    tabHit.addEventListener('click', function() {
      tabsHit.forEach(function(innerTabHit, innerIndex) {
        innerTabHit.classList.toggle('hit__tab_active', index === innerIndex);
      });
      var contents = this.closest('div.container').querySelectorAll('div.hit__content');
      contents.forEach(function(content, contentIndex) {
        var isActive = index === contentIndex;
        content.classList.toggle('hit__content_active', isActive);
        if (isActive) {
          var sliders = content.querySelectorAll('.slider, .small__slider');
          sliders.forEach(function(slider) {
            $(slider).slick('refresh');
          });
        }
      });
    });
  });
}); */
document.addEventListener('DOMContentLoaded', function() {
  const tabTypes = ['new', 'hit'];

  tabTypes.forEach((type) => {
    const tabs = document.querySelectorAll(`ul.${type}__tabs li`);

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', function() {
        // Toggle active class on tabs
        tabs.forEach((innerTab, innerIndex) => {
          innerTab.classList.toggle(`${type}__tab_active`, index === innerIndex);
        });

        // Toggle active class on contents and refresh sliders
        const contents = this.closest('div.container').querySelectorAll(`div.${type}__content`);
        contents.forEach((content, contentIndex) => {
          const isActive = index === contentIndex;
          content.classList.toggle(`${type}__content_active`, isActive);

          if (isActive) {
            const sliders = content.querySelectorAll('.slider, .small__slider');
            sliders.forEach((slider) => {
              $(slider).slick('refresh');
            });
          }
        });
      });
    });
  });
});


//toggle with jqery
/* $(document).ready(function(){
  $('ul.new__tabs').on('click', 'li:not(.new__tab_active)', function() {
    $(this)
      .addClass('new__tab_active').siblings().removeClass('new__tab_active')
      .closest('div.container').find('div.new__content').removeClass('new__content_active').eq($(this).index()).addClass('new__content_active');
  });
}); */
//

//filter
/* const rangeInput = document.querySelectorAll('.filter__range input'),
priceBefore = document.querySelectorAll('filter__price__before input'),
priceAfter = document.querySelectorAll('filter__price__after input'),
filterProgress = document.querySelector('.filter__slider .filter__slider__progress');
let priceGap = 100;
rangeInput.forEach(input => {
  input.addEventListener("input", e =>{
    let minVal = parseInt(rangeInput[0].value),
    maxVal = parseInt(rangeInput[1].value);
    if (maxVal - minVal < priceGap){
      if (e.target.className === "filter__range__min"){
        rangeInput[0].value = maxVal - priceGap;
      } else{
        rangeInput[1].value = minVal + priceGap;
      }
    }else{
    priceBefore.value = minVal;
    priceAfter.value = maxVal;
    filterProgress.style.left = (minVal / rangeInput[0].max) * 100;
    filterProgress.style.right = 100 - (maxVal / rangeInput[1].max) * 100;
    }
  })
}); */
const rangeInput = document.querySelectorAll('.filter__range input'),
priceBefore = document.querySelector('.filter__price__before'),
priceAfter = document.querySelector('.filter__price__after'),
filterProgress = document.querySelector('.filter__slider .filter__slider__progress');
filterWrapper = document.querySelector('.filter__slider');
let priceGap = 0;
let minVal = parseInt(rangeInput[0].value),
maxVal = parseInt(rangeInput[1].value);
filterProgress.style.left = (minVal / rangeInput[0].max) * 100 + '%';
filterProgress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + '%';
priceBefore.addEventListener('input', function() {
  let value = parseInt(this.value);
  if (value < maxVal) {
    rangeInput[0].value = value;
    minVal = value;
    filterProgress.style.left = (minVal / rangeInput[0].max) * 100 + '%';
  } else {
    this.value = minVal;
  }
});

priceAfter.addEventListener('input', function() {
  let value = parseInt(this.value);
  if (value > minVal && value <= this.max) {
    rangeInput[1].value = value;
    maxVal = value;
    filterProgress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + '%';
  } else if (value > this.max) {
    this.value = this.max;
  } else if(rangeInput[1].value === ''){
    rangeInput[1].value = this.value;
  }else{
    rangeInput[1].value = maxVal;
  }
  
  /* if (value > minVal && value <= this.max) {
    rangeInput[1].value = value;
    maxVal = value;
    filterProgress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + '%';
  } else if (value > this.max) {
    this.value = this.max;
  } else {
    this.value = maxVal;
  } */
});
rangeInput.forEach(input => {
  input.addEventListener("input", e =>{
    minVal = parseInt(rangeInput[0].value),
    maxVal = parseInt(rangeInput[1].value);
    if (maxVal - minVal < priceGap){
      if (e.target.className === "filter__range__min"){
        rangeInput[0].value = maxVal - priceGap;
      } else{
        rangeInput[1].value = minVal + priceGap;
      }
    }else{
    priceBefore.value = minVal;
    priceAfter.value = maxVal;
    filterProgress.style.left = (minVal / rangeInput[0].max) * 100 + '%';
    filterProgress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + '%';
    }
  })
});

filterWrapper.addEventListener('click', function(e) {
  const rect = this.getBoundingClientRect();
  const x = e.clientX - rect.left; // x position within the element
  const width = rect.right - rect.left; // width of the element
  const percentage = x / width; // percentage of the click position in the element
  const max = parseInt(rangeInput[1].max);
  const min = parseInt(rangeInput[0].min);
  const value = Math.round((max - min) * percentage + min); // value to be set for the slider

  // calculate which thumb is closer to the click position
  const middle = (parseInt(rangeInput[0].value) + parseInt(rangeInput[1].value)) / 2;

  if (value < middle) {
    // if the click was closer to the start, move the first slider
    rangeInput[0].value = value;
  } else {
    // if the click was closer to the end, move the second slider
    rangeInput[1].value = value;
  }

  // trigger the input event manually
  rangeInput[0].dispatchEvent(new Event('input'));
  rangeInput[1].dispatchEvent(new Event('input'));
  console.log(rangeInput[1].value);
});
// инициализация гуглокарты
var map = new google.maps.Map(document.getElementById('map'), {
  // параметры инициализации карты
});

// параметры - координаты офиса
// lat - широта
// lng - долгота
function chnangePositionOnMap(lat, lng) {
  var myLatLng = {lat: lat, lng: lng};

  /* это чтобы поставить маркер если нужно
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'текст маркера'
  });
  */

  // а это чтобы перейти к данным координатам на карте
  map.setCenter(myLatLng);
}
