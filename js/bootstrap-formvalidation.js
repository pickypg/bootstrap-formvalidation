!(function($) {

  "use strict"; // jshint ;_;

  /* FORMVALIDATION PUBLIC CLASS DEFINITION
   * ====================================== */
  var FormValidation = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.formValidation.defaults, options)
    this.required = this.options.required || this.$element.is('[required]')
    this.key = this.options.key || this.key
    this.keyup = this.options.keyup || this.keyup
    this.keydown = this.options.keydown || this.keydown
    this.keypress = this.options.keypress || this.keypress
    this.blur = this.options.blur || this.blur
    this.focus = this.options.focus || this.focus
    this.listen = this.options.listen || this.listen
    this.updater = this.options.updater || this.updater
    this.checker = this.options.checker || this.checker
    this.validate = this.options.validate || this.validate
    this.retriever = this.options.retriever || this.retriever
    this.valid = this.options.valid
    if (this.options.pattern) {
      this.pattern = this.options.pattern
    }
    else if (this.$element.attr('pattern')) {
      this.pattern = new RegExp(this.$element.attr('pattern'))
    }
    else if (this.required) {
      this.pattern = /[^\s]+/
    }
    else {
      this.pattern = /[^\s]*/
    }
    this.listen()
    this.validate()
  }

  FormValidation.prototype = {

    constructor: FormValidation

  , listen: function () {
      this.$element
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))
        .on('change',   $.proxy(this.change, this))

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }
    }

  // taken directly from bootstrap-typeahead
  , eventSupported: function(eventName) {
      var isSupported = eventName in this.$element
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;')
        isSupported = typeof this.$element[eventName] === 'function'
      }
      return isSupported
  }

  , updater: function (value) {
      this.$element.parents(".control-group")
        .toggleClass("error", !this.empty && !this.valid)
        .attr('data-valid', this.valid)
    }

  , checker: function (value) {
      return value == ""
    }

  , retriever: function () {
      return this.$element.val()
    }

  , validate: function () {
      var valid = this.valid
        , value = this.retriever()
        , empty = this.checker(value)

      if (value != this.value) {
        this.value = value

        if ($.isFunction(this.pattern)) this.valid = this.pattern(value)
        else this.valid = this.pattern.test(value)

        if (!this.required && this.empty && !this.valid) this.valid = true

        if (this.valid || valid != this.valid || empty != this.empty) {
          this.empty = empty
          this.updater(value)

          this.$element
            .trigger({type: 'validated', validation: this, valid: this.valid})

          if (valid) {
            this.$element.trigger({type: 'validated.valid', validation: this})
          }
          else {
            this.$element.trigger({type: 'validated.invalid', validation: this})
          }
        }
      }
    }

  , keydown: function (e) {
      this.key(e)
    }

  , keypress: function (e) {
      this.key(e)
    }

  , keyup: function (e) {
      this.key(e)
    }

  , key: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
        case 27: // escape
          break

        default:
          this.validate()
      }

      e.stopPropagation()
    }

  , focus: function () {
      this.validate()
    }

  , blur: function () {
      this.validate()
    }

  , change: function () {
      this.validate()
    }
  }

  /* FORMVALIDATION PLUGIN DEFINITION
   * ================================ */
  var old = $.fn.formValidation

  $.fn.formValidation = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('formValidation')
        , options = typeof option == 'object' && option
        if (!data) $this.data('formValidation', (data = new FormValidation($this, options)))
        if (typeof option == 'string') data[option]()
    })
  }

  $.fn.formValidation.defaults = {
    valid: true
  }

  $.fn.formValidation.Constructor = FormValidation

  /* FORMVALIDATION NO CONFLICT
   * ========================== */
  $.fn.formValidation.noConflict = function () {
    $.fn.formValidation = old
    return this
  }

  /* FORMVALIDATION DATA-API
   * ======================= */
  $(document).on('focus.formValidation.data-api', '[data-provide="formValidation"]', function (e) {
    var $this = $(this)
    if ($this.data('formValidation')) return
    $this.formValidation($this.data())
  })

})(window.jQuery);
