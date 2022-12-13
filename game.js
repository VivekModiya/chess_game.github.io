import { Dom } from './dom.js';
const dom = new Dom();

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


let game = new Game();

function get_position(id) {
    let xy = [];
    xy[0] = id.charCodeAt(0) - 65;
    xy[1] = id.charCodeAt(1) - 49;
    return xy;
}

function peice_color(board, id) {
    let peice = get_peice(board, id);
    if (peice == null) return null;
    if (peice >= 'A' && peice <= 'Z') {
        return "black";
    } else return "white";
}

function has_white_peice(board, id) {
    return (peice_color(board, id) == "white");
}

function has_black_peice(board, id) {
    return (peice_color(board, id) == "black");
}

function get_peice(board, id) {
    let peice = board[get_position(id)[0]][get_position(id)[1]];
    if (peice == ".") {
        return null;
    }
    return peice;
}

function get_id(x, y) {
    let id = String.fromCharCode(65 + x, 49 + y);
    return id;
}

function remove_peice(board, id) {
    let x = get_position(id)[0],
        y = get_position(id)[1];
    let s = board[x];
    let newString = "";
    for (let i = 0; i < 8; i++) {
        if (i == y) {
            newString += ".";
        } else newString += s[i];
    }
    board[x] = newString;
}

function set_peice(board, id, peice) {
    let x = get_position(id)[0],
        y = get_position(id)[1];
    let s = board[x];
    let newString = "";
    for (let i = 0; i < 8; i++) {
        if (i == y) {
            newString += peice;
        } else newString += s[i];
    }
    board[x] = newString;
}

function set_blue_bg(chess, id) {
    dom.set_blue_bg(chess, id);
    chess.bg_highlighted_color.set(id, "blue");
}

function set_red_bg(chess, id) {
    dom.set_red_bg(chess, id);
    chess.bg_highlighted_color.set(id, "red");
}

function clear_background(chess) {
    dom.clear_background(chess);
    chess.bg_highlighted_color.clear();
    chess.shown_moves = [];
}

function undo(chess, cnt = true) {
    let moves_queue = chess.moves_queue;
    let board = chess.board;
    if (moves_queue.length == 0) {
        return;
    }
    let last_moves = moves_queue[moves_queue.length - 1];
    dom.set_peice(last_moves["2"][0], last_moves["2"][1]);
    set_peice(board, last_moves["2"][0], last_moves["2"][1]);
    if (last_moves["1"][1] != null) {
        dom.set_peice(last_moves["1"][0], last_moves["1"][1]);
        set_peice(board, last_moves["1"][0], last_moves["1"][1]);
        dom.remove_from_captured(last_moves["1"][1] >= "A" && last_moves["1"][1] <= "Z" ? "black" : "white");
    } else {
        dom.remove_peice(last_moves["1"][0]);
        remove_peice(board, last_moves["1"][0]);
    }
    if (last_moves["3"] != null) {
        if (last_moves["3"][1] != null) {
            dom.set_peice(last_moves["3"][0], last_moves["3"][1]);
            set_peice(board, last_moves["3"][0], last_moves["3"][1]);
        } else {
            dom.remove_peice(last_moves["3"][0]);
            remove_peice(board, last_moves["3"][0]);
        }
    }
    if (last_moves["4"] != null) {
        if (last_moves["4"][1] != null) {
            dom.set_peice(last_moves["4"][0], last_moves["4"][1]);

            set_peice(board, last_moves["4"][0], last_moves["4"][1]);
        } else {
            dom.remove_peice(last_moves["4"][0]);
            remove_peice(board, last_moves["4"][0]);
        }
    }

    chess.term = last_moves.term;
    chess.is_black_king_moved = last_moves.is_black_king_moved;
    chess.is_white_king_moved = last_moves.is_white_king_moved;
    chess.is_black_left_rock_moved = last_moves.is_black_left_rock_moved;
    chess.is_black_right_rock_moved = last_moves.is_black_right_rock_moved;
    chess.is_white_left_rock_moved = last_moves.is_white_left_rock_moved;
    chess.is_white_right_rock_moved = last_moves.is_white_right_rock_moved;
    chess.black_double = last_moves.black_double;
    chess.white_double = last_moves.white_double;
    chess.black_king_id = last_moves.black_king_id;
    chess.white_king_id = last_moves.white_king_id;
    dom.remove_last_move(last_moves["1"][0]);
    dom.remove_last_move(last_moves["2"][0]);
    moves_queue.pop();
    let len = moves_queue.length,
        last_move = moves_queue[len - 1];
    if (len) {
        dom.show_last_move(last_move["1"][0]);
        dom.show_last_move(last_move["2"][0]);
    }


    let element = document.querySelector(".layer");
    document.getElementById("check").setAttribute("hidden", "hidden");
    element.style.display = "none";
    clear_background(chess);
    if (cnt && chess.player == "computer") {
        undo(chess, 0);
    }
}

