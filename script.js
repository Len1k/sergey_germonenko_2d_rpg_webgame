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
const devButton = document.querySelector('#devButton');
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
const devDialog = document.querySelector('#devDialog');
const devLayerSelect = document.querySelector('#devLayerSelect');
const devGrantSelect = document.querySelector('#devGrantSelect');
const devGrantAmount = document.querySelector('#devGrantAmount');
const devTeleportButton = document.querySelector('#devTeleportButton');
const devGrantButton = document.querySelector('#devGrantButton');
const devCompleteLayerButton = document.querySelector('#devCompleteLayerButton');
const devExportButton = document.querySelector('#devExportButton');
const devImportButton = document.querySelector('#devImportButton');
const devResetSaveButton = document.querySelector('#devResetSaveButton');
const devSaveText = document.querySelector('#devSaveText');
const devStatus = document.querySelector('#devStatus');
const endingDialog = document.querySelector('#endingDialog');
const endingResult = document.querySelector('#endingResult');

const tileSize = 64;
const {
  artifactGoal,
  saveKey,
  directions,
  archetypes,
  campaignActs,
  layers,
  endlessLayer,
  enemies,
  resourceNames,
  branchTitles,
  sideQuestCatalog,
  codexEntries,
  soundtrack,
  worldAtlas,
  skillTree,
  raidCatalog,
  achievements
} = window.DeepDreamData;

let state;
let activeEnemy = null;

function readPositions(map, symbol) {
  const positions = [];
  map.forEach((row, y) => [...row].forEach((cell, x) => {
    if (cell === symbol) positions.push({ x, y });
  }));
  return positions;
}


