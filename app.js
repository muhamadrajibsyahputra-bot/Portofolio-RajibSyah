// ==========================
// STAR FIELD BACKGROUND CANVAS
// Dark space with twinkling stars + shooting stars + subtle nebula
// ==========================
document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("starCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, t = 0;
    let stars = [], shooters = [];

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    // ---- Create star pool ----
    function makeStar(randomY) {
        const size = Math.random();
        const isBig = size > 0.92;
        const isMed = size > 0.75 && !isBig;
        // Colour: mostly white/blueish, rare green tint
        const hue = Math.random() > 0.85 ? (Math.random() > 0.5 ? 120 : 200) : 0;
        return {
            x: Math.random() * W,
            y: randomY ? Math.random() * H : -2,
            r: isBig ? 1.6 + Math.random() * 0.8 : isMed ? 0.9 + Math.random() * 0.5 : 0.3 + Math.random() * 0.4,
            baseAlpha: isBig ? 0.7 + Math.random() * 0.3 : 0.25 + Math.random() * 0.55,
            alpha: 0,
            twinkleSpeed: 0.008 + Math.random() * 0.025,
            twinkleDir: Math.random() > 0.5 ? 1 : -1,
            twinklePhase: Math.random() * Math.PI * 2,
            hue: hue,
            // big stars have a soft glow
            glow: isBig
        };
    }

    function initStars() {
        stars = [];
        const count = Math.floor(W * H / 1800);
        for (let i = 0; i < count; i++) stars.push(makeStar(true));
    }

    function drawStars() {
        for (let i = 0; i < stars.length; i++) {
            const s = stars[i];
            s.twinklePhase += s.twinkleSpeed;
            s.alpha = s.baseAlpha * (0.4 + 0.6 * Math.abs(Math.sin(s.twinklePhase)));

            const color = s.hue === 0
                ? "rgba(255,255,255," + s.alpha + ")"
                : s.hue === 120
                    ? "rgba(180,255,200," + s.alpha + ")"
                    : "rgba(180,210,255," + s.alpha + ")";

            // Optional glow for bright stars
            if (s.glow) {
                const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
                g.addColorStop(0, "rgba(255,255,255," + (s.alpha * 0.5) + ")");
                g.addColorStop(1, "rgba(255,255,255,0)");
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
                ctx.fillStyle = g;
                ctx.fill();
            }

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        }
    }

    // ---- Shooting stars ----
    function spawnShooter() {
        const speed = 7 + Math.random() * 9;
        const ang = Math.PI / 5 + Math.random() * Math.PI / 6;
        shooters.push({
            x: Math.random() * W * 0.75,
            y: Math.random() * H * 0.45,
            vx: Math.cos(ang) * speed,
            vy: Math.sin(ang) * speed,
            len: 100 + Math.random() * 160,
            alpha: 1,
            fade: 0.016 + Math.random() * 0.012,
            speed
        });
    }

    function drawShooters() {
        for (let i = shooters.length - 1; i >= 0; i--) {
            const s = shooters[i];
            s.x += s.vx; s.y += s.vy; s.alpha -= s.fade;
            if (s.alpha <= 0) { shooters.splice(i, 1); continue; }
            const tx = s.x - s.vx * (s.len / s.speed);
            const ty = s.y - s.vy * (s.len / s.speed);
            const g = ctx.createLinearGradient(s.x, s.y, tx, ty);
            g.addColorStop(0, "rgba(200,240,210," + s.alpha + ")");
            g.addColorStop(0.3, "rgba(255,255,255," + (s.alpha * 0.6) + ")");
            g.addColorStop(1, "rgba(255,255,255,0)");
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(tx, ty);
            ctx.strokeStyle = g;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
    }

    // ---- Subtle nebula glow (very dark, just a hint) ----
    function drawNebula() {
        // Top-right faint green tint
        const g1 = ctx.createRadialGradient(W * 0.8, H * 0.15, 0, W * 0.8, H * 0.15, W * 0.4);
        g1.addColorStop(0, "rgba(20,90,40," + (0.06 + 0.02 * Math.sin(t * 0.3)) + ")");
        g1.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);

        // Bottom-left faint blue tint
        const g2 = ctx.createRadialGradient(W * 0.1, H * 0.85, 0, W * 0.1, H * 0.85, W * 0.35);
        g2.addColorStop(0, "rgba(10,30,80," + (0.07 + 0.02 * Math.sin(t * 0.25 + 1)) + ")");
        g2.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
    }

    // ---- Shooter scheduler ----
    function scheduleShooter() {
        spawnShooter();
        setTimeout(scheduleShooter, 2500 + Math.random() * 4500);
    }

    function loop() {
        t += 0.016;
        ctx.clearRect(0, 0, W, H);
        drawNebula();
        drawStars();
        drawShooters();
        requestAnimationFrame(loop);
    }

    resize(); initStars(); loop();
    setTimeout(scheduleShooter, 1200);

    window.addEventListener("resize", function() { resize(); initStars(); });

    new MutationObserver(function() {
        canvas.style.display = document.body.classList.contains("light-mode") ? "none" : "block";
    }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
});

