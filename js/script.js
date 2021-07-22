let pokemonRepository = (function () {
  let pokemonList = []; //repository to house pokemon items
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=20";

	let searchItem = document.querySelector("#searchPoke");   //var for the search field
	
	//function pushes pokemon item to array
  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon &&
      "detailsUrl" in pokemon
    ) {
      pokemonList.push(pokemon);
    } else {
      console.log("add object");
    }
  }
	
	//function displays pokemon in list
  function getAll() {
    return pokemonList;
  }
	
	
  function addListItem(pokemon) {
    pokemonRepository.loadDetails(pokemon).then(function () {
      let $row = $(".row");

      let $card = $('<div class="card" style="width:400px"></div>');
      let $image = $(
        '<img class="card-img-top" alt="Card image" style="width:20%" />'  //add html to build img element
      );
      $image.attr("src", pokemon.imageUrlFront);		//set source attr to display correct image
		
	pokemon.name = uCase(pokemon.name);
      let $cardBody = $('<div class="card-body"></div>');
      let $cardTitle = $("<h4 class='card-title' >"+pokemon.name+"</h4>");
      let $seeProfile = $(
        '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">See Profile</button>'
      );

      $row.append($card);
      //Append the image
      $card.append($image);
      $card.append($cardBody);
      $cardBody.append($cardTitle);
      $cardBody.append($seeProfile);

      $seeProfile.on("click", function (event) {
        showDetails(pokemon);
      });
    });
  }
	
	
  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function () {
      console.log(item);
      showModal(item);
    });
  }
	
  // loading list of all pokemons after fetching from an API
function loadList() {
  return fetch(apiUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      json.results.forEach(function(item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
    }).catch(function (e) {
      console.error(e);
    })
  }

  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
        //add the details
        item.imageUrlFront = details.sprites.front_default;
        item.imageUrlBack = details.sprites.back_default;
        item.height = details.height;
        //loop 
        //change the color 
        item.types = [];
        for (var i = 0; i < details.types.length; i++) {
          item.types.push(details.types[i].type.name);
        }
        
		$(".modal-header").css("background-color", "#ffffff");  //Seems to be necessary to clear color
		
        if (item.types.includes("grass")) {
          $(".modal-header").css("color", "green");
  
        } else if (item.types.includes("fire")) {
          $(".modal-header").css("background-color", "DarkOrange");
        } else if (item.types.includes("psychic")) {
          $(".modal-header").css("background-color", "#FF69B4");
        } else if (item.types.includes("poison")) {
          $(".modal-header").css("background-color", "#ef98f7");
        } else if (item.types.includes("water")) {
          $(".modal-header").css("background-color", "#98a8f7");
        } else if (item.types.includes("bug")) {
          $(".modal-header").css("background-color", "#3f000f");
        } else if (item.types.includes("rock")) {
          $(".modal-header").css("background-color", "#BC8F8F");
        } else if (item.types.includes("flying")) {
          $(".modal-header").css("background-color", "#2F4F4F");
        } else if (item.types.includes("electric")) {
          $(".modal-header").css("background-color", "#f1f798");
        } else if (item.types.includes("ice")) {
          $(".modal-header").css("background-color", "#4169E1");
        } else if (item.types.includes("ghost")) {
          $(".modal-header").css("background-color", "#888888");
        } else if (item.types.includes("ground")) {
          $(".modal-header").css("background-color", "#D2B48C");
        } else if (item.types.includes("fairy")) {
          $(".modal-header").css("background-color", "#EE82EE");
        } else if (item.types.includes("steel")) {
          $(".modal-header").css("background-color", "#708090");
        }
        //loop to get the abilities of a selected pokemon
        item.abilities = [];
        for (var i = 0; i < details.abilities.length; i++) {
          item.abilities.push(details.abilities[i].ability.name);
        }

        item.weight = details.weight;
      })
      .catch(function (e) {
        console.error(e);
      });
  }
  // show the modal content
  function showModal(item) {
    let modalBody = $(".modal-body");
    let modalTitle = $(".modal-title");
    let modalHeader = $(".modal-header");

    modalTitle.empty();
    modalBody.empty();

    //creating element for name in modal content
    let nameElement = $("<h1>" + item.name + "</h1>");
    // // creating img in modal content
    let imageElementFront = $('<img class="modal-img" style="width:50%">');
    imageElementFront.attr("src", item.imageUrlFront);
    let imageElementBack = $('<img class="modal-img" style="width:50%">');
    imageElementBack.attr("src", item.imageUrlBack);
    // //creating element for height in modal content
    let heightElement = $("<p>" + "height : " + item.height + "</p>");
    // //creating element for weight in modal content
    let weightElement = $("<p>" + "weight : " + item.weight + "</p>");
    // //creating element for type in modal content
    let typesElement = $("<p>" + "types : " + item.types + "</p>");
    // //creating element for abilities in modal content
    let abilitiesElement = $("<p>" + "abilities : " + item.abilities + "</p>");

    modalTitle.append(nameElement);
    modalBody.append(imageElementFront);
    modalBody.append(imageElementBack);
    modalBody.append(heightElement);
    modalBody.append(weightElement);
    modalBody.append(typesElement);
    modalBody.append(abilitiesElement);
  }
	
	function uCase(z){	//convert names to upper case (stylistic choice)
		z = z.toUpperCase();
		return z;
	}

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showModal: showModal,
    // hideModal: hideModal
  };
})();
pokemonRepository.loadList().then(function () {
  // Now the data is loaded!
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});


