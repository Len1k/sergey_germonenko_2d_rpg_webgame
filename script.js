const canvas = document.querySelector('#gameCanvas');
const ctx = canvas.getContext('2d');
const heroNameInput = document.querySelector('#heroNameInput');
const classSelect = document.querySelector('#classSelect');
const startButton = document.querySelector('#startButton');
const healthValue = document.querySelector('#healthValue');
const willValue = document.querySelector('#willValue');
const xpValue = document.querySelector('#xpValue');
const coinValue = document.querySelector('#coinValue');
const sosiValue = document.querySelector('#sosiValue');
const artifactValue = document.querySelector('#artifactValue');
const layerName = document.querySelector('#layerName');
const questName = document.querySelector('#questName');
const message = document.querySelector('#message');
const logList = document.querySelector('#logList');
const partyList = document.querySelector('#partyList');
const inventoryList = document.querySelector('#inventoryList');
const craftButton = document.querySelector('#craftButton');
const newGameButton = document.querySelector('#newGameButton');
const battleDialog = document.querySelector('#battleDialog');
const battleTitle = document.querySelector('#battleTitle');
const battleText = document.querySelector('#battleText');
const attackButton = document.querySelector('#attackButton');
const debuffButton = document.querySelector('#debuffButton');
const artifactButton = document.querySelector('#artifactButton');
const endingDialog = document.querySelector('#endingDialog');
const endingResult = document.querySelector('#endingResult');

const tileSize = 64;
const artifactGoal = 5;
const directions = {
  ArrowUp: { x: 0, y: -1 }, KeyW: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 }, KeyS: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 }, KeyA: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }, KeyD: { x: 1, y: 0 },
};

const archetypes = {
  jabroni: { title: 'Джаброни', hp: 124, will: 84, coins: 8, attack: 28, skill: 'Кожаный суплекс', color: '#ffd166' },
  shaman: { title: 'Нейро-шаман', hp: 96, will: 122, coins: 12, attack: 22, skill: 'import joy', color: '#77ffc0' },
  crypto: { title: 'Крипто-омега', hp: 88, will: 92, coins: 42, attack: 19, skill: 'NFT-рывок', color: '#ff8fab' },
};

const layers = [
  {
    name: 'Слой 1: Офис',
    quest: 'Найти код 0 6 0 0 и флешку Глеба',
    palette: { floor: '#183f2a', wall: '#263552', portal: '#2a2f63' },
    map: [
      '##########', '#..A..E..#', '#.##.###.#', '#....#...#', '#.R#.#M#.#',
      '#..#...#.#', '#.###.#..#', '#E..A.#P.#', '#...#..C.#', '##########',
    ],
  },
  {
    name: 'Слой 2: Кибер-город',
    quest: 'Взломать вышку S.O.S.I. и найти FEDIL',
    palette: { floor: '#12384b', wall: '#2f314f', portal: '#35245e' },
    map: [
      '##########', '#..E..A..#', '#.##.##..#', '#...M#...#', '#.A#.#R#.#',
      '#..#...#.#', '#.##E.#..#', '#..C..#P.#', '#...#..A.#', '##########',
    ],
  },
  {
    name: 'Слой 3: Гачи-Верс',
    quest: 'Получить плащ непобедимости и пережить мем-инфекцию',
    palette: { floor: '#3c2447', wall: '#4d2c3f', portal: '#1f4575' },
    map: [
      '##########', '#A..E...R#', '#.##.##..#', '#...#..A.#', '#.E#M#.#.#',
      '#..#...#.#', '#.##..#..#', '#..A..#P.#', '#...#..C.#', '##########',
    ],
  },
  {
    name: 'Слой 4: Крипто-Стадион',
    quest: 'Сварить доширак озарения и освободить FEDIL',
    palette: { floor: '#27334f', wall: '#52324c', portal: '#5f4b1e' },
    map: [
      '##########', '#..E..A..#', '#.##.##R.#', '#...M#...#', '#.A#.#E#.#',
      '#..#...#.#', '#.##..#..#', '#..C..#P.#', '#...#..A.#', '##########',
    ],
  },
  {
    name: 'Слой 5: Задубенный Ангар',
    quest: 'Собрать танковые ключи и выбрать концовку',
    palette: { floor: '#3a3829', wall: '#28364c', portal: '#683232' },
    map: [
      '##########', '#A.E..A..#', '#.##.##..#', '#...M#...#', '#.E#.#R#.#',
      '#..#...#.#', '#.##..#..#', '#..A..#P.#', '#...#..C.#', '##########',
    ],
  },
];

