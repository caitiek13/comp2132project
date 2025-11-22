// word should be populated with a letterbox for each letter in the word it loads
// sticky will update the image each time a letter was guessed wrong
// pretty sure i will need to run regexp for whatever word is randomly selected
// not sure how exactly though
const spinner = new Image();
spinner.src = '/media/spinner.gif';
spinner.alt = 'Loading';

const jsonUrl                   = "/scripts/movies.json";

const resetBtn                  = document.getElementById('newGame');
const sticky                    = document.getElementById('sticky');
const word                      = document.getElementById('gameWord');
const keys                      = document.querySelectorAll('#keyboard button');
const hintBtn                   = document.getElementById('showHint');
const hint                      = document.getElementById('hint');

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


resetBtn.addEventListener("click", function(){
    hintCounter                 = 0;
    wrongGuesses                = 0;
    gameObject                  = '';
    gameWord                    = '';
    gameWordHints               = [];
    gameWordLetters             = [];
    hint.innerHTML              = '';
    hint.classList.remove('hintBox');
    hint.classList.add('hide');

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

        for(let i = 0; i < gameWord.length; i++){
            gameWordLetters.push(gameWord.charAt(i));
        }

        if(gameWordLetters.length > 0){
            word.innerHTML = startGame(gameWordLetters);
            
            sticky.src = `${imgSrc}stick${wrongGuesses}.jpg`;
            hintBtn.classList.remove('hide');
            resetBtn.innerText = "New Game";
        }
        
    }).catch(function(error){
        console.log(error);
    });
    
})

hintBtn.addEventListener("click", function(){
    hint.classList.remove('hide');
    hint.classList.add('hintBox');
    
    if(hintCounter <= 1){
        hintCounter++;
        hint.innerHTML += `<p>${gameWordHints[(hintCounter - 1)]}</p>`;
    }else if(hintCounter == 2){
        hintCounter++;
        hintBtn.setAttribute('disabled', true);
        hint.innerHTML += `<p>${gameWordHints[(hintCounter - 1)]}</p>`;
    }
})

keys.forEach(function(button){
    button.addEventListener("click", function(){
        button.setAttribute('disabled', true);

        if(gameWordLetters.includes(button.id)){
            console.log("correct");
        }else{
            console.log("wrong");
            wrongGuesses++;
            sticky.src = `${imgSrc}stick${wrongGuesses}.jpg`;
        }

        checkLetters(button);

        if(wrongGuesses == 5){
            keys.forEach(function(btn){
                btn.setAttribute('disabled', true);
            })
            hintBtn.setAttribute('disabled', true);
        }
    })
})

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

// build a function that checks the gameWordLetters whenever
// a key is pressed, and removes the hiddenLetter class
// if the button.id matches the innerHTML of each letterbox

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

    console.log("letters left to guess: " + lettersLeft);

    if(lettersLeft == 0){
        console.log("you win!");
    }

    gameWordLetters = gameWordNewLetters;
    gameWordNewLetters = [];
    
}