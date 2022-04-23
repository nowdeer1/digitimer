(function(){
    'use strict';

    //htmlのidからデータを取得
    //取得したデータを変数に代入

    // Timer
    const timer = document.getElementById('timer');
    const timerDisp = document.getElementById('timerDisp');
    const start = document.getElementById('start');
    const stop = document.getElementById('stop');
    const setTimer = document.getElementById('setTimer');

    // periods
    const periodDisp = document.getElementById('periodDisp');
    const periodList = document.getElementById('pList');
    const changePeriod = document.getElementById('changePeriod');

    // teamName
    const teamAName = document.getElementById('teamAName');
    const teamBName = document.getElementById('teamBName');
    const setNames = document.getElementById('setNames');

    // Point
    const teamAP1 = document.getElementById('teamAP1');
    const teamBP1 = document.getElementById('teamBP1');
    const teamAP2 = document.getElementById('teamAP2');
    const teamBP2 = document.getElementById('teamBP2');
    const teamAP3 = document.getElementById('teamAP3');
    const teamBP3 = document.getElementById('teamBP3');
    const teamAM1 = document.getElementById('teamAM1');
    const teamBM1 = document.getElementById('teamBM1');
    const teamAPnt = document.getElementById('teamAscore');
    const teamBPnt = document.getElementById('teamBscore');

    // Timeout
    const teamATOC = document.getElementById('teamATOC');
    const teamBTOC = document.getElementById('teamBTOC');
    const teamATOU = document.getElementById('teamATOU');
    const teamBTOU = document.getElementById('teamBTOU');

    // Foul
    const teamAFP1 = document.getElementById('teamAFP1');
    const teamBFP1 = document.getElementById('teamBFP1');
    const teamAFM1 = document.getElementById('teamAFM1');
    const teamBFM1 = document.getElementById('teamBFM1');
    const teamAfl = document.getElementById('teamAfoul');
    const teamBfl = document.getElementById('teamBfoul');

    // Reset
    const reset = document.getElementById('reset');

    stop.disabled = true;
    stop.classList.add("deadBtn");
    stop.classList.remove("btn");

    //クリック時の時間を保持するための変数定義
    let startTime;

    //経過時刻を更新するための変数elapsedTimeを0にしてあげつつ、updateTimetTextで0になったタイムを表示。
    let originTimeSplit = document.getElementById("timer").textContent.split(':');
    let elapsedTime = Number(originTimeSplit[0]*60000) + Number(originTimeSplit[1]*1000) + Number(originTimeSplit[2]);

    //タイマーを止めるにはclearTimeoutを使う必要があり、そのためにはclearTimeoutの引数に渡すためのタイマーのidが必要
    let timerId;

    //タイマーをストップ -> 再開させたら0になってしまうのを避けるための変数。
    // let timeToadd = 0;


    //ミリ秒の表示ではなく、分とか秒に直すための関数, 他のところからも呼び出すので別関数として作る
    //計算方法として135200ミリ秒経過したとしてそれを分とか秒に直すと -> 02:15:200
    function updateTimetText(elapsedTime){

        //m(分) = 135200 / 60000ミリ秒で割った数の商　-> 2分
        let m = Math.floor(elapsedTime / 60000);

        //s(秒) = 135200 % 60000ミリ秒で / 1000 (ミリ秒なので1000で割ってやる) -> 15秒
        let s = Math.floor(elapsedTime % 60000 / 1000);

        //ms(ミリ秒) = 135200ミリ秒を % 1000ミリ秒で割った数の余り
        let ms = elapsedTime % 1000;


        //HTML 上で表示の際の桁数を固定する　例）3 => 03　、 12 -> 012
        //javascriptでは文字列数列を連結すると文字列になる
        //文字列の末尾2桁を表示したいのでsliceで負の値(-2)引数で渡してやる。
        // m = ('0' + m).slice(-2); 
        s = ('0' + s).slice(-2);
        ms = ('0' + ms).slice(-3);

        //HTMLのid　timer部分に表示させる　
        timer.textContent = m + ':' + s + ':' + ms;

        let msDisp = ms.slice(0,2);
        if (m >= 1){
            timerDisp.textContent =  m + ':' + s;
        } else {
            timerDisp.textContent =  s + '.' + msDisp;
        }
    }

    function switchPeriod() {
        let periodStr = periodList.value;
        
        periodDisp.textContent = periodList.value;

    }

    function sleep(waitSec, callbackFunc) {
     
        // 経過時間（秒）
        var spanedSec = 0;
     
        // 1秒間隔で無名関数を実行
        var id = setInterval(function () {
     
            spanedSec++;
     
            // 経過時間 >= 待機時間の場合、待機終了。
            if (spanedSec >= waitSec) {
     
                // タイマー停止
                clearInterval(id);
     
                // 完了時、コールバック関数を実行
                if (callbackFunc) callbackFunc();
            }
        }, 1000);
     
    }
     
    //再帰的に使える用の関数
    function countDown(elapsedTime){
        
        if(elapsedTime >= 10){

            //timerId変数はsetTimeoutの返り値になるので代入する
            timerId = setTimeout(function(){

                //経過時刻は現在時刻をミリ秒で示すDate.now()からstartを押した時の時刻(startTime)を引く
                elapsedTime = elapsedTime - 10;
                updateTimetText(elapsedTime);

                //countUp関数自身を呼ぶことで10ミリ秒毎に以下の計算を始める
                countDown(elapsedTime);

            //1秒以下の時間を表示するために10ミリ秒後に始めるよう宣言
            },10);
        }
    }

    function getNowTime(){
        let originTimeSplit = document.getElementById("timer").textContent.split(':');
        let elapsedTime = Number(originTimeSplit[0]*60000) + Number(originTimeSplit[1]*1000) + Number(originTimeSplit[2]);      
        return elapsedTime;
    }

    function countPoint(team, point) {
        let nowScore = document.getElementById(team);
        let nowScoreSum = Number(nowScore.textContent) + point; 

        if (team == "teamAscore"){
            teamAPnt.textContent = nowScoreSum;
        } else {
            teamBPnt.textContent = nowScoreSum;
        }
        
    }

    function useTimeout(team) {
        let nowTO = document.getElementById(team);
        let timeoutSum = Number(nowTO.textContent) - 1; 

        if (team == "teamATOC"){
            teamATOC.textContent = timeoutSum;
        } else {
            teamBTOC.textContent = timeoutSum;
        }
        
    }

    function countFoul(team, foul) {
        let nowFoul = document.getElementById(team);
        let foulSum = Number(nowFoul.textContent) + foul; 

        if (team == "teamAfoul"){
            teamAfl.textContent = foulSum;
            if (foulSum > 4 ){
                teamAfl.style.color = "#FF0000"
            } else {
                teamAfl.style.color = "#FFFFFF"
            }
        } else {
            teamBfl.textContent = foulSum;
            if (foulSum > 4 ){
                teamBfl.style.color = "#FF0000"
            } else {
                teamBfl.style.color = "#FFFFFF"
            }
        }
        
    }

    function setName(teamA, teamB) {
        teamAName.textContent = teamA;
        teamBName.textContent = teamB;
    }

    function resetAll() {
        teamAPnt.textContent = 0;
        teamBPnt.textContent = 0;
        teamAfl.textContent = 0;
        teamBfl.textContent = 0;
        teamAfl.style.color = "#FFFFFF"
        teamBfl.style.color = "#FFFFFF"
        periodDisp.textContent = "1Q";
        teamATOC.textContent = 2;
        teamBTOC.textContent = 2;
        clearTimeout(timerId);

        let originTimeSplit = document.getElementById("time").value.split(':');
        let elapsedTime = Number(originTimeSplit[0]*60000) + Number(originTimeSplit[1]*1000) + Number(originTimeSplit[2]);
        updateTimetText(elapsedTime);

        start.disabled = false;
        start.classList.add("btn");
        start.classList.remove("deadBtn");
        stop.disabled = true;
        stop.classList.add("deadBtn");
        stop.classList.remove("btn");

    }


    //Button Actions

    // Button : Update names of teams
    setNames.addEventListener('click',function(){
        let teamA = document.getElementById("teamANameTx").value;
        let teamB = document.getElementById("teamBNameTx").value;
        setName(teamA, teamB);
    });

    // Button : Change periods
    changePeriod.addEventListener('click',function(){
        switchPeriod();
    });


    // Button : Start timer
    start.addEventListener('click',function(){
        elapsedTime = getNowTime();
        countDown(elapsedTime)
        this.disabled = true;
        this.classList.add("deadBtn");
        this.classList.remove("btn");
        stop.disabled = false;
        stop.classList.add("btn");
        stop.classList.remove("deadBtn");
    });


    // Button : Stop timer
    stop.addEventListener('click',function(){

        clearTimeout(timerId);
        elapsedTime = getNowTime();
        console.log('time left:' + elapsedTime);

        // unable to use stop button and enable to use start button
        this.disabled = true;
        this.classList.add("deadBtn");
        this.classList.remove("btn");
        start.disabled = false;
        start.classList.add("btn");
        start.classList.remove("deadBtn");
    });

    // Button : Set time to Calcurate
    setTimer.addEventListener('click',function(){

        // get Time of TextBox
        let originTimeSplit = document.getElementById("time").value.split(':');
        let elapsedTime = Number(originTimeSplit[0]*60000) + Number(originTimeSplit[1]*1000) + Number(originTimeSplit[2]);

        updateTimetText(elapsedTime);

    });


    // Button : Plus/Minus Each Numbers
    teamAP1.addEventListener('click',function(){
        let teamA = "teamAscore"
        countPoint(teamA, 1);
    });

    teamBP1.addEventListener('click',function(){
        let teamB = "teamBscore"
        countPoint(teamB, 1);
    });

    teamAP2.addEventListener('click',function(){
        let teamA = "teamAscore"
        countPoint(teamA, 2);
    });

    teamBP2.addEventListener('click',function(){
        let teamB = "teamBscore"
        countPoint(teamB, 2);
    });

    teamAP3.addEventListener('click',function(){
        let teamA = "teamAscore"
        countPoint(teamA, 3);
    });

    teamBP3.addEventListener('click',function(){
        let teamB = "teamBscore"
        countPoint(teamB, 3);
    });

    teamAM1.addEventListener('click',function(){
        let teamA = "teamAscore"
        let nowScore = document.getElementById(teamA).textContent;
        if(Number(nowScore)!=0){
            countPoint(teamA, -1);
        }
    });

    teamBM1.addEventListener('click',function(){
        let teamB = "teamBscore"
        let nowScore = document.getElementById(teamB).textContent;
        if(Number(nowScore)!=0){
            countPoint(teamB, -1);
        }
    });

    teamATOU.addEventListener('click',function(){
        let teamA = "teamATOC"
        let nowTimeout = document.getElementById(teamA).textContent;
        if(Number(nowTimeout)>0){
            useTimeout(teamA);
        }
    });

    teamBTOU.addEventListener('click',function(){
        let teamB = "teamBTOC"
        let nowTimeout = document.getElementById(teamB).textContent;
        if(Number(nowTimeout)>0){
            useTimeout(teamB);
        }
    });

    teamAFP1.addEventListener('click',function(){
        let teamA = "teamAfoul"
        let nowFoul = document.getElementById(teamA).textContent;
        if(Number(nowFoul)<5){
            countFoul(teamA, 1);
        }
    });

        teamBFP1.addEventListener('click',function(){
        let teamB = "teamBfoul"
        let nowFoul = document.getElementById(teamB).textContent;
        if(Number(nowFoul)<5){
            countFoul(teamB, 1);
        }
    });

    teamAFM1.addEventListener('click',function(){
        let teamA = "teamAfoul"
        let nowFoul = document.getElementById(teamA).textContent;
        if(Number(nowFoul)!=0){
            countFoul(teamA, -1);
        }
    });

    teamBFM1.addEventListener('click',function(){
        let teamB = "teamBfoul"
        let nowFoul = document.getElementById(teamB).textContent;
        if(Number(nowFoul)!=0){
            countFoul(teamB, -1);
        }
    });

    reset.addEventListener('click',function(){
        resetAll();
    });

})();
