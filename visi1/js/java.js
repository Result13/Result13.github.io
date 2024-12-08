
document.addEventListener("DOMContentLoaded", function() {
  
var element = document.getElementById('phone');
  var maskOptions = {
      mask: '+7 (000) 000-00-00',
      lazy: false
  } 
  var mask = IMask(element, maskOptions);
  element.oninput = function() {
    // Сохраняем текущую позицию курсора
    var cursorPos = element.selectionStart;

    // Обновляем значение элемента
    var newValue = element.value;

    // Восстанавливаем позицию курсора
    setTimeout(function() {
        element.setSelectionRange(cursorPos, cursorPos);
    }, 0);
};
});

document.querySelector('.currency_button').addEventListener('click', function() {
  var menu = this.nextElementSibling;
  var img = this.querySelector('.btn_img');
  if (menu.style.display === "none") {
      menu.style.display = "block"; // Показать список валют
      img.src = "/visi1/pictures/Vector.svg"; // Перевернуть картинку
    } else {
      menu.style.display = "none"; // Скрыть список валют
      img.src = "/visi1/pictures/Vectorrot.svg"; // Вернуть картинку в исходное положение
    }
});
var prices = {
  "AED": 2699,
  "USD": 735,
  "RUB": 72012// добавьте здесь цену в рублях
};
// Добавить обработчик событий для каждого элемента списка
document.querySelectorAll('.currency_list li').forEach(function(li) {
  li.addEventListener('click', function() {
    var currencyBlock = this.parentElement.parentElement;
    
    // Изменить название валюты и изображение флага
    var currencyName = this.textContent.trim(); 
    currencyBlock.querySelector('.currency_name').textContent = this.textContent;
    currencyBlock.querySelector('.currency_flag').src = "/visi1/pictures/" + this.textContent+".svg";
    
    // Скрыть список валют
    this.parentElement.style.display = "none";
    
    // Вернуть картинку в исходное положение
    currencyBlock.querySelector('.currency_button .btn_img').src = "/visi1/pictures/Vectorrot.svg";
    document.querySelector('.description_content').textContent = "ОТ " + currencyName + " " + prices[currencyName];
    document.querySelector('.summa').textContent = currencyName + " " + prices[currencyName] + currencyName;
  });
});





  let modalCall  = $("[data-modal]");
  let modalClose  = $("[data-close]");
  modalCall.on("click", function(event) {
    event.preventDefault();

    let $this = $(this);
    let modalId = $this.data('modal');

    $(modalId).addClass('show');
    $("body").addClass('no-scroll');
    });

  modalClose.on("click", function(event) {
    event.preventDefault();

    let $this = $(this);
    let modalParent = $this.parents('.modal');

    modalParent.removeClass('show');
    $("body").removeClass('no-scroll');
    });

$(".modal").on("click", function(event) {
    // Проверяем, был ли клик сделан вне modal_wrapper
    if ($(event.target).closest(".modal_wrapper").length === 0) {
        $(this).removeClass('show');
        $("body").removeClass('no-scroll');
    }
});
  $(".modal_wrapper").on("click", function(event) {
    event.stopPropagation();
    
    });
  $('.close_cons').click(function() {
    $('.modal').removeClass('show');
    $("body").removeClass('no-scroll');
});
/*калькулятор */

document.querySelector('.button_next').addEventListener('click', function() {
  var cards = document.querySelectorAll('.card');
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    if (card.classList.contains('active')) {
      // Находим выбранный радиобаттон
      var selectedRadio = card.querySelector('input[type="radio"]:checked');
      if (selectedRadio) {
        // Извлекаем число из значения радиобаттона
        var radioValue = parseInt(selectedRadio.value);
        if (!isNaN(radioValue)) {
          // Находим блок с суммой
          var summaElement = document.querySelector('.summa');
          // Извлекаем число из текста блока
          var summaValue = parseInt(summaElement.textContent.replace(/\D/g, ''));
          if (!isNaN(summaValue)) {
            // Прибавляем число из значения радиобаттона к числу в блоке сумма
            summaElement.textContent = (summaValue + radioValue) + ' AED';
            document.querySelector('.itog').textContent = summaElement.textContent;
            var product = (summaValue + radioValue) * 0.27;
            var roundedProduct = Math.round(product);
            
            document.querySelector('.itog_usd').textContent = roundedProduct + ' USD';
          }
        }
      }
      card.classList.remove('active');
      if (cards[i + 1]) {
        cards[i + 1].classList.add('active');
        // Если следующий блок - последний, скрываем кнопку и блок с суммой
        if (i + 1 === cards.length - 1) {
          document.querySelector('.button_next').style.display = 'none';
          document.querySelector('.summa_wrapper').style.display = 'none';
        }
      }
      break;
    }
  }
});


document.querySelector('.button_next').addEventListener('click', function() {
  var cards = document.querySelectorAll('.quantity_mobile');
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    if (card.classList.contains('active')) {
      card.classList.remove('active');
      if (cards[i + 1]) {
        cards[i + 1].classList.add('active');
        // Если следующий блок - последний, скрываем кнопку и блок с суммой
        if (i + 1 === cards.length ) {
          document.querySelector('.button_next').style.display = 'none';
          document.querySelector('.summa_wrapper').style.display = 'none';
        }
      }
      break;
    }
  }
});

/*UTM*/
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
Papa.parse("../csv/base.csv", {
  download: true,
  header: true,
  complete: function(results) {
    var titles = {};
    var subtitles = {};
    results.data.forEach(function(row) {
      if (row["UTM"] === "{campaign_id}") {
        titles[row["Number"]] = row["Title"];
      } else if (row["UTM"] === "{region_id}") {
        subtitles[row["Number"]] = row["Title"];
      } else if (row["UTM"] === "{keyword}") {
        titles[row["Number"]] = row["Title"];
      }
    });

    // Получить параметры 'campaign_id' и 'region_id' из URL
    var campaign_id = getParameterByName('campaign_id');
    var region_id = getParameterByName('region_id');
    var keyword_id = getParameterByName('keyword_id');
    // Если номер существует в словаре, изменить текст заголовка
    if (titles.hasOwnProperty(campaign_id)) {
      var title = titles[campaign_id];
      document.querySelector('.description_tittle h1').textContent = titles[campaign_id];
      if (title === "") {
        document.querySelector('.description_subtittle').style.display = 'none';
      }
    }
    // Если номер существует в словаре, изменить текст заголовка
    if (titles.hasOwnProperty(keyword_id)) {
      var title = titles[keyword_id];
      document.querySelector('.description_tittle h1').textContent = titles[keyword_id];
      if (title === "") {
        document.querySelector('.description_subtittle').style.display = 'none';
      }
    }

    // Если номер существует в словаре, изменить текст подзаголовка
    if (subtitles.hasOwnProperty(region_id)) {
      var subtitle = subtitles[region_id];
      document.querySelector('.subtittle_text').textContent = ' ';
      document.querySelector('.subtittle_text').textContent = subtitles[region_id];
      if (subtitle === "") {
        document.querySelector('.description_subtittle').style.display = 'none';
      }
    }
  }
});