// ==========================
// PAGE TRANSITIONS
// ==========================
const overlay = document.getElementById("pageOverlay");

function navigateTo(url) {
    if (!overlay) { window.location.href = url; return; }
    overlay.classList.add("show");
    setTimeout(function() { window.location.href = url; }, 380);
}

document.addEventListener("DOMContentLoaded", function() {
    // Fade in on load
    if (overlay) {
        overlay.classList.add("show");
        requestAnimationFrame(function() {
            requestAnimationFrame(function() { overlay.classList.remove("show"); });
        });
    }

    // Intercept all [data-page] links
    document.querySelectorAll("a[data-page]").forEach(function(link) {
        link.addEventListener("click", function(e) {
            const href = this.getAttribute("href");
            if (!href || href === "#" || href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel")) return;
            e.preventDefault();
            navigateTo(href);
        });
    });
});

// ==========================
// NAVBAR SCROLL
// ==========================
const navbar = document.getElementById("navbar");
if (navbar) {
    window.addEventListener("scroll", function() {
        navbar.classList.toggle("scrolled", window.scrollY > 50);
    });
}

// ==========================
// HAMBURGER
// ==========================
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("navLinks");
if (hamburger && navLinks) {
    hamburger.addEventListener("click", function() {
        hamburger.classList.toggle("open");
        navLinks.classList.toggle("open");
    });
    document.querySelectorAll(".nav-link").forEach(function(link) {
        link.addEventListener("click", function() {
            hamburger.classList.remove("open");
            navLinks.classList.remove("open");
        });
    });
}

// ==========================
// THEME TOGGLE
// ==========================
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
    // Force dark mode — reset any saved light preference
    localStorage.setItem("theme", "dark");
    document.body.classList.remove("light-mode");

    themeToggle.addEventListener("click", function() {
        document.body.classList.toggle("light-mode");
        const isLight = document.body.classList.contains("light-mode");
        themeToggle.querySelector("i").className = isLight ? "fa-solid fa-sun" : "fa-solid fa-moon";
        localStorage.setItem("theme", isLight ? "light" : "dark");
    });
}

// ==========================
// TYPING EFFECT (Home only)
// ==========================
const typingEl = document.getElementById("typingText");
if (typingEl) {
    const phrases = ["Networking 🌐","MikroTik ⚡","Linux Server 🐧","AWS Cloud ☁️","Zabbix Monitoring 📊"];
    let pi = 0, ci = 0, del = false;
    function typeEffect() {
        const cur = phrases[pi];
        typingEl.textContent = del ? cur.substring(0, ci-1) : cur.substring(0, ci+1);
        del ? ci-- : ci++;
        if (!del && ci === cur.length) { del = true; setTimeout(typeEffect, 2000); return; }
        if (del && ci === 0) { del = false; pi = (pi+1) % phrases.length; }
        setTimeout(typeEffect, del ? 55 : 95);
    }
    typeEffect();
}

// ==========================
// FOOTER YEAR
// ==========================
const footerYear = document.getElementById("footerYear");
if (footerYear) footerYear.innerHTML = "© " + new Date().getFullYear() + " Muhammad Rajib Syah Putra · SMK Wikrama Bogor - TJKT";

// ==========================
// COUNTER ANIMATION
// ==========================
function animateCounters() {
    document.querySelectorAll(".counter").forEach(function(counter) {
        const target = +counter.getAttribute("data-target");
        const step = target / (1800 / 16);
        let current = 0;
        (function update() {
            current += step;
            if (current < target) { counter.textContent = Math.ceil(current); requestAnimationFrame(update); }
            else { counter.textContent = target; }
        })();
    });
}

// ==========================
// SKILL BAR ANIMATION
// ==========================
function animateSkillBars() {
    document.querySelectorAll(".skill-fill").forEach(function(bar) {
        bar.style.width = bar.getAttribute("data-width") + "%";
    });
}

