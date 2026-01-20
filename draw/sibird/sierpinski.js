class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    midpoint(...points) {
        const res = new Point(this.x, this.y);
        for (const point of points) {
            res.x += point.x;
            res.y += point.y;
        }

        res.x /= points.length + 1;
        res.y /= points.length + 1;
        return res;
    }
}

function triangle(ctx, p1, p2, p3) {
    ctx.beginPath();
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.strokeStyle = '#000';
    ctx.stroke();
}

function prepareContext(canvas) {
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext('2d');
    const margin = Math.min(width, height) * 0.05;
    const side = Math.min(width, height) - 2 * margin;

    const top = new Point(width / 2, margin);
    const left = new Point(top.x - side / 2, margin + side * Math.sin(Math.PI / 3));
    const right = new Point(top.x + side / 2, left.y);

    ctx.clearRect(0, 0, width, height);
    return [ctx, top, left, right];
}

function drawSierpinski(canvas, level) {
    const [ctx, top, left, right] = prepareContext(canvas);
    triangle(ctx, top, left, right);
    drawSierpinskiRec(ctx, top, left, right, level);
}

function drawSierpinskiRec(ctx, p1, p2, p3, depth) {
    if (depth === 0) return;

    const m1 = p1.midpoint(p2);
    const m2 = p2.midpoint(p3);
    const m3 = p3.midpoint(p1);

    triangle(ctx, m1, m2, m3);
    drawSierpinskiRec(ctx, p1, m1, m3, depth - 1);
    drawSierpinskiRec(ctx, m1, p2, m2, depth - 1);
    drawSierpinskiRec(ctx, m3, m2, p3, depth - 1);
}

function drawBird(canvas, level) {
    if (level === 0) return;
    const [ctx, top, left, right] = prepareContext(canvas);
    ctx.beginPath();
    drawBirdRec((point) => ctx.lineTo(point.x, point.y), left, top, right, level);
    ctx.closePath();
    ctx.strokeStyle = '#000';
    ctx.stroke();
}

function drawBirdRec(draw, left, mid, right, depth) {
    // At the end of the recursions, draw a line to the middle of the triangle.
    if (depth === 0) return draw(left.midpoint(mid, right));

    const lemi = left.midpoint(mid);
    const leri = left.midpoint(right);
    const miri = mid.midpoint(right);

    // The order or both the recursive calls and their arguments is crucial since this is not
    // drawing a triangle but a path.
    drawBirdRec(draw, left, lemi, leri, depth - 1);
    drawBirdRec(draw, lemi, leri, miri, depth - 1);
    drawBirdRec(draw, lemi, miri, right, depth - 1);
    drawBirdRec(draw, lemi, mid, miri, depth - 1);
}

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('triangle-canvas');
    const slider = document.getElementById('recursion-slider');
    const levelValue = document.getElementById('level-value');
    levelValue.textContent = slider.value;
    const draw = (level) => {
        drawSierpinski(canvas, level);
        drawBird(canvas, level);
    }

    //////////////////
    // Slider setup //

    // Redraw on value change.
    slider.addEventListener('input', () => {
        const level = parseInt(slider.value);
        levelValue.textContent = level;
        draw(level);
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
        draw(newValue);
    });

    ///////////////////////
    // Start application //

    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        draw(parseInt(slider.value));
    }

    window.addEventListener('resize', resizeCanvas);
    requestAnimationFrame(() => {
        resizeCanvas();
    });
});
