$(document).ready(function() { 
   $("#recipe-container").hide();
	$(document).on('click', '.recipe-button', function(event) {
   
      // Keeps page from reloading //
      event.preventDefault();

      var type = this.innerText;

      // Edamam API
      var app_id = 'c4f62b8d';
      var app_key = 'e041d493f5b0aecd6933bbdf901cf840';

      // Edamam QueryURL
      var queryURL = "https://api.edamam.com/search?app_id=" + app_id + "&app_key=" + app_key + "&q=pumpkin&from=1&to=4"

      $.ajax({
        url: queryURL,
        method: "GET"
      }).done(function(response) {
      	console.log(response);
      	for (var i = 0; i < response.hits.length; i++) {
      		$("#recipe-items").append('<div class="recipe-name text-center col-md-4"><h3>' + response.hits[i].recipe.label +'<br><img src="' + response.hits[i].recipe.image + '">'); 
      	}
      });

      $("#items-container").hide();
      $("#recipe-container").show();
    });
});