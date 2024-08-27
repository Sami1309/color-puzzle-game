//TODO to make this interesting
// actual measure of progress: recording for each pattern size on thie right?
//Algorithm to find all fitting patterns for each board.
// Find max score and high score and sheeet I guess lmao


// I really want it to tell me how many patterns there are so I m no loser
//TODO
//Fix the error symbol drag issue on second drag
//Make sure the press down resets upon clicking cancel button
//Create logic for identifying if pattern is valid
//Think about variations. Rotation, color schemes, size, etc?
// Determine scoring system
// Create url scheme so that individual boards can be shared
//Create "board of the day" feature
//Make the whole thing look prettier, border must be full square, etc, colors
// Create sounds? Animations??

//HOLY SHIT since every match needs to have a strict submatch, simply find the matches of 4 then expand one by one
//For the valid ones, crawling up until the limit
//Simply around the border, depth/breadth first search style

//niiiiice

//maybe the calculation should find 1 4, 1 5, one 6 and one 7
//Which really means 4 4s, 3 5s, 2 6s and 7 seven
//Could you reliably manufacture this in as small of a grid as possible? overlaps may be necessary
//I don't like the thick overlaps but it feels icky to ban them

//maybe have rows on the side that collect them and saves them as little mini things haha
//dissuade from squares because it makes it too easy? also big chunks of lots of different colors?

//Also automatically tally the sub-matches so users don't need to drag over redundantly

//RULES?
//Cant reuse any exact shape
//Can rotate?
//More points for amount of colors?
// should mirroring be allowed?
//four minimum
//maybe create an algorithm that can determine matches and cycle until you can find a small grid wiht a n
//nice number of big good matches, perhaps even one big one?
//flipping should be allowed becaues it trivially allows the same one to double, only rotation

const GRID_SIZE = 6; // Set the grid size here

//Scoring: 2^(numsquaresperpattern-3)? add num colors bonus?
// TODO2 cancel click (pressed down variable) when cancel button clicked so it doesn't persist

