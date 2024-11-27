$(function() {
	$('a').mouseover(function(e) {
		$(this).attr('id', 'mouseover_color');
	});

	$('a').mouseout(function(e) {
		$(this).removeAttr('id');
	});
});