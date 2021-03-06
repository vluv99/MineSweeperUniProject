let clone;
let i, j, x, y;

var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;
var firstClick = true;
var setTimeVar = false;

var isGameOver = false;
var cellsToClickUntilWin;
var clickSound;
const backgroundSong = new Audio('/assets/background_song.mp3');;

var easy_localStorage = [];
var hard_localStorage = [];

var HARD_BOMB_NUMBER = 40;
var EASY_BOMB_NUMBER = 10;
var GAME_HARDNESS;
var tableWidth, tableHeight;
var array, bombArray;
var bombCountRightClick;
var tableBombCount;

var iconFlag = '<i class="fab fa-font-awesome-flag flag-icon"></i>';
var iconBomb = '<i class="fas fa-bomb"></i>';
var iconHappyFace = '<i class="far fa-laugh-beam"></i>';
var iconSurpriseFace = '<i class="far fa-surprise"></i>';
var iconDeadFace = '<i class="far fa-dizzy"></i>';

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

function playBackgroundMusic(){
    backgroundSong.volume = 0.3;
    backgroundSong.loop = true;
    backgroundSong.play();

    document.querySelector("article").innerHTML = '<i class="fas fa-volume-mute" onclick="stopBackgroundMusic()"></i>';
}

function stopBackgroundMusic(){
    backgroundSong.pause();

    document.querySelector("article").innerHTML = '<i class="fas fa-volume-off" onclick="playBackgroundMusic()"></i>';
}

