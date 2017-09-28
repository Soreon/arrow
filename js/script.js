/*jslint es6 */
/*globale document, window, requestAnimationFrame*/

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

let canvas = document.getElementById("mainCanvas");
let context = canvas.getContext('2d');
let groundHeight = 50;
let playerInfos = {offsetX: 20, offsetY: 20, radius: 10, beak: 30, angle: 45};
let playerInitialAngle = 45;
let percentForce = 100;
let mouseX = -1;
let mouseY = -1;
let forceX = -1;
let forceY = -1;
let stepForce = 2;
let bullets = [];
let bulletInitialSpeed = 50;

Math.toRadians = function (degrees) {
    "use strict";
    return degrees * Math.PI / 180;
};

Math.toDegrees = function (radians) {
    "use strict";
    return radians * 180 / Math.PI;
};

function clearCanvas(ctx) {
    "use strict";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function line(ctx, x1, y1, x2, y2, color) {
    "use strict";
    let origStrokeStyle = ctx.strokeStyle;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.strokeStyle = origStrokeStyle;
}

function arc(ctx, x, y, radius, startAngle, endAngle, color) {
    "use strict";
    let origStrokeStyle = ctx.strokeStyle;

    ctx.beginPath();
    ctx.arc(x, y, radius, Math.toRadians(endAngle), Math.toRadians(startAngle), true);
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.strokeStyle = origStrokeStyle;
}

function circle(ctx, x, y, radius, color) {
    "use strict";
    arc(ctx, x, y, radius, 0, 360, color);
}

function quadraticCurve(ctx, x1, y1, x2, y2, x3, y3, color) {
    "use strict";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(x2, y2, x3, y3);
    ctx.strokeStyle = color;
    ctx.stroke();
}

function updateCanvasSize() {
    'use strict';
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

function createPlayer() {
    "use strict";
    let canvasPlayer = document.createElement('canvas');
    canvasPlayer.width = 100;
    canvasPlayer.height = 100;
    let ctxPlayer = canvasPlayer.getContext('2d');
    playerInfos.canvasPlayer = canvasPlayer;
    playerInfos.ctxPlayer = ctxPlayer;
    line(ctxPlayer, 0, 0, 100, 100);
}

function drawPlayer() {
    "use strict";
    let playerX = playerInfos.offsetX;
    let playerY = canvas.height - groundHeight - playerInfos.offsetY;
    let playerAngle = playerInfos.angle - playerInitialAngle;
    let startAngle = 0 + playerAngle;
    let endAngle = 270 + playerAngle;
    let startAnglePoint = {x: 0, y: 0};
    let endAnglePoint = {x: 0, y: 0};
    let middlePoint = {x: 0, y: 0};

    startAnglePoint.x = playerX + playerInfos.radius * Math.cos(Math.toRadians(startAngle));
    startAnglePoint.y = playerY + playerInfos.radius * Math.sin(Math.toRadians(startAngle));
    endAnglePoint.x = playerX + playerInfos.radius * Math.cos(Math.toRadians(endAngle));
    endAnglePoint.y = playerY + playerInfos.radius * Math.sin(Math.toRadians(endAngle));
    middlePoint.x = playerX + playerInfos.beak * Math.cos(Math.toRadians(playerAngle - 45));
    middlePoint.y = playerY + playerInfos.beak * Math.sin(Math.toRadians(playerAngle - 45));

    playerInfos.x = playerX;
    playerInfos.y = playerY;
    playerInfos.beakX = middlePoint.x;
    playerInfos.beakY = middlePoint.y;

    arc(context, playerX, playerY, playerInfos.radius, startAngle, endAngle, '#000');
    line(context, startAnglePoint.x, startAnglePoint.y, middlePoint.x, middlePoint.y, '#000');
    line(context, endAnglePoint.x, endAnglePoint.y, middlePoint.x, middlePoint.y, '#000');
}

function drawBullets() {
    for(i = 0; i < bullets.length; i = i + 1) {
        circle(context, bullets[i].x, bullets[i].y, 2, '#000');
    }
}

function draw() {
    "use strict";
    clearCanvas(context);

    // Sol
    line(context, 0, canvas.height - groundHeight, canvas.width, canvas.height - groundHeight, '#000');

    // Direction
    if(forceX > -1) {
        line(context, playerInfos.beakX, playerInfos.beakY, forceX, forceY, '#BBB');
    }

    // Courbe du projectile
    if (mouseX >= playerInfos.beakX && mouseY <= playerInfos.beakY) {
        quadraticCurve(context, playerInfos.beakX, playerInfos.beakY, forceX, forceY, (forceX - playerInfos.beakX) * 2 + playerInfos.beakX, canvas.height - groundHeight, '#BBB');
    }
    drawPlayer();
    drawBullets();
}

function updateForce() {
    'use strict';
    forceX = playerInfos.beakX + ((mouseX - playerInfos.beakX) * percentForce / 100);
    forceY = playerInfos.beakY + ((mouseY - playerInfos.beakY) * percentForce / 100);
}

function addBullet(bullet) {
    'use strict';
    bullets.push(bullet);
}

window.addEventListener('resize', function () {
    'use strict';
    updateCanvasSize();
}, true);

document.addEventListener('mousemove', function (event) {
    'use strict';
    mouseX = event.clientX;
    mouseY = event.clientY;
    playerInfos.angle = Math.toDegrees(Math.atan2(mouseY - playerInfos.y, mouseX - playerInfos.x)) + 90;
    updateForce();
}, true);

document.addEventListener('mouseleave', function () {
    'use strict';
    mouseX = -1;
    mouseY = -1;
    forceX = -1;
    forceY = -1;
});

document.addEventListener("mousewheel", function (event) {
    'use strict';
    let sens = (event.deltaY > 0 ? -1 : 1) * stepForce;
    if ((percentForce + sens) >= 0 && (percentForce + sens) <= 100) {
        percentForce += sens;
    }
    updateForce();
}, true);

document.addEventListener('mousemove', function (event) {
    'use strict';
    mouseX = event.clientX;
    mouseY = event.clientY;
    playerInfos.angle = Math.toDegrees(Math.atan2(mouseY - playerInfos.y, mouseX - playerInfos.x)) + 90;
    updateForce();
}, true);

document.addEventListener('click', function () {
    'use strict';
    addBullet({x: playerInfos.beakX, y: playerInfos.beakY, speed: bulletInitialSpeed, direction: playerInfos.angle});
}, true);

function moveBullets() {
    'use strict';
    let i;
    for(i = 0; i < bullets.length; i = i + 1) {
        bullets[i].x += Math.cos(Math.toRadians(bullets[i].direction - 90)) * bullets[i].speed;
        bullets[i].y += Math.sin(Math.toRadians(bullets[i].direction - 90)) * bullets[i].speed;
        if (bullets[i].x > canvas.width || bullets[i].x < 0 || bullets[i].y > canvas.height || bullets[i].y < 0) {
            bullets.splice(i, 1);
        }
        // x = speed * Math.cos(playerInfos.angle) * t;
        // y = (speed * Math.sin(playerInfos.angle) * t) - ((1/2) * g * t * t);
    }
}

function animate() {
    'use strict';
    moveBullets();
    draw();
    requestAnimationFrame(animate);
}


createPlayer();
updateCanvasSize();
animate();