const enemies = {
  E: ['Джаброни-пехота', 'S.O.S.I.-строка', 'Билли-рекурсия', 'Крипто-обезьяна'],
  M: ['Сегфолт-гигант', 'Серж-компилятор', 'Джакиро-дракон', 'Your Sweet Misery', 'Глеб Танкист'],
};

const resourceNames = {
  C: 'Битые пиксели',
  R: 'Бульон дебаггера',
  A: 'Танковый ключ',
};

let state;
let activeEnemy = null;

function readPositions(map, symbol) {
  const positions = [];
  map.forEach((row, y) => [...row].forEach((cell, x) => {
    if (cell === symbol) positions.push({ x, y });
  }));
  return positions;
}

function createInitialState() {
  const archetype = archetypes[classSelect.value];
  const name = sanitizeHeroName(heroNameInput.value);

  return {
    name,
    archetypeKey: classSelect.value,
    hero: { x: 1, y: 1, hp: archetype.hp, maxHp: archetype.hp, will: archetype.will, maxWill: archetype.will, xp: 0, coins: archetype.coins, sosi: 0 },
    layerIndex: 0,
    turn: 0,
    finished: false,
    party: ['Ярик'],
    inventory: { 'Битые пиксели': 0, 'Бульон дебаггера': 0, 'Специи Гачи': 0, 'Танковый ключ': 0, 'Священный доширак': 0 },
    artifacts: [],
    entities: createLayerEntities(0),
  };
}

function sanitizeHeroName(value) {
  const normalized = value.trim();
  if (normalized === 'sudo rm -rf /') return 'Не шали';
  return normalized || 'Избранный';
}

function createLayerEntities(layerIndex) {
  const map = layers[layerIndex].map;
  const enemiesOnLayer = [...readPositions(map, 'E'), ...readPositions(map, 'M')].map((position, index) => {
    const boss = map[position.y][position.x] === 'M';
    return {
      ...position,
      id: `${layerIndex}-${index}`,
      boss,
      name: boss ? enemies.M[layerIndex] : enemies.E[index % enemies.E.length],
      hp: boss ? 72 + layerIndex * 18 : 42 + layerIndex * 10,
      maxHp: boss ? 72 + layerIndex * 18 : 42 + layerIndex * 10,
    };
  });

  return {
    resources: ['C', 'R', 'A'].flatMap((symbol) => readPositions(map, symbol).map((position) => ({ ...position, symbol, name: resourceNames[symbol] }))),
    enemies: enemiesOnLayer,
    portal: readPositions(map, 'P')[0],
  };
}

function resetGame() {
  state = createInitialState();
  logList.innerHTML = '';
  addLog(`${state.name} входит в Deep Dream Protocol как ${archetypes[state.archetypeKey].title}.`);
  setMessage('Найди ресурсы, победи глитчи, собирай артефакты слоёв и открывай разрывы кода.');
  updateHud();
  draw();
}

function setMessage(text) { message.textContent = text; }

function addLog(text) {
  const item = document.createElement('li');
  item.textContent = text;
  logList.append(item);
  while (logList.children.length > 10) logList.firstElementChild.remove();
}

function updateHud() {
  const layer = layers[state.layerIndex];
  healthValue.textContent = `${Math.max(0, state.hero.hp)} / ${state.hero.maxHp}`;
  willValue.textContent = `${Math.max(0, state.hero.will)} / ${state.hero.maxWill}`;
  xpValue.textContent = state.hero.xp;
  coinValue.textContent = state.hero.coins;
  sosiValue.textContent = `${state.hero.sosi}%`;
  artifactValue.textContent = `${state.artifacts.length} / ${artifactGoal}`;
  layerName.textContent = layer.name;
  questName.textContent = `Квест: ${layer.quest}`;
  partyList.innerHTML = state.party.map((member) => `<span class="pill">${member}</span>`).join('');
  inventoryList.innerHTML = Object.entries(state.inventory)
    .filter(([, count]) => count > 0)
    .map(([name, count]) => `<span class="item-pill">${name}: ${count}</span>`)
    .join('') || '<span class="item-pill">Пусто</span>';
}

