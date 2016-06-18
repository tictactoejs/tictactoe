'use strict';
// NOT YET READY for @_flow

declare class tictactoe {
  static ai: any;
  static draw: any;
}

if (!tictactoe) { var tictactoe = {} }
var main = (function() {
  var system: any = tictactoe.ai,
      draw = tictactoe.draw,
      gameOver = false

  var canvas = document.getElementById('the_board')
  if (!(canvas instanceof HTMLCanvasElement)) {
    return
  }

  var context = canvas.getContext('2d')
  if (!(context instanceof CanvasRenderingContext2D)) {
    return
  }

  document.addEventListener('DOMContentLoaded', function(event) {
    draw.setContext(context)
    draw.board()
    draw.newGameButton()
  })

  canvas.addEventListener('click', function(e) {
    var whoseTurn,
        occupy,
        // offsetX = !e.offsetX ? (e.pageX - this.offsetLeft) : e.offsetX,
        // offsetY = !e.offsetY ? (e.pageY - this.offsetTop) : e.offsetY,
        offsetX = e.offsetX,
        offsetY = e.offsetY,
        location = (Math.floor(offsetY / 100) * 3 + Math.floor(offsetX / 100))

    if (offsetY > 300) {
      system.getBoard().clear()
      draw.clear()
      gameOver = false
    }

    else if (offsetY <= 300 && offsetX <= 300) {
      whoseTurn = system.getBoard().toMove()
      occupy = system.getBoard().occupy(location)
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
          var res = system.alphaBetaSearch(system.getBoard(), -whoseTurn)

          // to test win scenario, create ai that randomly chooses a valid turn.
          // var res = system.chooseRandom(system.board(), -whoseTurn )

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
