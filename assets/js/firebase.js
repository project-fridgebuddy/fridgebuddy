$(document).ready(function() {

    $("#recipe-container").hide();
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAJ84k3KTHl-zpSiDgr6SuaVmwIMxnDrsg",
        authDomain: "fridgebuddy-da9f0.firebaseapp.com",
        databaseURL: "https://fridgebuddy-da9f0.firebaseio.com",
        projectId: "fridgebuddy-da9f0",
        storageBucket: "fridgebuddy-da9f0.appspot.com",
        messagingSenderId: "781721156427"
    };

    firebase.initializeApp(config);

    var database = firebase.database();

    var item = "";

    var fridgeItems = []

    initApp(database);

    //Add items to firebase
    $(".item").on('click', function(event) {
        // Keeps page from reloading //
        event.preventDefault();

        item = this.innerText.toLowerCase();

        $('#fridge-items').append("<li>" + item + "</li>");

        fridgeItems.push(item)
        console.log(fridgeItems)

    });


    $(".diet").on('click', function(event) {

        dietRestriction = this.innerText
        console.log(dietRestriction)

        if (fridgeItems.length == 0) {
            alert("You must add items to your list")
            return;
        }

        var data = {
            diet: dietRestriction,
            items: fridgeItems,
            user_id: window.user.uid,
            added_ts: moment().format('YYYY-MM-DD HH:mm:ss')
        }

        var recipeItems = randomItems(fridgeItems);

        buildURL(recipeItems, dietRestriction);


        pushUpdateData(data);

        var drinkURL = "https://www.thecocktaildb.com/api/json/v1/1/random.php"

        $.ajax({
            url: drinkURL,
            method: "GET"
        }).done(function(response) {
            console.log(response)
            for (var i = 0; i < response.drinks.length; i++) {
                var thumb = response.drinks[i].strDrinkThumb.replace("http://", "https://")
                $("#drink-items").append('<div class="recipe-name text-center col-md-12"><h3>' + response.drinks[i].strDrink + '<br><img style="width: 300px;" src="' + thumb + '">' + '<p>' + response.drinks[i].strInstructions + '</p>');
            }
        })

        $("#items-container").hide();
        $("#recipe-container").show();

    });


    function pushUpdateData(data) {
        if (window.user.row_id) {
            var updates = {}

            updates[window.user.row_id] = data

            database.ref().update(updates)
        } else {

            window.user.row_id = database.ref().push(data).key
        }
    }


    function randomItems(fridgeItems) {
        if (fridgeItems.length <= 3) {
            return fridgeItems;
        }

        var recipeItems = []

        var random

        for (var i = 1; i <= 3; i++) {
            random = Math.floor(Math.random() * fridgeItems.length);
            recipeItems.push(fridgeItems[random]);
            fridgeItems.splice(random, 1)
        }

        return recipeItems;
    }


    function buildURL(recipeItems, dietRestriction) {
        var builtURL = "https://api.edamam.com/search?app_id=c4f62b8d&app_key=e041d493f5b0aecd6933bbdf901cf840&from=1&to=4&q="
                     + encodeURIComponent(recipeItems.join(','));

        if (dietRestriction === "none") {
            console.log("3", builtURL)
        } else {
            builtURL += "&Health=" + dietRestriction
            console.log(builtURL)
        }

        $.ajax({
            url: builtURL,
            method: "GET"
        }).done(function(response) {
            for (var i = 0; i < response.hits.length; i++) {
                $("#recipe-items").append('<div class="recipe-name text-center col-md-4"><h3>'
                + response.hits[i].recipe.label + '<br><img src="' + response.hits[i].recipe.image + '">' + '<p>' 
                + response.hits[i].recipe.ingredientLines + '</p>');
            }


        })

    }

});


//------------OAuth---------------//
//Function called for login/out button listener
function toggleSignIn() {
    if (!firebase.auth().currentUser) {
        var provider = new firebase.auth.GoogleAuthProvider();

        provider.addScope('profile');
        firebase.auth().signInWithPopup(provider).then(function(result) {
            //Gives Google access token
            var token = result.credential.accessToken;

            var user = result.user;

        }).catch(function(error) {
            //REcords errors for clarity
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
            if (errorCode === 'auth/account-exists-with-different-credential') {
                alert('You have already signed up with a different auth provider for that email.');

            } else {
                console.error(error);
            }

        });

    } else {

        // firebase.auth().signOut();
        firebase.auth().signOut().then(function() {
            console.log('Signed Out');
        }, function(error) {
            console.error('Sign Out Error', error);
        });

    }

    document.getElementById('login').disabled = true;

}

//Called on page/window load to add listener to UI
function initApp(database) {
    //Listens for state changes
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

            window.user = user;

            document.getElementById('login').textContent = 'Sign out';

            getData(database);


        } else {

            window.user = null

            document.getElementById('login').textContent = 'Sign in with Google';

        }

        document.getElementById('login').disabled = false;

    });

    document.getElementById('login').addEventListener('click', toggleSignIn, false);
}



function getData(database) {
    database.ref().on('value', function(snapshot) {
        snapshot.forEach(function(row) {
            console.log(row.val())
            if (window.user.uid === row.val().user_id) {

                var inFridge = row.val().items

                window.user.row_id = row.key

                $("#fridge-items").empty();

                inFridge.forEach(function(things) {
                    $("#fridge-items").append(
                        $("<li>").append(things)
                    )
                });
            }
        });
    });
}