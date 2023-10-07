function playGame(numRounds, initialMoney) {
  // const numPlayers = parseInt(prompt("请输入玩家数量："), 10);
  const numPlayers = 2;
  const players = [];

  for (let i = 0; i < numPlayers; i++) {
    // const name = prompt(`请输入玩家${i + 1}的名称：`);
    const name = "玩家" + String(i);
    const player = new Player(name, initialMoney);
    players.push(player);
  }

  let totalRounds = 0;
  while (totalRounds < numRounds) {
    let rate = 1;
    totalRounds++;
    alert(`\n第${totalRounds}局游戏开始！`);

    for (const player of players) {
      player.freeDiceNumber = 5;
      player.resetDices();
      player.score = 0;
      player.resetLockedDice();
    }

    for (let i = 0; i < 2; i++) {
      alert(`\n第${i + 1}轮投掷开始：`);
      for (const player of players) {
        player.resetDices();
        player.rollDice();
        alert(`${player.name}的骰子结果：${player.showDices()}`);
      }
      alert(`第${i + 1}轮投掷结束\n`);

      for (const player of players) {
        let indices;
        while (true) {
          if (player.freeDiceNumber === 0) {
            indices = [];
            break;
          }
          indices = prompt(
            `${player.name}的骰子结果：${player.showDices()},${
              player.name
            }已锁定的骰子：${player.getLockedDices()},请输入${
              player.name
            }要锁定的骰子索引（以空格分隔），或输入'-1'跳过锁定：`
          ).split(" ");
          if (indices.length === 1 && indices[0] === "-1") {
            indices = [];
            break;
          }
          try {
            indices = indices.map((index) => parseInt(index, 10));
            if (indices.length > 5) {
              alert("错误：最多只能锁定5个骰子");
              continue;
            }
            break;
          } catch (error) {
            alert("错误：请输入有效的骰子索引");
          }
        }
        player.lockDice(indices);
        alert(`${player.name}锁定的骰子：${player.getLockedDices()}`);
        while (true) {
          try {
            const rateInput = prompt(
              `请输入${player.name}要增加的倍率(0、1、2、3)：`
            );
            if (rateInput === null || rateInput.trim() === "") {
              throw new Error("输入不能为空");
            }
            rateAdd = parseInt(rateInput, 10);
            if (isNaN(rateAdd) || ![0, 1, 2, 3].includes(rateAdd)) {
              throw new Error("请输入有效的倍率 (0、1、2、3)");
            }
            rate += rateAdd;
            break;
          } catch (error) {
            alert(error.message);
          }
        }
        alert(`现在场上的倍率是${rate}\n`);
      }
    }

    alert("第3轮投掷开始：");
    for (const player of players) {
      player.resetDices();
      player.rollDice();
      alert(`\n${player.name}的最终投掷骰子结果：${player.showDices()}`);
      for (let i = 0; i < player.dices.length; i++) {
        player.lockedDices.push(player.dices[i]);
      }
      player.getLockedDices().sort();
    }

    const scores = {};

    for (const player of players) {
      alert(`${player.name}的最终骰子结果：${player.getLockedDices()}`);
      player.score = player.scoreCalculate();
      scores[player.name] = player.score;
      alert(`${player.name}的分数为：${player.score}`);
    }

    const maxScore = Math.max(...Object.values(scores));
    alert(`最高分是${maxScore}`);
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

    if (isWinner.length < players.length) {
      alert(`\n第${totalRounds}局游戏${winnersName}获胜！`);
      for (const player of players) {
        if (!isWinner.includes(player)) {
          for (const winner of isWinner) {
            const change =
              Math.abs(scores[player.name] - scores[winner.name]) * rate;
            player.money -= change;
            winner.money += change;
            alert(`${player.name}输给了${winner.name}，并交出了${change}筹码`);
          }
        }
      }
    } else if (isWinner.length === players.length) {
      alert(`\n平局，本局无人获胜，筹码无变动。`);
    }

    for (const player of players) {
      alert(`目前玩家${player.name}的筹码为${player.money}`);
    }

    const brokersName = [];

    for (const player of players) {
      if (player.money < 0) {
        brokersName.push(player.name);
      }
    }

    if (brokersName.length > 0) {
      alert(`由于玩家${brokersName}筹码用尽，玩家${winnersName}获得最终胜利`);
      break;
    }

    alert(`第${totalRounds}局游戏结束`);
  }

  alert("\n进入最终结算环节：");

  for (const player of players) {
    alert(`最终玩家${player.name}的筹码为${player.money}`);
  }

  const moneys = {};
  const lastWinner = [];

  for (const player of players) {
    moneys[player.name] = player.money;
  }

  const maxMoney = Math.max(...Object.values(moneys));
  alert(`最高筹码是${maxMoney}`);

  for (const player of players) {
    if (player.money === maxMoney) {
      lastWinner.push(player.name);
    }
  }

  alert(`最终的胜利者是${lastWinner}`);
}

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
    counts[6] === 0
  ) {
    return 30;
  } else if (
    counts[3] !== 0 &&
    counts[4] !== 0 &&
    counts[5] !== 0 &&
    counts[6] !== 0
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

function main() {
  // const gameRound = parseInt(prompt("请输入游戏局数："), 10);
  // const money = parseInt(prompt("请输入每位玩家初始筹码："), 10);
  const gameRound = 1;
  const money = 1000;
  playGame(gameRound, money);
}

var diceElements = document.getElementsByClassName("dice");
var diceImages = [...document.querySelectorAll(".dice img")];
var rollButton = document.getElementById("btn");

// 初始化骰子状态和倍率
var diceLocked = [false, false, false, false, false];
var currentMultiplier = 1;

// 随机生成一个骰子点数
function rollDice() {
  var points = [];
  for (var i = 0; i < 5; i++) {
    if (!diceLocked[i]) {
      var point = Math.floor(Math.random() * 6) + 1;
      points.push(point);
    } else {
      points.push(Number(diceImages[i].src.slice(-5, -4)));
    }
  }
  return points;
}

// 更新骰子图片
function updateDiceImages(points) {
  for (var i = 0; i < 5; i++) {
    diceImages[i].src = "./img/" + points[i] + ".png";
  }
}

// 绑定按钮点击事件
rollButton.addEventListener("click", function () {
  var points = rollDice();
  updateDiceImages(points);
});

// 绑定骰子锁定/解锁事件
for (var i = 0; i < 5; i++) {
  diceElements[i].addEventListener("click", function (event) {
    var index = [...diceElements].indexOf(event.currentTarget);
    diceLocked[index] = !diceLocked[index];
    event.currentTarget.classList.toggle("locked");
  });
}
 
// 绑定加倍按钮点击事件
var multiplierButtons = document.querySelectorAll("#jiabei0, #jiabei1, #jiabei2, #jiabei3");
multiplierButtons.forEach(function (button, index) {
  button.addEventListener("click", function () {
    currentMultiplier = index;
    // 更新当前倍率显示
    document.querySelector(".duiju .item:nth-child(4)").textContent = "当前倍率：" + index;
  });
});


main();
