class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    midpoint(other) { return new Point((this.x + other.x) / 2, (this.y + other.y) / 2) }
}

function triangle(ctx, p1, p2, p3) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.strokeStyle = '#000';
    ctx.stroke();
}

function drawSierpinski(canvas, level) {
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext('2d');
    const margin = Math.min(width, height) * 0.05;
    const side = Math.min(width, height) - 2 * margin;

    ctx.clearRect(0, 0, width, height);

    const p1 = new Point(width / 2, margin);
    const p2 = new Point(p1.x - side / 2, margin + side * Math.sin(Math.PI / 3));
    const p3 = new Point(p1.x + side / 2, p2.y);

    triangle(ctx, p1, p2, p3);
    drawSierpinskiRec(ctx, p1, p2, p3, level);
}

function drawSierpinskiRec(ctx, p1, p2, p3, depth) {
    if (depth === 0) {
        return;
    }

    const m1 = p1.midpoint(p2);
    const m2 = p2.midpoint(p3);
    const m3 = p3.midpoint(p1);

    triangle(ctx, m1, m2, m3);
    drawSierpinskiRec(ctx, p1, m1, m3, depth - 1);
    drawSierpinskiRec(ctx, m1, p2, m2, depth - 1);
    drawSierpinskiRec(ctx, m3, m2, p3, depth - 1);
}

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('triangle-canvas');
    const slider = document.getElementById('recursion-slider');
    const levelValue = document.getElementById('level-value');
    levelValue.textContent = slider.value;

    //////////////////
    // Slider setup //

    // Redraw on value change.
    slider.addEventListener('input', () => {
        const level = parseInt(slider.value);
        levelValue.textContent = level;
        drawSierpinski(canvas, level);
    });

    // Move slider with mouse wheel and trigger redraw.
    slider.addEventListener('wheel', (event) => {
        event.preventDefault();
        const delta = Math.sign(event.deltaY);
        let newValue = parseInt(slider.value) - delta;
        if (newValue < parseInt(slider.min)) newValue = parseInt(slider.min);
        if (newValue > parseInt(slider.max)) newValue = parseInt(slider.max);
        slider.value = newValue;
        levelValue.textContent = newValue;
        drawSierpinski(canvas, newValue);
    });

    ///////////////////////
    // Start application //

    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawSierpinski(canvas, parseInt(slider.value));
    }

    window.addEventListener('resize', resizeCanvas);
    requestAnimationFrame(() => {
        resizeCanvas();
    });
});
