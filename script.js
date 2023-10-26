//@ts-check

/** @typedef {{ x: number, y: number }} Vector */
/** @typedef {{ x: number, y: number, radius: number, color: string, hitted: boolean }} Ball */
/** @typedef {{ x: number, y: number, w: number, h: number }} Rect */
/** @typedef {{ s: Ball, e: Ball }} Line */

const a_s_color = "hsl(130 , 60%, 35%)";
const a_e_color = "hsl(130 , 60%, 60%)";
const b_s_color = "hsl(180, 60%, 35%)";
const b_e_color = "hsl(180, 60%, 60%)";

const bounding_a_color = "hsl(130 , 100%, 50%)";
const bounding_b_color = "hsl(180, 100%, 50%)";
const line_a_color = "hsl(130 , 100%, 50%)";
const line_b_color = "hsl(180, 100%, 50%)";

const hitted_ball_a_color = "red";

let ballA_s = { x: 100, y: 100, radius: 30, color: a_s_color, hitted: false };
let ballA_e = { ...ballA_s, x: ballA_s.x + 200, y: ballA_s.y + 200, color: a_e_color };
const lineA = { s: ballA_s, e: ballA_e };

let ballB_s = { x: 300, y: 100, radius: 30, color: b_s_color, hitted: false };
let ballB_e = { ...ballB_s, x: ballB_s.x - 200, y: ballB_s.y + 200, color: b_e_color };
const lineB = { s: ballB_s, e: ballB_e };

let boundingRectA = boundingRect(ballA_s, ballA_e);
let boundingRectB = boundingRect(ballB_s, ballB_e);



const balls = [ballA_s, ballA_e, ballB_s, ballB_e];

drawAll(false);


function switchViewAll() {
  viewAll = !viewAll;
  checkbox.checked = viewAll;
  console.log(checkbox.checked);

  drawAll(false);
}
function setRadiusA() {
  ballA_s.radius = +radiusA.value;
  ballA_e.radius = ballA_s.radius;
  ballA_s.hitted = isHittedBallToLine(ballA_s, lineB);

  drawAll(true);
}
function setRadiusB() {
  ballB_s.radius = +radiusB.value;
  ballB_e.radius = ballB_s.radius;
  ballA_s.hitted = isHittedBallToLine(ballA_s, lineB);

  drawAll(true);
}