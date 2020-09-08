import { Deck } from '../../model/Deck';
import { Answer } from '../../model/Answer';
import { Users, isLocalUserClueGiver, isUserClueGiver, isUserLocal } from '../../model/Users';

interface ICircle {
  x: number,
  y: number,
  innerRadius: number,
  outerRadius: number
}

interface IBoardRenderingProps {
  users: Users
  deck: Deck,
  answer: Answer,
  width: number,
  height: number,
};

/** Draws the entire game board to the canvas */
export const drawBoard = (ctx: CanvasRenderingContext2D, props: IBoardRenderingProps) => {
  // Store some useful constants for later
  let w = props.width;
  let h = props.height;

  // Circle struct that we'll use often
  const circle = {
    x: w / 2,
    y: h * 0.8,
    innerRadius: w * 0.43,
    outerRadius: w * 0.48
  }

  ctx.clearRect(0, 0, w, h);

  // Prep the drawing context
  ctx.textAlign = 'center';
  ctx.lineCap = 'round';

  // Draw all the components back to front
  drawBaseCircle(ctx, circle);
  drawTarget(ctx, props, circle);
  drawTargetBlocker(ctx, props, circle);
  drawLocalPlayerGuess(ctx, props, circle);
  drawRemotePlayerGuesses(ctx, props, circle);
  drawTargetCoverup(ctx, circle);
  drawCurrentCard(ctx, props, circle);
}

/** Draws some text to the canvas */
const drawText = (ctx: CanvasRenderingContext2D, color: string, x: number, y: number, text: string, font: string = '16px Futura') => {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.fillText(text, x, y);
}

/** Draw the base circle that's the background of the board */
const drawBaseCircle = (ctx: CanvasRenderingContext2D, circle: ICircle) => {
  // Outer circle
  ctx.fillStyle = '#0e1232';
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.outerRadius, 0, 2 * Math.PI);
  ctx.fill();

  // Inner circle
  ctx.fillStyle = '#d9d5cb';
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.innerRadius, Math.PI, 2 * Math.PI);
  ctx.fill();
}

/** Draw the target and points associated with each slice */
const drawTarget = (ctx: CanvasRenderingContext2D, props: IBoardRenderingProps, circle: ICircle) => {
  let sectionWRadians = Math.PI * 0.06;
  let range = Math.PI - sectionWRadians;
  let radius = circle.innerRadius;

  // Helper to draw a slice of the target
  const drawSlice = (startAngle: number, endAngle: number, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(circle.x, circle.y);
    ctx.arc(circle.x, circle.y, radius, startAngle, endAngle);
    ctx.moveTo(circle.x, circle.y);
    ctx.fill();
  }

  // bulls eye
  let bullsEyeStart = Math.PI + range * props.answer.target;
  drawSlice(bullsEyeStart, bullsEyeStart + sectionWRadians, '#cc6245');
  // inner bits
  drawSlice(bullsEyeStart - sectionWRadians, bullsEyeStart, '#a7c7a0');
  drawSlice(bullsEyeStart + sectionWRadians, bullsEyeStart + sectionWRadians * 2, '#a7c7a0');
  // outer bits
  drawSlice(bullsEyeStart - sectionWRadians * 2, bullsEyeStart - sectionWRadians, '#c29140');
  drawSlice(bullsEyeStart + sectionWRadians * 2, bullsEyeStart + sectionWRadians * 3, '#c29140');

  // scoring text
  try {
    ctx.save();
    ctx.translate(circle.x, circle.y);
    ctx.rotate(bullsEyeStart - sectionWRadians * 1.5 + Math.PI / 2);

    let textHeight = -radius * 0.85;

    for (var i = 0; i < 5; i++) {
      let score = 4 - Math.abs(4 - (i + 2));

      let sectionRadianStart = ((bullsEyeStart + sectionWRadians * (i - 2)) / Math.PI - 1);
      let guessDiff = (props.users.localUser.guess - sectionRadianStart);
      let isOnTarget = guessDiff > 0 && guessDiff < sectionWRadians / Math.PI;

      let color = isOnTarget ? 'white' : 'black';
      drawText(ctx, color, 0, textHeight, score.toString());
      ctx.rotate(sectionWRadians);
    }
  } finally {
    ctx.restore();
  }
}

/** Cover bottom half of inner circle in case target bled into it */
const drawTargetCoverup = (ctx: CanvasRenderingContext2D, circle: ICircle) => {
  ctx.fillStyle = '#0e1232';
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.innerRadius, 0, Math.PI);
  ctx.fill();
}

/** Cover up the target if our state dictates that it should be hidden */
const drawTargetBlocker = (ctx: CanvasRenderingContext2D, props: IBoardRenderingProps, circle: ICircle) => {
  if (props.answer.visible === false || isLocalUserClueGiver(props.users) === false) {
    ctx.fillStyle = '#00c3ff';
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.innerRadius, Math.PI, 2 * Math.PI);
    ctx.fill();
  }
}

