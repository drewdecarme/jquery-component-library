    //**************************** TYPEAHEAD SEARCH ********************************************************
(function ($){
    $.fn.typeahead = function (option) {
        return this.each(function () {
            var $this = $(this)
			  , data = $this.data('typeahead')
			  , options = typeof option == 'object' && option
            if (!data) $this.data('typeahead', (data = new typeahead(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }
    var typeahead = function (element, options) {
        this.defaults = {
            values: [],
            menu: '<ul class="type-ahead-results"></ul>',
            className: 'type-ahead-results',
            item: '<li><a href="#"></a></li>',
            color: '#2E2E2E',
            style: 'strong',
            results: 10,
            sourceUrl: null,
            callback: false
        },
        this.$input = $(element)
        this.$container = $(element).parents('.input')
        this.options = $.extend({}, this.defaults, options)
        this.$menu = $(this.options.menu) || this.menu
        this.visible = false
        this.created = false
        if (this.options.sourceUrl != null) {
        	var that = this;
        	var url = this.options.sourceUrl
        	$.get( "./scripts/typeAheadArr.js", function( data ) {
				that.options.values = JSON.parse(data);
				that.bindActions()
			});
        }else{
        	this.bindActions()
        }
    }
    typeahead.prototype = {
        constructor: typeahead,
        show: function () {
            this.$menu.show();
            this.visible = true;
            return this
        },
        hide: function () {
            this.$menu.hide();
            this.visible = false;
            return this
        },
        find: function (event) {
            var this_inner = this;
            var matched_items, q;
            this.lookupValue = this.$input.val();
            if (!this.lookupValue) {
                this.clearError()
                return this.visible ? this.hide() : this;

            }
            matched_items = $.grep(this.options.values, function (item) {
                if (this_inner.matchMe(item)) {
                    this_inner.clearError();
                    return item
                }
            })
            if (!matched_items.length) {
                this.error()
                return this.hide()
            }
            this.build(matched_items.slice(0, this.options.items));
        },
        error: function () {
            if (this.$container.find('.inline-error-text').length == 0) {
                this.$container.addClass('error');
                this.$input.after("<div class='inline-error-text'>Woops! It doesn't look like that option exists. Try again!</div>");
                this.$error = this.$container.find('.inline-error-text');
            }
        },
        clearError: function () {
            if (this.$container.hasClass('error')) {
                this.$container.removeClass('error');
                this.$error.remove();
            }
        },
        matchMe: function (item) {
            return ~item.toLowerCase().indexOf(this.lookupValue.toLowerCase())
        },
        highlightStyle: function (value) {
            var inner_this = this;
            return value.replace(new RegExp('(' + inner_this.lookupValue + ')', 'ig'), function ($1, match) {
                return '<span class="typeahead-' + inner_this.options.style + '" style="color: ' + inner_this.options.color + '">' + match + '</span>';
            });
        },
        build: function (values) {
            var inner_this = this;
            var values = values.map(function (value, i) {
                return '<li><a href="#" data-value="' + value + '">' + inner_this.highlightStyle(value) + '</a></li>'
            });
            if (!inner_this.created) {
                this.created = this.create();
            }
            this.$container.find('.' + this.options.className).html(this.trim(values));
            this.show();
        },
        trim: function (arr) {
            var string = '';
            for (var i = 0; i < this.options.results; i++) {
                if (arr[i]) {
                    string += arr[i];
                }
            }
            return string;
        },
        create: function () {
            this.$container.append(this.$menu);
            return true;
        },
        next: function () {
            var active = this.$menu.find('.active').removeClass('active')
		  , next = active.next()
            if (!next.length) {
                next = $(this.$menu.find('li')[0])
            }
            next.addClass('active')
        },
        previous: function () {
            var active = this.$menu.find('.active').removeClass('active')
		  , prev = active.prev()
            if (!prev.length) {
                prev = this.$menu.find('li').last()
            }
            prev.addClass('active')
        },
        bindActions: function () {
            this.$input
		      .on('blur', $.proxy(this.blur, this))
		      .on('keypress', $.proxy(this.keypress, this))
		      .on('keyup', $.proxy(this.keyup, this))

            this.$menu
              .on('mousedown.tt', function ($e) { $e.preventDefault(); })
              .on('click', $.proxy(this.click, this))
            //.on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        },
        keyup: function (e) {
            e.stopPropagation()
            switch (e.keyCode) {
                case 40: // down arrow
                    this.next()
                    break
                case 38: // up arrow
                    this.previous()
                    break

                case 9: // tab
                case 13: // enter
                    if (!this.visible) return
                    this.choose(e)
                    break

                case 27: // escape
                    this.hide()
                    break

                default:
                    this.find(e)
            }
        },
        blur: function (e) {
            e.stopPropagation();
            this.hide();
        },
        click: function (e) {
            e.stopPropagation();
            this.choose(e);
        },
        choose: function (e) {
            e.preventDefault();
            var $target = this.getTarget($(e.target))
            var $targetLi = $target.parents('li');
            this.selectedValue = $target.attr('data-value');
            $targetLi.addClass('active');
            this.$input.val(this.selectedValue);
            this.$input.focusout();
            this.hide();
            if (this.options.callback) this.runCallback()
        },
        getTarget: function($target){
            if ($target[0].className.indexOf('typeahead') != -1) {
                return $target.parents('a');
            }else if($target[0].id == this.$input.attr('id')){
                return this.$menu.find('li.active a');
            }else{
                return $target;
            }
        },
        runCallback: function () {
            this.options.callback()
        },
        mouseEnter: function (e) {
            this.$menu.find('.active').removeClass('active')
            $(e.currentTarget).addClass('active')
        }
    }
})(jQuery)





//**************************** TYPEAHEAD CONFIGURATION OBJECT ********************************************************
var typeahead = $('#sample-type').typeahead({
	sourceUrl: './scripts/typeAheadArr.js',    // URL of of the AJAX call which will return the array. This or the below is required
    // values: [],  // Instead of providing a source, the values can be initalized as an array using this key value pair. This or the above is required
    results: 5,     // number of results requested to be shown at once. Defaults to 10
    style: 'strong',   // style of the matched string (CSS Classes can be added). Defaults to "strong"
    color: '#2e2e2e',   // color of the matched string. Defaults to "#2E2E2E"
    callback: function(){   // a callback function to be called after selecting an option. Defaults to false
        alert('Obligatory callback...')
    }
});

var typeahead = $('#sample-type-dos').typeahead({
    sourceUrl: './scripts/typeAheadArr.js',
    results: 10,
    style: 'strong',
    color: '#ff6b6b',
});




