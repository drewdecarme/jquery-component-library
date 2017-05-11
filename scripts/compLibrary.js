$(function(){
	comp.init();
})


var comp = {
	escapeCharacters: {
		'<':'&lt;',
        '>':'&gt;'
	},
	init: function(){
		var that = this;

		$('#side a').click(function(){
			$('li a').removeClass('active')
            $(this).addClass('active')
			var _url = './views/' + $(this).attr('href').split('#')[1] + '.html';
			$.get( _url, function( data ) {
				$('#content').html( data );
				$('#main').scrollTop(0);
				that.after()
			}).fail(function(){
				$( "#content" ).html("");
			})
		});

		if (window.location.hash) {
			var hash = location.hash.replace('#', '');
			$('a[href="#' + hash + '"]').click();
		}
	},
	after: function(){
		this.syntax.reconcile.markup()
		this.syntax.reconcile.scripts()
	},
	syntax: {
		reconcile: {
			scripts: function(){
				$('[data-url]').each(function(){
		            var innerThat = $(this);
		            $.getScript($(this).attr('data-url'))
		                .done(function( script, textStatus ) {
		                	if (innerThat.hasClass('render')) {
		                		
		                		innerThat.html('<pre class="language-javascript"><code>' + script + '</code></pre>');
	        					comp.syntax.highlightAll()
		                	}
		                })
		                .fail(function( jqxhr, settings, exception ) {
		                    $.error( "Triggered ajaxError handler." );
		                });
		        });
			},
			markup: function(){
				$('.language-markup code').each(function(){
		            $(this).html(comp.syntax.adjust_tabs(comp.syntax.escape_characters($(this).html(), comp.escapeCharacters)))
		        })
	        	comp.syntax.highlightAll()
			}
		},
		escape_characters (content, replacements){
            var find;
            for(find in replacements) {
                if( !replacements.hasOwnProperty(find) ) continue;
                content = content.replace(new RegExp(find, 'g'), replacements[find]);
            }
            return content;
        },
        adjust_tabs: function (string) {
            var space_count = Math.min.apply(null, $.map(string.match(/^\s+/gm), function (x) {
                return x.length;
            }));
            var new_string = string.replace(RegExp('^\\s{' + (space_count) + '}', 'gm'), '');
            return new_string;
        },
        highlightAll: function(){
			Prism.highlightAll();
		},
	},
}

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
