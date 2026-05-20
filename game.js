// --- نظام مكافحة الغش (Anti-Cheat) الشامل ---
let checkDeaths = parseInt(localStorage.getItem('bluedevil_deaths')) || 0;
let checkTime = parseInt(localStorage.getItem('bluedevil_time')) || 0;
let checkUnlocked = 0;

// حساب عدد المستويات المحلولة في الميموار
for(let i = 1; i <= 40; i++) {
    if(localStorage.getItem(`bluedevil_${i}`) === 'true') checkUnlocked++;
}

let expectedHash = (checkDeaths * 5) + (checkTime * 3) + (checkUnlocked * 7);
let currentHash = parseInt(localStorage.getItem('bluedevil_hash'));

if ((checkDeaths > 0 || checkTime > 0 || checkUnlocked > 0) && currentHash !== expectedHash) {
    alert("😈 بغيتي تحل المستويات بالغش ياك؟ \nالعقاب ديال الغشاشين هو الرجوع للزيرو!");
    localStorage.clear();
    location.reload();
}

// دالة التشفير الموحدة
function updateSecurityHash() {
    let unlockedLevels = 0;
    for(let i = 1; i <= 40; i++) {
        if(localStorage.getItem(`bluedevil_${i}`) === 'true') unlockedLevels++;
    }
    let hash = (deathsCount * 5) + (totalPlayTime * 3) + (unlockedLevels * 7);
    localStorage.setItem('bluedevil_hash', hash);
}
// -------------------------------------

// --- 1. إعدادات الواجهة والصوت والترجمة ---
function switchScreen(id) {
    playSound('click'); 
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(id === 'levels-screen') renderLevelButtons();
}

function enterGameMode() {
    playSound('click');
    try {
        let elem = document.documentElement;
        if (elem.requestFullscreen) elem.requestFullscreen().catch(e => console.log(e));
        if (screen.orientation && screen.orientation.lock) screen.orientation.lock("landscape").catch(e => console.log(e));
    } catch(e) {}
    switchScreen('levels-screen');
}

function exitGameMode() {
    playSound('click');
    document.getElementById('game-layer').style.display = 'none'; 
    document.getElementById('ui-layer').style.display = 'block';
    if (gameActive) {
        totalPlayTime += Math.floor((Date.now() - sessionStartTime) / 1000);
        localStorage.setItem('bluedevil_time', totalPlayTime);
        updateSecurityHash(); // التحديث الأمني عند الخروج
    }
    gameActive = false; 
    cancelAnimationFrame(animFrameId);
    try { if (document.exitFullscreen) document.exitFullscreen().catch(e=>console.log(e)); } catch(e){}
    switchScreen('levels-screen');
}

// قاموس الترجمة المحدث والنظيف
const i18n = {
    ar: { 
        title: "Blue Devil 😈", 
        play: "تشغيل اللعبة ▶️", 
        settings: "الإعدادات ⚙️", 
        set_title: "الإعدادات ⚙️", 
        vol: "مستوى الصوت", 
        back: "رجوع", 
        lvl_title: "اختر المستوى", 
        level: "المستوى", 
        exit: "خروج 🚪", 
        ads: "إزالة الإعلانات 🚫", 
        dev: "تطوير",
        gameCompleteTitle: "🎉 ألف مبروك يا بطل! 🎉",
        gameCompleteDesc: "لقد أنهيت جميع المستويات الـ 40 بنجاح! نعتذر بشدة إذا كنا سبباً في ارتفاع ضغط دمك أو رغبتك في تكسير الهاتف، لكنك أثبتّ أنك أسطورة في الصبر والذكاء.",
        totalDeaths: "عدد مرات موتك الكلية: ",
        returnMenu: "العودة للقائمة الرئيسية"
    },
    en: { 
        title: "Blue Devil 😈", 
        play: "Play Game ▶️", 
        settings: "Settings ⚙️", 
        set_title: "Settings ⚙️", 
        vol: "Volume Level", 
        back: "Back", 
        lvl_title: "Select Level", 
        level: "Level", 
        exit: "Exit 🚪", 
        ads: "🚫 Remove Ads", 
        dev: "Developed by",
        gameCompleteTitle: "🎉 Congratulations, Champion! 🎉",
        gameCompleteDesc: "You have successfully completed all 40 levels! We sincerely apologize if we caused a spike in your blood pressure or the urge to smash your phone, but you've proven to be a legend of patience and skill.",
        totalDeaths: "Total Deaths: ",
        returnMenu: "Return to Main Menu"
    }
};

