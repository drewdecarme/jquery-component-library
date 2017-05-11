var code_blocks = {
	markup: {
		'<':'&lt;',
		'>':'&gt;'
	},
	initialize: function(){
		$('.example').each(function(e){
			var type = $(this).attr('data-type');
			var content = $(this).html();
			$(this).after('<pre class="language-' + type + '"><code class="language-' + type + '">' + code_blocks.adjust_tabs(code_blocks.escape_characters(content, code_blocks[type])) + '</code></pre>');
		});

		$('span[data-type]').each(function () {
		    var type = $(this).attr('data-type');
		    var content = $(this).html();
		    var result = code_blocks.escape_characters(content, code_blocks[type])
		    $(this).replaceWith('<code class="language-'+type+'">'+result+'</code>');
		})
	},
	escape_characters: function(content,replacements){
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
	}
}