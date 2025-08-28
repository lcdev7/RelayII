window.onload = inicio;

// 🔹 Tus videos en Cloudinary
const videos = [
  "https://res.cloudinary.com/dk80vkv39/video/upload/v1756329429/video2_cffc4r.mp4",
  "https://res.cloudinary.com/dk80vkv39/video/upload/v1756329418/video1_zbdzqg.mp4"
];

var vid;
var orden = [];
var videoActual = 0;
var tooltip;

function inicio() {
    vid = document.querySelector("video");
    vid.src = videos[videoActual];
    document.querySelector(".play").onclick = play;
    document.querySelector(".volumen").onclick = volumen;
    document.querySelector(".siguiente").onclick = siguiente;
    document.querySelector(".reiniciar").onclick = reiniciar;
    document.querySelector(".pantallacompleta").onclick = pantallacompleta;
    document.querySelector(".barra1").onclick = buscar;

    tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.textContent = "00:00";
    document.querySelector(".barra1").appendChild(tooltip);

    document.querySelector(".barra1").addEventListener("mousemove", mostrarTooltip);
    document.querySelector(".barra1").addEventListener("mouseleave", () => {
        tooltip.style.display = "none";
    });

    vid.onclick = togglePlay;
    document.addEventListener("keydown", function(e) {
        if (e.code === "Space") {
            e.preventDefault();
            togglePlay();
        }
    });

    reordenar();
    vid.ontimeupdate = actualizar;
    vid.onloadeddata = actualizar;
}

function play() {
    togglePlay();
    document.querySelector(".play").src = vid.paused ? "img/play.svg" : "img/pausa.svg";
}

function togglePlay() {
    if (vid.paused) {
        vid.play();
        document.querySelector(".play").src = "img/pausa.svg";
    } else {
        vid.pause();
        document.querySelector(".play").src = "img/play.svg";
    }
}

function volumen() {
    vid.muted = !vid.muted;
    this.src = vid.muted ? "img/volumen0.svg" : "img/volumen1.svg";
}

function reordenar() {
    orden = [];
    for (let i = 0; i < videos.length; i++) {
        let azar;
        do {
            azar = Math.floor(Math.random() * videos.length);
        } while (orden.includes(azar));
        orden.push(azar);
    }
    reproducir();
}

function reproducir() {
    let videoseleccionado = orden[videoActual];
    vid.src = videos[videoseleccionado];
    vid.play();
}

function siguiente() {
    videoActual++;
    if (videoActual >= videos.length) {
        videoActual = 0;
    }
    reproducir();
}

function reiniciar() {
    vid.currentTime = 0;
}

function pantallacompleta() {
    if (!document.fullscreenElement) {
        vid.requestFullscreen?.() || vid.webkitRequestFullscreen?.() || vid.msRequestFullscreen?.();
    } else {
        document.exitFullscreen?.() || document.webkitExitFullscreen?.() || document.msExitFullscreen?.();
    }
}

function actualizar() {
    document.querySelector(".estado").innerHTML = `${conversion(vid.currentTime)}/${conversion(vid.duration)}`;
    let porcentaje = (100 * vid.currentTime) / vid.duration;
    document.querySelector(".barra2").style.width = `${porcentaje}%`;
}

function conversion(segundos) {
    if (isNaN(segundos)) return "00:00";
    let d = new Date(segundos * 1000);
    let segundo = (d.getSeconds() <= 9) ? "0" + d.getSeconds() : d.getSeconds();
    let minuto = (d.getMinutes() <= 9) ? "0" + d.getMinutes() : d.getMinutes();
    return `${minuto}:${segundo}`;
}

function buscar(e) {
    let clickBarra = e.offsetX;
    let anchoNavegador = document.querySelector(".barra1").offsetWidth;
    let porcentaje = (100 * clickBarra) / anchoNavegador;
    let posicion = Math.floor(vid.duration * (porcentaje / 100));
    vid.currentTime = posicion;
}

function mostrarTooltip(e) {
    let barra = document.querySelector(".barra1");
    let anchoNavegador = barra.offsetWidth;
    let posicionX = e.offsetX;
    let porcentaje = (100 * posicionX) / anchoNavegador;
    let segundos = Math.floor(vid.duration * (porcentaje / 100));

    tooltip.style.display = "block";
    tooltip.textContent = conversion(segundos);
    tooltip.style.left = `${posicionX}px`;
}
