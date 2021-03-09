
let clone;
let i, j;

for (i = 0; i < 10; i++) {

   /* for (j = 1; j < 10; j++) {
        cloneElement('#template-cell', 'cell_' + i + '-' + j, '#cell-row-' + i);
        //clickCell('cell_' + i + '-' + j);
    }*/

    cloneElement('#template-row', '#cell-row-0','cell-row-' + i, '.table');

    for (j = 0; j < 10; j++) {
        cloneElement('#template-cell', '#cell-0_0', 'cell_' + i + '-' + j, '#cell-row-' + i);
    }
}

function showContent() {
    var temp = document.getElementsByTagName("template")[0];
    var clon = temp.content.cloneNode(true);
    document.body.appendChild(clon);
}

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