function is_check_to_white(board, id) {
    let moves = get_white_bishop_moves(board, id);
    let checked_cells = [];
    let x = get_position(id)[0],
        y = get_position(id)[1];
    moves.map((id1) => {
        let peice = get_peice(board, id1);
        if (has_black_peice(board, id1) && (peice == black_bishop || peice == black_queen)) {
            let temp = [];
            temp.peice = peice;
            let x1 = get_position(id1)[0],
                y1 = get_position(id1)[1];
            while (x1 != x && y1 != y) {
                temp.push(get_id(x1, y1));
                if (x1 > x) {
                    x1--;
                } else {
                    x1++;
                }
                if (y1 > y) {
                    y1--;
                } else {
                    y1++;
                }
            }
            checked_cells.push(temp);
        }
    });

    moves = get_white_rock_moves(board, id);
    moves.map((id1) => {
        let peice = get_peice(board, id1);
        if (has_black_peice(board, id1) && (get_peice(board, id1) == black_rock || get_peice(board, id1) == black_queen)) {
            let temp = [];
            temp.peice = peice;
            let x1 = get_position(id1)[0],
                y1 = get_position(id1)[1];
            while (x1 != x || y1 != y) {
                temp.push(get_id(x1, y1));
                if (x1 > x) {
                    x1--;
                } else if (x1 < x) {
                    x1++;
                }
                if (y1 > y) {
                    y1--;
                } else if (y1 < y) {
                    y1++;
                }
            }
            checked_cells.push(temp);
        }
    });

    moves = get_white_knight_moves(board, id);
    moves.map((id1) => {
        let temp = [id1];
        if (has_black_peice(board, id1) && (get_peice(board, id1) == black_knight)) {
            temp.peice = black_knight;
            checked_cells.push(temp);
        }
    });

    moves = get_white_king_moves(board, id);
    moves.map((id1) => {
        let temp = [id1];
        if (has_black_peice(board, id1) && (get_peice(board, id1) == black_king)) {
            temp.peice = black_king;
            checked_cells.push([id1]);
        }
    });

    if (x - 1 >= 0 && y + 1 < 8 && get_peice(board, get_id(x - 1, y + 1)) == black_pawn) {
        let temp = [get_id(x - 1, y + 1)];
        temp.peice = black_pawn;
        checked_cells.push(temp);
    }
    if (x - 1 >= 0 && y - 1 >= 0 && get_peice(board, get_id(x - 1, y - 1)) == black_pawn) {
        let temp = [get_id(x - 1, y - 1)];
        temp.peice = black_pawn;
        checked_cells.push(temp);
    }
    return checked_cells;
}

