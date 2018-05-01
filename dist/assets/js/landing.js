function fadeoutBackground(e) {
    var t = 1,
        n = setInterval(function() {
                t <= .1 && (clearInterval(n), wrapperElem.style.display = "none", e && (document.getElementById("email-input").value = "", document.getElementById("notify-form").style.display = "none", e.success || (document.getElementById("text").innerHTML = "Already in list !!"), document.getElementById("notified").style.display = "block")),
                    t -= .1 * t,
                    wrapperElem.style.opacity = t,
                    wrapperElem.style.filter = "alpha(opacity=" + 100 * t + ")"
        },50)
        document.body.className = "landing-backgroud";
}

function fadeinBackground() {
    var opacity = 0.4,
        time = setInterval(function() {
                opacity > 1 && (clearInterval(time), wrapperElem.style.display = "block"),
                    opacity += .1 * opacity,
                    wrapperElem.style.opacity = opacity,
                    wrapperElem.style.filter = "alpha(opacity=" + 100 * opacity + ")"
            },50);           
}

function init() {
    if (document.getElementById('load-wrapper')) {
        wrapperElem = document.getElementById("load-wrapper"),
        fadeoutBackground()
    }
    else {
        setTimeout(init, 1);
    }
}

var wrapperElem = null;
window.init = init;


if(navigator.serviceWorker) {
    navigator.serviceWorker.register('/workbox.js').then(() => {
        console.log("Service worker is UP");
    });
}
