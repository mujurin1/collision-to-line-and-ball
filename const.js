//@ts-check

/** @type {HTMLCanvasElement} */
const cnv = document.querySelector("#canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = cnv.getContext("2d");

/** @type {HTMLInputElement} */
const checkbox = document.querySelector("#bounding");
/** @type {HTMLInputElement} */
const radiusA = document.querySelector("#radiusA");
/** @type {HTMLInputElement} */
const radiusB = document.querySelector("#radiusB");

let viewAll = false;

// ===========================================
// 描画 関連
// ===========================================
/**
 * @param {boolean} isCalcBounding バウンディングボックスの範囲を再計算するか
 */
function drawAll(isCalcBounding) {
  if (isCalcBounding) {
    boundingRectA = boundingRect(ballA_s, ballA_e);
    boundingRectB = boundingRect(ballB_s, ballB_e);
  }

  ctx.clearRect(0, 0, cnv.width, cnv.height);

  // for (let i = balls.length - 1; i >= 0; i--) drawBall(balls[i]);
  drawBall(ballA_s);
  if (viewAll) drawBall(ballA_e);
  drawBall(ballB_s);
  drawBall(ballB_e);
  if (viewAll) drawRect(boundingRectA, bounding_a_color);
  if (viewAll) drawRect(boundingRectB, bounding_b_color);
  if (viewAll) drawLine(ballA_s, ballA_e, line_a_color);
  drawLine(ballB_s, ballB_e, line_b_color);
}
/**
 * @param {Ball} ball
 * @param {number?} x
 * @param {number?} y
 * @param {string?} color
 */
function drawBall(ball, x = ball.x, y = ball.y, color = ball.color) {
  ctx.fillStyle = ball.hitted ? hitted_ball_a_color : color;
  ctx.beginPath();
  ctx.ellipse(x, y, ball.radius, ball.radius, 0, 0, 2 * Math.PI);
  ctx.fill();
}
/**
 * @param {Rect} rect
 * @param {string} color
 */
function drawRect(rect, color) {
  ctx.lineWidth = 1;
  ctx.strokeStyle = color;
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
}
/**
 * ２つの円を結ぶ線分を描画する
 * @param {Ball} a
 * @param {Ball} b
 * @param {string} color 
 */
function drawLine(a, b, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}


// ===========================================
// 数学 関連
// ===========================================
/**
 * ２つの円が重なっているかを調べる
 * @param {Ball} ballA
 * @param {Ball} ballB
 * @returns {boolean}
 */
function isOverlapBall(ballA, ballB) {
  return false;
}
/**
 * 点が円の内側か調べる
 * @param {Ball} ball
 * @param {Vector} vec
 * @returns {boolean}
 */
function isInsideBall(ball, vec) {
  const dis = distancePoint(ball, vec);
  return dis <= ball.radius;
}
/**
 * 点が矩形の内側か調べる
 * @param {Rect} rect
 * @param {Vector} vec
 * @returns {boolean}
 */
function isInsideRect(rect, vec) {
  return (
    rect.x <= vec.x && vec.x <= rect.x + rect.w &&
    rect.y <= vec.y && vec.y <= rect.y + rect.h
  );
}
/**
 * ２つの座標の距離を計算する
 * @param {Vector} a
 * @param {Vector} b
 * @returns {number}
 */
function distancePoint(a, b) {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}
/**
 * ２つの円を含む最小の矩形を計算する
 * @param {Ball} a
 * @param {Ball} b
 * @returns {Rect}
 */
function boundingRect(a, b) {
  let leftX = Math.min(a.x - a.radius, b.x - b.radius);
  let leftY = Math.min(a.y - a.radius, b.y - b.radius);
  let rightX = Math.max(a.x + a.radius, b.x + b.radius);
  let rightY = Math.max(a.y + a.radius, b.y + b.radius);

  return {
    x: leftX,
    y: leftY,
    w: rightX - leftX,
    h: rightY - leftY
  };
}
/**
 * @param {Vector} point
 * @param {Line} line
 * @returns 
 */
function nearestPointOnLineSegment(point, line) {
  const { s: a, e: b } = line;
  const l2 = distancePoint(a, b) ** 2;

  // 線分が1点に収束している場合その点が最近傍点
  if (l2 === 0) return a;

  // 線分上の最近傍点を計算
  const t = Math.max(0, Math.min(1, ((point.x - a.x) * (b.x - a.x) + (point.y - a.y) * (b.y - a.y)) / l2));
  const closestPoint = {
    x: a.x + t * (b.x - a.x),
    y: a.y + t * (b.y - a.y)
  };

  return closestPoint;
}
/**
 * 線分と点の最近傍点を計算する
 * @param {Vector} point
 * @param {Line} line
 */
function findNearestPoint(point, line) {
  // 線分上の最近傍点を計算
  const closest = nearestPointOnLineSegment(point, line);

  // 線分上にあるか確認
  if (
    closest.x >= Math.min(line.s.x, line.e.x) &&
    closest.x <= Math.max(line.s.x, line.e.x) &&
    closest.y >= Math.min(line.s.y, line.e.y) &&
    closest.y <= Math.max(line.s.y, line.e.y)
  )
    return closest;

  // 線分の外側に最近傍点がある場合、線分の端点のうち距離が近い方を返す
  const distanceA = distancePoint(point, line.s);
  const distanceB = distancePoint(point, line.e);
  return distanceA < distanceB ? line.s : line.e;
}
/**
 * ボールが線に当たっているか計算する
 * @param {Ball} ball
 * @param {Line} line
 */
function isHittedBallToLine(ball, line) {
  const nearestPoint = findNearestPoint(ball, line);
  const dis = distancePoint(nearestPoint, ball);
  return dis < ball.radius + line.s.radius;
}

// ===========================================
// Vector 関連
// ===========================================
/**
 * @param {Vector} v
 * @returns {number}
 */
function lengthV(v) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}
/**
 * @param {Vector} a
 * @param {number | Vector} b
 * @returns {Vector}
 */
function multiply(a, b) {
  if (typeof b === "number")
    return { x: a.x * b, y: a.y * b };
  return { x: a.x * b.x, y: a.y * b.y };
}
/**
 * @param {Vector} v
 * @returns {Vector}
 */
function normalize(v) {
  return multiply(v, 1 / lengthV(v));
}
