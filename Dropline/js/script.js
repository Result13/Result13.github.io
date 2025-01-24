/* function init() {
    // Инициализация карты
    const map = new ymaps.Map('map', {
      center: [59.99099806412031,30.275740499999888],
      zoom: 16,
      controls: ['zoomControl', 'typeSelector'], // Добавляем только нужные элементы управления
    });

    // Стилизация карты
    map.setType('yandex#map'); // Тип карты
    map.panes.get('ground').getElement().style.filter = 'grayscale(1) brightness(0.6) sepia(1) hue-rotate(180deg)'; // Пример кастомной цветовой гаммы (616b83).

    // Добавление кастомной метки
    const placemark = new ymaps.Placemark(
        [59.99099806412031,30.2757083134917], // Координаты метки
      {
        hintContent: 'DropLine',
        balloonContent: 'Описание метки',
      },
      {
        iconLayout: 'default#image', // Тип кастомной иконки
        iconImageHref: './pictures/metka.png', // Путь к иконке
        iconImageSize: [256, 294], // Размер иконки
        iconImageOffset: [0, 0], // Смещение иконки
      }
    );
    map.geoObjects.add(placemark); // Добавляем метку на карту
  }

  ymaps.ready(init); // Ожидаем загрузки API перед вызовом функции

 */

/* 'zoomControl', 'typeSelector' */
/*   function init() {

    // Инициализация карты
    const map = new ymaps.Map('map', {
      center: [59.99098890382482,30.27577751455827], // Координаты центра карты
      zoom: 18,
      controls: [], // Добавляем только нужные элементы управления
    });

    // Стилизация карты
    map.setType('yandex#map'); // Тип карты
    map.panes.get('ground').getElement().style.filter = 'grayscale(1) brightness(0.6) sepia(1) hue-rotate(180deg)'; // Пример кастомной цветовой гаммы

    // Добавление кастомной метки
    const placemark = new ymaps.Placemark(
        [59.99098890382482,30.27577751455827], // Координаты метки
      {
        hintContent: 'DropLine',
        balloonContent: 'Описание метки',
      },
      {
        iconLayout: 'default#image', // Тип кастомной иконки
        iconImageHref: './pictures/metka.png', // Путь к иконке
        iconImageSize: [256, 294], // Размер иконки
        iconImageOffset: [-120, -220], // Смещение иконки (отрицательное смещение для того, чтобы иконка была выше координат)
      }
    );
    
    // Добавляем метку на карту
    map.geoObjects.add(placemark);
}

ymaps.ready(init); // Ожидаем загрузки API перед вызовом функции
 */


/* function init() {
    // Инициализация карты без элементов управления
    const map = new ymaps.Map('map', {
        center: [59.990895427125096,30.274076776560197], // Координаты центра карты
        zoom: 18,
      controls: [] // Отключаем все элементы управления
    });

    // Стилизация карты
    map.setType('yandex#map'); // Тип карты
    map.panes.get('ground').getElement().style.filter = 'grayscale(1) brightness(0.35) contrast(1.5) sepia(1) hue-rotate(180deg)';

    // Наложение темно-синего цвета на карту
    map.panes.get('ground').getElement().style.backgroundColor = '#1c2231'; // Наложение цвета
    map.panes.get('ground').getElement().style.mixBlendMode = 'multiply'; // Используем blend mode для наложения

    // Добавление кастомной метки
    const placemark = new ymaps.Placemark(
       [59.990895427125096,30.274076776560197], // Координаты метки
      {
        hintContent: 'DropLine',
        balloonContent: 'Описание метки',
      },
      {
        iconLayout: 'default#image', // Тип кастомной иконки
        iconImageHref: './pictures/metka.png', // Путь к иконке
        iconImageSize: [256, 294], // Размер иконки
        iconImageOffset: [180, -245], // Смещение иконки
      }
    );
    
    // Добавляем метку на карту
    map.geoObjects.add(placemark);
    


}

ymaps.ready(init); // Ожидаем загрузки API перед вызовом функции */   

