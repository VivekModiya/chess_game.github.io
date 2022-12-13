import { Game } from './game.js';

const game = new Game();

const black_rock = "./pieces/black_rock.png"
const black_knight = "./pieces/black_knight.png"
const black_bishop = "./pieces/black_bishop.png"
const black_queen = "./pieces/black_queen.png"
const black_king = "./pieces/black_king.png"
const black_pawn = "./pieces/black_pawn.png"
const white_rock = "./pieces/white_rock.png"
const white_knight = "./pieces/white_knight.png"
const white_bishop = "./pieces/white_bishop.png"
const white_queen = "./pieces/white_queen.png"
const white_king = "./pieces/white_king.png"
const white_pawn = "./pieces/white_pawn.png"

const real_peice = {
    "Q": black_queen,
    "q": white_queen,
    "R": black_rock,
    "r": white_rock,
    "B": black_bishop,
    "b": white_bishop,
    "N": black_knight,
    "n": white_knight,
    "P": black_pawn,
    "p": white_pawn,
    "K": black_king,
    "k": white_king
}
const virtual_peice = {
    [white_queen]: "q",
    [black_queen]: "Q",
    [black_rock]: "R",
    [white_rock]: "r",
    [black_bishop]: "B",
    [white_bishop]: "b",
    [black_king]: "N",
    [white_knight]: "n",
    [black_pawn]: "P",
    [white_pawn]: "p",
    [black_king]: "K",
    [white_king]: "k"
}
function clear_background(chessBoard) {
    for (let id of chessBoard.bg_highlighted_color.keys()) {
        document.getElementById(id).children[2].children[0].setAttribute("hidden", "hidden");
        document.getElementById(id).children[2].children[1].setAttribute("hidden", "hidden");
        document.getElementById(id).children[3].setAttribute("hidden", "hidden");
    }

    for (let id of chessBoard.shown_moves) {
        document.getElementById(id).children[1].children[0].setAttribute("hidden", "hidden");
    }
}
function set_blue_bg(chessBoard, id) {
    document.getElementById(id).children[2].children[0].removeAttribute("hidden");
    chessBoard.bg_highlighted_color.set(id, "blue");
}
function remove_blue_bg(chessBoard, id) {
    document.getElementById(id).children[2].children[0].setAttribute("hidden", "hidden");
}
function set_red_bg(chessBoard, id) {
    document.getElementById(id).children[2].children[1].removeAttribute("hidden");
    chessBoard.bg_highlighted_color.set(id, "red");
}
function is_show_moves_enabled() {
    return document.getElementById("show_moves").checked;
}
function show_cross(id) {
    document.getElementById(id).children[3].removeAttribute("hidden");
}
function show_moves(chess, id) {
    document.getElementById(id).children[1].children[0].removeAttribute("hidden");
}
function remove_peice(id) {
    document.getElementById(id).children[0].children[0].removeAttribute("src");
}
function set_peice(id, peice) {
    if (peice.length <= 2) {
        peice = real_peice[peice];
    }
    document.getElementById(id).children[0].children[0].setAttribute("src", peice);
}
function show_last_move(id) {
    document.getElementById(id).children[0].setAttribute('style', 'box-shadow: 0.1vmin 0.1vmin 0.6vmin rgb(110, 0, 228) inset, -0.1vmin -0.1vmin 0.6vmin rgb(110, 0, 228) inset');
}
function remove_last_move(id) {
    document.getElementById(id).children[0].setAttribute('style', 'box-shadow: 0vmin 0vmin 0vmin rgb(110, 0, 228) inset, 0vmin 0vmin 0vmin rgb(110, 0, 228) inset');
}
function pawn_promotion(chess, id) {
    console.log("i am called");
    let element = document.querySelector(".layer");
    if (game.get_position(id)[0] == 7) {
        element.children[0].children[0].children[0].setAttribute("src", black_queen);
        element.children[0].children[1].children[0].setAttribute("src", black_rock);
        element.children[0].children[2].children[0].setAttribute("src", black_knight);
        element.children[0].children[3].children[0].setAttribute("src", black_bishop);
    } else {
        element.children[0].children[0].children[0].setAttribute("src", white_queen);
        element.children[0].children[1].children[0].setAttribute("src", white_rock);
        element.children[0].children[2].children[0].setAttribute("src", white_knight);
        element.children[0].children[3].children[0].setAttribute("src", white_bishop);
    }
    element.style.display = "flex";
    let Children = Array.from(document.getElementsByClassName("pawn_promotion")[0].children);
    let promise = new Promise((resolve, reject) => {
        Children.forEach(el => {
            el.addEventListener("click", () => {
                let peice = el.children[0].getAttribute("src");
                chess.promoted_peice = virtual_peice[peice];
                element.style.display = "none";
                resolve();
            });
        });
    });
    return promise;
}
function play_move(peice, last_clicked, id) {
    remove_peice(last_clicked);
    let promise = new Promise((resolve, reject) => {
        let xid = game.get_position(id)[0];
        let yid = game.get_position(id)[1];
        let xlast = game.get_position(last_clicked)[0];
        let ylast = game.get_position(last_clicked)[1];

        const fromLeft = 7 * -11.25 + 2 * ylast * 11.25;
        const fromTop = 7 * -11.25 + 2 * xlast * 11.25;
        const toLeft = fromLeft + 2 * (yid - ylast) * 11.25;
        const toTop = fromTop + 2 * (xid - xlast) * 11.25;

        let root = document.querySelector(":root");

        root.style.setProperty("--fromLeft", fromLeft + "vmin");
        root.style.setProperty("--fromTop", fromTop + "vmin");
        root.style.setProperty("--toLeft", toLeft + "vmin");
        root.style.setProperty("--toTop", toTop + "vmin");

        let p = document.getElementById("animation");
        p.children[0].setAttribute("src", real_peice[peice]);
        p.style.display = "block";
        p.style.animationPlayState = "running";

        setTimeout(() => {
            p.style.display = "none";
            setTimeout(() => {
                p.style.animationPlayState = "paused";
                resolve();
            }, 40);
            set_peice(id, peice);
        }, 250);
    })
    return promise;
}
function give_check(moves_count, checked_cells) {
    if (moves_count == 0) {
        if (checked_cells.length > 0) {
            document.getElementById("check").children[0].innerHTML = "Check Mate";
        } else {
            document.getElementById("check").children[0].innerHTML = "Stale Mate";
        }
        document.getElementById("check").removeAttribute("hidden");
    } else if (checked_cells.length > 0) {
        document.getElementById("check").children[0].innerHTML = "Check";
        document.getElementById("check").removeAttribute("hidden");
    }
}
function render_chess(chess) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let id = game.get_id(i, j);
            let element = document.createElement("div");
            element.setAttribute("id", id);
            if ((i + j) % 2) {
                element.setAttribute("class", "black");
            }
            else {
                element.setAttribute("class", "white");
            }
            let child1 = document.createElement("div");
            let child2 = document.createElement("div");
            let child3 = document.createElement("div");
            let child4 = document.createElement("div");

            child1.setAttribute("class", "peices")
            child2.setAttribute("class", "move")
            child3.setAttribute("class", "bg")
            child4.setAttribute("class", "cross")
            child4.setAttribute("hidden", "hidden")
            child4.textContent = "❌";

            let child1_1 = document.createElement("img");
            let child2_1 = document.createElement("div");
            let child3_1 = document.createElement("div");
            let child3_2 = document.createElement("div");

            if (chess.board[i][j] != ".") {
                child1_1.setAttribute("src", real_peice[chess.board[i][j]]);
                if (chess.board[i][j] > 'A' && chess.board[i][j] < 'Z') {
                    // child1_1.style.transform = "rotate(180deg)";
                }
            }

            child2_1.setAttribute("class", "circle");
            child2_1.setAttribute("hidden", "hidden");
            child3_1.setAttribute("class", "blue");
            child3_1.setAttribute("hidden", "hidden");
            child3_2.setAttribute("class", "red");
            child3_2.setAttribute("hidden", "hidden");

            child1.appendChild(child1_1);
            child2.appendChild(child2_1);
            child3.appendChild(child3_1);
            child3.appendChild(child3_2);

            element.appendChild(child1);
            element.appendChild(child2);
            element.appendChild(child3);
            element.appendChild(child4);

            let board = document.querySelector(".board");

            board.appendChild(element);
        }
    }
}
function drop_peice(event, chess) {
    event.preventDefault();
    document.onmousemove = null;

    let target = document.getElementById(chess.last_clicked).children[0];
    let src = target.children[0].getAttribute("src");

    let element = document.elementFromPoint(event.clientX, event.clientY);

    while (!element.id) {
        element = element.parentNode;
    }

    element.classList.remove("highlight");
    document.querySelector(".board").classList.remove("grabing") //////////////////////

    const id = element.id;
    if (chess.shown_moves.includes(id)) {
        remove_peice(chess.last_clicked);
        set_peice(id, src);
        game.make_move(chess, id, false);
        game.clear_background(chess);
    }
    else {
        target.style.top = "";
        target.style.left = "";
    }
}
function drag_peice(event, target) {
    let x = event.offsetX, y = event.offsetY;
    let img = target.children[0];
    let previousElement = target;
    document.onmousemove = (ev) => {
        target.classList.remove("grab");
        let board = document.querySelector(".board");
        board.classList.add("grabing");

        let currentElement = document.elementFromPoint(ev.clientX, ev.clientY);

        if (board.contains(currentElement)) {
            while (!currentElement.id) {
                currentElement = currentElement.parentNode;
            }

            if (previousElement != currentElement) {
                previousElement.classList.remove("highlight");
                previousElement = currentElement;
                currentElement.classList.add("highlight");
            }
        }

        let top = ev.clientY - y, left = ev.clientX - x;
        let boardTop = board.offsetTop, boardLeft = board.offsetLeft, boardBottom = board.offsetTop + board.clientHeight - target.clientHeight, boardRight = board.offsetLeft + board.clientWidth - target.clientHeight;

        top = Math.max(boardTop, top);
        top = Math.min(top, boardBottom);
        left = Math.max(boardLeft, left);
        left = Math.min(left, boardRight);
        img.style.top = top + "px";
        img.style.left = left + "px";
    }
}
function change_to_grab(event, chess) {
    let target = event.target;
    let board = document.querySelector(".board");
    if (board.contains(target)) {
        while (!target.id) {
            target = target.parentNode;
        }
        const id = target.id;
        if (game.get_peice(chess.board, id) != null) {
            target.classList.add("grab");
        }
        else {
            target.classList.remove("grab");
        }
    }
}
function handle_click(event, chess) {
    event.preventDefault();
    let target = event.target;
    while (!target.id) {
        target = target.parentNode;
    }

    const id = target.id;

    if (!chess.shown_moves.includes(id) && !(chess.term==1 && chess.player=="computer")) {
        game.clear_background(chess);
        if ((chess.term == 0 && game.has_white_peice(chess.board, id)) || (chess.term == 1 && game.has_black_peice(chess.board, id))) {
            game.set_blue_bg(chess, id);
            game.show_moves(chess, id);
            chess.last_clicked = id;
            if (chess.shown_moves.length) {
                drag_peice(event, target);
            }
        }
    }
    else {
        game.clear_background(chess);
        game.make_move(chess, id);
    }
}
function change_black_color(event) {
    let root = document.querySelector(":root");
    root.style.setProperty("--black_color", event.target.value);
}
function change_white_color(event) {
    let root = document.querySelector(":root");
    root.style.setProperty("--white_color", event.target.value);
}
function flip_player(player) {
    let friend = document.querySelector(".friend");
    let computer = document.querySelector(".computer");
    if (player == "friend") {
        friend.classList.add("yellow")
        computer.classList.remove("yellow");
    }
    else {
        friend.classList.remove("yellow")
        computer.classList.add("yellow")
    }
}
function add_to_captured(peice) {
    if (peice >= "A" && peice <= "Z") {
        let black = document.querySelector(".player1").children[1];
        let element = document.createElement("img");
        element.style.transform = "rotate(180deg)";
        element.setAttribute("src", real_peice[peice]);
        black.appendChild(element);
    }
    else {
        let white = document.querySelector(".player2").children[1];
        let element = document.createElement("img");
        element.setAttribute("src", real_peice[peice]);
        white.appendChild(element);
    }
}

