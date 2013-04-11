/* =============================================================
 * bootstrap-formcontrol.js v0.1
 * https://github.com/pickypg/bootstrap-formvalidation/edit/master/js/bootstrap-formcontrol.js
 * =============================================================
 * Copyright 2013 Chris Earle
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */
!(function($) {

  "use strict"; // jshint ;_;

  /* FORMCONTROL PUBLIC CLASS DEFINITION
   * =================================== */
  var FormControl = function (element, options) {
    this.invalid = []
    this.$elements = []
    this.$element = $(element)
    this.options = $.extend({}, $.fn.formControl.defaults, options)
    this.name = this.options.name || this.$element.data('name') || this.$element.attr('id')
    this.ready = this.options.ready || this.ready
    this.add = this.options.add || this.add
    this.remove = this.options.remove || this.remove
    this.validated = this.options.validated || this.validated
    this.invalidate = this.options.invalidate || this.invalidate
    this.updater = this.options.updater || this.updater
    this.namer = this.options.namer || this.namer
    this.add($('[data-control="' + this.name + '"]'))
  }

  FormControl.prototype = {

    constructor: FormControl

  , add: function ($controls) {
      $controls.on('validated.formControl', $.proxy(this.validated, this))
    }

  , remove: function ($controls) {
      var that = this
      $controls.off('validated.formControl').each(function() {
        var name = that.namer($(this))
          , index = $.inArray(name, that.invalid)

        if (index > -1) {
            that.invalid.splice(index, 1)
            that.$elements.splice(index, 1)
        }
      })
    }

  , validated: function (e) {
      var ready = this.ready()
        , $element = e.validation.$element
        , name = this.namer($element)
        , index = $.inArray(name, this.invalid)
        , invalid = index > -1

      if (e.valid === invalid) {
        if (e.valid && invalid) {
            this.invalid.splice(index, 1)
            this.$elements.splice(index, 1)
        }
        else if (!e.valid && !invalid) {
            this.invalid.push(name)
            this.$elements.push($element)
        }

        if (ready !== this.ready()) this.updater(!ready)
      }
    }

  , updater: function (ready) {
      // setting both attr and data because JQuery does not pick up 'data'
      //  from attributes that get set by attr after adding to the DOM
      this.$element
        .toggleClass('success', ready)
        .toggleClass('error', !ready)
        .attr('data-ready', ready).data('ready', ready)
        .trigger('validatedReady', {control: this, ready: ready})
    }

  , namer: function ($element) {
      return $element.attr('name') || $element.attr('id')
    }

  , ready: function () {
      return this.invalid.length === 0
    }

  , invalidate: function () {
      return $.each(this.$elements, function() {
        $(this).formValidation('invalidate')
      })
    }
  }

  /* FORMCONTROL PLUGIN DEFINITION
   * ============================= */
  var old = $.fn.formControl

  $.fn.formControl = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('formControl')
        , options = typeof option == 'object' && option
      if (!data) {
        $this.data('formControl', (data = new FormControl(this, options)))
      }
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.formControl.defaults = {}

  $.fn.formControl.Constructor = FormControl

  /* FORMCONTROL NO CONFLICT
   * ======================= */
  $.fn.formControl.noConflict = function () {
    $.fn.formControl = old
    return this
  }

  /* FORMCONTROL DATA-API
   * ==================== */
  $(document).find('[data-provide*="formControl"]').each(function () {
    $(this).formControl()
  })

})(window.jQuery);
