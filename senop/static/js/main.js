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
		var href = $("#livefeed").href;
		// href = href.concat(results.search_term);
		$("#livefeed").href = href;
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
            graph(response.responseJSON.results.word_count);
		}
	});
}

function graph(results) {
var diameter = 960,
    format = d3.format(",d"),
    color = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svg = d3.select("body").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

d3.json(results, function(error, root) {
  var node = svg.selectAll(".word")
      .data(bubble.nodes(classes(root))
      .filter(function(d) { return !d.children; }))
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("title")
      .text(function(d) { return d.className + ": " + format(d.value); });

  node.append("circle")
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { return color(d.packageName); });

  node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.className.substring(0, d.r / 3); });
});

// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.word, value: node.count});
  }

  recurse(null, root);
  return {children: classes};
}

d3.select(self.frameElement).style("height", diameter + "px");
}