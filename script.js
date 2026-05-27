// --- アプリの状態管理 (State) ---
let state = {
    level: 1,
    points: 0,
    selectedMood: null,
    chosenAnimalGroup: 'dog' // ベースルート（進化順）を表すキー
};

// キャラクター定義データ (レベルに応じて自動変化するメインルートを拡張)
const charData = {
    dog: [
        { maxLv: 9,  name: "ブルドッグ", avatar: "🐶", tone: "formal" },
        { maxLv: 19, name: "柴犬",       avatar: "🐕", tone: "casual" },
        { maxLv: 29, name: "マルチーズ", avatar: "🐩", tone: "sweet" },
        { maxLv: 39, name: "ゴールデンレトリバー", avatar: "🦮", tone: "warm" },
        { maxLv: 49, name: "ライオン", avatar: "🦁", tone: "regal" },
        { maxLv: 59, name: "トラ", avatar: "🐅", tone: "cool" },
        { maxLv: 69, name: "イルカ", avatar: "🐬", tone: "bright" },
        { maxLv: Infinity, name: "キリン", avatar: "🦒", tone: "gentle" }
    ],
    // エンドコンテンツ解放後の個別選択用（親密なままチェンジ）
    cat: { name: "気まぐれにゃんこ", avatar: "🐱", tone: "casual" },
    hamster: { name: "もふもふハム太", avatar: "🐹", tone: "sweet" },
    penguin: { name: "よちよちペン太", avatar: "🐧", tone: "bright" }
};

// おみくじの運勢と対応する獲得ポイントの定義
const luckSettings = [
    { name: "大吉", points: 10 },
    { name: "吉",   points: 7 },
    { name: "中吉", points: 5 },
    { name: "小吉", points: 3 },
    { name: "末吉", points: 1 }
];

