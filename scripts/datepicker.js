(function ($) {

	$.fn.datepicker = function (option) {
        return this.each(function () {
            var $this = $(this)
              , data = $this.data('datepicker')
              , options = typeof option == 'object' && option
            if (!data) $this.data('datepicker', (data = new datepicker(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }
    var datepicker = function (element, options) {
        this.currentDate = new Date();
        this.defaults = {
        	startDate: {
        		day: this.currentDate.getDate(),
        		month: this.currentDate.getMonth(),
        		year: this.currentDate.getFullYear()
        	},
            dayLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            monthLabels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        },
        this.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        this.options = $.extend({}, this.defaults, options)
        this.$picker = $(element)
        this.$container = this.$picker.parent('.input')
  		this.html = '';
        this.selectedDate = this.options.startDate;
        this.init()
    }
    datepicker.prototype = {
    	constructor: datepicker,
    	init: function(){
            this.generateHtml();
            this.$container.append(this.html);

    	},
        getDaysInMonth: function(year, month){
            var dd = new Date(year, month, 0);
            return dd.getDate();
        },
    	generateHtml: function(){

            // Local Storage of Date
            var thatDate = this.options.startDate

            var firstDay = new Date(thatDate.year, thatDate.month, 1);
            var startingDay = firstDay.getDay();
            var monthLength = this.getDaysInMonth(thatDate.year, thatDate.month)
            debugger;

            // Generate the HTML
            var monthName = this.options.monthLabels[thatDate.month];
            var html = '<table class="calendar-table">';
            html += '<tr><th colspan="7">';
            html +=  monthName + "&nbsp;" + thatDate.year;
            html += '</th></tr>';
            html += '<tr class="calendar-header">';
            for (var i = 0; i <= 6; i++ ){
                html += '<td class="calendar-header-day">';
                html += this.options.dayLabels[i];
                html += '</td>';
            }
            html += '</tr><tr>';

            // fill in the days
            var day = 1;
            // this loop is for is weeks (rows)
            for (var i = 0; i < 9; i++) {
            // this loop is for weekdays (cells)
                for (var j = 0; j <= 6; j++) { 
                    html += '<td class="calendar-day">';
                    if (day <= monthLength && (i > 0 || j >= startingDay)) {
                        html += day;
                        day++;
                    }
                    html += '</td>';
                }
                // stop making rows if we've run out of days
                if (day > monthLength) {
                    break;
                } else {
                    html += '</tr><tr>';
                }
            }

            html += '</tr></table>';

            this.html = html;


    	},
        
    }

})(jQuery);