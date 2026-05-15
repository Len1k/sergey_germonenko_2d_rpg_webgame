const canvas = document.querySelector('#gameCanvas');
const ctx = canvas.getContext('2d');
const heroNameInput = document.querySelector('#heroNameInput');
const classSelect = document.querySelector('#classSelect');
const startButton = document.querySelector('#startButton');
const loadButton = document.querySelector('#loadButton');
const healthValue = document.querySelector('#healthValue');
const willValue = document.querySelector('#willValue');
const xpValue = document.querySelector('#xpValue');
const coinValue = document.querySelector('#coinValue');
const sosiValue = document.querySelector('#sosiValue');
const actValue = document.querySelector('#actValue');
const artifactValue = document.querySelector('#artifactValue');
const branchValue = document.querySelector('#branchValue');
const layerName = document.querySelector('#layerName');
const questName = document.querySelector('#questName');
const message = document.querySelector('#message');
const branchPanel = document.querySelector('#branchPanel');
const actCard = document.querySelector('#actCard');
const objectiveList = document.querySelector('#objectiveList');
const logList = document.querySelector('#logList');
const sideQuestList = document.querySelector('#sideQuestList');
const factionList = document.querySelector('#factionList');
const skillList = document.querySelector('#skillList');
const partyList = document.querySelector('#partyList');
const inventoryList = document.querySelector('#inventoryList');
const achievementList = document.querySelector('#achievementList');
const craftButton = document.querySelector('#craftButton');
const newGameButton = document.querySelector('#newGameButton');
const questBoardButton = document.querySelector('#questBoardButton');
const atlasButton = document.querySelector('#atlasButton');
const skillButton = document.querySelector('#skillButton');
const raidButton = document.querySelector('#raidButton');
const codexButton = document.querySelector('#codexButton');
const soundButton = document.querySelector('#soundButton');
const newGamePlusButton = document.querySelector('#newGamePlusButton');
const talkButton = document.querySelector('#talkButton');
const syntaxButton = document.querySelector('#syntaxButton');
const campButton = document.querySelector('#campButton');
const pingButton = document.querySelector('#pingButton');
const battleDialog = document.querySelector('#battleDialog');
const battleTitle = document.querySelector('#battleTitle');
const battleText = document.querySelector('#battleText');
const attackButton = document.querySelector('#attackButton');
const debuffButton = document.querySelector('#debuffButton');
const artifactButton = document.querySelector('#artifactButton');
const dialogDialog = document.querySelector('#dialogDialog');
const dialogTitle = document.querySelector('#dialogTitle');
const dialogText = document.querySelector('#dialogText');
const dialogChoices = document.querySelector('#dialogChoices');
const atlasDialog = document.querySelector('#atlasDialog');
const atlasList = document.querySelector('#atlasList');
const skillDialog = document.querySelector('#skillDialog');
const skillPointText = document.querySelector('#skillPointText');
const skillDialogList = document.querySelector('#skillDialogList');
const raidDialog = document.querySelector('#raidDialog');
const raidDialogList = document.querySelector('#raidDialogList');
const questDialog = document.querySelector('#questDialog');
const questDialogList = document.querySelector('#questDialogList');
const codexDialog = document.querySelector('#codexDialog');
const codexList = document.querySelector('#codexList');
const campDialog = document.querySelector('#campDialog');
const campInput = document.querySelector('#campInput');
const campSendButton = document.querySelector('#campSendButton');
const campAnswer = document.querySelector('#campAnswer');
const endingDialog = document.querySelector('#endingDialog');
const endingResult = document.querySelector('#endingResult');

const tileSize = 64;
const artifactGoal = 10;
const saveKey = 'deep-dream-protocol-save-v2';
const directions = {
  ArrowUp: { x: 0, y: -1 }, KeyW: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 }, KeyS: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 }, KeyA: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }, KeyD: { x: 1, y: 0 },
};

const archetypes = {
  jabroni: { title: 'Джаброни', hp: 132, will: 88, coins: 8, attack: 30, skill: 'Кожаный суплекс', color: '#ffd166', passive: 'Суплексы дают +2 HP после победы.' },
  shaman: { title: 'Нейро-шаман', hp: 98, will: 132, coins: 12, attack: 23, skill: 'import joy', color: '#77ffc0', passive: 'Python-магия медленнее растит S.O.S.I.' },
  crypto: { title: 'Крипто-омега', hp: 88, will: 96, coins: 50, attack: 20, skill: 'NFT-рывок', color: '#ff8fab', passive: 'Больше мем-монет, но сильнее психоатаки.' },
};

const campaignActs = [
  { act: 0, title: 'Пролог — Синий экран смерти', layer: 'Офис', quest: 'Найти код 0 6 0 0, флешку Глеба и пережить сегфолт-гиганта.' },
  { act: 1, title: 'C++-ивация страны', layer: 'Кибер-город', quest: 'Взломать вышку S.O.S.I., помочь Python-кварталу и найти след FEDIL.' },
  { act: 2, title: 'Битва при Оверфлоу', layer: 'Гачи-Верс', quest: 'Сделать выбор стороны: Python, C++ или танковое Задубение.' },
  { act: 3, title: 'Код 0 6 0 0', layer: 'Санаторий / скрытый сервер', quest: 'Раскрыть, что S.O.S.I. управляет мемами и дофамином.' },
  { act: 4, title: 'Спасти FEDIL', layer: 'Крипто-Стадион', quest: 'Сварить доширак озарения и победить Your Sweet Misery в диалоговой дуэли.' },
  { act: 5, title: 'Центр Управления Реальностью', layer: 'Задубенный Ангар', quest: 'Собрать артефакты, остановить world_overhaul.sh и выбрать финал.' },
];

