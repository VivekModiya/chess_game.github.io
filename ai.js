import {Game} from './game.js';

let game = new Game();

const black_rock = "R";
const black_knight = "N";
const black_bishop = "B";
const black_queen = "Q";
const black_king = "K";
const black_pawn = "P";
const white_rock = "r";
const white_knight = "n";
const white_bishop = "b";
const white_queen = "q";
const white_king = "k";
const white_pawn = "p";

function get_black_pawn_moves(board, id) {
    let x = game.get_position(id)[0];
    let y = game.get_position(id)[1];
    let moves = [];
    if (x != 7 && game.get_peice(board, game.get_id(x + 1, y)) == null) {
        moves.push(game.get_id(x + 1, y));
        if (x == 1 && game.get_peice(board, game.get_id(x + 2, y)) == null) {
            moves.push(game.get_id(x + 2, y));
        }
    }
    if (y != 7 && x != 7) {
        let left = game.get_id(x + 1, y + 1);
        if (game.has_white_peice(board, left)) {
            moves.push(game.get_id(x + 1, y + 1));
        }
    }
    if (y != 0 && x != 7) {
        let right = game.get_id(x + 1, y - 1);
        if (game.has_white_peice(board, right)) {
            moves.push(game.get_id(x + 1, y - 1));
        }
    }
    if (y + 1 < 8 && board.white_double == game.get_id(x, y + 1)) {
        game.remove_peice(board, game.get_id(x, y));
        game.remove_peice(board, game.get_id(x, y + 1));
        if (game.is_check_to_black(board, board.black_king).length > 0);
        else
            moves.push(game.get_id(x + 1, y + 1));
        game.set_peice(board, game.get_id(x, y), black_pawn);
        game.set_peice(board, game.get_id(x, y + 1), white_pawn);
    }
    if (y - 1 >= 0 && board.white_double == game.get_id(x, y - 1)) {
        game.remove_peice(board, game.get_id(x, y));
        game.remove_peice(board, game.get_id(x, y - 1));
        if (game.is_check_to_black(board, board.black_king).length > 0);
        else
            moves.push(game.get_id(x + 1, y - 1));
        game.set_peice(board, game.get_id(x, y), black_pawn);
        game.set_peice(board, game.get_id(x, y - 1), white_pawn);
    }
    return moves;
}

function get_white_pawn_moves(board, id) {
    let x = game.get_position(id)[0];
    let y = game.get_position(id)[1];
    let moves = [];
    if (x != 0 && game.get_peice(board, game.get_id(x - 1, y)) == null) {
        moves.push(game.get_id(x - 1, y));
        if (x == 6 && game.get_peice(board, game.get_id(x - 2, y)) == null) {
            moves.push(game.get_id(x - 2, y));
        }
    }
    if (y != 0 && x != 0) {
        let left = game.get_id(x - 1, y - 1);
        if (game.has_black_peice(board, left)) {
            moves.push(game.get_id(x - 1, y - 1));
        }
    }
    if (y != 7 && x != 0) {
        let right = game.get_id(x - 1, y + 1);
        if (game.has_black_peice(board, right)) {
            moves.push(game.get_id(x - 1, y + 1));
        }
    }
    if (y + 1 < 8 && board.black_double == game.get_id(x, y + 1)) {
        game.remove_peice(board, game.get_id(x, y));
        game.remove_peice(board, game.get_id(x, y + 1));
        if (game.is_check_to_white(board, board.white_king).length > 0);
        else
            moves.push(game.get_id(x - 1, y + 1));
        game.set_peice(board, game.get_id(x, y), white_pawn);
        game.set_peice(board, game.get_id(x, y + 1), black_pawn);
    }
    if (y - 1 >= 0 && board.black_double == game.get_id(x, y - 1)) {
        game.remove_peice(board, game.get_id(x, y));
        game.remove_peice(board, game.get_id(x, y - 1));
        if (game.is_check_to_white(board, board.white_king).length > 0);
        else
            moves.push(game.get_id(x - 1, y - 1));
        game.set_peice(board, game.get_id(x, y), white_pawn);
        game.set_peice(board, game.get_id(x, y - 1), black_pawn);
    }
    return moves;
}

