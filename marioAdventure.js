// Hide start screen when start button is clicked
function hide() {
    var display = document.getElementById("startScreen");
    display.style.display = "none";
}

//Reference to the stage and output
var stage = document.querySelector("#stage");
var output = document.querySelector("#output");

// The game map
// Uses "const" keyword to make the object literal a constant variable,
// the map of the objects that do not move does not change (Ecmascript 6)
const map = {
    mapSpots: [
    [2, 0, 0, 0, 1, 0, 0, 5],
    [0, 3, 0, 0, 0, 0, 4, 0],
    [0, 0, 0, 0, 0, 2, 0, 0],
    [1, 0, 2, 0, 0, 0, 3, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 3, 0, 0, 0, 0, 0, 2],
    [0, 0, 0, 0, 0, 4, 0, 0],
    [0, 0, 0, 4, 0, 0, 1, 0]
    ],
    blank: 0,
    mushroom: 1,
    coin: 2,
    fly_trap: 3,
    goomba: 4,
    peach: 5,
    get rows () {
        return this.mapSpots.length;
    },
    get columns () {
        return this.mapSpots[0].length;
    }
};
    

// The game objects map
// Uses "let" keyword to allow the object literal to change
// due to Mario and Bowser moving around the board (Ecmascript 6)
let gameObjects = {
    objectSpots: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 7, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [6, 0, 0, 0, 0, 0, 0, 0]
    ],
    mario : 6,
    bowser : 7,
    get rows () {
        return this.objectSpots.length;
    },
    get columns () {
        return this.objectSpots[0].length;
    }
};

// Size of each cell
var cellSize = {
    size: 75
}

// Game variables
// Uses template strings to perform string substitution (Ecmascript 6)
var gameVariables = {
    lives : 15,
    coins : 10,
    get gameMessage() {
        return `Lives left: ${this.lives}` + `<br /> Coins: ${this.coins}`;
    }
};

render();
    
function render()
{
  //Clear the stage of img tag cells
  //from the previous turn
  
  if(stage.hasChildNodes())
  {
    for(var i = 0; i < map.rows * map.columns; i++) 
    {	 
      stage.removeChild(stage.firstChild);
    }
  }
  
  //Render the game by looping through the map arrays
  for(var row = 0; row < map.rows; row++) 
  {	
    for(var column = 0; column < map.columns; column++) 
    { 
      //Create a img tag called cell
      var cell = document.createElement("img");

      //Set it's CSS class to "cell"
      cell.setAttribute("class", "cell");

      //Add the img tag to the <div id="stage"> tag
      stage.appendChild(cell);

      //Find the correct image for this map cell
      switch(map.mapSpots[row][column])
      {
        case map.blank:
          cell.src = "./images/blank.png";
          break;

        case map.mushroom:
          cell.src = "./images/mushroom.png";
          break; 

        case map.coin:
          cell.src = "./images/coin.png";
          break; 

        case map.fly_trap:
          cell.src = "./images/fly_trap.png";
          break;
              
        case map.goomba:
          cell.src = "./images/goomba.png";
          break;
              
        case map.peach:
          cell.src = "./images/peach.png";
          break;
      }
        
    //Add the ship and monster from the gameObjects array
    switch(gameObjects.objectSpots[row][column])
    {
        case gameObjects.mario:
        cell.src = "./images/mario.png";
        break;

        case gameObjects.bowser:
        cell.src = "./images/bowser.png";
        break;
    }
  
    //Position the cell 
    cell.style.top = row * cellSize.size + "px";
    cell.style.left = column * cellSize.size + "px";
    }

    //Display the game message
	output.innerHTML = gameVariables.gameMessage;
  }
}