function playSound(url){
    const audio = new Audio(url);
    audio.volume = 0.3;
    audio.play();
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

function gameEnd(isLost) {
    isGameOver = true;
    let cell;

    // stop the time
    setTimeVar = false;

    // if the player lost
    if (isLost === true) {

        // bomb sound when lost
        playSound('/assets/bomb_sound.mp3');

        for (i = 0; i < array.length; i++) {
            for (j = 0; j < array[i].length; j++) {
                if (array[i][j].bomb === true) {
                    cell = array[i][j];

                    // uncover all the bombs
                    cell.hidden = false;
                    updateCell(cell);
                }
            }
        }
    } else { // if the player won

        // winning sound start
        playSound('/assets/win_sound.mp3');

        // check wether the time is better than any of the ones in the arrays
        if (checkScoreForRanklist(totalSeconds)){
            document.getElementById('popup1').hidden = false;
        }
    }
}

// checks the time winners time if its better than any of the ranklist ones
function checkScoreForRanklist(seconds) {
    var retrievedObject;

    if (GAME_HARDNESS === 'easy'){
        retrievedObject = JSON.parse(localStorage.getItem('easy_localStorage'));
    } else if (GAME_HARDNESS === 'hard'){
        retrievedObject = JSON.parse(localStorage.getItem('hard_localStorage'));
    }

    // check if storage is null
    if (retrievedObject !== null) {
        for (i = 0; retrievedObject.length; i++) {
            if (retrievedObject[i].seconds > seconds) {
                return true;
            }
        }
    } else {
        return true;
    }

    return false;
}

// updates the localstorage
function storeScore(seconds, name){
    var retrievedObject;

    // create blank object to fill in the storage
    var newScore ={
        rank: 0,
        name: name,
        seconds: seconds
    }

    // retrive the appropriate storage
    if (GAME_HARDNESS === 'easy'){
        retrievedObject = JSON.parse(localStorage.getItem('easy_localStorage'));
    } else if (GAME_HARDNESS === 'hard'){
        retrievedObject = JSON.parse(localStorage.getItem('hard_localStorage'));
    }

    if (retrievedObject === null){
        newScore.rank = 1;
        retrievedObject = [newScore];

    } else {
        var inserted = false;

        for (i = 0; i < retrievedObject.length; i++) {

            if (retrievedObject[i].seconds > seconds && !inserted) {
                // calculate rank
                newScore.rank = i + 1;

                // set new element into the array while keeping the old ones
                retrievedObject.splice(i, 0, newScore);

                inserted = true;
            } else if (inserted) {
                // after insert, we update the rank of the others behind the new data
                retrievedObject[i].rank = i + 1;
            }
        }
    }

    // remove last element if the array has more than 10
    if (retrievedObject.length > 10){
        retrievedObject.splice(10, 1);
    }

    // update localstorage
    if (GAME_HARDNESS === 'easy'){
        localStorage.setItem('easy_localStorage', JSON.stringify(retrievedObject));
    } else if (GAME_HARDNESS === 'hard'){
        localStorage.setItem('hard_localStorage', JSON.stringify(retrievedObject));
    }
}

// onClick action to get the name, store the new data and UI movements
function submitResult(){
    var name = document.getElementById("nameInput").value;

    storeScore(totalSeconds, name);

    closePopUp('popup1');
    ranklistShow();
}

// header face icon changing function
function changeFace(html_cell) {
    let isLost;

    for (i = 0; i < array.length; i++) {
        for (j = 0; j < array[i].length; j++) {
            if (array[i][j].id === html_cell.id) {
                isLost = array[i][j].bomb;
            }
        }
    }

    if (isLost === false) {
        // if not bomb, change face to surprised
        document.querySelector("#face").innerHTML = iconHappyFace;
    } else if (isLost === true) {
        // if bomb, change face to dead
        document.querySelector("#face").innerHTML = iconDeadFace;
    }
}

//not used
function cellsDisappearing(html_cell) {
    let countDisappearingCells = 0;
    let cell;

    for (i = 0; i < array.length; i++) {
        for (j = 0; j < array[i].length; j++) {

            // find clicked cell
            if (array[i][j].id === html_cell.id) {
                cell = array[i][j];
            }

            for (x = 0; x < array.length - i; x++) {
                let firstContinue = false;
                let lastContinue = false;

                for (y = 0; y < array[i].length - j; y++) {

                    if (array[i + x][j + y].bomb === false) {
                        // if ity empty add and animate
                        if (array[i + x][j + y].neadbyBombCount === 0 || array[i - x][j - y].neadbyBombCount === 0) {
                            // check if plus the original cell is empty
                            if (array[i + x][j + y].neadbyBombCount === 0) {
                                countDisappearingCells++;
                                array[i + x][j + y].hidden = false;
                            }

                            // check if minus the original cell is empty
                            if (array[i - x][j - y].neadbyBombCount === 0) {
                                countDisappearingCells++;
                                array[i - x][j - y].hidden = false;
                            }

                        } // if it has a number add and animate but dont continue that loop
                        else if (array[i + x][j + y].neadbyBombCount > 0 || array[i - x][j - y].neadbyBombCount > 0) {

                            // check if plus the original cell has number
                            if (array[i + x][j + y].neadbyBombCount > 0) {

                                //check if its the fist number in that direction
                                if (lastContinue === false) {
                                    countDisappearingCells++;
                                    array[i + x][j + y].hidden = false;
                                    lastContinue = true;
                                }
                            }

                            // check if minus the original cell has number
                            if (array[i - x][j - y].neadbyBombCount > 0) {

                                //check if its the fist number in that direction
                                if (firstContinue === false) {
                                    countDisappearingCells++;
                                    array[i - x][j - y].hidden = false;
                                    firstContinue = true;
                                }
                            }
                        }
                    }
                }
            }
        }

    }

    cellsToClickUntilWin -= countDisappearingCells;
}

// algorithm for mass checking nearby cells
function floodFill(cell, x, y) {
    if (cell.hidden === false || cell.bomb === true || cell.flag === true) {
        return;
    }

    cell.hidden = false;
    playSound('/assets/Plop_sound_short.mp3');
    //clickSound.play();
    cellsToClickUntilWin--;
    updateCell(cell);

    if (cell.neadbyBombCount > 0) {
        return;
    }

    // go down
    if (array[x + 1]) {
        floodFill(array[x + 1][y], x + 1, y);
    }

    // go up
    if (array[x - 1]) {
        floodFill(array[x - 1][y], x - 1, y);
    }

    // go left
    if (array[x][y - 1]) {
        floodFill(array[x][y - 1], x, y - 1);
    }

    // go right
    if (array[x][y + 1]) {
        floodFill(array[x][y + 1], x, y + 1);
    }
}

// Gives the cell the class to animate when clicked
function clickCell(html_cell) {

    // disable clicks if game is over
    if (isGameOver === true) {
        return;
    }

    // set variables to start timer if its the first click
    if (firstClick) {
        setTimeVar = true;
        firstClick = false;
    }

    let cell;
    //clickSound = sound("assets/Plop_sound.ogg");

    for (i = 0; i < array.length; i++) {
        for (j = 0; j < array[i].length; j++) {

            //check if theres no flag on the cell
            if (array[i][j].flag === true && array[i][j].id === html_cell.id) {
                return;
            }

            if (array[i][j].id === html_cell.id) {
                cell = array[i][j];

                // nothing happens if cell has been already clicked before
                if (cell.hidden === false) {
                    return;
                }

                //cellsToClickUntilWin--; //TODO: if theres more than one cell disappears!!!
                //cell.hidden = false;
                //cellsDisappearing(html_cell);
                floodFill(cell, i, j);
            }
        }
    }

    // change for click event, check if player lost yet
    document.querySelector("#face").innerHTML = iconSurpriseFace;
    if (cell.bomb !== false) {
        changeFace(html_cell);
        cell.gameEndingExplosionCell = true;
        gameEnd(true);
    } else {
        // header change face action
        setTimeout(function () {
            changeFace(html_cell);
        }, 300);

        if (cellsToClickUntilWin === 0) {
            gameEnd(false);
        } else {
            //cellsDisappearing(html_cell);
        }
    }
}

// Right click, flag placing function
function rightClick(html_cell) {
    if (isGameOver) {
        return;
    }

    let bombCountHeader = parseInt(document.getElementById('bomb_count').innerText);

    if (bombCountHeader === HARD_BOMB_NUMBER) {
        bombCountRightClick = HARD_BOMB_NUMBER;
    } else if (bombCountHeader === EASY_BOMB_NUMBER) {
        bombCountRightClick = EASY_BOMB_NUMBER;
    }

    for (i = 0; i < array.length; i++) {
        for (j = 0; j < array[i].length; j++) {
            if (array[i][j].id === html_cell.id && array[i][j].hidden === true) {

                // don't place any flags if there is none left
                if (bombCountHeader === 0 && array[i][j].flag === false) {
                    return;
                }

                // reverse the flag state
                array[i][j].flag = !array[i][j].flag;
                updateCell(array[i][j]);

                // update flag counter
                if (array[i][j].flag === true) {
                    if (bombCountHeader === bombCountRightClick) {
                        bombCountHeader--;
                        bombCountRightClick--;
                        document.getElementById('bomb_count').innerHTML = '<i class="fab fa-font-awesome-flag flag-icon"></i>' + bombCountHeader;
                    }
                } else {
                    if (bombCountHeader === bombCountRightClick) {
                        bombCountHeader++;
                        bombCountRightClick++;
                        document.getElementById('bomb_count').innerHTML = '<i class="fab fa-font-awesome-flag flag-icon"></i>' + bombCountHeader;
                    }
                }
            }
        }
    }
}

function updateCell(cell) {
    var element = document.getElementById(cell.id);

    if (cell.neadbyBombCount > 0) {
        element.querySelector('#cell-0_0-bomb').innerHTML = cell.neadbyBombCount;
    } else {
        element.querySelector('#cell-0_0-bomb').innerHTML = "";
    }

    if (isGameOver === true) {
        element.querySelector("#cell-0_0-cover").classList.add("disableCellClick");
    }

    // add class to cell for disappearing animation
    if (cell.hidden === false) {
        element.querySelector("#cell-0_0-cover").classList.add("cell-cover__hidden");
    }

    // add class to cell that ended the game
    if (cell.gameEndingExplosionCell === true) {
        element.querySelector("#cell-0_0-bomb").classList.add("cell-bomb_losing_cell");
    }

    // add class to cells where bombs had flag on them
    if (cell.bomb === true && cell.flag === true && isGameOver === true) {
        element.querySelector("#cell-0_0-bomb").classList.add("cell-bomb_flag_bomb");
    }

    // place bombs in cell
    if (cell.bomb === true) {
        element.querySelector('#cell-0_0-bomb').innerHTML = iconBomb;
    }

    // update flag state in cell
    if (cell.flag === true) {
        element.querySelector("#cell-0_0-cover").innerHTML = '<i class="fab fa-font-awesome-flag flag-cell"></i>';
    } else {
        element.querySelector("#cell-0_0-cover").innerHTML = "";
    }

}

// function to place randomized bombs on the game field
function placeBombs(bombNumber, width, height) {
    var randX, randY;
    bombArray = [];

    console.clear();
    console.log("Bomb cell ids:")

    while (bombNumber >= 1) {

        // Returns a random integer from 0 to bombNumber-1
        randX = Math.floor(Math.random() * width);
        randY = Math.floor(Math.random() * height);

        while (bombArray.includes(randX + "-" + randY)) {
            randX = Math.floor(Math.random() * width);
            randY = Math.floor(Math.random() * height);
        }
        bombArray.push(randX + "-" + randY);

        array[randY][randX].bomb = true;
        console.log(bombNumber + ". " + array[randY][randX].id);
        let element = document.getElementById('cell-0_0');

        bombNumber--;
    }
}

// function to place the numbers to match the bombs
function placeNumbers() {

    for (i = 0; i < array.length; i++) {
        for (j = 0; j < array[i].length; j++) {
            let num = 0;

            if (array[i][j].bomb === false) {
                for (x = -1; x < 2; x++) {
                    for (y = -1; y < 2; y++) {
                        if (i + x < 0 || i + x > array.length - 1 ||
                            j + y < 0 || j + y > array[i].length - 1) {
                            continue;
                        }

                        if (array[i + x][j + y].bomb === true) {
                            num++;
                        }
                    }
                }

                array[i][j].neadbyBombCount = num;
            }
        }
    }
}

// Shared function to generate the table
function generateTable(tableWidth, tableHeight, bombNumber) {
    // Clean field area
    document.getElementById('table').innerHTML = "";
    isGameOver = false;
    document.querySelector("#face").innerHTML = iconHappyFace;
    tableBombCount = bombNumber;
    cellsToClickUntilWin = tableWidth * tableHeight - bombNumber;

    //reset time if started before
    firstClick = true;
    setTimeVar = false;
    totalSeconds = 0;
    document.querySelector("#minutes").innerHTML = '00';
    document.querySelector("#seconds").innerHTML = '00';

    // create an empty array
    array = [];

    // Set number of bombs in header
    document.getElementById('bomb_count').innerHTML = iconFlag + bombNumber;

    // Generate field
    for (i = 0; i < tableHeight; i++) { //row
        array[i] = [];
        //cloneElement('#template-row', '#cell-row-0', 'cell-row-' + i, '.table');

        for (j = 0; j < tableWidth; j++) { //cells
            array[i][j] = {
                flag: false,
                bomb: false,
                neadbyBombCount: 0,
                hidden: true,
                id: 'cell_' + i + '-' + j,
                gameEndingExplosionCell: false
            }
            //cloneElement('#template-cell', '#cell-0_0', 'cell_' + i + '-' + j, '#cell-row-' + i);
        }
    }

    // Generate bombs onto the table
    placeBombs(bombNumber, tableWidth, tableHeight);

    // Generate numbers onto the table
    placeNumbers();

    drawTable(array);
}

// the actual function to clone the templates according to the array
function drawTable(array) {

    for (let x = 0; x < array.length; x++) {
        const row = array[x];

        //Copy Row
        cloneElement('#template-row', '#cell-row-0', 'cell-row-' + x, '.table');

        for (let y = 0; y < row.length; y++) {
            const cell = row[y];

            //Copy Cell
            cloneElement('#template-cell', '#cell-0_0', 'cell_' + x + '-' + y, '#cell-row-' + x);

            updateCell(cell);
        }
    }
}

// not used
function loadRangList() {
    easy_localStorage = [
        {
            rank: 1,
            name: "kispista35",
            seconds: 320
        },
        {
            rank: 2,
            name: "alibaba",
            seconds: 328
        },
        {
            rank: 3,
            name: "voltegyszervalaha",
            seconds: 485
        },
        {
            rank: 4,
            name: "iGotOnTheRankList",
            seconds: 560
        },
        {
            rank: 4,
            name: "iGotOnTheRankList",
            seconds: 560
        },
        {
            rank: 4,
            name: "iGotOnTheRankList",
            seconds: 560
        },
        {
            rank: 4,
            name: "iGotOnTheRankList",
            seconds: 560
        },
        {
            rank: 4,
            name: "iGotOnTheRankList",
            seconds: 560
        },
        {
            rank: 4,
            name: "iGotOnTheRankList",
            seconds: 560
        }
    ]

    hard_localStorage[0] = {
        rank: 1,
        name: "kispista35",
        seconds: 32
    }

    // Put the object into storage
    localStorage.setItem('easy_localStorage', JSON.stringify(easy_localStorage));
    localStorage.setItem('hard_localStorage', JSON.stringify(hard_localStorage));
}

function drawRankList(hardness) {
    var retrievedStorage;

    if (hardness === 'easy') {
        //get storage
        retrievedStorage = JSON.parse(localStorage.getItem('easy_localStorage'));

        // check if empty
        if (retrievedStorage === null){
            // if empty put text in it
            document.querySelector('.tabcontent').innerHTML = "<p style='margin-top: 25px'>No results yet :(</p>";
        } else {
            // else put the proper things into it
            document.querySelector('.tabcontent').innerHTML = "<h3>Easy:</h3>\n" + "<!-- template here -->";
        }
    } else if (hardness === 'hard') {
        //get storage
        retrievedStorage = JSON.parse(localStorage.getItem('hard_localStorage'));

        // check if empty
        if (retrievedStorage === null){
            // if empty put text in it
            document.querySelector('.tabcontent').innerHTML = "<p style='margin-top: 25px'>No results yet :(</p>";
        } else {
            // else put the proper things into it
            document.querySelector('.tabcontent').innerHTML = "<h3>Hard:</h3>\n" + "<!-- template here -->";
        }
    }

    //check if the storage is undefined
    if (retrievedStorage !== null) {
        for (i = 0; i < retrievedStorage.length; i++) {
            cloneElement('#list-row-template', '#list-row', 'list-row-' + i, '.tabcontent');

            var listOrder = document.getElementById('list-row-' + i);
            listOrder.querySelector("#list-orderNumber").innerHTML = retrievedStorage[i].rank + ".";

            listOrder.querySelector("#cut-text").innerHTML = retrievedStorage[i].name;

            var seconds = retrievedStorage[i].seconds;
            var time = pad(parseInt(seconds / 60));
            time += ':';
            time += pad(seconds % 60);
            listOrder.querySelector("#time").innerHTML = time;
        }
    }
}

// Small field
function easyFieldShow() {
    tableHeight = 10;
    tableWidth = 10;
    GAME_HARDNESS = "easy";

    //console.log("Generated table EASY:")
    generateTable(tableWidth, tableHeight, EASY_BOMB_NUMBER);
}

// Big field
function hardFieldShow() {
    tableHeight = 15;
    tableWidth = 18;
    GAME_HARDNESS = "hard";

    //console.log("Generated table HARD:")
    generateTable(tableWidth, tableHeight, HARD_BOMB_NUMBER)
}

// click event for the face icon
function clickFace() {
    if (tableBombCount === EASY_BOMB_NUMBER) {
        easyFieldShow();
    } else if (tableBombCount === HARD_BOMB_NUMBER) {
        hardFieldShow();
    }
}

// button action to how rank list
function ranklistShow() {
    document.getElementById('ranklist_popup').hidden = false;

    /*document.getElementById(GAME_HARDNESS + '_list').hidden = false;
    document.getElementById(GAME_HARDNESS + '_tab_button').classList.add("active");*/

    // default tab link set
    document.getElementById(GAME_HARDNESS + '_tab_button').click();

}

// function to close the pop up when X is clicked
function closePopUp(string) {
    document.getElementById(string).hidden = true;
}

// it displayes the content of the wanted list
function showList(evt, hardness) {
    var i, tablinks;

    // takes away the focus from the tablinks (buttons)
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // add the focus to the button
    evt.currentTarget.className += " active";

    drawRankList(hardness);
}
