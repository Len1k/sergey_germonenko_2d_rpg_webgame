// Content database for Deep Dream Protocol.
// Keep game data here so designers can expand the campaign without editing engine logic.
(() => {
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


  window.DeepDreamData = {
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
  };
})();