function is_check_to_black(board, id) {
    let moves = get_black_bishop_moves(board, id);
    let checked_cells = [];
    let x = get_position(id)[0],
        y = get_position(id)[1];
    moves.map((id1) => {
        let peice = get_peice(board, id1);
        if (has_white_peice(board, id1) && (peice == white_bishop || peice == white_queen)) {
            let temp = [];
            temp.peice = peice;
            let x1 = get_position(id1)[0],
                y1 = get_position(id1)[1];
            while (x1 != x && y1 != y) {
                temp.push(get_id(x1, y1));
                if (x1 > x) {
                    x1--;
                } else {
                    x1++;
                }
                if (y1 > y) {
                    y1--;
                } else {
                    y1++;
                }
            }
            checked_cells.push(temp);
        }
    });

    moves = get_black_rock_moves(board, id);
    moves.map((id1) => {
        let peice = get_peice(board, id1);
        if (has_white_peice(board, id1) && (get_peice(board, id1) == white_rock || get_peice(board, id1) == white_queen)) {
            let temp = [];
            temp.peice = peice;
            let x1 = get_position(id1)[0],
                y1 = get_position(id1)[1];
            while (x1 != x || y1 != y) {
                temp.push(get_id(x1, y1));
                if (x1 > x) {
                    x1--;
                } else if (x1 < x) {
                    x1++;
                }
                if (y1 > y) {
                    y1--;
                } else if (y1 < y) {
                    y1++;
                }
            }
            checked_cells.push(temp);
        }
    });

    moves = get_black_knight_moves(board, id);
    moves.map((id1) => {
        if (has_white_peice(board, id1) && (get_peice(board, id1) == white_knight)) {
            let temp = [id1];
            temp.peice = white_knight;
            checked_cells.push(temp);
        }
    });


    moves = get_black_king_moves(board, id);
    moves.map((id1) => {
        if (has_white_peice(board, id1) && (get_peice(board, id1) == white_king)) {
            let temp = [id1];
            temp.peice = white_king;
            checked_cells.push(temp);
        }
    });

    if (x + 1 < 8 && y + 1 < 8 && get_peice(board, get_id(x + 1, y + 1)) == white_pawn) {
        let temp = [get_id(x + 1, y + 1)];
        temp.peice = white_pawn;
        checked_cells.push(temp);
    }
    if (x + 1 < 8 && y - 1 >= 0 && get_peice(board, get_id(x + 1, y - 1)) == white_pawn) {
        let temp = [get_id(x + 1, y - 1)];
        temp.peice = white_pawn;
        checked_cells.push(temp);
    }
    return checked_cells;
}

function get_black_pawn_moves(chess, id) {
    let board = chess.board;
    let x = get_position(id)[0];
    let y = get_position(id)[1];
    let moves = [];
    if (x != 7 && get_peice(board, get_id(x + 1, y)) == null) {
        moves.push(get_id(x + 1, y));
        if (x == 1 && get_peice(board, get_id(x + 2, y)) == null) {
            moves.push(get_id(x + 2, y));
        }
    }
    if (y != 7 && x != 7) {
        let left = get_id(x + 1, y + 1);
        if (has_white_peice(board, left)) {
            moves.push(get_id(x + 1, y + 1));
        }
    }
    if (y != 0 && x != 7) {
        let right = get_id(x + 1, y - 1);
        if (has_white_peice(board, right)) {
            moves.push(get_id(x + 1, y - 1));
        }
    }
    if (y + 1 < 8 && chess.white_double == get_id(x, y + 1)) {
        remove_peice(board, get_id(x, y));
        remove_peice(board, get_id(x, y + 1));
        if (is_check_to_black(board, chess.black_king_id).length > 0);
        else
            moves.push(get_id(x + 1, y + 1));
        set_peice(board, get_id(x, y), black_pawn);
        set_peice(board, get_id(x, y + 1), white_pawn);
    }
    if (y - 1 >= 0 && chess.white_double == get_id(x, y - 1)) {
        remove_peice(board, get_id(x, y));
        remove_peice(board, get_id(x, y - 1));
        if (is_check_to_black(board, chess.black_king_id).length > 0);
        else
            moves.push(get_id(x + 1, y - 1));
        set_peice(board, get_id(x, y), black_pawn);
        set_peice(board, get_id(x, y - 1), white_pawn);
    }
    return moves;
}

function get_white_pawn_moves(chess, id) {
    let board = chess.board;
    let x = get_position(id)[0];
    let y = get_position(id)[1];
    let moves = [];
    if (x != 0 && get_peice(board, get_id(x - 1, y)) == null) {
        moves.push(get_id(x - 1, y));
        if (x == 6 && get_peice(board, get_id(x - 2, y)) == null) {
            moves.push(get_id(x - 2, y));
        }
    }
    if (y != 0 && x != 0) {
        let left = get_id(x - 1, y - 1);
        if (has_black_peice(board, left)) {
            moves.push(get_id(x - 1, y - 1));
        }
    }
    if (y != 7 && x != 0) {
        let right = get_id(x - 1, y + 1);
        if (has_black_peice(board, right)) {
            moves.push(get_id(x - 1, y + 1));
        }
    }
    if (y + 1 < 8 && chess.black_double == get_id(x, y + 1)) {
        remove_peice(board, get_id(x, y));
        remove_peice(board, get_id(x, y + 1));
        if (is_check_to_white(board, chess.white_king_id).length > 0);
        else
            moves.push(get_id(x - 1, y + 1));
        set_peice(board, get_id(x, y), white_pawn);
        set_peice(board, get_id(x, y + 1), black_pawn);
    }
    if (y - 1 >= 0 && chess.black_double == get_id(x, y - 1)) {
        remove_peice(board, get_id(x, y));
        remove_peice(board, get_id(x, y - 1));
        if (is_check_to_white(board, chess.white_king_id).length > 0);
        else
            moves.push(get_id(x - 1, y - 1));
        set_peice(board, get_id(x, y), white_pawn);
        set_peice(board, get_id(x, y - 1), black_pawn);
    }
    return moves;
}

