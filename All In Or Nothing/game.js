var rollButton = document.getElementById("btn");
var diceElements = document.getElementsByClassName("dice");
var diceImages = [...document.querySelectorAll(".dice img")];
var bg = document.getElementById("bg");
var nextmove = document.getElementById("nextmove");
var jiabei0 = document.getElementById("jiabei0");
var jiabei1 = document.getElementById("jiabei1");
var jiabei2 = document.getElementById("jiabei2");
var jiabei3 = document.getElementById("jiabei3");

var numPlayers = 0;
var players = [];
var currentMultiplier = 1;

class Player {
  constructor(name, initialMoney) {
    this.name = name;
    this.money = initialMoney;
    this.freeDiceNumber = 5;
    this.lockedDices = [false, false, false, false, false];
    this.dices = Array(this.freeDiceNumber).fill(1);
    this.score = 0;
    this.isRobot = false;
  }

  setDice(points) {
    this.dices = points;
  }

  showDices() {
    return this.dices;
  }

  getLockedDices() {
    return this.lockedDices;
  }

  resetLockedDice() {
    for (let i = 0; i < 5; i++) {
      Object.defineProperty(this.lockedDices, i, {
        writable: true,
      });
      this.lockedDices[i] = false;
    }
    // this.lockedDices = [false, false, false, false, false];
  }

  resetDices() {
    this.dices = Array(this.freeDiceNumber).fill(1);
  }

  scoreCalculate() {
    const bonus = [];
    this.score = 0;
    for (const dice of this.dices) {
      this.score += dice;
    }
    const counts = new Array(7).fill(0);

    for (const dice of this.dices) {
      counts[dice]++;
    }

    bonus.push(doubleDouble(counts) || 0);
    bonus.push(triple(counts) || 0);
    bonus.push(hulu(counts) || 0);
    bonus.push(quadruple(counts) || 0);
    bonus.push(quintuple(counts) || 0);
    bonus.push(smallSequence(counts) || 0);
    bonus.push(bigSequence(counts) || 0);

    for (const b of bonus) {
      this.score += b;
    }

    return this.score;
  }
}

// 绑定加倍按钮点击事件
var multiplierButtons = document.querySelectorAll(
  "#jiabei0, #jiabei1, #jiabei2, #jiabei3"
);

// 随机生成一个骰子点数
function rollDice(lockdices) {
  //加入参数读取玩家的骰子
  let points = [];
  for (var i = 0; i < 5; i++) {
    if (!lockdices[i]) {
      //如果没有被锁
      var point = Math.floor(Math.random() * 6) + 1;
      points.push(point);
    } else {
      points.push(Number(diceImages[i].src.slice(-5, -4)));
    }
  }
  return points;
}

// 更新骰子图片
function updateDiceImages(points, lockedDices) {
  for (let i = 0; i < 5; i++) {
    diceImages[i].src = "./img/" + points[i] + ".png";
  }
  // for (let i = 0; i < 5; i++) {
  //   diceImages[i].style.filter =
  //     "brightness(150%) sepia(100%) hue-rotate(-20deg)";
  // }
  for (let i = 0; i < 5; i++) {
    if (lockedDices[i]) {
      //如果被锁住了，则变颜色
      diceImages[i].style.filter =
        "brightness(150%) sepia(100%) hue-rotate(-20deg)";
    } else {
      diceImages[i].style.filter = "none";
    }
  }
}

// 封面
$(document).ready(function () {
  $(".starting1").click(function () {
    $(".start").fadeOut(20);
    playGame(3, 1000, 1);
  });
});
$(document).ready(function () {
  $(".starting2").click(function () {
    $(".start").fadeOut(20);
    ksyx();
    playGame(zongjushu, chushiqian, chushibeilv);
  });
});
$(document).ready(function () {
  $(".starting3").click(function () {
    $(".start").fadeOut(20);
    playGame(3, 1000, 1);
  });
});
// 菜单
$(document).ready(function () {
  $("#caid").click(function () {
    $(".cd").slideToggle("slow");
  });
});

// 添加玩家
var a = 1; //玩家名称
function appendText() {
  numPlayers++;
  var txt1 =
    '<div class="wj" id="wj' +
    a +
    '">\
  <div class="wj1">玩家' +
    a +
    '</div>\
  <div class="chouma1" id="chouma' +
    a +
    '">筹码:</div>\
  <div class="def1" id="def' +
    a +
    '">得分:</div>\
  </div>'; // 通过 DOM 来创建文本
  $(".player").append(txt1); // 追加新元素
  // document.querySelector("#chouma"+i+"").textContent =  "筹码：" + 1000;
  a++;
}
var isbgclick = false;
// 减少玩家
$(document).ready(function () {
  $("#removeplayer").click(function () {
    if (a == 1) {
      return;
    }
    a--;
    numPlayers--;
    $("#wj" + a + "").remove();
  });
});

