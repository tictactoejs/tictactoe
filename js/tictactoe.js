'use strict';
// NOT YET READY for @_flow

declare class tictactoe {
  static ai: any;
  static draw: any;
}

if (!tictactoe) { var tictactoe = {} }
const main = (function() {
  const system: any = tictactoe.ai
  const draw = tictactoe.draw

  let canvas = document.getElementById('the_board')
  if (!(canvas instanceof HTMLCanvasElement)) {
    return
  }

  let context = canvas.getContext('2d')
  if (!(context instanceof CanvasRenderingContext2D)) {
    return
  }

  document.addEventListener('DOMContentLoaded', function(event) {
    draw.setContext(context)
    draw.board()
    draw.newGameButton()
  })

  canvas.addEventListener('click', (e) => {
    let gameOver = false

    // offsetX = !e.offsetX ? (e.pageX - this.offsetLeft) : e.offsetX,
    // offsetY = !e.offsetY ? (e.pageY - this.offsetTop) : e.offsetY,
    const offsetX = e.offsetX
    const offsetY = e.offsetY
    const location = (Math.floor(offsetY / 100) * 3 + Math.floor(offsetX / 100))

    if (offsetY > 300) {
      system.getBoard().clear()
      draw.clear()
      gameOver = false
    }

    else if (offsetY <= 300 && offsetX <= 300) {
      const whoseTurn = system.getBoard().toMove()
      const occupy = system.getBoard().occupy(location)
      if (occupy && !gameOver) {
        draw.nought(location)
        if (system.getBoard().winner(1)) {

          draw.connectLine(system.getBoard().winnerWhere(1), '#00ff00')
          draw.stamp('YOU WIN', '#00ff00')
          gameOver = true
        }
        else if (system.getBoard().getFreePositions().length === 0) {
          draw.stamp('TIE', '#00ffff')
          gameOver = true
        }

        if (whoseTurn === 1 && !system.getBoard().winner(1) && !system.getBoard().winner(-1)) {
          // to test win scenario, create ai that randomly chooses a valid turn.
          // let res = system.chooseRandom(system.getBoard(), -whoseTurn)
          let res = system.alphaBetaSearch(system.getBoard(), -whoseTurn)

          system.getBoard().occupy(res[2])
          draw.cross(res[2])

          if (system.getBoard().winner(-1)) {
            draw.connectLine(system.getBoard().winnerWhere(-1), '#ff0000')
            draw.stamp('YOU LOSE', '#ff0000')
            gameOver = true
          }
        }
      }
    }
  })
}())
