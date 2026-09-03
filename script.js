// Elemen DOM
const powerBtn = document.getElementById('powerBtn');
const oscillateBtn = document.getElementById('oscillateBtn');
const btnPlus = document.getElementById('btnPlus');
const btnMinus = document.getElementById('btnMinus');
const stepInput = document.getElementById('stepInput');

const speedValueEl = document.getElementById('speedValue');
const speedDescEl = document.getElementById('speedDesc');
const speedKmhEl = document.getElementById('speedKmh');
const speedMphEl = document.getElementById('speedMph');

const fanHead = document.getElementById('fanHead');
const fanBlades = document.getElementById('fanBlades');

// State Aplikasi
let isOn = false;
let isOscillating = false;
let speed = 0;
let rotationAngle = 0;
let animationId = null;

// Fungsi Animasi Putaran Baling-baling
function animate() {
    if (isOn && speed > 0) {
        // Kecepatan rotasi disesuaikan secara proporsional
        const delta = Math.min(speed * 0.2 + 1, 45);
        rotationAngle = (rotationAngle + delta) % 360;
        fanBlades.style.transform = `rotate(${rotationAngle}deg)`;
        animationId = requestAnimationFrame(animate);
    }
}

// Fungsi Pembaruan Tampilan
function updateDisplay() {
    speedValueEl.textContent = speed;

    // Kalkulasi Kecepatan Angin (1 unit = 0.5 Km/J)
    const kmh = speed * 0.5;
    const mph = kmh * 0.621371;

    speedKmhEl.textContent = kmh.toFixed(2);
    speedMphEl.textContent = mph.toFixed(2);

    // Evaluasi Deskripsi Angin
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
    } else {
        speedDescEl.textContent = "Angin di turbin Jet!";
    }
}

// Sakelar Power On/Off
powerBtn.addEventListener('click', () => {
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

// Sakelar Muter Kepala (Osilasi)
oscillateBtn.addEventListener('click', () => {
    if (!isOn) return;
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
    if (!isOn) return;
    const step = parseFloat(stepInput.value) || 1;
    speed += Math.abs(step);
    updateDisplay();
});

// Kurangi Kecepatan
btnMinus.addEventListener('click', () => {
    if (!isOn) return;
    const step = parseFloat(stepInput.value) || 1;
    speed = Math.max(0, speed - Math.abs(step));
    updateDisplay();
});

// Inisialisasi awal
btnPlus.disabled = true;
btnMinus.disabled = true;
oscillateBtn.disabled = true;
updateDisplay();

