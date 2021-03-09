let clone;
let i, j;

var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;

// Default field appear
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
    //var element = document.getElementById(elementId);
    cell.querySelector("#cell-0_0-cover").classList.add("cell-cover__hidden");
}

// Small field
function easyFieldShow(){
    // Clean field area
    document.getElementById('table').innerHTML = "";

    // Generate field
    for (i = 0; i < 10; i++) {
        cloneElement('#template-row', '#cell-row-0', 'cell-row-' + i, '.table');

        for (j = 0; j < 10; j++) {
            cloneElement('#template-cell', '#cell-0_0', 'cell_' + i + '-' + j, '#cell-row-' + i);
        }
    }
}

// Big field
function hardFieldShow(){
    // Clean field area
    document.getElementById('table').innerHTML = "";

    // Generate field
    for (i = 0; i < 15; i++) {
        cloneElement('#template-row', '#cell-row-0', 'cell-row-' + i, '.table');

        for (j = 0; j < 20; j++) {
            cloneElement('#template-cell', '#cell-0_0', 'cell_' + i + '-' + j, '#cell-row-' + i);
        }
    }
}

function rightClick(e){
    //e.preventDefault();
    e.querySelector("#cell-0_0-cover").innerHTML = '<i class="fab fa-font-awesome-flag flag-cell"></i>';
}
