// Array of words
const words = [
    "Hello", "Programming", "Code", "Javascript", "Town", "Country", "Testing", "Youtube", "Linkedin", "Twitter", "Github", "Leetcode",
    "Internet", "Python", "Scala", "Destructuring", "Paradigm", "Styling", "Cascade", "Documentation", "Coding", "Funny", "Working",
    "Dependencies", "Task", "Runner", "Roles", "Test", "Rust", "Playing"
];
let startNum = words.length;
let num;
// Setting levels
const lvls = {
    "Easy":5,
    "Normal":3,
    "Hard":2,
};
// Set Default Level
let defaultLevelName;
let defaultLevelSeconds;
//Catch Selectors
let container = document.querySelector(".container");
let startButton = document.querySelector(".start");
let lvlNameSpan = document.querySelector(".message .lvl");
let secondsSpan = document.querySelector(".message .seconds");
let theWord = document.querySelector(".the-word");
let upcomingWords = document.querySelector(".upcoming-words");
let input = document.querySelector(".input");
let timeLeftSpan = document.querySelector(".time span");
let scoreGot = document.querySelector(".score .got");
let scoreTotal = document.querySelector(".score .total");
let finishMessage = document.querySelector(".finish");
let lvlsSelector = document.getElementById("lvls");
let insButton = document.querySelector(".ins-btn");

//set instructions span

let instructionSpan = document.createElement("span")
instructionSpan.className = "instruction"
//Set Level Name , Seconds and Score
scoreTotal.innerHTML = words.length;
defaultLevelName = lvlsSelector.value;
if (sessionStorage.getItem("lvlName")) {
    defaultLevelName = sessionStorage.getItem("lvlName")
    lvlsSelector.value = sessionStorage.getItem("lvlName")
}
function setLevel() {
    defaultLevelSeconds = lvls[defaultLevelName];
    lvlNameSpan.innerHTML = defaultLevelName;
    secondsSpan.innerHTML = defaultLevelSeconds;
    timeLeftSpan.innerHTML = defaultLevelSeconds;
}
setLevel()
lvlsSelector.onchange = function () {
    sessionStorage.setItem("lvlName",lvlsSelector.value)
    defaultLevelName = sessionStorage.getItem("lvlName");
    setLevel()
    showInstructions();
}
// Disable Paste at input field
input.onpaste = ()=> false;
//start game 
startButton.onclick = function () {
    this.remove();
    lvlsSelector.remove()
    input.focus();
    instructionSpan.remove()
    //generate word function
    genWords();
}

function genWords() {
    //get random word from array
    let randomWord = words[Math.floor(Math.random() * words.length)];
    //get word index
    let wordIndex = words.indexOf(randomWord);
    //remove word from array
    words.splice(wordIndex,1);
    //show the word
    theWord.innerHTML = randomWord;
    //empty upcoming words
    upcomingWords.innerHTML = "";
    //generate upcomingWords
    for (let i = 0; i < words.length; i++) {
        let div = document.createElement("div")
        let txt = document.createTextNode(words[i])
        div.appendChild(txt)
        upcomingWords.appendChild(div)
    }
    upcomingWords.style.display = "flex";
    num = document.querySelectorAll(".upcoming-words div").length;
    if (startNum - num === 1) {
        defaultLevelSeconds += 3;
    }else {
        defaultLevelSeconds = lvls[defaultLevelName]
    }
    //call start play function
    startPlay()
}
function startPlay() {
    //reset time after finish one word 
    timeLeftSpan.innerHTML = defaultLevelSeconds
    //set time to play
    let start = setInterval(() => {
        timeLeftSpan.innerHTML--;
        //check if time is left
        if (timeLeftSpan.innerHTML == 0) {
            clearInterval(start)
            //check if the user typed word is true
            if (theWord.innerHTML.toLowerCase() === input.value.toLowerCase()) {
                input.value = "";
                scoreGot.innerHTML++;
                // add score to local storage
                setScoreToLS();
                //check if the words isnot empty
                if (words.length > 0) {
                    genWords();
                //check if the words is empty
                }else {
                    let span = document.createElement("span")
                    let txt = document.createTextNode("Congratulations")
                    span.className = "good"
                    span.appendChild(txt)
                    finishMessage.appendChild(span)
                    //remove upcoming Words
                    upcomingWords.remove();
                    playAgain()
                }
            //check if the user typed word is wrong
            }else {
                let span = document.createElement("span")
                let txt = document.createTextNode("Game Over")
                span.appendChild(txt)
                span.className = "bad"
                finishMessage.appendChild(span)
                playAgain()
            }
        }
    }, 1000);
}
// play again
function playAgain() {
    let span = document.createElement("span")
    span.className = "play-again"
    let txt = document.createTextNode("Play Again")
    span.appendChild(txt)
    finishMessage.appendChild(span)
    document.querySelector(".play-again").addEventListener("click",()=>location.reload())
}
// add score to local storage
function setScoreToLS() {
    let time = new Date()
    let scores ={};
    if (localStorage.getItem("scores")) {
        scores[lvlsSelector.value] = JSON.parse(localStorage.getItem("scores"))[lvlsSelector.value]
    }
    Object.defineProperty(scores, lvlsSelector.value, {
        writable : true,
        configurable : true,
        enumerable : true,
        value : `Last Score is ${scoreGot.innerHTML} at ${time}`
    });
    localStorage.setItem("scores",JSON.stringify(scores));
}
// function to show instructions
function showInstructions() {
    instructionSpan.innerHTML = ""
    genInstruction(`Welcom to Typing Speed Test Game!     
    Follow next instruction :     
    [1] You are now at ${lvlsSelector.value} level which give you ${lvls[lvlsSelector.value]} seconds to type the word which appear above     
    [2] You have a number of words, the best practice that you finish it all     
    [3] If your word isn't identical to the word you have a game over and try again
    [4] You have 3 seconds only for first word`)
}
// function to generate instructions
function genInstruction(ins) {
    let txt = document.createTextNode(ins);
    instructionSpan.appendChild(txt);  
    container.appendChild(instructionSpan);
}
showInstructions()
insButton.onclick = function () {
    this.remove();
    instructionSpan.style.display = "block";
}