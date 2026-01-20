function triangle(ctx, x1, y1, x2, y2, x3, y3) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
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

    const x1 = width / 2;
    const y1 = margin;
    const x2 = x1 - side / 2;
    const y2 = margin + side * Math.sin(Math.PI / 3);
    const x3 = x1 + side / 2;
    const y3 = y2;

    triangle(ctx, x1, y1, x2, y2, x3, y3);

    drawSierpinskiRec(ctx, x1, y1, x2, y2, x3, y3, level);
}

function drawSierpinskiRec(ctx, x1, y1, x2, y2, x3, y3, depth) {
    if (depth === 0) {
        return;
    }

    const mx1 = (x1 + x2) / 2;
    const my1 = (y1 + y2) / 2;
    const mx2 = (x2 + x3) / 2;
    const my2 = (y2 + y3) / 2;
    const mx3 = (x3 + x1) / 2;
    const my3 = (y3 + y1) / 2;

    triangle(ctx, mx1, my1, mx2, my2, mx3, my3);

    drawSierpinskiRec(ctx, x1, y1, mx1, my1, mx3, my3, depth - 1);
    drawSierpinskiRec(ctx, mx1, my1, x2, y2, mx2, my2, depth - 1);
    drawSierpinskiRec(ctx, mx3, my3, mx2, my2, x3, y3, depth - 1);
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
