//@ts-check

let zoomScale = window.devicePixelRatio || 1;
// ブラウザの拡大率を取得する
window.addEventListener("resize", () => {
  zoomScale = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;
});





/** @type {Ball | undefined} */
let holdBall;
/** @type {"A" | "B" | undefined} */
let holdRect;

cnv.addEventListener("mousedown", ev => {
  holdBall = getBallFromPoint(ev.offsetX, ev.offsetY);
  if (holdBall == null) holdRect = getRectFromPoint(ev.offsetX, ev.offsetY);
});

cnv.addEventListener("mousemove", ev => {
  if (!move(ev)) return;
  ballA_s.hitted = isHittedBallToLine(ballA_s, lineB);

  drawAll(true);
});

cnv.addEventListener("mouseup", ev => {
  if (!move(ev)) return;
  ballA_s.hitted = isHittedBallToLine(ballA_s, lineB);

  drawAll(true);

  holdBall = undefined;
  holdRect = undefined;

});

/**
 * 掴んでいる図形を動かす
 * @param {MouseEvent} ev 
 * @returns {boolean} 更新したかどうか
 */
function move(ev) {
  const moveX = ev.movementX * (1 / zoomScale);
  const moveY = ev.movementY * (1 / zoomScale);

  if (holdBall != null) {
    holdBall.x += moveX;
    holdBall.y += moveY;
  } else if (holdRect != null) {
    if (holdRect == "A") {
      ballA_s.x += moveX;
      ballA_s.y += moveY;
      ballA_e.x += moveX;
      ballA_e.y += moveY;
    } else {
      ballB_s.x += moveX;
      ballB_s.y += moveY;
      ballB_e.x += moveX;
      ballB_e.y += moveY;
    }
  } else return false;

  return true;
}

/**
 * 指定座標にある円を返す
 * @param {number} x
 * @param {number} y
 * @returns {Ball | undefined}
 */
function getBallFromPoint(x, y) {
  for (const ball of balls) {
    if (isInsideBall(ball, { x, y })) return ball;
  }
  return undefined;
}
/**
 * 指定座標に矩形円を返す
 * @param {number} x
 * @param {number} y
 * @returns {"A" | "B" | undefined}
 */
function getRectFromPoint(x, y) {
  const point = { x, y };

  if (!viewAll) {
    const nearestPoint = findNearestPoint(point, lineB);
    const dis = distancePoint(point, nearestPoint);
    if (dis < 40) return "B";

    return undefined;
  }

  if (isInsideRect(boundingRectA, point)) return "A";
  if (isInsideRect(boundingRectB, point)) return "B";
  return undefined;
}
