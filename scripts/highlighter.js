				
//**************************** THE KIND OF SORT OF CONTROL + F ********************************************************
(function ($){
    $.fn.highlighter = function (option) {
        return this.each(function () {
            var $this = $(this)
			  , data = $this.data('highlighter')
			  , options = typeof option == 'object' && option
            if (!data) $this.data('highlighter', (data = new highlighter(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }
    var highlighter = function (element, options) {
        this.defaults = {
            color: 'default',
            targetContainer: null,
            containerType: 'id'
        },
        this.$input = $(element)
        this.options = $.extend({}, this.defaults, options)
        this.init()
    }
    highlighter.prototype = {
        constructor: highlighter,
        init: function () {
            this.$targetContainer = this.getTargetContainer()
            this.bindActions()
        },
        getTargetContainer: function () {
            switch (this.options.containerType) {
                case "id":
                    return $('#' + this.options.targetContainer);
                case "class":
                    return $('.' + this.options.targetContainer);
            }
        },
        bindActions: function () {
            this.$input
                .on('keyup paste', $.proxy(this.fieldLength, this))
        },
        fieldLength: function (e) {
            if (e.target.value.length != 0) {
                this.removeHighlight()
                this.highlight(e.target.value)
            } else {
                this.removeHighlight()
            }
        },
        highlight: function (pat) {
            var that = this;
            function innerHighlight(node, pat) {
                var skip = 0;
                if (node.nodeType == 3) {
                    var pos = node.data.toUpperCase().indexOf(pat);
                    pos -= (node.data.substr(0, pos).toUpperCase().length - node.data.substr(0, pos).length);
                    if (pos >= 0) {
                        var spannode = document.createElement('span');
                        spannode.className = 'inline-highlight ' + that.options.color;
                        var middlebit = node.splitText(pos);
                        var endbit = middlebit.splitText(pat.length);
                        var middleclone = middlebit.cloneNode(true);
                        spannode.appendChild(middleclone);
                        middlebit.parentNode.replaceChild(spannode, middlebit);
                        skip = 1;
                    }
                }
                else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
                    for (var i = 0; i < node.childNodes.length; ++i) {
                        i += innerHighlight(node.childNodes[i], pat);
                    }
                }
                return skip;
            }

            return this.$targetContainer.length && pat && pat.length ? this.$targetContainer.each(function () {
                innerHighlight(this, pat.toUpperCase());
            }) : this.$targetContainer;
        },
        removeHighlight: function () {
            return this.$targetContainer.find("span.inline-highlight").each(function () {
                this.parentNode.firstChild.nodeName;
                with (this.parentNode) {
                    replaceChild(this.firstChild, this);
                    normalize();
                }
            }).end();
        }
    }
})(jQuery)



//**************************** CONFIGURE THE F! ********************************************************

$('#search-name').highlighter({
    targetContainer: 'l-name',
    containerType: 'class',
    color: 'purple'
});

$('#search-position').highlighter({
    targetContainer: 'l-position',
    containerType: 'class',
    color: 'offRed'
});