function init() {
  // Инициализация карты без элементов управления
  const map = new ymaps.Map('map', {
      center: [59.990895427125096, 30.274076776560197], // Начальные координаты центра карты
      zoom: 18,
      controls: [] // Отключаем все элементы управления
  });

  // Стилизация карты
  map.setType('yandex#map'); // Тип карты
  map.panes.get('ground').getElement().style.filter = 'grayscale(1) brightness(0.35) contrast(1.5) sepia(1) hue-rotate(180deg)';
  map.panes.get('ground').getElement().style.backgroundColor = '#1c2231'; // Наложение цвета
  map.panes.get('ground').getElement().style.mixBlendMode = 'multiply'; // Используем blend mode для наложения

  // Настройки для центра карты и маркера
  const settings = {
      default: {
          mapCenter: [59.990895427125096, 30.274076776560197],
          markerCoordinates: [59.990895427125096, 30.274076776560197],
          markerSize: [256, 294],
          markerOffset: [180, -245]
      },
      768: {
          mapCenter: [59.990860, 30.274700],
          markerCoordinates: [59.990900, 30.274550],
          markerSize: [200, 230],
          markerOffset: [100, -200]
      },
      576: {
          mapCenter: [59.990830, 30.274520],
          markerCoordinates: [59.990830, 30.275000],
          markerSize: [150, 180],
          markerOffset: [75, -150]
      },
      520: {
          mapCenter: [59.991100, 30.275790],
          markerCoordinates: [59.990945, 30.275105],
          markerSize: [120, 140],
          markerOffset: [60, -120]
      }
  };

  // Функция для получения настроек в зависимости от ширины экрана
  function getSettings() {
      const width = window.innerWidth;

      if (width <= 520) {
          return settings[520];
      } else if (width <= 576) {
          return settings[576];
      } else if (width <= 768) {
          return settings[768];
      }
      return settings.default;
  }

  // Устанавливаем начальные настройки карты и маркера
  const initialSettings = getSettings();

  map.setCenter(initialSettings.mapCenter); // Устанавливаем начальный центр карты

  const placemark = new ymaps.Placemark(
      initialSettings.markerCoordinates,
      {
          hintContent: 'DropLine',
          balloonContent: 'Описание метки',
      },
      {
          iconLayout: 'default#image', // Тип кастомной иконки
          iconImageHref: './pictures/metka.png', // Путь к иконке
          iconImageSize: initialSettings.markerSize, // Размер иконки
          iconImageOffset: initialSettings.markerOffset, // Смещение иконки
      }
  );

  // Добавляем метку на карту
  map.geoObjects.add(placemark);

  // Функция для обновления центра карты и настроек маркера при изменении размеров окна
  function updateMapAndMarker() {
      const currentSettings = getSettings();

      // Обновляем центр карты
      map.setCenter(currentSettings.mapCenter);

      // Обновляем координаты, размеры и смещение маркера
      placemark.geometry.setCoordinates(currentSettings.markerCoordinates);
      placemark.options.set({
          iconImageSize: currentSettings.markerSize,
          iconImageOffset: currentSettings.markerOffset
      });
  }

  // Добавляем слушатель изменения размера окна
  window.addEventListener('resize', updateMapAndMarker);
}

ymaps.ready(init); // Ожидаем загрузки API перед вызовом функции




$(function () {
  let nav = $(".mobile__menu");
  let navToggle = $(".burger-menu");
  let body = $("body");

  navToggle.on("click", function (event) {
    event.preventDefault();
    nav.toggleClass("mobile__menu_active");
    navToggle.toggleClass("burger-menu_active");
    body.toggleClass("no-scroll");
  });

  nav.on("click", function (event) {
    nav.removeClass("mobile__menu_active");
    navToggle.removeClass("burger-menu_active");
    body.removeClass("no-scroll");
  });
});