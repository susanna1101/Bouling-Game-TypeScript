class Ball {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private x: number;
    private y: number;
    private radius: number;
    private dx: number;
    private dy: number;
    private gravity: number = 1000;
    private dampening: number = 0.8;
    private color: string;
    private size: number;
    private trail: { x: number, y: number }[] = [];

    constructor(canvas: HTMLCanvasElement, x: number, y: number, color: string, size: number) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;
        this.x = x;
        this.y = y;
        this.radius = size;
        this.dx = Math.random() * 200 - 100; // Random horizontal velocity
        this.dy = Math.random() * -300; // Random initial upward velocity
        this.color = color;
        this.size = size;
    }

    draw() {
        // Pulsating effect
        const pulse = Math.sin(Date.now() * 0.002) * 5;

        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius + pulse, 0, Math.PI * 2);
        this.context.fillStyle = this.color;
        this.context.globalAlpha = 0.8; // Set transparency
        this.context.fill();
        this.context.closePath();

        // Draw ball trail
        this.context.beginPath();
        this.context.moveTo(this.x, this.y);
        for (let i = 0; i < this.trail.length; i++) {
            this.context.lineTo(this.trail[i].x, this.trail[i].y);
        }
        this.context.strokeStyle = this.color;
        this.context.lineWidth = this.radius / 2;
        this.context.lineCap = 'round';
        this.context.lineJoin = 'round';
        this.context.stroke();
        this.context.globalAlpha = 1; // Reset transparency
    }

    update(deltaTime: number) {
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
    }
}

class BouncingBall {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private balls: Ball[] = [];
    private lastTime: number = 0;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.canvas.addEventListener('click', (event) => this.spawnBall(event));
    }

    spawnBall(event: MouseEvent) {
        const colors = ['#0095DD', '#FF4500', '#4CAF50', '#FFD700']; // Add more colors
        const sizes = [20, 30, 40, 50]; // Add more sizes
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];

        const ball = new Ball(
            this.canvas,
            event.clientX - this.canvas.offsetLeft,
            event.clientY - this.canvas.offsetTop,
            randomColor,
            randomSize
        );

        this.balls.push(ball);
    }

    drawBackground() {
        // Draw snowy background
        const gradient = this.context.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1E90FF'); // DodgerBlue
        gradient.addColorStop(1, '#FFFFFF'); // White
        this.context.fillStyle = gradient;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snowflakes
        this.context.fillStyle = '#FFFFFF'; // White snowflakes
        for (let i = 0; i < 50; i++) {
            const size = Math.random() * 4 + 1; // Random size
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            this.context.beginPath();
            this.context.arc(x, y, size, 0, Math.PI * 2);
            this.context.fill();
        }
    }

    draw() {
        this.drawBackground();
        this.balls.forEach(ball => ball.draw());
    }

    update(deltaTime: number) {
        this.balls.forEach(ball => ball.update(deltaTime));
    }

    animate(currentTime: number) {
        const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.draw();
        requestAnimationFrame((time) => this.animate(time));
    }
}



document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bouncingBallCanvas') as HTMLCanvasElement;
    const bouncingBall = new BouncingBall(canvas);
    bouncingBall.animate(0);
});
