'use strict'

// Pieces Types
var QUEEN_WHITE = '♔';
var KING_WHITE = '♕';
var ROOK_WHITE = '♖';
var BISHOP_WHITE = '♗';
var KNIGHT_WHITE = '♘';
var PAWN_WHITE = '♙';
var QUEEN_BLACK = '♚';
var KING_BLACK = '♛';
var ROOK_BLACK = '♜';
var BISHOP_BLACK = '♝';
var KNIGHT_BLACK = '♞';
var PAWN_BLACK = '♟';

// The Chess Board
var gBoard;
var gSelectedElCell = null;

function restartGame() {
    gBoard = buildBoard();
    renderBoard(gBoard);
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < 8; i++) {
        board[i] = []
        for (var j = 0; j < 8; j++) {
            var piece = ''
            if (i === 1) piece = PAWN_BLACK;
            else if (i === 6) piece = PAWN_WHITE;
            board[i][j] = piece
        }
    }
    board[0][0] = board[0][7] = ROOK_BLACK;
    board[0][1] = board[0][6] = KNIGHT_BLACK
    board[0][2] = board[0][5] = BISHOP_BLACK
    board[0][3] = KING_BLACK
    board[0][4] = QUEEN_BLACK

    board[7][0] = board[7][7] = ROOK_WHITE
    board[7][1] = board[7][6] = KNIGHT_WHITE
    board[7][2] = board[7][5] = BISHOP_WHITE
    board[7][3] = KING_WHITE
    board[7][4] = QUEEN_WHITE
    return board;
}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            var cell = row[j];
            var className = (i + j) % 2 === 0 ? 'white' : 'black';
            // TODO: Use Template String
            // Template string = `popo${i}`
            // No template string = 'popo'+i
            var tdId = 'cell-' + i + '-' + j;
            strHtml += '<td id="' + tdId + '" onclick="cellClicked(this)" ' +
                'class="' + className + '">' + cell + '</td>';
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.game-board');
    elMat.innerHTML = strHtml;
}


function cellClicked(elCell) {

    // TODO: if the target is marked - move the piece!
    if (elCell.classList.contains('mark')) {
        movePiece(gSelectedElCell, elCell)
        cleanBoard();
        return;
    }
    cleanBoard();

    elCell.classList.add('selected');
    gSelectedElCell = elCell;

    // console.log('elCell.id: ', elCell.id);
    var cellCoord = getCellCoord(elCell.id);
    var piece = gBoard[cellCoord.i][cellCoord.j];

    var possibleCoords = [];
    switch (piece) {
        case ROOK_BLACK:
        case ROOK_WHITE:
            possibleCoords = getAllPossibleCoordsRook(cellCoord);
            break;
        case BISHOP_BLACK:
        case BISHOP_WHITE:
            possibleCoords = getAllPossibleCoordsBishop(cellCoord);
            break;
        case KNIGHT_BLACK:
        case KNIGHT_WHITE:
            possibleCoords = getAllPossibleCoordsKnight(cellCoord);
            break;
        case PAWN_BLACK:
        case PAWN_WHITE:
            possibleCoords = getAllPossibleCoordsPawn(cellCoord, piece === PAWN_WHITE);
            break;
        case KING_BLACK:
        case KING_WHITE:
            possibleCoords = getAllPossibleCoordsKing(cellCoord);
            break;
        case QUEEN_BLACK:
        case QUEEN_WHITE:
            possibleCoords = getAllPossibleCoordsQueen(cellCoord);
            break;

    }
    // console.log(possibleCoords);
    markCells(possibleCoords);
}

function movePiece(elFromCell, elToCell) {
    // TODO: use: getCellCoord to get the coords, move the piece
    var fromCoord = getCellCoord(elFromCell.id)
    var toCoord = getCellCoord(elToCell.id)
        // update the MODEl, 
    var piece = gBoard[fromCoord.i][fromCoord.j]
    gBoard[toCoord.i][toCoord.j] = piece
    gBoard[fromCoord.i][fromCoord.j] = ''
        //update the DOM
    elFromCell.innerText = ''
    elToCell.innerText = piece
}

function markCells(coords) {
    // TODO: query select them one by one and add mark 
    for (var i = 0; i < coords.length; i++) {
        var currCoord = coords[i]
        var elCell = document.querySelector(getSelector(currCoord))
        elCell.classList.add('mark')
    }
}

