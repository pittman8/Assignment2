// jQuery hide() function, click() and ready() methods
$(document).ready(function(){
    
    // Hide start screen when start button is clicked
    $("#start").click(function(){
        $("#startScreen").hide();
        setUpGame();
    }); 
    
    // Hide "rescued peach" end screen, call setUpGame to play game again
    // After "Play Again" button is clicked
    $("#replay1").click(function(){
        $("#endScreen1").hide();
        setUpGame();
    });
    
    // Hide "died from loss of coins or lives" end screen, call setUpGame to play game again
    // After "Play Again" button is clicked
    $("#replay2").click(function(){
        $("#endScreen2").hide();
        setUpGame();
    });
    
    // Hide "Bowser got you" end screen, call setUpGame to play game again
    // After "Play Again" button is clicked
    $("#replay3").click(function(){
        $("#endScreen3").hide();
        setUpGame();
    });
});

// Helper function to initialize starting game sound and call playGame to start the game
// Starting the game for the first time or playing again
function setUpGame()
{
    var hereWeGo = document.getElementById("hereWeGo");
    hereWeGo.play();
    playGame();
}

// Wrap whole game state into a function so that game can be replayed
function playGame()
{
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
        bowser : 7
    };

    // Size of each cell
    var cellSize = {
        size: 75
    }

    // Mario's location, not initialized to anything
    var marioLocation = {};
    // Bowser's location, not initialized to anything
    var bowserLocation = {};

    // Loop to figure out where Mario and Bowser are in gameObjects array
    for(var row = 0; row < map.rows; row++)
    {
        for(var column = 0; column < map.columns; column++)
        {
            if(gameObjects.objectSpots[row][column] === gameObjects.mario)
            {
                marioLocation.marioRow = row;
                marioLocation.marioColumn = column;
            }
            if(gameObjects.objectSpots[row][column] === gameObjects.bowser)
            {
                bowserLocation.bowserRow = row;
                bowserLocation.bowserColumn = column;
            }
        }
    }
    // Game variables
    var gameVariables = {
        lives : 15,
        coins : 10,
        gameMessage : "Use the arrow keys to move around the board",
        // Calculate Mario's strength based on his lives and coins
        get marioStrength () { 
            return Math.ceil((this.lives + this.coins) / 2);
        }
    };

    // Directions for Mario to go in the game
    var direction = {
        up : 38,
        down : 40,
        right : 39,
        left : 37
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
                gameVariables.gameMessage = "You run to save the princess!";
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
                endGame();
                break;
        }

        // Move Bowser
        moveBowser();

        // Mario's check for if he is on a Bowser tile
        if(bowserLocation.bowserRow === marioLocation.marioRow && bowserLocation.bowserColumn === marioLocation.marioColumn)
        {
            endGame();  
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

    function moveBowser()
    {
        // Directions Bowser can move
        var bowserDirections = {
            up : 1,
            down: 2,
            left: 3,
            right: 4
        };

        // Stores valid directions that Bowser can move in
        var validDirections = [];

        // The final direction that Bowser will move in
        var direction = undefined;

        // Bowser's check for if he is on Mario's tile
        if(bowserLocation.bowserRow === marioLocation.marioRow && bowserLocation.bowserColumn === marioLocation.marioColumn)
        {
            endGame();  
        }

        // Find out what things are in the cells around Bowser.
        // If it is a blank, push the corresponding direction into the array
        if(bowserLocation.bowserRow > 0)
        {
            var thingAbove = map.mapSpots[bowserLocation.bowserRow - 1][bowserLocation.bowserColumn];    
            if(thingAbove === map.blank)
            {
                validDirections.push(bowserDirections.up); 
            }
        }

        if(bowserLocation.bowserRow < map.rows - 1)
        {
            var thingBelow = map.mapSpots[bowserLocation.bowserRow + 1][bowserLocation.bowserColumn];
            if(thingBelow === map.blank)
            {
                validDirections.push(bowserDirections.down);
            }
        }

        if(bowserLocation.bowserColumn > 0)
        {
            var thingToTheLeft = map.mapSpots[bowserLocation.bowserRow][bowserLocation.bowserColumn - 1];
            if (thingToTheLeft === map.blank)
            {
                validDirections.push(bowserDirections.left);
            }
        }

        if(bowserLocation.bowserColumn < map.columns - 1)
        {
            var thingToTheRight = map.mapSpots[bowserLocation.bowserRow][bowserLocation.bowserColumn + 1];
            if(thingToTheRight === map.blank)
            {
                validDirections.push(bowserDirections.right); 
            }
        }

        // Array now has 4 valid directions that contain cells that Bowser can go onto (blank cells)
        // If a valid direction is found, randomly choose one of the possible directions 
        // and assign it to the direction variable.

        if(validDirections.length !== 0)
        {
            var randomNumber = Math.floor(Math.random() * validDirections.length);
            direction = validDirections[randomNumber];
        }


        // Move Bowser in the chosen random direction
        switch(direction)
        {
            case bowserDirections.up:
                // Clear Bowsers current cell
                gameObjects.objectSpots[bowserLocation.bowserRow][bowserLocation.bowserColumn] = 0;
                //Subtract 1 from Bowser's row
                bowserLocation.bowserRow--;

                // Apply Bowser's new updated position to the array
                gameObjects.objectSpots[bowserLocation.bowserRow][bowserLocation.bowserColumn] = gameObjects.bowser;
                break;

            case bowserDirections.down:
                gameObjects.objectSpots[bowserLocation.bowserRow][bowserLocation.bowserColumn] = 0;
                bowserLocation.bowserRow++;
                gameObjects.objectSpots[bowserLocation.bowserRow][bowserLocation.bowserColumn] = gameObjects.bowser;
                break;

            case bowserDirections.left:
                gameObjects.objectSpots[bowserLocation.bowserRow][bowserLocation.bowserColumn] = 0;
                bowserLocation.bowserColumn--;
                gameObjects.objectSpots[bowserLocation.bowserRow][bowserLocation.bowserColumn] = gameObjects.bowser;
                break;

            case bowserDirections.right:
                gameObjects.objectSpots[bowserLocation.bowserRow][bowserLocation.bowserColumn] = 0;
                bowserLocation.bowserColumn++;
                gameObjects.objectSpots[bowserLocation.bowserRow][bowserLocation.bowserColumn] = gameObjects.bowser;
                break;
        }
    }

    // What happens when Mario encounters a coin cell
    function getCoin()
    {
        // Coin sound
        var coin = document.getElementById("coin");
        coin.play();

        // Coin variable increases
        gameVariables.coins += 5;

        // Coin disappears (set to a blank cell)
        map.mapSpots[marioLocation.marioRow][marioLocation.marioColumn] = 0;

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

        // Mushroom disappears (set to a blank cell)
        map.mapSpots[marioLocation.marioRow][marioLocation.marioColumn] = 0;

        // Update gameMessage
        gameVariables.gameMessage = "You found a giant 1-Up mushroom" +
            "<br> You now have " + (gameVariables.lives - 1) + " lives.";
    }

    // What happens when Mario encounters a piranha plant cell
    // There is a bigger incentive to fight a piranha plant because Mario gains
    // more lives if he wins but it is more dangerous because 
    // he can lose lives AND coins if he loses.
    function fightPiranha()
    {
        // Piranha Plant sound
        var vine = document.getElementById("vine");
        vine.play();

         // Piranha plant strength
        var piranhaStrength = Math.ceil(Math.random() * gameVariables.marioStrength * 2);
        // Piranha plant coins it has
        var piranhaCoins = Math.round(piranhaStrength / 2);

        // Find out if piranha plant is stronger than Mario
        if(piranhaStrength > gameVariables.marioStrength)
        {
            // Piranha Plant takes some of Mario's lives AND coins
            var livesLost = Math.round((piranhaStrength / 3));
            gameVariables.lives -= livesLost;
            var coinsLost = Math.round(piranhaCoins / 2);
            gameVariables.coins -= coinsLost;

            // Update the gameMessage
            gameVariables.gameMessage
            = "You fight and LOSE " + livesLost + " lives and " + coinsLost + " coins." 
            + " <br>Mario's Strength: " + gameVariables.marioStrength
            + " <br>Piranha plant's Strength: " + piranhaStrength;
        }
        else
        {
            // Mario wins a few lives and coins
            gameVariables.coins += piranhaCoins;
            gameVariables.lives += 5;

            // Update the gameMessage
            gameVariables.gameMessage
            = "You fight and WIN " + piranhaCoins + " coins and 5 lives."
            + " <br>Mario's Strength: " + gameVariables.marioStrength
            + " <br>Piranha plant's Strength: " + piranhaStrength;
        }
    }

    // What happens when Mario encounters a goomba cell
    // Gain lives and coins if Mario wins, loses lives if Mario loses
    function fightGoomba()
    {
        // Goomba attack sound
        var goomba = document.getElementById("goomba");
        goomba.play();

        // Goomba strength
        var goombaStrength = Math.ceil(Math.random() * gameVariables.marioStrength * 2);

        // Find out if goomba is stronger than Mario
        if(goombaStrength > gameVariables.marioStrength)
        {
            // Goomba takes some of Mario's lives
            var livesLost = Math.round((goombaStrength / 3));
            gameVariables.lives -= livesLost;

            // Update the gameMessage
            gameVariables.gameMessage
            = "You fight and LOSE " + livesLost + " lives."
            + " <br>Mario's Strength: " + gameVariables.marioStrength
            + " <br>Goomba's Strength: " + goombaStrength;
        }
        else
        {
            // Mario wins a few lives and coins
            var goombaCoins = Math.round(goombaStrength / 2);
            gameVariables.coins += goombaCoins;
            gameVariables.lives += 3;

            // Update the gameMessage
            gameVariables.gameMessage
            = "You fight and WIN " + goombaCoins + " coins and 3 lives."
            + " <br>Mario's Strength: " + gameVariables.marioStrength
            + " <br>Goomba's Strength: " + goombaStrength;
        }
    }

    // What happens when Mario dies, runs out of gold or lives, or reaches Peach
    function endGame()
    {
        // Mario reaches Peach
        if(map.mapSpots[marioLocation.marioRow][marioLocation.marioColumn] === map.peach)
        {
            var youWin = document.getElementById("youWin");
            youWin.play();

            // Show end screen when Mario has reached Peach
            var end = document.getElementById("endScreen1");
            end.style.display = "block";
        }
        // Mario hits Bowser
        else if(bowserLocation.bowserRow === marioLocation.marioRow && bowserLocation.bowserColumn === marioLocation.marioColumn)
        {
            // Show the end screen
            var end = document.getElementById("endScreen3");
            end.style.display = "block";
            // Pause this music in case Mario dies at same time Bowser gets him
            var marioDies = document.getElementById("marioDies");
            marioDies.pause();
            // Show end screen
            var bowserLaugh = document.getElementById("bowserLaugh");
            bowserLaugh.play();
        }
        else // Mario runs out of coins or gold
        {
            // Show the end screen
            var end = document.getElementById("endScreen2");
            end.style.display = "block";

            // Mute piranha sound (if that is how Mario dies)
            var vine = document.getElementById("vine");
            vine.pause();

            // Mute goomba sound (if that is how Mario dies)
            var goomba = document.getElementById("goomba");
            goomba.pause();

            // Play "game over" music
            var marioDies = document.getElementById("marioDies");
            marioDies.play();

        }

        // Remove the keyboard listener to end the game
        window.removeEventListener("keydown", keydownHandler, false);
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
}