$(document).ready(function() {  
  // Initialize Firebase
 var config = {
    apiKey: "AIzaSyAimoqmQvNYxsxg4ES1u5TUQu490K75Dis",
    authDomain: "project-test-d0d57.firebaseapp.com",
    databaseURL: "https://project-test-d0d57.firebaseio.com",
    projectId: "project-test-d0d57",
    storageBucket: "project-test-d0d57.appspot.com",
    messagingSenderId: "588756457296"
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
    
    item = this.innerText;

    fridgeItems.push(item)
    console.log(fridgeItems)

  });


  $(".diet").on('click', function(event){

    if (fridgeItems.length == 0){
      alert("You must add items to your list")
      return;
    }

    var data = {
      items: fridgeItems,
      user_id: window.user.uid,
      added_ts: moment().format('YYYY-MM-DD HH:mm:ss')
    }

    var recipeItems = randomItems(fridgeItems);

    buildURL(recipeItems);

    pushUpdateData(data);
  });


  function pushUpdateData(data){
    if (window.user.row_id){
      var updates = {}

      updates[window.user.row_id] = data

      database.ref().update(updates)
    } else {

      window.user.row_id = database.ref().push(data).key
    }
  }


  function randomItems(fridgeItems){  
    if (fridgeItems.length <= 3){
      return fridgeItems;
    } 

    var recipeItems = []

    var random

    for (var i = 1; i <= 3; i++){
      random = Math.floor(Math.random()*fridgeItems.length);
      recipeItems.push(fridgeItems[random]);
      fridgeItems.splice(random, 1)
    }

    return recipeItems;    
  }

  // function urlSyntax(recipeItems){
  // 	recipeItems.toString();
  // 	console.log(recipeItems)
  // 	// var concatURL = recipeItems.replace(" ", "%20")
  // 	// console.log(concatURL)
  // }
  //Pass value of button clicked to build constructed query url
  function buildURL(recipeItems){
    var builtURL = "https://api.edamam.com/search?app_id=c4f62b8d&app_key=e041d493f5b0aecd6933bbdf901cf840&from=1&to=5&q=" + encodeURIComponent(recipeItems.join(','));
    console.log(builtURL)
    return builtURL;
    
  }



  database.ref().on("child_added", function(snapshot) {

    var keyID = snapshot.key;

    var item = snapshot.val().item;

    var newRow = $('<li class="item remove-item">').attr('id', keyID);
    newRow.append($('<p class="text-center">').text(item));

    $('#fridge-items').append(newRow);

  });

  
  //remove on click
    $("body").on("click", ".remove-button", function(){
        //remove data from firebase associated with this buttons key
         database.ref().child($(this).attr('id', keyID)).remove();
    });
    //watcher for child removed
    database.ref().on("child_removed", function(snapshot) {
        //save the key as a variable
        var keyID = snapshot.key;
        //remove row with id that matches key of child that was removed
        $("#"+keyID).remove();
    });



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
      database.ref().on('value', function(snapshot){
        snapshot.forEach(function(row){
          console.log(row.val())
          if (window.user.uid === row.val().user_id){  

            var inFridge = row.val().items
            
            window.user.row_id = row.key

            $("#fridge-items").empty();

            inFridge.forEach(function(things){
              $("#fridge-items").append(
                $("<li>").append(things)
              )
            });
          }          
        });        
      });
    }