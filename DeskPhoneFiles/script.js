

let secondiRimanenti = 0;

function aggiornaDisplayTimer() {
    let min = Math.floor(secondiRimanenti / 60);
    let sec = secondiRimanenti % 60;

    if (isNaN(min) || isNaN(sec)) {
        document.getElementById("timer").innerText = "00:00";
    } else {
        document.getElementById("timer").innerText = String(min).padStart(2, '0') + ":" + String(sec).padStart(2, '0');
    }
    
}

aggiornaDisplayTimer();


function aggiornaOrologio() {
    const adesso = new Date();
    const ore = adesso.getHours();
    const minuti = adesso.getMinutes();
    const minutiFormattati = String(minuti).padStart(2, '0');
    const oreFormattate = String(ore).padStart(2, '0');
    document.getElementById("orologio").innerText = oreFormattate + ":" + minutiFormattati;
}
function aggiornaData() {
    const dataCorr = new Date();
    document.getElementById("data").innerText = dataCorr.toDateString();
}

function aggiornaMeteo() {
    const url = "" // inserisci la tua API del meteo

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const temp = data.current.temperature_2m;
            const umidita = data.current.relative_humidity_2m;
            const percepita = data.current.apparent_temperature;
            document.getElementById("meteo").innerText = `Temperatura: ${temp}\u00B0C\nPercepita: ${percepita}\u00B0C\nUmidita: ${umidita}%`; // aggiungi o rimuovi voci in base alla tua API
        })
        .catch(error => console.log("Errore nel recupero del meteo", error));
}

let timerInterval;
let audioCtx;
let beepInterval;

function avviaTimer(minuti) {
    let secondiRimanenti = minuti * 60;
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        if (secondiRimanenti <= 0) {
            clearInterval(timerInterval);

            audioCtx = new (window.AudioContext || window.webkitAudioContext) ();
        if (audioCtx.state == 'suspended') {
         audioCtx.resume();
        }
    
            
            
                
            beepInterval = setInterval(() => {
            let osc = audioCtx.createOscillator();
            let gain = audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            gain.gain.setValueAtTime(1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
            osc.stop(audioCtx, currentTime + 0.5);
            }, 500);
        } else {
            secondiRimanenti--;

            let min = Math.floor(secondiRimanenti / 60);
            let sec = secondiRimanenti % 60;

            let minStr = min < 10 ? '0' + min : min;
            let secStr = sec < 10 ? '0' + sec : sec;

            document.getElementById("timer").innerText = `${minStr}:${secStr}`;
        }

    }, 1000);
}

function avviaTimerPersonalizzato() {
    let input = document.getElementById("inputMinuti").value;
    let minuti = Number(input);

    avviaTimer(minuti);
}

function fermatimer() {
    clearInterval(timerInterval);
    clearInterval(beepInterval);
    
    secondiRimanenti = 0;

    if (audioCtx) {
        audioCtx.close();
    }
    document.getElementById("timer").innerText = "00:00";

}

document.addEventListener('click', () => {
    clearInterval(beepInterval);
    if (audioCtx) {
        audioCtx.close();
    }
});



aggiornaMeteo();
aggiornaOrologio();
aggiornaData();
setInterval(aggiornaOrologio, 1000);