let currentLang = 'ar';

function setLang(lang, btnElement) {
    currentLang = lang;
    
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    const uiMap = {
        'txt-title': 'title',
        'btn-play-ui': 'play',         
        'btn-settings-ui': 'settings', 
        'txt-set-title': 'set_title',
        'btn-back': 'back',          
        'btn-back-ui': 'back',
        'txt-back': 'back',
        'txt-back-lvl': 'back',
        'btn-back-levels':'back',
        'btn-back-settings':'back',
        'txt-lvl-title': 'lvl_title',
        'txt-level': 'level',
        
        'txt-complete-title': 'gameCompleteTitle',
        'txt-complete-desc': 'gameCompleteDesc',
        'txt-total-deaths': 'totalDeaths',
        'btn-return-menu': 'returnMenu'
    };

    for (let id in uiMap) {
        let el = document.getElementById(id);
        let dictKey = uiMap[id];
        if (el && i18n[lang][dictKey]) {
            el.innerText = i18n[lang][dictKey];
        }
    }

    let exitBtn = document.getElementById('btn-exit-game');
    if (exitBtn) exitBtn.innerText = i18n[lang].exit;

    let adsBtn = document.getElementById('remove-ads-btn');
    if (adsBtn) adsBtn.innerText = i18n[lang].ads;

    let devTxt = document.getElementById('txt-dev-by');
    if (devTxt) devTxt.innerHTML = i18n[lang].dev + " <span>Ibrahim</span>";

    let volSlider = document.getElementById('volume-slider');
    if (volSlider) updateVolume(volSlider.value);
}

let audioCtx, globalVolume = 0.5;
function updateVolume(val) { 
    globalVolume = parseFloat(val); 
    document.getElementById('txt-volume').innerText = `${i18n[currentLang].vol}: ${Math.round(val * 100)}%`; 
    playSound('click'); 
}

function playSound(type) {
    try {
        if (globalVolume === 0) return; 
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 
        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        const osc = audioCtx.createOscillator(), gain = audioCtx.createGain(); 
        osc.connect(gain); gain.connect(audioCtx.destination);
        
        if (type === 'click') { osc.type = 'sine'; osc.frequency.setValueAtTime(400, audioCtx.currentTime); gain.gain.setValueAtTime(globalVolume, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1); osc.start(); osc.stop(audioCtx.currentTime + 0.1); } 
        else if (type === 'jump') { osc.type = 'square'; osc.frequency.setValueAtTime(150, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.15); gain.gain.setValueAtTime(globalVolume * 0.3, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15); osc.start(); osc.stop(audioCtx.currentTime + 0.15); } 
        else if (type === 'death') { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.4); gain.gain.setValueAtTime(globalVolume, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4); osc.start(); osc.stop(audioCtx.currentTime + 0.4); } 
        else if (type === 'win') { osc.type = 'sine'; osc.frequency.setValueAtTime(500, audioCtx.currentTime); osc.frequency.setValueAtTime(800, audioCtx.currentTime + 0.2); gain.gain.setValueAtTime(globalVolume, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4); osc.start(); osc.stop(audioCtx.currentTime + 0.4); }
    } catch(e) {}
}

// --- 2. محرك اللعبة والفيزياء ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let currentLevelIndex = 0, deathsCount = parseInt(localStorage.getItem('bluedevil_deaths')) || 0, gameActive = false, animFrameId, portalAngle = 0;
const keys = { left: false, right: false, jump: false };
let player = { x: 50, y: 300, w: 24, h: 24, vx: 0, vy: 0, isJumping: false };
let totalPlayTime = parseInt(localStorage.getItem('bluedevil_time')) || 0;
let sessionStartTime = 0;

