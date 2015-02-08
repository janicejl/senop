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
		
		$('#most-recent-tweet').html(results.recent.text);
		$('#positive-tweet').html(pos.popular.text);
		$('#neutral-tweet').html(neu.popular.text);
		$('#negative-tweet').html(neg.popular.text);
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
            graph(response.responseJSON.results.word_count);
		}
	});
}

function graph(results) {
var color = d3.scale.quantize()
    .range(["#26262b", "#7c8393", "#d6ccbf"]);

var size = 600;

var pack = d3.layout.pack()
    .sort(null)
    .size([size, size])
    .value(function(d) { return d.count * d.count; })
    .padding(5);

var svg = d3.select(".chart").append("svg")
    .attr("width", size)
    .attr("height", size);

  color.domain(d3.extent(results, function(d) { return d.count; }));

  svg.selectAll("circle")
      .data(pack.nodes({children: results}).slice(1))
    .enter().append("circle")
      .attr("r", function(d) { return d.count*10; })
      .attr("cx", function(d) { return Math.random() * (600); })
      .attr("cy", function(d) { return Math.random()*600; })
      .style("fill", function(d) { return color(d.count); })
    .append("title")
      .text(function(d) {
        return d.word
            + "\ncount: " + d.count
      });

function type(d) {
  d.count = +d.count;
  return d;
}

d3.select(self.frameElement).style("height", size + "px");
}
