export default function Chess() {
    this.board = ['RNBQKBNR', 'PPPPPPPP', '........', '........', '........', '........', 'pppppppp', 'rnbqkbnr'];
    this.is_black_king_moved = false;
    this.is_white_king_moved = false;
    this.is_black_left_rock_moved = false;
    this.is_black_right_rock_moved = false;
    this.is_white_left_rock_moved = false;
    this.is_white_right_rock_moved = false;
    this.black_double = "";
    this.white_double = "";
    this.black_king_id = "A5";
    this.white_king_id = "H5";
    this.point = 0;
    this.term = 0;
    this.shown_moves = [];
    this.bg_highlighted_color = new Map();
    this.last_clicked = "";
    this.moves_queue = [];
    this.promoted_peice = "";
    this.player = "friend";
    this.white_captured = [];
    this.black_captured = [];
}


