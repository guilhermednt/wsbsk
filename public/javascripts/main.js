$( document ).ready(function() {
	$("form").submit(function() {
		return false;
	});
	$(".forgetIt").click(function() {
		$("textarea#secret").attr("placeholder", "Forget what? I've never seen you. ;)");
	});
	$(".submit").click(function() {
		$("form").slideUp();
		$("div.done").fadeIn();
		$("textarea#secret").val('');
	});
	$(".another").click(function() {
		$("div.done").fadeOut();
		$("form").slideDown();
	});
});