function startGame(idx) { 
    playSound('click'); 
    document.getElementById('ui-layer').style.display = 'none'; 
    document.getElementById('game-layer').style.display = 'flex'; 
    sessionStartTime = Date.now();
    loadLevel(idx);
    
    if(!gameActive) {
        gameActive = true;
        animFrameId = requestAnimationFrame(gameLoop);
    }
}

function renderLevelButtons() {
    const container = document.getElementById('level-buttons-container'); 
    if(!container) return;
    container.innerHTML = '';
    for (let i = 0; i < levels.length; i++) {
        const btn = document.createElement('button'); 
        btn.className = 'lvl-btn ' + (i === 0 || localStorage.getItem(`bluedevil_${i}`) === 'true' ? 'unlocked' : 'locked');
        btn.innerText = (btn.classList.contains('unlocked')) ? i + 1 : '🔒';
        if(btn.classList.contains('unlocked')) btn.onclick = () => startGame(i);
        container.appendChild(btn);
    }
}

function loadLevel(idx) {
    currentLevelIndex = idx; 
    currentLevel = JSON.parse(JSON.stringify(levels[idx])); 
    currentLevel.trap = levels[idx].trap; 
    
    let lblLvl = document.getElementById('lbl-lvl');
    if(lblLvl) lblLvl.innerText = idx + 1; 
    
    let lblDeath = document.getElementById('lbl-death');
    if(lblDeath) lblDeath.innerText = deathsCount;

    player.x = 50; player.y = 300; player.vx = 0; player.vy = 0; player.isJumping = false;
    keys.left = keys.right = keys.jump = false; 
}

function die() { 
    playSound('death'); 
    deathsCount++; 
    totalPlayTime += Math.floor((Date.now() - sessionStartTime) / 1000);
    
    updateSecurityHash(); // التحديث الأمني عند الموت
    
    localStorage.setItem('bluedevil_time', totalPlayTime);
    sessionStartTime = Date.now(); 
    localStorage.setItem('bluedevil_deaths', deathsCount);
    loadLevel(currentLevelIndex); 
}

