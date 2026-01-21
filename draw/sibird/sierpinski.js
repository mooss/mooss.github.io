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
    ctx.strokeStyle = 'rgba(218, 112, 214, .4)';
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

    return [ctx, top, left, right];
}

function drawSierpinski(canvas, level) {
    const [ctx, top, left, right] = prepareContext(canvas);
    ctx.lineWidth = 1;
    triangle(ctx, top, left, right);
    drawSierpinskiRec(ctx, top, left, right, level);
}

function drawSierpinskiRec(ctx, p1, p2, p3, depth) {
    if (depth <= 0) return;

    const m1 = p1.midpoint(p2);
    const m2 = p2.midpoint(p3);
    const m3 = p3.midpoint(p1);

    triangle(ctx, m1, m2, m3);
    drawSierpinskiRec(ctx, p1, m1, m3, depth - 1);
    drawSierpinskiRec(ctx, m1, p2, m2, depth - 1);
    drawSierpinskiRec(ctx, m3, m2, p3, depth - 1);
}

function drawBird(canvas, level) {
    if (level <= 0) return;
    const [ctx, top, left, right] = prepareContext(canvas);
    ctx.beginPath();
    drawBirdRec((point) => ctx.lineTo(point.x, point.y), left, top, right, level);
    ctx.strokeStyle = 'deepskyblue';
    ctx.lineWidth = 2;
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
    drawBirdRec(draw, leri, miri, right, depth - 1);
    drawBirdRec(draw, lemi, mid, miri, depth - 1);
}

function clamp(x, min, max) {
    if (x <= min) return min;
    if (x >= max) return max;
    return x;
}

function getParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function setParam(level) {
    const url = new URL(window.location);
    url.searchParams.set('level', level);
    window.history.replaceState({}, '', url);
}

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('triangle-canvas');
    const levelSlider = document.getElementById('level-slider');
    const levelValue = document.getElementById('level-value');
    levelSlider.value = clamp(getParam('level') || levelSlider.value, levelSlider.min, levelSlider.max);

    levelValue.textContent = levelSlider.value;

    const draw = (level) => {
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        drawSierpinski(canvas, level);
        drawBird(canvas, level);
    };

    //////////////////
    // Slider setup //

    // Redraw on value change.
    levelSlider.addEventListener('input', () => {
        const level = parseInt(levelSlider.value);
        levelValue.textContent = level;
        setParam(level);
        draw(level);
    });

    // Move slider with mouse wheel and trigger redraw.
    levelSlider.addEventListener('wheel', (event) => {
        event.preventDefault();
        const delta = Math.sign(event.deltaY);
        let value = clamp(levelSlider.value - delta, levelSlider.min, levelSlider.max);
        levelSlider.value = value;
        levelValue.textContent = value;
        setParam(value);
        draw(value);
    });

    ///////////////////////
    // Start application //

    function resizeCanvas() {
        // Force a square drawing area to prevent ugly horizontal or vertical stretching.
        const wrapper = canvas.parentElement;
        const size = Math.min(wrapper.clientWidth, wrapper.clientHeight);
        canvas.width = size;
        canvas.height = size;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;

        draw(parseInt(levelSlider.value));
    }

    window.addEventListener('resize', resizeCanvas);
    requestAnimationFrame(() => {
        resizeCanvas();
    });
});