//bonus
function doubleDouble(counts) {
  if (counts[1] === 2) {
    return [2, 3, 4, 5, 6].some((num) => counts[num] === 2) ? 10 : 0;
  } else if (counts[2] === 2) {
    return [3, 4, 5, 6].some((num) => counts[num] === 2) ? 10 : 0;
  } else if (counts[3] === 2) {
    return [4, 5, 6].some((num) => counts[num] === 2) ? 10 : 0;
  } else if (counts[4] === 2) {
    return [5, 6].some((num) => counts[num] === 2) ? 10 : 0;
  } else if (counts[5] === 2) {
    return counts[6] === 2 ? 10 : 0;
  } else {
    return 0;
  }
}

function triple(counts) {
  for (let i = 1; i <= 6; i++) {
    if (counts[i] === 3) {
      for (let j = 1; j <= 6; j++) {
        if (i !== j && counts[j] === 1) {
          return 10;
        }
      }
    }
  }
  return 0;
}

function hulu(counts) {
  for (let i = 1; i <= 6; i++) {
    if (counts[i] === 3) {
      for (let j = 1; j <= 6; j++) {
        if (j !== i && counts[j] === 2) {
          return 20;
        }
      }
    }
  }
  return 0;
}

function quadruple(counts) {
  for (let i = 1; i <= 6; i++) {
    if (counts[i] === 4) {
      return 40;
    }
  }
  return 0;
}

function quintuple(counts) {
  for (let i = 1; i <= 6; i++) {
    if (counts[i] === 5) {
      return 100;
    }
  }
  return 0;
}

function smallSequence(counts) {
  if (
    counts[1] !== 0 &&
    counts[2] !== 0 &&
    counts[3] !== 0 &&
    counts[4] !== 0 &&
    counts[5] === 0
  ) {
    return 30;
  } else if (
    counts[2] !== 0 &&
    counts[3] !== 0 &&
    counts[4] !== 0 &&
    counts[5] !== 0 &&
    counts[6] === 0 &&
    counts[1] === 0
  ) {
    return 30;
  } else if (
    counts[3] !== 0 &&
    counts[4] !== 0 &&
    counts[5] !== 0 &&
    counts[6] !== 0 &&
    counts[2] === 0
  ) {
    return 30;
  } else {
    return 0;
  }
}

function bigSequence(counts) {
  if (
    counts[1] !== 0 &&
    counts[2] !== 0 &&
    counts[3] !== 0 &&
    counts[4] !== 0 &&
    counts[5] !== 0
  ) {
    return 60;
  } else if (
    counts[2] !== 0 &&
    counts[3] !== 0 &&
    counts[4] !== 0 &&
    counts[5] !== 0 &&
    counts[6] !== 0
  ) {
    return 60;
  } else {
    return 0;
  }
}

function reDistributeMoney() {
  const scores = {};
  for (const player of players) {
    scores[player.name] = player.score;
    // alert(`${player.name}的分数${scores[player.name]}，筹码${player.money}`);
  }
  const maxScore = Math.max(...Object.values(scores));
  // alert(`最高分是${maxScore}`);
  const isWinner = [];
  const notWinners = [];
  const winnersName = [];

  for (const player of players) {
    if (player.score === maxScore) {
      isWinner.push(player);
      winnersName.push(player.name);
    }
  }

  for (const player of players) {
    if (!isWinner.includes(player)) {
      notWinners.push(player);
    }
  }

  // alert(`最高分：${maxScore}，双方分数:${scores},赢家：${isWinner}`);
  if (isWinner.length < players.length) {
    // alert(`\n第${jushu}局游戏${winnersName}获胜！`);
    for (const player of players) {
      if (!isWinner.includes(player)) {
        for (const winner of isWinner) {
          const change =
            Math.abs(scores[player.name] - scores[winner.name]) *
            currentMultiplier;
          player.money -= change;
          winner.money += change;
          // alert(`${player.name}输给了${winner.name}，并交出了${change}筹码`);
          // alert(`${winner.name}的筹码${winner.money}`);
        }
      }
    }
  } else if (isWinner.length === players.length) {
    alert(`平局，本局无人获胜，筹码无变动。`);
  }

  for (const player of players) {
    if (player.money < 0) {
      alert(`${player.name}的筹码用尽,游戏结束！`);
      checkWinner();
    }
  }
}

