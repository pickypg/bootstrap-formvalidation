/* =============================================================
 * bootstrap-formvalidation.js v0.1
 * https://github.com/pickypg/bootstrap-formvalidation/edit/master/js/bootstrap-formvalidation.js
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

  /* FORMVALIDATION PUBLIC CLASS DEFINITION
   * ====================================== */
  var FormValidation = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.formValidation.defaults, options)
    this.required = this.options.required || this.$element.is('[required]')
    this.multi = this.options.multi || this.$element.is("[type='radio']")
    this.name = this.options.name || this.$element.data('name') || ""
    this.match = this.options.match || this.$element.data('match')
    this.object = this.options.object
    this.key = this.options.key || this.key
    this.keyup = this.options.keyup || this.keyup
    this.keydown = this.options.keydown || this.keydown
    this.keypress = this.options.keypress || this.keypress
    this.blur = this.options.blur || this.blur
    this.focus = this.options.focus || this.focus
    this.setup = this.options.setup || this.setup
    this.listen = this.options.listen || this.listen
    this.updater = this.options.updater || this.updater
    this.checker = this.options.checker || this.checker
    this.validate = this.options.validate || this.validate
    this.invalidate = this.options.invalidate || this.invalidate
    this.retriever = this.options.retriever || this.retriever
    this.elementUpdater = this.options.elementUpdater || this.elementUpdater
    this.singleRetriever = this.options.singleRetriever || this.singleRetriever
    this.multiRetriever = this.options.multiRetriever || this.multiRetriever
    this.matchRetriever = this.options.matchRetriever || this.matchRetriever
    this.updateable = this.options.updateable || this.updateable
    this.objectUpdater = this.options.objectUpdater || this.objectUpdater
    this.trimmer = this.options.trimmer || this.trimmer
    this.objectNames = this.options.objectNames || this.objectNames
    this.matchTest = this.options.matchTest || this.matchTest
    this.test = this.options.test || this.test
    this.equals = this.options.equals || this.equals
    this.setupListeners = this.options.setupListeners || this.setupListeners
    this.unwireListeners = this.options.unwireListeners || this.unwireListeners
    this.check = this.options.check
    this.valid = this.options.valid
    this.matchValid = this.options.matchValid
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
    this.setup()
    this.listen()
    this.validate()
  }

  FormValidation.prototype = {

    constructor: FormValidation

  , setupListeners: function ($element, plugin) {
      $element
        .on('focus' + plugin,    $.proxy(this.focus, this))
        .on('blur' + plugin,     $.proxy(this.blur, this))
        .on('keypress' + plugin, $.proxy(this.keypress, this))
        .on('keyup' + plugin,    $.proxy(this.keyup, this))
        .on('change' + plugin,   $.proxy(this.change, this))

      if (this.eventSupported('keydown')) {
        $element.on('keydown' + plugin, $.proxy(this.keydown, this))
      }
    }

  , unwireListeners: function ($element, plugin) {
      $element
        .off('focus' + plugin)
        .off('blur' + plugin)
        .off('keypress' + plugin)
        .off('keyup' + plugin)
        .off('keydown' + plugin)
        .off('change' + plugin)
    }

  , setup: function() {
      if (this.match) {
        this.$match = this.options.$match || $("#" + this.match)
        this.setupListeners(this.$match, '.formValidationMatch')
      }
    }

  , listen: function () {
      this.setupListeners(this.$element, '.formValidation')
    }

  , unwire: function () {
      this.unwireListeners(this.$element, '.formValidation')

      if (this.$match) this.unwireListeners(this.$match, '.formValidationMatch')
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

  , invalidate: function () {
      this.elementUpdater(this.$element, true)
    }

  , elementUpdater: function ($element, error) {
      $element.parents(".control-group")
        .toggleClass("error", error)
        .attr('data-valid', this.valid).data('valid', this.valid)
    }

  , updater: function (value) {
      this.elementUpdater(this.$element, !this.empty && !this.valid)

      if (this.$match) this.elementUpdater(this.$match, !this.matchValid)

      if (this.valid && this.updateable()) this.objectUpdater(value)
    }

  , updateable: function () {
      return this.name !== ""
   }

  , objectNames: function () {
      return this.name.split(/[:\.]/)
    }

  , trimmer: function (value) {
      return $.trim(value)
    }

  , objectUpdater: function (value) {
      var object = this.object
        , names = this.objectNames()
        , length = names.length - 1
        , i = 0

      for ( ; i < length; ++i) {
        if (object[names[i]] === undefined) object[names[i]] = {}
        object = object[names[i]]
      }

      object[names[length]] = this.trimmer(value)
    }

  , checker: function (value) {
      return this.equals(value, "")
    }

  , multiRetriever: function () {
      var checked = $("[name='" + this.$element.attr('name') + "']:checked")
      return checked.length ? checked.val() : ""
    }

  , singleRetriever: function () {
      if (this.$element.is("[type='checkbox']")) {
        return this.$element.is(":checked") ? this.$element.val() : ""
      }
      else return this.$element.val()
    }

  , matchRetriever: function () {
      return this.$match.val()
    }

  , retriever: function () {
      var value

      if (this.multi) value = this.multiRetriever()
      else value = this.singleRetriever()

      return value
    }

  , matchTest: function (value) {
      return this.equals(this.matchRetriever(), value)
    }

  , test: function (value) {
      var valid

      if ($.isFunction(this.pattern)) valid = this.pattern(value)
      else valid = this.pattern.test(value)

      return valid
    }

  , validate: function () {
      var valid = this.valid
        , value = this.retriever()
        , empty = this.checker(value)

      // matching ignores the short-circuiting of no value changes to avoid
      //  complexities related to unknown details about matching that can be
      //  quickly overridden in this.test(...)
      // check allows one to skip the short circuiting without requiring match
      //  behavior to be overridden
      if (this.match || this.check || !this.equals(value, this.value)) {
        this.valid = this.test(value)
        this.value = value

        if (this.match) {
          this.matchValid = this.matchTest(value)
        }

        // optional fields can be empty
        if (!this.required && this.empty && !this.valid) this.valid = true

        // if it's valid, always update (triggers)
        // if it was valid, and no longer is, then update
        // if it was empty, but no longer is, then update (triggers)
        if (this.valid || valid || empty != this.empty) {
          this.empty = empty

          this.updater(value)

          // while this control may be itself valid, it must match its other to
          //  be truly valid
          valid = this.valid && this.matchValid

          this.$element.trigger({type: 'validated', validation: this, valid: valid})

          if (valid) {
            this.$element.trigger({type: 'validatedValid', validation: this})
          }
          else {
            this.$element.trigger({type: 'validatedInvalid', validation: this})
          }
        }
      }

      return this.valid
    }

  , equals: function(value1, value2) {
      return value1 === value2
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
    check: false
  , match: false
  , matchValid: true
  , object: null
  , valid: true
  }

  $.fn.formValidation.Constructor = FormValidation

  /* FORMVALIDATION NO CONFLICT
   * ========================== */
  $.fn.formValidation.noConflict = function () {
    $.fn.formValidation = old
    return this
  }

})(window.jQuery);
