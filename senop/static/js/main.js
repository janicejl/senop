function getResults() {
	var tmp = document.getElementById("searchTerm");
	var term = tmp.value;
	var searchTerm="{'searchTerm': '"+term+"'}"; 
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
	alert(term);

}