function remove_from_captured(player) {
    if (player == "black") {
        let black = document.querySelector(".player1").children[1];
        black.removeChild(black.lastChild)
    }
    else {
        let white = document.querySelector(".player2").children[1];
        white.removeChild(white.lastChild);
    }
}


export function Dom() {
    this.real_peice = real_peice;
    this.set_blue_bg = set_blue_bg;
    this.clear_background = clear_background;
    this.set_red_bg = set_red_bg;
    this.remove_blue_bg = remove_blue_bg;
    this.is_show_moves_enabled = is_show_moves_enabled;
    this.show_cross = show_cross;
    this.show_moves = show_moves;
    this.play_move = play_move;
    this.pawn_promotion = pawn_promotion;
    this.give_check = give_check;
    this.remove_peice = remove_peice;
    this.set_peice = set_peice;
    this.show_last_move = show_last_move;
    this.remove_last_move = remove_last_move;
    this.render_chess = render_chess;
    this.drop_peice = drop_peice;
    this.drag_peice = drag_peice;
    this.change_to_grab = change_to_grab;
    this.handle_click = handle_click;
    this.change_black_color = change_black_color;
    this.change_white_color = change_white_color;
    this.flip_player = flip_player;
    this.add_to_captured = add_to_captured;
    this.remove_from_captured = remove_from_captured;
}

