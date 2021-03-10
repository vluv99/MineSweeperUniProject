let clone;
let i, j;

var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;

var HARD_BOMB_NUMBER = 40;
var EASY_BOMB_NUMBER = 10;
var tableWidth, tableHeight;
var array;

// Default field appears
easyFieldShow();

setInterval(setTime, 1000);

// Time counter
function setTime() {
    if (false) {
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

// Gives the cell the class to animate when clicked
function clickCell(cell) {
    // Only disappear if there is no flag on the cell
    if (cell.querySelector("#cell-0_0-cover").innerHTML === "") {
        cell.querySelector("#cell-0_0-cover").classList.add("cell-cover__hidden");
    } else if (cell.querySelector("#cell-0_0-cover").innerHTML === '<i class="fab fa-font-awesome-flag flag-icon"></i>') {
        //nothing happens
    }

    // TODO: make face change for click event
    /*document.querySelector("#face").innerHTML = '<i class="far fa-surprise"></i>';
    document.querySelector("#face").innerHTML = '<i class="far fa-laugh-beam"></i>';
    <i class="far fa-dizzy"></i>*/
}

// Right click, flag placing function
function rightClick(e) {
    // Check if its empty
    if (e.querySelector("#cell-0_0-cover").innerHTML === "") {
        e.querySelector("#cell-0_0-cover").innerHTML = '<i class="fab fa-font-awesome-flag flag-cell"></i>';
    } else {
        e.querySelector("#cell-0_0-cover").innerHTML = "";
    }
}

function placeBombs(bombNumber, width, height) {
    var randX, randY;
    var cellId;
    var randArray = [];

    console.log("Bomb cell ids:")
    for (i = 0, j = 0; i < bombNumber; i++, j++) {
        // Returns a random integer from 0 to bombNumber-1
        randX = Math.floor(Math.random() * width);
        randY = Math.floor(Math.random() * height);

        while (randArray.includes(randX + "-" + randY)){
            randX = Math.floor(Math.random() * width);
            randY = Math.floor(Math.random() * height);
        }
        randArray.push(randX + "-" + randY);

        // Make the needed id string
        cellId = array[randX*10+randY];

        console.log(cellId);

        // Give the icon to the html
        document.getElementById(cellId).querySelector('#cell-0_0-bomb').innerHTML = '<i class="fas fa-bomb"></i>';

        // Change the id in the array to bomb-NUMBER
        array[randX*10+randY] = "bomb-" + i;
    }
}

function generateTable(tableWidth, tableHeight, bombNumber){
    // Clean field area
    document.getElementById('table').innerHTML = "";
    array = new Array(tableWidth * tableHeight - 1);

    // Set number of bombs in header
    document.getElementById('bomb_count').innerHTML = '<i class="fab fa-font-awesome-flag flag-icon"></i>' + bombNumber;

    // Generate field
    for (i = 0; i < tableHeight; i++) {
        cloneElement('#template-row', '#cell-row-0', 'cell-row-' + i, '.table');

        for (j = 0; j < tableWidth; j++) {
            cloneElement('#template-cell', '#cell-0_0', 'cell_' + i + '-' + j, '#cell-row-' + i);
            array[i*10+j] = 'cell_' + i + '-' + j;

            console.log((i) + "-" + (j) + ": " + array[i*10+j]);
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
    tableHeight = 15;
    tableWidth = 18;

    console.log("Generated table HARD:")
    generateTable(tableWidth, tableHeight, HARD_BOMB_NUMBER)

    placeBombs(HARD_BOMB_NUMBER, tableWidth, tableHeight);
}
