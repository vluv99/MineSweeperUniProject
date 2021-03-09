
let cell_clone;
let cell_row_clone;

for (i = 1; i < 11; i++) {
    cell_row_clone = document.querySelector('#cell-row-0').cloneNode(true);
    // Change the id attribute of the newly created cell
    cell_row_clone.setAttribute('id', 'cell-row-' + i);
    // Add the clone to the html
    document.querySelector('.table').appendChild(cell_row_clone);

    for (j = 1; j < 10; j++) {
        // Create a clone of the cell
        cell_clone = document.querySelector('#cell-0_0').cloneNode(true);
        // Change the id attribute of the newly created cell
        cell_clone.setAttribute('id', 'cell_' + i + '_' + j);
        // Add the clone to the html
        document.querySelector('#cell-row-' + i).appendChild(cell_clone);
    }
}

function clickCell() {
    var element = document.getElementById("cell-0_0-cover");
    element.classList.add("cell-cover__hidden");
}