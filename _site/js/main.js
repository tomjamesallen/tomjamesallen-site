var parallax = basicScrollParallax({
  el: '.bg-img',
  posEffectLevel: 0.3,
  enabled: function () {
    if ($(window).width() <= 1024) {
      return false;
    }
    else {
      return true;
    }
  }
});