/** Helper method to draw guess line */
const drawGuessLine = (ctx: CanvasRenderingContext2D, props: IBoardRenderingProps, circle: ICircle, guess: number, color: string, name: string = '') => {
  let guessLen = props.width * 0.4;
  let range = Math.PI;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(circle.x, circle.y);
  let guessX = Math.cos(guess * range);
  let guessY = Math.sin(guess * range);
  let guessEndpointX = circle.x - guessX * guessLen;
  let guessEndpointY = circle.y - guessY * guessLen;
  ctx.lineTo(guessEndpointX, guessEndpointY);
  // Set up appropriate stroke width for the arrows
  ctx.lineWidth = props.width * 0.008;
  ctx.stroke();

  // draw username associated with the guess
  if (name.length > 0) {
    let textCenterX = guessEndpointX;
    let textCenterY = guessEndpointY - 30;
    // hacks to get a close approximation of text size plus a little extra
    let nameWidth = ctx.measureText(name + '  ').width;
    let nameHeight = ctx.measureText('Mi').width;
    // round rect background to the name for legibility
    drawRoundRect(ctx, 'lightgray', textCenterX - (nameWidth / 2), textCenterY - nameHeight, nameWidth, 30, 4);
    drawText(ctx, color, textCenterX, textCenterY, name);
  }
}

/** Draw the guess for the local player */
const drawLocalPlayerGuess = (ctx: CanvasRenderingContext2D, props: IBoardRenderingProps, circle: ICircle) => {
  // Don't need to show red guess knob if the local player is the clue giver
  if (isLocalUserClueGiver(props.users)) {
    return;
  }

  // Guess knob
  ctx.fillStyle = '#ff2a00';
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, props.width * 0.1, Math.PI, 2 * Math.PI);
  ctx.fill();

  // Guess line
  drawGuessLine(ctx, props, circle, props.users.localUser.guess, '#ff2a00', '');
}

/** Draw the guesses for the remote player */
const drawRemotePlayerGuesses = (ctx: CanvasRenderingContext2D, props: IBoardRenderingProps, circle: ICircle) => {
  // TODO: Limit drawing to selected team only
  props.users.onlineUsers.forEach((v, k) => {
    // Skip if its the local player or the player is the clue giver
    if (isUserClueGiver(v, props.users) || isUserLocal(v, props.users)) {
      return;
    }
    // Skip if user isn't on a team (not sure if this is possible)
    if (v.team === null) {
      return;
    }

    drawGuessLine(ctx, props, circle, v.guess, v.team, v.name);
  })
}

/** Draws a round rect. Used for drawing the cards */
const drawRoundRect = (ctx: CanvasRenderingContext2D, color: string, x: number, y: number, width: number, height: number, radius: number = 5) => {
  ctx.fillStyle = color;
  const corners = {
    tl: radius,
    tr: radius,
    br: radius,
    bl: radius
  }
  ctx.beginPath();
  ctx.moveTo(x + corners.tl, y);
  ctx.lineTo(x + width - corners.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + corners.tr);
  ctx.lineTo(x + width, y + height - corners.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - corners.br, y + height);
  ctx.lineTo(x + corners.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - corners.bl);
  ctx.lineTo(x, y + corners.tl);
  ctx.quadraticCurveTo(x, y, x + corners.tl, y);
  ctx.closePath();
  ctx.fill();
}

const drawCurrentCard = (ctx: CanvasRenderingContext2D, props: IBoardRenderingProps, circle: ICircle) => {
  const w = props.width;
  const h = props.height;

  // Spectrum
  let spectrumItemWidth = w * 0.34;
  let spectrumItemHeight = w * 0.21;
  let arrowWidth = w * 0.11;
  // Set up appropriate stroke width for the arrows
  ctx.lineWidth = w * 0.004;

  // Left option
  drawRoundRect(ctx, '#d491a4', circle.x - spectrumItemWidth, h - spectrumItemHeight * 0.8, spectrumItemWidth, spectrumItemHeight, 10);
  drawText(ctx, '#0e1232', circle.x - spectrumItemWidth / 2, h - spectrumItemHeight * 0.4, props.deck.currentCard.left);
  drawArrow(ctx, '#0e1232', circle.x - spectrumItemWidth / 2 + arrowWidth / 2, circle.x - spectrumItemWidth / 2 - arrowWidth / 2, h - spectrumItemHeight * 0.65, w * 0.011, w * 0.015);

  // Right option
  drawRoundRect(ctx, '#a1d0cc', circle.x, h - spectrumItemHeight * 0.8, spectrumItemWidth, spectrumItemHeight, 10);
  drawText(ctx, '#0e1232', circle.x + spectrumItemWidth / 2, h - spectrumItemHeight * 0.4, props.deck.currentCard.right);
  drawArrow(ctx, '#0e1232', circle.x + spectrumItemWidth / 2 - arrowWidth / 2, circle.x + spectrumItemWidth / 2 + arrowWidth / 2, h - spectrumItemHeight * 0.65, w * 0.011, w * 0.015);
}

const drawArrow = (ctx: CanvasRenderingContext2D, color: string, fromX: number, toX: number, y: number, arrowheadX: number, arrowheadY: number) => {
  ctx.strokeStyle = color;
  var sign = 1;
  if (fromX < toX) {
    sign = -1;
  }

  ctx.beginPath();
  ctx.moveTo(fromX, y);
  ctx.lineTo(toX, y);
  ctx.moveTo(toX, y);
  ctx.lineTo(toX + sign * arrowheadX, y + arrowheadY);
  ctx.moveTo(toX, y);
  ctx.lineTo(toX + sign * arrowheadX, y - arrowheadY);
  ctx.stroke();
}
