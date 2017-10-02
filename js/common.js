$(function() {

    $('.owl-reviews').owlCarousel({
    loop: true,
    nav: true,
    smartSpeed: 700,
    navText: ['<svg class="icon icon-left"><use xlink:href="img/sprite.svg#left-arrow"></use></svg>', '<svg class="icon icon-right"><use xlink:href="img/sprite.svg#right-arrow"></use></svg>'],
    responsiveClass: true,
    dots: false,
    items: 1,

  });


  $('.top').click(function() {
    $('html, body').stop().animate({scrollTop: 0}, 1200);
  });

  $(window).scroll(function () {
    if ($(this).scrollTop() > 1500) {
      $('.top').addClass("active");
    } else {
      $('.top').removeClass("active");
    }
  });
    
});