/* 

document.addEventListener('DOMContentLoaded', function () {
  const slider = document.querySelector('.party__list');
  const slides = Array.from(slider.children); // Оригинальные слайды
  const slidesCount = slides.length; // Количество оригинальных слайдов
  let slidesPerMove = 3; // Количество видимых слайдов по умолчанию (для десктопа)

  // Функция для установки количества слайдов на экран
  const setSlidesPerMove = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 768) {
      slidesPerMove = 1; // Мобильные устройства
    } else if (screenWidth <= 1024) {
      slidesPerMove = 2; // Планшеты
    } else {
      slidesPerMove = 3; // Десктопы
    }

    updateSlidesWidth(); // Обновляем ширину слайдов
    updatePosition(true); // Пересчитываем позицию
  };

  // Убедимся, что клоны создаются правильно
  const clonesBefore = slides.map(slide => slide.cloneNode(true)); // Клоны перед
  const clonesAfter = slides.map(slide => slide.cloneNode(true));  // Клоны после

  // Добавляем клоны в начало
  clonesBefore.reverse().forEach(clone => slider.insertBefore(clone, slider.firstChild));

  // Добавляем клоны в конец
  clonesAfter.forEach(clone => slider.appendChild(clone));
  
  // После добавления клонов обновляем список слайдов
  const allSlides = Array.from(slider.children); // Все слайды (оригиналы + клоны)
  const totalSlides = allSlides.length;

  // Устанавливаем ширину каждого слайда
  const updateSlidesWidth = () => {
    const slideWidth = slider.clientWidth / slidesPerMove;
    allSlides.forEach(slide => {
      slide.style.flex = `0 0 ${slideWidth}px`;
    });
  };

  // Начальная позиция: на оригинальных слайдах
  let currentIndex = slidesCount; // Указываем на первый оригинальный слайд

  // Устанавливаем позицию слайдера
  const updatePosition = (instant = false) => {
    const slideWidth = slider.clientWidth / slidesPerMove;
    slider.style.transition = instant ? 'none' : 'transform 0.5s ease-in-out';
    slider.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
  };

  // Переход вперёд
  const moveNext = () => {
    currentIndex += slidesPerMove; // Перемещаемся на количество видимых слайдов
    updatePosition();

    // Если дошли до конца оригинальных слайдов, перескакиваем на начало
    if (currentIndex >= totalSlides - slidesCount) {
      setTimeout(() => {
        slider.style.transition = 'none';
        currentIndex = slidesCount;
        updatePosition(true);
      }, 500); // Время перехода должно совпадать с CSS transition
    }
  };

  // Переход назад
  const movePrev = () => {
    currentIndex -= slidesPerMove; // Перемещаемся на количество видимых слайдов
    updatePosition();

    // Если дошли до начала оригинальных слайдов, перескакиваем на конец
    if (currentIndex < slidesCount) {
      setTimeout(() => {
        slider.style.transition = 'none';
        currentIndex = totalSlides - slidesCount - slidesPerMove;
        updatePosition(true);
      }, 500); // Время перехода должно совпадать с CSS transition
    }
  };

  // Кнопки навигации
  document.querySelector('.party__btns_next').addEventListener('click', moveNext);
  document.querySelector('.party__btns_prev').addEventListener('click', movePrev);

  // Инициализация слайдера
  setSlidesPerMove();
  window.addEventListener('resize', setSlidesPerMove);

  // Лог для отладки
  console.log("Оригинальные слайды:", slidesCount);
  console.log("Всего слайдов после клонирования:", totalSlides);
});
 */
