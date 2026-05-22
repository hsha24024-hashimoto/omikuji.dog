// --- アプリの状態管理 (State) ---
let state = {
    level: 1,
    points: 0,
    selectedMood: null,
    chosenAnimalGroup: 'dog' // 通常は 'dog'。エンドコンテンツで 'cat', 'hamster', 'penguin' に変化可能
};

// キャラクター定義データ (レベルに応じて自動変化)
const charData = {
    dog: [
        { maxLv: 9,  name: "ブルドッグ", avatar: "🐶", tone: "formal" },
        { maxLv: 19, name: "柴犬",       avatar: "🐕", tone: "casual" },
        { maxLv: 29, name: "マルチーズ", avatar: "🐩", tone: "sweet" },
        { maxLv: Infinity, name: "ゴールデンレトリバー", avatar: "🦮", tone: "warm" }
    ],
    cat: { name: "気まぐれにゃんこ", avatar: "🐱", tone: "inherited" },
    hamster: { name: "もふもふハム太", avatar: "🐹", tone: "inherited" },
    penguin: { name: "よちよちペン太", avatar: "🐧", tone: "inherited" }
};

// おみくじの運勢リスト
const luckList = ["大吉", "吉", "中吉", "小吉", "末吉"];

// 【重要】セリフデータベース (進化段階の性格・トーン × 5段階のやる気)
const messageDatabase = {
    formal: { // ブルドッグ（敬語・ビジネスライク）
        5: "本日は最高のやる気ですね。そのみなぎる情熱をそのまま業務や活動にぶつけてください。応援しております。",
        4: "素晴らしいモチベーションです。今すぐ走り出したいお気持ちを活かし、前進していきましょう。",
        3: "落ち着いた良いコンディションですね。本日はこの安定した幸せな心のまま、着実に進めてまいりましょう。",
        2: "楽しそうな雰囲気を感じます。そのポジティブな気持ちがあれば、今日のタスクも円滑にこなせるでしょう。",
        1: "本日は少しお疲れのようですね。まずは無理をなさらず、笑顔で深呼吸をしてから少しずつ始めましょう。"
    },
    casual: { // 柴犬（タメ口・フランク）
        5: "おぉ、今日のやる気マックスじゃん！そのみなぎる覇気で、今日の目標も一気にガツンと片付けちゃおうぜ！",
        4: "ウズウズして走り出したそうな顔してるね！そのワクワクした勢いに乗って、最高の一日にしよう！",
        3: "いい空気感だね〜。なんかこっちまで幸せな気分になってくるよ。焦らず自分のペースで楽しんでいこう！",
        2: "お、なんか楽しそうじゃん！その調子その調子。気楽に笑顔で、今日の活動もエンジョイしようぜ！",
        1: "そっか、今日はちょっと元気が出ないんだね。大丈夫、俺が隣で笑顔で見守ってるからさ。ボチボチいこう。"
    },
    sweet: { // マルチーズ（甘えん坊・可愛い風）
        5: "わぁっ、すごいパワー！まぶしいくらいの覇気が出てるの！その強いやる気で、今日もいっぱーい頑張ろうね！",
        4: "なんだかワクワクして、今すぐ一緒に走り出したくなっちゃう！その素敵な気持ちで前に進もうねっ！",
        3: "きょうも一緒にいられて、わたし、すっごく幸せなの。このポカポカした気持ちで、のんびり頑張ろう？",
        2: "るんるんして楽しそうなお顔！それを見てるだけで嬉しくなっちゃう。今日もハッピーな一日にしようね！",
        1: "涙が出ちゃうくらい、がんばれない朝もあるよね…。そんなときはね、わたしが可愛い笑顔で癒してあげるっ！"
    },
    warm: { // ゴールデンレトリバー（包容力・温かい・クリア後ルート共通）
        5: "素晴らしい、全身から凄まじい覇気を感じるよ。その溢れるやる気があれば、どんなことでも成し遂げられるさ。",
        4: "ふふ、今にも駆け出しそうなワクワクした目をしているね。その純粋なエネルギーを信じて進みなさい。",
        3: "お前の穏やかな心から、確かな幸せが伝わってくるよ。今日も一日、この温かい光に包まれて歩んでいこう。",
        2: "とても楽しそうな良い表情だ。その明るい笑顔があれば、周囲の人も巻き込んで素晴らしい日になるよ。",
        1: "心がひどく重い朝んだね。大丈夫、何も無理に動くことはない。私がずっと笑顔で寄り添っているからね。"
    }
};

// --- DOM要素の取得 ---
const elDisplaySpecies = document.getElementById('display-species');
const elDisplayLevel = document.getElementById('display-level');
const elDisplayNextPts = document.getElementById('display-next-pts');
const elLevelProgress = document.getElementById('level-progress');
const elAvatar = document.getElementById('avatar');
const elNameTag = document.getElementById('name-tag');
const elAura = document.getElementById('aura');

const elScreenInput = document.getElementById('screen-input');
const elScreenDraw = document.getElementById('screen-draw');
const elScreenResult = document.getElementById('screen-result');

