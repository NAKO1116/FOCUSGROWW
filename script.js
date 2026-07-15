// ===== タイマー =====

let time = 300;
let timer;
let running = false;

// ===== ストップウォッチ =====

let overtime = 0;


let longestFocus =
Number(localStorage.getItem("longestFocus")) || 0;

let todayFocus =
Number(localStorage.getItem("todayFocus")) || 0;

let weekFocus =
Number(localStorage.getItem("weekFocus")) || 0;

let lastDay =
localStorage.getItem("lastDay") || "";

let lastWeek =
localStorage.getItem("lastWeek") || "";

let overtimeMode = false;

// ===== 成長 =====

let level = Number(localStorage.getItem("level")) || 1;
let exp = Number(localStorage.getItem("exp")) || 0;
const expTable = {
    1:3,
    2:7,
    3:10,
    4:10,
    5:10,
    6:15,
    7:15,
    8:15,
    9:15,
    10:15,
    11:20,
    12:20,
    13:20,
    14:20,
    15:20,
    16:25,
    17:25,
    18:25,
    19:25
};

let maxExp =
expTable[level] || 25;

// ===== 継続日数 =====

let streakDays =
Number(localStorage.getItem("streakDays")) || 1;

let bestRecord =
Number(localStorage.getItem("bestRecord")) || 1;

let lastFocusDate =
localStorage.getItem("lastFocusDate") || "";

// ===== 集中回数 =====

let focusCount =
Number(
    localStorage.getItem(
        "focusCount"
    )
) || 0;

// ===== 要素 =====

const timerDisplay =
document.getElementById("timer");

const levelText =
document.getElementById("levelText");

const character =
document.getElementById("character");

const alarmSound =
document.getElementById("alarmSound");

const completeMessage =
document.getElementById("completeMessage");

// ===== BGM =====

const bgm =
document.getElementById("bgm");

const bgmBtn =
document.getElementById("bgmBtn");

let bgmPlaying = false;

// ===== 保存 =====

function saveData(){

    localStorage.setItem("level",level);
    localStorage.setItem("exp",exp);

    localStorage.setItem(
        "streakDays",
        streakDays
    );

    localStorage.setItem(
        "bestRecord",
        bestRecord
    );

    localStorage.setItem(
        "lastFocusDate",
        lastFocusDate
    );

    localStorage.setItem(
        "focusCount",
        focusCount
    );
}

// ===== キャラ進化 =====

function updateCharacter(){

    if(focusCount >= 20){

        character.src =
        "character4.png";

    }else if(focusCount >= 10){

        character.src =
        "character3.png";

    }else if(focusCount >= 3){

        character.src =
        "character2.png";

    }else{

        character.src =
        "character1.png";

    }

}

// ===== レベル更新 =====

function updateLevelUI(){

    let formName = "";

    // 形態名
    if(level >= 16){

        formName = "ユグドラ";

    }else if(level >= 11){

        formName = "シルヴァ";

    }else if(level >= 6){

        formName = "フィーネ";

    }else{

        formName = "ミーネ";
    }

    // 必要経験値
    maxExp = expTable[level] || 25;

    // 左側
    levelText.textContent =
    `${formName} Lv.${level}`;

    // 右側
    document.getElementById(
        "shareLevel"
    ).textContent =
    `Lv.${level}`;
    document.getElementById(
    "shareForm"
    ).textContent =
    formName;

    // 次レベル表示
    let remain = 0;

     if(level < 6){

    remain = 6 - level;

     }else if(level < 11){

    remain = 11 - level;

     }else if(level < 16){

    remain = 16 - level;

     }else{

    remain = 20 - level;

     }
     
    updateCharacter();

    saveData();

    document.getElementById(
    "shareBest"
    ).textContent =
    `最高連続作業日数：${bestRecord}日`;

    document.getElementById(
    "shareLongest"
    ).textContent =
    `最長集中時間：${formatTime(longestFocus)}`;

    updateEvolutionUI();
}

