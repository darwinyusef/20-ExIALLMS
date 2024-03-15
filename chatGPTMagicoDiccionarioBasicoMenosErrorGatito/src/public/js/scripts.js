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


async function questoinChatGPT(pregunta) {
    try {
        const response = await fetch(`http://localhost:3000/chats?pregunta=${pregunta}`);
        const question = await response.json();
        document.getElementById('respuesta').textContent = question.response_gpt.content;
        const searchGoogle = `https://www.google.com/search?q=${pregunta}`;
        const wikipedia = `https://es.wikipedia.org/w/index.php?search=${pregunta}`
        document.getElementById('gatito').classList.remove("hidden");
        document.getElementById('google').setAttribute('href', searchGoogle)
        document.getElementById('wiki').setAttribute('href', wikipedia)
        location.href = '/#about'
    } catch (error) {
        console.log(error);
        document.getElementById('respuesta').textContent = 'Actualmente existe un error en OPENAI para su pregunta';
    }
}

document.getElementById('sendform').addEventListener("submit", (event) => {
    event.preventDefault();
    let pregunta = document.getElementById('question_input').value;
    console.log(pregunta);
    questoinChatGPT(pregunta);
});

document.getElementById('vuelve').addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById('gatito').classList.remove("hidden");
    document.getElementById('question_input').value = 'Pregunta Pregunta';
    location.href = '/#page-top'
});


