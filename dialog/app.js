/*Fixed Header*/
$(function(){
  /* let header=$("#header");
  let intro=$("#intro");
  let introH;
  let scrollPos = $(window).scrollTop();

  $(window).on("scroll load resize", function(){
    introH = intro.innerHeight();
    scrollPos=$(this).scrollTop();
    nav.removeClass("show")
    if(scrollPos>introH){
      header.addClass("fixed");
    } 
    else{
      header.removeClass("fixed");
    }
  });
$("[data-targer").on("click", function(event){
  event.preventDefault();
  let ID = $(this).data("data-target");

});*/

  let nav = $("#nav");
  let navToggle = $("#navToggle");
  navToggle.on("click", function(event){
    event.preventDefault();
    nav.toggleClass("show");

  })

  nav.on("click",  function(event){
  
  nav.removeClass("show");
    
  })
  /* modal*/
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
    
    $(this).removeClass('show');
    $("body").removeClass('no-scroll');
    });
  $(".modal_dialog").on("click", function(event) {
    event.stopPropagation();
    
    });

  $('.t img').click(function() {
    let src = $(this).attr('src');
    $('.lic_slider img').attr('src',src);
    $('.lic_slider').fadeIn();    
});
$('.close').click(function() {
    $('.lic_slider').fadeOut();
});
  $('.btn-next').click(function(){
  
    document.getElementById("image").src="pictures/Сертификат2.png";
    
    
  })
  $('.btn-back').click(function(){
  
    document.getElementById("image").src="pictures/Сертификат.png";
  })
     
});