function checkEnter() {
 var tmp = document.getElementById("searchTerm");

    var keypressed = event.keyCode || event.which;
    	console.log(keypressed);
    if (keypressed == 13) {
    	event.preventDefault();
        getResults();
    }
}

function update(response){
	var results = response.responseJSON.results;
	var neg = response.responseJSON.negative;
	var pos = response.responseJSON.positive;
	var neu = response.responseJSON.neutral;

	console.log(results);
	var pBar = document.getElementById("mood");
	if (results.score > 0) {
		var valeur = results.score*100;
		$('.progress-bar').css('width', valeur+'%').attr('aria-valuenow', valeur);

		$('.orange').html(results.search_term);

		var newContent = "";
		$.each(neg.common_words,function(word) {
			// console.log(word);
			var str = "<span>"+word+"<br></span>"
			newContent = newContent.concat(str);
			console.log(newContent);
			str="";
		});
		$("#neg").html(newContent);

		newContent = "";
		$.each(pos.common_words,function(word) {
			// console.log(word);
			var str = "<span>"+word+"<br></span>"
			newContent = newContent.concat(str);
			str="";
		});
		$("#pos").html(newContent);

		// pBar.aria-valuenow =results.score*100;
	} else {

	}

}

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
            update(response);
		}
	});
}