function get_white_knight_moves(board, id) {
    let x = get_position(id)[0],
        y = get_position(id)[1];
    let possible_moves = [
        [x + 2, y - 1],
        [x + 2, y + 1],
        [x - 2, y + 1],
        [x - 2, y - 1],
        [x + 1, y - 2],
        [x + 1, y + 2],
        [x - 1, y + 2],
        [x - 1, y - 2]
    ];
    let moves = [];
    possible_moves.map((xy) => {
        let x1 = xy[0],
            y1 = xy[1];
        if (x1 >= 0 && y1 >= 0 && x1 < 8 && y1 < 8 && !has_white_peice(board, get_id(x1, y1))) {
            moves.push(get_id(x1, y1));
        }
    });
    return moves;
}

function get_black_knight_moves(board, id) {
    let x = get_position(id)[0],
        y = get_position(id)[1];
    let possible_moves = [
        [x + 2, y - 1],
        [x + 2, y + 1],
        [x - 2, y + 1],
        [x - 2, y - 1],
        [x + 1, y - 2],
        [x + 1, y + 2],
        [x - 1, y + 2],
        [x - 1, y - 2]
    ];
    let moves = [];
    possible_moves.map((xy) => {
        let x1 = xy[0],
            y1 = xy[1];
        if (x1 >= 0 && y1 >= 0 && x1 < 8 && y1 < 8 && !has_black_peice(board, get_id(x1, y1))) {
            moves.push(get_id(x1, y1));
        }
    });
    return moves;
}

function get_black_bishop_moves(board, id) {
    let x = get_position(id)[0],
        y = get_position(id)[1];
    let possible_moves = [
        [x + 1, y + 1],
        [x - 1, y + 1],
        [x + 1, y - 1],
        [x - 1, y - 1]
    ];
    let moves = [];
    possible_moves.map((xy) => {
        let x1 = xy[0],
            y1 = xy[1];
        while (x1 >= 0 && x1 < 8 && y1 >= 0 && y1 < 8) {
            if (has_black_peice(board, get_id(x1, y1))) {
                break;
            } else if (has_white_peice(board, get_id(x1, y1))) {
                moves.push(get_id(x1, y1));
                break;
            } else {
                moves.push(get_id(x1, y1));
            }
            if (x1 > x) {
                x1++;
            } else {
                x1--;
            }
            if (y1 > y) {
                y1++;
            } else {
                y1--;
            }
        }
    });
    return moves;
}

function get_white_bishop_moves(board, id) {
    let x = get_position(id)[0],
        y = get_position(id)[1];
    let possible_moves = [
        [x + 1, y + 1],
        [x - 1, y + 1],
        [x + 1, y - 1],
        [x - 1, y - 1]
    ];
    let moves = [];
    possible_moves.map((xy) => {
        let x1 = xy[0],
            y1 = xy[1];
        while (x1 >= 0 && x1 < 8 && y1 >= 0 && y1 < 8) {
            if (has_white_peice(board, get_id(x1, y1))) {
                break;
            } else if (has_black_peice(board, get_id(x1, y1))) {
                moves.push(get_id(x1, y1));
                break;
            } else {
                moves.push(get_id(x1, y1));
            }
            if (x1 > x) {
                x1++;
            } else {
                x1--;
            }
            if (y1 > y) {
                y1++;
            } else {
                y1--;
            }
        }
    });
    return moves;
}

function get_white_rock_moves(board, id) {
    let x = get_position(id)[0],
        y = get_position(id)[1];
    let possible_moves = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1]
    ];
    let moves = [];
    possible_moves.map((xy) => {
        let x1 = xy[0],
            y1 = xy[1];
        while (x1 >= 0 && x1 < 8 && y1 >= 0 && y1 < 8) {
            if (has_white_peice(board, get_id(x1, y1))) {
                break;
            } else if (has_black_peice(board, get_id(x1, y1))) {
                moves.push(get_id(x1, y1));
                break;
            } else {
                moves.push(get_id(x1, y1));
            }
            if (x1 > x) {
                x1++;
            } else if (x1 < x) {
                x1--;
            }
            if (y1 > y) {
                y1++;
            } else if (y1 < y) {
                y1--;
            }
        }
    });
    return moves;
}