function currentMap() { return layers[state.layerIndex].map; }
function tileAt(x, y) { return currentMap()[y]?.[x] ?? '#'; }
function samePosition(a, b) { return a.x === b.x && a.y === b.y; }

function moveHero(direction) {
  if (state.finished || battleDialog.open || endingDialog.open) return;

  const next = { x: state.hero.x + direction.x, y: state.hero.y + direction.y };
  if (tileAt(next.x, next.y) === '#') {
    state.turn += 1;
    state.hero.sosi = Math.min(100, state.hero.sosi + 2);
    setMessage('Стена памяти не пускает дальше. Сосисочность слегка растёт.');
    updateHud();
    return;
  }

  state.hero.x = next.x;
  state.hero.y = next.y;
  state.turn += 1;
  resolveTileEvents();
  updateHud();
  draw();
}

function resolveTileEvents() {
  const resourceIndex = state.entities.resources.findIndex((resource) => samePosition(resource, state.hero));
  if (resourceIndex !== -1) {
    const [resource] = state.entities.resources.splice(resourceIndex, 1);
    state.inventory[resource.name] += 1;
    state.hero.xp += 8;
    state.hero.coins += resource.symbol === 'A' ? 6 : 3;
    if (resource.symbol === 'A') unlockArtifact(`Артефакт слоя ${state.layerIndex + 1}`);
    if (resource.symbol === 'R') state.inventory['Специи Гачи'] += 1;
    setMessage(`Получен ресурс: ${resource.name}. Его можно использовать для крафта и концовок.`);
    addLog(`${state.name} подбирает ${resource.name}.`);
    return;
  }

  const enemy = state.entities.enemies.find((target) => samePosition(target, state.hero));
  if (enemy) {
    startBattle(enemy);
    return;
  }

  if (tileAt(state.hero.x, state.hero.y) === 'R') {
    ramenSaveRitual();
    return;
  }

  if (samePosition(state.entities.portal, state.hero)) {
    usePortal();
    return;
  }

  if (state.turn % 7 === 0) triggerMemeInfection();
  else setMessage('Слой шумит модемом 56k. Где-то рядом мерцает скрытая строка судьбы.');
}

function unlockArtifact(name) {
  if (!state.artifacts.includes(name)) state.artifacts.push(name);
}

function startBattle(enemy) {
  activeEnemy = enemy;
  battleTitle.textContent = enemy.boss ? `Босс: ${enemy.name}` : `Бой: ${enemy.name}`;
  battleText.textContent = `${enemy.name} блокирует путь. HP врага: ${enemy.hp}/${enemy.maxHp}.`;
  battleDialog.showModal();
}

function performBattleAction(action) {
  if (!activeEnemy) return;

  const archetype = archetypes[state.archetypeKey];
  let damage = archetype.attack + Math.floor(Math.random() * 9) + Math.floor(state.hero.xp / 40);
  let response = 10 + state.layerIndex * 3 + Math.floor(Math.random() * 8);

  if (action === 'debuff') {
    damage = Math.floor(damage * 0.65);
    response = Math.max(2, response - 9);
    state.hero.will = Math.min(state.hero.maxWill, state.hero.will + 6);
  }

  if (action === 'artifact') {
    if (state.inventory['Священный доширак'] > 0) {
      state.inventory['Священный доширак'] -= 1;
      damage += 34;
      state.hero.hp = Math.min(state.hero.maxHp, state.hero.hp + 24);
      state.hero.will = Math.min(state.hero.maxWill, state.hero.will + 24);
    } else {
      damage = Math.floor(damage * 0.5);
      response += 4;
    }
  }

  activeEnemy.hp -= damage;
  state.hero.sosi = Math.min(100, state.hero.sosi + (state.archetypeKey === 'jabroni' ? 7 : 4));

  if (activeEnemy.hp <= 0) {
    const reward = activeEnemy.boss ? 46 : 20;
    state.hero.xp += reward;
    state.hero.coins += activeEnemy.boss ? 24 : 9;
    if (activeEnemy.boss) unlockArtifact(`Сигнатура босса ${state.layerIndex + 1}`);
    state.entities.enemies = state.entities.enemies.filter((enemy) => enemy.id !== activeEnemy.id);
    battleText.textContent = `${activeEnemy.name} рассыпается на глитчи. Получено ${reward} опыта.`;
    addLog(`Победа над ${activeEnemy.name}.`);
    activeEnemy = null;
    closeBattleSoon();
    return;
  }

  state.hero.hp -= response;
  state.hero.will -= activeEnemy.boss ? 8 : 3;
  battleText.textContent = `${archetype.skill}: -${damage} HP врагу. Ответный глитч: -${response} HP. У врага осталось ${activeEnemy.hp}.`;

  if (state.hero.hp <= 0 || state.hero.will <= 0 || state.hero.sosi >= 100) {
    state.finished = true;
    battleText.textContent = 'Протокол захватил управление. Нажми «Новая симуляция», чтобы восстановить ветку судьбы.';
    addLog('Симуляция завершилась аварийным протоколом.');
    activeEnemy = null;
    closeBattleSoon();
  }

  updateHud();
  draw();
}

