//timer states
const INITIAL = 0;
const COUNTDOWN = 1;
const PAUSED = 2;

//timer modes
const SESSION = 0;
const BREAK = 1;

let state = {
    mode: SESSION,
    timerState: INITIAL,
    interval: null,
    sessionLength: 25,
    breakLength: 5,
    timeLeft: new Date(),
    displayTime: ""
}

let buttons = $(".button").click(click);
let sessionLength = $("#session-length")[0];
let breakLength = $("#break-length")[0];
let timer = $("#time-left")[0];
let timerLabel = $("#timer-label")[0];

function updateUI(){
    sessionLength.innerHTML = state.sessionLength;
    breakLength.innerHTML = state.breakLength;
    timer.innerHTML = state.displayTime;
    switch(state.mode){
        case SESSION: timerLabel.innerHTML = "Session"; break;
        case BREAK: timerLabel.innerHTML = "Break";
    }
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

function setTimer(length, mode){
    state.timeLeft.setTime(0);
    state.timeLeft.setMinutes(length);
    state.mode = mode;
    updateDisplay();
}

function changeMode(){
    switch(state.mode){
        case SESSION:
            setTimer(state.breakLength, BREAK);
            break;
        case BREAK:
            setTimer(state.breakLength, SESSION);
    }
}

function updateTime(){
    state.timeLeft.setTime(state.timeLeft - 1000);
    if(state.timeLeft.getTime() < 0){
        changeMode();
        return;
    }

    updateDisplay();
    updateUI()
}

function sessionChange(val){
    if(state.timerState === COUNTDOWN) return;
    let nextVal = state.sessionLength + val;
    if(!(nextVal < 1 || nextVal > 60)){
        state.sessionLength = nextVal;
    }
    setTimer(state.sessionLength, SESSION);
}

function breakChange(val){
    if(state.timerState === COUNTDOWN) return;
    let nextVal = state.breakLength + val;
    if(!(nextVal < 1 || nextVal > 60)){
        state.breakLength = nextVal;
    }
    setTimer(state.sessionLength, SESSION);
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
                setTimer(state.sessionLength, SESSION);
            }
            else if(state.timerState === PAUSED){
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
            setTimer(state.sessionLength, SESSION);
            break;
    }
    updateUI();
}

setTimer(state.sessionLength, SESSION);
updateUI();