function get_black_rock_moves(board, id) {
    let x = get_position(id)[0],
        y = get_position(id)[1];
    let possible_moves = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1]
    ];
    let moves = [];
    possible_moves.map((xy) => {
        let x1 = xy[0],
            y1 = xy[1];
        while (x1 >= 0 && x1 < 8 && y1 >= 0 && y1 < 8) {
            if (has_black_peice(board, get_id(x1, y1))) {
                break;
            } else if (has_white_peice(board, get_id(x1, y1))) {
                moves.push(get_id(x1, y1));
                break;
            } else {
                moves.push(get_id(x1, y1));
            }
            if (x1 > x) {
                x1++;
            } else if (x1 < x) {
                x1--;
            }
            if (y1 > y) {
                y1++;
            } else if (y1 < y) {
                y1--;
            }
        }
    });
    return moves;
}

function get_black_queen_moves(board, id) {
    let moves1 = get_black_rock_moves(board, id);
    let moves2 = get_black_bishop_moves(board, id);
    let moves = [].concat(moves1, moves2);
    return moves;
}

function get_white_queen_moves(board, id) {
    let moves1 = get_white_rock_moves(board, id);
    let moves2 = get_white_bishop_moves(board, id);
    let moves = [].concat(moves1, moves2);
    return moves;
}

function get_white_king_moves(board, id) {
    let x = get_position(id)[0],
        y = get_position(id)[1];
    let possible_moves = [
        [x - 1, y - 1],
        [x - 1, y],
        [x - 1, y + 1],
        [x, y + 1],
        [x + 1, y + 1],
        [x + 1, y],
        [x + 1, y - 1],
        [x, y - 1]
    ];
    let moves = [];
    possible_moves.map((xy) => {
        let x1 = xy[0],
            y1 = xy[1];
        if (x1 >= 0 && y1 >= 0 && x1 < 8 && y1 < 8 && !has_white_peice(board, get_id(x1, y1))) {
            moves.push(get_id(x1, y1));
        }
    });
    return moves;
}

function get_black_king_moves(board, id) {
    let x = get_position(id)[0],
        y = get_position(id)[1];
    let possible_moves = [
        [x - 1, y - 1],
        [x - 1, y],
        [x - 1, y + 1],
        [x, y + 1],
        [x + 1, y + 1],
        [x + 1, y],
        [x + 1, y - 1],
        [x, y - 1]
    ];
    let moves = [];
    possible_moves.map((xy) => {
        let x1 = xy[0],
            y1 = xy[1];
        if (x1 >= 0 && y1 >= 0 && x1 < 8 && y1 < 8 && !has_black_peice(board, get_id(x1, y1))) {
            moves.push(get_id(x1, y1));
        }
    });
    return moves;
}