const elMoodBtns = document.querySelectorAll('.mood-btn');
const elStartBtn = document.getElementById('start-btn');
const elCloseBtn = document.getElementById('close-btn');
const elEndContentBox = document.getElementById('end-content-box');
const elAnimalSelect = document.getElementById('animal-select');

const elResultLuck = document.getElementById('result-luck');
const elResultPoints = document.getElementById('result-points');
const elResultMessage = document.getElementById('result-message');

// --- アプリの初期化 ---
function init() {
    const savedData = localStorage.getItem('inumikuji_split_save');
    if (savedData) {
        state = JSON.parse(savedData);
    }
    updateCharacterAndHeader();
    setupEventListeners();
}

// --- 現在のレベル・選択に基づくキャラクターの姿を取得 ---
function getActiveCharInfo() {
    if (state.chosenAnimalGroup !== 'dog') {
        const base = charData[state.chosenAnimalGroup];
        return { name: base.name, avatar: base.avatar, tone: 'warm', speciesLabel: base.name };
    } else {
        const list = charData.dog;
        for (let info of list) {
            if (state.level <= info.maxLv) {
                return { name: info.name, avatar: info.avatar, tone: info.tone, speciesLabel: "犬" };
            }
        }
        return { name: list[3].name, avatar: list[3].avatar, tone: list[3].tone, speciesLabel: "犬" };
    }
}

// --- 画面上部やアバター情報の更新表示ルーチン ---
function updateCharacterAndHeader() {
    const charInfo = getActiveCharInfo();
    
    elDisplaySpecies.textContent = charInfo.speciesLabel;
    elDisplayLevel.textContent = state.level;
    
    const ptsInCurrentLevel = state.points % 10;
    const nextRequired = 10 - ptsInCurrentLevel;
    elDisplayNextPts.textContent = nextRequired;
    elLevelProgress.style.width = `${ptsInCurrentLevel * 10}%`;

    elAvatar.textContent = charInfo.avatar;
    elNameTag.textContent = charInfo.name;

    if (state.level >= 30) {
        elEndContentBox.style.display = 'block';
        elAnimalSelect.value = state.chosenAnimalGroup;
    } else {
        elEndContentBox.style.display = 'none';
    }
}

// --- やる気レベルに応じたアニメーション・オーラ演出の制御 ---
function applyMoodAnimation(mood) {
    elAvatar.classList.remove('bounce-animation', 'sway-animation');
    elAura.style.display = 'none';

    if (mood === 5) {
        elAura.style.display = 'block';
        elAvatar.classList.add('bounce-animation');
    } else if (mood === 4) {
        elAvatar.classList.add('bounce-animation');
    } else if (mood === 3) {
        elAvatar.classList.add('sway-animation');
    } else if (mood === 2) {
        elAvatar.classList.add('sway-animation');
    }
}

function saveState() {
    localStorage.setItem('inumikuji_split_save', JSON.stringify(state));
}

// --- イベントリスナーの紐付け ---
function setupEventListeners() {
    elMoodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elMoodBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            
            state.selectedMood = parseInt(btn.dataset.mood);
            elStartBtn.disabled = false;
            
            applyMoodAnimation(state.selectedMood);
        });
    });

    elStartBtn.addEventListener('click', () => {
        if (!state.selectedMood) return;

        elScreenInput.classList.remove('active');
        elScreenDraw.classList.add('active');

        setTimeout(() => {
            executeOmikujiResults();
        }, 1500);
    });

    elCloseBtn.addEventListener('click', () => {
        state.selectedMood = null;
        elMoodBtns.forEach(b => b.classList.remove('selected'));
        elStartBtn.disabled = true;

        elAvatar.classList.remove('bounce-animation', 'sway-animation');
        elAura.style.display = 'none';

        elScreenResult.classList.remove('active');
        elScreenInput.classList.add('active');
    });

    elAnimalSelect.addEventListener('change', (e) => {
        state.chosenAnimalGroup = e.target.value;
        saveState();
        updateCharacterAndHeader();
    });
}

// --- おみくじ結果の計算と画面反映 ---
function executeOmikujiResults() {
    const mood = state.selectedMood;
    const charInfo = getActiveCharInfo();

    const randomLuck = luckList[Math.floor(Math.random() * luckList.length)];
    const earnedPoints = 1 + mood;
    const oldLevel = state.level;
    
    state.points += earnedPoints;
    state.level = Math.floor(state.points / 10) + 1;
    
    saveState();

    elResultLuck.textContent = randomLuck;
    
    let ptsText = `+${earnedPoints} ポイント獲得！`;
    if (state.level > oldLevel) {
        ptsText += ` 🎉 レベルアップ！【${charInfo.name}】に絆が深まりました！`;
    }
    elResultPoints.textContent = ptsText;

    const toneMap = messageDatabase[charInfo.tone];
    let messageText = (toneMap && toneMap[mood]) ? toneMap[mood] : "今日も無理せず進もうね。";
    
    if (mood === 1) {
        messageText = `（${charInfo.name}が隣で優しい笑顔を浮かべてくれている）\n\n` + messageText;
    }
    
    elResultMessage.textContent = messageText;

    elScreenDraw.classList.remove('active');
    elScreenResult.classList.add('active');

    updateCharacterAndHeader();
    applyMoodAnimation(mood);
}

window.onload = init;