function closeBattleSoon() {
  setTimeout(() => {
    if (battleDialog.open) battleDialog.close();
    updateHud();
    draw();
  }, 900);
}

function ramenSaveRitual() {
  const perfect = 3 + Math.floor(Math.random() * 2);
  const guess = Number(window.prompt('Ритуал доширака: введи время заваривания от 1 до 5 минут', '3'));
  if (guess === perfect) {
    state.hero.hp = state.hero.maxHp;
    state.hero.will = state.hero.maxWill;
    state.inventory['Священный доширак'] += 1;
    setMessage('Идеальный доширак! HP и воля восстановлены, сохранение записано в ноосферу.');
    addLog('Ритуал сохранения прошёл идеально.');
  } else {
    state.hero.will = Math.max(1, state.hero.will - 8);
    setMessage(`Доширак вышел спорным. Правильное время было ${perfect}. Но прогресс всё равно запомнен.`);
    addLog('Ритуал сохранения дал странный привкус.');
  }
}

function usePortal() {
  if (state.entities.enemies.some((enemy) => enemy.boss)) {
    setMessage('Разрыв кода закрыт: сначала нужно победить босса слоя.');
    addLog('Портал требует сигнатуру босса.');
    return;
  }

  if (state.layerIndex === layers.length - 1) {
    if (state.artifacts.length >= artifactGoal) showEndingDialog();
    else setMessage('Финальная консоль требует 5 артефактов слоёв. Ищи танковые ключи и сигнатуры боссов.');
    return;
  }

  state.layerIndex += 1;
  state.hero.x = 1;
  state.hero.y = 1;
  state.entities = createLayerEntities(state.layerIndex);
  state.hero.sosi = Math.max(0, state.hero.sosi - 12);
  recruitByLayer();
  setMessage(`Переход выполнен: ${layers[state.layerIndex].name}. Реальность подгружает новые правила.`);
  addLog(`Открыт ${layers[state.layerIndex].name}.`);
}

function recruitByLayer() {
  const recruits = ['FEDIL', 'Сергей Гермоненко', 'Глеб Танкист'];
  const recruit = recruits[state.layerIndex - 1];
  if (recruit && state.party.length < 3 && !state.party.includes(recruit)) state.party.push(recruit);
}

function craftRamen() {
  if (state.inventory['Бульон дебаггера'] > 0 && state.inventory['Специи Гачи'] > 0 && state.hero.coins >= 10) {
    state.inventory['Бульон дебаггера'] -= 1;
    state.inventory['Специи Гачи'] -= 1;
    state.hero.coins -= 10;
    state.inventory['Священный доширак'] += 1;
    setMessage('Священный доширак готов: в бою он лечит и усиливает код-атаку.');
    addLog('Скрафчен Священный доширак озарения.');
  } else {
    setMessage('Нужны Бульон дебаггера, Специи Гачи и 10 мем-монет.');
  }
  updateHud();
}

