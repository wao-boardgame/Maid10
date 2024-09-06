let intervalId = null;
let totalSeconds = 30; // デフォルトで30秒
let countdownValue = 30; // 設定可能な値
let isRunning = false; // タイマーが動いているかどうか
let isTimeUp = false; // タイマーが時間切れになったかどうか

const timerElement = document.getElementById("timer");
const secondsLabel = document.getElementById("seconds-label");
const startPauseButton = document.getElementById("startPauseButton");
const resetButton = document.getElementById("resetButton");
const timeInput = document.getElementById("timeInput");

// 初期状態でスタートボタンの色を設定
startPauseButton.style.backgroundColor = "#28a745";
startPauseButton.textContent = "スタート";

// 初期状態でリセットボタンの色を設定
resetButton.style.backgroundColor = "#dc3545";

// タイマーをスタートまたは一時停止する処理
startPauseButton.addEventListener("click", () => {
    if (isTimeUp) return; // 時間切れ時にはボタンが反応しないようにする

    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
});

// タイマーをリセットし、自動で再スタートする処理
resetButton.addEventListener("click", () => {
    pauseTimer();
    // 入力された値でタイマーをリセットする
    const inputValue = timeInput.value.trim();
    countdownValue = parseInt(convertFullWidthToHalfWidth(inputValue), 10);

    // 無効な値や空の値が入力された場合はデフォルト値に戻す
    if (isNaN(countdownValue) || countdownValue < 1) {
        countdownValue = 30;
    }

    totalSeconds = countdownValue;
    timeInput.value = countdownValue; // inputフィールドに反映
    isTimeUp = false; // タイマーが再スタートしたので時間切れフラグをリセット
    updateDisplay();
    resetStyles(); // スタイルをリセット
    startTimer();
});

// タイマーの時間を設定する処理
timeInput.addEventListener("input", () => {
    if (isRunning) return; // カウントダウン中は入力を無効にする

    let inputValue = timeInput.value.trim();

    if (inputValue === "") {
        return; // 空の入力は処理せずに戻る
    }

    let numericValue = parseInt(convertFullWidthToHalfWidth(inputValue), 10);

    if (isNaN(numericValue) || numericValue < 1) {
        numericValue = 1; // 無効な値や0以下の値が入力された場合、1に修正
    }

    countdownValue = numericValue;
    totalSeconds = countdownValue;
    updateDisplay();
    resetStyles(); // スタイルをリセット
});

// タイマーをスタートする関数
function startTimer() {
    if (intervalId === null) {
        intervalId = setInterval(updateTimer, 1000);
        isRunning = true;
        startPauseButton.textContent = "一時停止";
        startPauseButton.style.backgroundColor = "#ffc107";
        timeInput.disabled = true; // カウントダウン中は入力を無効にする
    }
}

// タイマーを一時停止する関数
function pauseTimer() {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
        isRunning = false;
        startPauseButton.textContent = "スタート";
        startPauseButton.style.backgroundColor = "#28a745";
        timeInput.disabled = false; // 一時停止中は入力を再度有効にする
    }
}

// タイマーが更新されるたびに呼ばれる関数
function updateTimer() {
    if (totalSeconds > 0) {
        totalSeconds--;
        updateDisplay();
    } else {
        timeUp(); // タイマーが0になった時の処理
    }
}

// タイマーが0になったときの処理
function timeUp() {
    pauseTimer();
    timerElement.textContent = "時間切れ"; // 秒の表示を削除
    secondsLabel.textContent = ""; // 秒ラベルを消去
    timerElement.style.color = "#dc3545"; // タイマー表示の文字色を変更
    timerElement.classList.add("flash");
    playSound(); // 短いサウンドを鳴らす
    isTimeUp = true; // 時間切れフラグを設定
}

// 短いサウンドを鳴らす関数
function playSound() {
    const audio = new Audio('notification-sound.mp3'); // サウンドファイルのパスを指定
    audio.play();
}

// タイマー表示のスタイルをリセットする関数
function resetStyles() {
    timerElement.style.color = "#000"; // デフォルトの文字色に戻す
    timerElement.classList.remove("flash");
    secondsLabel.textContent = "秒"; // 秒ラベルを再表示
}

// 表示を更新する関数
function updateDisplay() {
    if (totalSeconds > 0) {
        timerElement.textContent = totalSeconds; // 秒のみを表示
        secondsLabel.textContent = "秒"; // 秒ラベルを表示
    }
}

// 全角数字を半角に変換する関数
function convertFullWidthToHalfWidth(str) {
    return str.replace(/[０１２３４５６７８９]/g, (ch) =>
        String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
    ).replace(/。/g, '.');
}