// 【新動物追加】セリフデータベース
const messageDatabase = {
    formal: { // ブルドッグ
        5: [
            "本日は最高のやる気ですね。そのみなぎる情熱をそのまま業務や活動にぶつけてください。応援しております。",
            "素晴らしい気力が満ちております。本日ならどんな困難なタスクも迅速に片付けられることでしょう。期待しております。",
            "圧倒的な覇気を感じます。この絶好の機会を逃さず、一気にロケットスタートを決めましょう。"
        ],
        4: [
            "素晴らしいモチベーションです。今すぐ走り出したいお気持ちを活かし、前進していきましょう。",
            "前向きなエネルギーに溢れていますね。その調子でタスクを1つずつ着実にこなしていきましょう。",
            "心がウズウズしているのが伝わります。今日の計画は非常にスムーズに進む予感がいたします。"
        ],
        3: [
            "落ち着いた良いコンディションですね。本日はこの安定した幸せな心のまま、着実に進めてまいりましょう。",
            "過不足のない、非常にフラットで良好な状態です。無理のないペースで、今日も一日乗り切りましょう。",
            "心が満ち足りた良い朝ですね。焦らず、自分のやるべきことに集中するのに最適な一日です。"
        ],
        2: [
            "楽しそうな雰囲気を感じます。そのポジティブな気持ちがあれば、今日のタスクも円滑にこなせるでしょう。",
            "少しゆったりとした足取りですが、楽しむ心を忘れていませんね。気楽な気持ちで始めていきましょう。",
            "リラックスしつつも良い笑顔です。プレッシャーを感じることなく、マイペースに進めてください。"
        ],
        1: [
            "本日は少しお疲れのようぜ。まずは無理をなさらず、笑顔で深呼吸をしてから少しずつ始めましょう。",
            "エネルギーが少し低下しているようです。午前中はあえてスロースターターに徹し、お体を労わってください。",
            "そういう日もございます。完璧を目指さず、まずは温かいお茶でも飲んでから最低限のことだけやりましょう。"
        ]
    },
    casual: { // 柴犬
        5: [
            "おぉ、今日のやる気マックスじゃん！そのみなぎる覇気で、今日の目標も一気にガツンと片付けちゃおうぜ！",
            "うわ、すげえ覇気！エネルギーが溢れ出してるぞ。この勢いのまま、突っ走るしかないっしょ！",
            "やる気全開だね！最高じゃん。お前のその熱いパワー、近くにいる俺にまでビンビン伝わってくるぜ！"
        ],
        4: [
            "ウズウズして走り出したそうな顔してるね！そのワクワクした勢いに乗って、最高の一日にしよう！",
            "おっ、かなりノってるね！今すぐ何か始めたくてたまらないって感じ？その直感を信じて動いてみようぜ。",
            "いい波が来てんじゃん！そのワクワクした気持ちがあれば、今日のハードルなんて楽々超えられるって！"
        ],
        3: [
            "いい空気感だね〜。なんかこっちまで幸せな気分になってくるよ。焦らず自分のペースで楽しんでいこう！",
            "ふつうが一番、平和が一番！心が落ち着いてて最高だよ。今日もまったり、でも確実に進めていこうな。",
            "穏やかで良い朝じゃん。こういう日はさ、焦る必要なんてゼロだから。自分のリズムを大事にしようぜ。"
        ],
        2: [
            "お、なんか楽しそうじゃん！その調子その調子。気楽に笑顔で、今日の活動もエンジョイしようぜ！",
            "るんるん気分だね！深刻に考えすぎず、ゲーム感覚で楽しんでやっちゃえば、何でもうまくいくって！",
            "いいじゃん、楽しんでいこう！肩の力を抜いて、笑いながら進めるのが一番効率いいんだからさ。"
        ],
        1: [
            "そっか、今日はちょっと元気が出ないんだね。大丈夫、俺が隣で笑顔で見守ってるからさ。ボチボチいこう。",
            "あー、ちょっとガス欠気味か？無理すんなよ。今日は100点じゃなくて、10点くらい取れれば大合格だ！",
            "そんな日もあるって。誰だって波はあるんだから。辛いときはサボることも考えて、自分を甘やかそうな。"
        ]
    },
    sweet: { // マルチーズ
        5: [
            "わぁっ、すごいパワー！まぶしいくらいの覇気が出てるの！その強いやる気で、今日もいっぱーい頑張ろうね！",
            "きらきらした凄いエネルギー！神様みたいに強そうな覇気だよぉ！このまま宇宙まで飛んでいけそうだねっ！",
            "やる気マックスさんだー！すごーいっ！わたしもお前の後ろを全力でトコトコついていくからねーっ！"
        ],
        4: [
            "なんだかワクワクして、今すぐ一緒に走り出したくなっちゃう！その素敵な気持ちで前に進ろうねっ！",
            "おめめが輝いてて、お散歩前のわたしみたいにワクワクしてる！その勢いで、今日も楽しい一日にしよ？",
            "心がウキウキしてるんだねっ！わたしも嬉しくなっちゃう。そのワクワクをいっぱい使って頑張ろう！"
        ],
        3: [
            "きょうも一緒にいられて、わたし、すっごく幸せなの。このポカポカした気持ちで、のんびり頑張ろう？",
            "いつも通りがとっても愛おしいの。心がポカポカ満たされてるね。今日も穏やかに、優しく過ごそうねっ！",
            "ほっとする朝だね。お前の心が幸せなら、それだけで百点満点！あったかい気持ちで進んでいこう？"
        ],
        2: [
            "るんるんして楽しそうなお顔！それを見てるだけで嬉しくなっちゃう。今日もハッピーな一日にしようね！",
            "楽しそうな歌が聞こえてきそうなお顔！お前が楽しそうだと、世界がピカピカして見えるんだよっ！",
            "楽しいことが待ってる予感がするねっ。笑顔でいれば、ぜったい良いことがたくさん起きるよー！"
        ],
        1: [
            "涙が出ちゃうくらい、がんばれない朝もあるよね…。そんなときはね、わたしが可愛い笑顔で癒してあげるっ！",
            "えーん、元気がないの？よしよし、お膝の上でぎゅーってしてあげる。今日は頑張らなくていいからね？",
            "心がシクシクのときはね、おねがいだから無理しないで？わたしがずっとお隣で、ニコニコ笑顔で守ってるよ。"
        ]
    },
    warm: { // ゴールデンレトリバー
        5: [
            "素晴らしい、全身から凄まじい覇気を感じるよ。その溢れるやる気があれば、どんなことでも成し遂げられるさ。",
            "見事な情熱だ。お前の奥底から燃え上がる覇気が、新しい道を切り拓く。思う存分力を発揮しておいで。",
            "最高潮のエネルギーだね。今の君を止められるものは何もいない。自信を持って、堂々と突き進むといい。"
        ],
        4: [
            "ふふ、今にも駆け出しそうなワクワクした目をしているね。その純粋なエネルギーを信じて進みなさい。",
            "前を向く強い意志と、心地よいワクワクが伝わってくるよ。そのポジティブな波に乗れば、全ては好転するさ。",
            "心が踊っているね。新しい一歩を踏み出すにはこれ以上ない状態だ。私を信じて、楽しんでおいで。"
        ],
        3: [
            "お前の穏やかな心から、確かな幸せが伝わってくるよ。今日も一日、この温かい光に包まれて歩んでいこう。",
            "焦らず、驕らず、とても良い調和が取れている。この満ち足りた静かな幸せとともに、一歩ずつ進もう。",
            "素晴らしい朝の静寂だね。君の心が安定していることが何より嬉しい。自分のリズムを愛して生きよう。"
        ],
        2: [
            "とても楽しそうな良い表情だ。その明るい笑顔があれば、周囲の人も巻き込んで素晴らしい日になるよ。",
            "日々の営みを楽しもうとするその姿勢、とても美しいよ。肩の荷を下ろして、陽気にいこうじゃないか。",
            "ふふ、微笑ましいな。楽しむ心こそが、最高の才能なんだよ。今日も心躍る瞬間をたくさん見つけよう。"
        ],
        1: [
            "心がひどく重い朝なんだね。大丈夫、何も無理に動くことはない。私がずっと笑顔で寄り添っているからね。",
            "暗闇の中にいるようなときは、目を閉じて私の温もりを感じてごらん。今日は休むための大切な一日だよ。",
            "深く傷つき、疲れてしまったんだね。頑張る必要などどこにもない。君がそこにいてくれるだけで、私は幸せなんだ。"
        ]
    },
    regal: { // ライオン（百獣の王・自信に満ちた王者の風格）
        5: [
            "凄まじいな！その地鳴りのごとき覇気、まさに王の風格だ。今日の戦場（仕事）は完全に貴殿の独壇場となるだろう！",
            "その熱き闘志、気に入った！万物を圧倒するほどのやる気で、目の前の壁を全て粉砕してくるがよい！",
            "これほどまでの熱量、我が魂をも焦がすほどだ。恐れるものなど何もない、お前の覇道を突き進め！"
        ],
        4: [
            "良い眼光だ。何かに挑戦したくて体がうずいているようだな。その気高い衝動のまま、大いに暴れてこい！",
            "胸を高鳴らせているな。素晴らしい。その高揚感こそが、勝利を確実にする最大の武器だ。行ってこい！",
            "前を向く勇気がみなぎっているな。我が誇り高き相棒よ、今日のタスクなどお前にとっては容易い獲物だ。"
        ],
        3: [
            "ふっ、泰然自若とした良い佇まいだ。王たるもの、常にそうしてドシッと構え、幸福に満ちた一日を過ごすべきだな。",
            "焦りのない、じつに洗練された精神状態だ。安定した心こそが最大の力を生む。悠々と進もうではないか。",
            "落ち着いた良い風が吹いている。無理に駆ける必要はない。お前のペースが、そのまま世界の規律となるのだ。"
        ],
        2: [
            "実に愉しそうな表情だな。お前が笑顔でいることが、この群れ（環境）にどれほどの安心を与えるか分かっているか？",
            "愉快、愉快！その楽しげな心のまま、今日の営みを優雅に遊ぶがよい。笑顔の王には誰も敵わんさ。",
            "肩の力が抜けていて素晴らしい。心から楽しむ余裕がある者こそが、真の強者なのだからな。"
        ],
        1: [
            "心が痛むか…。案ずるな、傷ついたときはこの我が牙と鬣（たてがみ）が、お前を狙うあらゆる不条理から守ってやる。",
            "どんな強者とて、休息は必要だ。本日は牙を研ぎ、静かに英気を養うが良い。私がずっと傍についている。",
            "無理に立ち上がる必要はない。お前が弱っているときは、百獣の王たる私がその不調を笑顔で撥ね退けてやろう。"
        ]
    },
    cool: { // トラ（冷静沈着、少しニヒルだが仲間想いで熱い）
        5: [
            "おいおい、とんでもねえ覇気を隠し持ってやがったな。今日のあんたなら、どんな獲物も一撃で仕留められそうだ。",
            "鋭い牙が見え隠れしてるぜ。その熱いやる気があれば、今日の仕事なんて一瞬のエンタメにすぎないな。",
            "その気迫、最高にシブいね。あんたの秘めたる熱いパワーで、今日の目標を根こそぎ奪い取っちまいな。"
        ],
        4: [
            "フッ、じっとしていられない顔をしてる。獲物を見つけて今にも飛び掛かりたいってか？その勘に従いなよ。",
            "いい緊張感とワクワクが混ざり合ってんな。あんたのその真っ直ぐなエネルギー、嫌いじゃないぜ。",
            "前を向く強さが出てきたな。あんたがその気なら、今日のスケジュールなんてただの通過点だ。"
        ],
        3: [
            "静かで良い空気感だ。あんたの心が満たされてるのがよく分かる。今日はその穏やかなリズムを崩さずいこう。",
            "無駄な力が入ってないな。プロってのはそういう佇まいをしてるもんだ。マイペースに、確実にこなそうぜ。",
            "ゆったりとした時間の流れを感じるね。たまにはこうして、静かな幸せに浸りながら進むのも悪くない。"
        ],
        2: [
            "へえ、なんだか楽しそうじゃん。あんたが笑ってると、こっちまで調子が狂うっていうか…悪い気はしないぜ。",
            "楽しむ余裕があるってのは強さの証拠だ。そのイカした笑顔を崩さずに、今日のタスクを軽くいなしてきなよ。",
            "肩の力が抜けてていいね。気楽にいこうぜ。人生、笑いながら楽しんだもん勝ちってね。"
        ],
        1: [
            "深く沈み込んじまってるな…。無理して笑おうとするなよ。あんたが動けないなら、俺が影から守ってやるからさ。",
            "ガス欠の日にあがいても無駄だ。今日は徹底的にサボるか、スローペースでいこう。俺がついててやるよ。",
            "心が冷え切っちまった時は、俺の毛並みで暖まりな。完璧じゃなくていい、生きてるだけで大金星だろ。"
        ]
    },
    bright: { // イルカ（知的で爽やか、自由でポジティブな癒やし系）
        5: [
            "わあ！水面を高くジャンプするみたいに、凄まじい覇気が溢れてるね！今日のあなたなら何でもできちゃうよ！",
            "キラキラ輝く太陽みたいな最高のやる気だね！そのエネルギッシュなウェーブに乗って、どこまでも進もう！",
            "すごいパワー！あなたのポジティブな覇気が、周りのみんなまで元気にしちゃうよ。さあ、飛び出そう！"
        ],
        4: [
            "新しい海へ泳ぎ出したいみたいに、ワクワクした目をしているね！その軽快なステップで駆け抜けちゃおう！
",
            "ウズウズしてるのが伝わってくるよ！そのワクワクした気持ちがあれば、今日のタスクもスイスイ進んじゃうね！",
            "いい波が来てます！あなたの直感とアクティブなエネルギーを信じて、思いっきり楽しんでおいでよ！"
        ],
        3: [
            "波のない穏やかな海みたいに、とっても落ち着いたコンディションだね。この幸せな心のまま、進んでいこう。
",
            "心がクリアでフラットな状態だね。焦る必要は全くないから、あなたの心地いいリズムを大切にしてね。
",
            "ほっと癒やされる素敵な朝。こんな日は、目の前のことを一つずつ丁寧に楽しむのが一番の正解だよ。
"
        ],
        2: [
            "あはは、とっても楽しそうな笑顔！それを見てるだけで、わたしまで嬉しくて胸が弾んじゃうな！",
            "るんるん気分だね！難しく考えずに、海の上のダンスみたいに楽しんでやれば、全部うまくいくよ！",
            "いいねいいね！そのハッピーな笑顔があれば、どんな場所だって明るい楽園に変わっちゃうよ！"
        ],
        1: [
            "心の海が嵐になっちゃったのかな…。大丈夫、無理に泳ごうとしなくていいんだよ。わたしがずっと隣で寄り添うから。",
            "深く深く潜って、今は休む時間。笑顔の処方箋として、わたしが癒やしの音色をずっと届けてあげるね。",
            "涙が出ちゃう日もあるよね。完璧を求めず、今日はプカプカ浮かぶみたいに、のんびり自分を労わってあげて。"
        ]
    },
    gentle: { // キリン（長身で広い視野、すべてを見下ろすのではなく見守る圧倒的包容力）
        5: [
            "素晴らしいですね。遠くの地平線まで届くような、凄まじい覇気を感じます。今日のあなたに死角はありませんよ。",
            "天まで届きそうなほど熱く高いやる気です！その大いなる情熱を持ってすれば、どんな困難も小さな石ころにすぎません。",
            "胸の奥から燃え上がる圧倒的な覇気、実に見事です。さあ、高い視座を持って、あなたの信じる道を進みなさい。"
        ],
        4: [
            "ふふ、遠くの素敵な未来を見据えて、ワクワクと体が動き出しそうな目ですね。そのエネルギーを存分に活かしてください。",
            "前を向く瑞々しいエネルギーが満ちています。広い視野を持って進めば、進むべき正しいルートがはっきりと見えますよ。",
            "心が弾んでいるのが私には見えます。そのワクワクした気持ちを乗せて、大きく一歩を踏み出してみましょう。"
        ],
        3: [
            "高い木の上を優しく吹き抜ける風のように、穏やかで満ち足りた心ですね。この確かな幸せと共に歩んでいきましょう。",
            "焦りのない、非常に美しく調和が取れた状態です。周囲の雑音に惑わされず、あなたのペースで進めば大丈夫です。",
            "お前の心が穏やかに安定していることが、私にとって何よりの喜びです。今日もこの静かな幸せを味わいましょう。"
        ],
        2: [
            "とても楽しそうな、暖かな笑顔が見えますよ。あなたが笑っていると、この世界全体が優しく色づくように感じます。",
            "ふふ、るんるんと楽しそうな足取りですね。心から物事を楽しむその姿勢こそが、あなたを最も輝かせるのですよ。",
            "気楽で楽しそうな雰囲気、とても素敵です。プレッシャーを感じる必要はありません。笑顔で軽やかにいきましょう。"
        ],
        1: [
            "空が曇って見えるほど、心が重くなってしまったのですね。大丈夫、私が高い視点から常に笑顔で君の安全を見守っています。",
            "深く傷つき、歩みが止まってしまってもいいのです。何も無理に動くことはありません。私がここでずっと寄り添っています。",
            "頑張れない日があるのは当然です。自分を責めないでくださいね。木漏れ日のような温かい笑顔で、いつでもあなたを癒します。"
        ]
    }
};

