//Show unanswered question results from AJAX call
function showQuestion(question){
	//Clone hidden question result template
	var result = $('.templates .question').clone();

	//Set question title and link properties
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	//Set asked date property
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	//Set view count property
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	//Set asker properties
	var asker = result.find('.asker');
	asker.html(
    'Name: <a target="_blank" ' + 'href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' + 
    question.owner.display_name + '</a><br>' + 'Reputation: ' + question.owner.reputation
	);

	return result;
};

//Show number of results for search term
function showSearchResults(searchTerm, resultNumber){
	var results = '<h3>> ' + resultNumber + ' unanswered questions about "' + searchTerm + '"</h3>';
	return results;
};

//Show error message if AJAX call fails
function showError(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

//AJAX call for unanswered questions
function getUnansweredQs(tag) {
	var request = { 
		tagged: tag,
		site: 'stackoverflow',
		order: 'desc',
		sort: 'creation'
	};
	
	$.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
	})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);
		$('.search-results').html(searchResults);
		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

//Show top user results for specific tags from AJAX call
var showTopUser = function(topuser) {
  var result = $('.templates .topuser').clone();

  var userElem = result.find('.name-text a');
  userElem.attr('href', topuser.user.link);
  userElem.text(topuser.user.display_name);

  var userPic = result.find('.userPic');
  userPic.attr('src', topuser.user.profile_image);

  var reputation = result.find('.reputation');
  reputation.text(topuser.user.reputation);

  var user_type = result.find('.user_type');
  user_type.text(topuser.user.user_type); 

  var post_count = result.find('.post_count');
  post_count.text(topuser.post_count);

  var score = result.find('.score');
  score.text(topuser.score);

  return result;
}

//AJAX call for top users
function getTopUser(tag){
  var request = {
  page: 1,
  pagesize: 10,
  site: 'stackoverflow'
  };

  $.ajax({
    url: "http://api.stackexchange.com/2.2/tags/" + tag + "/top-answerers/all_time",
    data: request,
    dataType: "jsonp",
    type: "GET",
  })
  .done(function(result){
    $.each(result.items, function(i, item){
      var topUser = showTopUser(item);
      $('.results').append(topUser);
    });
  })
  .fail(function(jqXHR, error){
    var errorElem = showError(error);
    $('.search-results').append(errorElem);
  });
};

$(document).ready(function(){
	$('.unanswered-getter').submit(function(event){
		event.preventDefault();
		//Clear results from previous search
		$('.results').html('');
    $('.search-results').html('');    
		//Get the value of the tag the user submitted
		var tag = $(this).find("input[name='tag']").val();
		getUnansweredQs(tag);
   $('form.inspiration-getter')[0].reset();
	});

  $('.inspiration-getter').submit(function(event){
    event.preventDefault();
    $('.results').html('');
    $('.search-results').html('');
    var tag = $(this).find("input[name='answerers']").val();
    $('.search-results').html('<h3>> Top 10 answerers for "' + tag + '"</h3>')
    getTopUser(tag);
    $('form.unanswered-getter')[0].reset();
  });  
});
