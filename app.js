/**
 * ==========================================================================
 * SPIDER-VERSE MULTIVERSE PORTFOLIO ENGINE
 * Interactive Spider-Web Physics Canvas, Web Audio Synthesizer,
 * Card Stacking Physics & Spider-HUD Navigation
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initSpiderWebCanvas();
    initSpiderAudioSynth();
    init3DIslandParallax();
    initCardStackingEffect();
    initDynamicSunsetTracker();
    initInteractiveWebWall();
    initProjectModal();
    initTimelineCounters();
    initSpiderHUDDock();
    initTimelineSpiderScroll();
});

/* ==========================================================================
   1. WEB AUDIO SYNTHESIZER (THWIP & SPIDER-SFX)
   ========================================================================== */

let audioCtx = null;
let isAudioMuted = false;

function initSpiderAudioSynth() {
    const toggleBtn = document.getElementById('sound-toggle-btn');
    const statusText = document.getElementById('sound-status-text');
    const soundIcon = document.getElementById('sound-icon');

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    // Toggle Mute
    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isAudioMuted = !isAudioMuted;
            if (isAudioMuted) {
                toggleBtn.classList.add('muted');
                statusText.textContent = 'OFF';
                soundIcon.className = 'fa-solid fa-volume-xmark';
            } else {
                toggleBtn.classList.remove('muted');
                statusText.textContent = 'ON';
                soundIcon.className = 'fa-solid fa-spider';
                getAudioContext();
                playThwipSound();
            }
        });
    }

    // Attach click SFX to buttons & links
    document.querySelectorAll('button, a, .dock-item, .j-stat-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (!isAudioMuted) playHoverZapSound();
        });
        el.addEventListener('click', () => {
            if (!isAudioMuted && !el.id.includes('sound-toggle')) playThwipSound();
        });
    });
}

function playThwipSound() {
    if (isAudioMuted) return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const now = ctx.currentTime;

        // Pitch drop swoop (THWIP sound)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.15);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.15);
    } catch (e) {}
}

function playHoverZapSound() {
    if (isAudioMuted) return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.linearRampToValueAtTime(780, now + 0.06);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.06);
    } catch (e) {}
}

function playChimeSound() {
    if (isAudioMuted) return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const now = ctx.currentTime;

        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.value = freq;

            const startTime = now + (i * 0.06);
            gain.gain.setValueAtTime(0.12, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.35);
        });
    } catch (e) {}
}

/* ==========================================================================
   2. INTERACTIVE SPIDER-WEB PHYSICS CANVAS
   ========================================================================== */

