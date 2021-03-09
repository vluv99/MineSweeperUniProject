
let clone;
let i, j;

for (i = 0; i < 11; i++) {

    if (i ===0)
    showContent('cell-row-' + i);
    /*if (i === 0){
        for (j = 1; j < 10; j++) {
            cloneElement('#cell-0_0', 'cell_' + i + '-' + j, '#cell-row-' + i);
        }
        i++;
        continue;
    }*/

    cloneElement('#cell-row-0', 'cell-row-' + i, '.table');

    for (j = 1; j < 10; j++) {
        cloneElement('#cell-0_0', 'cell_' + i + '-' + j, '#cell-row-' + i);
    }
}

function showContent(parentSelector) {
    var temp = document.getElementsByTagName("template")[0];
    var clon = temp.content.cloneNode(true);
    document.querySelector(parentSelector).appendChild(clon);
}

function cloneElement(selector, idValue, parentSelector){
    // Create a clone of the cell
    clone = document.querySelector(selector).cloneNode(true);
    // Change the id attribute of the newly created cell
    clone.setAttribute('id', idValue);
    // Add the clone to the html
    document.querySelector(parentSelector).appendChild(clone);
}

function clickCell() {
    var element = document.getElementById("cell-0_0-cover");
    element.classList.add("cell-cover__hidden");
}