/* document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.party__list');
    const slides = Array.from(slider.children); // Оригинальные слайды
    const slidesCount = slides.length; // Количество оригинальных слайдов
    let slidesPerMove = 3; // Количество видимых слайдов по умолчанию (для десктопа)
    let autoScrollInterval; // Переменная для хранения таймера автопрокрутки
  
    // Функция для установки количества слайдов на экран
    const setSlidesPerMove = () => {
      const screenWidth = window.innerWidth;
  
      if (screenWidth <= 768) {
        slidesPerMove = 1; // Мобильные устройства
      } else if (screenWidth <= 1024) {
        slidesPerMove = 2; // Планшеты
      } else {
        slidesPerMove = 3; // Десктопы
      }
  
      updateSlidesWidth(); // Обновляем ширину слайдов
      updatePosition(true); // Пересчитываем позицию
    };
  
    // Убедимся, что клоны создаются правильно
    const clonesBefore = slides.map(slide => slide.cloneNode(true)); // Клоны перед
    const clonesAfter = slides.map(slide => slide.cloneNode(true));  // Клоны после
  
    // Добавляем клоны в начало
    clonesBefore.reverse().forEach(clone => slider.insertBefore(clone, slider.firstChild));
  
    // Добавляем клоны в конец
    clonesAfter.forEach(clone => slider.appendChild(clone));
  
    // После добавления клонов обновляем список слайдов
    const allSlides = Array.from(slider.children); // Все слайды (оригиналы + клоны)
    const totalSlides = allSlides.length;
  
    // Устанавливаем ширину каждого слайда
    const updateSlidesWidth = () => {
      const slideWidth = slider.clientWidth / slidesPerMove;
      allSlides.forEach(slide => {
        slide.style.flex = `0 0 ${slideWidth}px`;
      });
    };
  
    // Начальная позиция: на оригинальных слайдах
    let currentIndex = slidesCount; // Указываем на первый оригинальный слайд
  
    // Устанавливаем позицию слайдера
    const updatePosition = (instant = false) => {
      const slideWidth = slider.clientWidth / slidesPerMove;
      slider.style.transition = instant ? 'none' : 'transform 1s ease-in-out';
      slider.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
    };
  
    // Переход вперёд
    const moveNext = () => {
      currentIndex += slidesPerMove; // Перемещаемся на количество видимых слайдов
      updatePosition();
  
      // Если дошли до конца оригинальных слайдов, перескакиваем на начало
      if (currentIndex >= totalSlides - slidesCount) {
        setTimeout(() => {
          slider.style.transition = 'none';
          currentIndex = slidesCount;
          updatePosition(true);
        }, 1000); // Время перехода должно совпадать с CSS transition
      }
    };
  
    // Переход назад
    const movePrev = () => {
      currentIndex -= slidesPerMove; // Перемещаемся на количество видимых слайдов
      updatePosition();
  
      // Если дошли до начала оригинальных слайдов, перескакиваем на конец
      if (currentIndex < slidesCount) {
        setTimeout(() => {
          slider.style.transition = 'none';
          currentIndex = totalSlides - slidesCount - slidesPerMove;
          updatePosition(true);
        }, 1000); // Время перехода должно совпадать с CSS transition
      }
    };
  
    // Запуск автопрокрутки
    const startAutoScroll = () => {
      stopAutoScroll(); // Убедимся, что предыдущий интервал очищен
      autoScrollInterval = setInterval(() => {
        moveNext(); // Автоматический переход вперёд
      }, 4000); // Интервал в миллисекундах
    };
  
    // Остановка автопрокрутки
    const stopAutoScroll = () => {
      clearInterval(autoScrollInterval);
    };
  
    // Сбрасываем автопрокрутку при взаимодействии пользователя
    const handleUserInteraction = () => {
      stopAutoScroll();
      startAutoScroll();
    };
  
    // Кнопки навигации
    document.querySelector('.party__btns_next').addEventListener('click', () => {
      moveNext();
      handleUserInteraction(); // Сброс автопрокрутки
    });
    document.querySelector('.party__btns_prev').addEventListener('click', () => {
      movePrev();
      handleUserInteraction(); // Сброс автопрокрутки
    });
  
    // Инициализация слайдера
    setSlidesPerMove();
    window.addEventListener('resize', setSlidesPerMove);
  
    // Запускаем автопрокрутку при загрузке
    startAutoScroll();
  
    // Лог для отладки
    console.log("Оригинальные слайды:", slidesCount);
    console.log("Всего слайдов после клонирования:", totalSlides);
  });
   */

