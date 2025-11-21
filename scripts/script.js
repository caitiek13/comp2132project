// word should be populated with a letterbox for each letter in the word it loads
// sticky will update the image each time a letter was guessed wrong
// pretty sure i will need to run regexp for whatever word is randomly selected
// not sure how exactly though
const spinner = new Image();
spinner.src = '/media/spinner.gif';
spinner.alt = 'Loading';

const resetBtn                  = document.getElementById('newGame');
const sticky                    = document.getElementById('sticky');
const word                      = document.getElementById('gameWord');
const keys                      = document.querySelectorAll('button');
const hintBtn                   = document.getElementById('showHint');
const genreBtn                  = document.getElementById('showGenre');
const hint                      = document.getElementById('hint');

const jsonUrl                   = "/scripts/game-characters.json";

let fetchData;
let arrayNames;
let arrayHints;

let hintCounter                 = 0;
let genreHintGiven              = false;
let wrongGuesses                = 0;
let gameObject                  = '';
let gameWord                    = '';
let gameWordHints               = [];
let gameWordLetters             = [];



// each button including newGame returns its id
// which is it's letter, or newGame for the reset button
keys.forEach(function(button){
    button.addEventListener("click", function(){
        console.log(button.getAttribute('id'));
    })
})

resetBtn.addEventListener("click", function(){
    hintCounter                 = 0;
    genreHintGiven              = false;
    wrongGuesses                = 0;
    gameObject                  = '';
    gameWord                    = '';
    gameWordHints               = [];
    gameWordLetters             = [];
    hint.innerHTML              = '';

    fetch(jsonUrl).then(function(response){
        word.appendChild(spinner);

        if(response.ok){
            return response.json();
        }else{
            console.log("nope");
        }
    }).then(function(data){
        word.innerHTML = '';
        fetchData = data;
        
        arrayNames = data.map(person => person);
        arrayShuffle(arrayNames);
        gameObject = arrayNames[0];
        gameWord = gameObject.name;
        gameWordHints = gameObject.hints;
        console.log(gameWord, gameWordHints);
        for(let i = 0; i < gameWord.length; i++){
            gameWordLetters.push(gameWord.charAt(i));
            
        }
        console.log(gameWordLetters);
    }).catch(function(error){
        console.log(error);
    });

    hintBtn.classList.remove('hide');
    genreBtn.classList.remove('hide');
    resetBtn.innerText = "New Game";

    
})

hintBtn.addEventListener("click", function(){
    if(hintCounter < 3){
        hintCounter++;
        hint.innerHTML += `${gameWordHints[(hintCounter - 1)]}`;
    }else if(hintCounter == 2 && genreHintGiven == false){
        hintCounter++;
        
    }
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
// resetBtn.addEventListener('click', function(){

//     // Remove any existing HTML on the output div
//     gameWord.innerHTML = '';
//     // Insert a spinner while the data loads
//     gameWord.appendChild(spinner);
    
//     /*
//     this fetch request also includes an api key to give
//     us permission to use the API
//     */
//     fetch('https://dog-breeds9.p.rapidapi.com/tags/all-breeds', {
//         "method": "GET",
//         "headers": {
//             "x-rapidapi-key": "25bca918c1msh235d5efa1e41b22p10dfc7jsn46cd01eb47d4",
// 		    "x-rapidapi-host": "dog-breeds9.p.rapidapi.com"
//         }
//     })
//         .then(function(response){
            
//             if(response.ok){
//                 return response.json();
//             }else{
//                 console.log("Network error: fetch failed");
//             }
            
//         })
//         .then(function(data){
//             // Remove the spinner
//             gameWord.innerHTML = '';
//             gameWord.removeChild;

//             console.log(data.text);
           

//         })
//         .catch(function(error){
//             gameWord.innerHTML = `<p>${error}. Please try again.</p>`;
//         });

// });

// need to fetch a new 'item' on each reset, store new info into a json object
// so page should open with a fresh fetch already and reset just reloads page
// this needs to be figured out


