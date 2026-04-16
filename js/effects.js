export function initEffects() {
    heroEffects();
}

// Particle effects for the hero
function heroEffects() {
    const canvas = document.getElementById("hero-canvas");
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;

    const cloud_parameters = {
        count: 3,
        minRadius: 200,
        maxRadius: 700,
        minSpeed: 0.02,
        maxSpeed: 0.1,
        minPuffs: 50,
        maxPuffs: 100,
        breathAmplitude: 0.7,
        breathSpeed: 0.02
    };

    const particle_parameters = {
        count: 3000,
        minSize: 0.01,
        maxSize: 1.2,
        maxSpeed: 0.2,
        driftStrength: 0.01,
        friction: 0.95,
        mouseForce: 10,
        spawnRadiusFactor: 1.2
    };

    const clouds = [];
    const particles = [];
    const mouse = { x: null, y: null, radius: 50 };
    let frame = 0;
    let noClear = false;
    let blurFilter = false;
    let isPaused = true;

    const clearCheckbox = document.getElementById("toggle-trail");

    clearCheckbox.addEventListener("change", () => {
        noClear = !clearCheckbox.checked;
    });

    const pauseCheckbox = document.getElementById("toggle-effects");

    pauseCheckbox.addEventListener("change", () => {
        isPaused = pauseCheckbox.checked;
        ctx.clearRect(0, 0, width, height);
    });

    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
    }

    resizeCanvas();
    window.addEventListener("resize", () => {
        const prevWidth = width;
        const prevHeight = height;

        width = window.innerWidth;
        height = window.innerHeight;
        resizeCanvas();

        particles.forEach(p => {
            p.x = p.x * (width / prevWidth);
            p.y = p.y * (height / prevHeight);
        });
        clouds.forEach(c => {
            c.x = c.x * (width / prevWidth);
            c.y = c.y * (height / prevHeight);
        });
    });

    function hslToRgb(h, s, l) {
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = l - c / 2;
        let r = 0, g = 0, b = 0;
        if (h < 60) { r = c; g = x; b = 0; }
        else if (h < 120) { r = x; g = c; b = 0; }
        else if (h < 180) { r = 0; g = c; b = x; }
        else if (h < 240) { r = 0; g = x; b = c; }
        else if (h < 300) { r = x; g = 0; b = c; }
        else { r = c; g = 0; b = x; }
        return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
    }

    function randomCloudColor() {
        const baseHue = 45;
        const hueVariance = 5;
        const baseSaturation = 0.6;
        const satVariance = 0.6;
        const baseLightness = 0.85;
        const lightVariance = 0.1;

        const h = baseHue + (Math.random() - 0.5) * hueVariance;
        const s = Math.min(1, Math.max(0, baseSaturation + (Math.random() - 0.5) * satVariance));
        const l = Math.min(1, Math.max(0, baseLightness + (Math.random() - 0.5) * lightVariance));

        return hslToRgb(h, s, l);
    }

    for (let i = 0; i < cloud_parameters.count; i++) {
        const cloudRadius = cloud_parameters.minRadius + Math.random() * (cloud_parameters.maxRadius - cloud_parameters.minRadius);
        const puffCount = cloud_parameters.minPuffs + Math.floor(Math.random() * (cloud_parameters.maxPuffs - cloud_parameters.minPuffs));
        const cloudColor = randomCloudColor();

        const puffs = [];
        for (let j = 0; j < puffCount; j++) {
            const offsetX = (Math.random() - 0.5) * cloudRadius * 1.5;
            const offsetY = (Math.random() - 0.5) * cloudRadius * 0.6;
            const puffRadius = cloudRadius * (0.25 + Math.random() * 0.45);
            const alpha = 0.05 + Math.random() * 0.15;
            const phase = Math.random() * Math.PI * 2;
            puffs.push({ offsetX, offsetY, puffRadius, alpha, phase, color: cloudColor });
        }

        clouds.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: cloudRadius,
            vx: (Math.random() - 0.5) * (cloud_parameters.maxSpeed - cloud_parameters.minSpeed),
            vy: (Math.random() - 0.5) * (cloud_parameters.maxSpeed - cloud_parameters.minSpeed),
            wobbleX: Math.random() * 0.5,
            wobbleY: Math.random() * 0.5,
            puffs
        });
    }

    for (let i = 0; i < particle_parameters.count; i++) {
        const cloud = clouds[Math.floor(Math.random() * clouds.length)];
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * cloud.radius * particle_parameters.spawnRadiusFactor;

        particles.push({
            x: cloud.x + Math.cos(angle) * radius,
            y: cloud.y + Math.sin(angle) * radius * 0.6,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: particle_parameters.minSize + Math.random() * (particle_parameters.maxSize - particle_parameters.minSize),
            cloud,
            targetAngle: angle,
            targetRadius: radius,
            targetSpeed: 0.001 + Math.random() * 0.002
        });
    }

    window.addEventListener("mousemove", e => {
        const rect = canvas.getBoundingClientRect();
        
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    
    window.addEventListener("mouseleave", () => { mouse.x = null; mouse.y = null; });

    function drawClouds() {
        ctx.save();
        // Disable to run better, looks very slightly less cloud like
        if (blurFilter) {
            ctx.filter = "blur(15px)";
        }
        clouds.forEach(cloud => {
            cloud.puffs.forEach(puff => {
                const breathFactor = 1 + Math.sin(frame * cloud_parameters.breathSpeed + puff.phase) * cloud_parameters.breathAmplitude;
                const radius = puff.puffRadius * breathFactor;

                const gradient = ctx.createRadialGradient(
                    cloud.x + puff.offsetX,
                    cloud.y + puff.offsetY,
                    0,
                    cloud.x + puff.offsetX,
                    cloud.y + puff.offsetY,
                    radius
                );

                gradient.addColorStop(0, `rgba(${puff.color[0]},${puff.color[1]},${puff.color[2]},${puff.alpha})`);
                gradient.addColorStop(1, "rgba(0,0,0,0)");

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(cloud.x + puff.offsetX, cloud.y + puff.offsetY, radius, 0, Math.PI * 2);
                ctx.fill();
            });

            const wobbleSpeed = 0.002;
            cloud.vx += Math.sin(frame * wobbleSpeed + cloud.wobbleX) * 0.0002;
            cloud.vy += Math.cos(frame * wobbleSpeed + cloud.wobbleY) * 0.0002;

            cloud.x += cloud.vx;
            cloud.y += cloud.vy;

            const centerX = width / 2;
            const centerY = height / 2;
            const pullStrength = 0.0005;
            cloud.vx += (centerX - cloud.x) * pullStrength;
            cloud.vy += (centerY - cloud.y) * pullStrength;

            const cloudSpeed = Math.sqrt(cloud.vx * cloud.vx + cloud.vy * cloud.vy);
            if (cloudSpeed > cloud_parameters.maxSpeed) {
                cloud.vx = (cloud.vx / cloudSpeed) * cloud_parameters.maxSpeed;
                cloud.vy = (cloud.vy / cloudSpeed) * cloud_parameters.maxSpeed;
            }
        });
        ctx.restore();
    }

    function updateParticles() {
        particles.forEach(p => {
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    p.vx -= Math.cos(angle) * force * particle_parameters.mouseForce;
                    p.vy -= Math.sin(angle) * force * particle_parameters.mouseForce;
                }
            }

            p.targetAngle += p.targetSpeed;
            const tx = p.cloud.x + Math.cos(p.targetAngle) * p.targetRadius;
            const ty = p.cloud.y + Math.sin(p.targetAngle) * p.targetRadius * 0.6;

            p.vx += (tx - p.x) * particle_parameters.driftStrength;
            p.vy += (ty - p.y) * particle_parameters.driftStrength;

            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            const maxSpeed = particle_parameters.maxSpeed;

            if (speed > maxSpeed) {
                const excess = speed - maxSpeed;
                const damping = 0.9;
                p.vx *= damping;
                p.vy *= damping;
            }

            p.x += p.vx;
            p.y += p.vy;

            p.vx *= particle_parameters.friction;
            p.vy *= particle_parameters.friction;
        });
    }

    function drawParticles() {
        ctx.fillStyle = "rgba(233, 219, 189, 0.75)";
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function animate() {
        if (!isPaused) {
            frame++;

            if (!noClear) {
                ctx.clearRect(0, 0, width, height);
            }

            drawClouds();
            updateParticles();
            drawParticles();
        }
        requestAnimationFrame(animate);
    }

    animate();
}

