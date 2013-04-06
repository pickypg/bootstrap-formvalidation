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
    this.$element = $(element)
    this.options = $.extend({}, $.fn.formControl.defaults, options)
    this.name = this.options.name || this.$element.data('name') || this.$element.attr('id')
    this.ready = this.options.ready || this.$element.data('ready') || this.ready
    this.add = this.options.add || this.add
    this.remove = this.options.remove || this.remove
    this.validated = this.options.validated || this.validated
    this.updater = this.options.updater || this.updater
    this.add($('[data-control="' + this.name + '"]'))
  }

  FormControl.prototype = {

    constructor: FormControl

  , add: function ($controls) {
      $controls.on('validated.formControl', $.proxy(this.validated, this))
    }

  , remove: function ($controls) {
      $controls.off('validated.formControl')
    }

  , validated: function (e) {
      var ready = this.ready()
        , name = e.validation.$element.attr('id')
        , index = $.inArray(name, this.invalid)
        , invalid = index > -1

      if (e.valid == invalid) {
        if (e.valid && invalid) this.invalid.splice(index, 1)
        else if (!e.valid && !invalid) this.invalid.push(name)

        if (ready != this.ready()) this.updater(!ready)
      }
    }

  , updater: function (ready) {
      // setting both attr and data because a bug sometimes does not have it
      //  load
      this.$element
        .toggleClass('success', ready)
        .toggleClass('error', !ready)
        .attr('data-ready', ready).data('ready', ready)
        .trigger('validated.ready', {control: this})
    }

  , ready: function () {
      return this.invalid.length == 0
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
  $(document).on('focus.formControl.data-api', '[data-provide="formControl"]', function (e) {
    var $this = $(this)
    if ($this.data('formControl')) return
    $this.formControl($this.data())
  })

})(window.jQuery);
