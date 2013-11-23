
$(document).ready(function() {

	$('.add-button').click(function(e) {
		alert('here');
		$('#fg-1').append('<input type="text" class="form-control">');
		e.preventDefault();
	});
});