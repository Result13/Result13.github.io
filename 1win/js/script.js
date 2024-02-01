window.onload = function() {
  $('.slider').slick({
    arrows:false,
    dots: false,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: false
    
  });}

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