function initSpiderWebCanvas() {
    const canvas = document.getElementById('spider-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const mouse = { x: width / 2, y: height / 2, active: false };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    // On Click: trigger web pulse
    const webPulses = [];
    window.addEventListener('click', (e) => {
        webPulses.push({
            x: e.clientX,
            y: e.clientY,
            radius: 5,
            maxRadius: 180,
            alpha: 0.8,
            color: Math.random() > 0.5 ? '#ef4444' : '#00f0ff'
        });
    });

    // Web nodes (Nodes in the multiverse space)
    const nodeCount = Math.floor((width * height) / 18000);
    const nodes = [];

    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.7,
            vy: (Math.random() - 0.5) * 0.7,
            radius: Math.random() * 2 + 1,
            color: Math.random() > 0.7 ? '#ef4444' : (Math.random() > 0.4 ? '#00f0ff' : '#a855f7')
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Render Web Pulses (from clicks)
        for (let i = webPulses.length - 1; i >= 0; i--) {
            const p = webPulses[i];
            p.radius += 6;
            p.alpha -= 0.025;

            if (p.alpha <= 0 || p.radius >= p.maxRadius) {
                webPulses.splice(i, 1);
                continue;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        // Update & Render Web Nodes & Web Strands
        for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];

            n.x += n.vx;
            n.y += n.vy;

            if (n.x < 0 || n.x > width) n.vx *= -1;
            if (n.y < 0 || n.y > height) n.vy *= -1;

            // Render node point
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
            ctx.fillStyle = n.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = n.color;
            ctx.fill();
            ctx.shadowBlur = 0;

            // Connect nearby nodes with delicate spider silk lines
            for (let j = i + 1; j < nodes.length; j++) {
                const n2 = nodes[j];
                const dx = n.x - n2.x;
                const dy = n.y - n2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 110) {
                    const alpha = (1 - dist / 110) * 0.35;
                    ctx.beginPath();
                    ctx.moveTo(n.x, n.y);
                    ctx.lineTo(n2.x, n2.y);
                    ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }

            // Connect mouse to nodes (Spider-Sense Web Shooting)
            if (mouse.active) {
                const mdx = n.x - mouse.x;
                const mdy = n.y - mouse.y;
                const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

                if (mDist < 160) {
                    const mAlpha = (1 - mDist / 160) * 0.7;
                    ctx.beginPath();
                    ctx.moveTo(mouse.x, mouse.y);
                    ctx.lineTo(n.x, n.y);
                    ctx.strokeStyle = `rgba(0, 240, 255, ${mAlpha})`;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   3. 3D ISLAND PARALLAX WITH WEB CORDS
   ========================================================================== */

function init3DIslandParallax() {
    const island = document.getElementById('hero-island');
    if (!island) return;

    const surface = island.querySelector('.island-surface');

    window.addEventListener('mousemove', (e) => {
        const xPct = (e.clientX / window.innerWidth - 0.5) * 2;
        const yPct = (e.clientY / window.innerHeight - 0.5) * 2;

        const rotateX = 18 - yPct * 16;
        const rotateY = -6 + xPct * 20;

        if (surface) {
            surface.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${yPct * 10}px)`;
        }
    });

    island.addEventListener('mouseleave', () => {
        if (surface) {
            surface.style.transform = 'rotateX(18deg) rotateY(-6deg) translateY(0px)';
        }
    });
}

/* ==========================================================================
   4. SHOWCASE DECK OF CARDS STACKING EFFECT (SMOOTH OVERLAY PHYSICS)
   ========================================================================== */

function initCardStackingEffect() {
    const cards = Array.from(document.querySelectorAll('.stack-card'));
    if (!cards.length) return;

    function updateCardStack() {
        const stickyTop = 130;

        cards.forEach((card, i) => {
            const rect = card.getBoundingClientRect();
            
            // Check cards that come AFTER this one to determine stacking overlay
            let stackDepth = 0;
            for (let j = i + 1; j < cards.length; j++) {
                const nextRect = cards[j].getBoundingClientRect();
                if (nextRect.top <= stickyTop + 30) {
                    stackDepth++;
                }
            }

            if (stackDepth > 0) {
                const scale = Math.max(0.88, 1 - (stackDepth * 0.035));
                const yShift = stackDepth * -8;
                const opacity = Math.max(0.7, 1 - (stackDepth * 0.1));
                
                card.style.transform = `translateY(${yShift}px) scale(${scale})`;
                card.style.opacity = `${opacity}`;
                card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.28), 4px 4px 0px #0f172a';
            } else {
                card.style.transform = 'translateY(0px) scale(1)';
                card.style.opacity = '1';
                if (rect.top <= stickyTop + 10) {
                    card.style.boxShadow = '0 20px 45px rgba(0, 0, 0, 0.18), 4px 4px 0px #0f172a';
                } else {
                    card.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.08), 4px 4px 0px #0f172a';
                }
            }
        });
    }

    window.addEventListener('scroll', updateCardStack, { passive: true });
    window.addEventListener('resize', updateCardStack, { passive: true });
    updateCardStack();
}

/* ==========================================================================
   4.1 DYNAMIC SCROLL-DRIVEN SUNSET (DAY TO NIGHT SKY TRANSITION)
   ========================================================================== */

function initDynamicSunsetTracker() {
    const showcaseSection = document.getElementById('projects');
    const sun = document.getElementById('dynamic-sun');
    if (!showcaseSection || !sun) return;

    function updateSunset() {
        const rect = showcaseSection.getBoundingClientRect();
        const sectionHeight = showcaseSection.offsetHeight;
        const windowHeight = window.innerHeight;

        const totalDistance = sectionHeight + windowHeight;
        const scrolled = windowHeight - rect.top;
        const progress = Math.min(Math.max(scrolled / totalDistance, 0), 1);

        // Translate the sun downward behind the deck of cards
        const yOffset = progress * 420;
        const scale = Math.max(0.65, 1 - progress * 0.35);

        sun.style.transform = `translateX(-50%) translateY(${yOffset}px) scale(${scale})`;

        // Dynamic Sky Gradient based on sunset progress
        if (progress < 0.35) {
            sun.style.filter = 'drop-shadow(0 0 35px rgba(245, 158, 11, 0.85))';
            showcaseSection.style.background = 'linear-gradient(180deg, #f0f9ff 0%, #ede9fe 50%, #1e1b4b 100%)';
        } else if (progress < 0.7) {
            sun.style.filter = 'drop-shadow(0 0 45px rgba(239, 68, 68, 0.95)) hue-rotate(-20deg)';
            showcaseSection.style.background = 'linear-gradient(180deg, #ede9fe 0%, #fed7aa 40%, #7c2d12 80%, #0f172a 100%)';
        } else {
            sun.style.filter = 'drop-shadow(0 0 50px rgba(168, 85, 247, 0.9)) hue-rotate(60deg) opacity(0.5)';
            showcaseSection.style.background = 'linear-gradient(180deg, #431407 0%, #2e1065 40%, #090d16 100%)';
        }
    }

    window.addEventListener('scroll', updateSunset, { passive: true });
    window.addEventListener('resize', updateSunset, { passive: true });
    updateSunset();
}

/* ==========================================================================
   5. INTERACTIVE STICKY WEB WALL ("LEAVE A WEB NOTE")
   ========================================================================== */

function initInteractiveWebWall() {
    const form = document.getElementById('sticky-note-form');
    const nameInput = document.getElementById('wall-name');
    const commentInput = document.getElementById('wall-comment');
    const postBtn = document.getElementById('btn-post-sticky');
    const leftFeed = document.getElementById('sticky-feed-left');
    const rightFeed = document.getElementById('sticky-feed-right');

    const pastelClasses = ['note-pink', 'note-yellow', 'note-green', 'note-blue', 'note-lavender'];

    function handlePostSticky() {
        const name = nameInput.value.trim();
        const comment = commentInput.value.trim();

        if (!name || !comment) {
            alert('Silakan isi nama dan pesan kamu dulu, bro!');
            return;
        }

        const note = document.createElement('div');
        const randomPastel = pastelClasses[Math.floor(Math.random() * pastelClasses.length)];
        const randomRot = (Math.random() * 6 - 3).toFixed(1);

        note.className = `sticky-note ${randomPastel}`;
        note.style.setProperty('--rot', `${randomRot}deg`);
        note.innerHTML = `
            <div class="note-time">just now 🕷️</div>
            <div class="note-author">@${name.replace(/^@/, '')}</div>
            <div class="note-content">"${comment}"</div>
        `;

        // Prepend alternately to left or right feed
        if (leftFeed && rightFeed) {
            if (leftFeed.children.length <= rightFeed.children.length) {
                leftFeed.prepend(note);
            } else {
                rightFeed.prepend(note);
            }
        }

        playChimeSound();
        nameInput.value = '';
        commentInput.value = '';

        // Flash button success feedback
        if (postBtn) {
            const originalHTML = postBtn.innerHTML;
            postBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>WEB STUCK ON WALL!</span>';
            postBtn.style.background = '#10b981';
            setTimeout(() => {
                postBtn.innerHTML = originalHTML;
                postBtn.style.background = '';
            }, 2000);
        }
    }

    if (postBtn) postBtn.addEventListener('click', handlePostSticky);
    if (commentInput) {
        commentInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                handlePostSticky();
            }
        });
    }
}

/* ==========================================================================
   6. JOURNEY KPI STAT COUNTERS
   ========================================================================== */

function initTimelineCounters() {
    const statCards = document.querySelectorAll('.j-stat-card');
    if (!statCards.length) return;

    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                statCards.forEach(card => {
                    const numberEl = card.querySelector('.j-stat-number');
                    if (!numberEl) return;

                    const target = parseFloat(numberEl.dataset.target || '0');
                    const decimals = parseInt(numberEl.dataset.decimals || '0');
                    const useComma = numberEl.dataset.format === 'comma';

                    animateCounter(numberEl, target, decimals, useComma, 1800);
                });
            }
        });
    }, { threshold: 0.25 });

    const journeySection = document.getElementById('journey');
    if (journeySection) observer.observe(journeySection);
}

function animateCounter(el, target, decimals, useComma, duration) {
    const startTime = performance.now();

    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        const currentVal = target * easeOutQuart;

        if (decimals > 0) {
            el.textContent = currentVal.toFixed(decimals);
        } else if (useComma) {
            el.textContent = Math.floor(currentVal).toLocaleString();
        } else {
            el.textContent = Math.floor(currentVal);
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (decimals > 0) el.textContent = target.toFixed(decimals);
            else if (useComma) el.textContent = target.toLocaleString();
            else el.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

/* ==========================================================================
   7. PROJECT DEEP-DIVE MODAL
   ========================================================================== */

function initProjectModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const contentBody = document.getElementById('modal-content-body');
    const triggerButtons = document.querySelectorAll('[data-project]');

    if (!modal || !contentBody) return;

    triggerButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = btn.getAttribute('data-project');
            const data = getProjectData(projectId);

            if (!data) return;

            contentBody.innerHTML = `
                <div style="display: inline-block; padding: 0.25rem 0.75rem; background: #fee2e2; border: 1.5px solid #ef4444; border-radius: 6px; font-family: 'Bangers', cursive; font-size: 0.9rem; color: #b91c1c; margin-bottom: 0.75rem;">
                    ${data.tag}
                </div>
                <h2 style="font-size: 1.85rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">${data.title}</h2>
                <div style="font-size: 0.95rem; font-weight: 700; color: #ef4444; margin-bottom: 1.5rem;">${data.subtitle}</div>

                <div style="margin-bottom: 1.75rem;">
                    <h4 style="font-size: 1rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">📐 System Architecture:</h4>
                    <p style="font-size: 0.95rem; color: #475569; line-height: 1.7;">${data.architecture}</p>
                </div>

                <div style="margin-bottom: 1.75rem;">
                    <h4 style="font-size: 1rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">⚡ Production Code Snippet:</h4>
                    <pre class="modal-code-block"><code>${escapeHtml(data.code)}</code></pre>
                </div>

                <div>
                    <h4 style="font-size: 1rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">📊 Real-World Metrics & Value:</h4>
                    <ul style="list-style-type: disc; padding-left: 1.25rem; font-size: 0.95rem; color: #475569; line-height: 1.8;">
                        ${data.metrics.map(m => `<li>${m}</li>`).join('')}
                    </ul>
                </div>
            `;

            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            playThwipSound();
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
}

function getProjectData(id) {
    const projects = {
        'riellybooth': {
            tag: 'LIVE WEB PHOTOBOOTH',
            title: 'RiellyBooth — Bikin Photo Strip? Tinggal Pose Aja 🖤',
            subtitle: 'Direct Browser Camera Capture, Live Coquette Ribbon Frame Compositor & Instant HD Download',
            architecture: 'Aplikasi web photobooth instan tanpa registrasi dan tanpa install aplikasi. Menggunakan HTML5 MediaDevices API untuk streaming kamera browser real-time, HTML5 Canvas 2D/WebGL untuk compositing frame Coquette Ribbon, auto-countdown jepret otomatis, dan export live photo berkualitas HD yang siap langsung dibagikan ke Instagram Story & TikTok.',
            code: `// RiellyBooth Live Canvas Photo Strip Compositor
async function captureAndComposePhotoStrip(videoElement, frameTheme = "coquette-ribbon") {
    const canvas = document.createElement("canvas");
    canvas.width = 1200; // High-Resolution 4-Strip Output
    canvas.height = 3600;
    const ctx = canvas.getContext("2d");

    // Render 4 sequential poses with auto-countdown
    for (let i = 0; i < 4; i++) {
        await triggerCountdown(3);
        playShutterSound();
        const yOffset = i * 850 + 60;
        ctx.drawImage(videoElement, 80, yOffset, 1040, 780);
    }

    // Apply aesthetic overlay frame & live photo watermark
    const frameImg = await loadAssetImage(\`/frames/\${frameTheme}.png\`);
    ctx.drawImage(frameImg, 0, 0, 1200, 3600);

    return canvas.toDataURL("image/png", 1.0);
}`,
            metrics: [
                '<strong>Live di <a href="https://riellybooth.my.id" target="_blank" style="color: #ef4444;">riellybooth.my.id</a>:</strong> Dipakai oleh ribuan pengunjung untuk foto strip estetik.',
                '<strong>100% Client-Side Fast Render:</strong> Hasil foto diproses langsung di browser tanpa server bottleneck.',
                '<strong>Viral Aesthetic:</strong> Dilengkapi frame tema Coquette Ribbon, live timer, dan mirror flipping.'
            ]
        },
        'rinciin': {
            tag: 'FINTECH & ACCOUNTING OS',
            title: 'Rinci.in — Catat Keuanganmu Semudah Kirim Pesan & Transaksi',
            subtitle: 'WhatsApp Bot Financial OS, Multi-Wallet Synchronization & Real-Time P&L Reporting',
            architecture: 'Platform pencatatan keuangan bisnis dan harian yang terintegrasi langsung dengan bot WhatsApp. Pengguna cukup kirim voice note ("beli kopi 25rb pake gopay"), teks transaksi, atau scan foto struk belanja. Sistem secara otomatis mengekstrak nominal, kategori, dan mengurangi saldo dompet terkait serta menyusun laporan laba rugi real-time.',
            code: `// Rinci.in WhatsApp Transaction Parsing & Ledger Processor
export async function processIncomingWhatsAppMessage(msgPayload) {
    const { fromPhone, messageType, content } = msgPayload;

    // Parse natural language or OCR receipt text
    const parsedTx = await AIParser.extractTransactionDetails(content, messageType);
    // { amount: 25000, type: "EXPENSE", category: "F&B", wallet: "GoPay" }

    // Update user's multi-pocket balance in PostgreSQL
    const updatedWallet = await Database.updateWalletBalance({
        userId: fromPhone,
        walletName: parsedTx.wallet,
        amount: parsedTx.amount,
        type: parsedTx.type
    });

    // Generate quick WhatsApp confirmation message with 7-day cashflow summary
    return await WhatsAppClient.sendReply(fromPhone, 
        \`[✓] Dicatat! \${parsedTx.category}: -Rp \${parsedTx.amount.toLocaleString()}\\n\` +
        \`Sisa Saldo \${parsedTx.wallet}: Rp \${updatedWallet.balance.toLocaleString()}\`
    );
}`,
            metrics: [
                '<strong>Live di <a href="https://rinciin.my.id" target="_blank" style="color: #ef4444;">rinciin.my.id</a>:</strong> Solusi pencatatan keuangan praktis tanpa ribet buka spreadsheet.',
                '<strong>Multi-Dompet Terintegrasi:</strong> Mendukung BCA, Mandiri, GoPay, OVO, ShopeePay, dan Cash.',
                '<strong>OCR & Voice Note Support:</strong> Deteksi pengeluaran instan dalam hitungan detik.'
            ]
        },
        'warkop-pos': {
            tag: 'F&B POS ECOSYSTEM',
            title: 'WarkopPOS — Cashier & Table Management System (V2.0)',
            subtitle: 'Tailored for Warkop 3 Hermanos with Quick Order, Table Occupancy & Stock Monitoring',
            architecture: 'Software kasir operasional Warkop 3 Hermanos berkecepatan tinggi. Mendukung tap kilat Quick Order, pemantauan meja terisi (0/9 meja), kasir pembayaran QRIS dinamis dan tunai, sistem peringatan bahan baku/menu menipis, pencatatan antrean order, dan pelacakan riwayat omzet harian.',
            code: `// WarkopPOS Quick Order & Table Dispatcher
export function handleQuickOrderCheckout(cartItems, tableNum, paymentMethod) {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const orderPayload = {
        orderId: \`POS-\${Date.now()}\`,
        table: tableNum || "Quick Order",
        items: cartItems,
        totalOmzet: subtotal,
        paymentMethod: paymentMethod, // Cash / QRIS Dinamis
        status: "DIPROSES",
        timestamp: new Date().toISOString()
    };

    // Save to local IndexedDB storage
    IndexedDBStore.orders.put(orderPayload);

    // Update active menu ingredients count
    cartItems.forEach(item => InventoryStore.deductStock(item.id, item.qty));

    return orderPayload;
}`,
            metrics: [
                '<strong>POS Online V2.0 Warkop 3 Hermanos:</strong> Dioptimalkan untuk alur kerja ritel kopi dan makanan cepat saji.',
                '<strong>Quick Order & Table Management:</strong> Kelola status 9 meja aktif secara visual.',
                '<strong>Stok & Omzet Real-Time:</strong> Monitoring bahan menipis dan grafik omzet harian.'
            ]
        },
        'sorot24': {
            tag: 'PORTAL MEDIA & WORDPRESS CMS',
            title: 'Sorot24.online — Portal Berita Nasional, Daerah & Realtime Terkini',
            subtitle: 'Custom WordPress Theme Engineering, Yoast SEO Optimization, RSS Feed Aggregator & Speed Caching',
            architecture: 'Portal media berita nasional berkecepatan tinggi yang dikembangkan menggunakan arsitektur custom WordPress theme (sorot24-theme). Terintegrasi dengan Yoast SEO Schema Graph untuk optimasi Google News, WP RSS Aggregator untuk sindikasi feed berita otomatis, asset minification, image containment & lazy loading, serta desain editorial yang 100% responsif di layar ponsel maupun desktop.',
            code: `// Sorot24 Custom WordPress Theme Query & Breaking News Stream
function render_sorot24_breaking_news_ticker() {
    $breaking_query = new WP_Query([
        'category_name'  => 'terkini,nasional',
        'posts_per_page' => 5,
        'post_status'    => 'publish',
        'no_found_rows'  => true, // Speed optimization
    ]);

    if ($breaking_query->have_posts()) :
        echo '<div class="sorot24-ticker-wrapper"><span class="ticker-badge">TERKINI:</span><div class="ticker-scroll">';
        while ($breaking_query->have_posts()) : $breaking_query->the_post();
            printf(
                '<a href="%s" class="ticker-item"><span class="time">[%s]</span> %s</a>',
                esc_url(get_permalink()),
                esc_html(get_the_time('H:i')),
                esc_html(wp_trim_words(get_the_title(), 12, '...'))
            );
        endwhile;
        echo '</div></div>';
        wp_reset_postdata();
    endif;
}`,
            metrics: [
                '<strong>Live di <a href="https://sorot24.online" target="_blank" style="color: #ef4444;">sorot24.online</a>:</strong> Portal media berita yang menyajikan berita nasional, daerah, politik, ekonomi, dan teknologi.',
                '<strong>High-Performance Theme:</strong> Kustomisasi tema independen (sorot24-theme) dengan font Inter & FontAwesome 6.',
                '<strong>SEO & Social Sharing Ready:</strong> Terintegrasi Yoast SEO v28+ schema graph dan widget sharing AddToAny instan.'
            ]
        }
    };
    return projects[id];
}

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/* ==========================================================================
   8. SPIDER-HUD FLOATING DOCK SCROLLSPY
   ========================================================================== */

function initSpiderHUDDock() {
    const dockItems = document.querySelectorAll('.dock-item');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            dockItems.forEach(item => {
                if (item.getAttribute('data-section') === currentSectionId) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    });
}

/* ==========================================================================
   9. TIMELINE SPIDER-SENSE SCROLL CRAWLER ANIMATION
   ========================================================================== */

function initTimelineSpiderScroll() {
    const timelineContainer = document.getElementById('timeline-container');
    const spiderCrawler = document.getElementById('timeline-spider-crawler');
    const silkLine = document.getElementById('timeline-silk-line');
    const dots = document.querySelectorAll('.timeline-dot');

    if (!timelineContainer || !spiderCrawler) return;

    let lastProgress = 0;

    function onTimelineScroll() {
        const rect = timelineContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Start scrolling spider when top of timeline reaches 45% of viewport
        const triggerPoint = windowHeight * 0.45;
        const scrollDist = triggerPoint - rect.top;
        const totalDist = rect.height;

        let progress = scrollDist / totalDist;
        progress = Math.max(0, Math.min(1, progress));

        const percentage = progress * 100;
        spiderCrawler.style.top = `${percentage}%`;
        if (silkLine) {
            silkLine.style.height = `${percentage}%`;
        }

        // Trigger milestone dot ripples and SFX when spider reaches milestones
        dots.forEach(dot => {
            const dotRect = dot.getBoundingClientRect();
            const spiderRect = spiderCrawler.getBoundingClientRect();
            const distance = Math.abs(dotRect.top - spiderRect.top);

            if (distance < 40) {
                if (!dot.classList.contains('active-glow')) {
                    dot.classList.add('active-glow');
                    if (typeof playHoverZapSound === 'function') {
                        playHoverZapSound();
                    }
                }
            } else if (spiderRect.top > dotRect.top + 20) {
                dot.classList.add('passed-glow');
                dot.classList.remove('active-glow');
            } else {
                dot.classList.remove('active-glow');
                dot.classList.remove('passed-glow');
            }
        });

        lastProgress = progress;
    }

    window.addEventListener('scroll', onTimelineScroll, { passive: true });
    window.addEventListener('resize', onTimelineScroll, { passive: true });
    onTimelineScroll();
}

