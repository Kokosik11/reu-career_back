function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    let timerInt = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }

        if(timer === 0) {
            setTimeout(function () {
                minutes, seconds = 0;
                display.textContent = minutes + ":0" + seconds;
                console.log("Done")
                clearInterval(timerInt);
                const btn = document.querySelector('#sendEmail').setAttribute('disabled', 'false');    
            }, 1000)
         }
    }, 1000);

    
}

window.onload = function () {
    const fiveMinutes = 10,
        display = document.querySelector('#time');
    startTimer(fiveMinutes, display);
};