function updateEvolutionUI(){

    let current = 0;
    let goal = 3;

    if(focusCount < 3){

        current = focusCount;
        goal = 3;

    }else if(focusCount < 10){

        current = focusCount - 3;
        goal = 7;

    }else if(focusCount < 20){

        current = focusCount - 10;
        goal = 10;

    }else{

        current = 10;
        goal = 10;

    }

    const percent = current / goal * 100;

    document.getElementById("evolutionBar").style.width =
        percent + "%";

    document.getElementById("evolutionText").textContent =
        `${current} / ${goal} 回`;

    const remain = goal - current;

    if(remain > 0){

        document.getElementById("nextEvolution").textContent =
            `✨ あと${remain}回集中すると進化！`;

    }else{

        document.getElementById("nextEvolution").textContent =
            "🎉 進化可能！";

    }

}

// ===== 経験値 =====

function gainExp(amount){

    exp += amount;

    while(exp >= maxExp){

        exp -= maxExp;

        level++;

        maxExp += 20;

        alert(
            `レベルアップ！ Lv.${level}`
        );
    }

    updateLevelUI();
}

// ===== タイマー =====

function updateTimer(){

    if(!overtimeMode){

        const m = Math.floor(time/60);
        const s = time%60;

        timerDisplay.textContent =
        `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

    }else{

        const m = Math.floor(overtime/60);
        const s = overtime%60;

        timerDisplay.textContent =
        `+${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

    }

}

document
.getElementById("startBtn")
.addEventListener("click",()=>{

    if(running) return;

    running = true;

    timer = setInterval(()=>{

    if(!overtimeMode){

        time--;

    }else{

    overtime++;

    todayFocus++;

weekFocus++;

localStorage.setItem(
    "todayFocus",
    todayFocus
);

localStorage.setItem(
    "weekFocus",
    weekFocus
);

document.getElementById(
    "todayFocus"
).textContent =
`今日：${formatTime(todayFocus)}`;

document.getElementById(
    "weekFocus"
).textContent =
`今週：${formatTime(weekFocus)}`;

    if(overtime > longestFocus){

        longestFocus = overtime;

        localStorage.setItem(
            "longestFocus",
            longestFocus
        );

        document.getElementById(
        "longestFocus"
        ).textContent =
        `最長集中時間：${formatTime(longestFocus)}`;

        checkReset();

        document.getElementById(
        "todayFocus"
        ).textContent =
        `今日：${formatTime(todayFocus)}`;

        document.getElementById(
        "weekFocus"
        ).textContent =
        `今週：${formatTime(weekFocus)}`;
    

    }

    

}

    updateTimer();

    if(time <= 0 && !overtimeMode){

        gainExp(10);

        focusCount++;

            // キャラ更新
            updateCharacter();

            updateEvolutionUI();

            // 喜びモーション
             happyMotion();

            const today =
            new Date().toDateString();

            const yesterday =
            new Date();

            yesterday.setDate(
            yesterday.getDate()-1
            );

            const yesterdayString =
            yesterday.toDateString();

if(lastFocusDate !== today){

    if(lastFocusDate === yesterdayString){

        streakDays++;

    }else{

        streakDays = 1;

    }

    lastFocusDate = today;

    if(streakDays > bestRecord){

        bestRecord = streakDays;

    }

}

            document
            .getElementById(
                "streakDays"
            ).textContent =
            `${streakDays}日`;

            document
            .getElementById(
                "bestRecord"
            ).textContent =
            `ベスト記録：${bestRecord}日`;

            saveData();
            
            alarmSound.currentTime = 0;

            alarmSound.play();

            showCompleteMessage();

            overtimeMode = true;
            overtime = 0;

            updateTimer();
        }

    },1000);

});

function formatTime(sec){

    const h =
    Math.floor(sec/3600);

    const m =
    Math.floor((sec%3600)/60);

    const s =
    sec%60;

    if(h>0){

        return `${h}時間${m}分${s}秒`;

    }

    return `${m}分${s}秒`;

}

function checkReset(){

    const now = new Date();

    const today =
    now.toLocaleDateString();

    if(today != lastDay){

        todayFocus = 0;

        lastDay = today;

        localStorage.setItem(
            "todayFocus",
            todayFocus
        );

        localStorage.setItem(
            "lastDay",
            lastDay
        );

    }

    // 日曜日なら週リセット
    if(now.getDay() == 0 && today != lastWeek){

        weekFocus = 0;

        lastWeek = today;

        localStorage.setItem(
            "weekFocus",
            weekFocus
        );

        localStorage.setItem(
            "lastWeek",
            lastWeek
        );

    }

}

//==== リセット　====//

document
.getElementById("resetBtn")
.addEventListener("click",()=>{

    clearInterval(timer);

    running = false;

    time = 300;

    overtime = 0;

    overtimeMode = false;

    updateTimer();

});



// ===== シェア =====

document
.getElementById("shareBtn")
.addEventListener("click",()=>{

    html2canvas(document.getElementById("shareCard"))
    .then(canvas=>{

        const link =
        document.createElement("a");

        link.download =
        "FocusGrow.png";

        link.href =
        canvas.toDataURL("image/png");

        link.click();

    });

});

// ===== 初期表示 =====

updateTimer();
updateLevelUI();
updateCharacter();
updateEvolutionUI();

document.getElementById(
    "streakDays"
).textContent =
`${streakDays}日`;

document.getElementById(
    "bestRecord"
).textContent =
`ベスト記録：${bestRecord}日`;

document.getElementById(
    "longestFocus"
).textContent =
`最長集中時間：${formatTime(longestFocus)}`;

document.getElementById(
    "todayFocus"
).textContent =
`今日：${formatTime(todayFocus)}`;

document.getElementById(
    "weekFocus"
).textContent =
`今週：${formatTime(weekFocus)}`;
// ===== ToDo =====

let todos =
JSON.parse(
    localStorage.getItem("todos")
) || [];

const todoList =
document.getElementById("todoList");

const todoInput =
document.getElementById("todoInput");

const addTodoBtn =
document.getElementById("addTodoBtn");

// 表示

function renderTodos(){

    todoList.innerHTML = "";

    todos.forEach((todo,index)=>{

        const li =
        document.createElement("li");

        li.classList.add("todo-item");

        li.innerHTML = `
            <span>${todo}</span>
            <button
            class="delete-btn"
            onclick="deleteTodo(${index})">
                削除
            </button>
        `;

        todoList.appendChild(li);

    });

    localStorage.setItem(
        "todos",
        JSON.stringify(todos)
    );
}

// 追加

addTodoBtn.addEventListener("click",()=>{

    const text =
    todoInput.value.trim();

    if(text === "") return;

    todos.push(text);

    todoInput.value = "";

    renderTodos();

});

// Enterでも追加

todoInput.addEventListener("keypress",(e)=>{

    if(e.key === "Enter"){

        addTodoBtn.click();
    }

});

// 削除

function deleteTodo(index){

    todos.splice(index,1);

    renderTodos();
}

// 初回表示

renderTodos();



// ===== まばたき =====

setInterval(()=>{

  const current =
  character.src;

  character.style.opacity =
  "0.7";

  setTimeout(()=>{

    character.style.opacity =
    "1";

  },150);

},4000);


// ===== 喜びモーション =====

function happyMotion(){

  character.classList
  .add("happy");

  setTimeout(()=>{

    character.classList
    .remove("happy");

  },800);

}

function showCompleteMessage(){

    completeMessage.classList.add("show");

    setTimeout(()=>{

        completeMessage.classList.remove("show");

    },3000);

}

// ===== BGM ON/OFF =====

bgm.volume = 0.3;

bgmBtn.addEventListener("click", async () => {

    if (bgmPlaying) {

        bgm.pause();

        bgm.currentTime = 0;

        bgmPlaying = false;

        bgmBtn.textContent = "🎵 BGM";

    } else {

        try {

            await bgm.play();

            bgmPlaying = true;

            bgmBtn.textContent = "🔇 BGM";

        } catch (error) {

            console.error(error);

            alert("BGMを再生できませんでした。");

        }

    }

});

// =========================
// 画面サイズに合わせて縮小・拡大
// =========================

document
.getElementById("helpBtn")
.addEventListener("click",()=>{

    alert(
`FocusGrow

5分集中を続けることで
キャラクターが成長する
作業支援サイトです。

【できること】

・5分タイマー
・集中時間の記録
・継続日数の管理
・ToDo管理
・成長記録の共有`
    );

});