document.addEventListener('DOMContentLoaded', function () {
  const slider = document.querySelector('.party__list');
  const slides = Array.from(slider.children); // Оригинальные слайды
  const slidesCount = slides.length; // Количество оригинальных слайдов
  let slidesPerMove = 3; // Количество видимых слайдов по умолчанию (для десктопа)
  let autoScrollInterval; // Переменная для хранения таймера автопрокрутки
  const counterText = document.querySelector('.party__btns__text'); // Счётчик

  let touchStartX = 0; // Начальная точка свайпа
  let touchDeltaX = 0; // Смещение по X

  // Функция для установки количества слайдов на экран
  const setSlidesPerMove = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 768) {
      slidesPerMove = 1; // Мобильные устройства
    } else if (screenWidth <= 1024) {
      slidesPerMove = 2; // Планшеты
    } else {
      slidesPerMove = 3; // Десктопы
    }

    updateSlidesWidth(); // Обновляем ширину слайдов
    updatePosition(true); // Пересчитываем позицию
    updateCounter(); // Обновляем счётчик
  };

  // Убедимся, что клоны создаются правильно
  const clonesBefore = slides.map(slide => slide.cloneNode(true)); // Клоны перед
  const clonesAfter = slides.map(slide => slide.cloneNode(true));  // Клоны после

  // Добавляем клоны в начало
  clonesBefore.reverse().forEach(clone => slider.insertBefore(clone, slider.firstChild));

  // Добавляем клоны в конец
  clonesAfter.forEach(clone => slider.appendChild(clone));

  // После добавления клонов обновляем список слайдов
  const allSlides = Array.from(slider.children); // Все слайды (оригиналы + клоны)
  const totalSlides = allSlides.length;

  // Устанавливаем ширину каждого слайда
  const updateSlidesWidth = () => {
    const slideWidth = slider.clientWidth / slidesPerMove;
    allSlides.forEach(slide => {
      slide.style.flex = `0 0 ${slideWidth}px`;
    });
  };

  // Начальная позиция: на оригинальных слайдах
  let currentIndex = slidesCount; // Указываем на первый оригинальный слайд

  // Функция для обновления счётчика
  // Функция для обновления счётчика
  const updateCounter = () => {
    let firstVisibleSlide = ((currentIndex - slidesCount) % slidesCount) + 1;
    if (firstVisibleSlide <= 0) {
      firstVisibleSlide += slidesCount; // Корректируем отрицательные значения
    }

    const lastVisibleSlide = Math.min(firstVisibleSlide + slidesPerMove - 1, slidesCount);

    counterText.innerHTML = ` ${lastVisibleSlide} <span>/ ${slidesCount}</span>`;
  };

  // Устанавливаем позицию слайдера
  const updatePosition = (instant = false) => {
    const slideWidth = slider.clientWidth / slidesPerMove;
    slider.style.transition = instant ? 'none' : 'transform 0.75s ease-in-out';
    slider.style.transform = `translateX(${-currentIndex * slideWidth}px)`;

    // Обновляем счётчик только для оригинальных слайдов
    setTimeout(() => {
      if (currentIndex >= slidesCount && currentIndex < totalSlides - slidesCount) {
        updateCounter();
      }
    }, instant ? 0 : 750); // Задержка для завершения анимации
  };


  // Переход вперёд
  const moveNext = () => {
    if (currentIndex < totalSlides - slidesPerMove) {
      currentIndex += slidesPerMove; // Перемещаемся на количество видимых слайдов
    }
    updatePosition();

    // Если дошли до конца оригинальных слайдов, перескакиваем на начало
    if (currentIndex >= totalSlides - slidesCount) {
      setTimeout(() => {
        slider.style.transition = 'none';
        currentIndex = slidesCount;
        updatePosition(true);
      }, 750); // Время перехода должно совпадать с CSS transition
    }
  };

  // Переход назад
  const movePrev = () => {
    if (currentIndex > 0) {
      currentIndex -= slidesPerMove; // Перемещаемся на количество видимых слайдов
    }
    updatePosition();

    // Если дошли до начала оригинальных слайдов, перескакиваем на конец
    if (currentIndex < slidesCount) {
      setTimeout(() => {
        slider.style.transition = 'none';
        currentIndex = totalSlides - slidesCount - slidesPerMove;
        updatePosition(true);
      }, 500); // Время перехода должно совпадать с CSS transition
    }
  };

  // Обработка начала тач-события
  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX;
    touchDeltaX = 0;
    stopAutoScroll(); // Останавливаем автопрокрутку
  };

  // Обработка движения пальца
  const handleTouchMove = (e) => {
    touchDeltaX = e.touches[0].clientX - touchStartX;
  };

  // Обработка конца тач-события
  const handleTouchEnd = () => {
    if (touchDeltaX > 50) {
      movePrev(); // Свайп вправо — переход назад
    } else if (touchDeltaX < -50) {
      moveNext(); // Свайп влево — переход вперёд
    }
    startAutoScroll(); // Перезапуск автопрокрутки
  };

  // Запуск автопрокрутки
  const startAutoScroll = () => {
    stopAutoScroll(); // Убедимся, что предыдущий интервал очищен
    autoScrollInterval = setInterval(() => {
      moveNext(); // Автоматический переход вперёд
    }, 4000); // Интервал в миллисекундах
  };

  // Остановка автопрокрутки
  const stopAutoScroll = () => {
    clearInterval(autoScrollInterval);
  };

  // Сбрасываем автопрокрутку при взаимодействии пользователя
  const handleUserInteraction = () => {
    stopAutoScroll();
    startAutoScroll();
  };

  // Кнопки навигации
  document.querySelector('.party__btns_next').addEventListener('click', () => {
    moveNext();
    handleUserInteraction(); // Сброс автопрокрутки
  });
  document.querySelector('.party__btns_prev').addEventListener('click', () => {
    movePrev();
    handleUserInteraction(); // Сброс автопрокрутки
  });

  // События тач-пролистывания
  slider.addEventListener('touchstart', handleTouchStart);
  slider.addEventListener('touchmove', handleTouchMove);
  slider.addEventListener('touchend', handleTouchEnd);

  // Инициализация слайдера
  setSlidesPerMove();
  window.addEventListener('resize', setSlidesPerMove);

  // Запускаем автопрокрутку при загрузке
  startAutoScroll();
});

