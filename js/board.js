'use strict';
// @flow

const count = function(arr: Array<PlayerType>, item: PlayerType) {
  let cnt = 0
  for (let c = 0; c < arr.length; c++) {
    if (arr[c] == item) {
      cnt++
    }
  }
  return cnt
}

class Board {
  board: BoardType;

  constructor(arr: BoardType | Board) {
    if (!arr) {
      this.board = [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0
      ]
    } else {
      if (Array.isArray(arr)) {
        this.board = arr
      } else {
        this.board = arr.board.slice(0)
      }
    }
  }

  add(c: BoardPos, val: number): BoardPos { return ((c + val): any) }

  put(piece: PlayerType, pos: number): void {
    this.board[pos] = piece
  }

  get length() {
    return this.board.length
  }

  pos(n: BoardPos): PlayerType {
    return this.board[n]
  }

  getFreePositions(): Array<number> {
    let moves = []
    const _board = this.board
    for (var m = 0; m < _board.length; m++) {
      if (_board[m] === 0) {
        moves.push(m)
      }
    }
    return moves
  }

  endOfGame(): boolean {
    return this.getFreePositions().length === 0
  }

  clear(): void {
    this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0]
  }

  toMove(): PlayerType {
    var players = [0, 0]

    for (var b = 0; b < this.board.length; b++) {
      if (b > 8) {
        return 0
      }
      if (this.pos(b) === 1) {
        players[0]++
      }
      if (this.pos(b) === -1) {
        players[1]++
      }
    }
    return (players[0] <= players[1] ? 1 : -1)
  }

  occupy(location: number): boolean {
    if (this.getFreePositions().indexOf(location) !== -1) {
      this.put(this.toMove(), location)

      return true
    }
    return false
  }

  winner(player: PlayerType): boolean {
    const [start, end] = this.winnerWhere(player)
    return (start !== -1 && end !== -1)
  }

  loser(player: PlayerType): boolean {
    return this.winner(-player)
  }

  winnerWhere(player: PlayerType): Tuple {

    let diag1: Array<PlayerType>,
        diag2: Array<PlayerType>,
        row: Array<PlayerType>,
        col: Array<PlayerType>

    for (let r = 0; r < 3; r++) {
      row = this.board.slice(r * 3, (r * 3) + 3)

      if (count(row, player) === 3) {
        return [r * 3, (r * 3) + 3 - 1]
      }
    }

    for (let c: BoardPos = 0; c < 3; this.add(c, 1)) {
      let col = [this.pos(c), this.pos(this.add(c, 3)), this.pos(this.add(c, 6))]
      if (count(col, player) === 3) {
        return [c, c + 6]
      }
    }

    if (count([this.pos(0), this.pos(4), this.pos(8)], player) === 3) {
      return [0, 8]
    }

    if (count([this.pos(2), this.pos(4), this.pos(6)], player) === 3) {
      return [2, 6]
    }

    return [-1, -1]
  }

  utility(player: PlayerType): number {
    const board = this.board
    // 0 1 2
    // 3 4 5
    // 6 7 8
    let score = 0,
        markScore = [0, 1, 10, 1000],
        diag1 = [this.pos(0), this.pos(4), this.pos(8)],
        diag2 = [this.pos(2), this.pos(4), this.pos(6)]

    for (let r: BoardPos = 0; r < 3 ; this.add(r, 1)) {
      let row = board.slice(r * 3, (r * 3) + 3)

      if (count(row, player) > 0 && count(row, -player) === 0)  {
        score += markScore[count(row, player)]
      }
      else if (count(row, -player) > 0 && count(row, player) === 0)  {
        score -= markScore[count(row, -player)]
      }

      let col = [this.pos(r), this.pos(this.add(r, 3)), this.pos(this.add(r, 6))]

      if (count(col, player) > 0 && count(col, -player) === 0) {
        score += markScore[count(col, player)]
      }
      else if (count(col, -player) > 0 && count(col, player) === 0) {
        score -= markScore[count(col, -player)]
      }
    }
    if (count(diag1, player) > 0 && count(diag1, -player) === 0) {
      score += markScore[count(diag1, player)]
    }
    else if (count(diag1, -player) > 0 && count(diag1, player) === 0) {
      score -= markScore[count(diag1, -player)]
    }
    if (count(diag2, player) > 0 && count(diag2, -player) === 0) {
      score += markScore[count(diag2, player)]
    }
    else if (count(diag2, -player) > 0 && count(diag2, player) === 0) {
      score -= markScore[count(diag2, -player)]
    }
    return score
  }
}