"use strict";

const API_KEY = '***';
const newsAPI = 'https://newsapi.org/v2/';
const topHeadlines = 'top-headlines';
const everything = 'everything';

// Below are the source references required in the API call
const bbcSport = 'bbc-sport';
const espn = 'espn';
const sportBible = 'the-sport-bible';

// Calling out API references and topHeadlines / everything for options to change within API call at later date.

let articleTemplate = ``;
let hoverTemplate = ``;

// Function to call APIs when window loads
function getNews(source, type) {
	$.ajax({
		url: newsAPI + type + '?sources=' + source + '&apiKey=' + API_KEY,
		success: function(response) {
			updateUISuccess(response, source);
			updateHover(response);
		},
		error: function(error) {
			updateUIError(error);
		}
	});
}

// Function to update UI with articles
function updateUISuccess(response, source) {

	let article = response.articles;
	
	for(let i=0; i < article.length; i++) {
	articleTemplate = `
		<article class="article ${source}">
            <section class="featuredImage">
              <img src="${article[i].urlToImage}" alt="" />
            </section>
            <section class="articleContent">
                <a href="#"><h3>${article[i].title}</h3></a>
                <h6>${article[i].description}</h6>
            </section>
            <section class="impressions">
              ${article[i].publishedAt}
            </section>
            <div class="clearfix"></div>
          </article>`

	$("#main").append(articleTemplate);
	$("#popUp").addClass('hidden');

	// Idea (to allow for combined chronological ordering) to create an array of template literal and timestamp, to then be able to sort according to timestamp.
		/*
		var articleTemplateObject = {
	    	article:articleTemplate, 
	        timestamp:article[i].publishedAt
	    };
	    */
	}
}

// Function to update hidden UI further information
function updateHover(response) {

	response.articles.forEach(function(article) {

	hoverTemplate = `<div class="container hidden">
            <h1>${article.title}</h1>
            <p>${article.description}</p>
            <a href="${article.url}" class="popUpAction" target="_blank">Read more from source</a>
          </div>`

	$("#popUp").append(hoverTemplate);

});} 

// Error shown if APIs cannot load
function updateUIError() {
	alert('We have an error. Come back later');
}

// Function to add / remove hidden class based on which source is selected. Leverages source IDs of source1, source 2 and source 3 in li ements
function sourceSelect(sourceID) {
	let sources = [bbcSport,espn,sportBible];

	for(let i = 0; i < sources.length; i++){
		if(i === parseInt(sourceID)){
			$('.article.' + sources[sourceID]).removeClass('hidden');
		} else {
		$('.article.' + sources[i]).addClass('hidden');
		}
	}
}

// When a user clicks on an article title, shows the popUp with further information
$('#main').on('click', 'a', function(event){

	$("#popUp").removeClass('loader hidden');
	let articleTitle = $(this).text();
		
	// Matches the articleTitle from which the user clicks on against the article.title within the hoverTemplate. Is this the best method? What if 2 articles have exactly the same name within the DOM?
	$('h1').filter(function() {
		return $(this).text() === articleTitle;
	}).parent().removeClass('hidden');

	// Ensure all other hover articles are not visible. Would this be better to use a toggle?
	$('h1').filter(function() {
		return $(this).text() === articleTitle;
	}).parent().siblings('div').addClass('hidden');

});

// Close popUp with 'X' click
$('.closePopUp').on('click', function(){
	$("#popUp").addClass('loader hidden');
});


//  When the user selects a source from the dropdown menu on the header, replace the content of the page with articles from the newly selected source. Display the loading pop up when the user first selects the new source, and hide it on success.

$('#source1, #source2, #source3').on('click', function(event) {
	let sourceIDClicked = $(this).attr("id");
	let sourceIDNumberClicked = $(this).attr("id").substr(sourceIDClicked.length - 1) - 1;
	sourceSelect(sourceIDNumberClicked);
});

// User clicks on Feedr to show all articles
$('h1').on('click', function(event) {
	$('.article').removeClass('hidden');
});

// User clicks on search impact to enable search box
$('img').on('click', function(event) {
	$('#search').toggleClass('active');
});

// User enters words within search box
$('#search').on('keyup', function(event) {
	var filter = $('input').val();
	searchFilter(filter);
});

// Search function to filter by words entered still not working!
	function searchFilter(filter) {
	let articleTitle = $('h3').text();
	console.log(articleTitle);
	console.log(filter);
	$('articleTitle:contains(filter)').addClass('hidden');

	}

// API called and articles shown when page loads
$(window).load(function() {
	$("#popUp").removeClass('hidden');
	getNews(bbcSport, topHeadlines);
 	getNews(espn, topHeadlines);
  	getNews(sportBible, topHeadlines);
});