function updatePhysics() {
    let moveLeft = currentLevel.reversed ? keys.right : keys.left;
    let moveRight = currentLevel.reversed ? keys.left : keys.right;

    if (moveLeft) player.vx = -5; 
    else if (moveRight) player.vx = 5; 
    else player.vx = 0;
    
    let isHeavy = currentLevelIndex === 14;
    let gravity = (keys.jump && player.vy < 0) ? (isHeavy ? 0.2 : 0.4) : (isHeavy ? 1.5 : 0.9);
  
    player.vy += gravity; player.x += player.vx; player.y += player.vy;

    if(currentLevel.trap) currentLevel.trap(player);

    currentLevel.platforms.forEach(p => {
        if (player.x + player.w > p.x && player.x < p.x + p.w && player.y + player.h >= p.y && player.y + player.h <= p.y + 20 && player.vy >= 0) {
            player.y = p.y - player.h; player.vy = 0; player.isJumping = false;
        }
    });

    if(currentLevel.invisibleBridge) {
        let b = currentLevel.invisibleBridge;
        if (player.x + player.w > b.x && player.x < b.x + b.w && player.y + player.h >= b.y && player.y + player.h <= b.y + 20 && player.vy >= 0) {
            player.y = b.y - player.h; player.vy = 0; player.isJumping = false;
        }
    }

    if(currentLevel.hiddenBlocks) {
        currentLevel.hiddenBlocks.forEach(b => {
            if (!b.visible && player.vy < 0 && player.y < b.y + b.h && player.y > b.y && player.x + player.w > b.x && player.x < b.x + b.w) {
                b.visible = true; player.vy = 0; 
            }
            if (b.visible && player.x + player.w > b.x && player.x < b.x + b.w && player.y + player.h >= b.y && player.y + player.h <= b.y + 20 && player.vy >= 0) {
                player.y = b.y - player.h; player.vy = 0; player.isJumping = false;
            }
        });
    }

    if (player.y > canvas.height) { die(); return; }

    let isDead = false;
    currentLevel.spikes.forEach(s => {
        if(!s.isButton) {
            if (player.x + player.w > s.x + 5 && player.x < s.x + s.w - 5 && player.y + player.h > s.y + 5 && player.y < s.y + s.h - 2) isDead = true;
        }
    });
    
    if(isDead) { die(); return; }

    let d = currentLevel.portal;
    if (d.visible !== false && player.x + player.w > d.x && player.x < d.x + d.w && player.y + player.h > d.y && player.y < d.y + d.h) {
        playSound('win'); 
        let next = currentLevelIndex + 1;
        if (next < levels.length) { 
            localStorage.setItem(`bluedevil_${next}`, 'true'); 
            updateSecurityHash(); // التحديث الأمني عند فتح مستوى جديد
            loadLevel(next); 
            return;
        } else { 
            // شاشة الفوز النهائية
            document.getElementById('game-layer').style.display = 'none';
            document.getElementById('ui-layer').style.display = 'block';
            
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            let victoryScreen = document.getElementById('victory-screen');
            if (victoryScreen) {
                victoryScreen.classList.add('active');
                
                let finalDeaths = document.getElementById('final-deaths');
                if(finalDeaths) finalDeaths.innerText = deathsCount; 
                
                totalPlayTime += Math.floor((Date.now() - sessionStartTime) / 1000);
                localStorage.setItem('bluedevil_time', totalPlayTime);
                
                updateSecurityHash(); // التحديث الأمني النهائي

                let minutes = Math.floor(totalPlayTime / 60);
                let seconds = totalPlayTime % 60;
                let finalTime = document.getElementById('final-time');
                if(finalTime) finalTime.innerText = `${minutes}m ${seconds}s`;

                let finalRank = document.getElementById('final-rank');
                if(finalRank) {
                    if (deathsCount < 10) finalRank.innerText = (currentLang === 'ar') ? 'أسطورة 👑' : 'Legend 👑';
                    else if (deathsCount <= 20) finalRank.innerText = (currentLang === 'ar') ? 'محترف 🥷' : 'Pro 🥷';
                    else finalRank.innerText = (currentLang === 'ar') ? 'مبتدئ 🤡' : 'Noob 🤡';
                }

                document.getElementById('txt-total-time').innerText = (currentLang === 'ar') ? "الوقت المستغرق: " : "Time Taken: ";
                document.getElementById('txt-rank').innerText = (currentLang === 'ar') ? "اللقب: " : "Rank: ";
            }
            
            gameActive = false; 
            cancelAnimationFrame(animFrameId);
            try { if (document.exitFullscreen) document.exitFullscreen().catch(e=>console.log(e)); } catch(e){}
            return;
        } 
    }
} 