function checkWinner() {
  const moneys = {};
  for (const player of players) {
    moneys[player.name] = player.money;
    // alert(`${player.name}的分数${scores[player.name]}，筹码${player.money}`);
  }
  const maxMoney = Math.max(...Object.values(moneys));
  // alert(`最高分是${maxScore}`);
  const isWinner = [];
  const notWinners = [];
  const winnersName = [];

  for (const player of players) {
    if (player.money === maxMoney) {
      isWinner.push(player);
      winnersName.push(player.name);
    }
  }

  for (const player of players) {
    if (!isWinner.includes(player)) {
      notWinners.push(player);
    }
  }

  if (isWinner.length < players.length) {
    // alert(`${winnersName}获胜！`);
    for (const winnerName of winnersName) {
      let numbers = winnerName.match(/\d+/g);
      let wanjia = "wj" + numbers[0];
      // alert(`${wanjia}`);
      document.getElementById(wanjia).style.color = "red";
    }
  } else if (isWinner.length === players.length) {
    alert(`平局，无人获胜`);
  }
}

function playGame(numRounds, initialMoney, initialRate) {
  var totalRounds = 1; //当前轮数
  var nowround = 1; //当前局数
  nextmove.disabled = true; //开局无法点击
  rollButton.disabled = true;
  nextmove.style.display = "none";
  rollButton.style.display = "none";
  jiabei0.style.display = "none";
  jiabei1.style.display = "none";
  jiabei2.style.display = "none";
  jiabei3.style.display = "none";

  bg.addEventListener("click", gameStart);

  function gameStart() {
    //每轮游戏开始初始化按钮
    // alert(`haha:${numRounds},sda:${initialMoney}`);
    if (a > 2) {
      //至少要两位玩家才能开始游戏
      currentMultiplier = initialRate;
      totalRounds = 1;
      document.getElementById("removeplayer").disabled = true;
      document.getElementById("addplayer").disabled = true;
      if (!isbgclick) {
        $(".cd").slideToggle("slow");
      }
      isbgclick = true;
      document.querySelector(".duiju .item:nth-child(2)").textContent =
        "当前轮数：" + totalRounds + "/3";
      document.querySelector(".duiju .item:nth-child(3)").textContent =
        "当前局数：" + nowround + "/" + numRounds;
      document.querySelector(".duiju .item:nth-child(4)").textContent =
        "当前倍率：" + initialRate;
      if (nowround <= numRounds) {
        //第一轮游戏开始
        if (nowround === 1) {
          //第一局游戏初始化加入玩家
          for (let i = 0; i < numPlayers; i++) {
            const name = "玩家" + String(i + 1);
            const player = new Player(name, initialMoney);
            players.push(player);
            let cmid = "chouma" + (i + 1);
            let scoreid = "def" + (i + 1);
            document.getElementById(cmid).innerHTML = "筹码:" + player.money;
            document.getElementById(scoreid).innerHTML = "得分:" + player.score;
          }
        }

        for (const player of players) {
          //初始化
          player.freeDiceNumber = 5;
          player.resetDices();
          player.score = 0;
          player.resetLockedDice();
        }
        for (let i = 0; i < players.length; i++) {
          let scoreid = "def" + (i + 1);
          document.getElementById(scoreid).innerHTML = "得分:" + 0;
        }
        //每局开始初始化图片
        document.getElementById("wj1").style.color = "blue";
        rollButton.disabled = false;
        currentMultiplier = initialRate;
        originrate = initialRate;
        let points = [1, 1, 1, 1, 1];
        let lockdices = [false, false, false, false, false];
        updateDiceImages(points, lockdices);
        isRollButtonClick = false;
        nextmove.disabled = true;
        rollButton.style.display = "block";
        // nextmove.style.display = "block";
        playernow = 0;
        bg.disabled = false;
        bg.style.display = "none";
        // alert(`cur:${currentMultiplier},ori:${originrate}`);
      }
    }
  }

  var playernow = 0; // 当前正在进行的玩家是哪位
  var isRollButtonClick = false;

  rollButton.addEventListener("click", function () {
    // alert("hah");
    let points = rollDice(players[playernow].lockedDices);
    let lockdices = players[playernow].lockedDices;
    players[playernow].setDice(points, lockdices);
    // alert(`${players[playernow].dices},${players[playernow].lockedDices}`);
    updateDiceImages(points, lockdices);
    // let cmid = "chouma" + playernow;
    let scoreid = "def" + (playernow + 1);
    // document.getElementById(cmid).innerHTML = "筹码:" + player.money;
    players[playernow].scoreCalculate();
    document.getElementById(scoreid).innerHTML =
      "得分:" + players[playernow].score;
    // alert(`${scoreid}`);
    rollButton.disabled = true; //每轮只能投掷一次
    nextmove.disabled = false; //投掷完才能进行下一轮
    isRollButtonClick = true;
    nextmove.style.display = "block";
    rollButton.style.display = "none";
    if (totalRounds < 3) {
      jiabei0.style.display = "block";
      jiabei1.style.display = "block";
      jiabei2.style.display = "block";
      jiabei3.style.display = "block";
    }

    if (totalRounds === 3) {
      //第三轮
      for (let i = 0; i < 5; i++) {
        //确定完后锁定的骰子无法再改变
        if (!players[playernow].lockedDices[i]) {
          players[playernow].lockedDices[i] =
            !players[playernow].lockedDices[i];
        }
      }
      updateDiceImages(
        players[playernow].dices,
        players[playernow].lockedDices
      );
    }
  });

  //绑定骰子锁定解锁事件
  //当投掷完后才能锁定,第三轮投掷完直接锁定
  diceElements[1].disabled = true;
  for (let i = 0; i < 5; i++) {
    diceElements[i].addEventListener("click", function (event) {
      if (isRollButtonClick && totalRounds < 3) {
        //&& !players[playernow].lockedDices[i]
        var index = [...diceElements].indexOf(event.currentTarget);
        players[playernow].lockedDices[index] =
          !players[playernow].lockedDices[index];
        // alert(`${players[playernow].lockedDices}`);
        updateDiceImages(
          players[playernow].dices,
          players[playernow].lockedDices
        );
      }
    });
  }

  var originrate = initialRate;
  multiplierButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      originrate = currentMultiplier;
      // alert(`currentmultiplire:${currentMultiplier},originrate:${originrate}`);
      if (isRollButtonClick && totalRounds < 3) {
        originrate += index;
        // 更新当前倍率显示
        document.querySelector(".duiju .item:nth-child(4)").textContent =
          "当前倍率：" + originrate;
      }
    });
  });

  nextmove.addEventListener("click", function () {
    currentMultiplier = originrate;
    players[playernow].score = players[playernow].scoreCalculate();
    // alert(
    //   `${players[playernow].name}锁好了,他的分数是${players[playernow].score}`
    // );
    for (let i = 0; i < 5; i++) {
      //确定完后锁定的骰子无法再改变
      if (players[playernow].lockedDices[i]) {
        Object.defineProperty(players[playernow].lockedDices, i, {
          writable: false,
        });
      }
    }

    playernow++;
    if (playernow != players.length) {
      let wanjia = "wj" + (playernow + 1);
      document.getElementById(wanjia).style.color = "blue";
    } else if (totalRounds != 3) {
      document.getElementById("wj1").style.color = "blue";
    }
    let orwanjia = "wj" + playernow;
    document.getElementById(orwanjia).style.color = "black";
    if (playernow === players.length && totalRounds < 3) {
      //1,2轮最后一位玩家
      totalRounds++;
      document.querySelector(".duiju .item:nth-child(2)").textContent =
        "当前轮数：" + totalRounds + "/3";
      for (let i = 0; i < players.length; i++) {
        let scoreid = "def" + (i + 1);
        document.getElementById(scoreid).innerHTML = "得分:" + 0;
      }
      playernow = 0;
      rollButton.style.display = "block";
    }
    if (playernow === players.length && totalRounds === 3) {
      //第三轮轮最后一位玩家
      reDistributeMoney(nowround);
      for (let i = 0; i < players.length; i++) {
        let cmid = "chouma" + (i + 1);
        document.getElementById(cmid).innerHTML = "筹码:" + players[i].money;
        nextmove.style.display = "none";
      }
      bg.disabled = false;
      bg.style.display = "block";
      rollButton.style.display = "none";
      nowround += 1;
      playernow = 0;
    } else {
      rollButton.style.display = "block";
    }
    if (nowround === numRounds + 1) {
      bg.disabled = true;
      bg.style.display = "none";
      checkWinner();
      document.querySelector(".duiju .item:nth-child(4)").textContent =
        "当前倍率";
      document.querySelector(".duiju .item:nth-child(2)").textContent =
        "当前轮数";
      document.querySelector(".duiju .item:nth-child(3)").textContent =
        "当前局数";
      updateDiceImages([1, 1, 1, 1, 1], [false, false, false, false, false]);
    }
    updateDiceImages(players[playernow].dices, players[playernow].lockedDices); //更新到下一位玩家的骰子
    rollButton.disabled = false; //下一次玩家能投掷
    nextmove.disabled = true;
    isRollButtonClick = false;
    nextmove.style.display = "none";
    jiabei0.style.display = "none";
    jiabei1.style.display = "none";
    jiabei2.style.display = "none";
    jiabei3.style.display = "none";
  });
}

var zongjushu;
var chushiqian;
var chushibeilv;
function ksyx() {
  zongjushu = Number(document.querySelector('input[name="nub"]').value);
  chushiqian = Number(document.querySelector('input[name="money"]').value);
  chushibeilv = Number(document.querySelector('input[name="beil"]').value);
}