function get_legal_moves(chess, id, checked_cells) {
    let board = chess.board;
    let moves = [];
    let peice = get_peice(board, id);
    if (peice == null) {
        return;
    } else if (peice == black_pawn && checked_cells.length != 2) {
        let possible_moves = get_black_pawn_moves(chess, id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == white_pawn && checked_cells.length != 2) {
        let possible_moves = get_white_pawn_moves(chess, id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == white_knight && checked_cells.length != 2) {
        let possible_moves = get_white_knight_moves(board, id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == black_knight && checked_cells.length != 2) {
        let possible_moves = get_black_knight_moves(board, id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == white_bishop && checked_cells.length != 2) {
        let possible_moves = get_white_bishop_moves(board, id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == black_bishop && checked_cells.length != 2) {
        let possible_moves = get_black_bishop_moves(board, id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == black_rock && checked_cells.length != 2) {
        let possible_moves = get_black_rock_moves(board, id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == white_rock && checked_cells.length != 2) {
        let possible_moves = get_white_rock_moves(board, id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == black_queen && checked_cells.length != 2) {
        let possible_moves = get_black_queen_moves(board, id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == white_queen && checked_cells.length != 2) {
        let possible_moves = get_white_queen_moves(board, id);
        if (checked_cells.length == 0) {
            moves = possible_moves;
        } else {
            moves = possible_moves.filter(value => checked_cells[0].includes(value));
        }
    } else if (peice == black_king) {
        let checked_cells = get_black_king_moves(board, id);
        let safe_cells = [];
        remove_peice(board, id);
        checked_cells.map((id1) => {
            if (is_check_to_black(board, id1).length == 0) {
                safe_cells.push(id1);
            }
        });
        set_peice(board, id, peice);
        if (chess.is_black_king_moved == 0 && is_check_to_black(board, "A5").length == 0) {
            if (chess.is_black_right_rock_moved == 0 && get_peice(board, "A6") == null && get_peice(board, "A7") == null && is_check_to_black(board, "A7").length == 0 && is_check_to_black(board, "A6").length == 0) {
                safe_cells.push("A7");
            }
            if (chess.is_black_left_rock_moved == 0 && get_peice(board, "A2") == null && get_peice(board, "A3") == null && get_peice(board, "A4") == null && is_check_to_black(board, "A2").length == 0 && is_check_to_black(board, "A3").length == 0 && is_check_to_black(board, "A4").length == 0) {
                safe_cells.push("A3");
            }
        }
        moves = safe_cells;
    } else if (peice == white_king) {
        let checked_cells = get_white_king_moves(board, id);
        let safe_cells = [];
        remove_peice(board, id);
        checked_cells.map((id1) => {
            if (is_check_to_white(board, id1).length == 0) {
                safe_cells.push(id1);
            }
        });
        set_peice(board, id, peice);
        if (chess.is_white_king_moved == 0 && is_check_to_white(board, "H5").length == 0) {
            if (chess.is_white_right_rock_moved == 0 && get_peice(board, "H6") == null && get_peice(board, "H7") == null && is_check_to_white(board, "H7").length == 0 && is_check_to_white(board, "H6").length == 0) {
                safe_cells.push("H7");
            }
            if (chess.is_white_left_rock_moved == 0 && get_peice(board, "H2") == null && get_peice(board, "H3") == null && get_peice(board, "H4") == null && is_check_to_white(board, "H2").length == 0 && is_check_to_white(board, "H3").length == 0 && is_check_to_white(board, "H4").length == 0) {
                safe_cells.push("H3");
            }
        }
        moves = safe_cells;
    }
    return moves;
}

function get_moves_count(chess, id, checked_cells) {
    let board = chess.board;
    let count = 0;
    if (id == "black") {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (has_black_peice(board, get_id(i, j))) {
                    count += get_legal_moves(chess, get_id(i, j), checked_cells).length;
                    if (count > 0) return count;
                }
            }
        }
    } else if (id == "white") {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (has_white_peice(board, get_id(i, j))) {
                    count += get_legal_moves(chess, get_id(i, j), checked_cells).length;
                    if (count > 0) return count;
                }
            }
        }
    }
    return count;
}

function show_moves(chess, id) {
    let board = chess.board;
    let checked_cells;
    let is_show = dom.is_show_moves_enabled();
    let peice = get_peice(board, id);
    if (has_black_peice(board, id)) {
        remove_peice(board, id);
        checked_cells = is_check_to_black(board, chess.black_king_id);
        set_peice(board, id, peice);
    } else {
        remove_peice(board, id);
        checked_cells = is_check_to_white(board, chess.white_king_id);
        set_peice(board, id, peice);
    }
    let moves = get_legal_moves(chess, id, checked_cells);
    if (moves.length == 0) {
        dom.show_cross(id);
    }
    moves.map((id) => {
        if (get_peice(board, id) != null && is_show == true) {
            set_red_bg(chess, id);
        }

        else if (is_show == true) {
            dom.show_moves(chess, id);
        }
        chess.shown_moves.push(id);
    })
}

async function make_move(chess, id, isAuto = true) {
    let board = chess.board;
    let last_clicked = chess.last_clicked;
    let peice = get_peice(board, last_clicked);
    let id_peice = get_peice(board, id);

    let saved_move = {
        "1": [id, id_peice],
        "2": [last_clicked, peice],
        "3": null,
        "4": null,
        term: chess.term,
        is_black_king_moved: chess.is_black_king_moved,
        is_white_king_moved: chess.is_white_king_moved,
        is_black_left_rock_moved: chess.is_black_left_rock_moved,
        is_black_right_rock_moved: chess.is_black_right_rock_moved,
        is_white_left_rock_moved: chess.is_white_left_rock_moved,
        is_white_right_rock_moved: chess.is_white_right_rock_moved,
        black_double: chess.black_double,
        white_double: chess.white_double,
        black_king_id: chess.black_king_id,
        white_king_id: chess.white_king_id
    };
    let len = chess.moves_queue.length, last_move;
    if (len)
        last_move = chess.moves_queue[len - 1];

    if (peice == black_king) {
        if (get_position(last_clicked)[1] - get_position(id)[1] == -2) {
            saved_move["3"] = ["A8", black_rock],
                saved_move["4"] = ["A6", null]
        }
        if (get_position(last_clicked)[1] - get_position(id)[1] == 2) {
            saved_move["3"] = ["A1", black_rock],
                saved_move["4"] = ["A4", null]
        }
        chess.black_king_id = id;
    }
    if (peice == white_king) {
        if (get_position(last_clicked)[1] - get_position(id)[1] == -2) {
            saved_move["3"] = ["H8", white_rock],
                saved_move["4"] = ["H6", null]
        }
        if (get_position(last_clicked)[1] - get_position(id)[1] == 2) {
            saved_move["3"] = ["H1", white_rock],
                saved_move["4"] = ["H4", null]
        }
        chess.white_king_id = id;
    }
    if (peice == black_pawn) {
        if (id_peice == null && get_position(id)[1] - get_position(last_clicked)[1] != 0) {
            saved_move["3"] = [get_id(get_position(id)[0] - 1, get_position(id)[1]), white_pawn];
        }
    }
    if (peice == white_pawn) {
        if (id_peice == null && get_position(id)[1] - get_position(last_clicked)[1] != 0) {
            saved_move["3"] = [get_id(get_position(id)[0] + 1, get_position(id)[1]), black_pawn];
        }
    }
    chess.moves_queue.push(saved_move);
    if (id_peice == black_rock) {
        if (get_position(id)[1] == 0) {
            chess.is_black_left_rock_moved = 1;
        } else {
            chess.is_black_right_rock_moved = 1;
        }
    }
    if (id_peice == white_rock) {
        if (get_position(id)[1] == 0) {
            chess.is_white_left_rock_moved = 1;
        } else {
            chess.is_white_right_rock_moved = 1;
        }
    }
    remove_peice(board, last_clicked);
    set_peice(board, id, peice);
    if (isAuto)
        await dom.play_move(peice, last_clicked, id);
    if (id_peice != null) {
        dom.add_to_captured(id_peice);
    }
    if (peice == black_pawn) {
        if (get_position(id)[0] == 7) {
            if (chess.player == "friend") {
                await dom.pawn_promotion(chess, id);
                peice = chess.promoted_peice;
                set_peice(board, id, chess.promoted_peice);
                dom.set_peice(id, peice);
            }
            else {
                peice = black_queen;
            }
        }
        if (get_position(id)[0] - get_position(last_clicked)[0] == 2) {
            chess.black_double = id;
        }
        if ((get_position(id)[1] - get_position(last_clicked)[1]) != 0 && id_peice == null) {
            let x = get_position(id)[0],
                y = get_position(id)[1];
            setTimeout(() => {
                remove_peice(board, get_id(x - 1, y));
                dom.remove_peice(get_id(x - 1, y));
            }, 30);
        }
    } else {
        chess.black_double = "";
    }
    if (peice == white_pawn) {
        if (get_position(last_clicked)[0] - get_position(id)[0] == 2) {
            chess.white_double = id;
        }
        if ((get_position(id)[1] - get_position(last_clicked)[1]) != 0 && id_peice == null) {
            let x = get_position(id)[0],
                y = get_position(id)[1];
            setTimeout(() => {
                remove_peice(board, get_id(x + 1, y));
                dom.remove_peice(get_id(x + 1, y));
            }, 30);
        }
        if (get_position(id)[0] == 0) {
            await dom.pawn_promotion(chess, id);
            peice = chess.promoted_peice;
            set_peice(board, id, peice);
            dom.set_peice(id, peice);
        }
    }
    else {
        chess.white_double = ""
    }
    if (peice == black_rock) {
        if (last_clicked == "A1")
            chess.is_black_left_rock_moved = 1;
        else
            chess.is_black_right_rock_moved = 1;
    }
    if (peice == black_king) {
        chess.is_black_king_moved = 1;
        if (last_clicked == "A5" && id == "A7") {
            await dom.play_move(black_rock, "A8", "A6");
            remove_peice(board, "A8");
            set_peice(board, "A8", black_rock);
        }
        if (last_clicked == "A5" && id == "A3") {
            await dom.play_move(black_rock, "A1", "A4");
            remove_peice(board, "A1");
            set_peice(board, "A4", black_rock);
        }
    }
    if (peice == white_rock) {
        if (last_clicked == "H1")
            chess.is_white_left_rock_moved = 1;
        else
            chess.is_white_right_rock_moved = 1;
    }
    if (peice == white_king) {
        chess.is_white_king_moved = 1;
        if (last_clicked == "H5" && id == "H7") {
            await dom.play_move(white_rock, "H8", "H6");
            remove_peice(board, "H8");
            set_peice(board, "H6", white_rock);
        }
        if (last_clicked == "H5" && id == "H3") {
            await dom.play_move(white_rock, "H1", "H4");
            remove_peice(board, "H1");
            set_peice(board, "H4", white_rock);
        }
    }

    document.getElementById("check").setAttribute("hidden", "hidden");
    if (has_white_peice(board, id)) {
        let checked_cells = is_check_to_black(board, chess.black_king_id);
        let moves_count = get_moves_count(chess, "black", checked_cells);
        dom.give_check(moves_count, checked_cells);
    } else {
        let checked_cells = is_check_to_white(board, chess.white_king_id);
        let moves_count = get_moves_count(chess, "white", checked_cells);
        dom.give_check(moves_count, checked_cells);
    }

    if (len) {
        dom.remove_last_move(last_move["1"][0]);
        dom.remove_last_move(last_move["2"][0]);
    }
    dom.show_last_move(last_clicked);
    dom.show_last_move(id);


    if (chess.player == "computer") {
        if (chess.term == 0) {
            chess.term = 1;
            make_ai_move(chess);
        }
        else {
            chess.term = 0;
        }
    }
    else {
        chess.term = !chess.term;
    }
}

function make_ai_move(chess) {

    let worker = new Worker("./ai.js", { type: "module" });
    let board = chess.board;
    board.is_black_king_moved = chess.is_black_king_moved;
    board.is_white_king_moved = chess.is_white_king_moved;
    board.is_black_left_rock_moved = chess.is_black_left_rock_moved;
    board.is_black_right_rock_moved = chess.is_black_right_rock_moved;
    board.black_king = chess.black_king_id;
    board.white_king = chess.white_king_id;
    board.black_double = chess.black_double;
    board.white_double = chess.white_double;
    board.point = chess.point;
    worker.postMessage(board);
    worker.onmessage = (moves) => {
        console.log(moves.data);
        chess.last_clicked = moves.data[0];
        make_move(chess, moves.data[1]);
    }

}

function flip_player(chess, player) {
    if (chess.player != player) {
        chess.player = player;
        dom.flip_player(player);

        if (player == "computer" && chess.term == 1) {
            make_ai_move(chess);
        }
    }

}


function remove_from_captured(chess) {
    chess
}


export function Game() {
    this.get_position = get_position;
    this.peice_color = peice_color;
    this.has_white_peice = has_white_peice;
    this.has_black_peice = has_black_peice;
    this.get_peice = get_peice;
    this.get_id = get_id;
    this.remove_peice = remove_peice;
    this.set_peice = set_peice;
    this.set_blue_bg = set_blue_bg;
    this.set_red_bg = set_red_bg;
    this.clear_background = clear_background;
    this.undo = undo;
    this.is_check_to_white = is_check_to_white;
    this.is_check_to_black = is_check_to_black;
    this.get_black_pawn_moves = get_black_pawn_moves;
    this.get_white_pawn_moves = get_white_pawn_moves;
    this.get_white_knight_moves = get_white_knight_moves;
    this.get_black_knight_moves = get_black_knight_moves;
    this.get_black_bishop_moves = get_black_bishop_moves;
    this.get_white_bishop_moves = get_white_bishop_moves;
    this.get_white_rock_moves = get_white_rock_moves;
    this.get_black_rock_moves = get_black_rock_moves;
    this.get_black_queen_moves = get_black_queen_moves;
    this.get_white_queen_moves = get_white_queen_moves;
    this.get_white_king_moves = get_white_king_moves;
    this.get_black_king_moves = get_black_king_moves;
    this.get_legal_moves = get_legal_moves;
    this.get_moves_count = get_moves_count;
    this.show_moves = show_moves;
    this.make_move = make_move;
    this.flip_player = flip_player;
};


