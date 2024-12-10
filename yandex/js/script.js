
/* участники */
document.addEventListener('DOMContentLoaded', function () {
  const slider = document.querySelector('.party__list');
  const slides = Array.from(slider.children); 
  const slidesCount = slides.length; 
  let slidesPerMove = 3; 
  let autoScrollInterval; 
  const counterText = document.querySelector('.party__btns__text'); 

  let touchStartX = 0; 
  let touchDeltaX = 0;

  const setSlidesPerMove = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 768) {
      slidesPerMove = 1; 
    } else if (screenWidth <= 1024) {
      slidesPerMove = 2; 
    } else {
      slidesPerMove = 3; 
    }

    updateSlidesWidth(); 
    updatePosition(true); 
    updateCounter(); 
    };


  const clonesBefore = slides.map(slide => slide.cloneNode(true)); 
  const clonesAfter = slides.map(slide => slide.cloneNode(true));  


  clonesBefore.reverse().forEach(clone => slider.insertBefore(clone, slider.firstChild));

 
  clonesAfter.forEach(clone => slider.appendChild(clone));


  const allSlides = Array.from(slider.children); 
  const totalSlides = allSlides.length;


  const updateSlidesWidth = () => {
    const slideWidth = slider.clientWidth / slidesPerMove;
    allSlides.forEach(slide => {
      slide.style.flex = `0 0 ${slideWidth}px`;
    });
  };

 
  let currentIndex = slidesCount; 


  const updateCounter = () => {
    let firstVisibleSlide = ((currentIndex - slidesCount) % slidesCount) + 1;
    if (firstVisibleSlide <= 0) {
      firstVisibleSlide += slidesCount; 
    }

    const lastVisibleSlide = Math.min(firstVisibleSlide + slidesPerMove - 1, slidesCount);

    counterText.innerHTML = ` ${lastVisibleSlide} <span>/ ${slidesCount}</span>`;
  };


  const updatePosition = (instant = false) => {
    const slideWidth = slider.clientWidth / slidesPerMove;
    slider.style.transition = instant ? 'none' : 'transform 0.75s ease-in-out';
    slider.style.transform = `translateX(${-currentIndex * slideWidth}px)`;


    setTimeout(() => {
      if (currentIndex >= slidesCount && currentIndex < totalSlides - slidesCount) {
        updateCounter();
      }
    }, instant ? 0 : 750); 
  };



  const moveNext = () => {
    if (currentIndex < totalSlides - slidesPerMove) {
      currentIndex += slidesPerMove; 
    }
    updatePosition();


    if (currentIndex >= totalSlides - slidesCount) {
      setTimeout(() => {
        slider.style.transition = 'none';
        currentIndex = slidesCount;
        updatePosition(true);
      }, 750); 
    }
  };


  const movePrev = () => {
    if (currentIndex > 0) {
      currentIndex -= slidesPerMove; 
    }
    updatePosition();


    if (currentIndex < slidesCount) {
      setTimeout(() => {
        slider.style.transition = 'none';
        currentIndex = totalSlides - slidesCount - slidesPerMove;
        updatePosition(true);
      }, 500); 
    }
  };


  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX;
    touchDeltaX = 0;
    stopAutoScroll(); 
  };


  const handleTouchMove = (e) => {
    touchDeltaX = e.touches[0].clientX - touchStartX;
  };

  
  const handleTouchEnd = () => {
    if (touchDeltaX > 50) {
      movePrev(); 
    } else if (touchDeltaX < -50) {
      moveNext(); 
    }
    startAutoScroll(); 
  };


  const startAutoScroll = () => {
    stopAutoScroll(); 
    autoScrollInterval = setInterval(() => {
      moveNext(); 
    }, 4000); 
  };

 
  const stopAutoScroll = () => {
    clearInterval(autoScrollInterval);
  };

  const handleUserInteraction = () => {
    stopAutoScroll();
    startAutoScroll();
  };


  document.querySelector('.party__btns_next').addEventListener('click', () => {
    moveNext();
    handleUserInteraction();
  });
  document.querySelector('.party__btns_prev').addEventListener('click', () => {
    movePrev();
    handleUserInteraction(); 
  });


  slider.addEventListener('touchstart', handleTouchStart);
  slider.addEventListener('touchmove', handleTouchMove);
  slider.addEventListener('touchend', handleTouchEnd);


  setSlidesPerMove();
  window.addEventListener('resize', setSlidesPerMove);


  startAutoScroll();
});