const layers = [
  {
    name: 'Слой 1: Офис', act: 0, quest: 'Найти код 0 6 0 0 и флешку Глеба',
    palette: { floor: '#183f2a', wall: '#263552', portal: '#2a2f63' },
    map: ['##########', '#..A..E..#', '#.##.###.#', '#....#...#', '#.R#.#M#.#', '#..#...#.#', '#.###.#..#', '#E..A.#P.#', '#...#..C.#', '##########'],
  },
  {
    name: 'Слой 2: Кибер-город', act: 1, quest: 'Взломать вышку S.O.S.I. и найти FEDIL',
    palette: { floor: '#12384b', wall: '#2f314f', portal: '#35245e' },
    map: ['##########', '#..E..A..#', '#.##.##..#', '#...M#...#', '#.A#.#R#.#', '#..#...#.#', '#.##E.#..#', '#..C..#P.#', '#...#..A.#', '##########'],
  },
  {
    name: 'Слой 3: Гачи-Верс', act: 2, quest: 'Выбрать сторону и добыть кожаный плащ непобедимости',
    palette: { floor: '#3c2447', wall: '#4d2c3f', portal: '#1f4575' },
    map: ['##########', '#A..E...R#', '#.##.##..#', '#...#..A.#', '#.E#M#.#.#', '#..#...#.#', '#.##..#..#', '#..A..#P.#', '#...#..C.#', '##########'],
  },
  {
    name: 'Слой 4: Крипто-Стадион', act: 4, quest: 'Сварить доширак озарения и освободить FEDIL',
    palette: { floor: '#27334f', wall: '#52324c', portal: '#5f4b1e' },
    map: ['##########', '#..E..A..#', '#.##.##R.#', '#...M#...#', '#.A#.#E#.#', '#..#...#.#', '#.##..#..#', '#..C..#P.#', '#...#..A.#', '##########'],
  },
  {
    name: 'Слой 5: Задубенный Ангар', act: 5, quest: 'Собрать танковые ключи, пережить world_overhaul.sh и выбрать концовку',
    palette: { floor: '#3a3829', wall: '#28364c', portal: '#683232' },
    map: ['##########', '#A.E..A..#', '#.##.##..#', '#...M#...#', '#.E#.#R#.#', '#..#...#.#', '#.##..#..#', '#..A..#P.#', '#...#..C.#', '##########'],
  },
];

const endlessLayer = {
  name: 'NG+: Бесконечная шиза', act: 6, quest: 'Процедурная охота за случайными боссами и мем-инфекциями',
  palette: { floor: '#1f2148', wall: '#442b5f', portal: '#2a6b58' },
  map: ['##########', '#A.E.RA..#', '#.##.##..#', '#..E#..C.#', '#.A#M#.#.#', '#..#...#.#', '#.##E.#..#', '#..A..#P.#', '#C..#..R.#', '##########'],
};

const enemies = {
  E: ['Джаброни-пехота', 'S.O.S.I.-строка', 'Билли-рекурсия', 'Баг-глитч', 'Крипто-обезьяна'],
  M: ['Сегфолт-гигант', 'Серж-компилятор', 'Джакиро-дракон', 'Your Sweet Misery', 'Глеб Танкист', 'Случайный мем-архонт'],
};

const resourceNames = { C: 'Битые пиксели', R: 'Бульон дебаггера', A: 'Танковый ключ' };
const branchTitles = { none: 'Не выбрана', python: 'Python свобода', cpp: 'C++ порядок', tank: 'Задубение' };

const sideQuestCatalog = [
  { id: 'office_chat', layer: 0, title: 'Найти код 0 6 0 0 в чате', need: { item: 'Битые пиксели', count: 1 }, reward: { xp: 18, coins: 8, artifact: 'Лог 0 6 0 0' } },
  { id: 'python_tower', layer: 1, title: 'Перепрошить S.O.S.I.-вышку', need: { item: 'Бульон дебаггера', count: 1 }, reward: { xp: 26, coins: 12, trust: 'FEDIL' } },
  { id: 'gachi_cloak', layer: 2, title: 'Собрать гачи-материалы для плаща', need: { item: 'Танковый ключ', count: 1 }, reward: { xp: 30, coins: 14, artifact: 'Гачи-нашивка' } },
  { id: 'crypto_ramen', layer: 3, title: 'Сварить доширак для FEDIL', need: { item: 'Священный доширак', count: 1 }, reward: { xp: 40, coins: 18, trust: 'FEDIL' } },
  { id: 'hangar_patch', layer: 4, title: 'Переписать world_overhaul.sh', need: { item: 'Танковый ключ', count: 2 }, reward: { xp: 55, coins: 25, artifact: 'Патч против Задубения' } },
];

const codexEntries = [
  { title: 'S.O.S.I.-строки', text: 'Протокол меметического управления. В игре выражен шкалой S.O.S.I.: при 100% симуляция проиграна.' },
  { title: 'FEDIL', text: 'Python-гуру и источник ветки свободы. Высокое доверие открывает мягкие финалы и цитатник.' },
  { title: 'Гермоненко', text: 'C++-архитектор компиляции реальности. Его ветка даёт HP и сильный порядок, но ускоряет тревогу.' },
  { title: 'Глеб Танкист', text: 'Инженер Задубения. Танковые ключи нужны для ангарной ветки и world_overhaul.sh.' },
  { title: 'Священный доширак', text: 'Главный сейв-ритуал и боевой артефакт: лечит, усиливает атаку и нужен в Крипто-Стадионе.' },
  { title: 'New Game+', text: 'После любой концовки открывается слой «Бесконечная шиза» с усиленным стартом и случайным мем-архонтом.' },
];

const soundtrack = [
  { layer: 0, name: 'Office BSOD — 56k dark ambient' },
  { layer: 1, name: 'Cyber City — pip install love chillstep' },
  { layer: 2, name: 'Gachi Verse — 8-bit gym remix' },
  { layer: 3, name: 'Crypto Stadium — melancholy synthwave' },
  { layer: 4, name: 'Frozen Hangar — tank industrial' },
  { layer: 5, name: 'Endless Shiza — procedural modem noise' },
];


const worldAtlas = [
  { layer: 0, region: 'Офис / Серверная', scale: 'пролог', nodes: ['Пустой open-space', 'Серверная сегфолта', 'Чат 0 6 0 0'] },
  { layer: 1, region: 'Python-квартал', scale: 'городской хаб', nodes: ['Школа тензоров', 'pip install love граффити', 'Площадь импортов'] },
  { layer: 1, region: 'C++-гетто', scale: 'опасный район', nodes: ['malloc-подвал', 'ферма S.O.S.I.', 'Башня 5G'] },
  { layer: 2, region: 'Гачи-Верс', scale: 'сюжетный данж', nodes: ['Бесконечный спортзал', 'Матовый лабиринт', 'Арена Джакиро'] },
  { layer: 3, region: 'Крипто-Стадион', scale: 'кульминация', nodes: ['Трибуны биткоина', 'Клетка FEDIL', 'Алтарь доширака'] },
  { layer: 4, region: 'Задубенный Ангар', scale: 'секретный эндгейм', nodes: ['Танковые доки', 'world_overhaul.sh', 'Комната красной кнопки'] },
  { layer: 5, region: 'Бесконечная шиза', scale: 'New Game+', nodes: ['Процедурные мемы', 'Случайный архонт', 'Сломанный портал'] },
];

