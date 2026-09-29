/* グラスことわざ — Glass Kotowaza
 * 入力: D-pad（矢印キー）とタップ（Enter）のみ。Escape は PC 確認用の補助。
 * 依存ライブラリなし。すべて DOM。
 * ?demo=1 でデモ録画用（出題を固定・記録は保存しない）。
 */
(function () {
  'use strict';

  // ---------- データ ----------
  // ことわざ|よみ|あなうめで隠す部分|意味|タグ（先頭＝似た意味のグループ。残りは4択で紛らわしい選択肢を避けるため）|反対の意味のグループ
  var RAW = [
    '猫に小判|ねこにこばん|小判|値打ちのわからない者に貴重な物を与えても、何の役にも立たないこと|kachi',
    '豚に真珠|ぶたにしんじゅ|真珠|価値のわからない者に値打ちのある物を与えても、むだであること|kachi',
    '馬の耳に念仏|うまのみみにねんぶつ|念仏|いくら意見をしても、聞き流されて少しも効き目がないこと|mimi kikime kachi',
    '蛙の面に水|かえるのつらにみず|面|何を言われても、どんな仕打ちを受けても平気でいること|mimi kikime',
    '糠に釘|ぬかにくぎ|釘|手ごたえや効き目がまったくないこと|kikime',
    '暖簾に腕押し|のれんにうでおし|腕押し|力を入れても手ごたえがなく、張り合いがないこと|kikime',
    '焼け石に水|やけいしにみず|水|わずかな助けや努力では、ほとんど効果がないこと|yakeishi kikime wazuka',
    '猿も木から落ちる|さるもきからおちる|猿|その道の名人でも、ときには失敗することがある|meijin',
    '河童の川流れ|かっぱのかわながれ|河童|泳ぎの得意な者でもおぼれるように、名人でも失敗することがある|meijin',
    '弘法にも筆の誤り|こうぼうにもふでのあやまり|筆|書の名人の弘法大師でも書き損じるように、名人でも失敗することがある|meijin',
    '石の上にも三年|いしのうえにもさんねん|三年|つらくてもしんぼうして続ければ、いつかは報われる|nintai kotsu',
    '雨垂れ石を穿つ|あまだれいしをうがつ|石|小さな力でも根気よく続ければ、大きなことをなしとげられる|nintai kotsu',
    '塵も積もれば山となる|ちりもつもればやまとなる|山|わずかなものでも、積み重なれば大きなものになる|kotsu',
    '千里の道も一歩から|せんりのみちもいっぽから|一歩|大きな仕事も、まずは手近な一歩から始まる|ippo kotsu',
    '急がば回れ|いそがばまわれ|回れ|急ぐときこそ、遠回りでも安全で確実な方法をとるほうが結局は早い|jikkuri|isoge',
    '急いては事を仕損じる|せいてはことをしそんじる|事|あせって物事をすると、失敗しやすい|jikkuri|isoge',
    '善は急げ|ぜんはいそげ|善|よいと思ったことは、ためらわずにすぐ実行せよ|isoge|jikkuri',
    '思い立ったが吉日|おもいたったがきちじつ|吉日|何かをしようと思ったら、その日を吉日としてすぐに始めるのがよい|isoge|jikkuri',
    '鉄は熱いうちに打て|てつはあついうちにうて|鉄|物事は時機をのがさずに行うべきだ。人は若いうちに鍛えるべきだ|tetsu isoge',
    '石橋を叩いて渡る|いしばしをたたいてわたる|石橋|用心の上にも用心を重ねて、物事を行うこと|youjin',
    '転ばぬ先の杖|ころばぬさきのつえ|杖|失敗しないように、前もって用心しておくこと|youjin',
    '備えあれば憂いなし|そなえあればうれいなし|備え|ふだんから準備をしておけば、いざというときに心配がない|youjin',
    '勝って兜の緒を締めよ|かってかぶとのおをしめよ|兜|成功しても油断せず、いっそう気を引き締めよ|yudan youjin',
    '後悔先に立たず|こうかいさきにたたず|後悔|すんでしまったことを、あとで悔やんでも取り返しがつかない|koukai',
    '覆水盆に返らず|ふくすいぼんにかえらず|盆|一度してしまったことは、もう元には戻らない|koukai',
    '二兎を追う者は一兎をも得ず|にとをおうものはいっとをもえず|一兎|同時に二つのことをしようとすると、結局どちらもうまくいかない|abu|ichiseki',
    '虻蜂取らず|あぶはちとらず|虻蜂|二つのものを同時にとろうとして、どちらも手に入らないこと|abu|ichiseki',
    '一石二鳥|いっせきにちょう|二鳥|一つのことをして、同時に二つの利益を得ること|ichiseki|abu',
    '花より団子|はなよりだんご|団子|風流よりも、実際に役立つものや利益を選ぶこと|dango',
    '論より証拠|ろんよりしょうこ|証拠|あれこれ議論するより、証拠を示すほうが物事ははっきりする|shouko',
    '百聞は一見に如かず|ひゃくぶんはいっけんにしかず|一見|何度も話を聞くより、一度自分の目で見るほうが確かだ|shouko',
    '井の中の蛙大海を知らず|いのなかのかわずたいかいをしらず|蛙|せまい世界にとじこもって、広い世界があることを知らないこと|semai',
    '灯台下暗し|とうだいもとくらし|灯台|身近なことは、かえって気がつきにくい|toudai',
    '犬も歩けば棒に当たる|いぬもあるけばぼうにあたる|棒|出しゃばると災難にあう。また、動けば思わぬ幸運にあうこともある|inu kouun',
    '棚からぼたもち|たなからぼたもち|ぼたもち|何もしないのに、思いがけない幸運が舞いこむこと|kouun',
    '果報は寝て待て|かほうはねてまて|果報|幸運はあせらず、気長に待つのがよい|matsu kouun',
    '待てば海路の日和あり|まてばかいろのひよりあり|海路|じっと待っていれば、やがてよい機会がやってくる|matsu kouun',
    '三人寄れば文殊の知恵|さんにんよればもんじゅのちえ|文殊|ふつうの人でも、三人集まって相談すれば、よい考えが浮かぶ|chie|sendou',
    '船頭多くして船山に上る|せんどうおおくしてふねやまにのぼる|船頭|指図する人が多すぎて、物事がとんでもない方向へ進んでしまう|sendou|chie',
    '七転び八起き|ななころびやおき|八起き|何度失敗しても、くじけずに立ち上がること|fukutsu',
    '失敗は成功のもと|しっぱいはせいこうのもと|成功|失敗しても原因を反省して改めれば、次の成功につながる|fukutsu',
    '能ある鷹は爪を隠す|のうあるたかはつめをかくす|爪|本当に実力のある者は、それをむやみにひけらかさない|kenkyo',
    '実るほど頭を垂れる稲穂かな|みのるほどこうべをたれるいなほかな|稲穂|学問や人格がすぐれた人ほど、謙虚になるものだ|kenkyo',
    '出る杭は打たれる|でるくいはうたれる|杭|才能があって目立つ者は、とかく人から憎まれ、じゃまされる|deru',
    '口は災いの元|くちはわざわいのもと|口|不用意な発言は、災難を招くもとになる|kuchi',
    '雉も鳴かずば撃たれまい|きじもなかずばうたれまい|雉|よけいなことを言わなければ、災いを招かずにすむ|kuchi',
    '知らぬが仏|しらぬがほとけ|仏|知れば腹も立つが、知らなければ仏のように平気でいられる|shiranu',
    '聞くは一時の恥、聞かぬは一生の恥|きくはいっときのはじ、きかぬはいっしょうのはじ|一生|知らないことを聞くのはその場だけの恥だが、聞かずにいると一生恥をかく|kiku',
    '泣き面に蜂|なきつらにはち|蜂|悪いことが起きたうえに、さらに悪いことが重なること|fuun',
    '弱り目に祟り目|よわりめにたたりめ|祟り目|困っているときに、さらに困ったことが重なること|fuun',
    '笑う門には福来る|わらうかどにはふくきたる|福|いつも笑いの絶えない家には、自然と幸せがやってくる|warau',
    '早起きは三文の徳|はやおきはさんもんのとく|三文|朝早く起きると、何かしらよいことがある|hayaoki',
    '時は金なり|ときはかねなり|金|時間はお金と同じように貴重なので、むだにしてはいけない|toki',
    '光陰矢の如し|こういんやのごとし|矢|月日がたつのは、矢が飛ぶようにとても早い|kouin',
    '案ずるより産むが易し|あんずるよりうむがやすし|産む|前もってあれこれ心配するより、実際にやってみると案外たやすい|anzuru shinpai',
    '明日は明日の風が吹く|あしたはあしたのかぜがふく|風|先のことをくよくよ心配してもしかたがない。なるようになる|ashita shinpai',
    '住めば都|すめばみやこ|都|どんな所でも、住み慣れるとそこがいちばんよく思える|sumeba',
    '郷に入っては郷に従え|ごうにいってはごうにしたがえ|従え|その土地や集団に入ったら、そこの習わしに従うのがよい|gou',
    '情けは人の為ならず|なさけはひとのためならず|情け|人に親切にしておけば、めぐりめぐって自分によい報いがある|nasake',
    '身から出た錆|みからでたさび|錆|自分の悪い行いのせいで、自分が苦しむこと|jigou',
    '人を呪わば穴二つ|ひとをのろわばあなふたつ|穴|人に害を与えようとすれば、自分も同じように害を受ける|noroi jigou',
    '医者の不養生|いしゃのふようじょう|医者|人には立派なことを言いながら、自分では実行しないこと|ishya',
    '紺屋の白袴|こうやのしろばかま|白袴|人のためにばかり忙しくて、自分のことに手が回らないこと|ishya',
    '餅は餅屋|もちはもちや|餅屋|何事も、その道の専門家にまかせるのがいちばんよい|mochiya',
    '蛙の子は蛙|かえるのこはかえる|子|子は親に似るものだ。平凡な親の子は、やはり平凡である|oyako|tobi',
    '瓜の蔓に茄子はならぬ|うりのつるになすびはならぬ|茄子|平凡な親から、すぐれた子は生まれない|oyako|tobi',
    '鳶が鷹を生む|とびがたかをうむ|鷹|平凡な親から、すぐれた子が生まれること|tobi|oyako',
    '親の心子知らず|おやのこころこしらず|心|子を思う親の気持ちを知らずに、子は勝手なことをする|oyagokoro',
    '可愛い子には旅をさせよ|かわいいこにはたびをさせよ|旅|子どもがかわいいなら、甘やかさずに世の中の苦労を経験させよ|tabi',
    '好きこそ物の上手なれ|すきこそもののじょうずなれ|上手|好きなことは熱心に取り組むので、上達が早い|suki|heta',
    '下手の横好き|へたのよこずき|横好き|下手なのに、その物事が好きで熱心なこと|heta|suki',
    '習うより慣れよ|ならうよりなれよ|慣れよ|人から教わるより、自分で何度もやって慣れるほうが身につく|narau',
    '良薬は口に苦し|りょうやくはくちににがし|良薬|よく効く薬が苦いように、ためになる忠告ほど聞くのがつらい|ryouyaku',
    '人の振り見て我が振り直せ|ひとのふりみてわがふりなおせ|直せ|人の行いを見て、自分の行いを反省し改めよ|furi',
    '他山の石|たざんのいし|他山|他人のつまらない言動も、自分をみがく助けになる|furi',
    '立つ鳥跡を濁さず|たつとりあとをにごさず|鳥|立ち去る者は、あとが見苦しくないようにきれいに始末をすべきだ|tatsu|atoha',
    '後は野となれ山となれ|あとはのとなれやまとなれ|野|目の前のことさえすめば、あとはどうなってもかまわない|atoha shinpai|tatsu',
    '二度あることは三度ある|にどあることはさんどある|三度|二度起きたことは、もう一度起こりやすい|nido|sando',
    '三度目の正直|さんどめのしょうじき|正直|一度目・二度目はだめでも、三度目はうまくいく|sando|nido',
    '仏の顔も三度|ほとけのかおもさんど|顔|どんなにおだやかな人でも、何度もひどいことをされれば怒る|hotoke',
    '雀百まで踊り忘れず|すずめひゃくまでおどりわすれず|雀|幼いころに身についた習慣は、年をとっても直らない|mitsugo',
    '三つ子の魂百まで|みつごのたましいひゃくまで|魂|幼いころの性質は、年をとっても変わらない|mitsugo',
    '鬼に金棒|おににかなぼう|金棒|強い者が何かを得て、さらに強くなること|oni',
    '鬼の居ぬ間に洗濯|おにのいぬまにせんたく|洗濯|こわい人やうるさい人がいない間に、のんびりくつろぐこと|oninoinu',
    '捕らぬ狸の皮算用|とらぬたぬきのかわざんよう|狸|手に入るかわからないうちから、それをあてにして計画を立てること|tanuki ate',
    '絵に描いた餅|えにかいたもち|餅|どんなによく見えても、実際には役に立たないもの|emochi ate',
    '月とすっぽん|つきとすっぽん|すっぽん|比べものにならないほど、ちがいが大きいこと|chigai|onaji',
    '提灯に釣鐘|ちょうちんにつりがね|釣鐘|形は似ていても、つりあいがとれないほどちがうこと|chigai|onaji',
    '五十歩百歩|ごじっぽひゃっぽ|百歩|少しのちがいはあっても、本質的には同じであること|onaji|chigai',
    '団栗の背比べ|どんぐりのせいくらべ|背比べ|どれも平凡で、とびぬけてすぐれたものがないこと|onaji|chigai',
    '類は友を呼ぶ|るいはともをよぶ|友|気の合う者や似た者どうしは、自然に集まる|rui',
    '朱に交われば赤くなる|しゅにまじわればあかくなる|赤|人はつきあう相手によって、よくも悪くもなる|shu',
    '寄らば大樹の陰|よらばたいじゅのかげ|大樹|頼るなら、力のある者のほうが安心だ|taiju',
    '長い物には巻かれろ|ながいものにはまかれろ|長い|力の強い者には、逆らわずに従っておくほうが得だ|taiju',
    '虎の威を借る狐|とらのいをかるきつね|狐|力のある者の権威をかさに着て、いばる小者のこと|tora taiju',
    '背に腹は代えられない|せにはらはかえられない|腹|大切なことのためには、ほかを多少犠牲にするのもしかたがない|seni',
    '喉元過ぎれば熱さを忘れる|のどもとすぎればあつさをわすれる|喉元|苦しいことも、過ぎてしまえばその苦しさを忘れてしまう|nodo wasure',
    '人の噂も七十五日|ひとのうわさもしちじゅうごにち|噂|世間のうわさは長く続かず、しばらくすれば忘れられる|uwasa wasure',
    '腐っても鯛|くさってもたい|鯛|すぐれたものは、いたんだり落ちぶれたりしても値打ちを失わない|tai',
    '雨降って地固まる|あめふってじかたまる|地|もめごとのあとは、かえって前よりよい状態になる|ame',
    '亀の甲より年の功|かめのこうよりとしのこう|年|年長者の長い経験は尊いものだ|toshi',
    '帯に短し襷に長し|おびにみじかしたすきにながし|襷|中途半端で、どちらの役にも立たないこと|obi',
    '木を見て森を見ず|きをみてもりをみず|森|細かいところにとらわれて、全体を見失うこと|mori',
    '嘘も方便|うそもほうべん|方便|物事をうまく運ぶためには、うそが必要なときもある|uso',
    '渡る世間に鬼はない|わたるせけんにおにはない|鬼|世の中には冷たい人ばかりでなく、情け深い人も必ずいる|seken|dorobou',
    '人を見たら泥棒と思え|ひとをみたらどろぼうとおもえ|泥棒|他人はかんたんに信用せず、まず疑ってかかれ|dorobou|seken',
    '終わりよければすべてよし|おわりよければすべてよし|終わり|結果がよければ、途中の失敗や苦労は問題にならない|owari',
    '大は小を兼ねる|だいはしょうをかねる|大|大きいものは、小さいものの代わりにも使える|dai',
    '風が吹けば桶屋が儲かる|かぜがふけばおけやがもうかる|桶屋|ある出来事の影響が、めぐりめぐって思わぬところに及ぶこと|oke',
    '一寸の虫にも五分の魂|いっすんのむしにもごぶのたましい|五分|小さく弱い者にも、それなりの意地や考えがある|issun',
    '馬子にも衣装|まごにもいしょう|衣装|どんな人でも、身なりを整えれば立派に見える|mago',
    '人間万事塞翁が馬|にんげんばんじさいおうがうま|塞翁|人生の幸不幸は、あとになってみないとわからない|saiou',
    '猫の手も借りたい|ねこのてもかりたい|手|とても忙しくて、だれでもいいから手伝ってほしい|nekonote',
    '猫をかぶる|ねこをかぶる|猫|本当の性格をかくして、おとなしそうにふるまう|nekokaburu',
    '猫の額|ねこのひたい|額|土地や庭などが、とてもせまいこと|hitai',
    '雀の涙|すずめのなみだ|涙|ほんのわずかなこと|wazuka',
    '鶴の一声|つるのひとこえ|鶴|大勢の議論を、力のある人の一言がおさえて決めてしまうこと|tsuru',
    '目から鱗が落ちる|めからうろこがおちる|鱗|あることをきっかけに、急に物事がよくわかるようになる|uroko',
    '犬猿の仲|けんえんのなか|犬猿|とても仲が悪いこと|kenen|umagau',
    '馬が合う|うまがあう|馬|気が合って、うまくやっていける|umagau|kenen'
  ];
  var D = RAW.map(function (line, i) {
    var p = line.split('|');
    var tags = p[4].split(' ');
    return { i: i, k: p[0], y: p[1], b: p[2], m: p[3], tags: tags, g: tags[0], o: p[5] || '' };
  });
  var N = D.length;

  // ---------- 状態 ----------
  var DEMO = /[?&](demo|auto)=1/.test(location.search);
  var seed = 20260929;
  var rand = DEMO
    ? function () { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
    : Math.random;

  var st = { ans: 0, ok: 0, streak: 0, best: 0, nig: [], got: {}, zi: -1 };
  var mode = 'title', menuIdx = 0, menuItems = [], menuEl = 'title-list';
  var el = function (id) { return document.getElementById(id); };

  // ---------- 保存 ----------
  var KEY = 'glass-kotowaza-v1';
  function save() {
    if (DEMO) return;
    try { localStorage.setItem(KEY, JSON.stringify(st)); }
    catch (e) { /* 保存できなくても動作には影響しない */ }
  }
  function load() {
    if (DEMO) return;
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!s) return;
      st.ans = s.ans | 0; st.ok = s.ok | 0; st.streak = s.streak | 0; st.best = s.best | 0;
      st.nig = (s.nig || []).filter(function (x) { return x >= 0 && x < N; });
      st.got = s.got || {};
      st.zi = typeof s.zi === 'number' ? s.zi : -1;
    } catch (e) { /* 壊れていたら初期値のまま */ }
  }
  function learnedCount() {
    var c = 0;
    for (var i = 0; i < N; i++) if (st.got[i] && st.nig.indexOf(i) < 0) c++;
    return c;
  }

  // ---------- ユーティリティ ----------
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rand() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function todayIndex() {
    var d = new Date();
    var days = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
    return (days * 37) % N;
  }
  function shareTag(a, b) {
    for (var i = 0; i < a.tags.length; i++) if (b.tags.indexOf(a.tags[i]) >= 0) return true;
    return false;
  }
  function similar(e) {
    return D.filter(function (x) { return x !== e && x.g === e.g; });
  }
  function opposite(e) {
    return e.o ? D.filter(function (x) { return x.g === e.o; }) : [];
  }
  function isKanaMixed(s) { return /[぀-ヿ]/.test(s); }
  function blanked(e, fill, cls) {
    var at = e.k.indexOf(e.b);
    return esc(e.k.slice(0, at)) + '<span class="' + cls + '">' + esc(fill) + '</span>' + esc(e.k.slice(at + e.b.length));
  }

  // ---------- 出題 ----------
  var ROUND = 10;
  var Q = null; // { kind, list:[{e, type, choices, ans}], i, ok, streak, answered, pick, newNig }

  function makeFill(e) {
    var used = {}, allK = {};
    D.forEach(function (x) { allK[x.k] = 1; });
    used[e.b] = 1;
    var cls = isKanaMixed(e.b);
    // 同じ文字数・同じ文字種 → 文字数の近い順 に候補を集める
    var pool = D.filter(function (x) { return x !== e && !used[x.b]; });
    pool.sort(function (a, b) {
      var sa = Math.abs(a.b.length - e.b.length) * 2 + (isKanaMixed(a.b) === cls ? 0 : 1);
      var sb = Math.abs(b.b.length - e.b.length) * 2 + (isKanaMixed(b.b) === cls ? 0 : 1);
      return sa - sb || rand() - 0.5;
    });
    var wrong = [];
    for (var i = 0; i < pool.length && wrong.length < 3; i++) {
      var w = pool[i].b;
      if (used[w]) continue;
      // 差し替えた結果が別のことわざそのものになる選択肢は使わない
      if (allK[e.k.replace(e.b, w)]) continue;
      used[w] = 1;
      wrong.push(w);
    }
    return wrong;
  }
  function makeMean(e) {
    var pool = shuffle(D.filter(function (x) { return x !== e && !shareTag(x, e); }));
    return pool.slice(0, 3);
  }
  function makeQuestion(e, type) {
    var choices, ans;
    if (type === 'fill') {
      choices = [e.b].concat(makeFill(e));
    } else if (type === 'p2m') {
      choices = [e.m].concat(makeMean(e).map(function (x) { return x.m; }));
    } else {
      choices = [e.k].concat(makeMean(e).map(function (x) { return x.k; }));
    }
    var right = choices[0];
    shuffle(choices);
    ans = choices.indexOf(right);
    return { e: e, type: type, choices: choices, ans: ans };
  }
  function startQuiz(kind) {
    var ids;
    if (kind === 'nig') {
      if (!st.nig.length) { toast('にがては まだありません'); return; }
      ids = shuffle(st.nig.slice()).slice(0, ROUND);
    } else {
      ids = shuffle(D.map(function (x) { return x.i; })).slice(0, ROUND);
    }
    var list = ids.map(function (id) {
      var type = kind === 'fill' ? 'fill'
        : kind === 'mean' ? (rand() < 0.5 ? 'p2m' : 'm2p')
        : (['fill', 'p2m', 'm2p'])[Math.floor(rand() * 3)];
      return makeQuestion(D[id], type);
    });
    if (DEMO) {
      // 録画用: 1問目は2番目、2問目は4番目が正解になるよう並べ替える
      [1, 3].forEach(function (pos, qi) {
        var q = list[qi]; if (!q) return;
        var r = q.choices[q.ans];
        q.choices.splice(q.ans, 1);
        q.choices.splice(pos, 0, r);
        q.ans = pos;
      });
    }
    Q = { kind: kind, list: list, i: 0, ok: 0, streak: 0, newNig: 0, fixed: 0 };
    menuIdx = 0;
    mode = 'quiz';
    show('quiz');
    renderQ(false);
  }
  var KIND_LABEL = { fill: 'あなうめ', mean: 'いみ', nig: 'にがて' };

  function renderQ(answered) {
    var q = Q.list[Q.i], e = q.e;
    Q.answered = answered;
    el('hud-right').innerHTML = KIND_LABEL[Q.kind] + ' ' + (Q.i + 1) + '/' + Q.list.length +
      ' ・ <b>✔' + Q.ok + '</b>' + (Q.streak >= 2 ? ' ・ 🔥' + Q.streak + '連続' : '');
    var box = el('q-box'), main = el('q-main'), sub = el('q-sub');
    box.className = answered ? (q.pick === q.ans ? 'ok' : 'ng') : '';
    main.className = '';
    if (!answered) {
      if (q.type === 'fill') {
        el('q-kind').textContent = '□に入ることばは？';
        main.innerHTML = blanked(e, new Array(e.b.length + 1).join('□'), 'blank');
        sub.textContent = '';
      } else if (q.type === 'p2m') {
        el('q-kind').textContent = 'このことわざの意味は？';
        main.textContent = e.k;
        sub.textContent = e.y;
      } else {
        el('q-kind').textContent = 'この意味のことわざは？';
        main.className = 'mean';
        main.textContent = e.m;
        sub.textContent = '';
      }
    } else {
      el('q-kind').textContent = q.pick === q.ans ? '○ 正解！' : '× ざんねん … 正解は';
      main.innerHTML = q.type === 'fill' ? blanked(e, e.b, 'fill') : esc(e.k);
      if (e.k.length > 14) main.style.fontSize = '26px'; else main.style.fontSize = '';
      sub.innerHTML = esc(e.y) + '<span class="m">' + esc(e.m) + '</span>';
    }
    if (!answered) main.style.fontSize = (q.type !== 'm2p' && e.k.length > 14) ? '26px' : '';

    var list = el('q-list');
    list.innerHTML = '';
    q.choices.forEach(function (c, i) {
      var b = document.createElement('div');
      var cls = 'rail-btn' + (q.type === 'p2m' ? ' long' : '');
      if (answered) {
        if (i === q.ans) cls += ' right';
        else if (i === q.pick) cls += ' wrong';
        else cls += ' dim';
      } else if (i === menuIdx) cls += ' cur';
      b.className = cls;
      b.innerHTML = '<span class="no">' + (i + 1) + '</span><span>' + esc(c) + '</span>';
      b.addEventListener('click', function () { if (!Q.answered) { menuIdx = i; answer(); } });
      list.appendChild(b);
    });
    var foot = document.createElement('div');
    foot.className = 'foot';
    var items = answered
      ? [{ t: Q.i + 1 < Q.list.length ? '▶ つぎへ' : '▶ 結果を見る', f: nextQ }, { t: '← もどる', f: quizMenu, back: 1 }]
      : [{ t: '← もどる', f: quizMenu, back: 1 }];
    items.forEach(function (it, j) {
      var b = document.createElement('div');
      var idx = answered ? j : 4;
      b.className = 'rail-btn' + (it.back ? ' back' : '') + (menuIdx === idx ? ' cur' : '');
      b.textContent = it.t;
      b.addEventListener('click', it.f);
      foot.appendChild(b);
    });
    list.appendChild(foot);
    el('hint').textContent = answered ? 'タップでつぎへ ・ ↑↓←→ で「もどる」' : '↑↓ でえらんで タップで決定';
  }
  function answer() {
    var q = Q.list[Q.i], e = q.e;
    q.pick = menuIdx;
    var ok = q.pick === q.ans;
    var ni = st.nig.indexOf(e.i);
    if (ok) {
      Q.ok++; Q.streak++;
      if (!DEMO) {
        st.ok++; st.streak++;
        if (st.streak > st.best) st.best = st.streak;
        st.got[e.i] = 1;
        if (ni >= 0) { st.nig.splice(ni, 1); Q.fixed++; }
      }
    } else {
      Q.streak = 0;
      if (!DEMO) {
        st.streak = 0;
        if (ni < 0) { st.nig.push(e.i); Q.newNig++; }
      }
    }
    if (!DEMO) st.ans++;
    save();
    menuIdx = 0;
    renderQ(true);
    var mk = el('q-mark');
    mk.className = ''; void mk.offsetWidth;
    mk.textContent = ok ? '○' : '×';
    mk.className = ok ? 'ok' : 'ng';
  }
  function nextQ() {
    if (Q.i + 1 >= Q.list.length) { resultMenu(); return; }
    Q.i++;
    menuIdx = 0;
    el('q-mark').className = '';
    renderQ(false);
  }
  function backToQuiz() {
    mode = 'quiz';
    show('quiz');
    menuIdx = 0;
    renderQ(Q.answered);
    el('q-mark').className = '';
  }

  // ---------- ずかん ----------
  var order = D.slice().sort(function (a, b) { return a.y < b.y ? -1 : a.y > b.y ? 1 : 0; });
  var zPos = 0, zNig = false;
  var ROWS = [['あ', 0x3041], ['か', 0x304B], ['さ', 0x3055], ['た', 0x305F], ['な', 0x306A],
    ['は', 0x306F], ['ま', 0x307E], ['や', 0x3083], ['ら', 0x3089], ['わ', 0x308E]];
  function rowOf(e) {
    var c = e.y.charCodeAt(0), r = 0;
    for (var i = 0; i < ROWS.length; i++) if (c >= ROWS[i][1]) r = i;
    return r;
  }
  function zList() {
    return zNig ? order.filter(function (x) { return st.nig.indexOf(x.i) >= 0; }) : order;
  }
  function openZukan(id) {
    var L = zList();
    if (!L.length) { zNig = false; L = zList(); }
    if (typeof id === 'number') {
      for (var i = 0; i < L.length; i++) if (L[i].i === id) { zPos = i; break; }
    }
    if (zPos >= L.length) zPos = 0;
    mode = 'zukan';
    show('zukan');
    renderZ(0);
  }
  function renderZ(dir) {
    var L = zList(), e = L[zPos];
    st.zi = e.i;
    var tags = '';
    if (e.i === todayIndex()) tags += '<span class="td">きょう</span>';
    if (st.nig.indexOf(e.i) >= 0) tags += '<span class="ng">にがて</span>';
    else if (st.got[e.i]) tags += '<span class="ok">★ おぼえた</span>';
    el('z-no').textContent = (zPos + 1) + ' / ' + L.length + ' ・ ' + ROWS[rowOf(e)][0] + '行' + (zNig ? ' ・ にがてだけ' : '');
    el('z-tag').innerHTML = tags;
    var z = el('z-main');
    z.textContent = e.k;
    z.style.fontSize = e.k.length > 16 ? '26px' : e.k.length > 12 ? '31px' : e.k.length > 9 ? '36px' : '44px';
    el('z-yomi').textContent = e.y;
    el('z-mean').textContent = e.m;
    function chips(arr) {
      if (!arr.length) return '<span class="none">—</span>';
      return arr.map(function (x) { return '<span class="chip">' + esc(x.k) + '</span>'; }).join('');
    }
    el('z-rel').innerHTML =
      '<div class="row"><span class="lb">似た意味</span><span class="v">' + chips(similar(e)) + '</span></div>' +
      '<div class="row"><span class="lb o">反対の意味</span><span class="v">' + chips(opposite(e)) + '</span></div>';
    el('hud-right').innerHTML = 'ずかん ・ おぼえた <b>' + learnedCount() + '</b>/' + N;
    el('z-hint').innerHTML = '←→ めくる ・ ↑↓ 行をとぶ ・ タップで ≡ メニュー（もどる）';
    var c = el('z-card');
    c.className = '';
    if (dir) { void c.offsetWidth; c.className = 'flip' + (dir < 0 ? ' l' : ''); }
    save();
  }
  function zukanKey(key) {
    var L = zList();
    if (key === 'ArrowRight') { zPos = (zPos + 1) % L.length; renderZ(1); }
    else if (key === 'ArrowLeft') { zPos = (zPos + L.length - 1) % L.length; renderZ(-1); }
    else if (key === 'ArrowDown' || key === 'ArrowUp') {
      var r = rowOf(L[zPos]), d = key === 'ArrowDown' ? 1 : -1, p = zPos;
      if (d > 0) {
        while (p < L.length && rowOf(L[p]) === r) p++;
        if (p >= L.length) p = 0;
      } else {
        // いまの行の先頭へ。すでに先頭ならひとつ前の行の先頭へ
        var start = p;
        while (start > 0 && rowOf(L[start - 1]) === r) start--;
        if (start === p) {
          p = (p + L.length - 1) % L.length;
          var r2 = rowOf(L[p]);
          while (p > 0 && rowOf(L[p - 1]) === r2) p--;
        } else p = start;
      }
      zPos = p;
      renderZ(d);
    } else if (key === 'Enter' || key === ' ') zukanMenu();
    else return false;
    return true;
  }

  // ---------- 画面とメニュー ----------
  function show(id) {
    ['title', 'quiz', 'zukan', 'menu', 'howto'].forEach(function (s) { el(s).classList.toggle('hidden', s !== id); });
  }
  function setMenu(listId, items, idx) {
    menuEl = listId; menuItems = items; menuIdx = idx || 0;
    paintMenu();
  }
  function paintMenu() {
    var list = el(menuEl);
    list.innerHTML = '';
    menuItems.forEach(function (it, i) {
      var b = document.createElement('div');
      b.className = 'rail-btn' + (it.cls ? ' ' + it.cls : '') + (i === menuIdx ? ' cur' : '');
      if (it.html) b.innerHTML = it.html;
      else {
        var label = typeof it.label === 'function' ? it.label() : it.label;
        b.innerHTML = '<span>' + label + '</span>' + (it.sub ? '<small>' + it.sub + '</small>' : '');
      }
      b.addEventListener('click', function () { menuIdx = i; paintMenu(); it.act(); });
      list.appendChild(b);
    });
  }

  function goTitle() {
    mode = 'title';
    show('title');
    el('hud-right').textContent = '';
    var rate = st.ans ? Math.round(st.ok / st.ans * 100) + '%' : '—';
    el('title-sub').innerHTML = '正答率 <b>' + rate + '</b>（' + st.ok + '/' + st.ans + '）・ 最高連続 <b>' + st.best +
      '</b> ・ おぼえた <b>' + learnedCount() + '</b>/' + N;
    var t = D[todayIndex()];
    var nigN = st.nig.length;
    setMenu('title-list', [
      { cls: 'today', act: function () { openZukan(t.i); },
        html: '<div class="lb">きょうのことわざ<small>タップでずかんへ</small></div>' +
          '<div class="pv">' + esc(t.k) + '</div><div class="ym">' + esc(t.y) + '</div>' +
          '<div class="mn">' + esc(t.m) + '</div>' },
      { label: '▶ あなうめクイズ', sub: '猫に□□ ・ ' + ROUND + '問', act: function () { startQuiz('fill'); } },
      { label: '▶ いみクイズ', sub: 'ことわざ⇄意味 ・ ' + ROUND + '問', act: function () { startQuiz('mean'); } },
      { label: '▶ にがてだけ', sub: nigN ? nigN + '問' : 'なし', cls: nigN ? '' : 'off', act: function () { startQuiz('nig'); } },
      { label: '📖 ずかん', sub: N + 'こ', act: function () { openZukan(st.zi >= 0 ? st.zi : t.i); } },
      { label: 'つかいかた', act: goHowto }
    ], menuEl === 'title-list' ? menuIdx : 0);
  }
  function goHowto() {
    mode = 'howto';
    show('howto');
    setMenu('howto-list', [{ label: '← タイトルにもどる', act: function () { goTitle(); } }]);
  }
  function quizMenu() {
    mode = 'menu';
    show('menu');
    el('menu-title').textContent = 'メニュー';
    el('menu-sub').textContent = KIND_LABEL[Q.kind] + ' ' + (Q.i + 1) + '/' + Q.list.length + '問目 ・ 正解 ' + Q.ok;
    setMenu('menu-list', [
      { label: '← クイズにもどる', act: backToQuiz },
      { label: 'やめてタイトルへ', act: goTitle }
    ]);
  }
  function resultMenu() {
    mode = 'menu';
    show('menu');
    el('hud-right').textContent = '';
    el('menu-title').textContent = Q.ok === Q.list.length ? '🎉 ぜんもん正解！' : 'けっか';
    var s = '<span class="big">' + Q.ok + '</span> / ' + Q.list.length + ' 問正解<br>';
    var notes = [];
    if (Q.newNig) notes.push('にがて +' + Q.newNig);
    if (Q.fixed) notes.push('こくふく ' + Q.fixed);
    notes.push('最高連続 ' + st.best);
    s += notes.join(' ・ ');
    el('menu-sub').innerHTML = s;
    var kind = Q.kind;
    setMenu('menu-list', [
      { label: '▶ もう一度', act: function () { startQuiz(kind); } },
      { label: '▶ にがてだけ', sub: st.nig.length ? st.nig.length + '問' : 'なし', cls: st.nig.length ? '' : 'off',
        act: function () { startQuiz('nig'); } },
      { label: '📖 ずかん', act: function () { openZukan(Q.list[0].e.i); } },
      { label: '← タイトルへ', act: goTitle }
    ]);
  }
  function zukanMenu() {
    mode = 'menu';
    show('menu');
    el('menu-title').textContent = 'ずかん';
    el('menu-sub').textContent = 'おぼえた ' + learnedCount() + ' / ' + N + ' ・ にがて ' + st.nig.length;
    setMenu('menu-list', [
      { label: '← ずかんにもどる', act: function () { openZukan(); } },
      { label: 'きょうのことわざへ', act: function () { zNig = false; openZukan(todayIndex()); } },
      { label: function () { return 'にがてだけ　' + (zNig ? 'ON' : 'OFF'); }, sub: st.nig.length + 'こ',
        act: function () {
          if (!zNig && !st.nig.length) { el('menu-sub').textContent = 'にがては まだありません'; return; }
          var cur = zList()[zPos];
          zNig = !zNig;
          zPos = 0;
          openZukan(cur ? cur.i : undefined);
        } },
      { label: '← タイトルへ', act: goTitle }
    ]);
  }

  var toastT = 0;
  function toast(msg) {
    var s = el(mode === 'title' ? 'title-sub' : 'menu-sub');
    var old = s.innerHTML, m0 = mode;
    s.textContent = msg;
    clearTimeout(toastT);
    toastT = setTimeout(function () { if (mode === m0) s.innerHTML = old; }, 1400);
  }

  // ---------- キー ----------
  function menuKey(key) {
    var it = menuItems[menuIdx];
    if (key === 'ArrowUp') { menuIdx = (menuIdx + menuItems.length - 1) % menuItems.length; paintMenu(); }
    else if (key === 'ArrowDown') { menuIdx = (menuIdx + 1) % menuItems.length; paintMenu(); }
    else if (key === 'Enter' || key === ' ') { if (it) it.act(); }
    else return false;
    return true;
  }
  function quizKey(key) {
    var q = Q.list[Q.i];
    if (!Q.answered) {
      var n = q.choices.length + 1; // 4択 + もどる
      if (key === 'ArrowUp') menuIdx = (menuIdx + n - 1) % n;
      else if (key === 'ArrowDown') menuIdx = (menuIdx + 1) % n;
      else if (key === 'Enter' || key === ' ') {
        if (menuIdx === q.choices.length) { quizMenu(); return true; }
        answer(); return true;
      } else return false;
      renderQ(false);
      return true;
    }
    if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
      menuIdx = menuIdx ? 0 : 1;
      renderQ(true);
    } else if (key === 'Enter' || key === ' ') {
      if (menuIdx === 1) quizMenu(); else nextQ();
    } else return false;
    return true;
  }
  function handleKey(key) {
    if (key === 'Escape') { // PC確認用の補助（グラスでは戻るジェスチャーが使えない）
      if (mode === 'howto') goTitle();
      else if (mode === 'quiz') quizMenu();
      else if (mode === 'zukan') zukanMenu();
      else if (mode === 'menu') goTitle();
      return true;
    }
    if (mode === 'quiz') return quizKey(key);
    if (mode === 'zukan') return zukanKey(key);
    return menuKey(key);
  }

  document.addEventListener('keydown', function (e) {
    if (e.repeat && e.key !== 'ArrowUp' && e.key !== 'ArrowDown' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
      e.preventDefault(); return;
    }
    if (handleKey(e.key)) e.preventDefault();
  });
  el('z-card').addEventListener('click', function () { if (mode === 'zukan') zukanMenu(); });

  load();
  goTitle();
})();
