//**************************** INPUT VALIDATOR ********************************************************

(function ($){
	$.fn.validator = function (option, args) {
        return this.each(function () {
            var $this = $(this)
              , data = $this.data('validator')
              , options = typeof option == 'object' && option
            if (!data) $this.data('validator', (data = new validator(this, options)))
            if (typeof option == 'string' && args) data[option](args)
            if (typeof option == 'string') data[option]()
        })
    }
    var validator = function (element, options) {
        this.defaults = {
            action: {
                element: false,
                regulate: false 
            }
        },
        this.$input = $(element)
        this.$container = this.$input.parents('.input')
        this.options = $.extend({}, this.defaults, options)
        this.bindActions()
    }
    validator.prototype = {
        constructor: validator,
        bindActions: function () {
        	switch (this.options.type){
        		case 'number':
        			this.$input
                    	.on('keyup', $.proxy(this.validateNumber, this))
                    	.on('paste', $.proxy(this.validateNumber, this))
        			break;
        		case 'email':
        			this.iconValCreate()
        			this.$input
        				.on('keyup', $.proxy(this.validateEmail, this))
                    	.on('paste', $.proxy(this.validateEmail, this))
        			break;
        		case 'text':
        			this.$input
        				.on('keyup', $.proxy(this.validateText, this))
                    	.on('paste', $.proxy(this.validateText, this))
        			break;
        	}
            if (this.options.type == 'number') {
                
            }
        },


        // MAIN CONTROLLERS
        validateNumber: function () {
        	this.inputErrClr();
            if (this.options.length) this.genLength('number')
            if (typeof this.options.max !== 'undefined') this.numMax()
            if (typeof this.options.min !== 'undefined') this.numMin()
        },
       	validateEmail: function(){
       		this.iconValClr();
       		if (this.$input.val().length != 0) {
       			if (this.regexEmail(this.$input.val())){
       				this.iconValSuc();
                    this.setValid(true);
	       		}else{
                    this.setValid(false);
	       			this.iconValErr();
	       		}
       		}
       	},
       	validateText: function(){
        	this.inputErrClr();
       		if (this.options.length) this.genLength('text')
       	},
        setValid(test){
            if (test) {
                this.$input.attr('data-valid', 'true');
            }else{
                this.$input.attr('data-valid', 'false');
            }
        },


       	// REGEXS
       	regexEmail: function(email){
        	var wellFormedEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        	return wellFormedEmail.test(email)
        },
        regexNumber: function(value){
        	return value.replace(/\./g,'')
        },


    	// ICON VALIDATION
    	iconValCreate: function(){
        	if (!this.$container.hasClass('validate')) this.$container.addClass('validate')
    	},
    	iconValSuc: function(){
    		this.iconValClr();
    		this.$container.addClass('validate-success')
    	},
    	iconValErr: function(){
			this.iconValClr();
    		this.$container.addClass('validate-error')
    	},
    	iconValClr: function(){
    		this.$container.removeClass('validate-success validate-error');
    	},


    	// GENERAL CONTROLLERS
        genLength: function (type) {
            var length = this.options.length
            if (type == 'number'){
                this.valueLen = this.regexNumber(this.$input.val()).length;
            }
            if (type == 'text'){
                this.valueLen = this.$input.val().length
            }
            if (this.valueLen > length.value) {
                this.inputErrAddClass()
                this.genDisableAction();
                if (length.showError) {
                    this.errMsg = length.errorText
                    this.inputErrPrint()
                }
            }else{
                this.genActionEnable();
            }
        },
        genDisableAction: function(){
            // var opt = this.options.action
            // if (opt.regulate){
            //     var e = $('#' + opt.element)
            //     e.prop('disabled','disabled');
            // } 
        },
        genActionEnable: function(){
            // var opt = this.options.action
            // if (opt.regulate){
            //     var e = $('#' + opt.element)
            //     if (e.prop('disabled') == true) e.removeAttr('disabled');
            // } 
        },


        // NUMBER CONTROLLERS
        numMax: function(){
        	var max = this.options.max
            if (parseInt(this.$input.val()) > parseInt(max.value)) {
                this.inputErrAddClass()
                this.genDisableAction();
                if (max.showError) {
                    this.errMsg = max.errorText
                    this.inputErrPrint()
                }
            }else{
                this.genActionEnable();
            }
        },
        numMin: function(){
            var min = this.options.min
        	if (parseInt(this.$input.val()) < parseInt(min.value)) {
                this.inputErrAddClass()
                this.genActionEnable();
                if (min.showError) {
                    this.errMsg = min.errorText
                    this.inputErrPrint()
                }
            }else{
                this.genActionEnable();
            }
        },


        // ERROR CONTROLLERS
        inputErrPrint: function () {
            if (!this.$error){
            	this.inputErrCreate()
            } 
            this.$error.text(this.errMsg)
        },
        inputErrCreate: function(){
        	this.$input.after('<div class="inline-error-text"></div>');
        	this.$error = this.$container.find('.inline-error-text');
        },
        inputErrAddClass: function () {
            this.$container.addClass('error');
            this.setValid(false)
        },
        inputErrClr: function () {
            this.$container.removeClass('error');
            this.setValid(true);
            if (this.$error) {
            	this.$error.remove();
            	this.$error = false;
            }
            
        },
    }
})(jQuery)



//**************************** INPUT VALIDATOR CONFIGURATIONS ********************************************************
// NUMBER
$('#val-num').validator({
    type: 'number',
    min: {
        value: 0,
        showError: true,
        errorText: "Neagative numbers? Really? Let's keep it above 0 please. Thanks!"
    },
    max: {
        value: 10,
        showError: true,
        errorText: 'Getting a little ambitious I see... Less than 10 please!'
    },
    length: {
        value: 4,
        showError: true,
        errorText: 'WOAHH! Your entry is wayyyy too long. Enter in less than 5 digits'
    }
})

// TEXT
$('#val-text').validator({
    type: 'text',
    length: {
        value: 10,
        showError: true,
        errorText: 'Keep your verbosity to a minimum please. Exactly 10 characters of a minimum.'
    }
})

// EMAIL
$('#val-email').validator({
    type: 'email'
})