/* этапы */
document.addEventListener('DOMContentLoaded', function () {
  const stageSlider = document.querySelector('.stage__wrapper');
  const stageSlides = Array.from(stageSlider.querySelectorAll('.stage__slide'));
  const stageDotsContainer = document.querySelector('.stage__dots');
  const prevButton = document.querySelector('.stage__btns_prev');
  const nextButton = document.querySelector('.stage__btns_next');
  let stageCurrentIndex = 0;
  let isSliderActive = false;

  let startX = 0;
  let currentX = 0;
  let isDragging = false;


  const updateStageSlides = () => {
    const slideWidth = stageSlider.clientWidth;
    stageSlider.style.transition = 'transform 0.3s ease';
    stageSlider.style.transform = `translateX(${-stageCurrentIndex * slideWidth}px)`;

    const stageDots = Array.from(stageDotsContainer.children); 
    stageDots.forEach((dot, index) => {
      dot.classList.toggle('stage__dot_active', index === stageCurrentIndex);
    });


    prevButton.disabled = stageCurrentIndex === 0;
    nextButton.disabled = stageCurrentIndex === stageSlides.length - 1;
  };


  const setStageSlidesWidth = () => {
    if (window.innerWidth <= 575) {
      const slideWidth = stageSlider.clientWidth;
      stageSlides.forEach(slide => {
        slide.style.flex = `0 0 ${slideWidth}px`;
      });
      updateStageSlides();
    }
  };


  const createDots = () => {
    stageDotsContainer.innerHTML = ''; 
    stageSlides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'stage__dot';
      if (index === stageCurrentIndex) dot.classList.add('stage__dot_active');
      dot.addEventListener('click', () => {
        stageCurrentIndex = index;
        updateStageSlides();
      });
      stageDotsContainer.appendChild(dot);
    });
  };


  prevButton.addEventListener('click', () => {
    if (stageCurrentIndex > 0) {
      stageCurrentIndex--;
      updateStageSlides();
    }
  });

  nextButton.addEventListener('click', () => {
    if (stageCurrentIndex < stageSlides.length - 1) {
      stageCurrentIndex++;
      updateStageSlides();
    }
  });


  const handleTouchStart = (event) => {
    if (!isSliderActive) return;
    startX = event.touches[0].clientX;
    isDragging = true;
    stageSlider.style.transition = 'none'; 
  };

  const handleTouchMove = (event) => {
    if (!isDragging || !isSliderActive) return;
    currentX = event.touches[0].clientX;
    const deltaX = currentX - startX;
    const slideWidth = stageSlider.clientWidth;
    stageSlider.style.transform = `translateX(${-stageCurrentIndex * slideWidth + deltaX}px)`;
  };

  const handleTouchEnd = () => {
    if (!isDragging || !isSliderActive) return;
    isDragging = false;
    const slideWidth = stageSlider.clientWidth;
    const deltaX = currentX - startX;

    if (Math.abs(deltaX) > slideWidth / 4) {
      if (deltaX > 0 && stageCurrentIndex > 0) {
        stageCurrentIndex--;
      } else if (deltaX < 0 && stageCurrentIndex < stageSlides.length - 1) {
        stageCurrentIndex++;
      }
    }
    updateStageSlides();
  };

  stageSlider.addEventListener('touchstart', handleTouchStart);
  stageSlider.addEventListener('touchmove', handleTouchMove);
  stageSlider.addEventListener('touchend', handleTouchEnd);


  const initializeSlider = () => {
    if (window.innerWidth <= 575 && !isSliderActive) {
      isSliderActive = true;
      createDots();
      setStageSlidesWidth();
      updateStageSlides();
    } else if (window.innerWidth > 575 && isSliderActive) {
      isSliderActive = false;
      stageSlider.style.transition = 'none';
      stageSlider.style.transform = 'translateX(0)'; 
      stageSlides.forEach(slide => {
        slide.style.flex = ''; 
      });
      stageDotsContainer.innerHTML = ''; 
    }
  };


  initializeSlider();
  window.addEventListener('resize', initializeSlider);
});
/* анимация */
document.addEventListener('DOMContentLoaded', function () {
  const elementsToAnimate = [
    { selector: '.tournament__img', visibleClass: 'tournament__img_visible', delay: 0 },
    { selector: '.stage__img', visibleClass: 'stage__img_visible', delay: 0 },
    { selector: '.hand', visibleClass: 'hand_visible', delay: 300 },
    { selector: '.effect', visibleClass: 'effect_visible', delay: 0 },
    { selector: '.cick-horse', visibleClass: 'cick-horse_visible', delay: 700 }
  ];

  function checkVisibility() {
    elementsToAnimate.forEach(({ selector, visibleClass, delay }) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          if (delay) {
            setTimeout(() => element.classList.add(visibleClass), delay);
          } else {
            element.classList.add(visibleClass);
          }
        }
      });
    });
  }

  window.addEventListener('scroll', checkVisibility);
  checkVisibility(); 
});


