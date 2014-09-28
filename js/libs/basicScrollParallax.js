/**
 * basicScrollParallax.
 *
 * Lightweight plugin for applying a parallax to element.
 * Most useful for the subtle header image parallax effect.
 */

(function (window, $) {

  var basicScrollParallax = function (options, initOnAssign) {
    var api = {
      $el: null,
      enabled: false,
      _log: [],
      _values: {
        posOffset: 0,
        opacity: 1,
      },
    }, op;

    // Establish plugin defaults.
    var defaults = {
      // The element to apply the effect to.
      el: '.scroll-parallax-element',

      // Whether the plugin is enabled. This can be a bool or a function
      // returning a bool.
      enabled: true,

      // Whether to reset the properties if the plugin is disabled.
      resetPropsOnDisable: true,

      // Whether to animate the position of the element.
      animatePos: true,

      // A float between 0 and 1. 0 being the least, and 1 being the most.
      posEffectLevel: 0.4,

      // Whether to animate the opacity of the element.
      animateOpacity: true,

      // The level by which to dip the opacity. 0 being the least, 1 being the most.
      opacityEffectLevel: 1,

      // Whether to use the elements position on the page to determine it's
      // starting position, such that it's correctly positioned when in the
      // center of the viewport. TODO: better explanation.
      offSetStartValues: true,

      // Offset start values based on center of viewport or top of viewport.
      // Options: 'top', 'middle', 'bottom'
      offSetStartValuesRef: 'top',
    };

    // Set options to empty object if not set.
    if (typeof(options) == "undefined" || options === null) { options = {}; }

    api.init = function () {
      api.options = $.extend(defaults, options);
      op = api.options;

      // If our element is undefined then return here.
      if (typeof op.el === 'undefined') {
        api._log.push("Will not enable as 'el' is undefined");
        return;
      }

      // If no element is found matching our selector then return here.
      if ($(op.el).length === 0) {
        api._log.push("Will not enable as no elements match 'el'");
        return;
      }

      // Set the $el property on the api.
      api.$el = $(op.el);

      // Call the position element function.
      api._updateElProps();

      api._bindEvents();
    };

    /**
     * Update the element properties.
     */
    api._updateElProps = function () {
      window.requestAnimationFrame(function () {
        api._checkEnabled();
        api._calculatePosOffset();
        api._calculateOpacity();
      });
    };

    api._calculatePosOffset = function () {
      var scrollPos = $(window).scrollTop(),
          offSet = 0,
          viewPortHeight = $(window).height();
      
      if (api.enabled) {
        if (op.offSetStartValues) {
          // Get the offset of the element's parent.
          offSet = api.$el.parent().offset().top;
          
          // If we are using the middle of the viewport as a reference position
          // then we need to decrease the offset by half the height of the 
          // viewport.
          if (op.offSetStartValuesRef === 'middle') {
            offSet -= viewPortHeight / 2;
          }
          // Else if we are using the bottom of the viewport as a reference
          // position then we need to decrease the offset by the height of the 
          // viewport.
          else if (op.offSetStartValuesRef === 'bottom') {
            offSet -= viewPortHeight;
          }
        }

        // Reduce the effect by one over the effect amount.
        var posOffset = (scrollPos - offSet) / (1 / op.posEffectLevel);

        // Set the posOffset value.
        api._values.posOffset = posOffset;
      }
      else {
        // Else if we are resetting, then reset, otherwise do nothing.
        if (op.resetPropsOnDisable) {
          api._values.posOffset = 0;
        }
      }

      // Call the set function to apply the new position.
      api._setPosOffset();
    };

    api._calculateOpacity = function () {
      var scrollPos = $(window).scrollTop(),
          offSet = 0,
          viewPortHeight = $(window).height();
      if (api.enabled) {
        // If active, we need to calculat the difference between, either the
        // top, middle or bottom of the viewport, and the element. The effect
        // should be relative to the height of the viewport, such that an 
        // opacityEffectLevel value of 1 should result in the element being
        // completely faded out at the edge of the viewport.

        // TODO.
      }
      else {
        // Else if we are resetting, then reset, otherwise do nothing.
        if (op.resetPropsOnDisable) {
          api._values.opacity = 1;
        }
      }
      api._setOpacity();
    };

    api._setPosOffset = function () {
      api.$el.css({
        '-webkit-transform': 'translate(0,' + api._values.posOffset + 'px)',
        '-moz-transform': 'translate(0,' + api._values.posOffset + 'px)',
        '-ms-transform': 'translate(0,' + api._values.posOffset + 'px)',
        '-o-transform': 'translate(0,' + api._values.posOffset + 'px)',
        'transform': 'translate(0,' + api._values.posOffset + 'px)',
      });
    };

    api._setOpacity = function () {
      api.$el.css({
        'opacity': api._values.opacity,
      });
    };

    /**
     * Funciton to check whether the plugin is enabled.
     *
     * The function updates the state of the plugin, as well as calling
     * api._enable() or api._disable() if the state has changed.
     * 
     * This function returns the state of the plugin.
     */
    api._checkEnabled = function () {
      var enabled = false;
      if (typeof op.enabled === 'function' && op.enabled()) {
        enabled = true;
      }
      else if (typeof op.enabled === 'boolean' && op.enabled) {
        enabled = true;
      }
      if (enabled !== api.enabled) {
        if (enabled) { api._enable(); }
        else { api._disable(); }
        api.enabled = enabled;
      }
      return enabled;
    }

    api._enable = function () {
      api.$el.addClass('bsp-enabled');
    };

    api._disable = function () {
      api.$el.addClass('bsp-disabled');
    };

    api._bindEvents = function () {
      $(window).scroll(function () {
        api._updateElProps();
      });
      $(window).resize(function () {
        api._updateElProps();
      });
    };

    /**
     * Public function to update position manually.
     *
     * Will return the current state of the plugin.
     */
    api.update = function () {
      api._updateElProps();
      return api.enabled;
    };

    if (initOnAssign === undefined || initOnAssign === null || initOnAssign === true) {
      api.init();
    }
    
    return api;
  };

  window.basicScrollParallax = basicScrollParallax;

})(window, jQuery);
