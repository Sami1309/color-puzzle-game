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



//RULES?
//Cant reuse any exact shape
//Can rotate?
//More points for amount of colors?
// should mirroring be allowed?
//four minimum
//maybe create an algorithm that can determine matches and cycle until you can find a small grid wiht a n
//nice number of big good matches, perhaps even one big one?
//flipping should be allowed becaues it trivially allows the same one to double, only rotation



document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('game-board');
    const cancelButton = document.getElementById('cancel-button');
    const colors = ['red', 'blue', 'green'];
    let isDragging = false;
    let currentDrag = 0;
    selection = []
    let patternSelection = [[],[],[]];


    // Initialize the grid
    for (let i = 0; i < 49; i++) {
        let cell = document.createElement('div');
        let cellColor = colors[Math.floor(Math.random() * 3)]
        cell.className = 'cell ' + cellColor;
        cell.id = i + " " + cellColor
        board.appendChild(cell);
    }

    function getSquareData(target) {

        let data = target.id.split(" ")
        let num = parseInt(data[0])
        let row = Math.floor(num / 8)
        let col = num % 8
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
        if (isDragging && e.target.classList.contains('cell') && !selection.includes(e.target)) {
            // determine the row, col and color of this cell and push that
            let squareData = getSquareData(e.target)
            selection.push(e.target)
            patternSelection[currentDrag].push(squareData);
            applySelectionStyle(e.target, currentDrag);
        }
    });

    // Handle mouse up
    board.addEventListener('mouseup', function() {
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

    // Check if the selected pattern is legitimate
    function checkPattern(selectedCells) {
        console.log(selectedCells)

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