document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('game-board');

    board.style.setProperty('--grid-size', GRID_SIZE);


    const cancelButton = document.getElementById('cancel-button');
    const scoreDisplay = document.getElementById('score-display');
    const colors = ['red', 'blue', 'green'];
    let isDragging = false;
    let currentDrag = 0;
    selection = []
    let patternSelection = [[],[],[]];
    let score = 0; // Initialize score

    function updateScore(points) {
        score += points;
        scoreDisplay.textContent = 'Score: ' + score;
    }


    function objectContains(array, obj) {
        for (let i = 0; i < array.length; i++) {
            let element = array[i]
            jsonString = JSON.stringify(element)
            myObjectString = JSON.stringify(obj)
            if (jsonString == myObjectString) {
                return true
            }
        }
        return false
    }

    // Initialize the grid
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        let cell = document.createElement('div');
        let cellColor = colors[Math.floor(Math.random() * 3)]
        cell.className = 'cell ' + cellColor;
        cell.id = i + " " + cellColor
        board.appendChild(cell);
    }

    function getSquareData(target) {

        let data = target.id.split(" ")
        let num = parseInt(data[0])
        let row = Math.floor(num / GRID_SIZE)
        let col = num % GRID_SIZE
        let color = data[1]

        return {
            row: row,
            col: col,
            color: color
        }
    }

    // Handle mouse down
    board.addEventListener('mousedown', function(e) {
        if (e.target.classList.contains('cell')) {
            isDragging = true;
            e.preventDefault();
            // determine the row, col and color of this cell and push that
            let squareData = getSquareData(e.target)
            selection.push(e.target)
            patternSelection[currentDrag].push(squareData);
            applySelectionStyle(e.target, currentDrag);
        }
    });

    // Handle mouse move
    board.addEventListener('mousemove', function(e) {
        if (isDragging && e.target.classList.contains('cell')) {
            // determine the row, col and color of this cell and push that
            let squareData = getSquareData(e.target)
            if( !objectContains(patternSelection[currentDrag], squareData)) {
                patternSelection[currentDrag].push(squareData);
                applySelectionStyle(e.target, currentDrag);
            }
            // if (!patternSelection[currentDrag].includes()) {
              
            // }
            if (!selection.includes(e.target)) {
                selection.push(e.target)
            }
        }
    });

    // Handle mouse up
    board.addEventListener('mouseup', function() {

        // if it's below 4 just fucking cancel
        //throw it out!!!
        //Make sure pattern isn't 3 or fewer

        // TODO1 on release, check if we have already selected that square in a winning pattern, and cancel if so
        // and give the user a notification
        // will negate in the middle of pattern searching but not remove previous attempts to avoid
        // frusteration



        //TODO if we have just overlapped completely cancel it (just revert and indicate to user) that you cant repeat tlike that
        //since the colors overlap just cancel the last one and go back
        //REMOVE patternSelection[currentDrag]
        //REVERT STYLES (we can do this via the patternSelection array via some algorithm)
        //Could be easy if we just store the targets in the pattern selection array


        isDragging = false;
        if (selection.length > 0) {
            currentDrag++;
            if (currentDrag === 3) {
                checkPattern(patternSelection);
                currentDrag = 0; // Reset for next set of drags
                clearSelection();
            }
        }
    });

    // Apply selection styles based on drag count
    function applySelectionStyle(target, dragCount) {
    target.classList.add('selected');
    if (dragCount === 1) {
        target.classList.remove('orange-border');
        target.classList.add('white-border');
    } else if (dragCount === 2) {
        target.classList.remove('white-border');
        target.classList.add('orange-border');
    }
}

    // Clear all selections
    function clearSelection() {
        const selectedCells = document.querySelectorAll('.selected');
        selectedCells.forEach(cell => {
            cell.classList.remove('selected', 'white-border', 'orange-border');
        });
        selection = [];
        patternSelection = [[],[],[]]
    }

    function patternSortFunction(a, b) {
        if (a.row < b.row) {
            return -1
        } else if (a.row == b.row && a.col < b.col) {
            return -1
        }
        return 1
    }

    function patternNormalizeFunction(patternArray) {
        let minRow1 = patternArray[0].row
        let minCol1 = patternArray[0].col
        patternArray.forEach(square => {
            square.row -= minRow1
            square.col -= minCol1
        })
    }

    function hasSamePattern(pattern1, pattern2) {
        //check if all the square values (row, col) are equal, and the pattern is equal

        for (let i = 0; i < pattern1.length; i++) {
            if (pattern1[i].col !== pattern2[i].col || pattern1[i].row !== pattern2[i].row) {
                return false
            }
        }

        //same shape, now check for same pattern
        
        let whichColor1 = 0
        let whichColor2 = 0
        const pattern1Colors = {}
        const pattern2Colors = {}
        let square1Pattern = ""
        let square2Pattern = ""
        pattern1.forEach(square => {
            if(square.color in pattern1Colors) {
                square1Pattern += pattern1Colors[square.color]
            } else {
                pattern1Colors[square.color] = whichColor1
                whichColor1++
                square1Pattern += pattern1Colors[square.color]
            }
        })

        pattern2.forEach(square => {
            if(square.color in pattern2Colors) {
                square2Pattern += pattern2Colors[square.color]
            } else {
                pattern2Colors[square.color] = whichColor2
                whichColor2++
                square2Pattern += pattern2Colors[square.color]
            }
        })

        // console.log(square1Pattern, square2Pattern)
        //must have same row, col for each
        if (square1Pattern == square2Pattern) {
            console.log("same pattern holy shit1")
            return true
        }
        return false
    }

    //also confirm they
    function isSamePattern(pattern1, pattern2) {
        if (pattern1.length != pattern2.length) {
            return false
        }
        //Takes two patterns, expecting the same orientation and confirms that they are the same
        // color agnostic, checks for relative equality
        pattern1.sort(patternSortFunction)
        pattern2.sort(patternSortFunction)
        patternNormalizeFunction(pattern1)
        patternNormalizeFunction(pattern2)

        //rotate here?
        //take max y
        //cw1: take max y, every x is max y minus prev y, every y is prev x
        //(max([y])-y1, x)
        let pat1Rots = [pattern1]
        let pat2Rots = [pattern2]

        for (let i = 1; i < 4; i++) {
            let rotPattern = []
            //get max row
            let maxRow = 0
            pat1Rots[i-1].forEach(square => {
                if (square.row > maxRow) {
                    maxRow = square.row
                }
            })
            for (let j = 0; j < pattern1.length; j++) {
                let rotated = {...pat1Rots[i-1][j]}
                //row is y, col i x
                let temp = rotated.col
                rotated.col = maxRow - rotated.row
                rotated.row = temp
                rotPattern.push(rotated)
            }
            pat1Rots.push(rotPattern)
        }

        for (let i = 1; i < 4; i++) {
            let rotPattern = []
            //get max row
            let maxRow = 0
            pat2Rots[i-1].forEach(square => {
                if (square.row > maxRow) {
                    maxRow = square.row
                }
            })
            for (let j = 0; j < pattern2.length; j++) {
                let rotated = {...pat2Rots[i-1][j]}
                //row is y, col i x
                let temp = rotated.col
                rotated.col = maxRow - rotated.row
                rotated.row = temp
                rotPattern.push(rotated)
            }
            pat2Rots.push(rotPattern)
        }

        // console.log("pat1Rots and pat2Rots should have 4 lists each in them with the rotated patterns")
        // now call the pattern sort function on each yeaaaa
        pat1Rots.forEach(pattern => {
            pattern.sort(patternSortFunction)
        })
        pat2Rots.forEach(pattern => {
            pattern.sort(patternSortFunction)
        })
        // console.log("pat1rots:", pat1Rots)
        // console.log("pat2Rots,", pat2Rots)

        // console.log("sorted normalized pattern 1", pattern1)
        // console.log("sorted normalized pattern 2", pattern2)

        // now we need to check pattern equality on every permutation lollllll

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (hasSamePattern(pat1Rots[i],pat2Rots[j])) {
                    return true
                }
            }
        }
        return false

        
        // let pattern1Colors = []
        // let pattern2Colors = []
        //now just returns true if they have the same exact shape
        // return true

        


    }
    // Check if the selected pattern is legitimate
    function checkPattern(selectedCells) {
        console.log(selectedCells)

        //CANT BE THE SAME LOLLLLL THAT"S CHEATING LAMO 

        if (isSamePattern(selectedCells[0], selectedCells[1]) && 
        isSamePattern(selectedCells[1], selectedCells[2]) && 
        isSamePattern(selectedCells[0], selectedCells[2])) {
            console.log("We got a bingo!!!!")
            updateScore(Math.pow(2,selectedCells[0].length-4));
        }

        selectedCells.map(array => {
            
        })
        // Add pattern checking logic here
        // console.log('Checking pattern:', selectedCells.map(el => el.className));
        // Step 0: check for repeats
        // Step 1, confirm they are all the same shape (easy, just take the min element, subtract from all, and the ordered list should be the same for all)
        // Step 2, create array for each selection ordered by x then y
        // Step 3, confirm that for each array, each pair of elements is either the same or different in the same way
        // If wrong, return false, if not, return true and score
    }

    // Cancel current selection
    cancelButton.addEventListener('click', function() {
        clearSelection();
        currentDrag = 0; // Reset drag count
    });
});
