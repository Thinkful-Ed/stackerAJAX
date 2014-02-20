$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});
});

var yieldQuestion = function(question) {
	// clone our template code for result 
	var result = $('.templates .question').clone();
	
	var questionText = result.find('.question-text a');
	questionText.attr('href', question.link);
	questionText.text(question.title);

	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
													question.owner.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + question.owner.reputation + '</p>'
	);
	return result;
};

var yieldSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};


var getUnanswered = function(tags) {
	var request = {tagged: tags,
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
		success: function(result){
			var searchResults = yieldSearchResults(request.tagged, result.items.length);
			$('.search-results').html(searchResults);
			$.each(result.items, function(i, item) {
				var question = yieldQuestion(item);
				$('.results').append(question);
			});
		}
	});
};