// ==========================
// REVEAL ON SCROLL
// ==========================
const revealEls = document.querySelectorAll(".reveal");
let countersAnimated = false, skillsAnimated = false;

function revealOnScroll() {
    const wh = window.innerHeight;
    revealEls.forEach(function(el) {
        if (el.getBoundingClientRect().top < wh - 70) el.classList.add("active");
    });
    const statsEl = document.querySelector(".stats-section");
    if (statsEl && !countersAnimated && statsEl.getBoundingClientRect().top < wh - 50) {
        countersAnimated = true; animateCounters();
    }
    const skillsEl = document.querySelector(".skills-grid");
    if (skillsEl && !skillsAnimated && skillsEl.getBoundingClientRect().top < wh - 50) {
        skillsAnimated = true; setTimeout(animateSkillBars, 200);
    }
}

window.addEventListener("scroll", revealOnScroll);
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(revealOnScroll, 100);
});

// ==========================
// PROJECT FILTER
// ==========================
document.addEventListener("DOMContentLoaded", function() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card[data-cat]");

    filterBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            filterBtns.forEach(function(b) { b.classList.remove("active"); });
            btn.classList.add("active");
            const filter = btn.getAttribute("data-filter");
            projectCards.forEach(function(card) {
                if (filter === "all" || card.getAttribute("data-cat") === filter) {
                    card.style.display = "flex";
                    card.style.animation = "pageEnter 0.4s ease both";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
});

// ==========================
// BACK TO TOP
// ==========================
const backToTop = document.getElementById("backToTop");
if (backToTop) {
    window.addEventListener("scroll", function() {
        backToTop.classList.toggle("visible", window.scrollY > 400);
    });
    backToTop.addEventListener("click", function() { window.scrollTo({ top:0, behavior:"smooth" }); });
}

// ==========================
// DOWNLOAD CV
// ==========================
const dlCV = document.getElementById("downloadCV");
if (dlCV) {
    dlCV.addEventListener("click", function(e) {
        e.preventDefault();
        alert("CV belum tersedia. Silakan hubungi langsung via kontak yang tertera.");
    });
}

// ==========================
// CONTACT FORM — biarkan submit ke FormSubmit
// ==========================
const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
        // Validasi dulu sebelum submit ke FormSubmit
        const namaField = contactForm.querySelector('[name="Nama"]');
        const emailField = contactForm.querySelector('[name="email"]');
        const pesanField = contactForm.querySelector('[name="Pesan"]');

        if (namaField && !namaField.value.trim()) {
            e.preventDefault();
            alert("Mohon isi nama terlebih dahulu.");
            return;
        }
        if (emailField && !emailField.value.trim()) {
            e.preventDefault();
            alert("Mohon isi email terlebih dahulu.");
            return;
        }
        if (pesanField && !pesanField.value.trim()) {
            e.preventDefault();
            alert("Mohon isi pesan terlebih dahulu.");
            return;
        }

        // Loading state
        const btn = contactForm.querySelector("button[type=submit]");
        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';
            btn.disabled = true;
        }
        // Biarkan form submit ke FormSubmit (tidak ada e.preventDefault())
    });
}

