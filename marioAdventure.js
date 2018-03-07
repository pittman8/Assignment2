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
var gameVariables = {
    lives : 15,
    coins : 10,
    gameMessage : "Use the arrow keys to move around the board"
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
            gameVariables.gameMessage = `You run to save the princess!`;
            break;
            
        case map.coin:
            getCoin();
            break;
            
        case map.mushroom:
            getLife();
            break; 
            
        case map.fly_trap:
            fightPiranha();
            break;
            
        case map.goomba:
            fightGoomba();
            break;
        
        case map.peach:
            var youWin = document.getElementById("youWin");
            youWin.play();
            
            // Show end screen when Mario has reached Peach
            var end = document.getElementById("endScreen");
            end.style.display = "block";
            break;
    }
    
    // Subtract a life each turn
    gameVariables.lives--;
    
    // Find out if Mario has run out of lives or coins
    if (gameVariables.coins <= 0 || gameVariables.lives <= 0)
    {
        endGame();
    }

    // Render the game    
    render();   
}

// What happens when Mario encounters a coin cell
function getCoin()
{
    // Coin sound
    var coin = document.getElementById("coin");
    coin.play();
    
    // Coin variable increases
    gameVariables.coins += 5;
    
    // Update the game message 
    gameVariables.gameMessage = "This giant coin is filled with 5 small coins!" +
        "<br> You now have " + gameVariables.coins + " coins.";
}

// What happens when Mario encounters a mushroom cell
function getLife()
{
    // 1-Up Sound
    var life = document.getElementById("1Up");
    life.play();
    
    // Lives increase
    gameVariables.lives += 5;
    
    // Update gameMessage
    gameVariables.gameMessage = "You found a giant 1-Up mushroom" +
        "<br> You now have " + (gameVariables.lives - 1) + " lives.";
}

// What happens when Mario encounters a piranha plant cell
function fightPiranha()
{
    // Piranha Plant sound
    var vine = document.getElementById("vine");
    vine.play();
}

// What happens when Mario encounters a goomba cell
function fightGoomba()
{
    // Goomba attack sound
    var goomba = document.getElementById("goomba");
    goomba.play();
}

// What happens when Mario dies
function endGame()
{
    
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
        
        case gameObjects.bowser:
        cell.src = "./images/bowser.png";
        break;
    }
  
    // Position the cell 
    cell.style.top = row * cellSize.size + "px";
    cell.style.left = column * cellSize.size + "px";
    }

    // Display the game message
	output.innerHTML = gameVariables.gameMessage;
      
    // Display the player's coins and lives
    // Uses template strings to perform string substitution (Ecmascript 6)
    output.innerHTML
      +=  `<br><br>Lives left: ${gameVariables.lives}` + `<br />Coins: ${gameVariables.coins}`;
  }
}