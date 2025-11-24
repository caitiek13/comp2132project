const spinner = new Image();
spinner.src = '/media/spinner.gif';
spinner.alt = 'Loading';

const jsonUrl                   = "/scripts/movies.json";

const resetBtn                  = document.getElementById('newGame');
const sticky                    = document.getElementById('sticky');
const word                      = document.getElementById('gameWord');
const keys                      = document.querySelectorAll('#keyboard button');
const hintBtn                   = document.getElementById('showHint');
const hintBox                   = document.getElementById('hint');
const messageBox                = document.getElementById('message');

let fetchData;
let arrayNames;
let arrayHints;
let imgSrc                      = "/media/images/";

let hintCounter                 = 0;
let wrongGuesses                = 0;
let gameObject                  = '';
let gameWord                    = '';
let gameWordHints               = [];
let gameWordLetters             = [];
let gameWordNewLetters          = [];
let message                     = '';


resetBtn.addEventListener("click", function(){
    hintCounter                 = 0;
    wrongGuesses                = 0;
    gameObject                  = '';
    gameWord                    = '';
    gameWordHints               = [];
    gameWordLetters             = [];
    hintBox.innerHTML           = '';
    message                     = '';
    messageBox.innerHTML        = message;
    hintBox.classList.remove('hintBox');
    hintBox.classList.add('hide');
    
    // reset all buttons
    keys.forEach(function(button){
        button.removeAttribute('disabled');
    })
    hintBtn.removeAttribute('disabled');

    fetch(jsonUrl).then(function(response){
        word.appendChild(spinner);

        if(response.ok){
            return response.json();
        }else{
            console.log(response.error);
        }

    }).then(function(data){
        word.innerHTML = '';
        fetchData = data;
        
        arrayNames = data.map(person => person);
        arrayShuffle(arrayNames);
        gameObject = arrayNames[0];
        gameWord = gameObject.name;
        gameWordHints = gameObject.hints;

        // chop the name of the chosen film into little bits
        // which we will use to build the letterboxes,
        // and to run verification checks with each keypress
        
        for(let i = 0; i < gameWord.length; i++){
            gameWordLetters.push(gameWord.charAt(i));
        }

        word.innerHTML = startGame(gameWordLetters);
        
        sticky.src = `${imgSrc}stick${wrongGuesses}.jpg`;
        hintBtn.classList.remove('hide');
        resetBtn.innerText = "New Game";

    }).catch(function(error){
        console.log(error);
    });
    
})

hintBtn.addEventListener("click", function(){
    hintBox.classList.remove('hide');
    hintBox.classList.add('hintBox');
    
    // only 3 hints per film
    if(hintCounter <= 1){
        hintCounter++;
        hintBox.innerHTML += `<p>${gameWordHints[(hintCounter - 1)]}</p>`;
    }else if(hintCounter == 2){
        hintCounter++;
        hintBtn.setAttribute('disabled', true);
        hintBox.innerHTML += `<p>${gameWordHints[(hintCounter - 1)]}</p>`;
    }
})

keys.forEach(function(button){
    button.addEventListener("click", function(){
        button.setAttribute('disabled', true);

        if(!gameWordLetters.includes(button.id)){
            wrongGuesses++;
            sticky.src = `${imgSrc}stick${wrongGuesses}.jpg`;
        }

        // run the verifying function
        checkLetters(button);

        if(wrongGuesses == 5){
            // player lost, game over

            keys.forEach(function(btn){
                btn.setAttribute('disabled', true);
            })
            hintBtn.setAttribute('disabled', true);

            message ='<p class="bad">Game over! Give Sticky another shot and try again!</p>';
            messageBox.innerHTML = message;
        }
    })
})

// shuffle the json array which we put our JSON into
// so a random film is chosen each new game

function arrayShuffle(anArray){
    let j, x, i;

    for (i = anArray.length - 1; i > 0; i--) {

        j = Math.floor(Math.random() * (i + 1));
        x = anArray[i];

        anArray[i] = anArray[j];
        anArray[j] = x;
    }

    return anArray;
}

function startGame(chosenWord){
    let html = '';

    chosenWord.forEach(function(letter){
        if(letter != " "){
            html += `<div class="hiddenLetterBox"><div class="hiddenLetter">${letter}</div></div>`;
        }else{
            html += `<div class="spacebox">${letter}</div>`;
        }
    })

    return html;
}

function checkLetters(guess){

    let lettersLeft = 0;

    // take the answers we've gotten so far
    // and 'update' the array if the guess was correct
    // (copy to a new array)

    gameWordLetters.forEach(function(letter){
        if(letter == letter.toUpperCase()){
            // letter already correctly guessed
            gameWordNewLetters.push(letter);

        }else if(letter == " "){
            // empty space
            gameWordNewLetters.push(letter);

        }else if(guess.id == letter.toLowerCase()){
            // player made a correct guess; change letter case
            gameWordNewLetters.push(letter.toUpperCase());

        }else if(guess.id != letter){
            gameWordNewLetters.push(letter);
            lettersLeft++;
        }
    })

    // update the word letterboxes each check

    let html = '';

    gameWordNewLetters.forEach(function(letter){
        if(letter != " "){
            if(letter == letter.toUpperCase()){
                html += `<div>${letter}</div>`;
            }else if(letter == letter.toLowerCase()){
                html += `<div class="hiddenLetterBox"><div class="hiddenLetter">${letter}</div></div>`;
            }
        }else{
            html += `<div class="spacebox">${letter}</div>`;
        }
    })

    word.innerHTML = html;

    // if all letters are capitalized (correct) player wins
    
    if(lettersLeft == 0){
        message = '<p class="good">You win! Sticky is free to go for now... Play again?</p>'
        messageBox.innerHTML = message;
    }

    // make the copied array the new original array
    // so we can continue

    gameWordLetters = gameWordNewLetters;
    gameWordNewLetters = [];
    
}