// ==========================
// PENDULUM STRING + CURSOR PHYSICS
// ==========================
(function pendulumInit() {
    const wrap    = document.getElementById("pendulumWrap");
    const bob     = document.getElementById("pendulumBob");
    const strCvs  = document.getElementById("stringCanvas");
    if (!wrap || !bob || !strCvs) return;

    const strCtx  = strCvs.getContext("2d");

    // --- Physics state ---
    let angle     = 0;      // current pendulum angle (radians from vertical)
    let angleVel  = 0;      // angular velocity
    const damping = 0.97;   // energy loss per frame
    const gravity = 0.004;  // gravity constant (tune for feel)
    const length  = 110;    // string length in px (visual)

    // Mouse influence
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let prevMouseX = mouseX;
    let isDragging = false;
    let dragStartAngle = 0;
    let dragStartMouseX = 0;

    // Anchor point (top of string) relative to wrap
    function getAnchorCenter() {
        const rect = wrap.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + 14 };
    }

    // --- Cursor tracking ---
    window.addEventListener("mousemove", function(e) {
        const dx = e.clientX - prevMouseX;
        prevMouseX = e.clientX;
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isDragging) {
            // Cursor proximity influence: push angle slightly toward cursor
            const anchor = getAnchorCenter();
            const relX = e.clientX - anchor.x;
            const relY = e.clientY - anchor.y;
            const dist = Math.sqrt(relX*relX + relY*relY);
            if (dist < 300) {
                const influence = (1 - dist/300) * 0.00015;
                angleVel += dx * influence;
            }
        } else {
            // Dragging: directly control angle
            const anchor = getAnchorCenter();
            const relX = e.clientX - anchor.x;
            const relY = Math.max(e.clientY - anchor.y, 10);
            angle = Math.atan2(relX, relY);
            angleVel = 0;
        }
    });

    // Touch support
    window.addEventListener("touchmove", function(e) {
        const touch = e.touches[0];
        const dx = touch.clientX - prevMouseX;
        prevMouseX = touch.clientX;
        const anchor = getAnchorCenter();
        const relX = touch.clientX - anchor.x;
        const influence = (1 - Math.min(Math.abs(relX)/300, 1)) * 0.0002;
        angleVel += dx * influence;
    }, { passive: true });

    // Drag to swing
    bob.addEventListener("mousedown", function(e) {
        isDragging = true;
        dragStartAngle = angle;
        dragStartMouseX = e.clientX;
        e.preventDefault();
    });

    window.addEventListener("mouseup", function() {
        if (isDragging) {
            isDragging = false;
            // release velocity based on last angle
            angleVel = angle * 0.08;
        }
    });

    // Click: give a little kick
    bob.addEventListener("click", function() {
        angleVel += (Math.random() - 0.5) * 0.08;
    });

    // --- Draw the string ---
    function drawString(bobAngle) {
        const cW = strCvs.width  = 220;
        const cH = strCvs.height = 130;
        strCtx.clearRect(0, 0, cW, cH);

        // Anchor dot
        const ax = cW / 2;
        const ay = 14;

        // Bob position (where string meets top of photo circle)
        const bx = ax + Math.sin(bobAngle) * length;
        const by = ay + Math.cos(bobAngle) * length;

        // Draw nail / pin
        strCtx.beginPath();
        strCtx.arc(ax, ay, 5, 0, Math.PI * 2);
        strCtx.fillStyle = "rgba(74,222,128,0.9)";
        strCtx.fill();
        strCtx.strokeStyle = "rgba(255,255,255,0.6)";
        strCtx.lineWidth = 1.5;
        strCtx.stroke();

        // Draw string with slight catenary curve
        const midX = (ax + bx) / 2 + Math.sin(bobAngle) * 8;
        const midY = (ay + by) / 2 + 10;

        const grad = strCtx.createLinearGradient(ax, ay, bx, by);
        grad.addColorStop(0, "rgba(74,222,128,0.9)");
        grad.addColorStop(0.5, "rgba(134,239,172,0.7)");
        grad.addColorStop(1, "rgba(74,222,128,0.5)");

        strCtx.beginPath();
        strCtx.moveTo(ax, ay);
        strCtx.quadraticCurveTo(midX, midY, bx, by);
        strCtx.strokeStyle = grad;
        strCtx.lineWidth = 2.5;
        strCtx.lineCap = "round";
        strCtx.stroke();

        // Small knot at bob end
        strCtx.beginPath();
        strCtx.arc(bx, by, 3.5, 0, Math.PI * 2);
        strCtx.fillStyle = "rgba(74,222,128,0.8)";
        strCtx.fill();
    }

    // --- Animation loop ---
    function physicsLoop() {
        if (!isDragging) {
            // Pendulum equation: α = -(g/L) * sin(θ)
            const alpha = -(gravity) * Math.sin(angle);
            angleVel += alpha;
            angleVel *= damping;
            angle    += angleVel;
            // Clamp max swing
            angle = Math.max(-0.7, Math.min(0.7, angle));
        }

        // Apply tilt to bob element
        const tiltDeg = angle * (180 / Math.PI);
        bob.style.transform = "rotate(" + tiltDeg + "deg)";

        // Counter-rotate badges to stay upright
        const badges = bob.querySelectorAll(".profile-badge");
        badges.forEach(function(b) {
            b.style.transform = "rotate(" + (-tiltDeg) + "deg)";
        });

        drawString(angle);
        requestAnimationFrame(physicsLoop);
    }

    // Gentle initial nudge so it starts swinging
    angleVel = 0.018;
    physicsLoop();
})();