// Gets a string such as:  'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
    var coord = {};
    var parts = strCellId.split('-');
    // ['cell','2','7']
    coord.i = +parts[1]
    coord.j = +parts[2];
    return coord;
}

function cleanBoard() {
    var elTds = document.querySelectorAll('.mark, .selected');
    for (var i = 0; i < elTds.length; i++) {
        elTds[i].classList.remove('mark', 'selected');
    }
}

function getSelector(coord) {
    return '#cell-' + coord.i + '-' + coord.j
}

function isEmptyCell(coord) {
    return gBoard[coord.i][coord.j] === ''
}


function getAllPossibleCoordsPawn(pieceCoord, isWhite) {
    var res = [];
    // TODO: handle PAWN
    var diff = isWhite ? -1 : 1
    var nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j }
    if (isEmptyCell(nextCoord)) res.push(nextCoord)
    else return res

    if ((pieceCoord.i === 1 && !isWhite) || (pieceCoord.i === 6 && isWhite)) {
        diff *= 2
        nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j }
        if (isEmptyCell(nextCoord)) res.push(nextCoord)
    }
    return res;
}



function getAllPossibleCoordsRook(pieceCoord) {
    var res = [];
    for (var i = pieceCoord.i - 1; i >= 0; i--) {
        var coord = { i: i, j: pieceCoord.j };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    for (var i = pieceCoord.i + 1; i < 8; i++) {
        var coord = { i: i, j: pieceCoord.j };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    for (var j = pieceCoord.j + 1; j < 8; j++) {
        var coord = { i: pieceCoord.i, j: j };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    for (var j = pieceCoord.j - 1; j >= 0; j--) {
        var coord = { i: pieceCoord.i, j: j };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    return res;
}

function getAllPossibleCoordsBishop(pieceCoord) {
    var res = [];
    var i = pieceCoord.i - 1;
    for (var j = pieceCoord.j + 1; i >= 0 && j < 8; j++) {
        var coord = { i: i--, j };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }

    i = pieceCoord.i - 1;
    for (var j = pieceCoord.j - 1; j >= 0 && i >= 0; j--) {
        coord = { i: i--, j }
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }

    i = pieceCoord.i + 1;
    for (var j = pieceCoord.j - 1; j >= 0 && i < 8; j--) {
        coord = { i: i++, j }
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }

    i = pieceCoord.i + 1;
    for (var j = pieceCoord.j + 1; j < 8 && i < 8; j++) {
        coord = { i: i++, j }
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }

    return res;
}

function getAllPossibleCoordsKnight(pieceCoord) {

}


function getAllPossibleCoordsKing(pieceCoord) {
    var res = [];
    for (var i = pieceCoord.i - 1; i <= pieceCoord.i + 1; i++) {
        if (i < 0 || i === 8) continue;
        for (var j = pieceCoord.j - 1; j <= pieceCoord.j + 1; j++) {
            if (i === pieceCoord.i && j === pieceCoord.j) continue;
            if (j < 0 || j === 8) continue;
            if (isEmptyCell({ i, j })) res.push({ i, j });
        }
    }
    return res;
}

function getAllPossibleCoordsQueen(pieceCoord) {
    var res = []
        // bishop like wise
    var i = pieceCoord.i - 1;
    for (var j = pieceCoord.j + 1; i >= 0 && j < 8; j++) {
        var coord = { i: i--, j };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }

    i = pieceCoord.i - 1;
    for (var j = pieceCoord.j - 1; j >= 0 && i >= 0; j--) {
        coord = { i: i--, j }
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }

    i = pieceCoord.i + 1;
    for (var j = pieceCoord.j - 1; j >= 0 && i < 8; j--) {
        coord = { i: i++, j }
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }

    i = pieceCoord.i + 1;
    for (var j = pieceCoord.j + 1; j < 8 && i < 8; j++) {
        coord = { i: i++, j }
        if (!isEmptyCell(coord)) break;
        res.push(coord);

    }
    // rook like wise
    for (var i = pieceCoord.i - 1; i >= 0; i--) {
        var coord = { i: i, j: pieceCoord.j };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    for (var i = pieceCoord.i + 1; i < 8; i++) {
        var coord = { i: i, j: pieceCoord.j };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    for (var j = pieceCoord.j + 1; j < 8; j++) {
        var coord = { i: pieceCoord.i, j: j };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    for (var j = pieceCoord.j - 1; j >= 0; j--) {
        var coord = { i: pieceCoord.i, j: j };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    return res;
}