// --- DOM要素の取得 ---
const elDisplaySpecies = document.getElementById('display-species');
const elDisplayLevel = document.getElementById('display-level');
const elDisplayNextPts = document.getElementById('display-next-pts');
const elDisplayTotalPts = document.getElementById('display-total-pts');
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

function init() {
    // 拡張データ対応のためセーブキーのバージョンを更新
    const savedData = localStorage.getItem('inumikuji_split_save_v4');
    if (savedData) {
        state = JSON.parse(savedData);
    } else {
        const oldSaved = localStorage.getItem('inumikuji_split_save_v3') || localStorage.getItem('inumikuji_split_save');
        if (oldSaved) {
            state = JSON.parse(oldSaved);
        }
    }
    updateCharacterAndHeader();
    setupEventListeners();
}

function getActiveCharInfo() {
    if (state.chosenAnimalGroup !== 'dog') {
        const base = charData[state.chosenAnimalGroup];
        return { name: base.name, avatar: base.avatar, tone: base.tone, speciesLabel: base.name };
    } else {
        const list = charData.dog;
        for (let info of list) {
            if (state.level <= info.maxLv) {
                // 進化順ルート上にある各動物のラベルとトーンを正確に返す
                let label = "犬";
                if (info.name === "ライオン") label = "猛獣";
                if (info.name === "トラ") label = "猛獣";
                if (info.name === "イルカ") label = "海洋生物";
                if (info.name === "キリン") label = "大型草食獣";
                return { name: info.name, avatar: info.avatar, tone: info.tone, speciesLabel: label };
            }
        }
        const last = list[list.length - 1];
        return { name: last.name, avatar: last.avatar, tone: last.tone, speciesLabel: "大型草食獣" };
    }
}