const skillTree = [
  { id: 'python_aura', branch: 'python', title: 'import joy+', description: '+12 к максимальной воле и меньше урона по воле.', cost: 1 },
  { id: 'cpp_memory', branch: 'cpp', title: 'malloc fortress', description: '+16 к максимальному HP.', cost: 1 },
  { id: 'tank_engineer', branch: 'tank', title: 'Ангарный инженер', description: 'Рейды дешевле на 4 мем-монеты.', cost: 1 },
  { id: 'sosi_filter', branch: 'any', title: 'Анти-S.O.S.I. фильтр', description: 'Каждая победа снижает S.O.S.I. на 3%.', cost: 2 },
  { id: 'artifact_smith', branch: 'any', title: 'Артефактный крафтер', description: 'Крафт доширака даёт +6 опыта и шанс на битые пиксели.', cost: 2 },
  { id: 'dialog_oracle', branch: 'any', title: 'Оракул диалогов', description: 'Диалоги дают +1 дополнительное доверие.', cost: 2 },
];

const raidCatalog = [
  { id: 'renpy_station', layer: 1, title: 'Разбитая станция Ren\'Py', risk: 10, cost: 12, reward: { xp: 35, coins: 18, item: 'Битые пиксели', count: 2, faction: 'Глеб Танкист' } },
  { id: 'meme_market', layer: 1, title: 'Блошиный рынок мемов', risk: 8, cost: 10, reward: { xp: 28, coins: 22, item: 'Специи Гачи', count: 1, faction: 'Ярик' } },
  { id: 'sanatorium', layer: 3, title: 'Санаторий Заброшенный', risk: 18, cost: 18, reward: { xp: 55, coins: 25, item: 'Бульон дебаггера', count: 2, faction: 'FEDIL' } },
  { id: 'tank_docks', layer: 4, title: 'Танковые доки world_overhaul', risk: 24, cost: 24, reward: { xp: 70, coins: 34, item: 'Танковый ключ', count: 2, faction: 'Глеб Танкист' } },
];

const achievements = [
  { id: 'first_blood', title: 'Первый глитч', description: 'Победить первого врага.' },
  { id: 'fedil_free', title: 'Крылья PyTorch', description: 'Освободить FEDIL на Python-ветке.' },
  { id: 'sosi_survivor', title: 'S.O.S.I.-выживший', description: 'Дожить до 80% S.O.S.I. и не проиграть.' },
  { id: 'tank_keys', title: 'Суперглеб', description: 'Собрать 5 танковых ключей.' },
  { id: 'ramen_master', title: 'Доширак озарения', description: 'Скрафтить 3 священных доширака.' },
  { id: 'syntax_lord', title: 'Синтаксис судьбы', description: 'Выиграть 3 синтаксические дуэли.' },
  { id: 'all_endings', title: 'Архитектор реальностей', description: 'Открыть любую концовку и New Game+.' },
];

let state;
let activeEnemy = null;

function readPositions(map, symbol) {
  const positions = [];
  map.forEach((row, y) => [...row].forEach((cell, x) => {
    if (cell === symbol) positions.push({ x, y });
  }));
  return positions;
}

function createInitialState(isNewGamePlus = false) {
  const archetype = archetypes[classSelect.value];
  const name = sanitizeHeroName(heroNameInput.value);
  const layerIndex = isNewGamePlus ? layers.length : 0;
  return {
    name,
    archetypeKey: classSelect.value,
    hero: { x: 1, y: 1, hp: archetype.hp, maxHp: archetype.hp, will: archetype.will, maxWill: archetype.will, xp: isNewGamePlus ? 120 : 0, coins: archetype.coins + (isNewGamePlus ? 80 : 0), sosi: isNewGamePlus ? 25 : 0 },
    layerIndex,
    branch: 'none',
    turn: 0,
    kills: 0,
    syntaxWins: 0,
    ramenCrafted: 0,
    endings: [],
    newGamePlus: isNewGamePlus,
    soundEnabled: false,
    skillPoints: isNewGamePlus ? 3 : 1,
    finished: false,
    party: ['Ярик'],
    trust: { FEDIL: 0, 'Сергей Гермоненко': 0, 'Глеб Танкист': 0, Ярик: 2 },
    factions: { FEDIL: 0, 'Сергей Гермоненко': 0, 'Глеб Танкист': 0, Ярик: 2 },
    madness: { FEDIL: 1, 'Сергей Гермоненко': 2, 'Глеб Танкист': 2, Ярик: 0 },
    inventory: { 'Битые пиксели': 0, 'Бульон дебаггера': 0, 'Специи Гачи': 0, 'Танковый ключ': 0, 'Священный доширак': 0, 'Флешка с новеллой Глеба': 0, 'Кожаный плащ непобедимости': 0, 'Крылья PyTorch': 0 },
    artifacts: [],
    achievements: [],
    completedSideQuests: [],
    completedRaids: [],
    learnedSkills: [],
    entities: createLayerEntities(layerIndex),
  };
}

function sanitizeHeroName(value) {
  const normalized = value.trim();
  if (normalized === 'sudo rm -rf /') return 'Не шали';
  return normalized || 'Избранный';
}

function getLayer(index = state.layerIndex) {
  return index >= layers.length ? endlessLayer : layers[index];
}

function createLayerEntities(layerIndex) {
  const layer = getLayer(layerIndex);
  const map = layer.map;
  const enemiesOnLayer = [...readPositions(map, 'E'), ...readPositions(map, 'M')].map((position, index) => {
    const boss = map[position.y][position.x] === 'M';
    const bossIndex = layerIndex >= layers.length ? enemies.M.length - 1 : layerIndex;
    return {
      ...position,
      id: `${layerIndex}-${index}-${Math.random().toString(36).slice(2)}`,
      boss,
      name: boss ? enemies.M[bossIndex] : enemies.E[(index + layerIndex) % enemies.E.length],
      hp: boss ? 82 + layerIndex * 22 : 46 + layerIndex * 12,
      maxHp: boss ? 82 + layerIndex * 22 : 46 + layerIndex * 12,
    };
  });

  return {
    resources: ['C', 'R', 'A'].flatMap((symbol) => readPositions(map, symbol).map((position) => ({ ...position, symbol, name: resourceNames[symbol] }))),
    enemies: enemiesOnLayer,
    portal: readPositions(map, 'P')[0],
  };
}

