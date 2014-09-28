var parallax = basicScrollParallax({
  el: '.bg-img',
  posEffectLevel: 0.3,
  enabled: function () {
    if ($(window).width() < 800) {
      return false;
    }
    else {
      return true;
    }
  }
});