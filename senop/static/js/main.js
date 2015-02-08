function getResults() {
  var tmp = document.getElementById("searchTerm");
  var term = tmp.value;
  var searchTerm = {};
  searchTerm['searchTerm'] = term;
  $.ajax({
    url:Flask.url_for('search'),
    dataType : 'json',
    contentType : 'application/json; charset=UTF-8',
    data : JSON.stringify(searchTerm),
    type : 'POST',
    //success : onStatusOK,
    //failure : onStatusError
    complete: function(response) {
            console.log(response);
		}
	});
}

$('#searchTerm').keydown(function (event) {
    var keypressed = event.keyCode || event.which;
    if (keypressed == 13) {
        getResults();
    }
});