function resetGame(isNewGamePlus = false, persist = true) {
  state = createInitialState(isNewGamePlus);
  logList.innerHTML = '';
  addLog(`${state.name} входит в Deep Dream Protocol как ${archetypes[state.archetypeKey].title}.`);
  addLog(`Пассивка: ${archetypes[state.archetypeKey].passive}`);
  setMessage('Цель: пройти акты, выбрать ветку, собрать 10 артефактов и решить судьбу цифровой реальности.');
  if (persist) saveGame();
  updateHud();
  draw();
}

function setMessage(text) { message.textContent = text; }

function addLog(text) {
  const item = document.createElement('li');
  item.textContent = text;
  logList.append(item);
  while (logList.children.length > 14) logList.firstElementChild.remove();
}

function updateHud() {
  const layer = getLayer();
  const act = campaignActs.find((item) => item.act === layer.act) || { title: 'NG+: Бесконечная шиза', quest: endlessLayer.quest };
  healthValue.textContent = `${Math.max(0, state.hero.hp)} / ${state.hero.maxHp}`;
  willValue.textContent = `${Math.max(0, state.hero.will)} / ${state.hero.maxWill}`;
  xpValue.textContent = state.hero.xp;
  coinValue.textContent = state.hero.coins;
  sosiValue.textContent = `${state.hero.sosi}%`;
  actValue.textContent = `${layer.act} / 5`;
  artifactValue.textContent = `${state.artifacts.length} / ${artifactGoal}`;
  branchValue.textContent = branchTitles[state.branch];
  layerName.textContent = layer.name;
  questName.textContent = `Квест: ${layer.quest}`;
  actCard.innerHTML = `<strong>${act.title}</strong><span>${act.quest}</span>`;
  sideQuestList.innerHTML = renderSideQuestSummary();
  soundButton.textContent = state.soundEnabled ? `Саундтрек: ${currentTrackName()}` : 'Саундтрек: выкл';
  factionList.innerHTML = renderFactions();
  skillList.innerHTML = renderSkills();
  objectiveList.innerHTML = buildObjectives().map((objective) => `<div class="objective ${objective.done ? 'done' : ''}">${objective.done ? '✓' : '•'} ${objective.text}</div>`).join('');
  partyList.innerHTML = state.party.map((member) => `<span class="pill">${member} · доверие ${state.trust[member] ?? 0}</span>`).join('');
  inventoryList.innerHTML = Object.entries(state.inventory)
    .filter(([, count]) => count > 0)
    .map(([name, count]) => `<span class="item-pill">${name}: ${count}</span>`)
    .join('') || '<span class="item-pill">Пусто</span>';
  achievementList.innerHTML = achievements.map((achievement) => `<span class="achievement ${state.achievements.includes(achievement.id) ? 'done' : ''}" title="${achievement.description}">${achievement.title}</span>`).join('');
  branchPanel.hidden = !(state.layerIndex === 2 && state.branch === 'none');
  newGamePlusButton.hidden = !state.endings.length;
}

function renderFactions() {
  return Object.entries(state.factions).map(([name, value]) => `<span class="faction-pill">${name}: ${value}</span>`).join('');
}

function renderSkills() {
  const learned = state.learnedSkills.length ? state.learnedSkills.map((id) => skillTree.find((skill) => skill.id === id)?.title || id).join(', ') : 'нет изученных навыков';
  return `<div class="skill-summary">Очки: ${state.skillPoints}. Изучено: ${learned}</div>`;
}

function renderSideQuestSummary() {
  const quests = sideQuestCatalog.filter((quest) => quest.layer === Math.min(state.layerIndex, layers.length - 1));
  return quests.map((quest) => {
    const done = state.completedSideQuests.includes(quest.id);
    return `<div class="side-quest ${done ? 'done' : ''}">${done ? '✓' : '•'} ${quest.title}</div>`;
  }).join('') || '<div class="side-quest">В этом слое доска молчит.</div>';
}

function buildObjectives() {
  return [
    { text: 'Победить босса слоя', done: !state.entities.enemies.some((enemy) => enemy.boss) },
    { text: 'Собрать хотя бы один артефакт или ключ', done: state.artifacts.length > 0 || state.inventory['Танковый ключ'] > 0 },
    { text: 'Выбрать ветку в Акте 2', done: state.layerIndex < 2 || state.branch !== 'none' },
    { text: 'Сварить Священный доширак до Крипто-Стадиона', done: state.layerIndex < 3 || state.inventory['Священный доширак'] > 0 || state.ramenCrafted > 0 },
    { text: `Подготовить ${artifactGoal} артефактов к финалу`, done: state.artifacts.length >= artifactGoal },
  ];
}

function currentMap() { return getLayer().map; }
function tileAt(x, y) { return currentMap()[y]?.[x] ?? '#'; }
function samePosition(a, b) { return a.x === b.x && a.y === b.y; }

function moveHero(direction) {
  if (state.finished || battleDialog.open || endingDialog.open || dialogDialog.open || campDialog.open) return;

  const next = { x: state.hero.x + direction.x, y: state.hero.y + direction.y };
  if (tileAt(next.x, next.y) === '#') {
    state.turn += 1;
    state.hero.sosi = Math.min(100, state.hero.sosi + 2);
    setMessage('Стена памяти не пускает дальше. S.O.S.I. слегка растёт.');
    updateHud();
    return;
  }

  state.hero.x = next.x;
  state.hero.y = next.y;
  state.turn += 1;
  resolveTileEvents();
  checkAchievements();
  updateHud();
  draw();
}

