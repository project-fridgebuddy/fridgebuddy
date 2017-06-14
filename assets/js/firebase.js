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