$(document).ready(function() {  
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

  var fridge = [];

  var item = "";

  //Add items to firebase

  $(".items").on('click', function(event) {

    // Keeps page from reloading //
    event.preventDefault();
    
    item = $(this).val().trim().push(fridge);

    database.ref().push({
      item: item
    });

  });

  database.ref().on("child_added", function(snapshot) {

    var keyID = snapshot.key;

    var item = snapshot.val().item;

    var newRow = $('<tr>').attr('id', keyID);
    newRow.append($('<td class="text-center">').text(item));

    $('#fridge-items').append(newRow);

  });

});




___________________________________
//Adding Firebase authetication


//Firebase config provided from Firebase
var config = {
    apiKey: "AIzaSyAJ84k3KTHl-zpSiDgr6SuaVmwIMxnDrsg",
    authDomain: "fridgebuddy-da9f0.firebaseapp.com",
    databaseURL: "https://fridgebuddy-da9f0.firebaseio.com",
    projectId: "fridgebuddy-da9f0",
    storageBucket: "fridgebuddy-da9f0.appspot.com",
    messagingSenderId: "781721156427"
  };

  //Initialize Firebase application
  firebase.initializeApp(config);


    
    // Function for login
    function toggleSignIn() {
      if (!firebase.auth().currentUser) {
       
        var provider = new firebase.auth.GoogleAuthProvider();
        //'profile' referring to that data our application has access to ie 'Basic profile email, name, picture'
        provider.addScope('profile');
       
        firebase.auth().signInWithPopup(provider).then(function(result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          document.getElementById('quickstart-oauthtoken').textContent = token;

        }).catch(function(error) {
          //Error handler for clarity
          var errorCode = error.code;

          var errorMessage = error.message;
          // User email address used when attempting to login

          var email = error.email;
         
          var credential = error.credential;
          
          if (errorCode === 'auth/account-exists-with-different-credential') {
            alert('You have already signed up with a different auth provider for that email.');
            
          } else {
            console.error(error);
          }
          
        });
        
      } else {
        
        firebase.auth().signOut();
        
      }
      
      document.getElementById('quickstart-sign-in').disabled = true;
      
    }
    

    //Setup Ui listeners and updates
    function initApp() {
      // Listening for state changes.
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          
          document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
          document.getElementById('quickstart-sign-in').textContent = 'Sign out';
          document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
          
        } else {
          // User is signed out.
          document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
          document.getElementById('quickstart-sign-in').textContent = 'Sign in with Google';
          document.getElementById('quickstart-account-details').textContent = 'null';
          document.getElementById('quickstart-oauthtoken').textContent = 'null';
        }
        document.getElementById('quickstart-sign-in').disabled = false;
      });

      document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
    }

    //Function to call initialize application on window/document load
    window.onload = function() {
      initApp();
    };


    //Button for sign in with ID

    // <button disabled class="mdl-button mdl-js-button mdl-button--raised" id="quickstart-sign-in">Sign in with Google</button>