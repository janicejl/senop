function checkEnter() {
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

		$('#search-term').html(results.search_term);

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

    if (results.recent) {
		  $('#most-recent-tweet').html(results.recent.text.replace(/(http:\/\/[^\s]+)/g, "<a href='$1'>$1</a>"));
    }
    if (pos.popular) {
		$('#positive-tweet').html(pos.popular.text.replace(/(http:\/\/[^\s]+)/g, "<a href='$1'>$1</a>"));
  } else {
    $('#positive-tweet').html('');
  }
  if (neu.popular) {
		$('#neutral-tweet').html(neu.popular.text.replace(/(http:\/\/[^\s]+)/g, "<a href='$1'>$1</a>"));
  }  else {
    $('#neutral-tweet').html('');
  }
  if (neg.popular) {
		$('#negative-tweet').html(neg.popular.text.replace(/(http:\/\/[^\s]+)/g, "<a href='$1'>$1</a>"));
  } else {
    $('#negative-tweet').html('');
  }
		$('#number-of-tweets').html(results.numresults);
		$('#number-of-favorites').html(results.numfavs);
	} else {

	}

  document.getElementById('senop-explanation').style.display = 'none';
  document.getElementById('search-result-container').style.visibility = 'visible';

  // Polling
  var st = document.getElementById("search-term");
    console.log('start polling.');
    setTimeout(getResults, 60000);

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
    //failure : onStatusError d
    complete: function(response) {
    		console.log(response);
            update(response);
            graph(response.responseJSON.results.word_count); 
		}
	});
}

function graph(results) {
var color = d3.scale.quantize()
    .range(["#7c8393", "#d6ccbf"]);

var height = 600;
var width = 950;

var pack = d3.layout.pack()
    .sort(null)
    .size([height, width])
    .value(function(d) { return d.count * d.count; })
    .padding(5);

var svg = d3.select(".chart").append("svg")
    .attr("width", width)
    .attr("height", height);

  color.domain(d3.extent(results, function(d) { return d.count; }));

  svg.selectAll("circle")
      .data(pack.nodes({children: results}).slice(1))
    .enter().append("circle")
      .attr("r", function(d) { return d.count*10; })
      .attr("cx", function(d) { return Math.random() * width; })
      .attr("cy", function(d) { return Math.random()*height; })
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


d3.select(self.frameElement).style("height", height + "px");
}
