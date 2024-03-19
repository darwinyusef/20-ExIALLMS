/*!
* Start Bootstrap - Stylish Portfolio v6.0.6 (https://startbootstrap.com/theme/stylish-portfolio)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-stylish-portfolio/blob/master/LICENSE)
*/
window.addEventListener('DOMContentLoaded', event => {

    const sidebarWrapper = document.getElementById('sidebar-wrapper');
    let scrollToTopVisible = false;
    // Closes the sidebar menu
    const menuToggle = document.body.querySelector('.menu-toggle');
    menuToggle.addEventListener('click', event => {
        event.preventDefault();
        sidebarWrapper.classList.toggle('active');
        _toggleMenuIcon();
        menuToggle.classList.toggle('active');
    })

    // Closes responsive menu when a scroll trigger link is clicked
    var scrollTriggerList = [].slice.call(document.querySelectorAll('#sidebar-wrapper .js-scroll-trigger'));
    scrollTriggerList.map(scrollTrigger => {
        scrollTrigger.addEventListener('click', () => {
            sidebarWrapper.classList.remove('active');
            menuToggle.classList.remove('active');
            _toggleMenuIcon();
        })
    });

    function _toggleMenuIcon() {
        const menuToggleBars = document.body.querySelector('.menu-toggle > .fa-bars');
        const menuToggleTimes = document.body.querySelector('.menu-toggle > .fa-xmark');
        if (menuToggleBars) {
            menuToggleBars.classList.remove('fa-bars');
            menuToggleBars.classList.add('fa-xmark');
        }
        if (menuToggleTimes) {
            menuToggleTimes.classList.remove('fa-xmark');
            menuToggleTimes.classList.add('fa-bars');
        }
    }

    // Scroll to top button appear
    document.addEventListener('scroll', () => {
        const scrollToTop = document.body.querySelector('.scroll-to-top');
        if (document.documentElement.scrollTop > 100) {
            if (!scrollToTopVisible) {
                fadeIn(scrollToTop);
                scrollToTopVisible = true;
            }
        } else {
            if (scrollToTopVisible) {
                fadeOut(scrollToTop);
                scrollToTopVisible = false;
            }
        }
    })
})

function fadeOut(el) {
    el.style.opacity = 1;
    (function fade() {
        if ((el.style.opacity -= .1) < 0) {
            el.style.display = "none";
        } else {
            requestAnimationFrame(fade);
        }
    })();
};

function fadeIn(el, display) {
    el.style.opacity = 0;
    el.style.display = display || "block";
    (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += .1) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
};

document.querySelector('#buscadorvoz').value = 'pregunta pregunta';
const audioPlayer = document.getElementById("audio-player");
const playButton = document.getElementById("play-button");
const stopButton = document.getElementById("stop-button");
localStorage.setItem('audiourl', '../audios/principalAudio.mp3');

window.onload = function () {
    const url = localStorage.getItem('audiourl');
    console.log(url);
    audioPlayer.src = `../audios/${url}`; // Cambiar por la URL del primer archivo
    audioPlayer.play();
}

document.querySelector('#btnSend').addEventListener('click', (e) => {
    e.preventDefault();
    const inputValue = document.querySelector('#buscadorvoz').value;
    questionCHatGPT(inputValue);
});
document.querySelector('#vuelve').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#buscadorvoz').value = 'pregunta pregunta';
    document.querySelector('#respuesta').textContent = 'Esperando una pregunta a chat gpt...';
    // document.querySelector('#controlsa').style.display = 'none';
    location.href = '#page-top';
});

async function questionCHatGPT(pregunta) {
    document.querySelector('#spinner').style.display = 'block';
    document.querySelector('#responseIA').style.display = 'block';

    if (pregunta == '') {
        pregunta = 'pregunta pregunta';
    }
    try {
        const response = await fetch(`http://localhost:3000/chats?pregunta=${pregunta}`);
        const question = await response.json();
        document.querySelector('#spinner').style.display = 'none';
        document.querySelector('#responseIA').style.display = 'none';
        console.log(question);
        document.querySelector('#respuesta').textContent = question.response;

        const sending = `${String(question.res.fileName).replace('./src/public/', '')}`;
        localStorage.setItem('audiourl', sending);
        audioPlayer.src = sending;
        audioPlayer.currentTime = 0;
        audioPlayer.play();

        location.href = '#about';
    } catch (error) {
        console.log(error, "Error en la petición");
        document.querySelector('#respuesta').textContent = "Error en la api";
    }
}

var reconocimiento = new webkitSpeechRecognition();
reconocimiento.onresult = (event) => {
    var decirTexto = "";
    for (var i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
            decirTexto = event.results[i][0].transcript;
        } else {
            decirTexto += event.results[i][0].transcript;
        }
    }
    document.getElementById('buscadorvoz').value = decirTexto;
}

const iniciarGrabacion = () => {
    document.getElementById('buscadorvoz').value = "";
    document.getElementById('buscadorvoz').focus();
    reconocimiento.start();
}



    ;
// Función para reproducir el audio al hacer clic en el botón "Reproducir"
playButton.addEventListener("click", function () {
    const url = localStorage.getItem('audiourl');
    audioPlayer.src = `../audios/${url}`;
    audioPlayer.play();
});

// Función para detener el audio al hacer clic en el botón "Detener"
stopButton.addEventListener("click", function () {
    const url = localStorage.getItem('audiourl');
    audioPlayer.src = `../audios/${url}`;
    audioPlayer.pause();
    // audioPlayer.currentTime = 0; // Reinicia el tiempo de reproducción
});

// Función para cambiar de audio al finalizar el actual (opcional)
audioPlayer.addEventListener("ended", function () {
    const url = localStorage.getItem('audiourl');
    audioPlayer.src = `../audios/${url}`;
    audioPlayer.currentTime = 0;
    audioPlayer.pause();
});