function drawPortal(d, isFake) {
    if (d.visible === false) return;
    ctx.save(); ctx.translate(d.x + d.w/2, d.y + d.h/2); portalAngle += 0.05; ctx.rotate(portalAngle);
    for(let i=0; i<4; i++) {
        ctx.strokeStyle = isFake ? (i%2===0 ? '#ef4444' : '#000000') : (i%2===0 ? '#d946ef' : '#8b5cf6');
        ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 25 - (i*5), 0, Math.PI * 2 * 0.85); ctx.stroke();
    }
    ctx.restore();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawPortal(currentLevel.portal, false);
    if(currentLevel.fakePortal) drawPortal(currentLevel.fakePortal, true);
    if(currentLevel.fakePortal2) drawPortal(currentLevel.fakePortal2, true);
    if(currentLevel.fakePortal3) drawPortal(currentLevel.fakePortal3, true);

    ctx.fillStyle = '#000000'; 
    currentLevel.platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));
    
    if(currentLevel.hiddenBlocks) {
        currentLevel.hiddenBlocks.forEach(b => {
            if (b.visible) { ctx.fillStyle = '#000000'; ctx.fillRect(b.x, b.y, b.w, b.h); ctx.strokeStyle = '#ffffff'; ctx.strokeRect(b.x, b.y, b.w, b.h); }
        });
    }

    ctx.fillStyle = '#000000';
    currentLevel.spikes.forEach(s => {
        if(s.isButton) { ctx.fillStyle = '#ef4444'; ctx.fillRect(s.x, s.y, s.w, s.h); ctx.fillStyle = '#000000'; }
        else {
            let spikeWidth = 20; let count = Math.floor(s.w / spikeWidth);
            for(let i=0; i<count; i++) {
                ctx.beginPath(); ctx.moveTo(s.x + (i*spikeWidth), s.y + s.h);
                ctx.lineTo(s.x + (i*spikeWidth) + spikeWidth/2, s.y);
                ctx.lineTo(s.x + (i*spikeWidth) + spikeWidth, s.y + s.h); ctx.fill();
            }
        }
    });

    if(currentLevel.fakeSpikes) {
        ctx.fillStyle = '#000000';
        currentLevel.fakeSpikes.forEach(s => {
            let spikeWidth = 20; let count = Math.floor(s.w / spikeWidth);
            for(let i=0; i<count; i++) {
                ctx.beginPath(); ctx.moveTo(s.x + (i*spikeWidth), s.y + s.h);
                ctx.lineTo(s.x + (i*spikeWidth) + spikeWidth/2, s.y);
                ctx.lineTo(s.x + (i*spikeWidth) + spikeWidth, s.y + s.h); ctx.fill();
            }
        });
    }

    ctx.fillStyle = '#0f172a'; ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.fillStyle = '#ffffff';
    let moveLeft = currentLevel.reversed ? keys.right : keys.left;
    let moveRight = currentLevel.reversed ? keys.left : keys.right;
    let eyeX = moveLeft ? 2 : moveRight ? 12 : 7;
    ctx.fillRect(player.x + eyeX, player.y + 4, 4, 4); ctx.fillRect(player.x + eyeX + 8, player.y + 4, 4, 4);
}

function gameLoop() { 
    if(!gameActive) return; 
    updatePhysics(); 
    drawGame(); 
    animFrameId = requestAnimationFrame(gameLoop); 
}

// --- 3. تشغيل الأحداث والأزرار ---
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-play-ui').addEventListener('click', enterGameMode);
    document.getElementById('btn-settings-ui').addEventListener('click', () => switchScreen('settings-screen'));
    document.getElementById('btn-back-settings').addEventListener('click', () => switchScreen('menu-screen'));
    document.getElementById('btn-back-levels').addEventListener('click', () => switchScreen('menu-screen'));
    document.getElementById('btn-exit-game').addEventListener('click', exitGameMode);
    
    document.getElementById('btn-lang-ar').addEventListener('click', function() { setLang('ar', this); });
    document.getElementById('btn-lang-en').addEventListener('click', function() { setLang('en', this); });
    document.getElementById('volume-slider').addEventListener('input', function(e) { updateVolume(e.target.value); });

    const btnL = document.getElementById('btn-left'), btnR = document.getElementById('btn-right'), btnJ = document.getElementById('btn-jump');
    
    const startL = (e) => { e.preventDefault(); keys.left = true; }; const endL = (e) => { e.preventDefault(); keys.left = false; };
    const startR = (e) => { e.preventDefault(); keys.right = true; }; const endR = (e) => { e.preventDefault(); keys.right = false; };
    const startJ = (e) => { e.preventDefault(); keys.jump = true; if(!player.isJumping) { player.vy = -12.5; player.isJumping = true; playSound('jump'); } };
    const endJ = (e) => { e.preventDefault(); keys.jump = false; };

    btnL.addEventListener('touchstart', startL, {passive:false}); btnL.addEventListener('touchend', endL); btnL.addEventListener('mousedown', startL); btnL.addEventListener('mouseup', endL);
    btnR.addEventListener('touchstart', startR, {passive:false}); btnR.addEventListener('touchend', endR); btnR.addEventListener('mousedown', startR); btnR.addEventListener('mouseup', endR);
    btnJ.addEventListener('touchstart', startJ, {passive:false}); btnJ.addEventListener('touchend', endJ); btnJ.addEventListener('mousedown', startJ); btnJ.addEventListener('mouseup', endJ);

    renderLevelButtons();
});
