import Chess from "./chess.js"
import { Game } from "./game.js";
import { Dom } from "./dom.js"

const chess = new Chess();
const game = new Game();
const dom = new Dom();

{
let black_color = document.getElementById("black_color");
let white_color = document.getElementById("white_color");
black_color.children[1].addEventListener('input',dom.change_black_color);
white_color.children[1].addEventListener('input',dom.change_white_color);
}

let computer = document.querySelector(".computer");
let friend = document.querySelector(".friend");

computer.onclick = () => {game.flip_player(chess,"computer")};
friend.onclick = () => {game.flip_player(chess,"friend")};

const chess_board = document.querySelector(".board");

dom.render_chess(chess);

chess_board.addEventListener("mousedown", (event) => dom.handle_click(event, chess));

chess_board.addEventListener("mouseup", (event) => dom.drop_peice(event, chess));

chess_board.addEventListener("mouseover", (event) => dom.change_to_grab(event, chess));

document.getElementsByClassName("undo")[0].addEventListener("click", () => game.undo(chess));

document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === 'z') {
        game.undo(chess);
    }
});

