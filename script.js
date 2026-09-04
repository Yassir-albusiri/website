// ===========================
// SECTION NAVIGATION
// ===========================
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    if (sectionId === 'success-screen') {
        sendWhatsAppMessage();
    }
}

// ===========================
// EVASIVE "NO" BUTTON LOGIC
// ===========================
const noButtonTexts = ["No", "Are you sure, babe?", "Really?", "You're breaking my heart!", "Last chance, my love!"];
let noButtonClickCount = 0;
const noButton = document.getElementById('no-button');

function evadeNoButton() {
    noButtonClickCount++;
    noButton.textContent = noButtonTexts[noButtonClickCount % noButtonTexts.length];
    
    noButton.style.position = 'fixed';
    noButton.style.zIndex = '9999';
    
    const btnWidth = noButton.offsetWidth;
    const btnHeight = noButton.offsetHeight;
    const maxX = window.innerWidth - btnWidth - 20;
    const maxY = window.innerHeight - btnHeight - 20;
    
    const randomX = Math.max(20, Math.random() * maxX);
    const randomY = Math.max(20, Math.random() * maxY);
    
    noButton.style.left = randomX + 'px';
    noButton.style.top = randomY + 'px';
}

if (noButton) {
    noButton.addEventListener('mouseover', evadeNoButton);
    noButton.addEventListener('touchstart', function(e) {
        e.preventDefault(); 
        evadeNoButton();
    });
}

// ===========================
// ACTIVITY SELECTION
// ===========================
let selectedActivity = '';

function selectActivity(activity) {
    selectedActivity = activity;
    showModal();
}

function showCustomActivityInput() {
    document.querySelector('.activity-buttons').classList.add('hidden');
    document.getElementById('custom-activity-section').classList.remove('hidden');
    document.getElementById('custom-activity-input').focus();
}

function submitCustomActivity() {
    const input = document.getElementById('custom-activity-input').value.trim();
    if (input) {
        selectedActivity = input;
        showModal();
    } else {
        alert('Please tell me what you\'d like to do! 💕');
    }
}

// ===========================
// SCHEDULING MODAL (Dates & Times)
// ===========================
let selectedDate = '';
let selectedTime = '';

const dates = [
    { label: 'Sep 4 (Today)', value: 'Sep 4' },
    { label: 'Sep 5 (Tomorrow)', value: 'Sep 5' },
    { label: 'Sep 6', value: 'Sep 6' },
    { label: 'Sep 7', value: 'Sep 7' },
    { label: 'Sep 8', value: 'Sep 8' },
    { label: 'Sep 9', value: 'Sep 9' },
    { label: 'Sep 10 (Birthday Girl 🎂)', value: 'Sep 10' },
    { label: 'Sep 11', value: 'Sep 11' },
    { label: 'Sep 12', value: 'Sep 12' }
];

function showModal() {
    document.getElementById('time-grid').classList.add('hidden');
    document.getElementById('back-button').classList.add('hidden');
    document.getElementById('date-grid').classList.remove('hidden');
    
    const dateGrid = document.getElementById('date-grid');
    dateGrid.innerHTML = '';
    
    dates.forEach(date => {
        const btn = document.createElement('button');
        btn.className = 'btn-date';
        btn.textContent = date.label;
        btn.onclick = () => selectDate(date.value);
        dateGrid.appendChild(btn);
    });
    
    document.getElementById('scheduling-modal').classList.add('active');
}

function generateTimeSlots() {
    const times = [];
    let hour = 15; // 3 PM
    let minute = 0;
    
    for (let i = 0; i <= 24; i++) { 
        let displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        let ampm = hour >= 12 && hour < 24 ? 'PM' : 'AM';
        
        times.push(`${displayHour}:${minute === 0 ? '00' : '30'} ${ampm}`);
        
        minute += 30;
        if (minute === 60) {
            minute = 0;
            hour++;
        }
        if (hour === 24) hour = 0; 
    }
    return times;
}

function selectDate(date) {
    selectedDate = date;
    document.getElementById('date-grid').classList.add('hidden');
    
    const timeGrid = document.getElementById('time-grid');
    timeGrid.innerHTML = '';
    timeGrid.classList.remove('hidden');
    document.getElementById('back-button').classList.remove('hidden');
    
    const times = generateTimeSlots();
    times.forEach(time => {
        const btn = document.createElement('button');
        btn.className = 'btn-time';
        btn.textContent = time;
        btn.onclick = () => selectTime(time);
        timeGrid.appendChild(btn);
    });
}

function selectTime(time) {
    selectedTime = time;
    document.getElementById('scheduling-modal').classList.remove('active');
    showSection('success-screen');
}

function goBackToDateSelection() {
    document.getElementById('time-grid').classList.add('hidden');
    document.getElementById('back-button').classList.add('hidden');
    document.getElementById('date-grid').classList.remove('hidden');
}

// ===========================
// WHATSAPP INTEGRATION & SAFARI FIX
// ===========================
function buildWhatsAppUrl() {
    const phoneNumber = '966533556031';
    const message = `Hey babe! I said YES to our date! ❤️ We are doing ${selectedActivity} on ${selectedDate} at ${selectedTime}. Love you!`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

function sendWhatsAppMessage() {
    const whatsappUrl = buildWhatsAppUrl();
    
    // محاولة التوجيه التلقائي المباشر (Redirect) لتفادي سياسات مانع الإعلانات
    setTimeout(() => {
        window.location.href = whatsappUrl;
    }, 1500);

    // إظهار زر الطوارئ بعد 2.5 ثانية إذا قام Safari بإحباط التوجيه التلقائي
    setTimeout(() => {
        const fallbackText = document.getElementById('fallback-text');
        const fallbackBtn = document.getElementById('fallback-btn');
        if (fallbackText && fallbackBtn) {
            fallbackText.classList.remove('hidden');
            fallbackBtn.classList.remove('hidden');
        }
    }, 2500);
}

// دالة منفصلة مخصصة لزر الطوارئ للتحويل اليدوي بدون مؤقتات
function forceSendWhatsAppMessage() {
    window.location.href = buildWhatsAppUrl();
}
