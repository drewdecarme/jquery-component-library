    //**************************** CLIENT SIDE PAGINATION ********************************************************
(function ($){
    $.fn.paginate = function (option) {
        return this.each(function () {
            var $this = $(this)
              , data = $this.data('paginate')
              , options = typeof option == 'object' && option
            if (!data) $this.data('paginate', (data = new paginate(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }
    var paginate = function (element, options) {
        this.defaults = {
            rows: '10',
        },
        this.$table = $(element)
        this.$body = this.$table.find('tbody');
        this.$rows = this.$body.find('tr')
        this.$allRows = this.$body.find('tr')
        this.options = $.extend({}, this.defaults, options)
        this.init()
    }
    paginate.prototype = {
        constructor: paginate,
        init: function () {
            if (this.$pagination) this.$pagination.remove()
            if (this.getNumOfPages() != 1) {
                this.$table.before(this.createPagination(true))
                this.$pagination = $('.pagination')
                this.$next = this.$pagination.find('.next a')
                this.$prev = this.$pagination.find('.prev a')
                this.bindClicks();
                this.changePages(1)

            }
        },
        getNumOfPages: function () {
            this.maxPages = Math.ceil(this.$rows.length / this.options.rows)
            return this.maxPages
        },
        createPagination: function () {
            var html = '<ul class="pagination">';
            html += '<li class="prev">';
            html += '<a href="#">Prev</a>';
            html += '</li>';
            html += '<li class="pages">';

            for (var i = 1; i < this.maxPages + 1 && i <= 5; i++) {
                if (i == 1) {
                    html += '<a href="#" class="current-page">' + i + '</a>';
                } else {
                    html += '<a href="#">' + i + '</a>';
                }
            }
            html += '</li>';
            html += '<li class="next">';
            html += '<a href="#">Next</a>';
            html += '</li>';
            html += '</ul>';
            this.currentPage = 0;
            return html;
        },
        reWriteNumbers: function () {
            var index = ((this.maxPages - 4) >= this.currentPage) ? true : false;
            //console.log(this.maxPages + ' - 5 = ' + (this.maxPages - 5) + ' > ' + this.currentPage + ': ' + reWrite);
            var currentPage = this.currentPage;
            var topPage = (this.maxPages > 4) ? this.maxPages - 4 : (this.maxPages - (this.maxPages - 1))
            this.$pagination.find('li.pages a').each(function () {
                if (index) {
                    $(this).text(currentPage);
                    currentPage += 1;
                } else {
                    $(this).text(topPage);
                    topPage += 1;
                }
            })

            if (this.currentPage == 1 && this.maxPages == 1) {
                this.enableElement(this.$next)
                this.disableElement(this.$prev)
            } else if (this.currentPage == this.maxPages) {
                this.disableElement(this.$next)
                this.enableElement(this.$prev)
            } else if (this.currentPage == 1) {
                this.enableElement(this.$next)
                this.disableElement(this.$prev)
            } else {
                this.enableElement(this.$next)
                this.enableElement(this.$prev)
            }
        },
        bindClicks: function () {
            this.$pagination.find('.pages a')
                .on('click', $.proxy(this.getPage, this))
            this.$pagination.find('.next a')
                .on('click', $.proxy(this.next, this))
            this.$pagination.find('.prev a')
                .on('click', $.proxy(this.prev, this))
        },
        hideAll: function () {
            this.$rows.hide();
        },
        next: function (e) {
            e.preventDefault()
            var nextPage = this.currentPage + 1;
            if (this.maxPages + 1 > nextPage) {
                this.enableElement($(e.target));
                this.changePages(nextPage)
                var $element = this.$pagination.find('a:contains("' + nextPage + '")');
                this.makePageActive(true, $element)
            }
        },
        prev: function (e) {
            e.preventDefault()
            var prevPage = this.currentPage - 1;
            if (prevPage > 0) {
                this.enableElement($(e.target))
                this.changePages(prevPage)
                var $element = this.$pagination.find('a:contains("' + prevPage + '")');
                this.makePageActive(true, $element)
            }
        },
        enableElement: function ($el) {
            $el.removeClass('disabled').removeAttr('disabled');
        },
        disableElement: function ($el) {
            $el.addClass('disabled').attr('disabled', 'disabled');
        },
        getPage: function (e) {
            e.preventDefault();
            var that = this;
            var num = parseInt(e.target.text)
            this.changePages(num)
            this.makePageActive(false, num)
        },
        changePages: function (num) {
            if (num != this.currentPage) {
                var end = this.grabInterval(num)
                var start = end - this.options.rows
                this.$allRows.hide();
                this.$rows.removeClass('open');
                this.$rows.each(function (e) {
                    if (e >= start && e < end) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            }
            this.currentPage = num
            this.reWriteNumbers();

        },
        makePageActive: function (j, $link) {
            this.$pagination.find('li a').removeClass('current-page');
            if (j) {
                $link.addClass("current-page");
            } else {
                this.$pagination.find('a:contains("' + $link + '")').addClass('current-page');
            }
        },
        grabInterval: function (num) {
            return this.options.rows * num;
        },
        showAll: function () {
            this.$rows.show()
        }
    }
})(jQuery)



//**************************** Pagination Initalization ********************************************************
$('#sample-table').paginate({
    rows: 10
});