function triggerMemeInfection() {
  const events = [
    () => { state.hero.coins += 12; return 'Мем-инфекция «Суперглеб»: найдено 12 мем-монет, но интерфейс дрожит.'; },
    () => { state.hero.will = Math.min(state.hero.maxWill, state.hero.will + 10); return 'Мем-инфекция «Это сон, бро»: воля к коду восстановлена.'; },
    () => { state.hero.sosi = Math.min(100, state.hero.sosi + 9); return 'Скрытая S.O.S.I.-строка ускорила тревожный счётчик.'; },
  ];
  const text = events[Math.floor(Math.random() * events.length)]();
  setMessage(text);
  addLog(text);
}

function showEndingDialog() {
  endingResult.textContent = '';
  endingDialog.showModal();
}

function chooseEnding(type) {
  const endings = {
    python: 'Концовка Python: FEDIL запускает print("Свобода"), и ноосфера становится открытой школой нейросетей.',
    cpp: 'Концовка C++: реальность компилируется в reality.exe. Багов меньше, правил больше.',
    tank: 'Великое Задубение: карта превращается в бесконечный ангарный симулятор с танками.',
    merge: 'Секретное слияние: merge --squash объединяет протоколы в добрый цифровой рай из мемов и чистого кода.',
  };
  endingResult.textContent = endings[type];
  state.finished = true;
  addLog(endings[type]);
  setMessage(endings[type]);
  updateHud();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const layer = layers[state.layerIndex];
  currentMap().forEach((row, y) => [...row].forEach((cell, x) => drawTile(x, y, cell, layer.palette)));
  state.entities.resources.forEach((resource) => drawEmoji(resource.x, resource.y, resource.symbol === 'A' ? '🔑' : resource.symbol === 'R' ? '🍜' : '💾'));
  state.entities.enemies.forEach((enemy) => drawEmoji(enemy.x, enemy.y, enemy.boss ? '👾' : '⚠️'));
  drawEmoji(state.entities.portal.x, state.entities.portal.y, '🌀');
  drawHero();
}

function drawTile(x, y, cell, palette) {
  const px = x * tileSize;
  const py = y * tileSize;
  const isWall = cell === '#';
  const isPortal = cell === 'P';
  ctx.fillStyle = isWall ? palette.wall : isPortal ? palette.portal : palette.floor;
  ctx.fillRect(px, py, tileSize, tileSize);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.065)';
  ctx.strokeRect(px, py, tileSize, tileSize);
  if (!isWall) {
    ctx.fillStyle = 'rgba(119, 255, 192, 0.12)';
    ctx.fillRect(px + 12, py + 12, 8, 8);
    ctx.fillRect(px + 42, py + 36, 6, 6);
  }
}

function drawHero() {
  const { x, y } = state.hero;
  const archetype = archetypes[state.archetypeKey];
  const px = x * tileSize;
  const py = y * tileSize;
  ctx.fillStyle = archetype.color;
  ctx.beginPath();
  ctx.arc(px + 32, py + 25, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#4dabf7';
  ctx.fillRect(px + 18, py + 40, 28, 16);
  ctx.fillStyle = '#06101d';
  ctx.fillRect(px + 25, py + 22, 4, 4);
  ctx.fillRect(px + 36, py + 22, 4, 4);
}

function drawEmoji(x, y, emoji) {
  ctx.font = '34px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'Digit1') performBattleAction('attack');
  if (event.code === 'Digit2') performBattleAction('debuff');
  if (event.code === 'Digit3') performBattleAction('artifact');
  const direction = directions[event.code];
  if (!direction) return;
  event.preventDefault();
  moveHero(direction);
});

document.querySelectorAll('[data-move]').forEach((button) => {
  const move = button.dataset.move;
  const direction = { up: directions.ArrowUp, down: directions.ArrowDown, left: directions.ArrowLeft, right: directions.ArrowRight }[move];
  button.addEventListener('click', () => moveHero(direction));
});

attackButton.addEventListener('click', () => performBattleAction('attack'));
debuffButton.addEventListener('click', () => performBattleAction('debuff'));
artifactButton.addEventListener('click', () => performBattleAction('artifact'));
craftButton.addEventListener('click', craftRamen);
startButton.addEventListener('click', resetGame);
newGameButton.addEventListener('click', resetGame);
document.querySelectorAll('[data-ending]').forEach((button) => button.addEventListener('click', () => chooseEnding(button.dataset.ending)));

resetGame();
