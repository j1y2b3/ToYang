// 樱花动画
(() => {
    const canvas = document.getElementById('sakura-canvas');
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    class Petal {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = -20;
            this.vx = -0.5 + Math.random();
            this.vy = 1 + Math.random() * 3;
            this.size = 5 + Math.random() * 10;
            this.rot = Math.random() * Math.PI;
            this.spin = Math.random() < 0.5 ? 0.1 : -0.1;
            this.color = `rgba(255,${Math.floor(170 + Math.random()*85)},${Math.floor(180 + Math.random()*75)},0.7)`;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.rot += this.spin;
            
            if (this.y > height + 20) this.reset();
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rot);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size/2, this.size, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
        }
    }

    const petals = Array.from({ length: 50 }, () => new Petal());

    function animate() {
        ctx.clearRect(0, 0, width, height);
        petals.forEach(petal => {
            petal.update();
            petal.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    animate();
})();

// 弹幕功能
async function initDanmu() {
    try {
        const response = await fetch('messages.csv');
        const csvData = await response.text();
        const messages = csvData.split('\n').slice(1).map(line => {
            const [message] = line.split(',');
            return message.trim().replace(/^"|"$/g, '');
        });

        const danmuContainer = document.getElementById('danmu-container');
        const lineHeight = 30;
        const numLines = Math.floor(window.innerHeight / lineHeight);
        const usedLines = new Array(numLines).fill(false);

        messages.forEach((message) => {
            const danmu = document.createElement('div');
            danmu.classList.add('danmu');
            danmu.textContent = message;

            const randomColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
            danmu.style.color = randomColor;

            const randomDuration = Math.floor(Math.random() * 30) + 10;
            danmu.style.animation = `danmu-scroll ${randomDuration}s linear infinite`;

            let availableLines = [];
            for (let i = 0; i < numLines; i++) {
                if (!usedLines[i]) availableLines.push(i);
            }
            if (availableLines.length > 0) {
                const randomLine = availableLines[Math.floor(Math.random() * availableLines.length)];
                danmu.style.top = `${randomLine * lineHeight}px`;
                usedLines[randomLine] = true;
            }

            danmuContainer.appendChild(danmu);
        });

        const style = document.createElement('style');
        style.textContent = `
            @keyframes danmu-scroll {
                from { transform: translateX(150vw); }
                to { transform: translateX(-100%); }
            }
        `;
        document.head.appendChild(style);
    } catch (error) {
        console.error('初始化弹幕失败:', error);
        const errorMsg = document.createElement('div');
        errorMsg.textContent = '祝福语加载失败，但我们的祝福永存心间！❤️';
        errorMsg.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); font-size:24px; color:red;';
        document.body.appendChild(errorMsg);
    }
}