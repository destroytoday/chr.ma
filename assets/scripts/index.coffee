$ ->
  $doc = $(document)
  $window = $(window)

  $deviceForegroundList = $('.device-foreground-list')
  $listItems = $('.list li')
  $figDevice = $('#fig-device')
  $figures = $('#figures')
  $figuresBlurred = $('#figures-blurred')
  $signupForm = $('.signup-form')

  NUM_ANGLES = 5
  ANGLES_WIDTH = 1419

  index = 1
  pindex = 1

  isMobile = window.innerWidth < 1024

  ease = (t, b, c, d) ->
    if ((t /= d / 2) < 1)
      c / 2 * t * t * t + b
    else
      c / 2 * ((t -= 2) * t * t + 2) + b

  scrollHandler = (e) ->
    if !isMobile
      po = $figDevice.offset()
      scroll = ($window.scrollTop() + $window.height()) - (po.top + $figDevice.height() / 2)
      ratio = scroll / ($window.height() + $figDevice.height() / 2)

      if ratio >= 0 && ratio < 1
        sx = (Math.floor(ratio * NUM_ANGLES)/NUM_ANGLES) * -ANGLES_WIDTH
        ex = (Math.ceil(ratio * NUM_ANGLES)/NUM_ANGLES) * -ANGLES_WIDTH

        adjustedRatio = ratio * NUM_ANGLES - Math.floor(ratio * NUM_ANGLES)
        x = ease(adjustedRatio, sx, (ex - sx) * adjustedRatio, 1)

        $figuresBlurred.css('transform', "translateX(#{x}px)")
        $figures.css('transform', "translateX(#{x}px)")

  resizeHandler = (e) ->
    if window.innerWidth >= 1024 && isMobile
      isMobile = false
    else if window.innerWidth < 1024 && !isMobile
      isMobile = true
      $figuresBlurred.css('transform', 'translateX(0)')
      $figures.css('transform', 'translateX(0)')

    scrollHandler()

  signupHandler = (e) ->
    e.preventDefault()

    $form = $(e.currentTarget)
    $section = $form.parent()
    $message = $section.find('.copy p')
    $emailInput = $form.find('input[name=email]')
    $submitButton = $form.find('input[type=submit]')

    $form.prop('disabled', true)
    $emailInput.prop('disabled', true)
    $submitButton.prop('disabled', true)

    $.ajax(
      type: 'POST'
      url: $form.attr('action')
      data:
        'email': $emailInput.val()
      statusCode:
        201: ->
          $message.text('Thanks for signing up!')
          $section.addClass('is-submitted')
        400: ->
          $message.text('Looks like your email is invalid. Try again.')
          $section.removeClass('is-loading')
        409: ->
          $message.text('Looks like you already signed up.')
          $section.addClass('is-submitted')
    ).always(->
      $form.prop('disabled', false)
      $emailInput.prop('disabled', false)
      $submitButton.prop('disabled', false)
    )

  tickCarousel = ->
    if index < 3 then index++ else index = 1

    $listItems.removeClass('is-selected')
    $(".list li:nth-child(#{index})").addClass('is-selected')

    $deviceForegroundList.removeClass("is-selected-#{pindex}").addClass("is-selected-#{index}")
    pindex = index

  $doc.on('scroll', scrollHandler)
  $window.on('resize', resizeHandler)
  $signupForm.on('submit', signupHandler)

  setInterval(tickCarousel, 4000)
