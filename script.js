// Elemen DOM
const powerBtn = document.getElementById('powerBtn');
const oscillateBtn = document.getElementById('oscillateBtn');
const repairBtn = document.getElementById('repairBtn');
const btnPlus = document.getElementById('btnPlus');
const btnMinus = document.getElementById('btnMinus');
const stepInput = document.getElementById('stepInput');

const speedValueEl = document.getElementById('speedValue');
const speedDescEl = document.getElementById('speedDesc');
const speedKmhEl = document.getElementById('speedKmh');
const speedMphEl = document.getElementById('speedMph');

const fanHead = document.getElementById('fanHead');
const fanBlades = document.getElementById('fanBlades');

// Batas Kecepatan Angin Luar Angkasa (Angin Surya / Solar Wind ~ 1.000.000 Km/J)
const SPACE_WIND_LIMIT_KMH = 1000000;

// State Aplikasi
let isOn = false;
let isOscillating = false;
let isBroken = false;
let speed = 0;
let rotationAngle = 0;
let animationId = null;

// Fungsi Animasi
function animate() {
    if (isOn && speed > 0 && !isBroken) {
        const delta = Math.min(speed * 0.2 + 1, 45);
        rotationAngle = (rotationAngle + delta) % 360;
        fanBlades.style.transform = `rotate(${rotationAngle}deg)`;
        animationId = requestAnimationFrame(animate);
    }
}

// Fungsi Pembaruan Tampilan & Evaluasi Kondisi
function updateDisplay() {
    speedValueEl.textContent = speed;

    const kmh = speed * 0.5;
    const mph = kmh * 0.621371;

    speedKmhEl.textContent = kmh.toLocaleString('id-ID', { maximumFractionDigits: 2 });
    speedMphEl.textContent = mph.toLocaleString('id-ID', { maximumFractionDigits: 2 });

    // Pengecekan Kondisi Rusak (Melebihi Angin Luar Angkasa)
    if (kmh > SPACE_WIND_LIMIT_KMH && !isBroken) {
        triggerBreakdown();
        return;
    }

    if (isBroken) {
        speedDescEl.textContent = "💥 KIPAS RUSAK! (Melebihi Angin Luar Angkasa)";
        speedDescEl.classList.add('broken-text');
        return;
    }

    speedDescEl.classList.remove('broken-text');

    if (!isOn || speed === 0) {
        speedDescEl.textContent = "Kipas Mati";
    } else if (speed < 20) {
        speedDescEl.textContent = "Angin Sepoi-sepoi";
    } else if (speed < 50) {
        speedDescEl.textContent = "Angin Sedang";
    } else if (speed < 100) {
        speedDescEl.textContent = "Angin Kencang";
    } else if (speed < 500) {
        speedDescEl.textContent = "Taufan Dahsyat!";
    } else if (kmh <= SPACE_WIND_LIMIT_KMH) {
        speedDescEl.textContent = "Angin di turbin Jet!";
    }
}

// Fungsi Saat Kipas Rusak
function triggerBreakdown() {
    isBroken = true;
    isOn = false;
    isOscillating = false;

    if (animationId) cancelAnimationFrame(animationId);

    fanHead.classList.remove('oscillating');
    fanHead.classList.add('broken');

    powerBtn.textContent = 'Power: OFF';
    powerBtn.classList.remove('active');
    powerBtn.disabled = true;

    oscillateBtn.textContent = 'Muter Kepala: OFF';
    oscillateBtn.classList.remove('active');
    oscillateBtn.disabled = true;

    btnPlus.disabled = true;
    btnMinus.disabled = true;

    repairBtn.style.display = 'block';

    updateDisplay();
}

// Perbaiki Kipas
repairBtn.addEventListener('click', () => {
    isBroken = false;
    speed = 0;

    fanHead.classList.remove('broken');
    repairBtn.style.display = 'none';

    powerBtn.disabled = false;
    updateDisplay();
});

// Power On/Off
powerBtn.addEventListener('click', () => {
    if (isBroken) return;
    isOn = !isOn;

    if (isOn) {
        powerBtn.textContent = 'Power: ON';
        powerBtn.classList.add('active');
        if (speed === 0) speed = 1;
        btnPlus.disabled = false;
        btnMinus.disabled = false;
        oscillateBtn.disabled = false;
        animate();
    } else {
        powerBtn.textContent = 'Power: OFF';
        powerBtn.classList.remove('active');
        speed = 0;
        isOscillating = false;
        oscillateBtn.textContent = 'Muter Kepala: OFF';
        oscillateBtn.classList.remove('active');
        fanHead.classList.remove('oscillating');
        btnPlus.disabled = true;
        btnMinus.disabled = true;
        oscillateBtn.disabled = true;
        if (animationId) cancelAnimationFrame(animationId);
    }
    updateDisplay();
});

// Osilasi Kepala
oscillateBtn.addEventListener('click', () => {
    if (!isOn || isBroken) return;
    isOscillating = !isOscillating;

    if (isOscillating) {
        oscillateBtn.textContent = 'Muter Kepala: ON';
        oscillateBtn.classList.add('active');
        fanHead.classList.add('oscillating');
    } else {
        oscillateBtn.textContent = 'Muter Kepala: OFF';
        oscillateBtn.classList.remove('active');
        fanHead.classList.remove('oscillating');
    }
});

// Tambah Kecepatan
btnPlus.addEventListener('click', () => {
    if (!isOn || isBroken) return;
    const step = parseFloat(stepInput.value) || 1;
    speed += Math.abs(step);
    updateDisplay();
});

// Kurangi Kecepatan
btnMinus.addEventListener('click', () => {
    if (!isOn || isBroken) return;
    const step = parseFloat(stepInput.value) || 1;
    speed = Math.max(0, speed - Math.abs(step));
    updateDisplay();
});

// Inisialisasi awal
btnPlus.disabled = true;
btnMinus.disabled = true;
oscillateBtn.disabled = true;
updateDisplay();
