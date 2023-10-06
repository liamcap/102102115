class Player {
  constructor(name, initialMoney) {
    this.name = name;
    this.money = initialMoney;
    this.freeDiceNumber = 5;
    this.lockedDices = [];
    this.dices = Array(this.freeDiceNumber).fill(0);
    this.score = 0;
  }

  rollDice() {
    for (let i = 0; i < this.freeDiceNumber; i++) {
      this.dices[i] = Math.floor(Math.random() * 6) + 1;
    }
  }

  showDices() {
    return this.dices;
  }

  lockDice(indices) {
    for (let i = 1; i <= this.freeDiceNumber; i++) {
      if (!indices.includes(i)) {
        this.dices[i - 1] = -1;
      }
    }

    for (let i = 0; i < this.freeDiceNumber; i++) {
      if (this.dices[i] != -1) {
        this.lockedDices.push(this.dices[i]);
      }
    }
    this.lockedDices.sort();
    if (indices.length === 1 && indices[0] === -1) {
      // pass
    } else {
      this.freeDiceNumber -= indices.length;
    }
  }

  getLockedDices() {
    return this.lockedDices;
  }

  resetLockedDice() {
    this.lockedDices = [];
  }

  resetDices() {
    this.dices = Array(this.freeDiceNumber).fill(0);
  }

  scoreCalculate() {
    const bonus = [];
    for (const dice of this.getLockedDices()) {
      this.score += dice;
    }
    const counts = new Array(7).fill(0);

    for (const dice of this.getLockedDices()) {
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
class AIPlayer extends Player {
  constructor(name, initialMoney) {
    super(name, initialMoney);
  }

  // 自动选择要锁定的骰子
  autoCreateIndices() {
    const indices = [];
    if (this.freeDiceNumber > 0) {
      // const randomIndex = Math.floor(Math.random() * this.freeDiceNumber);
      // this.indices.push(randomIndex + 1);
      const randomrange = Math.floor(Math.random() * this.freeDiceNumber); //在手中有的骰子中随机选几个
      for (let i = 0; i < randomrange; i++) {
        let randomIndex = Math.floor(Math.random() * this.freeDiceNumber) + 1; //随机生成要锁定的索引
        if (!indices.includes(randomIndex))
          //如果不存在就加入
          indices.push(randomIndex);
      }
    }
    // if(indices.length === 0){
    //   indices = [];
    // }
    return indices;
  }

  // 自动选择倍率
  autoChooseRate() {
    return Math.floor(Math.random() * 4); // 随机选择0、1、2、3中的一个倍率
  }
}

function playGame(numRounds, initialMoney) {
  const numPlayers = 1;
  const players = [];
  const aiPlayers = [];

  for (let i = 0; i < numPlayers; i++) {
    const name = prompt(`请输入玩家的名称：`);
    const player = new Player(name, initialMoney);
    players.push(player);
  }

  const aiPlayer = new AIPlayer("ai", initialMoney);
  aiPlayers.push(aiPlayer);
  players.push(aiPlayer);

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
        let indices = [];
        if (player instanceof AIPlayer) {
          // 如果是ai玩家
          indices = player.autoCreateIndices();
          alert(`索引为${indices}`);
          // player.lockDice(indices)
        } else {
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
        }
        player.lockDice(indices);
        alert(`${player.name}锁定的骰子：${player.getLockedDices()}`);
        while (true) {
          try {
            let rateInput;
            if (player instanceof AIPlayer) {
              rateInput = player.autoChooseRate();
              alert(`${player.name}选择了倍率${rateInput}`);
            } else {
              rateInput = prompt(
                `请输入${player.name}要增加的倍率(0、1、2、3)：`
              );
              if (rateInput === null || rateInput.trim() === "") {
                throw new Error("输入不能为空");
              }
              rateInput = parseInt(rateInput, 10);
              if (isNaN(rateInput) || ![0, 1, 2, 3].includes(rateInput)) {
                throw new Error("请输入有效的倍率 (0、1、2、3)");
              }
            }
            rateAdd = rateInput;
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
  const gameRound = parseInt(prompt("请输入游戏局数："), 10);
  const money = parseInt(prompt("请输入每位玩家初始筹码："), 10);
  playGame(gameRound, money);
}

main();
