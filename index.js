var Ball = /** @class */ (function () {
    function Ball(canvas, x, y, color, size) {
        this.gravity = 1000;
        this.dampening = 0.8;
        this.trail = [];
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.x = x;
        this.y = y;
        this.radius = size;
        this.dx = Math.random() * 200 - 100; // Random horizontal velocity
        this.dy = Math.random() * -300; // Random initial upward velocity
        this.color = color;
        this.size = size;
    }
    Ball.prototype.draw = function () {
        // Pulsating effect
        var pulse = Math.sin(Date.now() * 0.002) * 5;
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius + pulse, 0, Math.PI * 2);
        this.context.fillStyle = this.color;
        this.context.globalAlpha = 0.8; // Set transparency
        this.context.fill();
        this.context.closePath();
        // Draw ball trail
        this.context.beginPath();
        this.context.moveTo(this.x, this.y);
        for (var i = 0; i < this.trail.length; i++) {
            this.context.lineTo(this.trail[i].x, this.trail[i].y);
        }
        this.context.strokeStyle = this.color;
        this.context.lineWidth = this.radius / 2;
        this.context.lineCap = 'round';
        this.context.lineJoin = 'round';
        this.context.stroke();
        this.context.globalAlpha = 1; // Reset transparency
    };
    Ball.prototype.update = function (deltaTime) {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 10) {
            this.trail.shift(); // Remove older points
        }
        this.x += this.dx * deltaTime;
        this.y += this.dy * deltaTime;
        // Apply gravity
        this.dy += this.gravity * deltaTime;
        // Bounce off the walls
        if (this.x - this.radius < 0 || this.x + this.radius > this.canvas.width) {
            this.dx = -this.dx * this.dampening;
        }
        // Bounce off the floor
        if (this.y + this.radius > this.canvas.height) {
            this.y = this.canvas.height - this.radius;
            this.dy = -this.dy * this.dampening;
        }
    };
    return Ball;
}());
var BouncingBall = /** @class */ (function () {
    function BouncingBall(canvas) {
        this.balls = [];
        this.lastTime = 0;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.setupEventListeners();
    }
    BouncingBall.prototype.setupEventListeners = function () {
        var _this = this;
        this.canvas.addEventListener('click', function (event) { return _this.spawnBall(event); });
    };
    BouncingBall.prototype.spawnBall = function (event) {
        var colors = ['#0095DD', '#FF4500', '#4CAF50', '#FFD700']; // Add more colors
        var sizes = [20, 30, 40, 50]; // Add more sizes
        var randomColor = colors[Math.floor(Math.random() * colors.length)];
        var randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        var ball = new Ball(this.canvas, event.clientX - this.canvas.offsetLeft, event.clientY - this.canvas.offsetTop, randomColor, randomSize);
        this.balls.push(ball);
    };
    BouncingBall.prototype.drawBackground = function () {
        // Draw snowy background
        var gradient = this.context.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1E90FF'); // DodgerBlue
        gradient.addColorStop(1, '#FFFFFF'); // White
        this.context.fillStyle = gradient;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // Draw snowflakes
        this.context.fillStyle = '#FFFFFF'; // White snowflakes
        for (var i = 0; i < 50; i++) {
            var size = Math.random() * 4 + 1; // Random size
            var x = Math.random() * this.canvas.width;
            var y = Math.random() * this.canvas.height;
            this.context.beginPath();
            this.context.arc(x, y, size, 0, Math.PI * 2);
            this.context.fill();
        }
    };
    BouncingBall.prototype.draw = function () {
        this.drawBackground();
        this.balls.forEach(function (ball) { return ball.draw(); });
    };
    BouncingBall.prototype.update = function (deltaTime) {
        this.balls.forEach(function (ball) { return ball.update(deltaTime); });
    };
    BouncingBall.prototype.animate = function (currentTime) {
        var _this = this;
        var deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;
        this.update(deltaTime);
        this.draw();
        requestAnimationFrame(function (time) { return _this.animate(time); });
    };
    return BouncingBall;
}());
document.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('bouncingBallCanvas');
    var bouncingBall = new BouncingBall(canvas);
    bouncingBall.animate(0);
});
