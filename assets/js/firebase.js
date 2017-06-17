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

  var item = "";

  //Add items to firebase

  $(".item").on('click', function(event) {
   
    // Keeps page from reloading //
    event.preventDefault();
    
    item = this.innerText;

    database.ref().push({
      item: item
    });

  });

  database.ref().on("child_added", function(snapshot) {

    var keyID = snapshot.key;

    var item = snapshot.val().item;

    var newRow = $('<li>').attr('id', keyID);
    newRow.append($('<p class="text-center">').text(item));

    $('#fridge-items').append(newRow);

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
    function initApp() {
      //Listens for state changes
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
         
          document.getElementById('login').textContent = 'Sign out';
          
        } else {
          
          document.getElementById('login').textContent = 'Sign in with Google';
       
        }
        
        document.getElementById('login').disabled = false;
        
      });

      document.getElementById('login').addEventListener('click', toggleSignIn, false);
    }

    window.onload = function() {
      initApp();
    };