function generateWinningNumber() {
  return Math.floor((Math.random() * 100) + 1);
}

function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
  return Math.abs(this.winningNumber - this.playersGuess);
}

Game.prototype.isLower = function() {
  if (this.playersGuess < this.winningNumber) {
    return true;
  }
  else {
    return false;
  }
}

Game.prototype.playersGuessSubmission = function(num) {
  if (num > 0 && num < 101) {
    this.playersGuess = num;
    var result = this.checkGuess();
    return result;
  }
  else {
    return('That is an invalid guess.');
  }
}

Game.prototype.checkGuess = function() {
  if (this.pastGuesses.includes(this.playersGuess)) {
    return 'You have already guessed that number.';
  }
  else if (this.playersGuess == this.winningNumber) {
    return 'You Win!';
  }
  else if (this.pastGuesses.length === 4) {
    return 'You Lose.';
  }
  else if (this.difference() < 10) {
    this.pastGuesses.push(this.playersGuess);
    return "You're burning up!";
  }
  else if (this.difference() < 25) {
    this.pastGuesses.push(this.playersGuess);
    return "You're lukewarm.";
  }
  else if (this.difference() < 50) {
    this.pastGuesses.push(this.playersGuess);
    return "You're a bit chilly.";
  }
  else {
    this.pastGuesses.push(this.playersGuess);
    return "You're ice cold!";
  }
}

Game.prototype.provideHint = function() {
  var newArr = [];
  newArr.push(this.winningNumber);
  while (newArr.length < 3) {
    newArr.push(generateWinningNumber());
  };
  shuffle(newArr);
  return newArr;
}

function newGame() {
  return new Game();
}

function cloudDrawer() {
  var c = document.getElementById("header-border");
  var ctx = c.getContext("2d");

  // Stroke canvas / create border
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = 50;
  ctx.strokeStyle = "black";
  for (var x = 0; x <= c.width; x += 70) {
    ctx.beginPath();
    ctx.arc(x, 0, 35, 0, Math.PI, false);
    if (x % 2 === 0) {
      ctx.arc(x + 70, 0, 35, 0, Math.PI, false);
    }
    ctx.fillStyle = $("#headers").css("backgroundColor");
    ctx.fill();
  }
}

function toggleButtons(bool) {
  $("#input-btn").prop("disabled", bool);
  $("#hint-btn").prop("disabled", bool);
}

$(window).resize(function() {
    cloudDrawer();
});

$(document).ready(function() {
  var curGame = newGame();
  var hintArr = curGame.provideHint()
  cloudDrawer();

  $("#hint-btn").on("click", function() {
    var hintText = hintArr.join(', ');
    $("#header").text("Here's a hint: " + hintText);
  });

  $("#reset-btn").on("click", function() {
    curGame = newGame();
    hintArr = curGame.provideHint()
    $("#guesses-list").empty();
    $("#header").text("I'm thinking of a number between 1 and 100...");
    $("#headers").css("background-color", "white");
    $("#subtitle").text('');
    toggleButtons(false);
    cloudDrawer();
  });

  $("#input-btn").on("click", function() {
    var playerInput = document.forms["player-input"]["input-field"].value;
    var result = curGame.playersGuessSubmission(playerInput);
    var bckColor = '';
    $("#input-field").val('');
    $("#header").text(result);
    if (result === "You Win!") {
      $("#subtitle").text("Thanks for playing!");
      toggleButtons(true);
    }
    else if (result === "You're burning up!") {
      bckColor = 'red';
    }
    else if (result === "You're lukewarm.") {
      bckColor = '#CD5C5C';
    }
    else if (result === "You're ice cold!") {
      bckColor = '#00FFFF';
    }
    else if (result === "You're a bit chilly.") {
      bckColor = '#87CEFA';
    }
    else if (result === "You Lose.") {
      $("#subtitle").text("Click the reset button to retry!");
      toggleButtons(true);
    }
    if ($("li").length !== 4 &&
      result !== 'You have already guessed that number.' &&
      result !== 'That is an invalid guess.'
    ) {
      if (playerInput.split('').length === 1) {
        $("#guesses-list").append(
          "<li class='guess small-guess' style='background-color:" + bckColor + "'>" +
          playerInput + "</li>"
        );
      }
      else {
        $("#guesses-list").append(
          "<li class='guess' style='background-color:" + bckColor + "'>" +
          playerInput + "</li>"
        );
      }
    }
    $("#headers").css("background-color", bckColor);
    cloudDrawer();
  });
});