function get_legal_moves(board, id, checked_cells) {
    let moves = [];
    let peice = game.get_peice(board, id);
    if (peice == null) {
        return;
    } else if (peice == black_pawn && checked_cells.length != 2) {
        let possible_moves = get_black_pawn_moves(board, id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == white_pawn && checked_cells.length != 2) {
        let possible_moves = get_white_pawn_moves(board, id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == white_knight && checked_cells.length != 2) {
        let possible_moves = game.get_white_knight_moves(board, id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == black_knight && checked_cells.length != 2) {
        let possible_moves = game.get_black_knight_moves(board, id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == white_bishop && checked_cells.length != 2) {
        let possible_moves = game.get_white_bishop_moves(board, id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == black_bishop && checked_cells.length != 2) {
        let possible_moves = game.get_black_bishop_moves(board, id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == black_rock && checked_cells.length != 2) {
        let possible_moves = game.get_black_rock_moves(board, id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == white_rock && checked_cells.length != 2) {
        let possible_moves = game.get_white_rock_moves(board, id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == black_queen && checked_cells.length != 2) {
        let possible_moves = game.get_black_queen_moves(board, id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == white_queen && checked_cells.length != 2) {
        let possible_moves = game.get_white_queen_moves(board, id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == black_king) {
        let checked_cells = game.get_black_king_moves(board, id);
        let safe_cells = [];
        game.remove_peice(board, id);
        checked_cells.map((id1) => {
            if (game.is_check_to_black(board, id1).length == 0) {
                safe_cells.push(id1);
            }
        });
        game.set_peice(board, id, peice);
        if (board.is_black_king_moved == 0 && game.is_check_to_black(board, "A5").length == 0) {
            if (board.is_black_right_rock_moved == 0 && game.get_peice(board, "A6") == null && game.get_peice(board, "A7") == null && game.is_check_to_black(board, "A7").length == 0 && game.is_check_to_black(board, "A6").length == 0) {
                safe_cells.push("A7");
            }
            if (board.is_black_left_rock_moved == 0 && game.get_peice(board, "A2") == null && game.get_peice(board, "A3") == null && game.get_peice(board, "A4") == null && game.is_check_to_black(board, "A2").length == 0 && game.is_check_to_black(board, "A3").length == 0 && game.is_check_to_black(board, "A4").length == 0) {
                safe_cells.push("A3");
            }
        }
        moves = safe_cells;
    } else if (peice == white_king) {
        let checked_cells = game.get_white_king_moves(board, id);
        let safe_cells = [];
        game.remove_peice(board, id);
        checked_cells.map((id1) => {
            if (game.is_check_to_white(board, id1).length == 0) {
                safe_cells.push(id1);
            }
        });
        game.set_peice(board, id, peice);

        if (board.is_white_king_moved == 0 && game.is_check_to_white(board, "H5").length == 0) {
            if (board.is_white_right_rock_moved == 0 && game.get_peice(board, "H6") == null && game.get_peice(board, "H7") == null && game.is_check_to_white(board, "H7").length == 0 && game.is_check_to_white(board, "H6").length == 0) {
                safe_cells.push("H7");
            }
            if (board.is_white_left_rock_moved == 0 && game.get_peice(board, "H2") == null && game.get_peice(board, "H3") == null && game.get_peice(board, "H4") == null && game.is_check_to_white(board, "H2").length == 0 && game.is_check_to_white(board, "H3").length == 0 && game.is_check_to_white(board, "H4").length == 0) {
                safe_cells.push("H3");
            }
        }
        moves = safe_cells;
    }
    return moves;
}

const points = {
    "Q": 160,
    "q": 160,
    "R": 85,
    "r": 85,
    "b": 50,
    "B": 50,
    "n": 40,
    "N": 40,
    "P": 10,
    "p": 10,
    "K": 1000,
    "k": 1000
}

function make_move(board, last_clicked, id, depth) {
    let peice = game.get_peice(board, last_clicked);
    let id_peice = game.get_peice(board, id);

    let newBoard = board.slice();
    newBoard.__proto__ = board;
    newBoard.point = 0;
    if (id_peice != null) {
        newBoard.point += points[id_peice];
    }
    let xy = game.get_position(id),
        x = xy[0],
        y = xy[1];
    if (id_peice == black_rock) {
        if (y == 0) {
            newBoard.is_black_left_rock_moved = 1;
        } else {
            newBoard.is_black_right_rock_moved = 1;
        }
    }

    if (id_peice == white_rock) {
        if (y == 0) {
            newBoard.is_white_left_rock_moved = 1;
        } else {
            newBoard.is_white_right_rock_moved = 1;
        }
    }

    if (peice == black_pawn) {
        if (x == 7) {
            peice = black_queen;
        }
        if (x - game.get_position(last_clicked)[0] == 2) {
            newBoard.black_double = id;
        }
        if ((y - game.get_position(last_clicked)[1]) != 0 && id_peice == null) {
            game.remove_peice(newBoard, game.get_id(x - 1, y));
        }
    } else {
        newBoard.black_double = "";
    }
    if (peice == white_pawn) {
        if (game.get_position(last_clicked)[0] - x == 2) {
            newBoard.white_double = id;
        }
        if ((y - game.get_position(last_clicked)[1]) != 0 && id_peice == null) {
            game.remove_peice(newBoard, game.get_id(x + 1, y));
        }
        if (x == 0) {
            peice = white_queen;
        }
    } else {
        newBoard.white_double = ""
    }

    let xlast = game.get_position(last_clicked)[0];
    let ylast = game.get_position(last_clicked)[1];


    if (peice == black_pawn) {
        let left_up = game.get_peice(board, game.get_id(xlast - 1, ylast - 1));
        let right_up = game.get_peice(board, game.get_id(xlast - 1, ylast + 1));
        let right_down = game.get_id(xlast + 1, ylast + 1);
        let left_down = game.get_id(xlast + 1, ylast - 1);
        if (left_up == black_bishop || right_up == black_bishop) {
            board.point += 0.3;
        }
        if (left_up == black_queen || right_up == black_queen) {
            board.point += 0.3;
        }
        if ((game.has_black_peice(board, right_down) || game.has_black_peice(board, left_down)) && game.get_peice(board, right_down) != black_king && game.get_peice(board, left_down) != black_king) {
            board.point += 0.3;
        }
        if (x - xlast > 1) {
            board.point += 0.15;
        }
        else if (x == 7) {
            board.point += 150;
        }
        else if (x == 5) {
            board.point += 1;
        }
        else if (x == 4) {
            board.point += 0.3
        }
    }

    if (peice == white_pawn) {
        let left_up = game.get_id(xlast - 1, ylast - 1);
        let right_up = game.get_id(xlast - 1, ylast + 1);
        let right_down = game.get_peice(board, game.get_id(xlast + 1, ylast + 1));
        let left_down = game.get_peice(board, game.get_id(xlast + 1, ylast - 1));
        if (left_down == white_bishop || right_down == white_bishop) {
            board.point += 0.3;
        }
        if (left_down == white_queen || right_down == white_queen) {
            board.point += 0.3;
        }
        if ((game.has_white_peice(board, right_up) || game.has_white_peice(board, left_up)) && game.get_peice(board, right_up) != white_king && game.get_peice(board, left_up) != white_king) {
            board.point += 0.3;
        }
        if (xlast - x > 1) {
            board.point += 0.15;
        }
        else if (x == 0) {
            board.point += 150;
        }
        else if (x == 2) {
            board.point += 1;
        }
        else if (x == 3) {
            board.point += 0.2
        }
    }

    if (peice == black_knight) {
        let moves = game.get_black_knight_moves(board, last_clicked);
        board.point += moves.length / 8;
    }

    if (peice == white_knight) {
        let moves = game.get_white_knight_moves(board, last_clicked);
        board.point += moves.length / 8;
    }

    game.set_peice(newBoard, id, peice);
    game.remove_peice(newBoard, last_clicked);

    if (game.has_white_peice(newBoard, id)) {
        let checked_cells = game.is_check_to_black(newBoard, newBoard.black_king);
        let moves_count = get_moves_count(newBoard, "black", checked_cells);
        if (moves_count == 0) {
            if (checked_cells.length > 0) {
                newBoard.point = 10000;
            } else {
                newBoard.point = 10;
            }
        }
    } else {
        let checked_cells = game.is_check_to_white(newBoard, newBoard.white_king);
        let moves_count = get_moves_count(newBoard, "white", checked_cells);
        if (moves_count == 0) {
            if (checked_cells.length > 0) {
                newBoard.point = 10000;
            } else {
                newBoard.point = 10;
            }
        }
    }

    if (depth == 1) {
        let white = game.is_check_to_white(newBoard, id);
        let black = game.is_check_to_black(newBoard, id);
        let white_supports = white.map((arr) => {
            return points[arr.peice];
        });
        let black_supports = black.map((arr) => {
            return points[arr.peice];
        });
        white_supports.sort();
        black_supports.sort();
        white_supports.unshift(points[peice]);
        let maxPoints = 0;
        let currPoints = 0;
        let i = 0;
        while (true) {
            if (i < black_supports.length) {
                currPoints += white_supports[i];
            }
            else break;

            if (i + 1 < white_supports.length) {
                currPoints -= black_supports[i];
            }
            else {
                maxPoints = Math.max(currPoints, maxPoints);
                break;
            };
            maxPoints = Math.max(currPoints, maxPoints);
            i++;
        }
        newBoard.point -= maxPoints;
    }

    if (peice == black_rock) {
        if (last_clicked == "A1")
            newBoard.is_black_left_rock_moved = 1;
        else
            newBoard.is_black_right_rock_moved = 1;
    }
    if (peice == black_king) {
        newBoard.is_black_king_moved = 1;
        if (last_clicked == "A5" && id == "A7") {
            game.remove_peice(newBoard, "A8");
            game.set_peice(newBoard, "A6", black_rock);
        }
        if (last_clicked == "A5" && id == "A3") {
            game.remove_peice(newBoard, "A1");
            game.set_peice(newBoard, "A4", black_rock);
        }
        newBoard.black_king = id;
    }
    if (peice == white_rock) {
        if (last_clicked == "A1")
            newBoard.is_white_left_rock_moved = 1;
        else
            newBoard.is_white_right_rock_moved = 1;
    }
    if (peice == white_king) {
        newBoard.is_white_king_moved = 1;
        if (last_clicked == "H5" && id == "H7") {
            game.remove_peice(newBoard, "H8");
            game.set_peice(newBoard, "H6", white_rock);
        }
        if (last_clicked == "H5" && id == "H3") {
            game.remove_peice(newBoard, "H1");
            game.set_peice(newBoard, "H4", white_rock);
        }
        newBoard.white_king = id;
    }
    return newBoard;
}

function get_moves_count(board, id, checked_cells) {
    let count = 0;
    if (id == "black") {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (game.has_black_peice(board, game.get_id(i, j))) {
                    count += get_legal_moves(board, game.get_id(i, j), checked_cells).length;
                    if (count > 0) return count;
                }
            }
        }
    } else if (id == "white") {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (game.has_white_peice(board, game.get_id(i, j))) {
                    count += get_legal_moves(board, game.get_id(i, j), checked_cells).length;
                    if (count > 0) return count;
                }
            }
        }
    }
    return count;
}

function think_for_black(board, depth) {
    if (depth == 0) {
        return ["", "", 0];
    }
    let ans = ["", "", -10000];
    let steps = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let id = game.get_id(i, j);
            if (game.has_black_peice(board, id)) {
                let p = game.get_peice(board, id);
                game.remove_peice(board, id);
                let checked_cells = game.is_check_to_black(board, board.black_king);
                game.set_peice(board, id, p);
                let moves = get_legal_moves(board, id, checked_cells);
                steps += moves.length;
                if (moves.length > 0) {
                    moves.map(element => {
                        // console.log(id,element);
                        let newBoard = make_move(board, id, element, depth);
                        let blackPoint = think_for_white(newBoard, depth - 1)[2];
                        if (ans[2] < (newBoard.point - blackPoint)) {
                            ans[0] = id;
                            ans[1] = element;
                            ans[2] = newBoard.point - blackPoint;
                        }

                    });
                }
            }
        }
    }
    if (steps == 0) {
        return ["", "", 0];
    }
    return ans;
}

function think_for_white(board, depth) {
    if (depth == 0) {
        return ["", "", 0];
    }
    let ans = ["", "", -10000];
    let steps = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let id = game.get_id(i, j);
            if (game.has_white_peice(board, id)) {
                let p = game.get_peice(board, id);
                game.remove_peice(board, id);
                let checked_cells = game.is_check_to_white(board, board.white_king);
                game.set_peice(board, id, p);
                let moves = get_legal_moves(board, id, checked_cells);
                steps += moves.length;
                moves.map(element => {
                    let newBoard = make_move(board, id, element, depth);
                    let whitePoint = think_for_black(newBoard, depth - 1)[2];
                    if (ans[2] < (newBoard.point - whitePoint)) {
                        ans[0] = id;
                        ans[1] = element;
                        ans[2] = newBoard.point - whitePoint;
                    }
                });
            }
        }
    }
    if (steps == 0) {
        return ["", "", 0]
    }
    return ans;
}

onmessage = (board) => {
    let moves = think_for_black(board.data,3);
    postMessage(moves);
}