function validateContentData() {
  const errors = [];
  const assert = (condition, messageText) => {
    if (!condition) errors.push(messageText);
  };

  assert(window.DeepDreamData, 'DeepDreamData is not loaded. Include data.js before script.js.');
  assert(Object.keys(archetypes).length > 0, 'At least one archetype is required.');
  assert(layers.length > 0, 'At least one campaign layer is required.');
  assert(artifactGoal > 0, 'artifactGoal must be greater than zero.');

  layers.concat(endlessLayer).forEach((layer, layerIndex) => {
    assert(Array.isArray(layer.map), `${layer.name} must define a map array.`);
    assert(layer.map.length > 0, `${layer.name} map cannot be empty.`);
    const width = layer.map[0]?.length;
    layer.map.forEach((row, rowIndex) => {
      assert(row.length === width, `${layer.name} row ${rowIndex} has inconsistent width.`);
    });
    assert(readPositions(layer.map, 'P').length === 1, `${layer.name} must contain exactly one portal tile.`);
    assert(readPositions(layer.map, 'M').length >= 1, `${layer.name} must contain at least one boss tile.`);
    ['C', 'R', 'A'].forEach((symbol) => {
      assert(resourceNames[symbol], `${layer.name} uses resource symbol ${symbol}, but it has no resource name.`);
    });
    if (layerIndex < layers.length) {
      assert(campaignActs.some((act) => act.act === layer.act), `${layer.name} references missing campaign act ${layer.act}.`);
    }
  });

  const uniqueIds = (items, label) => {
    const seen = new Set();
    items.forEach((item) => {
      assert(item.id, `${label} item is missing id.`);
      assert(!seen.has(item.id), `${label} has duplicate id: ${item.id}.`);
      seen.add(item.id);
    });
  };

  uniqueIds(sideQuestCatalog, 'sideQuestCatalog');
  uniqueIds(skillTree, 'skillTree');
  uniqueIds(raidCatalog, 'raidCatalog');
  uniqueIds(achievements, 'achievements');

  sideQuestCatalog.forEach((quest) => {
    assert(quest.layer >= 0 && quest.layer < layers.length, `Side quest ${quest.id} references invalid layer ${quest.layer}.`);
    assert(quest.need?.item && quest.need.count > 0, `Side quest ${quest.id} must define item need and positive count.`);
    assert(quest.reward?.xp >= 0 && quest.reward?.coins >= 0, `Side quest ${quest.id} must define non-negative xp and coins rewards.`);
  });

  raidCatalog.forEach((raid) => {
    assert(raid.layer >= 0 && raid.layer < layers.length, `Raid ${raid.id} references invalid layer ${raid.layer}.`);
    assert(raid.cost > 0 && raid.risk > 0, `Raid ${raid.id} must define positive cost and risk.`);
    assert(raid.reward?.item && raid.reward.count > 0, `Raid ${raid.id} must define item reward and positive count.`);
  });

  if (errors.length) {
    throw new Error(`Content validation failed:\n${errors.join('\n')}`);
  }
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


function openDevPanel() {
  devLayerSelect.innerHTML = layers
    .map((layer, index) => `<option value="${index}">${index}: ${layer.name}</option>`)
    .join('') + `<option value="${layers.length}">${layers.length}: ${endlessLayer.name}</option>`;
  devLayerSelect.value = String(state.layerIndex);

  const inventoryItems = Object.keys(state.inventory).map((item) => ({ value: `item:${item}`, label: `Предмет: ${item}` }));
  const utilityItems = [
    { value: 'coins', label: 'Мем-монеты' },
    { value: 'xp', label: 'Опыт' },
    { value: 'skillPoints', label: 'Очки навыков' },
    { value: 'artifact', label: 'Debug-артефакт' },
    { value: 'sosiDown', label: 'Снизить S.O.S.I.' },
  ];
  devGrantSelect.innerHTML = utilityItems.concat(inventoryItems)
    .map((entry) => `<option value="${entry.value}">${entry.label}</option>`)
    .join('');
  devStatus.textContent = 'Готово к тестированию контента.';
  devDialog.showModal();
}

function devTeleportToLayer() {
  const targetLayer = Number(devLayerSelect.value);
  state.layerIndex = targetLayer;
  state.hero.x = 1;
  state.hero.y = 1;
  state.finished = false;
  state.entities = createLayerEntities(targetLayer);
  if (targetLayer > 2 && state.branch === 'none') state.branch = 'python';
  devStatus.textContent = `Телепорт: ${getLayer().name}.`;
  addLog(`Dev: телепорт на ${getLayer().name}.`);
  saveGame();
  updateHud();
  draw();
}

function devGrantSelection() {
  const amount = Math.max(1, Number(devGrantAmount.value) || 1);
  const selected = devGrantSelect.value;
  if (selected.startsWith('item:')) {
    const item = selected.slice(5);
    state.inventory[item] = (state.inventory[item] || 0) + amount;
    devStatus.textContent = `Выдано: ${item} ×${amount}.`;
  } else if (selected === 'coins') {
    state.hero.coins += amount;
    devStatus.textContent = `Выдано мем-монет: ${amount}.`;
  } else if (selected === 'xp') {
    state.hero.xp += amount;
    devStatus.textContent = `Выдано опыта: ${amount}.`;
  } else if (selected === 'skillPoints') {
    state.skillPoints += amount;
    devStatus.textContent = `Выдано очков навыков: ${amount}.`;
  } else if (selected === 'artifact') {
    unlockArtifact(`Dev-артефакт ${state.artifacts.length + 1}`);
    devStatus.textContent = 'Выдан debug-артефакт.';
  } else if (selected === 'sosiDown') {
    state.hero.sosi = Math.max(0, state.hero.sosi - amount);
    devStatus.textContent = `S.O.S.I. снижен на ${amount}.`;
  }
  addLog(`Dev: ${devStatus.textContent}`);
  saveGame();
  updateHud();
}

function devCompleteLayerGoals() {
  state.entities.enemies = state.entities.enemies.filter((enemy) => !enemy.boss);
  unlockArtifact(`Dev-сигнатура слоя ${state.layerIndex + 1}`);
  if (state.layerIndex === 2 && state.branch === 'none') state.branch = 'python';
  devStatus.textContent = 'Цели слоя закрыты: босс удалён, сигнатура выдана.';
  addLog('Dev: цели текущего слоя закрыты.');
  saveGame();
  updateHud();
  draw();
}

function devExportSave() {
  devSaveText.value = JSON.stringify(state, null, 2);
  devStatus.textContent = 'Сейв экспортирован в текстовое поле.';
}

function devImportSave() {
  try {
    state = normalizeLoadedState(JSON.parse(devSaveText.value));
    activeEnemy = null;
    devStatus.textContent = 'Сейв импортирован.';
    addLog('Dev: сейв импортирован из JSON.');
    saveGame();
    updateHud();
    draw();
  } catch (error) {
    devStatus.textContent = `Ошибка импорта: ${error.message}`;
  }
}

function devResetSave() {
  localStorage.removeItem(saveKey);
  resetGame(false, true);
  devStatus.textContent = 'Сейв сброшен, новая симуляция создана.';
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
  if (event.code === 'Backquote') openDevPanel();
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
devButton.addEventListener('click', openDevPanel);
devTeleportButton.addEventListener('click', devTeleportToLayer);
devGrantButton.addEventListener('click', devGrantSelection);
devCompleteLayerButton.addEventListener('click', devCompleteLayerGoals);
devExportButton.addEventListener('click', devExportSave);
devImportButton.addEventListener('click', devImportSave);
devResetSaveButton.addEventListener('click', devResetSave);
campSendButton.addEventListener('click', sendCampMessage);
pingButton.addEventListener('click', pingFate);
document.querySelectorAll('[data-ending]').forEach((button) => button.addEventListener('click', () => chooseEnding(button.dataset.ending)));

validateContentData();
resetGame(false, false);
