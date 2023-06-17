//APIキー
const apiKey = 'sample'; // ★APIキーを設定する
const searchEngineId = 'sample'; // ★検索エンジンIDを設定
//デフォルト背景などのカスタマイズ要素
const defaultProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1yk8LICiBA47bLzbx4B9GIgqb_b2ACfcfLQ&usqp=CAU';
const defaultBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOIniS7XLImZPYWtQWq9o4xQiAme6WXLHv1w&usqp=CAU';
const soundActivate = new Audio('https://www.dropbox.com/s/ejwantauizk5dfz/activate.wav?raw=1');
const soundMessage = new Audio('https://www.dropbox.com/s/hhq1os7inuhdeuo/chatmessage.wav?raw=1');
const soundMove = new Audio('https://www.dropbox.com/s/4ob7mzr0yaxcmi4/move.wav?raw=1');
const soundAction = new Audio('https://www.dropbox.com/s/b7qo343njbpmaw0/select.wav?raw=1');
const soundSummon = new Audio('https://www.dropbox.com/s/q3ei7unfk4z1kom/summon.wav?raw=1');
const soundUndo = new Audio('https://www.dropbox.com/s/jwul5831mrx6rff/undo.wav?raw=1')
//グローバル変数宣言
let selectedCard = null;
let selectedZone = null;
let maxZIndex = 0;
let splittedObjects = [];
let reversedCardUrl = null;
let backgroundUrl = null;
//読み込み時、sessionStorageに保存されたカードの情報を取得して再表示
document.addEventListener('DOMContentLoaded', () => {
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key.startsWith('card')) {
      const cardData = JSON.parse(sessionStorage.getItem(key));
      const imgElement = document.createElement('img');
      imgElement.classList.add('cards');
      imgElement.id = cardData.id;
      imgElement.src = cardData.imageUrl;
      cardBoard.appendChild(imgElement);
    }
    //最初からあるカードも反応するようにする カードを押したとき
    const cards = document.querySelectorAll('.cards');
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i]; //それぞれのcardを変数に置く
      const originalImageUrl = card.getAttribute('src'); //cardのsrc属性を取得しておく
      card.addEventListener('click', () => {
        //カードもゾーンも押していた場合 //カード→ゾーンと押していた場合。
        //無効 ※ゾーン→カードと押していた場合は既に別の処理が完了してるので考えない。
        if (selectedCard !== null && selectedZone !== null) {
          return;
        }
        //カードを押してゾーンは押していない場合
        //カードを置き換える
        else if (selectedCard !== null && selectedZone === null) {
          selectedCard.card.style.opacity = 1;
          selectedCard = null; //まず既存のselectedCardを空にする
          selectedCard = {
            card: card,
            originalImageUrl: originalImageUrl
          }; //普通に追加する
          selectedCard.card.style.opacity = 0.5;
          //カードを押さずゾーンを押していた場合
          //一覧表示したものから一つ選ぶ
        } else if (selectedCard === null && selectedZone !== null) {
          selectedCard = {
            card: card,
            originalImageUrl: originalImageUrl
          }; //普通に追加する
          maxZIndex += 1;
          selectedCard.card.style.zIndex = maxZIndex;
          selectedCard.card.style.opacity = 0.5;
          const zoneRect = selectedZone.zone.getBoundingClientRect();
          const zoneTop = zoneRect.top + 2;
          const zoneLeft = zoneRect.left + 22; //この数値は微調整した結果の数値
          splittedObjects.forEach((ccc) => {
            ccc.style.position = 'absolute';
            ccc.style.left = `${zoneLeft}px`;
            ccc.style.top = `${zoneTop}px`;
            ccc.style.transition = 'all 0.8s ease-in-out';
          });
          splittedObjects = [];
          selectedZone = null;
        }
        //何も押していなかった場合
        //単純に追加する
        else if (selectedCard === null && selectedZone === null) {
          selectedCard = {
            card: card,
            originalImageUrl: originalImageUrl
          }; //普通に追加する
          selectedCard.card.style.opacity = 0.5;
        }
      });
    }
  }
});
//読み込み時、sessionStorageにスリーブや背景画像が格納されていれば取得して反映。なければデフォルトのを適用。
document.addEventListener('DOMContentLoaded',
  () => {
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
  const decoratingCard1 = document.createElement('img');
  decoratingCard1.src = reversedCardUrl;
  decoratingCard1.classList.add('decoratingCards');
  decoratingCard1.style.transform = 'rotate(180deg)';
  document.getElementById('zone8').appendChild(decoratingCard1);
  //decoratingCard1.style.opacity = '1';
  const decoratingCard2 = document.createElement('img');
  decoratingCard2.src = reversedCardUrl;
  decoratingCard2.classList.add('decoratingCards');
  decoratingCard2.style.transform = 'rotate(180deg)';
  document.getElementById('zone14').appendChild(decoratingCard2);
  const decoratingCard3 = document.createElement('img');
  decoratingCard3.src = reversedCardUrl;
  decoratingCard3.classList.add('decoratingCards');
  document.getElementById('zone36').appendChild(decoratingCard3);
  const decoratingCard4 = document.createElement('img');
  decoratingCard4.src = reversedCardUrl;
  decoratingCard4.classList.add('decoratingCards');
  document.getElementById('zone42').appendChild(decoratingCard4);
  const pendulumZoneBlueImageUrl = 'https://pbs.twimg.com/media/FxNpK8NaIAAGi-t?format=png&name=360x360';
  const pendulumZoneRedImageUrl = 'https://pbs.twimg.com/media/FxNpLXGaAAEB3fO?format=png&name=small';
  const decorating5 = document.createElement('img');
  decorating5.src = pendulumZoneRedImageUrl;
  decorating5.classList.add('decoratingItems');
  decorating5.style.transform = 'rotate(180deg)';
  document.getElementById('zone9').appendChild(decorating5);
  const decorating6 = document.createElement('img');
  decorating6.src = pendulumZoneBlueImageUrl;
  decorating6.classList.add('decoratingItems');
  decorating6.style.transform = 'rotate(180deg)';
  document.getElementById('zone13').appendChild(decorating6);
  const decorating7 = document.createElement('img');
  decorating7.src = pendulumZoneBlueImageUrl;
  decorating7.classList.add('decoratingItems');
  document.getElementById('zone37').appendChild(decorating7);
  const decorating8 = document.createElement('img');
  decorating8.src = pendulumZoneRedImageUrl;
  decorating8.classList.add('decoratingItems');
  document.getElementById('zone41').appendChild(decorating8);
});
//好きなテーマのカード群やスリーブ、背景を表示する
document.getElementById('themeSelect').addEventListener('change', () => {
  const selectedOption = document.getElementById('themeSelect').value;
  //宝玉獣
  if (selectedOption === 'crystalBeast') {
    sessionStorage.clear();
    function createCardElement(id,
      imageUrl) {
      const imgElement = document.createElement('img'); // img要素を作成する
      imgElement.classList.add('cards'); // img要素のclassを設定する
      imgElement.id = id;
      imgElement.src = imageUrl; // img要素のsrcを設定する
      cardBoard.appendChild(imgElement); // img要素をdiv要素に追加
      const cardData = {
        id: id,
        imageUrl: imageUrl
      };
      sessionStorage.setItem(id,
        JSON.stringify(cardData));
    }
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
  } else if (selectedOption === 'infernobleIgKnight') {
    //焔聖騎士・イグナイト
    sessionStorage.clear();
    function createCardElement(id,
      imageUrl) {
      const imgElement = document.createElement('img'); // img要素を作成する
      imgElement.classList.add('cards'); // img要素のclassを設定する
      imgElement.id = id;
      imgElement.src = imageUrl; // img要素のsrcを設定する
      cardBoard.appendChild(imgElement); // img要素をdiv要素に追加
      const cardData = {
        id: id,
        imageUrl: imageUrl
      };
      sessionStorage.setItem(id,
        JSON.stringify(cardData));
    }
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
    const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgHzRQa_zODX9IhJs1ClrXEEtcYOuuu_3bLQ&usqp=CAU';
    sessionStorage.setItem('selectedProtectorUrl',
      optionalProtectorUrl);
    const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3ovo5u-za4s5ML-sXfzmFknpMl5tjCaXSaQ&usqp=CAU';
    sessionStorage.setItem('selectedBackgroundUrl',
      optionalBackgroundUrl);
    location.reload();
  } else if (selectedOption === 'spyral') {
    //スパイラル
    sessionStorage.clear();
    function createCardElement(id,
      imageUrl) {
      const imgElement = document.createElement('img'); // img要素を作成する
      imgElement.classList.add('cards'); // img要素のclassを設定する
      imgElement.id = id;
      imgElement.src = imageUrl; // img要素のsrcを設定する
      cardBoard.appendChild(imgElement); // img要素をdiv要素に追加
      const cardData = {
        id: id,
        imageUrl: imageUrl
      };
      sessionStorage.setItem(id,
        JSON.stringify(cardData));
    }
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
  } else if (selectedOption === 'default') {
    //デフォルト
    sessionStorage.clear();
    const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1yk8LICiBA47bLzbx4B9GIgqb_b2ACfcfLQ&usqp=CAU';
    sessionStorage.setItem('selectedProtectorUrl',
      optionalProtectorUrl);
    const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOIniS7XLImZPYWtQWq9o4xQiAme6WXLHv1w&usqp=CAU';
    sessionStorage.setItem('selectedBackgroundUrl',
      optionalBackgroundUrl);
    location.reload();
  } else if (selectedOption === 'lunaLight') {
    //月光
    sessionStorage.clear();
    function createCardElement(id,
      imageUrl) {
      const imgElement = document.createElement('img'); // img要素を作成する
      imgElement.classList.add('cards'); // img要素のclassを設定する
      imgElement.id = id;
      imgElement.src = imageUrl; // img要素のsrcを設定する
      cardBoard.appendChild(imgElement); // img要素をdiv要素に追加
      const cardData = {
        id: id,
        imageUrl: imageUrl
      };
      sessionStorage.setItem(id,
        JSON.stringify(cardData));
    }
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
    const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAfLYAT-XU3vb8GKwf3nNRNm_AbwIlwZ1ymA&usqp=CAU';
    sessionStorage.setItem('selectedProtectorUrl',
      optionalProtectorUrl);
    const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi2pXLoS2guM3gYAkN1lav7G320wcZdkierg&usqp=CAU';
    sessionStorage.setItem('selectedBackgroundUrl',
      optionalBackgroundUrl);
    location.reload();
  } else if (selectedOption === 'sixSamurai') {
    //六武衆
    sessionStorage.clear();
    function createCardElement(id,
      imageUrl) {
      const imgElement = document.createElement('img'); // img要素を作成する
      imgElement.classList.add('cards'); // img要素のclassを設定する
      imgElement.id = id;
      imgElement.src = imageUrl; // img要素のsrcを設定する
      cardBoard.appendChild(imgElement); // img要素をdiv要素に追加
      const cardData = {
        id: id,
        imageUrl: imageUrl
      };
      sessionStorage.setItem(id,
        JSON.stringify(cardData));
    }
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
    const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTQR2ki5238S-htTuCn-WaoPNHCImdgMHyrw&usqp=CAU';
    sessionStorage.setItem('selectedProtectorUrl',
      optionalProtectorUrl);
    const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_KJv7CULHV7i_7lpgKKhBsmwYW9JZMUsYhA&usqp=CAU';
    sessionStorage.setItem('selectedBackgroundUrl',
      optionalBackgroundUrl);
    location.reload();
  } else if (selectedOption === 'Floowandereeze') {
    //ふわんだりぃず
    sessionStorage.clear();
    function createCardElement(id,
      imageUrl) {
      const imgElement = document.createElement('img'); // img要素を作成する
      imgElement.classList.add('cards'); // img要素のclassを設定する
      imgElement.id = id;
      imgElement.src = imageUrl; // img要素のsrcを設定する
      cardBoard.appendChild(imgElement); // img要素をdiv要素に追加
      const cardData = {
        id: id,
        imageUrl: imageUrl
      };
      sessionStorage.setItem(id,
        JSON.stringify(cardData));
    }
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
    const optionalProtectorUrl = 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTruJlnQ0-e-QRW0FeaNWgpGnJC_nE0DD89vm_qnmYEWK9xg5Um&usqp=CAc';
    sessionStorage.setItem('selectedProtectorUrl',
      optionalProtectorUrl);
    const optionalBackgroundUrl = 'https://pbs.twimg.com/media/FOeCzcRVkAYXX4Z.jpg';
    sessionStorage.setItem('selectedBackgroundUrl',
      optionalBackgroundUrl);
    location.reload();
  }
  //導く先背景 zoneBoard.style.backgroundImage = 'url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhBqFTdE3uAv-ACpLeVZccvmz5vxL3g5y9lg&usqp=CAU')';
  //シルバー const reversedCardUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmFJIJ2gvQrUcjVCbPqcQ46fEhuUa5tSaW1Q&usqp=CAU';
});
//APIでカードを出現させる
const inputTextBox = document.getElementById('inputTextBox'); // input要素を取得する
const cardBoard = document.getElementById('cardBoard'); // img要素を作成するためのdiv
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click',
  () => {
    const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(inputTextBox.value)}&searchType=image`; // Googleカスタム検索APIのURLを作成する
    fetch(apiUrl).then(response => response.json()).then(data => {
      const imageUrl = data.items[0].link; // 取得した画像のURLを取得する
      const imgElement = document.createElement('img'); // img要素を作成する
      imgElement.classList.add('cards'); // img要素のclassとidを設定する
      imgElement.id = `card${cardBoard.children.length +1}`; //もしcardBoard上で既にカードがあったらidが重複しないようにする
      imgElement.src = imageUrl; // img要素のsrcを設定する
      cardBoard.appendChild(imgElement); // img要素をdiv要素に追加
      const cardData = {
        id: imgElement.id,
        imageUrl: imgElement.src
      };
      sessionStorage.setItem(imgElement.id, JSON.stringify(cardData));
      //imgElement.style.position = 'absolute';
      //cardBoard.style.position = 'relative';
      //カードを押したとき
      const cards = document.querySelectorAll('.cards');
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i]; //それぞれのcardを変数に置く
        const originalImageUrl = card.getAttribute('src'); //cardのsrc属性を取得しておく
        card.addEventListener('click', () => {
          //カードもゾーンも押していた場合 //カード→ゾーンと押していた場合。
          //無効 ※ゾーン→カードと押していた場合は既に別の処理が完了してるので考えない。
          if (selectedCard !== null && selectedZone !== null) {
            return;
          }
          //カードを押してゾーンは押していない場合
          //カードを置き換える
          else if (selectedCard !== null && selectedZone === null) {
            selectedCard.card.style.opacity = 1;
            selectedCard = null; //まず既存のselectedCardを空にする
            selectedCard = {
              card: card,
              originalImageUrl: originalImageUrl
            }; //普通に追加する
            selectedCard.card.style.opacity = 0.5;
          }
          //カードを押さずゾーンを押していた場合
          //一覧表示したものから一つ選ぶ
          else if (selectedCard === null && selectedZone !== null) {
            selectedCard = {
              card: card,
              originalImageUrl: originalImageUrl
            }; //普通に追加する
            maxZIndex += 1;
            selectedCard.card.style.zIndex = maxZIndex;
            selectedCard.card.style.opacity = 0.5;
            const zoneRect = selectedZone.zone.getBoundingClientRect();
            const zoneTop = zoneRect.top + 2;
            const zoneLeft = zoneRect.left + 22; //この数値は微調整した結果の数値
            splittedObjects.forEach((ccc) => {
              ccc.style.position = 'absolute';
              ccc.style.left = `${zoneLeft}px`;
              ccc.style.top = `${zoneTop}px`;
              ccc.style.transition = 'all 0.8s ease-in-out';
            });
            splittedObjects = [];
            selectedZone = null;
          }
          //何も押していなかった場合
          //単純に追加する
          else if (selectedCard === null && selectedZone === null) {
            selectedCard = {
              card: card,
              originalImageUrl: originalImageUrl
            }; //普通に追加する
            selectedCard.card.style.opacity = 0.5;
          }
        });
      }
    }).catch(error => console.error(error));
  });
//ゾーンを生成する
for (let i = 1; i <= 49; i++) {
  const zoneElement = document.createElement('div');
  zoneElement.classList.add('zones');
  zoneElement.id = `zone${i}`;
  zoneBoard.appendChild(zoneElement);
  //zoneElement.innerText = `zone${i}`;
}
//ゾーンを押したとき
const zones = document.querySelectorAll('.zones');
for (let i = 0; i < zones.length; i++) {
  const zone = zones[i]; // それぞれのzoneを変数に置く
  zone.addEventListener('click', () => {
    //カードもゾーンも押していた場合
    //すなわち、カード→ゾーンと押していた場合。ゾーン→カードと押していた場合は既に別の処理が完了してるので考えない。
    //ゾーンを置き換える。
    if (selectedCard !== null && selectedZone !== null) {
      selectedZone.zone.style.opacity = 0.35;
      selectedZone = null;
      selectedZone = {
        zone: zone
      };
      selectedZone.zone.style.opacity = 0.75;
    }
    //カードを押してゾーンを押していない場合
    //単純に追加する
    else if (selectedCard !== null && selectedZone === null) {
      selectedZone = {
        zone: zone
      };
      selectedZone.zone.style.opacity = 0.75;
    }
    //カードを押さずゾーンを押していた場合
    //無効。そもそもこの分岐にならない。ゾーンを置き換えるわけではない。
    else if (selectedCard === null && selectedZone !== null) {
      return;
    }
    //何も押していなかった場合
    //そこにあるカードを一覧表示する（無効にはしない）
    else if (selectedCard === null && selectedZone === null) {
      selectedZone = {
        zone: zone
      };
      const allObjects = document.querySelectorAll('*');
      const overlappingObjects = Array.from(allObjects).filter((aaa) => {
        const objectRect = aaa.getBoundingClientRect();
        const zoneRect = selectedZone.zone.getBoundingClientRect();
        return objectRect.top > zoneRect.top && objectRect.bottom < zoneRect.bottom && objectRect.left > zoneRect.left && objectRect.right < zoneRect.right;
      });
      if (overlappingObjects.length > 1) {
        const zoneRect = selectedZone.zone.getBoundingClientRect();
        const cardHeight = 127; // カードの高さ
        const cardWidth = 100; //カードの横幅
        const spacing = 10; // カード間のスペース
        const howManyCardsInOneRow = 7; // 1列の中で表示したいカードの数
        const howManyRows = Math.ceil(overlappingObjects.length / howManyCardsInOneRow); // 列の数
        let topOffset = zoneRect.top + 10; //微調整
        let leftOffset = zoneRect.left +22; //微調整
        let howManyCardsInOneRowCounter = 0;
        let howManyRowsCounter = 1;
        overlappingObjects.sort((first, second) => first.style.zIndex - second.style.zIndex) //overlappingObjects配列内のimgタグをzIndexが小さい順に並び替えておく
        //対象ゾーンが右側のときは一覧表示は左下方向に広がる
        if (zoneRect.left > 460) {
          overlappingObjects.forEach((bbb) => {
            bbb.style.position = 'absolute';
            bbb.style.left = `${leftOffset}px`;
            bbb.style.top = `${topOffset}px`;
            maxZIndex += 1;
            bbb.style.zIndex = maxZIndex; //重なっているカードを一覧表示するとき他のゾーンのカードより上に表示する
            splittedObjects.push(bbb);
            howManyCardsInOneRowCounter++;
            if (howManyCardsInOneRowCounter === howManyCardsInOneRow) {
              topOffset = zoneRect.top + spacing;
              leftOffset = zoneRect.left - cardWidth * howManyRowsCounter - spacing * 3; //守備表示のカードを横に並べるとき微調整
              howManyRowsCounter++;
              howManyCardsInOneRowCounter = 0;
            } else {
              topOffset = zoneRect.top + cardHeight * howManyCardsInOneRowCounter + spacing;
            }
          });
          //対象ゾーンが左側から一覧表示は右下方向に広がる
        } else {
          overlappingObjects.forEach((bbb) => {
            bbb.style.position = 'absolute';
            bbb.style.left = `${leftOffset}px`;
            bbb.style.top = `${topOffset}px`;
            maxZIndex += 1;
            bbb.style.zIndex = maxZIndex; //重なっているカードを一覧表示するとき他のゾーンのカードより上に表示する
            splittedObjects.push(bbb);
            howManyCardsInOneRowCounter++;
            if (howManyCardsInOneRowCounter === howManyCardsInOneRow) {
              topOffset = zoneRect.top + spacing;
              leftOffset = zoneRect.left + cardWidth * howManyRowsCounter + spacing * 3; //守備表示のカードを横に並べるとき微調整
              howManyRowsCounter++;
              howManyCardsInOneRowCounter = 0;
            } else {
              topOffset = zoneRect.top + cardHeight * howManyCardsInOneRowCounter + spacing;
            }
          });
        }
      } else {
        selectedZone = null;
      }
    }
  })
}
//カード移動＆発光（カード発動）
const actionMoveGlow = document.getElementById('actionMoveGlow');
actionMoveGlow.addEventListener('click', () => {
  if (selectedCard !== null && selectedZone !== null) {
    //音を鳴らす
    soundSummon.play();
    //ウィンドウ一番上に強制スクロール
    window.scrollTo(0, 0);
    // まずcardを非表示にする
    selectedCard.card.style.opacity = '0';
    // 位置関係を定義する
    selectedCard.card.style.position = 'absolute';
    selectedZone.zone.style.position = 'relative';
    // 非表示のまま動かす
    const zoneRect = selectedZone.zone.getBoundingClientRect();
    const zoneTop = zoneRect.top + 2;
    const zoneLeft = zoneRect.left + 22;
    selectedCard.card.style.top = `${zoneTop}px`;
    selectedCard.card.style.left = `${zoneLeft}px`;
    selectedCard.card.style.transition = 'top 0.8s ease-in-out, left 0.8s ease-in-out';
    maxZIndex += 1;
    selectedCard.card.style.zIndex = maxZIndex;
    setTimeout(() => {
      //音を鳴らす
      soundActivate.play();
      // 時間をおいてからcardを表示させる
      selectedCard.card.style.opacity = '1';
      selectedZone.zone.style.opacity = '0.35';
      selectedCard.card.src = selectedCard.originalImageUrl;
      // 光らせる
      selectedCard.card.classList.add('cardGlowAnimation');
      selectedCard.card.classList.remove('summonAnimation');
      selectedCard.card.addEventListener('animationend', () => {
        selectedCard.card.classList.remove('cardGlowAnimation');
        // カードを動かした後に現在の transform の値を取得する
        const currentTransform = selectedCard.card.style.transform;
        // ログに移動情報を追加
        const log = {
          actionType: 'moveAndGlowCard',
          cardId: selectedCard.card.id,
          zoneId: selectedZone.zone.id,
          zoneTop: zoneTop,
          zoneLeft: zoneLeft,
          zIndex: maxZIndex,
          cardImageUrl: selectedCard.originalImageUrl,
          animationTypeGlow: 'cardGlowAnimation',
          transform: currentTransform
        }
        logs.push(log);
        // ログの内容をテキストボックスに表示する
        const saveTextBox = document.getElementById('saveTextBox');
        const logText = JSON.stringify(logs, null, 2); // JSON形式に変換（2はインデントのスペース数）
        saveTextBox.value = logText;
        // 配列をリセットする
        selectedCard = null;
        selectedZone = null;
      }, {
        once: true
      });
    }, 500);
  }
});
//発光（効果発動）
const actionActivateEffect = document.getElementById('actionActivateEffect');
actionActivateEffect.addEventListener('click',
  () => {
    if (selectedCard !== null && selectedZone === null) {
      //音を鳴らす
      soundActivate.play();
      // まずcardを非表示にする
      //selectedCard.card.style.opacity = '0';
      // 位置関係を定義する
      //selectedCard.card.style.position = 'absolute';
      //selectedZone.zone.style.position = 'relative';
      // 非表示のまま動かす
      //const zoneRect = selectedZone.zone.getBoundingClientRect();
      //const zoneTop = zoneRect.top + 2;
      //const zoneLeft = zoneRect.left + 22;
      //selectedCard.card.style.top = `${zoneTop}px`;
      //selectedCard.card.style.left = `${zoneLeft}px`;
      //selectedCard.card.style.transition = 'top 0.8s ease-in-out, left 0.8s ease-in-out';
      maxZIndex += 1;
      selectedCard.card.style.zIndex = maxZIndex;
      setTimeout(() => {
        // 時間をおいてからcardを表示させる
        selectedCard.card.style.opacity = '1';
        //selectedZone.zone.style.opacity = '0.35';
        //selectedCard.card.src = selectedCard.originalImageUrl;
        // 光らせる
        selectedCard.card.classList.add('cardGlowAnimation');
        selectedCard.card.classList.remove('summonAnimation');
        selectedCard.card.addEventListener('animationend', () => {
          selectedCard.card.classList.remove('cardGlowAnimation');
          // カードを動かした後に現在の transform の値を取得する
          const currentTransform = selectedCard.card.style.transform;
          // ログに移動情報を追加
          const log = {
            actionType: 'glowCard',
            cardId: selectedCard.card.id,
            //zoneId: selectedZone.zone.id,
            //zoneTop: zoneTop,
            //zoneLeft: zoneLeft,
            zIndex: maxZIndex,
            //cardImageUrl: selectedCard.originalImageUrl,
            animationTypeGlow: 'cardGlowAnimation',
            transform: currentTransform
          }
          logs.push(log);
          // ログの内容をテキストボックスに表示する
          const saveTextBox = document.getElementById('saveTextBox');
          const logText = JSON.stringify(logs, null, 2); // JSON形式に変換（2はインデントのスペース数）
          saveTextBox.value = logText;
          // 配列をリセットする
          selectedCard = null;
          selectedZone = null;
        }, {
          once: true
        });
      }, 500);
    }
  });
//カード移動&ズーム
const actionMoveAndZoom = (imageUrl,
  rotation) => {
  if (selectedCard !== null && selectedZone !== null) {
    //音を鳴らす
    soundSummon.play();
    //ウィンドウ一番上に強制スクロール
    window.scrollTo(0, 0);
    // まずcardを非表示にする
    selectedCard.card.style.opacity = '0';
    //早めに向きを変えておく
    selectedCard.card.src = imageUrl;
    selectedCard.card.style.transform = `rotate(${rotation}deg)`;
    // 位置関係を定義する
    selectedCard.card.style.position = 'absolute';
    selectedZone.zone.style.position = 'relative';
    // 非表示のまま動かす
    const zoneRect = selectedZone.zone.getBoundingClientRect();
    const zoneTop = zoneRect.top + 2;
    const zoneLeft = zoneRect.left + 22;
    selectedCard.card.style.top = `${zoneTop}px`;
    selectedCard.card.style.left = `${zoneLeft}px`;
    selectedCard.card.style.transition = 'top 0.8s ease-in-out, left 0.8s ease-in-out';
    maxZIndex += 1;
    selectedCard.card.style.zIndex = maxZIndex;
    setTimeout(() => {
      // 時間をおいてからcardを表示させる
      selectedCard.card.style.opacity = '1';
      selectedZone.zone.style.opacity = '0.35';
      // 拡大表示させる
      selectedCard.card.classList.remove('summonAnimation');
      //void selectedCard.card.offsetWidth; // リフローを強制的にトリガーする
      selectedCard.card.classList.add('summonAnimation');
      // カードを動かした後に最新の transform の値を取得する
      const updatedTransform = selectedCard.card.style.transform;
      // ログに移動情報を追加
      const log = {
        actionType: 'moveAndZoomCard',
        cardId: selectedCard.card.id,
        zoneId: selectedZone.zone.id,
        zoneTop: zoneTop,
        zoneLeft: zoneLeft,
        zIndex: maxZIndex,
        cardImageUrl: selectedCard.card.src,
        animationTypeZoom: 'summonAnimation',
        transform: updatedTransform
      };
      logs.push(log);
      // ログの内容をテキストボックスに表示する
      const saveTextBox = document.getElementById('saveTextBox');
      const logText = JSON.stringify(logs, null, 2); // JSON形式に変換（2はインデントのスペース数）
      saveTextBox.value = logText;
      // 配列をリセットする
      selectedCard = null;
      selectedZone = null;
    },
      500);
  }
};
document.getElementById('action0FaceupZoom').addEventListener('click', () => {
  actionMoveAndZoom(selectedCard.originalImageUrl, 0);
});
document.getElementById('action90FaceupZoom').addEventListener('click', () => {
  actionMoveAndZoom(selectedCard.originalImageUrl, -90);
});
document.getElementById('action180FaceupZoom').addEventListener('click', () => {
  actionMoveAndZoom(selectedCard.originalImageUrl, 180);
});
document.getElementById('action0FacedownZoom').addEventListener('click', () => {
  actionMoveAndZoom(reversedCardUrl, 0);
});
document.getElementById('action90FacedownZoom').addEventListener('click', () => {
  actionMoveAndZoom(reversedCardUrl, -90);
});
document.getElementById('action180FacedownZoom').addEventListener('click', () => {
  actionMoveAndZoom(reversedCardUrl, 180);
});
//カード移動
const actionMove = (imageUrl, rotation) => {
  if (selectedCard !== null && selectedZone !== null) {
    //音を鳴らす
    soundMove.play();
    //ウィンドウ一番上に強制スクロール
    window.scrollTo(0, 0);
    // まずcardを非表示にする
    selectedCard.card.style.opacity = '0';
    //早めに向きを変えておく
    selectedCard.card.src = imageUrl;
    selectedCard.card.style.transform = `rotate(${rotation}deg)`;
    // 位置関係を定義する
    selectedCard.card.style.position = 'absolute';
    selectedZone.zone.style.position = 'relative';
    // 非表示のまま動かす
    const zoneRect = selectedZone.zone.getBoundingClientRect();
    const zoneTop = zoneRect.top + 2;
    const zoneLeft = zoneRect.left + 22;
    selectedCard.card.style.top = `${zoneTop}px`;
    selectedCard.card.style.left = `${zoneLeft}px`;
    selectedCard.card.style.transition = 'top 0.8s ease-in-out, left 0.8s ease-in-out';
    maxZIndex += 1;
    selectedCard.card.style.zIndex = maxZIndex;
    setTimeout(() => {
      // 時間をおいてからcardを表示させる
      selectedCard.card.style.opacity = '1';
      selectedZone.zone.style.opacity = '0.35';
      // カードを動かした後に最新の transform の値を取得する
      const updatedTransform = selectedCard.card.style.transform;
      // ログに移動情報を追加
      const log = {
        actionType: 'moveCard',
        cardId: selectedCard.card.id,
        zoneId: selectedZone.zone.id,
        zoneTop: zoneTop,
        zoneLeft: zoneLeft,
        zIndex: maxZIndex,
        cardImageUrl: selectedCard.card.src,
        transform: updatedTransform
      };
      logs.push(log);
      // ログの内容をテキストボックスに表示する
      const saveTextBox = document.getElementById('saveTextBox');
      const logText = JSON.stringify(logs, null, 2); // JSON形式に変換（2はインデントのスペース数）
      saveTextBox.value = logText;
      // 配列をリセットする
      selectedCard = null;
      selectedZone = null;
    },
      500);
  }
};
document.getElementById('action0FaceupMove').addEventListener('click', () => {
  actionMove(selectedCard.originalImageUrl, 0);
});
document.getElementById('action90FaceupMove').addEventListener('click', () => {
  actionMove(selectedCard.originalImageUrl, -90);
});
document.getElementById('action180FaceupMove').addEventListener('click', () => {
  actionMove(selectedCard.originalImageUrl, 180);
});
document.getElementById('action0FacedownMove').addEventListener('click', () => {
  actionMove(reversedCardUrl, 0);
});
document.getElementById('action90FacedownMove').addEventListener('click', () => {
  actionMove(reversedCardUrl, -90);
});
document.getElementById('action180FacedownMove').addEventListener('click', () => {
  actionMove(reversedCardUrl, 180);
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
  myInput.setSelectionRange(myInput.value.length,
    myInput.value.length);
});
const myLifePointSave = document.getElementById('myLifePointSave');
myLifePointSave.addEventListener('click', ()=> {
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
  const saveTextBox = document.getElementById('saveTextBox');
  const logText = JSON.stringify(logs,
    null,
    2); // JSON形式に変換（2はインデントのスペース数）
  saveTextBox.value = logText;
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
  opponentInput.setSelectionRange(opponentInput.value.length,
    opponentInput.value.length);
});
const opponentLifePointSave = document.getElementById('opponentLifePointSave');
opponentLifePointSave.addEventListener('click', ()=> {
  const opponentNewLifePoint = parseInt(document.getElementById('opponentNewLifePoint').value);
  opponentLifePoint = opponentNewLifePoint;
  opponentLifePointBox.innerHTML = opponentLifePoint;
  const log = {
    actionType: 'displayOpponentLifePoint',
    text: opponentLifePoint
  };
  logs.push(log);
  // ログの内容をテキストボックスに表示する
  const saveTextBox = document.getElementById('saveTextBox');
  const logText = JSON.stringify(logs,
    null,
    2); // JSON形式に変換（2はインデントのスペース数）
  saveTextBox.value = logText;
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
  const saveTextBox = document.getElementById('saveTextBox');
  const logText = JSON.stringify(logs,
    null,
    2); // JSON形式に変換（2はインデントのスペース数）
  saveTextBox.value = logText;
  // テキストエリアを空にする
  commentArea.value = '';
});
//操作ミスして修復したいとき
const undoButton = document.getElementById('undoButton');
undoButton.addEventListener('click', () => {
  soundUndo.play();
  if (logs[logs.length - 1].actionType === 'moveCard' || logs[logs.length - 1].actionType === 'moveAndZoomCard' || logs[logs.length - 1].actionType === 'moveAndGlowCard') {
    const lastCardId = logs[logs.length - 1].cardId;
    const filteredLogs = logs.filter(log => log.cardId === lastCardId);
    if (filteredLogs.length === 1) {
      window.scrollTo(0, 0);
      const undoZoneId = 'zone25'; // 実際のDOM要素のIDを指定する
      const undoZoneElement = document.getElementById(undoZoneId); // DOM要素を取得
      const undoZoneRect = undoZoneElement.getBoundingClientRect(); // DOM要素の位置を取得
      const undoZoneTop = undoZoneRect.top + 2;
      const undoZoneLeft = undoZoneRect.left + 22;
      //const undoZoneTop = '468.38775634765625';
      //const undoZoneTop = '477.5306091308594';
      //const undoZoneLeft = '447.13262939453125';
      //const undoZoneLeft = '469.1734619140625';
      maxZIndex += 1;
      const undoZIndex = maxZIndex;
      const undoCardImageUrl = filteredLogs[filteredLogs.length - 1].cardImageUrl;
      //const undoAnimationTypeZoom = filteredLogs[filteredLogs.length - 1].animationTypeZoom;
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
      },
        500);
    } else if (filteredLogs.length >= 2) {
      const undoZoneId = filteredLogs[filteredLogs.length - 2].zoneId;
      const undoZoneTop = filteredLogs[filteredLogs.length - 2].zoneTop;
      const undoZoneLeft = filteredLogs[filteredLogs.length - 2].zoneLeft;
      const undoZIndex = filteredLogs[filteredLogs.length - 2].zIndex;
      const undoCardImageUrl = filteredLogs[filteredLogs.length - 2].cardImageUrl;
      //const undoAnimationTypeZoom = filteredLogs[filteredLogs.length - 2].animationTypeZoom;
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
      },
        500);
    }
    //logs配列から最後の要素を削除
    logs.pop();
    // ログの内容をテキストボックスに表示する
    const saveTextBox = document.getElementById('saveTextBox');
    const logText = JSON.stringify(logs,
      null,
      2); // JSON形式に変換（2はインデントのスペース数）
    saveTextBox.value = logText;
  } else if (logs[logs.length - 1].actionType === 'glowCard') {
    // logs配列から最後の要素を削除
    logs.pop();
    // ログの内容をテキストボックスに表示する
    const saveTextBox = document.getElementById('saveTextBox');
    const logText = JSON.stringify(logs,
      null,
      2); // JSON形式に変換（2はインデントのスペース数）
    saveTextBox.value = logText;
  } else if (logs[logs.length - 1].actionType === 'saveComment') {
    // logs配列から最後の要素を削除
    logs.pop();
    // ログの内容をテキストボックスに表示する
    const saveTextBox = document.getElementById('saveTextBox');
    const logText = JSON.stringify(logs,
      null,
      2); // JSON形式に変換（2はインデントのスペース数）
    saveTextBox.value = logText;
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
    const saveTextBox = document.getElementById('saveTextBox');
    const logText = JSON.stringify(logs,
      null,
      2); // JSON形式に変換（2はインデントのスペース数）
    saveTextBox.value = logText;
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
    const saveTextBox = document.getElementById('saveTextBox');
    const logText = JSON.stringify(logs,
      null,
      2); // JSON形式に変換（2はインデントのスペース数）
    saveTextBox.value = logText;
  };
});
//ログをクリックすると自動コピーする
const saveTextBox = document.getElementById('saveTextBox');
saveTextBox.addEventListener('click',
  ()=> {
    saveTextBox.select();
    saveTextBox.setSelectionRange(0,
      99999); // モバイルデバイス用
    document.execCommand('copy');
  })
//リプレイを再生する
let logs = [];
const loadLogButton = document.getElementById('loadLogButton');
loadLogButton.addEventListener('click',
  () => {
    const loadTextBox = document.getElementById('loadTextBox');
    const logText = loadTextBox.value;
    // テキストを改行ごとに分割してログとして解釈し、配列に変換する
    logs = JSON.parse(logText);
    // アニメーションを再生する
    logs.forEach((log,
      index) => {
      setTimeout(() => {
        const {
          actionType,
          cardId,
          zoneId,
          zoneTop,
          zoneLeft,
          zIndex,
          cardImageUrl,
          animationTypeZoom,
          animationTypeGlow,
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
            replayedCard.classList.remove(animationTypeZoom);
            //void replayedCard.offsetWidth; // リフローを強制的にトリガーする
            replayedCard.classList.add(animationTypeZoom);
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
            replayedCard.classList.remove(animationTypeGlow);
            setTimeout(() => {
              //void replayedCard.offsetWidth;
              replayedCard.classList.add(animationTypeGlow);
            }, 10);
          }, 500);
        } else if (actionType === 'saveComment') {
          soundMessage.play();
          commentArea.value = '';
          const saveTextBox = document.getElementById('saveTextBox');
          commentArea.value = text;
        } else if (actionType === 'glowCard') {
          soundActivate.play();
          const replayedCard = document.getElementById(cardId);
          const replayedZone = document.getElementById(zoneId);
          replayedCard.classList.add('cards'); //アニメーション付けるためクラス付与
          // まずcardを非表示にする
          //replayedCard.style.opacity = '0';
          //早めに向きを変えておく
          //replayedCard.src = cardImageUrl;
          //replayedCard.style.transform = transform;
          // 位置関係を定義する
          //replayedCard.style.position = 'absolute';
          //replayedZone.style.position = 'relative';
          // 非表示のまま動かす
          //replayedCard.style.top = `${zoneTop}px`;
          //replayedCard.style.left = `${zoneLeft}px`;
          //replayedCard.style.transition = 'top 0.8s ease-in-out, left 0.8s ease-in-out';
          replayedCard.style.zIndex = zIndex;
          //setTimeout(() => {
          // 時間をおいてからcardを表示させる
          //replayedCard.style.opacity = '1';
          // 光らせる
          replayedCard.classList.remove(animationTypeGlow);
          setTimeout(() => {
            //void replayedCard.offsetWidth;
            replayedCard.classList.add(animationTypeGlow);
          }, 500);
          setTimeout(() => {
            replayedCard.style.opacity = '1'; //時間を空けるための無意味なテキスト。
          }, 1000);
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
      },
        index * 1100); // 秒ごとにアニメーションを再生する（適宜調整してください）
    })
  });