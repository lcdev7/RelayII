window.onload = inicio;
var videos = [
    // 🎬 Links de Cloudinary
    "https://res.cloudinary.com/dk80vkv39/video/upload/v1756329418/video1_zbdzqg.mp4",
    "https://res.cloudinary.com/dk80vkv39/video/upload/v1756329429/video2_cffc4r.mp4",
    "https://res.cloudinary.com/dk80vkv39/video/upload/v1756362564/6X19_yuudie.mp4",
    "https://res.cloudinary.com/dk80vkv39/video/upload/v1756362581/5X17_hdk0zl.mp4",
    "https://res.cloudinary.com/dk80vkv39/video/upload/v1756362784/1X23_rqmxvy.mp4",
    "https://res.cloudinary.com/dk80vkv39/video/upload/v1756362788/3X6_uldu9h.mp4",
    "https://res.cloudinary.com/dk80vkv39/video/upload/v1756362791/2X5_dogxko.mp4",
    "https://res.cloudinary.com/dk80vkv39/video/upload/v1756362793/1X18_ok6fww.mp4",
    "https://res.cloudinary.com/dk80vkv39/video/upload/v1756362793/5X15_e073lf.mp4",
    "https://res.cloudinary.com/dk80vkv39/video/upload/v1756362797/7X8_j7nzdu.mp4",
    "https://res.cloudinary.com/dk80vkv39/video/upload/v1756362798/3X16_t18tah.mp4",
    "https://res.cloudinary.com/dk80vkv39/video/upload/v1756362799/6X10_kbmide.mp4",
    "https://res.cloudinary.com/dk80vkv39/video/upload/v1756362804/5X11_hv5sov.mp4",
    "https://res.cloudinary.com/dk80vkv39/video/upload/v1756362805/6X9_lqmuaw.mp4",
    "https://res.cloudinary.com/dk80vkv39/video/upload/v1756362805/8X1_zcb4wn.mp4",
    "https://res.cloudinary.com/dk80vkv39/video/upload/v1756362807/5X8_iisn5t.mp4",
    "https://res.cloudinary.com/dk80vkv39/video/upload/v1756362811/1X12_ubjbmh.mp4"
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

    // crear tooltip
    tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.textContent = "00:00";
    document.querySelector(".barra1").appendChild(tooltip);

    // eventos para tooltip
    document.querySelector(".barra1").addEventListener("mousemove", mostrarTooltip);
    document.querySelector(".barra1").addEventListener("mouseleave", () => {
        tooltip.style.display = "none";
    });

    // reproducir o pausar con clic en el video
    vid.onclick = togglePlay;

    // reproducir o pausar con barra espaciadora
    document.addEventListener("keydown", function(e) {
        if (e.code === "Space") {
            e.preventDefault(); // evita scroll
            togglePlay();
        }
    });

    reordenar();
    vid.ontimeupdate = actualizar;
    vid.onloadeddata = actualizar;

    // 👇 evento para pasar al siguiente cuando termina
    vid.onended = siguiente;
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
    vid.muted = !vid.muted; // 🔊 mute/unmute
    this.src = vid.muted ? "img/volumen0.svg" : "img/volumen1.svg";
}

function reordenar() {
    orden = []; // limpiar orden
    for (let i = 0; i < videos.length; i++) {
        let azar;
        do {
            azar = Math.floor(Math.random() * videos.length);
        } while (orden.indexOf(azar) >= 0);
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
    if (videoActual < videos.length) {
        reproducir();
    } else {
        console.log("Todos los videos han terminado 🎉");
        videoActual = videos.length - 1;
        vid.pause();
        alert("✅ Fin de la lista de reproducción");
    }
}

function reiniciar() {
    vid.currentTime = 0;
}

function pantallacompleta() {
    if (!document.fullscreenElement) {
        if (vid.requestFullscreen) {
            vid.requestFullscreen();
        } else if (vid.webkitRequestFullscreen) { // Safari
            vid.webkitRequestFullscreen();
        } else if (vid.msRequestFullscreen) { // IE/Edge
            vid.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
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
    let poncentaje = (100 * clickBarra) / anchoNavegador;
    let posicion = Math.floor(vid.duration * (poncentaje / 100));
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
