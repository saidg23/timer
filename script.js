const INITIAL = 0;
const COUNTDOWN = 1;
const PAUSED = 2;

let state = {
    timerState: INITIAL,
    interval: null,
    sessionLength: 25,
    breakLength: 5,
    timerStart: null,
    timeLeft: new Date(),
    displayTime: ""
}

let buttons = $(".button").click(click);
let sessionLength = $("#session-length")[0];
let breakLength = $("#break-length")[0];
let timer = $("#time-left")[0];

function updateUI(){
    sessionLength.innerHTML = state.sessionLength;
    breakLength.innerHTML = state.breakLength;
    timer.innerHTML = state.displayTime;
}

function updateDisplay(){
    let minutes = state.timeLeft.getMinutes();
    if(state.timeLeft.getHours() > 18){
        minutes = 60;
    }
    let seconds = state.timeLeft.getSeconds();
    if(minutes < 10) minutes = "0" + minutes;
    if(seconds < 10) seconds = "0" + seconds;
    state.displayTime = minutes + ":" + seconds;
}

function setTimer(length){
    state.timeLeft.setTime(0);
    state.timeLeft.setMinutes(length);
    state.timerStart = new Date();
    updateDisplay();
}

function updateTime(){
    let currentTime = new Date();
    let elapsedTime = currentTime - state.timerStart;
    state.timeLeft.setTime(state.timeLeft - elapsedTime);
    updateDisplay();
    updateUI()
    state.timerStart = new Date();
}

function sessionChange(val){
    if(state.timerState === COUNTDOWN) return;
    let nextVal = state.sessionLength + val;
    if(!(nextVal < 1 || nextVal > 60)){
        state.sessionLength = nextVal;
    }
    setTimer(state.sessionLength);
    updateUI();
}

function breakChange(val){
    let nextVal = state.breakLength + val;
    if(!(nextVal < 1 || nextVal > 60)){
        state.breakLength = nextVal;
    }
}

function click(e){
    switch(e.target.id){
        case 'session-increment':
            sessionChange(1);
            break;
        case 'session-decrement':
            sessionChange(-1);
            break;
        case 'break-increment':
            breakChange(1);
            break;
        case 'break-decrement':
            breakChange(-1);
            break;
        case 'start_stop':
            if(state.timerState === INITIAL){
                state.interval = setInterval(updateTime, 1000);
                state.timerState = COUNTDOWN;
                setTimer(state.sessionLength);
            }
            else if(state.timerState === PAUSED){
                state.timerStart = new Date();
                state.interval = setInterval(updateTime, 1000);
                state.timerState = COUNTDOWN;
            }
            else if(state.timerState === COUNTDOWN){
                clearInterval(state.interval);
                state.timerState = PAUSED;
            }
            break;
        case 'reset':
            clearInterval(state.interval);
            state.timerState = INITIAL;
            state.sessionLength = 25;
            state.breakLength = 5;
            setTimer(state.sessionLength);
            break;
    }
    updateUI();
}

setTimer(state.sessionLength);
updateUI();