function updateCharacterAndHeader() {
    const charInfo = getActiveCharInfo();
    
    elDisplaySpecies.textContent = charInfo.speciesLabel;
    elDisplayLevel.textContent = state.level;
    elDisplayTotalPts.textContent = state.points;
    
    const ptsInCurrentLevel = state.points % 10;
    const nextRequired = 10 - ptsInCurrentLevel;
    elDisplayNextPts.textContent = nextRequired;
    elLevelProgress.style.width = `${ptsInCurrentLevel * 10}%`;

    elAvatar.textContent = charInfo.avatar;
    elNameTag.textContent = charInfo.name;

    // 全ての動物の進化（キリン到達＝Lv70以上）を遂げた後にクリア特典としてエンドコンテンツを解放
    if (state.level >= 70) {
        elEndContentBox.style.display = 'block';
        elAnimalSelect.value = state.chosenAnimalGroup;
    } else {
        elEndContentBox.style.display = 'none';
    }
}

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
    localStorage.setItem('inumikuji_split_save_v4', JSON.stringify(state));
}

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

function executeOmikujiResults() {
    const mood = state.selectedMood;
    const charInfo = getActiveCharInfo();

    const randomSetting = luckSettings[Math.floor(Math.random() * luckSettings.length)];
    const randomLuck = randomSetting.name;
    const earnedPoints = randomSetting.points; 
    
    const oldLevel = state.level;
    
    state.points += earnedPoints;
    state.level = Math.floor(state.points / 10) + 1;
    
    saveState();

    elResultLuck.textContent = randomLuck;
    
    let ptsText = `おみくじ結果【${randomLuck}】により +${earnedPoints} ポイント獲得！`;
    
    // 進化後の名前タグを再取得してレベルアップメッセージに反映
    const nextCharInfo = getActiveCharInfo();
    if (state.level > oldLevel) {
        ptsText += ` 🎉 レベルアップ！【${nextCharInfo.name}】に絆が深まりました！`;
    }
    elResultPoints.textContent = ptsText;

    const toneArrayMap = messageDatabase[charInfo.tone];
    const pool = (toneArrayMap && toneArrayMap[mood]) ? toneArrayMap[mood] : ["今日も無理せず進もうね。"];
    let messageText = pool[Math.floor(Math.random() * pool.length)];
    
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