// ==========================
// ABOUT PHOTO 3D TILT EFFECT
// ==========================
(function photoTiltInit() {
    const card  = document.getElementById("photoTiltCard");
    const shine = document.getElementById("photoShine");
    const hint  = document.querySelector(".photo-hint");
    if (!card) return;

    const MAX_TILT   = 22;   // max degrees tilt
    const SCALE_HOVER = 1.04;
    let raf = null;
    let targetRX = 0, targetRY = 0, currentRX = 0, currentRY = 0;
    let isHovered = false;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function applyTilt() {
        currentRX = lerp(currentRX, targetRX, 0.12);
        currentRY = lerp(currentRY, targetRY, 0.12);

        card.style.transform =
            "perspective(800px)" +
            " rotateX(" + currentRX + "deg)" +
            " rotateY(" + currentRY + "deg)" +
            " scale(" + (isHovered ? SCALE_HOVER : 1) + ")";

        // Move shine to follow cursor
        if (shine) {
            const shineX = 50 + currentRY * 1.5;
            const shineY = 50 - currentRX * 1.5;
            shine.style.background =
                "radial-gradient(circle at " + shineX + "% " + shineY + "%, " +
                "rgba(255,255,255,0.15), transparent 65%)";
        }

        if (Math.abs(currentRX - targetRX) > 0.05 || Math.abs(currentRY - targetRY) > 0.05) {
            raf = requestAnimationFrame(applyTilt);
        } else {
            raf = null;
        }
    }

    card.addEventListener("mousemove", function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width  / 2;
        const cy = rect.height / 2;
        // Normalized -1 to 1
        const nx = (x - cx) / cx;
        const ny = (y - cy) / cy;

        targetRY =  nx * MAX_TILT;
        targetRX = -ny * MAX_TILT;

        if (!raf) raf = requestAnimationFrame(applyTilt);
    });

    card.addEventListener("mouseenter", function() {
        isHovered = true;
        if (hint) hint.style.opacity = "0";
        if (!raf) raf = requestAnimationFrame(applyTilt);
    });

    card.addEventListener("mouseleave", function() {
        isHovered = false;
        targetRX = 0;
        targetRY = 0;
        if (hint) hint.style.opacity = "0.7";
        if (!raf) raf = requestAnimationFrame(applyTilt);
    });

    // Touch support
    card.addEventListener("touchmove", function(e) {
        const touch = e.touches[0];
        const rect  = card.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        const cx = rect.width  / 2;
        const cy = rect.height / 2;
        const nx = (x - cx) / cx;
        const ny = (y - cy) / cy;
        targetRY =  nx * MAX_TILT;
        targetRX = -ny * MAX_TILT;
        if (!raf) raf = requestAnimationFrame(applyTilt);
        e.preventDefault();
    }, { passive: false });

    card.addEventListener("touchend", function() {
        isHovered = false;
        targetRX = 0; targetRY = 0;
        if (!raf) raf = requestAnimationFrame(applyTilt);
    });

    // Gentle idle float when no hover
    let idleT = 0;
    function idleFloat() {
        if (!isHovered) {
            idleT += 0.012;
            targetRX = Math.sin(idleT) * 3;
            targetRY = Math.cos(idleT * 0.7) * 4;
            if (!raf) raf = requestAnimationFrame(applyTilt);
        }
        requestAnimationFrame(idleFloat);
    }
    idleFloat();
})();

// ==========================
// CUSTOM CURSOR (Home page only)
// ==========================
(function customCursor() {
    const dot  = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;

    window.addEventListener("mousemove", function(e) {
        mx = e.clientX; my = e.clientY;
        dot.style.left  = mx + "px";
        dot.style.top   = my + "px";
    });

    function animRing() {
        rx += (mx - rx) * 0.14;
        ry += (my - ry) * 0.14;
        ring.style.left = rx + "px";
        ring.style.top  = ry + "px";
        requestAnimationFrame(animRing);
    }
    animRing();

    // Hide on mouse leave
    document.addEventListener("mouseleave", function() {
        dot.style.opacity  = "0";
        ring.style.opacity = "0";
    });
    document.addEventListener("mouseenter", function() {
        dot.style.opacity  = "1";
        ring.style.opacity = "1";
    });
})();

// ==========================
// ACTIVE NAVBAR on scroll (single-page)
// ==========================
(function() {
    var secs = document.querySelectorAll("section[id]");
    var links = document.querySelectorAll(".nav-link");
    if (!secs.length) return;
    window.addEventListener("scroll", function() {
        var current = "";
        secs.forEach(function(s) {
            if (window.scrollY >= s.offsetTop - 180) current = s.getAttribute("id");
        });
        links.forEach(function(link) {
            var href = link.getAttribute("href");
            var isActive = href === "#" + current || href === current;
            link.classList.toggle("active", isActive);
        });
    });
})();
