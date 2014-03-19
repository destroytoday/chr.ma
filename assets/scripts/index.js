(function() {
  $(function() {
    var $deviceForegroundList, $doc, $figDevice, $figures, $figuresBlurred, $listItems, $signupForm, $window, ANGLES_WIDTH, NUM_ANGLES, ease, index, isMobile, pindex, resizeHandler, scrollHandler, signupHandler, tickCarousel;
    $doc = $(document);
    $window = $(window);
    $deviceForegroundList = $('.device-foreground-list');
    $listItems = $('.list li');
    $figDevice = $('#fig-device');
    $figures = $('#figures');
    $figuresBlurred = $('#figures-blurred');
    $signupForm = $('.signup-form');
    NUM_ANGLES = 5;
    ANGLES_WIDTH = 1419;
    index = 1;
    pindex = 1;
    isMobile = window.innerWidth < 1024;
    ease = function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t + b;
      } else {
        return c / 2 * ((t -= 2) * t * t + 2) + b;
      }
    };
    scrollHandler = function(e) {
      var adjustedRatio, ex, po, ratio, scroll, sx, x;
      if (!isMobile) {
        po = $figDevice.offset();
        scroll = ($window.scrollTop() + $window.height()) - (po.top + $figDevice.height() / 2);
        ratio = scroll / ($window.height() + $figDevice.height() / 2);
        if (ratio >= 0 && ratio < 1) {
          sx = (Math.floor(ratio * NUM_ANGLES) / NUM_ANGLES) * -ANGLES_WIDTH;
          ex = (Math.ceil(ratio * NUM_ANGLES) / NUM_ANGLES) * -ANGLES_WIDTH;
          adjustedRatio = ratio * NUM_ANGLES - Math.floor(ratio * NUM_ANGLES);
          x = ease(adjustedRatio, sx, (ex - sx) * adjustedRatio, 1);
          $figuresBlurred.css('transform', "translateX(" + x + "px)");
          return $figures.css('transform', "translateX(" + x + "px)");
        }
      }
    };
    resizeHandler = function(e) {
      if (window.innerWidth >= 1024 && isMobile) {
        isMobile = false;
      } else if (window.innerWidth < 1024 && !isMobile) {
        isMobile = true;
        $figuresBlurred.css('transform', 'translateX(0)');
        $figures.css('transform', 'translateX(0)');
      }
      return scrollHandler();
    };
    signupHandler = function(e) {
      var $emailInput, $form, $message, $section, $submitButton;
      e.preventDefault();
      $form = $(e.currentTarget);
      $section = $form.parent();
      $message = $section.find('.copy p');
      $emailInput = $form.find('input[name=email]');
      $submitButton = $form.find('input[type=submit]');
      $form.prop('disabled', true);
      $emailInput.prop('disabled', true);
      $submitButton.prop('disabled', true);
      return $.ajax({
        type: 'POST',
        url: $form.attr('action'),
        data: {
          'email': $emailInput.val()
        },
        statusCode: {
          201: function() {
            $message.text('Thanks for signing up!');
            return $section.addClass('is-submitted');
          },
          400: function() {
            $message.text('Looks like your email is invalid. Try again.');
            return $section.removeClass('is-loading');
          },
          409: function() {
            $message.text('Looks like you already signed up.');
            return $section.addClass('is-submitted');
          }
        }
      }).always(function() {
        $form.prop('disabled', false);
        $emailInput.prop('disabled', false);
        return $submitButton.prop('disabled', false);
      });
    };
    tickCarousel = function() {
      if (index < 3) {
        index++;
      } else {
        index = 1;
      }
      $listItems.removeClass('is-selected');
      $(".list li:nth-child(" + index + ")").addClass('is-selected');
      $deviceForegroundList.removeClass("is-selected-" + pindex).addClass("is-selected-" + index);
      return pindex = index;
    };
    $doc.on('scroll', scrollHandler);
    $window.on('resize', resizeHandler);
    $signupForm.on('submit', signupHandler);
    return setInterval(tickCarousel, 4000);
  });

}).call(this);
