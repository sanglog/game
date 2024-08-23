import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
  constructor() {
    this.hp = 100;
    this.str = 10;
  }

  attack(monster) {
    // 플레이어의 공격
    monster.hit(this.str);
  }

  hit(demage) {
    this.hp -= demage;
  }
  heal(stage) {
    this.hp = (this.hp + 30) * stage;
  }
  levelUp() {
    this.str += 10;
  }
}

class Monster {
  constructor() {
    this.hp = 100;
    this.str = 5;
  }

  attack(player) {
    // 몬스터의 공격
    player.hit(this.str);
  }

  hit(demage) {
    this.hp -= demage;
  }

  levelUp() {
    this.str += 5;
    this.hp += 15;
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright`\n=== Current Status ===`);
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
      chalk.blueBright(`| 플레이어 정보 hp : ${player.hp}, str : ${player.str}`) +
      chalk.redBright(`| 몬스터 정보 | hp : ${monster.hp}, str : ${monster.str}`),
  );
  console.log(chalk.magentaBright`=====================\n`);
}

const battle = async (stage, player, monster) => {
  let logs = [];
  if (stage >= 2) {
    player.heal(stage) + 30;

    player.levelUp();
    monster.levelUp();
  }

  while (player.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(chalk.green(`\n1. 공격한다 2. 도망치기.`));

    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리

    switch (choice) {
      case '1':
        logs.push(`${choice}를 선택하셨습니다.`);
        player.attack(monster);

        logs.push(chalk.green(`몬스터에게 ${player.str}만큼 공격하였습니다.`));
        monster.attack(player);
        logs.push(chalk.red(`몬스터에게 ${monster.str}만큼 공격당하였습니다.`));
        if (monster.hp <= 0) {
          console.log(chalk.green(`${stage}를 클리어했습니다.`));
        } else if (player.hp <= 0) {
          console.log(chalk.red(`${stage}에서 패배하셨습니다.`));
        }
        break;
      case '2':
        console.log(chalk.green(`${choice}를 선택하셨습니다.`));
        return true;
    }
    if (monster.hp <= 0) {
      break;
    }
  }
};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;
  let stopGame = false;

  while (stage <= 10 && stopGame !== true) {
    const monster = new Monster(stage);
    stopGame = await battle(stage, player, monster);
    console.log(stopGame);

    // 스테이지 클리어 및 게임 종료 조건

    stage++;
  }
}

startGame();
