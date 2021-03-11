let clone;
let i, j;

var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;
var firstClick = true;
var setTimeVar = false;

var HARD_BOMB_NUMBER = 40;
var EASY_BOMB_NUMBER = 10;
var tableWidth, tableHeight;
var array, bombArray;

// Default field appears
easyFieldShow();
//hardFieldShow();

setInterval(setTime, 1000);

// Time counter
function setTime() {
    if (setTimeVar) {
        totalSeconds++;
        secondsLabel.innerHTML = pad(totalSeconds % 60);
        minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
    }
}

// Make single numbers appear double sized: 1 -> 01
function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

// Cloning function
function cloneElement(selector, innerSelector, idValue, parentSelector) {
    // Create a clone of the cell
    clone = document.querySelector(selector).content.cloneNode(true);
    // Change the id attribute of the newly created cell
    clone.querySelector(innerSelector).setAttribute('id', idValue);
    // Add the clone to the html
    document.querySelector(parentSelector).appendChild(clone);
}

function changeFace(lose){
    if (lose === false){
        document.querySelector("#face").innerHTML = '<i class="far fa-laugh-beam"></i>';
    }
}

// Gives the cell the class to animate when clicked
function clickCell(cell) {
    if (firstClick){
        setTimeVar = true;
        firstClick = false;
    }

    // Only disappear if there is no flag on the cell
    if (cell.querySelector("#cell-0_0-cover").innerHTML === "") {
        cell.querySelector("#cell-0_0-cover").classList.add("cell-cover__hidden");
    } else if (cell.querySelector("#cell-0_0-cover").innerHTML === '<i class="fab fa-font-awesome-flag flag-icon"></i>') {
        //nothing happens
    }

    // TODO: make face change for click event
    document.querySelector("#face").innerHTML = '<i class="far fa-surprise"></i>';
    //setInterval(changeFace(false), 100000);

    /*document.querySelector("#face").innerHTML = '<i class="far fa-laugh-beam"></i>';
    <i class="far fa-dizzy"></i>*/
}

// Right click, flag placing function
function rightClick(e) {
    // Check if its empty
    if (e.querySelector("#cell-0_0-cover").innerHTML === "") {
        e.querySelector("#cell-0_0-cover").innerHTML = '<i class="fab fa-font-awesome-flag flag-cell"></i>';
        if (document.getElementById('bomb_count').innerText === "40"){
            HARD_BOMB_NUMBER--;
            document.getElementById('bomb_count').innerHTML = '<i class="fab fa-font-awesome-flag flag-icon"></i>' + HARD_BOMB_NUMBER.toString();
        } else if(document.getElementById('bomb_count').innerText === "10"){
            EASY_BOMB_NUMBER--;
            document.getElementById('bomb_count').innerHTML = '<i class="fab fa-font-awesome-flag flag-icon"></i>' + EASY_BOMB_NUMBER.toString();
        }
    } else {
        e.querySelector("#cell-0_0-cover").innerHTML = "";
    }
}

// function to place randomized bombs on the game field
function placeBombs(bombNumber, width, height) {
    var randX, randY;
    var cellId;
    bombArray = [];

    console.log("Bomb cell ids:")
    for (i = 0; i < bombNumber; i++) {
        // Returns a random integer from 0 to bombNumber-1
        randX = Math.floor(Math.random() * width);
        randY = Math.floor(Math.random() * height);

        while (bombArray.includes(randX + "-" + randY)){
            randX = Math.floor(Math.random() * width);
            randY = Math.floor(Math.random() * height);
        }
        bombArray.push(randY + "-" + randX);

        // Make the needed id string
        cellId = array[randY*10+randX];

        console.log(i + ". " + cellId);

        // Give the icon to the html
        document.getElementById(cellId).querySelector('#cell-0_0-bomb').innerHTML = '<i class="fas fa-bomb"></i>';

        // Change the id in the array to bomb-NUMBER
        //array[randY*10+randX] = "bomb-" + i;
    }
}

// Shared function to generate the table
function generateTable(tableWidth, tableHeight, bombNumber){
    // Clean field area
    document.getElementById('table').innerHTML = "";

    //reset time if started before
    firstClick = true;
    setTimeVar = false;
    totalSeconds = 0;
    document.querySelector("#minutes").innerHTML = '00';
    document.querySelector("#seconds").innerHTML = '00';

    // create array to handle game play
    array = new Array(tableWidth * tableHeight - 1);

    // Set number of bombs in header
    document.getElementById('bomb_count').innerHTML = '<i class="fab fa-font-awesome-flag flag-icon"></i>' + bombNumber;

    // Generate field
    for (i = 0; i < tableHeight; i++) { //row
        cloneElement('#template-row', '#cell-row-0', 'cell-row-' + i, '.table');

        for (j = 0; j < tableWidth; j++) { //cells
            cloneElement('#template-cell', '#cell-0_0', 'cell_' + i + '-' + j, '#cell-row-' + i);
            array[i*10+j] = 'cell_' + i + '-' + j;

            console.log((i) + "-" + (j) + ": " + array[i*10+j]);
            // JS doesn't have multilayer arrays, so that is improvisation
        }
    }
}

// Small field
function easyFieldShow() {
    tableHeight = 10;
    tableWidth = 10;

    console.log("Generated table EASY:")
    generateTable(tableWidth, tableHeight, EASY_BOMB_NUMBER);

    placeBombs(EASY_BOMB_NUMBER, tableWidth, tableHeight);
}

// Big field
function hardFieldShow() {
    tableHeight = 15;   // its reversed for some reason?
    tableWidth = 18;    // but when generated, it does it right :/

    console.log("Generated table HARD:")
    generateTable(tableWidth, tableHeight, HARD_BOMB_NUMBER)

    placeBombs(HARD_BOMB_NUMBER, tableWidth, tableHeight);
}