function resolveTileEvents() {
  const resourceIndex = state.entities.resources.findIndex((resource) => samePosition(resource, state.hero));
  if (resourceIndex !== -1) {
    collectResource(resourceIndex);
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

  if (state.turn % 11 === 0) syntaxChallenge();
  else if (state.turn % 7 === 0) triggerMemeInfection();
  else setMessage('Слой шумит модемом 56k. Скрытые строки судьбы ждут клика или диалога.');
}

function collectResource(resourceIndex) {
  const [resource] = state.entities.resources.splice(resourceIndex, 1);
  state.inventory[resource.name] += 1;
  state.hero.xp += 8;
  state.hero.coins += resource.symbol === 'A' ? 9 : 4;
  if (resource.symbol === 'A') unlockArtifact(`Танковый ключ слоя ${state.layerIndex + 1}`);
  if (resource.symbol === 'R') state.inventory['Специи Гачи'] += 1;
  if (resource.symbol === 'C' && state.inventory['Флешка с новеллой Глеба'] === 0 && state.layerIndex === 0) state.inventory['Флешка с новеллой Глеба'] = 1;
  setMessage(`Получен ресурс: ${resource.name}. Он влияет на крафт, финал и достижения.`);
  addLog(`${state.name} подбирает ${resource.name}.`);
}

function unlockArtifact(name) {
  if (!state.artifacts.includes(name)) state.artifacts.push(name);
}

function startBattle(enemy) {
  activeEnemy = enemy;
  battleTitle.textContent = enemy.boss ? `Босс: ${enemy.name}` : `Бой: ${enemy.name}`;
  battleText.textContent = `${enemy.name} блокирует путь. HP врага: ${enemy.hp}/${enemy.maxHp}. Выбери действие.`;
  battleDialog.showModal();
}

function performBattleAction(action) {
  if (!activeEnemy) return;

  const archetype = archetypes[state.archetypeKey];
  const branchBonus = state.branch === 'python' ? 4 : state.branch === 'cpp' ? 8 : state.branch === 'tank' ? 6 : 0;
  let damage = archetype.attack + branchBonus + learnedDamageBonus() + Math.floor(Math.random() * 10) + Math.floor(state.hero.xp / 45);
  let response = 11 + state.layerIndex * 3 + Math.floor(Math.random() * 8);

  if (action === 'debuff') {
    damage = Math.floor(damage * 0.7);
    response = Math.max(2, response - 10);
    state.hero.will = Math.min(state.hero.maxWill, state.hero.will + 7);
  }

  if (action === 'artifact') {
    if (state.inventory['Священный доширак'] > 0) {
      state.inventory['Священный доширак'] -= 1;
      damage += 38;
      state.hero.hp = Math.min(state.hero.maxHp, state.hero.hp + 28);
      state.hero.will = Math.min(state.hero.maxWill, state.hero.will + 28);
    } else {
      damage = Math.floor(damage * 0.5);
      response += 5;
    }
  }

  activeEnemy.hp -= damage;
  const sosiGain = state.archetypeKey === 'shaman' ? 3 : state.archetypeKey === 'jabroni' ? 7 : 5;
  state.hero.sosi = Math.min(100, state.hero.sosi + sosiGain);

  if (activeEnemy.hp <= 0) {
    winBattle(damage);
    return;
  }

  const willHit = activeEnemy.boss ? 9 : 3;
  state.hero.hp -= state.archetypeKey === 'crypto' ? response + 3 : response;
  state.hero.will -= Math.max(1, willHit - (state.learnedSkills.includes('python_aura') ? 2 : 0));
  battleText.textContent = `${archetype.skill}: -${damage} HP врагу. Ответный глитч: -${response} HP и -${willHit} воли. У врага осталось ${activeEnemy.hp}.`;

  if (state.hero.hp <= 0 || state.hero.will <= 0 || state.hero.sosi >= 100) failRun();
  updateHud();
  draw();
}

function winBattle(damage) {
  const reward = activeEnemy.boss ? 56 : 22;
  const defeatedName = activeEnemy.name;
  state.kills += 1;
  state.hero.xp += reward;
  state.hero.coins += activeEnemy.boss ? 28 : 10;
  if (state.archetypeKey === 'jabroni') state.hero.hp = Math.min(state.hero.maxHp, state.hero.hp + 2);
  if (state.learnedSkills.includes('sosi_filter')) state.hero.sosi = Math.max(0, state.hero.sosi - 3);
  if (activeEnemy.boss) {
    state.skillPoints += 1;
    unlockArtifact(`Сигнатура босса ${state.layerIndex + 1}`);
    applyBossReward();
  }
  state.entities.enemies = state.entities.enemies.filter((enemy) => enemy.id !== activeEnemy.id);
  battleText.textContent = `${defeatedName} рассыпается на глитчи после ${damage} урона. Получено ${reward} опыта.`;
  addLog(`Победа над ${defeatedName}.`);
  activeEnemy = null;
  checkAchievements();
  closeBattleSoon();
}

function applyBossReward() {
  if (state.layerIndex === 2) state.inventory['Кожаный плащ непобедимости'] = 1;
  if (state.layerIndex === 3) {
    state.inventory['Крылья PyTorch'] = 1;
    if (!state.party.includes('FEDIL')) state.party.push('FEDIL');
    state.trust.FEDIL += 3;
    unlockAchievement('fedil_free');
  }
}

function failRun() {
  state.finished = true;
  battleText.textContent = 'Протокол захватил управление. Нажми «Новая симуляция», чтобы восстановить ветку судьбы.';
  addLog('Симуляция завершилась аварийным протоколом.');
  activeEnemy = null;
  closeBattleSoon();
}

function closeBattleSoon() {
  setTimeout(() => {
    if (battleDialog.open) battleDialog.close();
    saveGame();
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
    state.ramenCrafted += 1;
    setMessage('Идеальный доширак! HP и воля восстановлены, прогресс записан в localStorage.');
    addLog('Ритуал сохранения прошёл идеально.');
  } else {
    state.hero.will = Math.max(1, state.hero.will - 8);
    setMessage(`Доширак вышел спорным. Правильное время было ${perfect}. Сейв всё равно обновлён.`);
    addLog('Ритуал сохранения дал странный привкус.');
  }
  saveGame();
}

function usePortal() {
  if (state.entities.enemies.some((enemy) => enemy.boss)) {
    setMessage('Разрыв кода закрыт: сначала нужно победить босса слоя.');
    addLog('Портал требует сигнатуру босса.');
    return;
  }

  if (state.layerIndex === 2 && state.branch === 'none') {
    branchPanel.hidden = false;
    setMessage('Акт 2 требует выбора стороны перед переходом дальше.');
    return;
  }

  if (state.layerIndex >= layers.length - 1) {
    if (state.artifacts.length >= artifactGoal || state.newGamePlus) showEndingDialog();
    else setMessage(`Финальная консоль требует ${artifactGoal} артефактов. Сейчас: ${state.artifacts.length}.`);
    return;
  }

  state.layerIndex += 1;
  state.hero.x = 1;
  state.hero.y = 1;
  state.entities = createLayerEntities(state.layerIndex);
  state.hero.sosi = Math.max(0, state.hero.sosi - 12);
  recruitByLayer();
  setMessage(`Переход выполнен: ${getLayer().name}. Реальность подгружает новые правила.`);
  addLog(`Открыт ${getLayer().name}.`);
  saveGame();
}

function recruitByLayer() {
  const recruits = ['FEDIL', 'Сергей Гермоненко', 'Глеб Танкист'];
  const recruit = recruits[state.layerIndex - 1];
  if (recruit && state.party.length < 4 && !state.party.includes(recruit)) state.party.push(recruit);
}

function chooseBranch(branch) {
  state.branch = branch;
  const branchEffects = {
    python: () => { state.hero.will += 20; state.trust.FEDIL += 3; if (!state.party.includes('FEDIL')) state.party.push('FEDIL'); return 'FEDIL сбрасывает цепи if scared. Открыта магия нейросетей.'; },
    cpp: () => { state.hero.maxHp += 20; state.hero.hp += 20; state.trust['Сергей Гермоненко'] += 3; if (!state.party.includes('Сергей Гермоненко')) state.party.push('Сергей Гермоненко'); return 'Гермоненко выделяет память под порядок. C++-атаки усилены.'; },
    tank: () => { state.hero.coins += 35; state.trust['Глеб Танкист'] += 3; if (!state.party.includes('Глеб Танкист')) state.party.push('Глеб Танкист'); return 'Глеб выдаёт чертёж ангара. Танковые ключи ценятся выше.'; },
  };
  const text = branchEffects[branch]();
  branchPanel.hidden = true;
  setMessage(text);
  addLog(`Выбрана ветка: ${branchTitles[branch]}. ${text}`);
  saveGame();
  updateHud();
}

function craftRamen() {
  if (state.inventory['Бульон дебаггера'] > 0 && state.inventory['Специи Гачи'] > 0 && state.hero.coins >= 10) {
    state.inventory['Бульон дебаггера'] -= 1;
    state.inventory['Специи Гачи'] -= 1;
    state.hero.coins -= 10;
    state.inventory['Священный доширак'] += 1;
    state.ramenCrafted += 1;
    if (state.learnedSkills.includes('artifact_smith')) {
      state.hero.xp += 6;
      if (Math.random() > 0.5) state.inventory['Битые пиксели'] += 1;
    }
    setMessage('Священный доширак готов: в бою лечит, усиливает код-атаку и нужен для дуэли с меланхолией.');
    addLog('Скрафчен Священный доширак озарения.');
  } else {
    setMessage('Нужны Бульон дебаггера, Специи Гачи и 10 мем-монет.');
  }
  checkAchievements();
  saveGame();
  updateHud();
}

function syntaxChallenge() {
  const challenges = [
    { q: 'Введи Python-команду свободы:', a: 'print("Свобода")' },
    { q: 'Введи команду слияния:', a: 'merge --squash' },
    { q: 'Введи код FEDIL:', a: '0 6 0 0' },
  ];
  const challenge = challenges[Math.floor(Math.random() * challenges.length)];
  const answer = window.prompt(challenge.q, challenge.a);
  if (answer === challenge.a) {
    state.syntaxWins += 1;
    state.hero.will = Math.min(state.hero.maxWill, state.hero.will + 14);
    state.hero.xp += 12;
    setMessage('Синтаксическая дуэль выиграна: воля и опыт выросли.');
    addLog('Игрок исправил синтаксическую ошибку судьбы.');
  } else {
    state.hero.sosi = Math.min(100, state.hero.sosi + 12);
    setMessage('Синтаксическая ошибка усилила S.O.S.I. и исказила интерфейс.');
    addLog('Провалена синтаксическая дуэль.');
  }
  checkAchievements();
  saveGame();
  updateHud();
}

function triggerMemeInfection() {
  const events = [
    () => { state.hero.coins += 12; return 'Мем-инфекция «Суперглеб»: найдено 12 мем-монет, но интерфейс дрожит.'; },
    () => { state.hero.will = Math.min(state.hero.maxWill, state.hero.will + 10); return 'Мем-инфекция «Это сон, бро»: воля к коду восстановлена.'; },
    () => { state.hero.sosi = Math.min(100, state.hero.sosi + 9); return 'Скрытая S.O.S.I.-строка ускорила тревожный счётчик.'; },
    () => { state.inventory['Битые пиксели'] += 1; return 'Мем-инфекция «Ass We Can»: враги спорят сами с собой, найден битый пиксель.'; },
  ];
  const text = events[Math.floor(Math.random() * events.length)]();
  setMessage(text);
  addLog(text);
}

function openDialogue() {
  const layer = getLayer();
  const speaker = state.branch === 'cpp' ? 'Сергей Гермоненко' : state.branch === 'tank' ? 'Глеб Танкист' : 'FEDIL';
  dialogTitle.textContent = `${speaker}: паттерн шизы`;
  dialogText.textContent = `${speaker} обсуждает акт «${layer.quest}». Доверие открывает баффы, безумие — риск S.O.S.I.`;
  dialogChoices.innerHTML = '';
  [
    { text: 'Попросить совет', trust: 1, madness: 0, result: 'NPC даёт подсказку к текущему порталу.' },
    { text: 'Спорить о протоколе', trust: 0, madness: 1, result: 'Спор добавляет опыта, но повышает безумие.' },
    { text: 'Показать цитатник FEDIL', trust: 2, madness: -1, result: 'Цитаты стабилизируют диалоговую ветку.' },
  ].forEach((choice) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = choice.text;
    button.addEventListener('click', () => {
      state.trust[speaker] = (state.trust[speaker] ?? 0) + choice.trust;
      state.madness[speaker] = Math.max(0, (state.madness[speaker] ?? 0) + choice.madness);
      state.hero.xp += choice.trust + 3;
      if (state.learnedSkills.includes('dialog_oracle')) state.trust[speaker] = (state.trust[speaker] ?? 0) + 1;
      dialogText.textContent = choice.result;
      addLog(`${speaker}: ${choice.result}`);
      saveGame();
      updateHud();
    });
    dialogChoices.append(button);
  });
  dialogDialog.showModal();
}



function learnedDamageBonus() {
  let bonus = 0;
  if (state.learnedSkills.includes('cpp_memory')) bonus += 2;
  if (state.learnedSkills.includes('tank_engineer')) bonus += 3;
  return bonus;
}

function openAtlas() {
  atlasList.innerHTML = worldAtlas.map((entry) => `
    <article class="atlas-card">
      <h3>${entry.region}</h3>
      <p>${entry.scale}</p>
      <span>${entry.nodes.join(' • ')}</span>
    </article>
  `).join('');
  atlasDialog.showModal();
}

function openSkillTree() {
  skillPointText.textContent = `Свободные очки навыков: ${state.skillPoints}`;
  skillDialogList.innerHTML = '';
  skillTree.forEach((skill) => {
    const lockedByBranch = skill.branch !== 'any' && state.branch !== skill.branch && state.branch !== 'none';
    const learned = state.learnedSkills.includes(skill.id);
    const card = document.createElement('div');
    card.className = `skill-card ${learned ? 'done' : ''}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = learned ? 'Изучено' : `Изучить за ${skill.cost}`;
    button.disabled = learned || lockedByBranch;
    button.addEventListener('click', () => learnSkill(skill));
    card.innerHTML = `<strong>${skill.title}</strong><span>${skill.description}</span><small>Ветка: ${skill.branch}</small>`;
    card.append(button);
    skillDialogList.append(card);
  });
  if (!skillDialog.open) skillDialog.showModal();
}

function learnSkill(skill) {
  if (state.learnedSkills.includes(skill.id) || state.skillPoints < skill.cost) {
    setMessage('Не хватает очков навыков или навык уже изучен.');
    return;
  }
  state.skillPoints -= skill.cost;
  state.learnedSkills.push(skill.id);
  if (skill.id === 'python_aura') {
    state.hero.maxWill += 12;
    state.hero.will += 12;
  }
  if (skill.id === 'cpp_memory') {
    state.hero.maxHp += 16;
    state.hero.hp += 16;
  }
  setMessage(`Изучен навык: ${skill.title}.`);
  addLog(`Дерево навыков: ${skill.title}.`);
  saveGame();
  updateHud();
  openSkillTree();
}

function openRaidBoard() {
  const activeLayer = Math.min(state.layerIndex, layers.length - 1);
  const raids = raidCatalog.filter((raid) => raid.layer <= activeLayer + 1);
  raidDialogList.innerHTML = '';
  raids.forEach((raid) => {
    const done = state.completedRaids.includes(raid.id);
    const card = document.createElement('div');
    card.className = `raid-card ${done ? 'done' : ''}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = done ? 'Зачищено' : `Начать рейд (${raidCost(raid)} монет)`;
    button.disabled = done;
    button.addEventListener('click', () => startRaid(raid));
    card.innerHTML = `<strong>${raid.title}</strong><span>Риск: ${raid.risk}. Награда: ${raid.reward.item} ×${raid.reward.count}</span>`;
    card.append(button);
    raidDialogList.append(card);
  });
  if (!raidDialog.open) raidDialog.showModal();
}

function raidCost(raid) {
  return Math.max(1, raid.cost - (state.learnedSkills.includes('tank_engineer') ? 4 : 0));
}

function startRaid(raid) {
  const cost = raidCost(raid);
  if (state.hero.coins < cost) {
    setMessage(`Для рейда нужно ${cost} мем-монет.`);
    return;
  }
  state.hero.coins -= cost;
  const power = state.party.length * 8 + state.learnedSkills.length * 5 + Math.floor(state.hero.xp / 25);
  const success = power + Math.floor(Math.random() * 30) >= raid.risk;
  if (success) {
    state.hero.xp += raid.reward.xp;
    state.hero.coins += raid.reward.coins;
    state.inventory[raid.reward.item] = (state.inventory[raid.reward.item] || 0) + raid.reward.count;
    state.factions[raid.reward.faction] = (state.factions[raid.reward.faction] ?? 0) + 2;
    state.completedRaids.push(raid.id);
    unlockArtifact(`Рейд: ${raid.title}`);
    setMessage(`Рейд успешен: ${raid.title}. Получен редкий лут.`);
    addLog(`Рейд завершён: ${raid.title}.`);
  } else {
    state.hero.hp = Math.max(1, state.hero.hp - raid.risk);
    state.hero.sosi = Math.min(100, state.hero.sosi + 6);
    setMessage(`Рейд сорвался: ${raid.title}. HP снижен, S.O.S.I. вырос.`);
    addLog(`Рейд провален: ${raid.title}.`);
  }
  saveGame();
  updateHud();
  openRaidBoard();
}

function openQuestBoard() {
  questDialogList.innerHTML = '';
  const quests = sideQuestCatalog.filter((quest) => quest.layer === Math.min(state.layerIndex, layers.length - 1));
  quests.forEach((quest) => {
    const item = document.createElement('div');
    item.className = `quest-card ${state.completedSideQuests.includes(quest.id) ? 'done' : ''}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = state.completedSideQuests.includes(quest.id) ? 'Выполнено' : `Сдать: ${quest.need.item} ×${quest.need.count}`;
    button.disabled = state.completedSideQuests.includes(quest.id);
    button.addEventListener('click', () => completeSideQuest(quest));
    item.innerHTML = `<strong>${quest.title}</strong><span>Нужно: ${quest.need.item} ×${quest.need.count}</span>`;
    item.append(button);
    questDialogList.append(item);
  });
  if (!quests.length) questDialogList.innerHTML = '<p>Сейчас нет активных сайд-квестов.</p>';
  if (!questDialog.open) questDialog.showModal();
}

function completeSideQuest(quest) {
  if (state.completedSideQuests.includes(quest.id)) return;
  if ((state.inventory[quest.need.item] || 0) < quest.need.count) {
    setMessage(`Не хватает ресурса: ${quest.need.item} ×${quest.need.count}.`);
    return;
  }
  state.inventory[quest.need.item] -= quest.need.count;
  state.hero.xp += quest.reward.xp;
  state.hero.coins += quest.reward.coins;
  if (quest.reward.artifact) unlockArtifact(quest.reward.artifact);
  if (quest.reward.trust) {
    state.trust[quest.reward.trust] = (state.trust[quest.reward.trust] ?? 0) + 2;
    state.factions[quest.reward.trust] = (state.factions[quest.reward.trust] ?? 0) + 2;
  }
  state.skillPoints += 1;
  state.completedSideQuests.push(quest.id);
  addLog(`Сайд-квест выполнен: ${quest.title}.`);
  setMessage(`Награда: ${quest.reward.xp} опыта и ${quest.reward.coins} мем-монет.`);
  saveGame();
  updateHud();
  openQuestBoard();
}

function openCodex() {
  codexList.innerHTML = codexEntries.map((entry) => `<article class=\"codex-entry\"><h3>${entry.title}</h3><p>${entry.text}</p></article>`).join('');
  codexDialog.showModal();
}

function toggleSoundtrack() {
  state.soundEnabled = !state.soundEnabled;
  const track = currentTrackName();
  setMessage(state.soundEnabled ? `Саундтрек включён: ${track}.` : 'Саундтрек выключен.');
  addLog(state.soundEnabled ? `Играет трек: ${track}.` : 'Саундтрек поставлен на паузу.');
  saveGame();
  updateHud();
}

function currentTrackName() {
  const track = soundtrack.find((item) => item.layer === Math.min(state.layerIndex, soundtrack.length - 1));
  return track?.name || soundtrack[soundtrack.length - 1].name;
}

function openCamp() {
  campAnswer.textContent = 'Ярик уже кипятит чайник и сортирует эмоциональный мусор.';
  campDialog.showModal();
}

function sendCampMessage() {
  const text = campInput.value.trim() || 'молчание';
  const answers = [
    `Ярик прочитал «${text}» и выдал аптечку из сарказма.`,
    `Лагерь решил, что «${text}» — это побочный квест. Воля восстановлена.`,
    `NPC завис на 2 секунды, потом сказал: «${text}? звучит как план».`,
  ];
  const answer = answers[Math.floor(Math.random() * answers.length)];
  campAnswer.textContent = answer;
  state.hero.will = Math.min(state.hero.maxWill, state.hero.will + 8);
  state.hero.coins += 2;
  addLog(answer);
  campInput.value = '';
  saveGame();
  updateHud();
}

function pingFate() {
  if (Math.random() > 0.45) {
    state.hero.xp += 10;
    state.hero.sosi = Math.max(0, state.hero.sosi - 5);
    setMessage('Пинг-тревога дала бафф: +10 опыта и -5% S.O.S.I.');
  } else {
    state.hero.sosi = Math.min(100, state.hero.sosi + 7);
    setMessage('Гермоненко действительно корректировал судьбу: +7% S.O.S.I.');
  }
  updateHud();
}

function showEndingDialog() {
  endingResult.textContent = '';
  endingDialog.showModal();
}

function chooseEnding(type) {
  const requirements = {
    python: state.branch === 'python' || state.party.includes('FEDIL'),
    cpp: state.branch === 'cpp' || state.party.includes('Сергей Гермоненко'),
    tank: state.branch === 'tank' || state.inventory['Танковый ключ'] >= 5,
    merge: state.artifacts.length >= artifactGoal && state.trust.FEDIL >= 3 && state.trust['Сергей Гермоненко'] >= 3,
  };
  if (!requirements[type] && !state.newGamePlus) {
    endingResult.textContent = 'Финал пока закрыт: не хватает ветки, доверия или артефактов.';
    return;
  }
  const endings = {
    python: 'Концовка Python: FEDIL запускает print("Свобода"), и ноосфера становится открытой школой нейросетей.',
    cpp: 'Концовка C++: реальность компилируется в reality.exe. Багов меньше, правил больше, память под счастье выделена.',
    tank: 'Великое Задубение: мир превращается в бесконечную карту ангаров, а RPG становится танковым симулятором.',
    merge: 'Секретное слияние: merge --squash объединяет протоколы в цифровой рай из мемов, доверия и чистого кода.',
  };
  endingResult.textContent = endings[type];
  state.finished = true;
  if (!state.endings.includes(type)) state.endings.push(type);
  unlockAchievement('all_endings');
  addLog(endings[type]);
  setMessage(`${endings[type]} Открыт New Game+.`);
  saveGame();
  updateHud();
}

function unlockAchievement(id) {
  if (!state.achievements.includes(id)) state.achievements.push(id);
}

function checkAchievements() {
  if (state.kills >= 1) unlockAchievement('first_blood');
  if (state.hero.sosi >= 80 && !state.finished) unlockAchievement('sosi_survivor');
  if (state.inventory['Танковый ключ'] >= 5) unlockAchievement('tank_keys');
  if (state.ramenCrafted >= 3) unlockAchievement('ramen_master');
  if (state.syntaxWins >= 3) unlockAchievement('syntax_lord');
}

function saveGame() {
  localStorage.setItem(saveKey, JSON.stringify(state));
}

function loadGame() {
  const raw = localStorage.getItem(saveKey);
  if (!raw) {
    setMessage('Доширак-сейв не найден. Начни новую симуляцию.');
    return;
  }
  state = normalizeLoadedState(JSON.parse(raw));
  activeEnemy = null;
  setMessage('Доширак-сейв загружен из localStorage.');
  addLog('Загружено сохранение через ритуал доширака.');
  updateHud();
  draw();
}

function normalizeLoadedState(loadedState) {
  const fallback = createInitialState(false);
  return {
    ...fallback,
    ...loadedState,
    hero: { ...fallback.hero, ...loadedState.hero },
    trust: { ...fallback.trust, ...loadedState.trust },
    factions: { ...fallback.factions, ...loadedState.factions },
    madness: { ...fallback.madness, ...loadedState.madness },
    inventory: { ...fallback.inventory, ...loadedState.inventory },
    completedSideQuests: loadedState.completedSideQuests || [],
    completedRaids: loadedState.completedRaids || [],
    learnedSkills: loadedState.learnedSkills || [],
    entities: loadedState.entities || createLayerEntities(loadedState.layerIndex || 0),
  };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const layer = getLayer();
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
  ctx.fillStyle = state.branch === 'cpp' ? '#7c92a8' : state.branch === 'tank' ? '#7b8f37' : '#4dabf7';
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
  if (event.code === 'KeyT') openDialogue();
  if (event.code === 'KeyY') syntaxChallenge();
  if (event.code === 'KeyC') openCamp();
  if (event.code === 'KeyQ') openQuestBoard();
  if (event.code === 'KeyO') openAtlas();
  if (event.code === 'KeyK') openSkillTree();
  if (event.code === 'KeyL') openRaidBoard();
  if (event.code === 'KeyB') openCodex();
  if (event.code === 'KeyM') toggleSoundtrack();
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

document.querySelectorAll('[data-branch]').forEach((button) => button.addEventListener('click', () => chooseBranch(button.dataset.branch)));
attackButton.addEventListener('click', () => performBattleAction('attack'));
debuffButton.addEventListener('click', () => performBattleAction('debuff'));
artifactButton.addEventListener('click', () => performBattleAction('artifact'));
craftButton.addEventListener('click', craftRamen);
startButton.addEventListener('click', () => resetGame(false, true));
newGameButton.addEventListener('click', () => resetGame(false, true));
newGamePlusButton.addEventListener('click', () => resetGame(true, true));
loadButton.addEventListener('click', loadGame);
talkButton.addEventListener('click', openDialogue);
syntaxButton.addEventListener('click', syntaxChallenge);
campButton.addEventListener('click', openCamp);
questBoardButton.addEventListener('click', openQuestBoard);
atlasButton.addEventListener('click', openAtlas);
skillButton.addEventListener('click', openSkillTree);
raidButton.addEventListener('click', openRaidBoard);
codexButton.addEventListener('click', openCodex);
soundButton.addEventListener('click', toggleSoundtrack);
campSendButton.addEventListener('click', sendCampMessage);
pingButton.addEventListener('click', pingFate);
document.querySelectorAll('[data-ending]').forEach((button) => button.addEventListener('click', () => chooseEnding(button.dataset.ending)));

resetGame(false, false);