/*  document.addEventListener('DOMContentLoaded', function () {
   const stageSlider = document.querySelector('.stage__wrapper');
   const stageSlides = Array.from(stageSlider.children);
   const stageDotsContainer = document.querySelector('.stage__dots');
   const prevButton = document.querySelector('.stage__btns_prev');
   const nextButton = document.querySelector('.stage__btns_next');
   let stageCurrentIndex = 0;
   let isSliderActive = false;
 
   let startX = 0;
   let currentX = 0;
   let isDragging = false;
 
   // Функция обновления активного слайда
   const updateStageSlides = () => {
     const slideWidth = stageSlider.clientWidth;
     stageSlider.style.transition = 'transform 0.3s ease';
     stageSlider.style.transform = `translateX(${-stageCurrentIndex * slideWidth}px)`;
     stageDots.forEach((dot, index) => {
       dot.classList.toggle('stage__dot_active', index === stageCurrentIndex);
     });
 
     // Отключение кнопок в начале/конце слайдов
     prevButton.disabled = stageCurrentIndex === 0;
     nextButton.disabled = stageCurrentIndex === stageSlides.length - 1;
   };
 
   // Установка ширины слайдов
   const setStageSlidesWidth = () => {
     if (window.innerWidth <= 575) {
       const slideWidth = stageSlider.clientWidth;
       stageSlides.forEach(slide => {
         slide.style.flex = `0 0 ${slideWidth}px`;
       });
       updateStageSlides();
     }
   };
 
   // Создание "дот" для управления слайдером
   const createDots = () => {
     stageDotsContainer.innerHTML = ''; // Очищаем контейнер перед добавлением
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
 
   const stageDots = Array.from(stageDotsContainer.children);
 
   // События для кнопок "назад" и "вперед"
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
 
   // Обработка тач-событий
   const handleTouchStart = (event) => {
     if (!isSliderActive) return;
     startX = event.touches[0].clientX;
     isDragging = true;
     stageSlider.style.transition = 'none'; // Убираем плавность при перемещении
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
 
   // Функция инициализации слайдера
   const initializeSlider = () => {
     if (window.innerWidth <= 574 && !isSliderActive) {
       isSliderActive = true;
       createDots();
       setStageSlidesWidth();
       updateStageSlides();
     } else if (window.innerWidth > 574 && isSliderActive) {
       isSliderActive = false;
       stageSlider.style.transition = 'none';
       stageSlider.style.transform = 'translateX(0)'; // Возвращаем слайдер в начальное положение
       stageSlides.forEach(slide => {
         slide.style.flex = ''; // Убираем фиксированную ширину
       });
       stageDotsContainer.innerHTML = ''; // Очищаем "доты"
     }
   };
 
   // Инициализация и обработка изменения размера экрана
   initializeSlider();
   window.addEventListener('resize', initializeSlider);
 }); */

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

  // Функция обновления активного слайда
  const updateStageSlides = () => {
    const slideWidth = stageSlider.clientWidth;
    stageSlider.style.transition = 'transform 0.3s ease';
    stageSlider.style.transform = `translateX(${-stageCurrentIndex * slideWidth}px)`;

    const stageDots = Array.from(stageDotsContainer.children); // Обновляем массив дотов
    stageDots.forEach((dot, index) => {
      dot.classList.toggle('stage__dot_active', index === stageCurrentIndex);
    });

    // Отключение кнопок в начале/конце слайдов
    prevButton.disabled = stageCurrentIndex === 0;
    nextButton.disabled = stageCurrentIndex === stageSlides.length - 1;
  };

  // Установка ширины слайдов
  const setStageSlidesWidth = () => {
    if (window.innerWidth <= 575) {
      const slideWidth = stageSlider.clientWidth;
      stageSlides.forEach(slide => {
        slide.style.flex = `0 0 ${slideWidth}px`;
      });
      updateStageSlides();
    }
  };

  // Создание "дот" для управления слайдером
  const createDots = () => {
    stageDotsContainer.innerHTML = ''; // Очищаем контейнер перед добавлением
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

  // События для кнопок "назад" и "вперед"
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

  // Обработка тач-событий
  const handleTouchStart = (event) => {
    if (!isSliderActive) return;
    startX = event.touches[0].clientX;
    isDragging = true;
    stageSlider.style.transition = 'none'; // Убираем плавность при перемещении
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

  // Функция инициализации слайдера
  const initializeSlider = () => {
    if (window.innerWidth <= 575 && !isSliderActive) {
      isSliderActive = true;
      createDots();
      setStageSlidesWidth();
      updateStageSlides();
    } else if (window.innerWidth > 575 && isSliderActive) {
      isSliderActive = false;
      stageSlider.style.transition = 'none';
      stageSlider.style.transform = 'translateX(0)'; // Возвращаем слайдер в начальное положение
      stageSlides.forEach(slide => {
        slide.style.flex = ''; // Убираем фиксированную ширину
      });
      stageDotsContainer.innerHTML = ''; // Очищаем "доты"
    }
  };

  // Инициализация и обработка изменения размера экрана
  initializeSlider();
  window.addEventListener('resize', initializeSlider);
});

document.addEventListener('DOMContentLoaded', function () {
  const animatableElements = document.querySelectorAll('.tournament__img');

  function checkVisibility() {
    animatableElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        element.classList.add('tournament__img_visible');
      }
    });
  }

  window.addEventListener('scroll', checkVisibility);
  checkVisibility(); // Проверка на загрузке страницы
});
document.addEventListener('DOMContentLoaded', function () {
  const animatableElements = document.querySelectorAll('.stage__img');

  function checkVisibility() {
    animatableElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        element.classList.add('stage__img_visible');
      }
    });
  }

  window.addEventListener('scroll', checkVisibility);
  checkVisibility(); // Проверка на загрузке страницы
});
document.addEventListener('DOMContentLoaded', function () {
  const animatableElements = document.querySelectorAll('.cick-horse');

  function checkVisibility() {
      animatableElements.forEach(element => {
          const rect = element.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
              element.classList.add('cick-horse_visible');
          }
      });
  }

  window.addEventListener('scroll', checkVisibility);
  checkVisibility(); // Проверка на загрузке страницы
});
