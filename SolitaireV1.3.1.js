//APIキー
const apiKey = 'sample'; // ★APIキーを設定する
const searchEngineId = 'sample'; // ★検索エンジンIDを設定
//デフォルト背景などのカスタマイズ要素
const defaultProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1yk8LICiBA47bLzbx4B9GIgqb_b2ACfcfLQ&usqp=CAU';
const defaultBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOIniS7XLImZPYWtQWq9o4xQiAme6WXLHv1w&usqp=CAU';
const soundActivate = new Howl({
  preload: true,
  src: ['https://www.dropbox.com/s/ejwantauizk5dfz/activate.wav?raw=1']
});
const soundMessage = new Howl({
  preload: true,
  src: ['https://www.dropbox.com/s/hhq1os7inuhdeuo/chatmessage.wav?raw=1']
});
const soundMove = new Howl({
  preload: true,
  src: ['https://www.dropbox.com/s/4ob7mzr0yaxcmi4/move.wav?raw=1']
});
const soundAction = new Howl({
  preload: true,
  src: ['https://www.dropbox.com/s/b7qo343njbpmaw0/select.wav?raw=1']
});
const soundSummon = new Howl({
  preload: true,
  src: ['https://www.dropbox.com/s/q3ei7unfk4z1kom/summon.wav?raw=1']
});
const soundUndo = new Howl({
  preload: true,
  src: ['https://www.dropbox.com/s/jwul5831mrx6rff/undo.wav?raw=1']
});
//グローバル変数宣言
let maxZIndex = 0;
let reversedCardUrl = null;
let backgroundUrl = null;
//読み込み時、戻るボタンを無効化する
window.history.pushState(null, null, null);
window.addEventListener("popstate", ()=> {
  window.history.pushState(null, null, null);
  alert('誤操作防止のため、戻る機能は無効化されています。閉じるボタン等をご使用ください。');
  return;
});
//読み込み時、sessionStorageに保存されたカードの情報を取得して再表示
document.addEventListener('DOMContentLoaded', () => {
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key.startsWith('card')) {
      const cardData = JSON.parse(sessionStorage.getItem(key));
      const imgElement = document.createElement('img');
      imgElement.classList.add('cards');
      imgElement.id = cardData.id;
      imgElement.dataset.src = cardData.imageUrl; 
      imgElement.src = cardData.imageUrl;
      cardBoard.appendChild(imgElement);
    }
  }
});
//読み込み時、sessionStorageにスリーブや背景画像が格納されていれば取得して反映。なければデフォルトのを適用。
document.addEventListener('DOMContentLoaded', () => {
  const selectedProtectorUrl = sessionStorage.getItem('selectedProtectorUrl');
  if (selectedProtectorUrl) {
    reversedCardUrl = selectedProtectorUrl;
  } else {
    reversedCardUrl = defaultProtectorUrl;
  }
  const selectedBackgroundUrl = sessionStorage.getItem('selectedBackgroundUrl');
  if (selectedBackgroundUrl) {
    backgroundUrl = selectedBackgroundUrl;
    zoneBoard.style.backgroundImage = `url('${backgroundUrl}')`; // 変更点: 新しい背景画像を設定
  } else {
    backgroundUrl = defaultBackgroundUrl;
    zoneBoard.style.backgroundImage = `url('${backgroundUrl}')`; // 変更点: デフォルトの背景画像を設定
  }
});
const zoneBoard = document.getElementById('zoneBoard');
//読み込み時、EXモンスターゾーンとデッキの位置、Pゾーンをデコレーション
document.addEventListener('DOMContentLoaded', () => {
  const opponentMainDeck = document.createElement('img');
  opponentMainDeck.src = reversedCardUrl;
  opponentMainDeck.classList.add('decoratingCards');
  opponentMainDeck.style.transform = 'rotate(180deg)';
  document.getElementById('zone8').appendChild(opponentMainDeck);
  //opponentMainDeck.style.opacity = '1';
  const opponentExtraDeck = document.createElement('img');
  opponentExtraDeck.src = reversedCardUrl;
  opponentExtraDeck.classList.add('decoratingCards');
  opponentExtraDeck.style.transform = 'rotate(180deg)';
  document.getElementById('zone14').appendChild(opponentExtraDeck);
  const myExtraDeck = document.createElement('img');
  myExtraDeck.src = reversedCardUrl;
  myExtraDeck.classList.add('decoratingCards');
  document.getElementById('zone36').appendChild(myExtraDeck);
  const myMainDeck = document.createElement('img');
  myMainDeck.src = reversedCardUrl;
  myMainDeck.classList.add('decoratingCards');
  document.getElementById('zone42').appendChild(myMainDeck);
  const pendulumZoneBlueImageUrl = 'https://pbs.twimg.com/media/FxNpK8NaIAAGi-t?format=png&name=360x360';
  const pendulumZoneRedImageUrl = 'https://pbs.twimg.com/media/FxNpLXGaAAEB3fO?format=png&name=small';
  const opponentPendulumZoneRed = document.createElement('img');
  opponentPendulumZoneRed.src = pendulumZoneRedImageUrl;
  opponentPendulumZoneRed.classList.add('decoratingItems');
  opponentPendulumZoneRed.style.transform = 'rotate(180deg)';
  document.getElementById('zone9').appendChild(opponentPendulumZoneRed);
  const opponentPendulumZoneBlue = document.createElement('img');
  opponentPendulumZoneBlue.src = pendulumZoneBlueImageUrl;
  opponentPendulumZoneBlue.classList.add('decoratingItems');
  opponentPendulumZoneBlue.style.transform = 'rotate(180deg)';
  document.getElementById('zone13').appendChild(opponentPendulumZoneBlue);
  const myPendulumZoneBlue = document.createElement('img');
  myPendulumZoneBlue.src = pendulumZoneBlueImageUrl;
  myPendulumZoneBlue.classList.add('decoratingItems');
  document.getElementById('zone37').appendChild(myPendulumZoneBlue);
  const myPendulumZoneRed = document.createElement('img');
  myPendulumZoneRed.src = pendulumZoneRedImageUrl;
  myPendulumZoneRed.classList.add('decoratingItems');
  document.getElementById('zone41').appendChild(myPendulumZoneRed);
});
//好きなテーマのカード群やスリーブ、背景を表示する
const themeSelect = document.getElementById('themeSelect');
themeSelect.addEventListener('change', () => {
  const message = 'テーマを変更すると、それまでに呼び出したカードやログは無くなります。よろしいですか？';
  const confirmed = window.confirm(message);
  if (!confirmed) {
    return;
  } else {
    const selectedOption = document.getElementById('themeSelect').value;
    const createCardElement = (id, imageUrl) => {
      const imgElement = document.createElement('img');
      imgElement.classList.add('cards');
      imgElement.id = id;
      imgElement.dataset.src = imageUrl; //data属性に格納しておく
      imgElement.src = imageUrl;
      cardBoard.appendChild(imgElement);
      const cardData = {
        id,
        imageUrl
      };
      sessionStorage.setItem(id, JSON.stringify(cardData));
    };
    switch (selectedOption) {
      //デフォルト
      case 'default': {
        sessionStorage.clear();
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1yk8LICiBA47bLzbx4B9GIgqb_b2ACfcfLQ&usqp=CAU';
        sessionStorage.setItem('selectedProtectorUrl',
          optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOIniS7XLImZPYWtQWq9o4xQiAme6WXLHv1w&usqp=CAU';
        sessionStorage.setItem('selectedBackgroundUrl',
          optionalBackgroundUrl);
        location.reload();
      }
        break;
      //宝玉獣
      case 'crystalBeast': {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREOLI2LF8QBH46LmZDVktNkAxL7yqprx0jAw&usqp=CAU');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2I9cK4yaNyFJugdNnLoRU84E2U1nxLGLR0w&usqp=CAU');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTca-TdfvXnKJzGn9mFuMkbrO0_TBDK8ZW4Ew&usqp=CAU');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTca-TdfvXnKJzGn9mFuMkbrO0_TBDK8ZW4Ew&usqp=CAU');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTca-TdfvXnKJzGn9mFuMkbrO0_TBDK8ZW4Ew&usqp=CAU');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMu-LTrVKYfKfhFHzvDu9CjyevMPzuAD4_XA&usqp=CAU');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMu-LTrVKYfKfhFHzvDu9CjyevMPzuAD4_XA&usqp=CAU');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMu-LTrVKYfKfhFHzvDu9CjyevMPzuAD4_XA&usqp=CAU');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcY-6zlXwF1lP5FbvgFUhztpJOP4X9mJt31Q&usqp=CAU');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmRau_eflSLVb3Tc9d4TBIuBZKO_EmSwV-rA&usqp=CAU');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3G-6zozLP6Thc9NcI5O9EvkU4IoF1_0k_Pg&usqp=CAU');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQblRSbgo2g4ldUKv0Lx6spkSQHX0_6EaTklw&usqp=CAU');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA6ZJW349SH2072EJ1DjXmipJkAWXvmX8bIw&usqp=CAU');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROfe7Jhj2A5vyofIGisUY_vWSfE-U8v4ljnQ&usqp=CAU');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXJnBTk1ASMVPRqydafqvxsDW63zkyoBdBUQ&usqp=CAU');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXJnBTk1ASMVPRqydafqvxsDW63zkyoBdBUQ&usqp=CAU');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXJnBTk1ASMVPRqydafqvxsDW63zkyoBdBUQ&usqp=CAU');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtzmXmD73-a06zbmoxeyPWa_PrDsscQ_eHsg&usqp=CAU');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCHh0eh9dae_jOZ9yWsLeT7ATlgdU3f42KHQ&usqp=CAU');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxRkUa3aDnK1Q6LO7YLEtq07zXTm8bPtrptg&usqp=CAU');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQILCZIXtUS_Xr47yD1WmbHPOnVCS2AnrX2IA&usqp=CAU');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTyUTkuxy1bpstgzKNLflLMq_X3buYQYSPaw&usqp=CAU');
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1csFJ7QWNz07V-p7vdqVzZSSBUYJXUnNY_Q&usqp=CAU');
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRZ7wEMaQhrt2_2d9gBGyNZOl_YDGedKZw6w&usqp=CAU');
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS613usrWcCHwuI_-NIY9NlerCZcBcFJaxvSg&usqp=CAU');
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmx0_2TF4GW3WybCNBXqtOBQzC-DFULFuryA&usqp=CAU');
        createCardElement('card27', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEjKylWSGQ6kWi4v0Kiljw1TWEIEF7_SFlcg&usqp=CAU');
        createCardElement('card28', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRsWieE8Dl1Uok19zXIcIdI3_L7gxVsbzQRA&usqp=CAU');
        createCardElement('card29', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlMDzIM81IqKmijSB2m-vTBIpxMTiVThTW5A&usqp=CAU');
        createCardElement('card30', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlMDzIM81IqKmijSB2m-vTBIpxMTiVThTW5A&usqp=CAU');
        createCardElement('card31', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSI9yznDvwMuIaE4T6ufNREtByTXLNGQutAmw&usqp=CAU');
        createCardElement('card32', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtUWh9j-x0mjIHk1TsxN7u8Kq_E-jDDz34xQ&usqp=CAU');
        createCardElement('card33', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgoGAesVdVHYwS5JSrlkSWELvERzrQjDm7Ow&usqp=CAU');
        createCardElement('card34', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9_l0OvIGzEEh2oQARfp7e00vWII0L028Tqw&usqp=CAU');
        createCardElement('card35', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfJ71ehxemVKt56H3ZVWnsgFLsZGOXPneCxQ&usqp=CAU');
        createCardElement('card36', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTqY_wPrJ6DTEA1qZ81wWY7MtVfRebPxEltQ&usqp=CAU');
        createCardElement('card37', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS191v4SJDK9rIFfTvjc2XuMg6ZoV48PZgEiA&usqp=CAU');
        createCardElement('card38', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrriw7wbql7FtHmgxTDkyTMqwv4FEtn6O2rQ&usqp=CAU');
        createCardElement('card39', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt-o4QKn1E1rQNPYIl4FdojucMPzzOTXZlKA&usqp=CAU');
        const optionalProtectorUrl = 'https://t0.gstatic.com/images?q=tbn:ANd9GcQsMGc1z7H18J2YOfvb7g-8ClSEigxXdiwNk_TtwPZ-FiP8PfK6';
        sessionStorage.setItem('selectedProtectorUrl',
          optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://ms.yugipedia.com//b/b6/RainbowBridge-MADU-EN-VG-artwork.png';
        sessionStorage.setItem('selectedBackgroundUrl',
          optionalBackgroundUrl);
        location.reload();
      }
        break;
      //焔聖騎士・イグナイト
      case 'infernobleIgKnight': {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUAyv7EbvEuDBwr86wlX3wT2uFVSw4T1VB7Q&usqp=CAU');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwSgUDzMziBRR6GpR5buUHnXUnbJWE54ZDXQ&usqp=CAU');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmLZL0DVzKcQZ_N4apaulm4yquvwh76LiXoA&usqp=CAU');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEXO7GZJtYo0MPk8NIBh_hO4_QIe9Gr1zwWA&usqp=CAU');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQS3nPJPO4wL8IuV3XQosNztQslfXehxI6IQ&usqp=CAU');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKf-gZEpqqJjHZSn3tRDDnK2XHtPgQOvwHDQ&usqp=CAU');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJTnQW-AgUPGa-tHVuIGS0nBquNs7qDn4E1A&usqp=CAU');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmtZANpe3ZUCoSMWFCYJ3G2aO8_GDQqyZM-w&usqp=CAU');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPNORIoEhWGBh1BuQkJaiXSANkOHhHcxYynQ&usqp=CAU');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ2ZoadwSVZ8JpICH499kZMus8KsU2g6mJkw&usqp=CAU');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROoSrr02GO36qtVam6-TAQMCjbHt3jZ3ec_A&usqp=CAU');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV3az-1TrnmJvWrEljfd-jAlPF0DmKwfjmcw&usqp=CAU');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn3cB8Jd4bGYmqm3mF22ivoA3vG8eO7nx-Vw&usqp=CAU');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHP_YyWYTLu03PnTMzZT7Sfnvs6h_NJAIOaA&usqp=CAU');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv3ZU_C3hdiYWCkNy2wlKS9CuEecMHAnE1mw&usqp=CAU');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu_Ao1_o_2GZvn8dm1qYmIu_GGkBHBGpdhlA&usqp=CAU');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv3ZU_C3hdiYWCkNy2wlKS9CuEecMHAnE1mw&usqp=CAU');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv3ZU_C3hdiYWCkNy2wlKS9CuEecMHAnE1mw&usqp=CAU');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4jyAe3ygkWcvQ-dOh7JxkHUGPbaDKjeR1dg&usqp=CAU');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2nhvVhRzidw_yQrfu-WojwW-1B6HycIjYCg&usqp=CAU');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7NzYagSBCUwqJnPPq_k-3yxlRItHU8Hn5hA&usqp=CAU');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDk9V56B_3mGQHg8PeFPIi4mI8guo9eE0UmA&usqp=CAU');
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWp4HTXXCtGOrlDWRSotc89q4df3LLI-yuQQ&usqp=CAU');
        createCardElement('card24', 'https://img04.shop-pro.jp/PA01012/728/product/174305153.jpg?cmsp_timestamp=20230422182807');
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6axGKQY4xZMaLggswEucRNdTMoDB-ewq8ww&usqp=CAU');
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR405qiyYFyAZmRb8Q_SklouE6FdIXMfYnzqg&usqp=CAU');
        createCardElement('card27', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKFM2CMWRtiKLUQf2KuoIvDLfjCAkdh92XXg&usqp=CAU');
        createCardElement('card28', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKFM2CMWRtiKLUQf2KuoIvDLfjCAkdh92XXg&usqp=CAU');
        createCardElement('card29', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQhDaaFtrQxSEAUq_aiZgatVk_BQ6PBdNSDA&usqp=CAU');
        createCardElement('card30', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQhDaaFtrQxSEAUq_aiZgatVk_BQ6PBdNSDA&usqp=CAU');
        createCardElement('card31', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGAKmHVNumCCUjFGuFZ9Vp6T4__aD2h7jJaw&usqp=CAU');
        createCardElement('card32', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl8j5ir99iFN9bEkkQogQvQWm1S_ANfNYyRQ&usqp=CAU');
        createCardElement('card33', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLe_QoU9GjFdHON-5pl4EFuXZLM1EJXWPvhg&usqp=CAU');
        createCardElement('card34', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhKbpgp8Lq2MPdVcHal3Pd3wmmLXY88NXxZQ&usqp=CAU');
        createCardElement('card35', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpli-ME4SSk0iJ0SB91ExTn1FMePh-75n16w&usqp=CAU');
        createCardElement('card36', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUCK65OU51VMXztipdMObmwQflGYBVuo-Hfw&usqp=CAU');
        createCardElement('card37', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYqBep56dY0GdiX7Tt2z6faqEIeS-gljXOHg&usqp=CAU');
        createCardElement('card38', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpDsvcKM9TpbEwCaYa63bCftWbi5JsHeNZzg&usqp=CAU');
        createCardElement('card39', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR41aPXM2-6WGXeoJqGZbk8sYd0phxljVloBQ&usqp=CAU');
        createCardElement('card40', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4GpKPy4KuVycr6-44Vo9C-4zn7JIgf1Cqvg&usqp=CAU');
        createCardElement('card41', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnKG6feGY15vCQGDCln6sBmXKW0ErW55ZctQ&usqp=CAU');
        createCardElement('card42', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAAToxZp9lCAOmA3D1CouNjhCiRBwqhINxsA&usqp=CAU');
        createCardElement('card43', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEXO7GZJtYo0MPk8NIBh_hO4_QIe9Gr1zwWA&usqp=CAU');
        createCardElement('card44', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJJPrcfGLJ-DEe74qKmmKuXY1n97N30hpWvQ&usqp=CAU');
        createCardElement('card45', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlUQEmSHK7cJVsLWleNF4p-badTmQVhyu_0Q&usqp=CAU');
        createCardElement('card46', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR405qiyYFyAZmRb8Q_SklouE6FdIXMfYnzqg&usqp=CAU');
        createCardElement('card47', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk9NWsR3-9YZT8igyCRP25BXstryHoGyeWHw&usqp=CAU');
        createCardElement('card48', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyq9ryu2ffezOzR7KaA_M-cvX6aH9PtLIIDw&usqp=CAU');
        createCardElement('card49', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVawGbubhW1Up0FLYLJzeGiGmIek2PHTDS3Q&usqp=CAU');
        createCardElement('card50', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWpK_kVdDrylPl98nwaz1KevWUo81NA_ooZQ&usqp=CAU');
        createCardElement('card51', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_4gtiBDpRCMMXLOVqdvPAgPDyGEZye3h_TQ&usqp=CAU'); //天子の指輪
        createCardElement('card52', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp_hF_8EapL8ZYYYIYX1nKfjGe9v8aAsImeg&usqp=CAU');
        createCardElement('card53', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFhdu1R9uz_28NfpsmsR4XrfnClrPFwDL2qg&usqp=CAU');
        createCardElement('card54', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy0EEKcUyXCS3dxz1XJ_uNrnlQpPNP_WEHHw&usqp=CAU');
        createCardElement('card55', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdLbisXwOomc5Gps6j1ObfQFSWNvG62-JCsA&usqp=CAU');
        createCardElement('card56', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrknW_8qDdak19QHluPnDA2nK0yMEG-DxRwA&usqp=CAU');
        createCardElement('card57', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOFmhGIEs53B5T2LVELh54bDAJhrQSCfqKVg&usqp=CAU');
        createCardElement('card58', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5RShFLUpGekhxkfUMF0zZGz2j3qxhEdD2Cg&usqp=CAU');
        createCardElement('card59', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbVIVS3mmHmuQztj4sn-1TSCbJY3IyMFGBQw&usqp=CAU');
        createCardElement('card60', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuuxgT3ip-mCd7yafORe1OS35IFQ4DffPwQA&usqp=CAU');
        createCardElement('card61', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPc5D0QAaCkEP9fvvMFcvd6ph45qSeK4a4gQ&usqp=CAU');
        createCardElement('card62', 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRm-OLRdq-I8z7TL4C2rHP8hcGN8fMaGr5lGYsJEyOand4Rw_vdAPOfBJtWNN7oL7X7J8BWwSfFSzgk8m9cZGGpw4k-E5Wm_X2i-yNqBuU&usqp=CAE');
        createCardElement('card63', 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQClQEri1MUWygAL0ErmFOvP6Z5kNL5opfgUxGRQId5mKmkF1oTNnxui8FUZ5XV2sQwa4Vu7H64Vr7CzXsvGQET8r3Lpzt-FzhdFusIvas&usqp=CAE');
        //const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdXjeG-XiJ_1TIZubcmgQQc6D0MldMzEEbIA&usqp=CAU'; //黄スリーブ
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgHzRQa_zODX9IhJs1ClrXEEtcYOuuu_3bLQ&usqp=CAU'; //赤スリーブ
        sessionStorage.setItem('selectedProtectorUrl',
          optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwGzpkDNsEhc1v_R4zbUz94a_XhpyfVJc0og&usqp=CAU'; //騎士背景
        //const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcr_na5IEbpzcIN-FyJQLXluF6fyaOzh2nWQ&usqp=CAU'; //イグナイトリロード
        //const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3ovo5u-za4s5ML-sXfzmFknpMl5tjCaXSaQ&usqp=CAU'; //炎背景
        sessionStorage.setItem('selectedBackgroundUrl',
          optionalBackgroundUrl);
        location.reload();
      }
        break;
      //スパイラル
      case 'spyral': {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkuE5L5eZWTYwe78pUJBR6VK28OREmV-sq-w&usqp=CAU');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4OPcYYD46FT49JL3S3yBeEV8vcEYrd-Po4g&usqp=CAU');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCsCVxNiXz3TNdcf-lGb6AdIaDWTdI5jmhEA&usqp=CAU');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyq5_wqX_cV7R2dnFj8-1GAVKZPaJsc9MoDg&usqp=CAU');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuD7BA1zxr79po7b_t0sxbjR6WQl_WQx_Bmg&usqp=CAU');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7fJkdEFojDYc9IJj-YpCCp5dGMjG50LB2Uw&usqp=CAU');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0h9pcSeKHVoHbTQ3LCsSGnv1ap4GDO3gMDQ&usqp=CAU');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlzNVafU36dFf-j6xKfZXQ788PHKLNS9uk9A&usqp=CAU');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAYcc4u2-R72m1EXKvTt7CgCDv2nA7MrPYfw&usqp=CAU');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp2AV3vQgNylVrUezR5yCOpMZsYAiQspZ6RA&usqp=CAU');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMijeIUQ6Tck8Y4QICYj_WGmS-gL6hyFS46A&usqp=CAU');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS40S45IfVBT5a9NkDAhimpGeU0XXdYjxUZwQ&usqp=CAU');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpqFU8jONg7tC42q-0IBtDx-jvr0RXTJQNbA&usqp=CAU');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL56sSOPqA31oUEO0ihFzuDMhLONg0UIBIDw&usqp=CAU');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd1liSP9Ik4x9XFDPLGdCjD5WpvDr9o6qMFQ&usqp=CAU');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT06rjzWzckAE9tBwBUz_Lk7wLiAWqp_6hmYA&usqp=CAU');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpqFU8jONg7tC42q-0IBtDx-jvr0RXTJQNbA&usqp=CAU');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL56sSOPqA31oUEO0ihFzuDMhLONg0UIBIDw&usqp=CAU');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4QPqncAYvtGtv7jwwD2mC7l8eNPhQrcMSTQ&usqp=CAU');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3jgxsMGgX69v4rBrVl44q-nyNfGFUELnGwQ&usqp=CAU');
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmFJIJ2gvQrUcjVCbPqcQ46fEhuUa5tSaW1Q&usqp=CAU';
        sessionStorage.setItem('selectedProtectorUrl',
          optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ265lmcrktgrrfueZOIh1w36c8omKELbZGQ&usqp=CAU';
        sessionStorage.setItem('selectedBackgroundUrl',
          optionalBackgroundUrl);
        location.reload();
      }
        break;
      //月光
      case 'lunaLight': {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4iSlfL3M8HJKJnPO6qJ_4_87nJEtiunpudA&usqp=CAU');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_5sAsdrgV7_clj5_RriW06r2je8tKDMWNxw&usqp=CAU');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqrOFhvnHTzA2FmHGFRrZ8PAgv9CMZfdnNtw&usqp=CAU');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQejXYM35WjmkC_k8eLOvC7nXlcSYWfzQUYgw&usqp=CAU');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3DVhbcuMXM-iWmzLqgba2FTqxYp84DdoTgg&usqp=CAU');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1oash8Fab6QlGPGHPTUMWg0_41X2VhA13sA&usqp=CAU');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCrE2GlNWLmWasgNEAQPhZRG1zOqquMXwkRw&usqp=CAU');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF-OuUyDt4QICHkB4Ft_Wg1qjiCLIOwBpxaA&usqp=CAU');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ03M_6yTRkqrKqwYwnMkL_3HmN69JkxXtZag&usqp=CAU');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY9-uGfgp-t6J5HWc2KvpdrlNqqNETcaQ02A&usqp=CAU');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4KTUaa7z76lRTTTjQPHgCFC8MlQhivFEauQ&usqp=CAU');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5P6_azS3ALlAqZXcVMz4wBS8Q__i8tRK7zQ&usqp=CAU');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEifbljFX7Zm_97lRM_9RVCaV-zHv8FX-aPw&usqp=CAU');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgjY9Alcw9uLuxkKr4xQL0N8aL1iuuPvY_Lg&usqp=CAU');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKHO-lGAE1y4Og7P5M40fhXuAklK6ze8mx1Q&usqp=CAU');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG38grFPpCfmvxvi08k8C4aX4PT25kYL9DCw&usqp=CAU');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSfTqLPG9SJFuimfOIHPPl2YdcCeh8vBEdZw&usqp=CAU');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSfTqLPG9SJFuimfOIHPPl2YdcCeh8vBEdZw&usqp=CAU');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSfTqLPG9SJFuimfOIHPPl2YdcCeh8vBEdZw&usqp=CAU');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR95aEZeu-yM3gRtTrZKl9qTdRz6ZjhTEr1ow&usqp=CAU');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR95aEZeu-yM3gRtTrZKl9qTdRz6ZjhTEr1ow&usqp=CAU');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR95aEZeu-yM3gRtTrZKl9qTdRz6ZjhTEr1ow&usqp=CAU');
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR-aYGLL6YDBAS5TxGGiAW5S30L5o06fvHvw&usqp=CAU');
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrAwcgv3_bYLDUVeLChFHBLDWkdjeRcIwoNQ&usqp=CAU');
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuReISh0Fv99uF6VMP0teV7DwWC8pkG8zaZQ&usqp=CAU');
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYLEfl3iMGo7Kmv65wP_IHimIqmYuNPf3h8w&usqp=CAU');
        createCardElement('card27', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSZUmRfEQzzr8MM8pZL7Jg808KcSV67Rsv_A&usqp=CAU');
        createCardElement('card28', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_IAgFAo3F8Lp1P5dSfUCyCR_rR387wNI9YQ&usqp=CAU');
        createCardElement('card29', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA_GXsFas04ZGnpJV6zSicBKcSxq8OzxoPqg&usqp=CAU');
        createCardElement('card30', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1M9PlhoCNGCF1puRKjR9LJHuOZZTGdpfGBQ&usqp=CAU');
        createCardElement('card31', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeSE_SDro9QMWWHnjSVP7DJdJJljUI9fEA3A&usqp=CAU');
        createCardElement('card32', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR-aYGLL6YDBAS5TxGGiAW5S30L5o06fvHvw&usqp=CAU');
        createCardElement('card33', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtDBIrVxTcFaORxMUMc_ZWYP4eUOJgZxNg9Q&usqp=CAU');
        createCardElement('card34', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_-9ev6urGh-Hp7rdKGCj7SzedloUl_c7ZzA&usqp=CAU');
        createCardElement('card35', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuReISh0Fv99uF6VMP0teV7DwWC8pkG8zaZQ&usqp=CAU');
        createCardElement('card36', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQItaX5BY8kqqZtd6X8yk0Hr9FavveWuyMnIA&usqp=CAU');
        createCardElement('card37', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqvRiCC-Mj4ybAF0zf-h6hetcJSUPkmUvwNw&usqp=CAU');
        createCardElement('card38', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx7MBkkgWiNCXlMVYTL2Ni_lT-j5xyTXUA7A&usqp=CAU');
        createCardElement('card39', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdsQgTRxHWbMItHJbfvL-uY_a3kogV-v5CCQ&usqp=CAU');
        createCardElement('card40', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMkyyYjZjJOU4gAxCxZlMH9w8ISUkIi3CWIg&usqp=CAU');
        createCardElement('card41', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrntknGA5KZypORHWWQsdD3hVaPr-4bP8TTw&usqp=CAU');
        createCardElement('card42', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjtr0WKTr9XK8nndtlau7XVvhEVa3S5WZ-MA&usqp=CAU');
        createCardElement('card43', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1Sai5R6BPumX_s6TWZxFkp9v7S2evkHhWIQ&usqp=CAU');
        createCardElement('card44', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTR6ba-BwUijYu3z-jYBAUnm-Gka_xbeJaIg&usqp=CAU');
        createCardElement('card45', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU_ir1DwHBNazGrVSZyRFikI5L9oBny2GQCA&usqp=CAU');
        createCardElement('card46', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdR--uBeGrLMIq3BFYRhRnc8s5CA5SEvXQNQ&usqp=CAU');
        createCardElement('card47', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDi8s9fdagYo8adT91URu7qm35t4NkHtNx3A&usqp=CAU');
        createCardElement('card48', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpa_Js8jdV8aIHWyuilwpXpvFGne8kd-HNPA&usqp=CAU');
        createCardElement('card49', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpa_Js8jdV8aIHWyuilwpXpvFGne8kd-HNPA&usqp=CAU');
        createCardElement('card50', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1jZOWeRsCyzqruMjuyELi2wwKnjNJmu9g6w&usqp=CAU');
        createCardElement('card51', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgI_J5tnZfhiK0fY1KBi2Huf3j8YgjCzvpBw&usqp=CAU');
        createCardElement('card52', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJo4S1twk1C7O6bl2JWOEtCt33ErLise6pNg&usqp=CAU');
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAfLYAT-XU3vb8GKwf3nNRNm_AbwIlwZ1ymA&usqp=CAU';
        sessionStorage.setItem('selectedProtectorUrl',
          optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi2pXLoS2guM3gYAkN1lav7G320wcZdkierg&usqp=CAU';
        sessionStorage.setItem('selectedBackgroundUrl',
          optionalBackgroundUrl);
        location.reload();
      }
        break;
      //六武衆
      case 'sixSamurai': {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRldUAO6y86OytXzSPlmOofP7RaC8ncn42t_Q&usqp=CAU');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrXnGBmCxZC4RUI5Q5xsYEi2Rw1Ikbo5q60g&usqp=CAU');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU-H_X3FDQQ9yy_5zpCVqsNREiTUYazY9qJg&usqp=CAU');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg5UO4mMrUEfVG7bWU-64vV3yEXhnQl4AjEw&usqp=CAU');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCDqfzeFY3hSrASxvz8lbbNY48s8JLyv_2Kw&usqp=CAU');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT738xDah_2AGqaD4xhbF7cUXdCvk29MONEMA&usqp=CAU');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3aPwzPsr-COoLW5Uqj9uJcKEGX11BAjvs2A&usqp=CAU');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgxA8m2Eo74mPub3ipcoeimm0fL3L8RxIPpg&usqp=CAU');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm7FrJBe2ulMYNMKcMDj0XEfxihXUdHLEa9Q&usqp=CAU');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm7FrJBe2ulMYNMKcMDj0XEfxihXUdHLEa9Q&usqp=CAU');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm7FrJBe2ulMYNMKcMDj0XEfxihXUdHLEa9Q&usqp=CAU');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLhtvqjIiVS2mE_aW3sU042fFhFd8ISxwt1w&usqp=CAU');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSebRQZ5yNWj79mkZV6KwKzU1E91qeBWvXLYw&usqp=CAU');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVwZ_v9W0l-Td7j8K8dwxiPEl6Ft1xfojdpA&usqp=CAU');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWNTtZsDWibz6i7w4TP_4mIOterebrxom9NA&usqp=CAU');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWNTtZsDWibz6i7w4TP_4mIOterebrxom9NA&usqp=CAU');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgxA8m2Eo74mPub3ipcoeimm0fL3L8RxIPpg&usqp=CAU');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK2sBSwQ3oL_X08t8q4KFHBdbydmV_s81VZQ&usqp=CAU');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1ZgAxkjwNI7kHD2z1_8sY46wZDe-bJFbFAw&usqp=CAU');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSugvlWcVPPZrJA4hVBSkyqCAtDFB9wkQyJ-g&usqp=CAU');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzryUmVjpfhkyKUBdeUGk599mnlIyCwPug0A&usqp=CAU');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEjGkbCDdCKORe07hjs_MLoJwf6BSkUM2wVA&usqp=CAU');
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCiTpdf1XOhlTAsZMvljXiWZUerkO8rJQvOA&usqp=CAU');
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrkLfRbFJQiIuVbOPMg81Ak3m8yG5zHZsGSQ&usqp=CAU');
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTQR2ki5238S-htTuCn-WaoPNHCImdgMHyrw&usqp=CAU';
        sessionStorage.setItem('selectedProtectorUrl',
          optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI-SrSvNGNCuA_4vsscBd_Uvg0NnwATqqleQ&usqp=CAU';
        sessionStorage.setItem('selectedBackgroundUrl',
          optionalBackgroundUrl);
        location.reload();
      }
        break;
      //ふわんだりぃず
      case 'Floowandereeze': {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR41F5q53Qw45OjKHMQJh8mm8FhlXfAZMpNg&usqp=CAU');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5kARfkO-DXYxaDF26veX7uBPHvIPyKjZdFQ&usqp=CAU');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWdpeVa7R-cgBSDTjJYrdoLEWI1ATPJ-H6DA&usqp=CAU');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFkDAGIH5VPa-jbE8HrJjg0QjEnqX7WVEIWQ&usqp=CAU');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkVo6pTaa3R6Dk7s3Rxikyv-w8pJgKNHrgjw&usqp=CAU');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNKd7hYe8TvQsM7FKYN4iIs7cZoBK3Ub_KEw&usqp=CAU');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTgjvAFY9dtfefCIqVa6i3ui2hb9KT9GXr3A&usqp=CAU');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmMu3THpYEr89zusCOboKnB--GEVXRRQaF6g&usqp=CAU');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmU32ZMdx1RoCAvRmA4jIaejxSfUCyu_qSxw&usqp=CAU');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS19XtJz3gh0UWvfZ-4TiS4TKU20gB3Tvth1g&usqp=CAU');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcdO9XNds071uMg9rSb4l-RbPLQrWVSAuRvA&usqp=CAU');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHLH39x2rasl3P83khxO0bMzZaUfFky05wrQ&usqp=CAU');
        const optionalProtectorUrl = 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTruJlnQ0-e-QRW0FeaNWgpGnJC_nE0DD89vm_qnmYEWK9xg5Um&usqp=CAc';
        sessionStorage.setItem('selectedProtectorUrl',
          optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://pbs.twimg.com/media/FOeCzcRVkAYXX4Z.jpg';
        sessionStorage.setItem('selectedBackgroundUrl',
          optionalBackgroundUrl);
        location.reload();
      }
        break;
      //魔界劇団
      case 'abyssActor': {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjZbrG8OIF1pc6H9DhYPpjrVGJrLrtP5BCwA&usqp=CAU');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGzYKZr7gJ2ioVbUThJ_h_Xm2y7MK5pP5sUw&usqp=CAU');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq1EsSV6ZgrzwzHg1eu1OWF8q5INpfV_6vaw&usqp=CAU');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqWGRBoaORCtcit_QTElBAqQIzQOOigoc02A&usqp=CAU');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNnCrNVhK2zlT0Q9pD5TT2ULwPMPfqWO0nWw&usqp=CAU');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxtkC9qlMCvFYFfBVM5lT2T4loHiZHcgGDzA&usqp=CAU');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLsr7GCY_hRNRMbAa0qVONv1XNaZRSKlQQ8Q&usqp=CAU');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ417E7hcnNBY2Po1CrxwGpVQhxew06TieGdg&usqp=CAU');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh1__1vz971Z44gwJQK6Oc9hlDu4FNXV0J6w&usqp=CAU');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5OoUREo5cIbvNOiKfieOxsH3e6ESTZPw5JQ&usqp=CAU');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgKLAd9csjoqTqvN8EnvhflOD531Sd-Bq4VQ&usqp=CAU');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDLEe_YFcgmtETdng3G26-qa73f4FXp0lb_Q&usqp=CAU');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReQhZGaZo2TGNoMxREDMmmrb3YR44hgEb5qg&usqp=CAU');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKLEKWfRH9GXp-VpoLAyN0ZPo2igz7N2IFlA&usqp=CAU');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxqnqYPRxr2szOcBI1KFlAgX6JimvDfPUa_g&usqp=CAU');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVqUd087-HCYGYz9ROChvJVW_YaEjvZT4jNA&usqp=CAU');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRGq_7SBpDGT_wsMuEABsdI72WBf7JAr0u4w&usqp=CAU');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWC3lzrzlWasI0WBgU2vPeoiNVt-VyahqS_g&usqp=CAU');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYHV3f_Zj4x6g7ZvO8JnhznXweGw1gzbh3Bg&usqp=CAU');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjnuquSG5qIuMGuIt3Nq_68hU0J6BDPqujCQ&usqp=CAU');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHfRaarsMmVUm8-b2LHvJrp_TeZoyHSmTC3A&usqp=CAU');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAKaIrh716BDE-PlvlxqN8nKG4ZHHpzfQqBA&usqp=CAU');
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtVsaXSqYAtPbGUF0eGyGk6iplJxUYjFPktg&usqp=CAU');
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA8YLzex51-rtUFPMPXfHPtNi1nnzMcMW8vw&usqp=CAU');
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4MMYYHhA4yI57O8b_0xwAEeoB3s8KvI4AqQ&usqp=CAU');
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4M1H26Jsvyc9WEt0ALPzFeXeQNEyuhYNbyQ&usqp=CAU');
        createCardElement('card27', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiN0SDmQ_FbleRsEmArXedEGqbuiCt81uBJQ&usqp=CAU');
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0U4ZxzGvPCTmJHxzBL0zenmhJBMJwgzMviw&usqp=CAU';
        sessionStorage.setItem('selectedProtectorUrl',
          optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVgJwLghTXcQrmcOWEb6maoIvZcsF7aQJQTQ&usqp=CAU';
        sessionStorage.setItem('selectedBackgroundUrl',
          optionalBackgroundUrl);
        location.reload();
      }
        break;
      //ジャックナイツ
      case 'mekkKnight': {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFcwlMeC6orwlTEQoRiEDqsmOtHXrxe8KvVw&usqp=CAU');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT468e2FwcFesr2nDWZtXqNYd5S23VfdCAv7A&usqp=CAU');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3wUzlaVHR3re2oYmJp9gKEboUpiGo2zx0wA&usqp=CAU');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_K-3GzlhGtQ96wlnUNt7HnwMtQqkfHLgckA&usqp=CAU');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmi3k_EotzQl9a2xDMGMYvpNStEU7B1utmbA&usqp=CAU');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlG7VQPDJ9-ORK6uNXAAMrkgik4Li74VpCwg&usqp=CAU');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHHbuaLhy3cMoMzrxtLAqiSjtVQJ0XKzGiSw&usqp=CAU');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToX9LZKoacPChjKBLFbxp-UdYlzvJroblTLQ&usqp=CAU');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZBAUauaoN-bjD8ZYBR7TRxg5ivJEKdHj-8g&usqp=CAU');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGyVniegqRIRvuXyCvVNm-PG4S7y5eJ4RZvg&usqp=CAU');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzIkHUdhDvEIhcjCTgFFtujhGwZTdlkXWQPQ&usqp=CAU');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzIkHUdhDvEIhcjCTgFFtujhGwZTdlkXWQPQ&usqp=CAU');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA_v24Mglw1s2QP3KLbzuWBumtFUlVdutOiw&usqp=CAU');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm-jyX20MAkyn7wDxFEGAvF9QlIMAsDj5k4g&usqp=CAU');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQilFD9I3c7ViMj3tNMEpq6pZ9lYGd3XRCg1w&usqp=CAU');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQo_ksKJDXHlwTik4Ua4OvWjI9EUlnIqh5VNw&usqp=CAU');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0VpoKyvz7pD-VLqWCCKoorF50jm7NMyYcvw&usqp=CAU');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZM2yTRff5USRRcb113Uu8H2lXpaFw0O1XkQ&usqp=CAU');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt01npp-EIegxgtpyBSEFnu77W0cRY-c0d9Q&usqp=CAU');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ2DJ7BeSRymIViIGSL833yzwdpfkQzbaawg&usqp=CAU');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ2DJ7BeSRymIViIGSL833yzwdpfkQzbaawg&usqp=CAU');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSog8JIYLfrUB-pfsJuPrk-ENvgF01VyYLF5Q&usqp=CAU');
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3BLkpcB6fh6CtHZtIlgzo34sHHLsDM4zTew&usqp=CAU');
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVddN5LCz-aSqOp0FzFZrG6DVhL970He7rVQ&usqp=CAU');
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqH--iDdAkzw3EphvEM_cH9lrso7bErm2VbQ&usqp=CAU');
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ-Vamo4Mo7zmoHkAoC36mX1DS12IihqwXnQ&usqp=CAU');
        createCardElement('card27', 'https://img07.shop-pro.jp/PA01339/386/product/147980144.jpg?cmsp_timestamp=20200216063626');
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL2Scrj3-JFWB8QIMH_xdmMTbzAsS29e4uRA&usqp=CAU';
        sessionStorage.setItem('selectedProtectorUrl',
          optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhBqFTdE3uAv-ACpLeVZccvmz5vxL3g5y9lg&usqp=CAU';
        sessionStorage.setItem('selectedBackgroundUrl',
          optionalBackgroundUrl);
        location.reload();
      }
        break;
      //マリンセス
      case 'Marincess': {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRin79-Tgn9uoI7hOqWoemQ6h_f3Vh5T7sgVw&usqp=CAU');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5sL0yEyrdBDG1yHIs3rjYJ-iETDyIRAt-Qg&usqp=CAU');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAjAIEwKvt_HHV9eE0ZTJErl1El0UELPilBw&usqp=CAU');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw-kHJnh-5PclheALddc9ic1RRCkakpqmGgA&usqp=CAU');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTM-E5OyQ_J5aWVkBKLytr3b8Ax1weuKyKbg&usqp=CAU');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQvY8mGn8ogqtY9KiRALfRAo5IlpK1M118ig&usqp=CAU');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPxAXu4X0GwUwLHYtyhP-M5BuB1O7N2_Mw1g&usqp=CAU');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTv2hZT2J3hB0PBrB5vTWD6IvnRlSZlXbjgw&usqp=CAU');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStGz1iawh5SYXgw1u8QY7jLZ2QB4V8gl10MQ&usqp=CAU');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuiAMBv9TcCahoFUgQwqM20N8sy_FZ8MrXNw&usqp=CAU');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCBL0Mzkc4wkCHtIjPeDZ4SsLYyStH82kl9Q&usqp=CAU');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3REVgabDKUFQw3_J8CoH-rkLfTWyjrHcy4w&usqp=CAU');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUsMPtO1_HXebQ3UNfpdF_4KZnQfSq90MXgw&usqp=CAU');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFEVs23tTUkK_NJCJ67kp7jxX5b8Ebnambcw&usqp=CAU');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMkTYwjK7kFRhTc67b_pg6voY-T8OR6ChQOA&usqp=CAU');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUcNC2ZVLSWMiGNxUCX6A84MHFCpyJraJ9MQ&usqp=CAU');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8SPhrkbEZqQHQwhAuZxjqbsaVt4vVv0ZZ3g&usqp=CAU');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDs0x_ildPtH__1fhIuacvrJLuJwjXjHTSjA&usqp=CAU');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlgY700_7YcgKpIKBGK48TwbxTVDCyfWmhOA&usqp=CAU');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7UkLorGs1qkGr5_5Ads9PR-4ICg0mRLLxAQ&usqp=CAU');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAOWKgPJ3JOxgelTWOqH7NiLz0MtA7NT-RUA&usqp=CAU');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDc8LoWK1VSFOuXCXH6Go-eqCuIL4ivs8MIw&usqp=CAU');
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLKcgPU1hNus5si3RxfUUtJ13XIJy3iuBsvw&usqp=CAU');
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6oAqAPjvJDsNPjb8fevQqKLvjnfjOBRI3gg&usqp=CAU');
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEsBqwlRDiqSNVB7JpR61oTDWvKdgBt4ewlw&usqp=CAU');
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd-owG1WpdYkU_8lILoTYiYgj-fEIgSzXTsA&usqp=CAU');
        createCardElement('card27', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTljzpia5V4sG7fWNlSNFAj3PXBDo7g2vwWhA&usqp=CAU');
        createCardElement('card28', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT43FNC4KHb0IeS-8QsA6kSJeDXV0SdUnLNDA&usqp=CAU');
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQBspoRMh-9tJ7PgXJ7V-8Nh5Xjm35kiZ2-w&usqp=CAU';
        sessionStorage.setItem('selectedProtectorUrl',
          optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://ms.yugipedia.com//d/d9/MarincessDive-MADU-EN-VG-artwork.png';
        sessionStorage.setItem('selectedBackgroundUrl',
          optionalBackgroundUrl);
        location.reload();
      }
        break;
      //ヴァレット
      case 'rokket': {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyVvL4v3zkPIYfdHT13xR2BO2-ZOdPhS9O5g&usqp=CAU');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLlXUL8fjUP1Z1CWYe73faO1q5v0jFt5m3zw&usqp=CAU');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAKBttNU9t3oTIDqBAjcPYT56NxkTGJg9Ydg&usqp=CAU');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9UgTBGKVdL4olflAyzGSOuJCEzAQ-oRwpKQ&usqp=CAU');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIShNEv_DLrwFUA4OuOegwOnwk64L6fX2QqQ&usqp=CAU');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbC4eqSNIsPT7uh3YpGJMTtgmamTBsg0g-6Q&usqp=CAU');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJyD2S2_3SsMI13k6DYM5p9Omr3sMqZL1d7w&usqp=CAU');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH5hjG9k62PYM1ipvbTBjFsFJMqnh0NxQbvw&usqp=CAU');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQaWs5VQ04SjwGsSwQHS6o1VuBcI_e7UPE8g&usqp=CAU');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiTF14cDktKNiLrkBnardlo6MbpVNHQJeowA&usqp=CAU');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSiQ5A0rnm08MpIR5OxXMKWeil5_9V93JjSg&usqp=CAU');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0_36ee9IjSruk6rUcRJGKYrO0xv-Jp9IEJg&usqp=CAU');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXnLFvlAx_rPfkWdHAQuD7c-e8eGEqIEpdWA&usqp=CAU');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu1bUBVrePmGIIwBXDVS6Msh58hooyvrK8WQ&usqp=CAU');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQTT593vSL4up6NgkCzUjtKOUw6dy3J-ysKg&usqp=CAU');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu-gt2dL5Q7rGTqeJAmXfgFBHpWpB8BYbCow&usqp=CAU');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3WYf5MQGBVBb6TQnsw-KE-fCCiJZPQDDXew&usqp=CAU');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWnMV9hjI5_mMaLbOsUTa5MozmPixf-j8eTg&usqp=CAU');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDMpmJbkNr4ydLMLZulEP_dVyYZQC32wAbMQ&usqp=CAU');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6oVKAj_f2pK7sHtGpW7A_9tf9c6wMnX77xA&usqp=CAU');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4O6RKYzaT4A9qeOZssrqX9-_SGO_iH11cTw&usqp=CAU');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJNQU5o5AC2ve_Asum0ptoalNwYFOMifJLzw&usqp=CAU');
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRHkHOSxmV4BKZL4EjKWR6DQmCHIGxCvHTuA&usqp=CAU');
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ53GD2uEqy_GSofCbeY9_26CaSiYSHc7A2w&usqp=CAU');
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVTkAk633H51wY6mglSpxHgG0w4XJAZflXjw&usqp=CAU');
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxasivhx7dH08PW49SiwZs3OsyvQ-WdEg7fg&usqp=CAU');
        createCardElement('card27', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj5TNZZsTmOtpczZOdyWmYpDnw-0GCUB4JRQ&usqp=CAU');
        createCardElement('card28', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_9Kb3V43jjGcIbuG76D9yi64NQ38xRqP9Zw&usqp=CAU');
        createCardElement('card29', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStpgSB3ZA09BbKx-n_oe9YYBwJeWg1-doCjQ&usqp=CAU');
        createCardElement('card30', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPKi_s1jBFm0PNa5csyHAKjMQOH4xy80jXRQ&usqp=CAU');
        createCardElement('card31', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6AIyvZXpEaEQx2ANvS-XxZMcKOpAU49Rt6g&usqp=CAU');
        createCardElement('card32', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR65ZKxm84dESeH_OBhHemok44MwjasFaSjw&usqp=CAU');
        createCardElement('card33', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSseyOZ4dNAbUSF03LbEU87rhTgWTeGC-Q-NA&usqp=CAU');
        createCardElement('card34', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH7y-5-Lma1kPHX-1O8jrkpVcSNRYIPR9OJg&usqp=CAU');
        createCardElement('card35', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9Sux6jEAxm2TL5MR_jxjTaxqX7UKvkTSwgA&usqp=CAU');
        createCardElement('card36', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQILAcdU7sgOzu_Jo0jQVHR3Pu1t2LPvrc18A&usqp=CAU');
        createCardElement('card37', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXa2XeID634NASHtUVy7TGMlfLo99uF5xm-Q&usqp=CAU');
        createCardElement('card38', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiRchCOQhMwkejiNl1MhAJ-e6MJX1NKG4S9w&usqp=CAU');
        createCardElement('card39', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStvPCKZGv4bZGiMn4FzYXn9G6OmJwOqV2rWw&usqp=CAU');
        createCardElement('card40', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyX2kC8rnTmvbnEk6fxjdYmiuvG3VbZ3igCg&usqp=CAU');
        createCardElement('card41', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ3AZFGba6fnIOWkvhQGAdAqR7uF6EpN4z0g&usqp=CAU');
        createCardElement('card42', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm1PXxI2J3E0xT17K_fOpCAcUbZ-rVpU_ehg&usqp=CAU');
        createCardElement('card43', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlCTRp_VCAmPa4TlZgYCLc2wQdFJ6yB6PHQ&usqp=CAU');
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsPCJTQu6F-3nkNz8ik_9wXNcrcsPKtDq38Q&usqp=CAU';
        sessionStorage.setItem('selectedProtectorUrl',
          optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDfb2n0AmzLnLFcXeHfrhL1Nt1qB6WytoLXA&usqp=CAU';
        sessionStorage.setItem('selectedBackgroundUrl',
          optionalBackgroundUrl);
        location.reload();
      }
        break;
      //魔術師
      case 'magician': {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW3weSS64iqEqeD85MLESJYDhd1d8BMSTwzA&usqp=CAU');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXkWoJwMtIKrKO7K2jbL2RNCXwVJp0Un809w&usqp=CAU');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShLHE_B4eZfu_VkdkPRTY_RRemVcTefCVXdw&usqp=CAU');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsWdKcFcaTr5ltANa_5En83UrG6OLO4ufsyw&usqp=CAU');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHUymFcAiI9-uqHmYwppSW-p_-mLW2SaAxpQ&usqp=CAU');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_cP8VYwKOvj6jPHd5uuMZZrHY2JgoNtEyKw&usqp=CAU');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfmKL9b-_MDE6WMwzajExGXeeWVLpREEGetw&usqp=CAU');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT4ns9btJ7M-v7jh5hSD0IC0oXCpFKhpqE6Q&usqp=CAU');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX8p6BxrOSEr2gupWLYcTPIy2zTMv1LzX_3Q&usqp=CAU');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTFmZXDQloArFiO5A6Fy3h1RpMW-c4UaxkUQ&usqp=CAU');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmL2DfrMa-lmxiQtodY8sIInh8HP33_h4F3Q&usqp=CAU');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyWoCS33u8cIZvcYXfrzHz8Jh161gKHfYFsQ&usqp=CAU');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAa20Sqz0qN8OJ3EjKBm3jnX4U9pkTCVuSoQ&usqp=CAU');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKPpAeQZyTO2lX1vRjlI3rEk546Dd8fsB89A&usqp=CAU');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-bQQSvaZ5AR3QBGqg-u9QvxA75j8qRl4vwg&usqp=CAU');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOFmhGIEs53B5T2LVELh54bDAJhrQSCfqKVg&usqp=CAU');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzc4at9WpqBR-ydvJS8_fZ9vz0Rff0JGwHuA&usqp=CAU');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZPjm8NgYycmRudEWniCHNda64Y2p3EfMR-g&usqp=CAU');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTcJd3O2L0IRG2JT6X07zUvO9_a7wSmT7IGA&usqp=CAU');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV--Lr-SkayvMkC2ZQeNPeSHgRkU9Mbwe5zw&usqp=CAU');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJCaVXABjoLf9muT_F2r7RAQGVMoxuAsjVNw&usqp=CAU');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFH4RIbdAEyU96ebRtdXdB4uIWMyVXGs9qrA&usqp=CAU');
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkHhQsC83TkPsDHNH8lSjIb2daL-rIzJcoSQ&usqp=CAU');
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKTEuOGHjNycGoCfS1Iq_d2slIG4wi96yXcQ&usqp=CAU');
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEJ9fptPLhLWYoAVlp5JNbK0eNO2wacapFVw&usqp=CAU');
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHgIjUaxHscaL3o-EwJJoCKt9ec4ZqNar7Yw&usqp=CAU');
        createCardElement('card27', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSe-UT-YEhdMwkIIdkMa7Tmhyln2APjMqD7A&usqp=CAU');
        createCardElement('card28', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLatGeXhSczp228Qkn1C7kcQWnvsg1Y3q06g&usqp=CAU');
        createCardElement('card29', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDQcO3EbKduHjBLC0ERNM8Abld2EfQK8b6-w&usqp=CAU');
        createCardElement('card30', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi2xvbGK0LQ4SS9llc_BEanbrA39YzppcBbg&usqp=CAU');
        createCardElement('card31', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2DQPOMC75d6mHolGjNi_SYWP1E1cJhWb5TQ&usqp=CAU');
        createCardElement('card32', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxCpKg9FPTFKY0rI4BX4LpWSziC1S3qezCUQ&usqp=CAU');
        createCardElement('card33', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtJqOt59yZyw_UghqKstP5lUFNNVcnGExptQ&usqp=CAU');
        createCardElement('card34', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaT_NA2iGo4gxtp7YmELy3Rdlx2vBkHxMa2A&usqp=CAU');
        createCardElement('card35', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzTI8bccQ5QJ7u8kBzvmHhUSjlpAnEqQxBog&usqp=CAU');
        createCardElement('card36', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhCxUIl0o4ojXRe5hVu2zqfjn4ZvdbciSlQw&usqp=CAU');
        createCardElement('card37', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4QM1dj9DZ4G3zFJZ83vkKDHizWfys1ZFOIA&usqp=CAU');
        createCardElement('card38', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW6ikRD5_thNMtil82riiM6JqNbASNi7NEWNtVIjfpDel0ouY6v58GMZ0&s=10');
        createCardElement('card39', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNbsfYLHp9XfTIz6ZW7Q4S7EqDtAOh72D0FCYiNJVumFLdoXbquXnu7fc&s=10');
        createCardElement('card40', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWW6asnQNleKTBxxGWYM_oZN4_0Fp10SJQkg&usqp=CAU');
        createCardElement('card41', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCr8WnVFhkepdyn7QZ4-_Fge0wHIrKjfT2ng&usqp=CAU');
        createCardElement('card42', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuW8QoqYzgXh_ZcPXKE1D3bTLBEV-W3VlsCA&usqp=CAU');
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXKsq-_fYqKJoxkJBYLhDcpEwp-Bmj-cBPKw&usqp=CAU';
        sessionStorage.setItem('selectedProtectorUrl',
          optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTSQjzHYf2QcEbTz4upRywI9Iasy15FBLMjIEGRkv4cym5g3jd1';
        sessionStorage.setItem('selectedBackgroundUrl',
          optionalBackgroundUrl);
        location.reload();
      }
        break;
      //転生炎獣
      case 'Salamangreat': {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1SEYqBnc_IQJ2LxBVdFuLAn7SvJHak_BnIg&usqp=CAU');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfz5fxeBkK_GDOrN0XxNbfvqbNvEzoVYylzw&usqp=CAU');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFH7m8tsasB05nCENhJSxRDJ1Yf-6a4BiW9A&usqp=CAU');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8WywFHT2rT2AKj1hQLwsT-iGDwXXqgieMMg&usqp=CAU');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_Orekh0MZx-vOaM-sRs34fQ9GQokBLKtAGg&usqp=CAU');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoSQ8qFbgEeQPgRpuTOD7esld8ChRckTpdpQ&usqp=CAU');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQlxGgAFhQ6VkMbvlml92-I9ghZaEtRcfhTA&usqp=CAU');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbj9jn2bH6C8-0i3ITOLR7X7kQ5-Id02GYtQ&usqp=CAU');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8CCt8qI5Dx3113K8Ts6g0tvIMeCsJqnpzdQ&usqp=CAU');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvjVdrDHQwWL7DbbDZGF7RRLpMmPQy2pzhqA&usqp=CAU');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpSQD2734cnxJcJ3xUMBuGYz9uE4ZHoCdkoA&usqp=CAU');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXdeQ6H-gCmXUhsGHFvsEcq6lHEUc0PTa9hw&usqp=CAU');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8plEzBK-vZ8bMutUPxhyXkqPe3h-kDskRWw&usqp=CAU');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqJ6sK70qksumGniYr6Rg4Ptxc3dXpTlV-0Q&usqp=CAU');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtPiOxiR0th1vR0XdnHJ8UWtAaOlhtXxfnlw&usqp=CAU');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBWZ8x1MhMXw45wO4H69HyM89Xeld1-BjB2A&usqp=CAU');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe6YgEpl8BYqWnAqSjQoYnAGHwKeHwK90Bsw&usqp=CAU');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ73bN-M-EJ-wIMY9QZCl6hVspwF9w_cnfLzw&usqp=CAU');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQafSgsC5JlbS5nOH8Q2my89ATqjhh87-AUUQ&usqp=CAU');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6noR7edpne7q0fZ8Y_6wvkKYIZEoToOrxHg&usqp=CAU');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_NWJlmte5pnEHJNhRaHsu7bOjV9axKdFwbQ&usqp=CAU');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb2uzkknaCX-xRDHCLGelu4xp1XqMEpPbRvQ&usqp=CAU');
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkvtQqMhiLQt7Rr3KgkpCmsLAbV4k36ktcxQ&usqp=CAU');
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpFlx6B2GlJnBfRcOKkszB4xiO0vlOR9lZ8A&usqp=CAU');
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQY_2u-0oZtKIrdwnTfTP8mDRrMGXVOJGSSA&usqp=CAU');
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnklJ5PUvoetwX992CGtNfDfbfSGsgAxnVtQ&usqp=CAU');
        createCardElement('card27', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKRHhyKdrDu6fRp0HCedfyR_4ogXSpM8coPg&usqp=CAU');
        createCardElement('card28', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoSQ8qFbgEeQPgRpuTOD7esld8ChRckTpdpQ&usqp=CAU');
        createCardElement('card29', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST4JcRCzyFf1-M5eOr-p3VxhTzSxfGFM3oxw&usqp=CAU');
        createCardElement('card30', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6YEzONukU7ahufQPNLqUkL2TyEwJ7cbvsfw&usqp=CAU');
        createCardElement('card31', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSETF1QSiVuXXtwKrPp8sAKFatmX7FoB7ss-g&usqp=CAU');
        createCardElement('card32', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvucenWLa8lxKDS08Fy1FKPKX1GTkYtgVqwQ&usqp=CAU');
        createCardElement('card33', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_LJs0iXgsXpQxOQQ_os1icl5exww9C7X0-g&usqp=CAU');
        createCardElement('card34', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSG4ty95hIBgotrHqrCtiQT7bvLRE-LX_gug&usqp=CAU');
        createCardElement('card35', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYF-28afXKiwjFoCROUhecIsXnLNsimf8nOw&usqp=CAU');
        createCardElement('card36', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS492eKbecq-3NrzYhuD9ZA6Utwu9pvbGj9GQ&usqp=CAU');
        createCardElement('card37', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmk_F2xMu5tPFKy_DAna4XEZfaKcijaTiUoQ&usqp=CAU');
        createCardElement('card38', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs-Vtf_L5_1-KThYbldc6J_RLUVCvwoe9a2w&usqp=CAU');
        createCardElement('card39', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmzVIWvWmpnm-TYw271PsKLwUjN1Rq_pYDhg&usqp=CAU');
        createCardElement('card40', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf1rZ_wGCqk8DVxmVC_KEwGigZmdCDzd1L1w&usqp=CAU');
        createCardElement('card41', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF7FofLPkRlyaVZwnNPO-Tnk8cvUFOh7m0EQ&usqp=CAU');
        createCardElement('card42', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_Qwyl6cf86ItPf_CLsof0vX-TnogzmO_t4Q&usqp=CAU');
        createCardElement('card43', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH3ltuXfA-CP8ow8jaytJlXsI4tqV7HlQqSg&usqp=CAU');
        createCardElement('card44', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmnw9H1LGe2DdW6K2DQaLUuS0zNQOxK4xZUA&usqp=CAU');
        createCardElement('card45', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs-Vtf_L5_1-KThYbldc6J_RLUVCvwoe9a2w&usqp=CAU');
        createCardElement('card46', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRcpwqcsJ1TWNBxRkrCXCt_ndnHuolQ4F1xA&usqp=CAU');
        createCardElement('card47', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPBBzr_NsD6wD12fRGEr5hKHd3RUyP5Z1tGg&usqp=CAU');
        createCardElement('card48', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMUh1WRFba2WSDXPa3F57Qt53BPHCGG03TDg&usqp=CAU');
        createCardElement('card49', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwB-veL7vbPiowIEvdWVE6I-MJ0V3l8608HA&usqp=CAU');
        const optionalProtectorUrl = 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcStPa6-0jJrawX4vxVhKdVBGsujeHmoF2lze_qZGYIdfQEcIqlgFabTy0JhHszckQWGJ-yAaNyLcEyAJ2J0QFym5j0ssqmcS87yT1Aj2oqS&usqp=CAE'; 
        sessionStorage.setItem('selectedProtectorUrl',
          optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4vITrDZ6gwyPpgachBMmyEGX-mi_478PrMA&usqp=CAU';
        sessionStorage.setItem('selectedBackgroundUrl',
          optionalBackgroundUrl);
        location.reload();
      }
        break;
      //ドレミコード      
      case 'Solfachord': {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKzLZSkF1HXYNEGEk-eYh8Z969T45cpp59uw&usqp=CAU');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMv6tcX0rObQaXbLF34Mr1NaoVjlnll_fcBg&usqp=CAU');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZkT4nU2MaM6_MpnTY9GB-5NUWEQ7oLktJtQ&usqp=CAU');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5-ynNdbjxFz12Hwfd1Nr42IG2BPAQsodbGA&usqp=CAU');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVlGW1JhKX9D0xRwoB12BFIJF63nGlBDvVLg&usqp=CAU');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5HVFLmtmnsPAKAudDgi788OSIk2nJPQfXbg&usqp=CAU');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxj_gcASPFd4TRHbabIcbudybNTtdihxCSOA&usqp=CAU');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWxBAtHwaCKsgyVRA0f3Iw-wtVID5pGr3xRQ&usqp=CAU');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToBTWQIc5-35jJXEInYS6Uf1vnkciDGaRaFw&usqp=CAU');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTB3jFCMFAuBb4ncNZ_u7g4EdOlg69y1kqrw&usqp=CAU');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIWBL7btPCnYDuwqy29G9S3w0H7hLfBjg6Dw&usqp=CAU');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-_4eqa3cvKNxFNoTsM6gqwmtNGGH8B5HjwA&usqp=CAU');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiQYD-NXTvnu83OICBnxcfxAer9nfhxsRnDw&usqp=CAU');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlXJ5q7cPJsKlAMwu2myieqkm4AiCZ1yqrqQ&usqp=CAU');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlFO2LYXnY9JzMqyfEZAb7SXOevVnbCz9vng&usqp=CAU');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjYxkfURBKkgdGTnVXcLw3NvbB4mKnssj0YA&usqp=CAU');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGcaIvKwwhjXaM5xHHRrVC2yuj6V2E0s1n6A&usqp=CAU');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzx-0m5gddpSUZm3-A6p_lm8npesIBkseO9g&usqp=CAU');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuabdUQGrHzSPG4vHK33Ga9ON97imOpr50zw&usqp=CAU');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWuWVA3SmiFjsMsVXtaiHyjdHLXQwHo1PkEw&usqp=CAU');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbV-FsOiTmUmGysY4Y4kJZRKkm4X22Tt5IEg&usqp=CAU');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSULWcqM2rSav2QvZcUFcltxQxegzsTyCg8Rw&usqp=CAU');
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS24nhGnEuztkBzfdNZrRnDWJUVuJJXvW9Oqw&usqp=CAU');
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcayhBvLQq61IWmCL1f_2W_BO0PLJGv1j5pw&usqp=CAU');
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3-VTBJlgeYdVWyw95IBYaeinpaBQfPTDIxA&usqp=CAU');
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv8XPkbmTub55t-H8_0r82UFEIH9SJ1jXp3w&usqp=CAU');
        createCardElement('card27', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXkWoJwMtIKrKO7K2jbL2RNCXwVJp0Un809w&usqp=CAU');
        createCardElement('card28', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAyhkUeJMQ4TMZHbcQrqtW1qYn1LNH6s2AGw&usqp=CAU');
        createCardElement('card29', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZSyT-LZ4-jLpANJ-abnv0DuTLmhIDwaUAHw&usqp=CAU');
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiwmFIV6puSuDVdlNEW95p-7U91rxK78Z63w&usqp=CAUNyLcEyAJ2J0QFym5j0ssqmcS87yT1Aj2oqS&usqp=CAE'; 
        sessionStorage.setItem('selectedProtectorUrl',
          optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://pbs.twimg.com/media/F3VbnQyaAAAO2T9?format=jpg&name=medium';
        sessionStorage.setItem('selectedBackgroundUrl',
          optionalBackgroundUrl);
        location.reload();
      }
        break;
    }
  }
});
//APIでカードを出現させる
const inputTextBox = document.getElementById('inputTextBox'); // input要素を取得する
const cardBoard = document.getElementById('cardBoard'); // img要素を作成するためのdiv
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', () => {
  const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(inputTextBox.value)}&searchType=image`;
  fetch(apiUrl).then(response => response.json()).then(data => {
    const imgElement = document.createElement('img'); // img要素を作成する
    imgElement.classList.add('cards'); // img要素のclassを設定する
    const newCardId = `card${cardBoard.children.length + 1}`;
    imgElement.id = newCardId; // img要素のidを設定する
    imgElement.dataset.src = data.items[0].link; // 画像のURLをdata属性に設定しておく
    imgElement.src = data.items[0].link;
    cardBoard.appendChild(imgElement); // img要素をdiv要素に追加
    const cardData = {
      id: newCardId,
      imageUrl: data.items[0].link
    };
    sessionStorage.setItem(newCardId, JSON.stringify(cardData));
  }).catch(error => alert('APIキーと検索エンジンIDが登録されていないか、正しくありません。ご確認ください。'));
});
//カードクリック時の処理
//画面上の適当な場所を押して、それがカードだった場合特定の処理をする
document.addEventListener('click', (event) => {
  const card = event.target.closest('.cards');
  if (!card) return; //カードじゃなければ処理をしない
  if (document.querySelector('.clickedCard') && document.querySelector('.clickedZone')) {
    //カードもゾーンも押していた場合
    return;
  } else if (document.querySelector('.clickedCard') && !document.querySelector('.clickedZone')) {
    //カードは押していてゾーンを押していない場合
    const allCards = document.querySelectorAll('.cards');
    for (const card of allCards) {
      card.style.opacity = 1.0;
    }
    for (const element of document.querySelectorAll('.clickedCard')) {
     element.classList.remove('clickedCard');
    }
    card.classList.add('clickedCard');
    card.style.opacity = 0.5;
  } else if (!document.querySelector('.clickedCard') && document.querySelector('.clickedZone')) {
    //カードを押していなくてゾーンは押していた場合
    const clickedZone = document.querySelector('.clickedZone');
    const zoneRect = clickedZone.getBoundingClientRect();
    const zoneTop = zoneRect.top + 2;
    const zoneLeft = zoneRect.left + 22;
    const splittedObjects = document.querySelectorAll('.splittedObjects');
    for (const object of splittedObjects) {
      Object.assign(object.style, {
        position: 'absolute',
        left: `${zoneLeft}px`,
        top: `${zoneTop}px`,
        transition: 'all 0.8s ease-in-out'
      });
    }
    for (const element of document.querySelectorAll('.clickedZone')) {
      element.classList.remove('clickedZone');
    }
    for (const element of document.querySelectorAll('.splittedObjects')) {
      element.classList.remove('splittedObjects');
    }
    card.classList.add('clickedCard');
    card.style.opacity = 0.5;
    maxZIndex += 1;
    card.style.zIndex = maxZIndex;
    card.style.opacity = 0.5;
  } else if(!document.querySelector('.clickedCard') && !document.querySelector('.clickedZone')) {
    //カードもゾーンも押していない場合
    card.classList.add('clickedCard');
    card.style.opacity = 0.5;
  }
});
//ゾーンを生成する
for (let i = 1; i <= 49; i++) {
  const zoneElement = document.createElement('div');
  zoneElement.classList.add('zones');
  zoneElement.id = `zone${i}`;
  zoneBoard.appendChild(zoneElement);
};
//ゾーンを押したとき
const zones = document.querySelectorAll('.zones');
for (let i = 0; i < zones.length; i++) {
  const zone = zones[i]; // それぞれのzoneを変数に置く
  zone.addEventListener('click', () => {
    //カードもゾーンも押していた場合
    //すなわち、カード→ゾーンと押していた場合。ゾーン→カードと押していた場合は既に別の処理が完了してるので考えない。
    //ゾーンを置き換える。
    if (document.querySelector('.clickedCard') && document.querySelector('.clickedZone')) {
      for (const zone of zones) {
        if (zone.style.opacity === '0.75'){
         zone.style.opacity = '0.4';
        }
      } 
      for (const element of document.querySelectorAll('.clickedZone')) {
        element.classList.remove('clickedZone');
      }
      zone.classList.add('clickedZone');
      zone.style.opacity = 0.75;
    }
    //カードを押してゾーンを押していない場合
    //単純に追加する
    else if (document.querySelector('.clickedCard') && !document.querySelector('.clickedZone')) {
      zone.classList.add('clickedZone');
      zone.style.opacity = 0.75;
    }
    //カードを押さずゾーンを押していた場合
    //処理なし。そもそもこの分岐にならない。ゾーンを置き換えるわけではない。
    else if (!document.querySelector('.clickedCard') && document.querySelector('.clickedZone')) {
      return;
    }
    //何も押していなかった場合
    //そこにあるカードを一覧表示する
    else if (!document.querySelector('.clickedCard') && !document.querySelector('.clickedZone')) {
      zone.classList.add('clickedZone');
      const allObjects = document.querySelectorAll('.cards');
      const overlappingObjects = Array.from(allObjects).filter((object) => {
        const objectRect = object.getBoundingClientRect();
        const zoneRect = zone.getBoundingClientRect();
        return objectRect.top > zoneRect.top - 15 && objectRect.bottom < zoneRect.bottom + 15 && objectRect.left > zoneRect.left - 15 && objectRect.right < zoneRect.right + 15;
      });
      //クリックしたゾーンの上にあるカードが2枚以上なら一覧表示処理する
      if (overlappingObjects.length >= 2) {
        const zoneRect = zone.getBoundingClientRect();
        const cardHeight = 127; // カードの高さ
        const cardWidth = 100; //カードの横幅
        const spacing = 10; // カード間のスペース
        const howManyCardsInOneRow = 7; // 1列の中で表示したいカードの数
        const howManyRows = Math.ceil(overlappingObjects.length / howManyCardsInOneRow); // 列の数
        let topOffset = zoneRect.top + 10; //微調整
        let leftOffset = zoneRect.left + 22; //微調整
        let howManyCardsInOneRowCounter = 0;
        let howManyRowsCounter = 1;
        overlappingObjects.sort((first, second) => first.style.zIndex - second.style.zIndex) //overlappingObjects配列内のimgタグをzIndexが小さい順に並び替えておく
        if (zoneRect.left > 460) {
          //対象ゾーンが右側のときは一覧表示は左下方向に広がる
          for (const object of overlappingObjects) {
            Object.assign(object.style, {
              position: 'absolute',
              left: `${leftOffset}px`,
              top: `${topOffset}px`,
              zIndex: ++maxZIndex, // 重なっているカードを他のゾーンのカードより上に表示する
            });
            object.classList.add('splittedObjects');
            howManyCardsInOneRowCounter++;
            if (howManyCardsInOneRowCounter === howManyCardsInOneRow) {
              topOffset = zoneRect.top + spacing;
              leftOffset = zoneRect.left - cardWidth * howManyRowsCounter - spacing * 3; // 守備表示のカードを横に並べるとき微調整
              howManyRowsCounter++;
              howManyCardsInOneRowCounter = 0;
            } else {
              topOffset = zoneRect.top + cardHeight * howManyCardsInOneRowCounter + spacing;
            }
          }
        } else if (zoneRect.left <= 460) {
          //対象ゾーンが左側から一覧表示は右下方向に広がる
          for (const object of overlappingObjects) {
            Object.assign(object.style, {
              position: 'absolute',
              left: `${leftOffset}px`,
              top: `${topOffset}px`,
              zIndex: ++maxZIndex, // 重なっているカードを他のゾーンのカードより上に表示する
            });
            object.classList.add('splittedObjects');
            howManyCardsInOneRowCounter++;
            if (howManyCardsInOneRowCounter === howManyCardsInOneRow) {
              topOffset = zoneRect.top + spacing;
              leftOffset = zoneRect.left + cardWidth * howManyRowsCounter + spacing * 3; // 守備表示のカードを横に並べるとき微調整
              howManyRowsCounter++;
              howManyCardsInOneRowCounter = 0;
            } else {
              topOffset = zoneRect.top + cardHeight * howManyCardsInOneRowCounter + spacing;
            }
          }
        }
      }
    }
  })
};
//カード移動＆発光（カード発動）
const actionMoveAndGlow = document.getElementById('actionMoveAndGlow');
actionMoveAndGlow.addEventListener('click', () => {
  if (document.querySelector('.clickedCard') && document.querySelector('.clickedZone')) {
    //音を鳴らす
    soundMove.play();
    //ウィンドウ一番上に強制スクロール
    window.scrollTo(0, 0);
    //クリックされたものを取得
    const clickedCard = document.querySelector('.clickedCard');
    const clickedZone = document.querySelector('.clickedZone');
    // まずcardを非表示にする
    clickedCard.style.opacity = '0';
    // 位置関係を定義する
    clickedCard.style.position = 'absolute';
    clickedZone.style.position = 'relative';
    //動かす
    const zoneRect = clickedZone.getBoundingClientRect();
    const zoneTop = zoneRect.top + 2;
    const zoneLeft = zoneRect.left + 22;
    clickedCard.style.top = `${zoneTop}px`;
    clickedCard.style.left = `${zoneLeft}px`;
    clickedCard.style.transition = 'top 0.8s ease-in-out, left 0.8s ease-in-out';
    maxZIndex += 1;
    clickedCard.style.zIndex = maxZIndex;
    setTimeout(() => {
      soundActivate.play();
      // 時間をおいてからcardを表示させる
      clickedCard.style.opacity = '1';
      clickedZone.style.opacity = '0.35';
      clickedCard.src = clickedCard.dataset.src;
      //光らせる
      clickedCard.classList.add('cardGlowAnimation');
      setTimeout(() => {
        clickedCard.classList.remove('cardGlowAnimation');
        // カードを動かした後に最新の transform の値を取得する
        const updatedTransform = clickedCard.style.transform;
        // ログに移動情報を追加
        const log = {
          actionType: 'moveAndGlowCard',
          cardId: clickedCard.id,
          zoneId: clickedZone.id,
          zoneTop: zoneTop,
          zoneLeft: zoneLeft,
          zIndex: maxZIndex,
          cardImageUrl: clickedCard.src,
          animationType: 'cardGlowAnimation',
          transform: updatedTransform
        };
        logs.push(log);
        // ログの内容をテキストボックスに表示する
        saveTextBox.value = JSON.stringify(logs, null, 2);
        // リセットする
        for (const element of document.querySelectorAll('.clickedCard')) {
          element.classList.remove('clickedCard');
        }
        for (const element of document.querySelectorAll('.clickedZone')) {
          element.classList.remove('clickedZone');
        }
      }, 1000);
    }, 300);
  }
});
//カード発光（効果発動）
const actionActivateEffect = document.getElementById('actionActivateEffect');
actionActivateEffect.addEventListener('click', () => {
  if (document.querySelector('.clickedCard') && !document.querySelector('.clickedZone')) {
    const clickedCard = document.querySelector('.clickedCard');
    soundActivate.play();
    maxZIndex += 1;
    clickedCard.style.zIndex = maxZIndex;
    clickedCard.style.opacity = '1';
    //現在の transform の値を取得する
    const currentTransform = clickedCard.style.transform;
    //ログに移動情報を追加
    const log = {
      actionType: 'glowCard',
      cardId: clickedCard.id,
      zIndex: maxZIndex,
      animationType: 'cardGlowAnimation',
      transform: currentTransform
    }
    logs.push(log);
    //ログの内容をテキストボックスに表示する
    saveTextBox.value = JSON.stringify(logs, null, 2);
    setTimeout(() => {
      clickedCard.classList.add('cardGlowAnimation');
      setTimeout(() => {
        clickedCard.classList.remove('cardGlowAnimation');
        //リセットする
        for (const element of document.querySelectorAll('.clickedCard')) {
          element.classList.remove('clickedCard');
        }
      }, 1000);
    }, 150);
  }
});
//カード移動＆拡大（モンスター召喚）
const actionMoveAndZoom = (imageUrl, rotation) => {
  if (document.querySelector('.clickedCard') && document.querySelector('.clickedZone')) {
    //音を鳴らす
    soundSummon.play();
    //ウィンドウ一番上に強制スクロール
    window.scrollTo(0, 0);
    //クリックされたものを取得
    const clickedCard = document.querySelector('.clickedCard');
    const clickedZone = document.querySelector('.clickedZone');
    // まずcardを非表示にする
    clickedCard.style.opacity = '0';
    //早めに向きを変えておく
    clickedCard.src = imageUrl;
    clickedCard.style.transform = `rotate(${rotation}deg)`;
    // 位置関係を定義する
    clickedCard.style.position = 'absolute';
    clickedZone.style.position = 'relative';
    // 非表示のまま動かす
    const zoneRect = clickedZone.getBoundingClientRect();
    const zoneTop = zoneRect.top + 2;
    const zoneLeft = zoneRect.left + 22;
    clickedCard.style.top = `${zoneTop}px`;
    clickedCard.style.left = `${zoneLeft}px`;
    clickedCard.style.transition = 'top 0.8s ease-in-out, left 0.8s ease-in-out';
    maxZIndex += 1;
    clickedCard.style.zIndex = maxZIndex;
    setTimeout(() => {
      // 時間をおいてからcardを表示させる
      clickedCard.style.opacity = '1';
      clickedZone.style.opacity = '0.35';
      //拡大表示
      clickedCard.classList.add('summonAnimation');
      setTimeout(() => {
        // カードを動かした後に最新の transform の値を取得する
        const updatedTransform = clickedCard.style.transform;
        // ログに移動情報を追加
        const log = {
          actionType: 'moveAndZoomCard',
          cardId: clickedCard.id,
          zoneId: clickedZone.id,
          zoneTop: zoneTop,
          zoneLeft: zoneLeft,
          zIndex: maxZIndex,
          cardImageUrl: clickedCard.src,
          animationType: 'summonAnimation',
          transform: updatedTransform
        };
        logs.push(log);
        // ログの内容をテキストボックスに表示する
        saveTextBox.value = JSON.stringify(logs, null, 2);
        clickedCard.classList.remove('summonAnimation');
        // リセットする
        for (const element of document.querySelectorAll('.clickedCard')) {
          element.classList.remove('clickedCard');
        }
        for (const element of document.querySelectorAll('.clickedZone')) {
          element.classList.remove('clickedZone');
        }
      }, 400);
    }, 300);
  }
};
document.getElementById('action0FaceupMoveAndZoom').addEventListener('click', () => {
  const clickedCard = document.querySelector('.clickedCard');
  actionMoveAndZoom(clickedCard.dataset.src, 0);
});
document.getElementById('action90FaceupMoveAndZoom').addEventListener('click', () => {
  const clickedCard = document.querySelector('.clickedCard');
  actionMoveAndZoom(clickedCard.dataset.src, -90);
});
document.getElementById('action180FaceupMoveAndZoom').addEventListener('click', () => {
  const clickedCard = document.querySelector('.clickedCard');
  actionMoveAndZoom(clickedCard.dataset.src, -180);
});
document.getElementById('action0FacedownMoveAndZoom').addEventListener('click', () => {
  actionMoveAndZoom(reversedCardUrl, 0);
});
document.getElementById('action90FacedownMoveAndZoom').addEventListener('click', () => {
  actionMoveAndZoom(reversedCardUrl, -90);
});
document.getElementById('action180FacedownMoveAndZoom').addEventListener('click', () => {
  actionMoveAndZoom(reversedCardUrl, -180);
});
//カード移動
const actionMove = (imageUrl, rotation) => {
  if (document.querySelector('.clickedCard') && document.querySelector('.clickedZone')) {
    //音を鳴らす
    soundMove.play();
    //ウィンドウ一番上に強制スクロール
    window.scrollTo(0, 0);
    //クリックされたものを取得
    const clickedCard = document.querySelector('.clickedCard');
    const clickedZone = document.querySelector('.clickedZone');
    // まずcardを非表示にする
    clickedCard.style.opacity = '0';
    //早めに向きを変えておく
    clickedCard.src = imageUrl;
    clickedCard.style.transform = `rotate(${rotation}deg)`;
    // 位置関係を定義する
    clickedCard.style.position = 'absolute';
    clickedZone.style.position = 'relative';
    // 非表示のまま動かす
    const zoneRect = clickedZone.getBoundingClientRect();
    const zoneTop = zoneRect.top + 2;
    const zoneLeft = zoneRect.left + 22;
    clickedCard.style.top = `${zoneTop}px`;
    clickedCard.style.left = `${zoneLeft}px`;
    clickedCard.style.transition = 'top 0.8s ease-in-out, left 0.8s ease-in-out';
    maxZIndex += 1;
    clickedCard.style.zIndex = maxZIndex;
    setTimeout(() => {
      // 時間をおいてからcardを表示させる
      clickedCard.style.opacity = '1';
      clickedZone.style.opacity = '0.35';
      // カードを動かした後に最新の transform の値を取得する
      const updatedTransform = clickedCard.style.transform;
      // ログに移動情報を追加
      const log = {
        actionType: 'moveCard',
        cardId: clickedCard.id,
        zoneId: clickedZone.id,
        zoneTop: zoneTop,
        zoneLeft: zoneLeft,
        zIndex: maxZIndex,
        cardImageUrl: clickedCard.src,
        transform: updatedTransform
      };
      logs.push(log);
      // ログの内容をテキストボックスに表示する
      saveTextBox.value = JSON.stringify(logs, null, 2);
      // リセットする
      for (const element of document.querySelectorAll('.clickedCard')) {
        element.classList.remove('clickedCard');
      }
      for (const element of document.querySelectorAll('.clickedZone')) {
        element.classList.remove('clickedZone');
      }
    }, 500);
  }
};
document.getElementById('action0FaceupMove').addEventListener('click', () => {
  const clickedCard = document.querySelector('.clickedCard');
  actionMove(clickedCard.dataset.src, 0);
});
document.getElementById('action90FaceupMove').addEventListener('click', () => {
  const clickedCard = document.querySelector('.clickedCard');
  actionMove(clickedCard.dataset.src, -90);
});
document.getElementById('action180FaceupMove').addEventListener('click', () => {
  const clickedCard = document.querySelector('.clickedCard');
  actionMove(clickedCard.dataset.src, -180);
});
document.getElementById('action0FacedownMove').addEventListener('click', () => {
  actionMove(reversedCardUrl, 0);
});
document.getElementById('action90FacedownMove').addEventListener('click', () => {
  actionMove(reversedCardUrl, -90);
});
document.getElementById('action180FacedownMove').addEventListener('click', () => {
  actionMove(reversedCardUrl, -180);
});
//自分ライフポイント
const myLifePointBox = document.getElementById('myLifePointBox');
let myLifePoint = 8000;
document.addEventListener('DOMContentLoaded', () => {
  myLifePointBox.innerHTML = myLifePoint;
});
myLifePointBox.addEventListener('click', () => {
  myLifePointBox.innerHTML = `<Input type='textr' id='myNewLifePoint' value='${myLifePoint}' />`;
  const myInput = document.getElementById('myNewLifePoint');
  myInput.focus();
  myInput.setSelectionRange(myInput.value.length, myInput.value.length);
});
const myLifePointSave = document.getElementById('myLifePointSave');
myLifePointSave.addEventListener('click', () => {
  // テキストボックス以外の要素がクリックされた場合に更新処理を実行
  const myNewLifePoint = parseInt(document.getElementById('myNewLifePoint').value);
  myLifePoint = myNewLifePoint;
  myLifePointBox.innerHTML = myLifePoint;
  const log = {
    actionType: 'displayMyLifePoint',
    text: myLifePoint
  };
  logs.push(log);
  // ログの内容をテキストボックスに表示する
  saveTextBox.value = JSON.stringify(logs, null, 2);
});
//相手ライフポイント
const opponentLifePointBox = document.getElementById('opponentLifePointBox');
let opponentLifePoint = 8000;
document.addEventListener('DOMContentLoaded', () => {
  opponentLifePointBox.innerHTML = opponentLifePoint;
});
opponentLifePointBox.addEventListener('click', () => {
  opponentLifePointBox.innerHTML = `<Input type='textr' id='opponentNewLifePoint' value='${opponentLifePoint}' />`;
  const opponentInput = document.getElementById('opponentNewLifePoint');
  opponentInput.focus();
  opponentInput.setSelectionRange(opponentInput.value.length, opponentInput.value.length);
});
const opponentLifePointSave = document.getElementById('opponentLifePointSave');
opponentLifePointSave.addEventListener('click', () => {
  const opponentNewLifePoint = parseInt(document.getElementById('opponentNewLifePoint').value);
  opponentLifePoint = opponentNewLifePoint;
  opponentLifePointBox.innerHTML = opponentLifePoint;
  const log = {
    actionType: 'displayOpponentLifePoint',
    text: opponentLifePoint
  };
  logs.push(log);
  // ログの内容をテキストボックスに表示する
  saveTextBox.value = JSON.stringify(logs, null, 2);
});
//一時コメントを保存する
const saveCommentButton = document.getElementById('saveCommentButton');
const commentArea = document.getElementById('commentArea');
saveCommentButton.addEventListener('click', () => {
  //音を鳴らす
  soundMessage.play();
  const content = commentArea.value; // テキストエリアの内容を取得
  const log = {
    actionType: 'saveComment',
    text: content
  };
  logs.push(log);
  // ログの内容をテキストボックスに表示する
  saveTextBox.value = JSON.stringify(logs, null, 2);
  // テキストエリアを空にする
  commentArea.value = '';
});
//注意喚起などの永続的な文を保存する
const saveAttentionButton = document.getElementById('saveAttentionButton');
const attentionArea = document.getElementById('attentionArea');
saveAttentionButton.addEventListener('click', () => {
  //音を鳴らす
  soundMessage.play();
  const content = attentionArea.value; // テキストエリアの内容を取得
  const log = {
    actionType: 'attentionComment',
    text: content
  };
  logs.push(log);
  // ログの内容をテキストボックスに表示する
  saveTextBox.value = JSON.stringify(logs, null, 2);
  // テキストエリアを一瞬だけ点滅させる
  attentionArea.style.opacity = 0;
  setTimeout(() => {
    //最新のテキストを表示する
    attentionArea.value = content;
    //再度表示する
    attentionArea.style.opacity = 1;
  }, 300);
});
//操作ミスして戻したいとき
const undoButton = document.getElementById('undoButton');
undoButton.addEventListener('click', () => {
  soundUndo.play();
  if (logs[logs.length - 1].actionType === 'moveCard' || logs[logs.length - 1].actionType === 'moveAndZoomCard' || logs[logs.length - 1].actionType === 'moveAndGlowCard') {
    const lastCardId = logs[logs.length - 1].cardId;
    const filteredLogs = logs.filter(log => log.cardId === lastCardId && (log.actionType === 'moveCard' || log.actionType === 'moveAndZoomCard' || log.actionType === 'moveAndGlowCard'));
    if (filteredLogs.length === 1) {
      window.scrollTo(0, 0);
      const undoZoneId = 'zone25'; // 実際のDOM要素のIDを指定する
      const undoZoneElement = document.getElementById(undoZoneId); // DOM要素を取得
      const undoZoneRect = undoZoneElement.getBoundingClientRect(); // DOM要素の位置を取得
      const undoZoneTop = undoZoneRect.top + 2;
      const undoZoneLeft = undoZoneRect.left + 22;
      maxZIndex += 1;
      const undoZIndex = maxZIndex;
      const undoCardImageUrl = filteredLogs[filteredLogs.length - 1].cardImageUrl;
      const undoTransform = filteredLogs[filteredLogs.length - 1].transform;
      const undoCard = document.getElementById(lastCardId);
      const undoZone = document.getElementById(undoZoneId);
      // まずcardを非表示にする
      undoCard.style.opacity = '0';
      //早めに向きを変えておく
      undoCard.src = undoCardImageUrl;
      undoCard.style.transform = undoTransform;
      // 位置関係を定義する
      undoCard.style.position = 'absolute';
      undoZone.style.position = 'relative';
      // 非表示のまま動かす
      undoCard.style.top = `${undoZoneTop}px`;
      undoCard.style.left = `${undoZoneLeft}px`;
      undoCard.style.transition = 'top 0.8s ease-in-out, left 0.8s ease-in-out';
      undoCard.style.zIndex = undoZIndex;
      setTimeout(() => {
        // 時間をおいてからcardを表示させる
        undoCard.style.opacity = '1';
        undoZone.style.opacity = '0.35';
        // 配列をリセットする
        //undoCard = null;
        //undoZone = null;
      }, 500);
    } else if (filteredLogs.length >= 2) {
      //ウィンドウ一番上に強制スクロール
      window.scrollTo(0, 0);
      const undoZoneId = filteredLogs[filteredLogs.length - 2].zoneId;
      const undoZoneTop = filteredLogs[filteredLogs.length - 2].zoneTop;
      const undoZoneLeft = filteredLogs[filteredLogs.length - 2].zoneLeft;
      const undoZIndex = filteredLogs[filteredLogs.length - 2].zIndex;
      const undoCardImageUrl = filteredLogs[filteredLogs.length - 2].cardImageUrl;
      //const undoanimationType = filteredLogs[filteredLogs.length - 2].animationType;
      const undoTransform = filteredLogs[filteredLogs.length - 2].transform;
      const undoCard = document.getElementById(lastCardId);
      const undoZone = document.getElementById(undoZoneId);
      // まずcardを非表示にする
      undoCard.style.opacity = '0';
      //早めに向きを変えておく
      undoCard.src = undoCardImageUrl;
      undoCard.style.transform = undoTransform;
      // 位置関係を定義する
      undoCard.style.position = 'absolute';
      undoZone.style.position = 'relative';
      // 非表示のまま動かす
      undoCard.style.top = `${undoZoneTop}px`;
      undoCard.style.left = `${undoZoneLeft}px`;
      undoCard.style.transition = 'top 0.8s ease-in-out, left 0.8s ease-in-out';
      undoCard.style.zIndex = undoZIndex;
      setTimeout(() => {
        // 時間をおいてからcardを表示させる
        undoCard.style.opacity = '1';
        undoZone.style.opacity = '0.35';
        // 配列をリセットする
        //undoCard = null;
        //undoZone = null;
      }, 500);
    }
    //logs配列から最後の要素を削除
    logs.pop();
    // ログの内容をテキストボックスに表示する
    saveTextBox.value = JSON.stringify(logs, null, 2);
  } else if (logs[logs.length - 1].actionType === 'glowCard') {
    // logs配列から最後の要素を削除
    logs.pop();
    // ログの内容をテキストボックスに表示する
    saveTextBox.value = JSON.stringify(logs, null, 2);
  } else if (logs[logs.length - 1].actionType === 'saveComment' || logs[logs.length - 1].actionType === 'attentionComment') {
    // logs配列から最後の要素を削除
    logs.pop();
    // ログの内容をテキストボックスに表示する
    saveTextBox.value = JSON.stringify(logs, null, 2);
  } else if (logs[logs.length - 1].actionType === 'displayMyLifePoint') {
    const filteredLogs = logs.filter(log => log.actionType === 'displayMyLifePoint');
    if (filteredLogs.length === 1) {
      const undoMyLifePoint = '8000';
      myLifePointBox.innerHTML = undoMyLifePoint;
    } else if (filteredLogs.length >= 2) {
      const undoMyLifePoint = filteredLogs[filteredLogs.length - 2].text;
      myLifePointBox.innerHTML = undoMyLifePoint;
    }
    //logs配列から最後の要素を削除
    logs.pop();
    // ログの内容をテキストボックスに表示する
    saveTextBox.value = JSON.stringify(logs, null, 2);
  } else if (logs[logs.length - 1].actionType === 'displayOpponentLifePoint') {
    const filteredLogs = logs.filter(log => log.actionType === 'displayOpponentLifePoint');
    if (filteredLogs.length === 1) {
      const undoOpponentLifePoint = '8000';
      opponentLifePointBox.innerHTML = undoOpponentLifePoint;
    } else if (filteredLogs.length >= 2) {
      const undoOpponentLifePoint = filteredLogs[filteredLogs.length - 2].text;
      opponentLifePointBox.innerHTML = undoOpponentLifePoint;
    }
    //logs配列から最後の要素を削除
    logs.pop();
    // ログの内容をテキストボックスに表示する
    saveTextBox.value = JSON.stringify(logs, null, 2);
  };
});
//ログをクリックすると自動コピーする
const saveTextBox = document.getElementById('saveTextBox');
saveTextBox.addEventListener('click', () => {
  saveTextBox.select();
  saveTextBox.setSelectionRange(0, 99999); // モバイルデバイス用
  document.execCommand('copy');
});
//リプレイを再生する
let logs = [];
const loadLogButton = document.getElementById('loadLogButton');
loadLogButton.addEventListener('click', () => {
  const secValue = parseInt(document.getElementById('secValue').value);
  const loadTextBox = document.getElementById('loadTextBox');
  const logText = loadTextBox.value;
  // テキストを改行ごとに分割してログとして解釈し、配列に変換する
  logs = JSON.parse(logText);
  // アニメーションを再生する
  for (const [index, log] of logs.entries()) {
    setTimeout(() => {
      const {
        actionType,
        cardId,
        zoneId,
        zoneTop,
        zoneLeft,
        zIndex,
        cardImageUrl,
        animationType,
        transform,
        text
      } = log;
      if (actionType === 'moveCard') {
        soundMove.play();
        const replayedCard = document.getElementById(cardId);
        const replayedZone = document.getElementById(zoneId);
        replayedCard.classList.add('cards'); //アニメーション付けるためクラス付与
        // まずcardを非表示にする
        replayedCard.style.opacity = '0';
        //早めに向きを変えておく
        replayedCard.style.transform = transform;
        replayedCard.src = cardImageUrl;
        // 位置関係を定義する
        replayedCard.style.position = 'absolute';
        replayedZone.style.position = 'relative';
        // 非表示のまま動かす
        replayedCard.style.top = `${zoneTop}px`;
        replayedCard.style.left = `${zoneLeft}px`;
        replayedCard.style.transition = 'top 0.8s ease-in-out, left 0.8s ease-in-out';
        replayedCard.style.zIndex = zIndex;
        setTimeout(() => {
          // 時間をおいてからcardを表示させる
          replayedCard.style.opacity = '1';
        }, 500);
      } else if (actionType === 'moveAndZoomCard') {
        soundSummon.play();
        const replayedCard = document.getElementById(cardId);
        const replayedZone = document.getElementById(zoneId);
        replayedCard.classList.add('cards'); //アニメーション付けるためクラス付与
        // まずcardを非表示にする
        replayedCard.style.opacity = '0';
        //早めに向きを変えておく
        replayedCard.style.transform = transform;
        replayedCard.src = cardImageUrl;
        // 位置関係を定義する
        replayedCard.style.position = 'absolute';
        replayedZone.style.position = 'relative';
        // 非表示のまま動かす
        replayedCard.style.top = `${zoneTop}px`;
        replayedCard.style.left = `${zoneLeft}px`;
        replayedCard.style.transition = 'top 0.8s ease-in-out, left 0.8s ease-in-out';
        replayedCard.style.zIndex = zIndex;
        setTimeout(() => {
          // 時間をおいてからcardを表示させる
          replayedCard.style.opacity = '1';
          // 縮小拡大させる
          replayedCard.classList.add(animationType);
          setTimeout(() => {
            replayedCard.classList.remove(animationType);
          }, 400);
        }, 500);
      } else if (actionType === 'moveAndGlowCard') {
        soundSummon.play();
        const replayedCard = document.getElementById(cardId);
        const replayedZone = document.getElementById(zoneId);
        replayedCard.classList.add('cards'); //アニメーション付けるためクラス付与
        // まずcardを非表示にする
        replayedCard.style.opacity = '0';
        //早めに向きを変えておく
        replayedCard.src = cardImageUrl;
        replayedCard.style.transform = transform;
        // 位置関係を定義する
        replayedCard.style.position = 'absolute';
        replayedZone.style.position = 'relative';
        // 非表示のまま動かす
        replayedCard.style.top = `${zoneTop}px`;
        replayedCard.style.left = `${zoneLeft}px`;
        replayedCard.style.transition = 'top 0.8s ease-in-out, left 0.8s ease-in-out';
        replayedCard.style.zIndex = zIndex;
        setTimeout(() => {
          //音を鳴らす
          soundActivate.play();
          // 時間をおいてからcardを表示させる
          replayedCard.style.opacity = '1';
          // 光らせる
          replayedCard.classList.add(animationType);
          setTimeout(() => {
            replayedCard.classList.remove(animationType);
          }, 1000);
        }, 300);
      } else if (actionType === 'glowCard') {
        soundActivate.play();
        const replayedCard = document.getElementById(cardId);
        const replayedZone = document.getElementById(zoneId);
        replayedCard.classList.add('cards'); //アニメーション付けるためクラス付与
        replayedCard.style.zIndex = zIndex;
        setTimeout(() => {
          replayedCard.classList.add(animationType);
          setTimeout(() => {
            replayedCard.classList.remove(animationType);
          }, 1000);
        }, 400);
      } else if (actionType === 'saveComment') {
        soundMessage.play();
        commentArea.value = '';
        commentArea.value = text;
      } else if (actionType === 'attentionComment') {
        soundMessage.play();
        attentionArea.value = '';
        attentionArea.value = text;
      } else if (actionType === 'displayMyLifePoint') {
        myLifePointBox.style.opacity = '0';
        setTimeout(() => {
          myLifePointBox.innerHTML = text;
          myLifePointBox.style.opacity = '1';
        }, 500);
      } else if (actionType === 'displayOpponentLifePoint') {
        opponentLifePointBox.style.opacity = '0';
        setTimeout(() => {
          opponentLifePointBox.innerHTML = text;
          opponentLifePointBox.style.opacity = '1';
        }, 500);
      }
    }, index * secValue);
  }
});