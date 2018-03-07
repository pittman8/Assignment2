// Hide start screen when start button is clicked
function hide() {
    var display = document.getElementById("startScreen");
    display.style.display = "none";
    var hereWeGo = document.getElementById("hereWeGo");
    hereWeGo.play();
}
 
// Reference to the stage and output
var stage = document.querySelector("#stage");
var output = document.querySelector("#output");

// Add a keyboard listener
window.addEventListener("keydown", keydownHandler, false);

// The game map of immobile objects
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
    

// The game map of mobile objects
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

// Directions to go in the game
var direction = {
    up : 38,
    down : 40,
    right : 39,
    left : 37
}

// Mario's location, not initialized to anything
var marioLocation = {};

// Loop to figure out where Mario is in gameObjects array
for(var row = 0; row < gameObjects.rows; row++)
{
    for(var column = 0; column < gameObjects.columns; column++)
    {
        if(gameObjects.objectSpots[row][column] === gameObjects.mario)
        {
            marioLocation.marioRow = row;
            marioLocation.marioColumn = column;
        }
    }
}

render();

function keydownHandler(event)
{
    switch(event.keyCode)
    {
        case direction.up:
            
            // Find out if Mario's move will be within the playing field
            if (marioLocation.marioRow > 0)
            {
                // If it is, clear Mario's current cell
                gameObjects.objectSpots[marioLocation.marioRow][marioLocation.marioColumn] = 0;
                
                // Subtract 1 from Mario's row to move it up one row
                marioLocation.marioRow--;
                
                // Apply Mario's new position to the array
                gameObjects.objectSpots[marioLocation.marioRow][marioLocation.marioColumn] = gameObjects.mario;
            }
            break; 
            
        case direction.down:
            if(marioLocation.marioRow < map.rows - 1)
            {
                gameObjects.objectSpots[marioLocation.marioRow][marioLocation.marioColumn] = 0;
                marioLocation.marioRow++;
                gameObjects.objectSpots[marioLocation.marioRow][marioLocation.marioColumn] = gameObjects.mario;
            }
            break;
        case direction.left:
            if(marioLocation.marioColumn > 0)
            {
                gameObjects.objectSpots[marioLocation.marioRow][marioLocation.marioColumn] = 0;
                marioLocation.marioColumn--;
                gameObjects.objectSpots[marioLocation.marioRow][marioLocation.marioColumn] = gameObjects.mario;
            }
            break;  
	    
        case direction.right:
            if(marioLocation.marioColumn < map.columns - 1)
            {
                gameObjects.objectSpots[marioLocation.marioRow][marioLocation.marioColumn] = 0;
                marioLocation.marioColumn++;
                gameObjects.objectSpots[marioLocation.marioRow][marioLocation.marioColumn] = gameObjects.mario;
            }
            break; 
    }
    
    // Find out which cell Mario is on
    switch(map.mapSpots[marioLocation.marioRow][marioLocation.marioColumn])
    {
        case map.blank:
            gameMessage = "You run to save Princess Peach!"
            break;
            
        case map.coin:
            var coin = document.getElementById("coin");
            coin.play();
            break;
            
        case map.mushroom:
            var life = document.getElementById("1Up");
            life.play();
            break;
            
        case map.peach:
            var youWin = document.getElementById("youWin");
            youWin.play();
            
            // Show end screen when Mario has reached Peach
            var end = document.getElementById("endScreen");
            end.style.display = "block";
            var goAway = document.getElementById("stage")
            goAway.style.display = "none";
            break;
            
        case map.fly_trap:
            var vine = document.getElementById("vine");
            vine.play();
            break;
            
        case map.goomba:
            var goomba = document.getElementById("goomba");
            goomba.play();
            break;
    }

// Render the game    
 render();   
}
    
function render()
{
  // Clear the stage of img tag cells
  // from the previous turn
  
  if(stage.hasChildNodes())
  {
    for(var i = 0; i < map.rows * map.columns; i++) 
    {	 
      stage.removeChild(stage.firstChild);
    }
  }
  
  // Render the game by looping through the map arrays
  for(var row = 0; row < map.rows; row++) 
  {	
    for(var column = 0; column < map.columns; column++) 
    { 
      // Create a img tag called cell
      var cell = document.createElement("img");

      // Set it's CSS class to "cell"
      cell.setAttribute("class", "cell");

      // Add the img tag to the <div id="stage"> tag
      stage.appendChild(cell);

      // Find the correct image for this map cell
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
        
    // Add Mario and Bowser from the gameObjects array
    switch(gameObjects.objectSpots[row][column])
    {
        case gameObjects.mario:
        cell.src = "./images/mario.png";
        break;
    }
  
    // Position the cell 
    cell.style.top = row * cellSize.size + "px";
    cell.style.left = column * cellSize.size + "px";
    }

    // Display the game message
	output.innerHTML = gameVariables.gameMessage;
  }
}