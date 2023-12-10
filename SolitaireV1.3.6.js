//APIキー
const apiKey = 'あ'; // ★APIキーを設定する
const searchEngineId = 'あ'; // ★検索エンジンIDを設定
//デフォルト背景などのカスタマイズ要素
const defaultProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1yk8LICiBA47bLzbx4B9GIgqb_b2ACfcfLQ&usqp=CAU';
const defaultBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOIniS7XLImZPYWtQWq9o4xQiAme6WXLHv1w&usqp=CAU';
//音声を再生する
const audioContext = new(window.AudioContext || window.webkitAudioContext)();
const soundUndoUrl = 'https://mirayugioh.github.io/yugiohTool/undo.wav';
const soundActivateUrl = 'https://mirayugioh.github.io/yugiohTool/activate.wav';
const soundSummonUrl = 'https://mirayugioh.github.io/yugiohTool/summon.wav';
const soundMoveUrl = 'https://mirayugioh.github.io/yugiohTool/move.wav';
const soundMessageUrl = 'https://mirayugioh.github.io/yugiohTool/chatmessage.wav';
let soundUndoBuffer = null;
let soundActivateBuffer = null;
let soundSummonBuffer = null;
let soundMoveBuffer = null;
let soundMessageBuffer = null;
async function preloadAudio(url) {
  try {
    const response = await fetch(url);
    const data = await response.arrayBuffer();
    const buffer = await audioContext.decodeAudioData(data);
    return buffer;
  } catch (error) {
    console.error('音声ファイルのプリロード中にエラーが発生しました: ', error);
    throw error;
  }
}
async function preload() {
  try {
    soundUndoBuffer = await preloadAudio(soundUndoUrl);
    soundActivateBuffer = await preloadAudio(soundActivateUrl);
    soundSummonBuffer = await preloadAudio(soundSummonUrl);
    soundMoveBuffer = await preloadAudio(soundMoveUrl);
    soundMessageBuffer = await preloadAudio(soundMessageUrl);
  } catch (error) {
    console.error('プリロード中にエラーが発生しました: ', error);
    throw error;
  }
}
preload();
const playSound = (buffer) => {
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
}
//グローバル変数
let maxZIndex = 0;
let reversedCardUrl = null;
let backgroundUrl = null;
//読み込み時、戻るボタンを無効化する
window.history.pushState(null, null, null);
window.addEventListener('popstate', () => {
  window.history.pushState(null, null, null);
  alert('誤操作防止のため、戻る機能は無効化されています。閉じるボタン等をご使用ください。');
  return;
});
//読み込み時、sessionStorageに保存されたカードの情報を取得して再表示
document.addEventListener('DOMContentLoaded', () => {
  for (let i = 0; i < sessionStorage.length; i++) {
    const cardKey = `card${i}`;
    const cardData = sessionStorage.getItem(cardKey);
    if (cardData) {
      const typeOrder = {
        no: 1,
        //normal通常モンスター
        ef: 2,
        //effect効果モンスター
        ri: 3,
        //ritual儀式モンスター
        pe: 4,
        //pendulumペンデュラムモンスター
        fu: 5,
        //fusion融合モンスター
        sy: 6,
        //synchroシンクロモンスター
        xy: 7,
        //xyzエクシーズモンスター
        li: 8,
        //linkリンクモンスター
        sp: 9,
        //spell魔法カード
        tr: 10,
        //trapトラップカード
        to: 11,
        //tokenトークン
        ot: 12,
        //otherその他。他の種類も追加可能
      };
      const imgElement = document.createElement('img');
      imgElement.classList.add('cards');
      const cardObject = JSON.parse(cardData);
      imgElement.id = cardObject.id;
      imgElement.dataset.src = cardObject.imageUrl;
      imgElement.src = cardObject.imageUrl;
      imgElement.dataset.type = cardObject.type; // data-type 属性を設定
      const sameImageUrlElement = cardBoard.querySelector(`img[data-src="${cardObject.imageUrl}"]`);
      if (sameImageUrlElement) {
        //同じカード画像がある場合
        cardBoard.insertBefore(imgElement, sameImageUrlElement);
      } else {
        const sameTypeElement = cardBoard.querySelector(`[data-type='${cardObject.type}']`);
        if (sameTypeElement) {
          //対象カードの種類が既にcardBoardに存在する場合
          cardBoard.insertBefore(imgElement, sameTypeElement);
        } else {
          //対象のカードの種類が存在しない場合
          const typeKeys = Object.keys(typeOrder);
          const currentIndex = typeKeys.indexOf(cardObject.type);
          const cardElements = cardBoard.querySelectorAll('.cards');
          // currentIndex よりも大きな値を持つカードの種類を抽出
          const nextTypeElements = Array.from(cardElements).filter(cardElement => typeOrder[cardElement.dataset.type] > currentIndex);
          if (nextTypeElements.length > 0) {
            //次の種類のカードがあれば、その中で一番若い種類のやつの直前に子要素として追加する
            const theSmallestElement = nextTypeElements.reduce((firstElement, secondElement) => typeOrder[secondElement.dataset.type] < typeOrder[firstElement.dataset.type] ? secondElement: firstElement, nextTypeElements[0]);
            cardBoard.insertBefore(imgElement, theSmallestElement);
          } else {
            //次の種類のカードがどこにもなければ、普通に一番最後に追加する
            cardBoard.appendChild(imgElement);
          }
        }
      }
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
  myMainDeck.classList.add('de/coratingCards');
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
  if (!confirmed) return;
  document.querySelectorAll('.cards').forEach(card => {
    card.style.opacity = 0;
  });
  const selectedOption = document.getElementById('themeSelect').value;
  const typeOrder = {
    no: 1,
    //normal通常モンスター
    ef: 2,
    //effect効果モンスター
    ri: 3,
    //ritual儀式モンスター
    pe: 4,
    //pendulumペンデュラムモンスター
    fu: 5,
    //fusion融合モンスター
    sy: 6,
    //synchroシンクロモンスター
    xy: 7,
    //xyzエクシーズモンスター
    li: 8,
    //linkリンクモンスター
    sp: 9,
    //spell魔法カード
    tr: 10,
    //trapトラップカード
    to: 11,
    //tokenトークン
    ot: 12,
    //otherその他。他の種類も追加可能
  };
  const createCardElement = (id, imageUrl, type) => {
    const imgElement = document.createElement('img');
    imgElement.classList.add('cards');
    imgElement.id = id;
    imgElement.dataset.src = imageUrl;
    imgElement.src = imageUrl;
    imgElement.dataset.type = type; // data-type 属性を設定
    imgElement.style.opacity = 0; //データ選択するとき一瞬カードが表示されると見栄え悪いので非表示
    const sameImageUrlElement = cardBoard.querySelector(`img[data-src="${imageUrl}"]`);
    if (sameImageUrlElement) {
      //同じカード画像がある場合
      cardBoard.insertBefore(imgElement, sameImageUrlElement);
    } else {
      const sameTypeElement = cardBoard.querySelector(`[data-type='${type}']`);
      if (sameTypeElement) {
        //対象カードの種類が既にcardBoardに存在する場合
        cardBoard.insertBefore(imgElement, sameTypeElement);
      } else {
        //対象のカードの種類が存在しない場合
        const typeKeys = Object.keys(typeOrder);
        const currentIndex = typeKeys.indexOf(type);
        const cardElements = cardBoard.querySelectorAll('.cards');
        // currentIndex よりも大きな値を持つカードの種類を抽出
        const nextTypeElements = Array.from(cardElements).filter(cardElement => typeOrder[cardElement.dataset.type] > currentIndex);
        if (nextTypeElements.length > 0) {
          //次の種類のカードがあれば、その中で一番若い種類のやつの直前に子要素として追加する
          const theSmallestElement = nextTypeElements.reduce((firstElement, secondElement) => typeOrder[secondElement.dataset.type] < typeOrder[firstElement.dataset.type] ? secondElement: firstElement, nextTypeElements[0]);
          cardBoard.insertBefore(imgElement, theSmallestElement);
        } else {
          //次の種類のカードがどこにもなければ、普通に一番最後に追加する
          cardBoard.appendChild(imgElement);
        }
      }
    }
    const cardData = {
      id,
      imageUrl,
      type,
    };
    sessionStorage.setItem(id, JSON.stringify(cardData));
  };
  switch (selectedOption) {
    //デフォルト
    case 'default':
      {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqlWe7M1SX9gH3aOkodpjy1ydBwqGMSyhhsQ&usqp=CAU', 'ef')
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6oP6EjWOK6J1vRjzHexMYTsdHEctLiNjsfA&usqp=CAU', 'tr');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAccTgRdl3hQ6t7QBR1KsQMoBGghxvtCjYvA&usqp=CAU', 'xy');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsnOFPVSjsskqFWp0OPjWYCDFxBhLs8h1ycg&usqp=CAU', 'sp');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1-KS0aT7evkr2Aa2_02B48WlQx4TCU74sPw&usqp=CAU', 'ef');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqlWe7M1SX9gH3aOkodpjy1ydBwqGMSyhhsQ&usqp=CAU', 'ef')
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1yk8LICiBA47bLzbx4B9GIgqb_b2ACfcfLQ&usqp=CAU';
        sessionStorage.setItem('selectedProtectorUrl', optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOIniS7XLImZPYWtQWq9o4xQiAme6WXLHv1w&usqp=CAU';
        sessionStorage.setItem('selectedBackgroundUrl', optionalBackgroundUrl);
        location.reload();
      }
      break;
    //宝玉獣
    case 'crystalBeast':
      {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREOLI2LF8QBH46LmZDVktNkAxL7yqprx0jAw&usqp=CAU', 'sp');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9Lm9N4N1ZaN_-FydSArjLbb2PLCSTPrm8nA&usqp=CAU', 'sp');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTca-TdfvXnKJzGn9mFuMkbrO0_TBDK8ZW4Ew&usqp=CAU', 'ef');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTca-TdfvXnKJzGn9mFuMkbrO0_TBDK8ZW4Ew&usqp=CAU', 'ef');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTca-TdfvXnKJzGn9mFuMkbrO0_TBDK8ZW4Ew&usqp=CAU', 'ef');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMu-LTrVKYfKfhFHzvDu9CjyevMPzuAD4_XA&usqp=CAU', 'ef');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMu-LTrVKYfKfhFHzvDu9CjyevMPzuAD4_XA&usqp=CAU', 'ef');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMu-LTrVKYfKfhFHzvDu9CjyevMPzuAD4_XA&usqp=CAU', 'ef');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcY-6zlXwF1lP5FbvgFUhztpJOP4X9mJt31Q&usqp=CAU', 'ef');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmRau_eflSLVb3Tc9d4TBIuBZKO_EmSwV-rA&usqp=CAU', 'ef');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3G-6zozLP6Thc9NcI5O9EvkU4IoF1_0k_Pg&usqp=CAU', 'ef');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQblRSbgo2g4ldUKv0Lx6spkSQHX0_6EaTklw&usqp=CAU', 'ef');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA6ZJW349SH2072EJ1DjXmipJkAWXvmX8bIw&usqp=CAU', 'ef');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROfe7Jhj2A5vyofIGisUY_vWSfE-U8v4ljnQ&usqp=CAU', 'ef');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXJnBTk1ASMVPRqydafqvxsDW63zkyoBdBUQ&usqp=CAU', 'ef');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXJnBTk1ASMVPRqydafqvxsDW63zkyoBdBUQ&usqp=CAU', 'ef');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXJnBTk1ASMVPRqydafqvxsDW63zkyoBdBUQ&usqp=CAU', 'ef');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtzmXmD73-a06zbmoxeyPWa_PrDsscQ_eHsg&usqp=CAU', 'sp');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCHh0eh9dae_jOZ9yWsLeT7ATlgdU3f42KHQ&usqp=CAU', 'sp');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxRkUa3aDnK1Q6LO7YLEtq07zXTm8bPtrptg&usqp=CAU', 'sp');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQILCZIXtUS_Xr47yD1WmbHPOnVCS2AnrX2IA&usqp=CAU', 'tr');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTyUTkuxy1bpstgzKNLflLMq_X3buYQYSPaw&usqp=CAU', 'sp');
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1csFJ7QWNz07V-p7vdqVzZSSBUYJXUnNY_Q&usqp=CAU', 'tr');
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRZ7wEMaQhrt2_2d9gBGyNZOl_YDGedKZw6w&usqp=CAU', 'tr');
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS613usrWcCHwuI_-NIY9NlerCZcBcFJaxvSg&usqp=CAU', 'pe');
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmx0_2TF4GW3WybCNBXqtOBQzC-DFULFuryA&usqp=CAU', 'pe');
        createCardElement('card27', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEjKylWSGQ6kWi4v0Kiljw1TWEIEF7_SFlcg&usqp=CAU', 'fu');
        createCardElement('card28', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRsWieE8Dl1Uok19zXIcIdI3_L7gxVsbzQRA&usqp=CAU', 'fu');
        createCardElement('card29', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlMDzIM81IqKmijSB2m-vTBIpxMTiVThTW5A&usqp=CAU', 'sp');
        createCardElement('card30', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaXQ4ybaEXqc6lyVebZeZoN0c5ytvMXElTyg&usqp=CAU', 'sp');
        createCardElement('card31', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSI9yznDvwMuIaE4T6ufNREtByTXLNGQutAmw&usqp=CAU', 'ef');
        createCardElement('card32', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtUWh9j-x0mjIHk1TsxN7u8Kq_E-jDDz34xQ&usqp=CAU', 'ef');
        createCardElement('card33', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgoGAesVdVHYwS5JSrlkSWELvERzrQjDm7Ow&usqp=CAU', 'ef');
        createCardElement('card34', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9_l0OvIGzEEh2oQARfp7e00vWII0L028Tqw&usqp=CAU', 'ef');
        createCardElement('card35', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfJ71ehxemVKt56H3ZVWnsgFLsZGOXPneCxQ&usqp=CAU', 'ef');
        createCardElement('card36', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTqY_wPrJ6DTEA1qZ81wWY7MtVfRebPxEltQ&usqp=CAU', 'ef');
        createCardElement('card37', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS191v4SJDK9rIFfTvjc2XuMg6ZoV48PZgEiA&usqp=CAU', 'ef');
        createCardElement('card38', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrriw7wbql7FtHmgxTDkyTMqwv4FEtn6O2rQ&usqp=CAU', 'sp');
        createCardElement('card39', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt-o4QKn1E1rQNPYIl4FdojucMPzzOTXZlKA&usqp=CAU', 'ef');
        createCardElement('card40', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAfSVW9T9Os2cQ3toBOZNZI1cXU8kkJC395A&usqp=CAU', 'sp')
        createCardElement('card41', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUAyv7EbvEuDBwr86wlX3wT2uFVSw4T1VB7Q&usqp=CAU', 'ef')
        createCardElement('card42', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1y8hbQBryD5TqyTapHmZr0oxA034LwQ0FFA&usqp=CAU', 'ef')
        createCardElement('card43', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEjGkbCDdCKORe07hjs_MLoJwf6BSkUM2wVA&usqp=CAU', 'li')
        createCardElement('card44', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdHd5CcJxxMxLi80kCar-exNFTewQRqhm4sA&usqp=CAU', 'xy')
        createCardElement('card45', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbVdkFSaWX7iXf4jq-imDJvjlPyIpUcMDz3Q&usqp=CAU', 'li')
        createCardElement('card46', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEBE7f7LeaWcUlphT06kEKcqBwukh_JZ8fiA&usqp=CAU', 'sp')
        createCardElement('card47', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUYdhUkOLjgu0sssKflHzMjA3lNvD81-wvXw&usqp=CAU', 'ef')
        createCardElement('card48', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS613usrWcCHwuI_-NIY9NlerCZcBcFJaxvSg&usqp=CAU', 'pe')
        createCardElement('card49', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS613usrWcCHwuI_-NIY9NlerCZcBcFJaxvSg&usqp=CAU', 'pe')
        createCardElement('card50', 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSpXHCPvS859DZWed7cStYmzAW1TcT2a3_3fYzeqJ7PSysoN3WH6mG6LsM3q2lL-I5WzJ9lv7eQpnweWEKxl5fkBSkhE7T1ex_2yY_5CKMp&usqp=CAE', 'pe')
        createCardElement('card51', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzeE_Ilm7MWelP_OUNDiuZ_ty3qIQ0kHInyw&usqp=CAU', 'li')
        createCardElement('card52', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4vgfdffFPzkcwoTxGt90G2X7_BhEGLswpLg&usqp=CAU', 'li')
        createCardElement('card53', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCXHj8CsTSyeR2joXJzeJSfdE3IJc_DPaR2w&usqp=CAU', 'li')
        createCardElement('card54', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDEhAFKFwOl5KgbmSbcEx4WM8YLI0jhYPaeg&usqp=CAU', 'li')
        createCardElement('card55', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfWf0m_oEt-dtEWD5WLUVZ6uF98JXLBpImvA&usqp=CAU', 'li')
        createCardElement('card56', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh832vtlVxpbbVs-orrg5bcelUSuoz84XcFA&usqp=CAU', 'li')
        const optionalProtectorUrl = 'https://t0.gstatic.com/images?q=tbn:ANd9GcQsMGc1z7H18J2YOfvb7g-8ClSEigxXdiwNk_TtwPZ-FiP8PfK6';
        sessionStorage.setItem('selectedProtectorUrl', optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://ms.yugipedia.com//b/b6/RainbowBridge-MADU-EN-VG-artwork.png';
        sessionStorage.setItem('selectedBackgroundUrl', optionalBackgroundUrl);
        location.reload();
      }
      break;
    //焔聖騎士・イグナイト
    case 'infernobleIgKnight':
      {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUAyv7EbvEuDBwr86wlX3wT2uFVSw4T1VB7Q&usqp=CAU', 'ef');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwSgUDzMziBRR6GpR5buUHnXUnbJWE54ZDXQ&usqp=CAU', 'ef');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmLZL0DVzKcQZ_N4apaulm4yquvwh76LiXoA&usqp=CAU', 'ef');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEXO7GZJtYo0MPk8NIBh_hO4_QIe9Gr1zwWA&usqp=CAU', 'sy');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQS3nPJPO4wL8IuV3XQosNztQslfXehxI6IQ&usqp=CAU', 'ef');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKf-gZEpqqJjHZSn3tRDDnK2XHtPgQOvwHDQ&usqp=CAU', 'ef');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJTnQW-AgUPGa-tHVuIGS0nBquNs7qDn4E1A&usqp=CAU', 'sy');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmtZANpe3ZUCoSMWFCYJ3G2aO8_GDQqyZM-w&usqp=CAU', 'ef');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPNORIoEhWGBh1BuQkJaiXSANkOHhHcxYynQ&usqp=CAU', 'ef');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ2ZoadwSVZ8JpICH499kZMus8KsU2g6mJkw&usqp=CAU', 'sy');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROoSrr02GO36qtVam6-TAQMCjbHt3jZ3ec_A&usqp=CAU', 'sp');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV3az-1TrnmJvWrEljfd-jAlPF0DmKwfjmcw&usqp=CAU', 'sp');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn3cB8Jd4bGYmqm3mF22ivoA3vG8eO7nx-Vw&usqp=CAU', 'sp');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHP_YyWYTLu03PnTMzZT7Sfnvs6h_NJAIOaA&usqp=CAU', 'li');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv3ZU_C3hdiYWCkNy2wlKS9CuEecMHAnE1mw&usqp=CAU', 'sp');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu_Ao1_o_2GZvn8dm1qYmIu_GGkBHBGpdhlA&usqp=CAU', 'sp');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv3ZU_C3hdiYWCkNy2wlKS9CuEecMHAnE1mw&usqp=CAU', 'sp');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv3ZU_C3hdiYWCkNy2wlKS9CuEecMHAnE1mw&usqp=CAU', 'sp');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4jyAe3ygkWcvQ-dOh7JxkHUGPbaDKjeR1dg&usqp=CAU', 'ef');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2nhvVhRzidw_yQrfu-WojwW-1B6HycIjYCg&usqp=CAU', 'ef');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7NzYagSBCUwqJnPPq_k-3yxlRItHU8Hn5hA&usqp=CAU', 'li');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDk9V56B_3mGQHg8PeFPIi4mI8guo9eE0UmA&usqp=CAU', 'ef');
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWp4HTXXCtGOrlDWRSotc89q4df3LLI-yuQQ&usqp=CAU', 'sp');
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy4OK6TS-Kp9OZ8X8dXZpEBtKgnwj3auU_PQ&usqp=CAU', 'sy');
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6axGKQY4xZMaLggswEucRNdTMoDB-ewq8ww&usqp=CAU', 'ef');
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR405qiyYFyAZmRb8Q_SklouE6FdIXMfYnzqg&usqp=CAU', 'ef');
        createCardElement('card27', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKFM2CMWRtiKLUQf2KuoIvDLfjCAkdh92XXg&usqp=CAU', 'pe');
        createCardElement('card28', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKFM2CMWRtiKLUQf2KuoIvDLfjCAkdh92XXg&usqp=CAU', 'pe');
        createCardElement('card29', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQhDaaFtrQxSEAUq_aiZgatVk_BQ6PBdNSDA&usqp=CAU', 'pe');
        createCardElement('card30', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQhDaaFtrQxSEAUq_aiZgatVk_BQ6PBdNSDA&usqp=CAU', 'pe');
        createCardElement('card31', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGAKmHVNumCCUjFGuFZ9Vp6T4__aD2h7jJaw&usqp=CAU', 'ef');
        createCardElement('card32', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl8j5ir99iFN9bEkkQogQvQWm1S_ANfNYyRQ&usqp=CAU', 'sp');
        createCardElement('card33', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLe_QoU9GjFdHON-5pl4EFuXZLM1EJXWPvhg&usqp=CAU', 'ef');
        createCardElement('card34', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhKbpgp8Lq2MPdVcHal3Pd3wmmLXY88NXxZQ&usqp=CAU', 'pe');
        createCardElement('card35', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpli-ME4SSk0iJ0SB91ExTn1FMePh-75n16w&usqp=CAU', 'pe');
        createCardElement('card36', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUCK65OU51VMXztipdMObmwQflGYBVuo-Hfw&usqp=CAU', 'ef');
        createCardElement('card37', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYqBep56dY0GdiX7Tt2z6faqEIeS-gljXOHg&usqp=CAU', 'sp');
        createCardElement('card38', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpDsvcKM9TpbEwCaYa63bCftWbi5JsHeNZzg&usqp=CAU', 'sy');
        createCardElement('card39', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHP_YyWYTLu03PnTMzZT7Sfnvs6h_NJAIOaA&usqp=CAU', 'li');
        createCardElement('card40', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4GpKPy4KuVycr6-44Vo9C-4zn7JIgf1Cqvg&usqp=CAU', 'ef');
        createCardElement('card41', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnKG6feGY15vCQGDCln6sBmXKW0ErW55ZctQ&usqp=CAU', 'xy');
        createCardElement('card42', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAAToxZp9lCAOmA3D1CouNjhCiRBwqhINxsA&usqp=CAU', 'xy');
        createCardElement('card43', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEXO7GZJtYo0MPk8NIBh_hO4_QIe9Gr1zwWA&usqp=CAU', 'sy');
        createCardElement('card44', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJJPrcfGLJ-DEe74qKmmKuXY1n97N30hpWvQ&usqp=CAU', 'ef');
        createCardElement('card45', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlUQEmSHK7cJVsLWleNF4p-badTmQVhyu_0Q&usqp=CAU', 'sp');
        createCardElement('card46', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR405qiyYFyAZmRb8Q_SklouE6FdIXMfYnzqg&usqp=CAU', 'ef');
        createCardElement('card47', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk9NWsR3-9YZT8igyCRP25BXstryHoGyeWHw&usqp=CAU', 'ef');
        createCardElement('card48', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyq9ryu2ffezOzR7KaA_M-cvX6aH9PtLIIDw&usqp=CAU', 'sy');
        createCardElement('card49', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVawGbubhW1Up0FLYLJzeGiGmIek2PHTDS3Q&usqp=CAU', 'sy');
        createCardElement('card50', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWpK_kVdDrylPl98nwaz1KevWUo81NA_ooZQ&usqp=CAU', 'sp');
        createCardElement('card51', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_4gtiBDpRCMMXLOVqdvPAgPDyGEZye3h_TQ&usqp=CAU', 'sp');
        createCardElement('card52', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp_hF_8EapL8ZYYYIYX1nKfjGe9v8aAsImeg&usqp=CAU', 'ri');
        createCardElement('card53', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFhdu1R9uz_28NfpsmsR4XrfnClrPFwDL2qg&usqp=CAU', 'ef');
        createCardElement('card54', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy0EEKcUyXCS3dxz1XJ_uNrnlQpPNP_WEHHw&usqp=CAU', 'sp');
        createCardElement('card55', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdLbisXwOomc5Gps6j1ObfQFSWNvG62-JCsA&usqp=CAU', 'sp');
        createCardElement('card56', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrknW_8qDdak19QHluPnDA2nK0yMEG-DxRwA&usqp=CAU', 'li');
        createCardElement('card57', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOFmhGIEs53B5T2LVELh54bDAJhrQSCfqKVg&usqp=CAU', 'pe');
        createCardElement('card58', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5RShFLUpGekhxkfUMF0zZGz2j3qxhEdD2Cg&usqp=CAU', 'sy');
        createCardElement('card59', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbVIVS3mmHmuQztj4sn-1TSCbJY3IyMFGBQw&usqp=CAU', 'ef');
        createCardElement('card60', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuuxgT3ip-mCd7yafORe1OS35IFQ4DffPwQA&usqp=CAU', 'ef');
        createCardElement('card61', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPc5D0QAaCkEP9fvvMFcvd6ph45qSeK4a4gQ&usqp=CAU', 'li');
        createCardElement('card62', 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRm-OLRdq-I8z7TL4C2rHP8hcGN8fMaGr5lGYsJEyOand4Rw_vdAPOfBJtWNN7oL7X7J8BWwSfFSzgk8m9cZGGpw4k-E5Wm_X2i-yNqBuU&usqp=CAE', 'ef');
        createCardElement('card63', 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQClQEri1MUWygAL0ErmFOvP6Z5kNL5opfgUxGRQId5mKmkF1oTNnxui8FUZ5XV2sQwa4Vu7H64Vr7CzXsvGQET8r3Lpzt-FzhdFusIvas&usqp=CAE', 'sp');
        createCardElement('card64', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSPzW6Hz0bO20EMBmmC94tMVvK5bsXpAVsGA&usqp=CAU', 'sy');
        createCardElement('card65', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfg8gzxCkRo5zLMpVODVglzRl90lDDYV2f-g&usqp=CAU', 'sy');
        createCardElement('card66', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnu_4UQmtEH5I63ACjMeoPZXiBXiBqyStrkg&usqp=CAU', 'sp');
        createCardElement('card67', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnu_4UQmtEH5I63ACjMeoPZXiBXiBqyStrkg&usqp=CAU', 'sp');
        createCardElement('card68', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2L-KkZV7ded9u7NrAj1bQV3rv28-XyyqGAw&usqp=CAU', 'sy');
        createCardElement('card69', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4ujCpPSgq_yAmQ98stR067qTuq_ik4Qi8EA&usqp=CAU', 'li');
        createCardElement('card70', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzy_9qgFGiqMw1YCu1gF6qjQAaFYpOC444HA&usqp=CAU', 'li');
        createCardElement('card71', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ_hoocd2L-o6WfU0XoqSHKQzk53P52LrBJQ&usqp=CAU', 'sy');
        createCardElement('card72', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjsufzk7_e8VUweutorLlWqNMYifn_7LHbWw&usqp=CAU', 'sy');
        createCardElement('card73', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5V3MS4uctUuqdMxxQpQrGDdXh5BTRWH_Llw&usqp=CAU', 'pe');
        createCardElement('card74', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5V3MS4uctUuqdMxxQpQrGDdXh5BTRWH_Llw&usqp=CAU', 'pe');
        createCardElement('card75', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYnX8i7pHdVPW-YmeVtzWVdoLfU5l_RqPpNA&usqp=CAU', 'pe');
        createCardElement('card76', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYnX8i7pHdVPW-YmeVtzWVdoLfU5l_RqPpNA&usqp=CAU', 'pe');
        createCardElement('card77', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTesgBCJpyyK2REPJkukhQFLCyumVYXvzmCmQ&usqp=CAU', 'li');
        createCardElement('card78', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmEmBgyq4S172SgbEe0MROHiSlPpT5NqtjHQ&usqp=CAU', 'xy');
        createCardElement('card79', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsA69YIC31RRt-eqORH5zlNMcp51XVZHMVbA&usqp=CAU', 'li');
        createCardElement('card80', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXymeXEhomCZhkxWBrTzkZTQ19WqCE1_1IrQ&usqp=CAU', 'sp');
        createCardElement('card81', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc62YSyeVVgp5PibUMxd0NT31oVKuhKdzF2Q&usqp=CAU', 'sp');
        createCardElement('card82', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY7Pgqk_1v-Iag5pqvel5tD2c-PKfflkKQbA&usqp=CAU', 'sp');
        createCardElement('card83', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRq8cC77wM6SRvhdGKr5bU2LFryI6oU5HimoQ&usqp=CAU', 'sp');
        createCardElement('card84', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRq8cC77wM6SRvhdGKr5bU2LFryI6oU5HimoQ&usqp=CAU', 'sp');
        createCardElement('card85', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRq8cC77wM6SRvhdGKr5bU2LFryI6oU5HimoQ&usqp=CAU', 'sp');
        createCardElement('card86', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ2kVbYDtEUkUjsxgE2JjHyAHzzDgbs4Q1PA&usqp=CAU', 'sp');
        createCardElement('card87', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzeBw4-aFV3VgeCxamLrbh51lcPh0Nm1uc0g&usqp=CAU', 'ef');
        createCardElement('card88', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8eJoiZ2yrj7ivkraCFwHoVBpErjI1yuA-gQ&usqp=CAU', 'ef');
        createCardElement('card89', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHSof4_22f1NoZqQpKzVd6iR4VOrQxuNqgGA&usqp=CAU', 'ef');
        createCardElement('card90', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXymeXEhomCZhkxWBrTzkZTQ19WqCE1_1IrQ&usqp=CAU', 'sp');
        createCardElement('card91', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXymeXEhomCZhkxWBrTzkZTQ19WqCE1_1IrQ&usqp=CAU', 'sp');
        //const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdXjeG-XiJ_1TIZubcmgQQc6D0MldMzEEbIA&usqp=CAU'; //黄スリーブ
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgHzRQa_zODX9IhJs1ClrXEEtcYOuuu_3bLQ&usqp=CAU'; //赤スリーブ
        sessionStorage.setItem('selectedProtectorUrl', optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwGzpkDNsEhc1v_R4zbUz94a_XhpyfVJc0og&usqp=CAU'; //騎士背景
        //const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcr_na5IEbpzcIN-FyJQLXluF6fyaOzh2nWQ&usqp=CAU'; //イグナイトリロード
        //const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3ovo5u-za4s5ML-sXfzmFknpMl5tjCaXSaQ&usqp=CAU'; //炎背景
        sessionStorage.setItem('selectedBackgroundUrl', optionalBackgroundUrl);
        location.reload();
      }
      break;
    //スパイラル
    case 'spyral':
      {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkuE5L5eZWTYwe78pUJBR6VK28OREmV-sq-w&usqp=CAU', 'ef');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4OPcYYD46FT49JL3S3yBeEV8vcEYrd-Po4g&usqp=CAU', 'ef');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCsCVxNiXz3TNdcf-lGb6AdIaDWTdI5jmhEA&usqp=CAU', 'ef');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyq5_wqX_cV7R2dnFj8-1GAVKZPaJsc9MoDg&usqp=CAU', 'tr');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuD7BA1zxr79po7b_t0sxbjR6WQl_WQx_Bmg&usqp=CAU', 'li');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7fJkdEFojDYc9IJj-YpCCp5dGMjG50LB2Uw&usqp=CAU', 'ef');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0h9pcSeKHVoHbTQ3LCsSGnv1ap4GDO3gMDQ&usqp=CAU', 'ef');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlzNVafU36dFf-j6xKfZXQ788PHKLNS9uk9A&usqp=CAU', 'sp');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAYcc4u2-R72m1EXKvTt7CgCDv2nA7MrPYfw&usqp=CAU', 'ef');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp2AV3vQgNylVrUezR5yCOpMZsYAiQspZ6RA&usqp=CAU', 'ef');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMijeIUQ6Tck8Y4QICYj_WGmS-gL6hyFS46A&usqp=CAU', 'sp');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS40S45IfVBT5a9NkDAhimpGeU0XXdYjxUZwQ&usqp=CAU', 'sp');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpqFU8jONg7tC42q-0IBtDx-jvr0RXTJQNbA&usqp=CAU', 'tr');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL56sSOPqA31oUEO0ihFzuDMhLONg0UIBIDw&usqp=CAU', 'tr');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd1liSP9Ik4x9XFDPLGdCjD5WpvDr9o6qMFQ&usqp=CAU', 'ef');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT06rjzWzckAE9tBwBUz_Lk7wLiAWqp_6hmYA&usqp=CAU', 'ef');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpqFU8jONg7tC42q-0IBtDx-jvr0RXTJQNbA&usqp=CAU', 'tr');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL56sSOPqA31oUEO0ihFzuDMhLONg0UIBIDw&usqp=CAU', 'tr');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4QPqncAYvtGtv7jwwD2mC7l8eNPhQrcMSTQ&usqp=CAU', 'ef');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3jgxsMGgX69v4rBrVl44q-nyNfGFUELnGwQ&usqp=CAU', 'ri');
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmFJIJ2gvQrUcjVCbPqcQ46fEhuUa5tSaW1Q&usqp=CAU';
        sessionStorage.setItem('selectedProtectorUrl', optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ265lmcrktgrrfueZOIh1w36c8omKELbZGQ&usqp=CAU';
        sessionStorage.setItem('selectedBackgroundUrl', optionalBackgroundUrl);
        location.reload();
      }
      break;
    //月光
    case 'lunaLight':
      {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4iSlfL3M8HJKJnPO6qJ_4_87nJEtiunpudA&usqp=CAU', 'fu');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_5sAsdrgV7_clj5_RriW06r2je8tKDMWNxw&usqp=CAU', 'ef');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqrOFhvnHTzA2FmHGFRrZ8PAgv9CMZfdnNtw&usqp=CAU', 'ef');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQejXYM35WjmkC_k8eLOvC7nXlcSYWfzQUYgw&usqp=CAU', 'ef');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3DVhbcuMXM-iWmzLqgba2FTqxYp84DdoTgg&usqp=CAU', 'ef');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1oash8Fab6QlGPGHPTUMWg0_41X2VhA13sA&usqp=CAU', 'sp');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCrE2GlNWLmWasgNEAQPhZRG1zOqquMXwkRw&usqp=CAU', 'fu');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF-OuUyDt4QICHkB4Ft_Wg1qjiCLIOwBpxaA&usqp=CAU', 'fu');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ03M_6yTRkqrKqwYwnMkL_3HmN69JkxXtZag&usqp=CAU', 'fu');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY9-uGfgp-t6J5HWc2KvpdrlNqqNETcaQ02A&usqp=CAU', 'ef');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4KTUaa7z76lRTTTjQPHgCFC8MlQhivFEauQ&usqp=CAU', 'tr');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5P6_azS3ALlAqZXcVMz4wBS8Q__i8tRK7zQ&usqp=CAU', 'tr');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEifbljFX7Zm_97lRM_9RVCaV-zHv8FX-aPw&usqp=CAU', 'sp');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgjY9Alcw9uLuxkKr4xQL0N8aL1iuuPvY_Lg&usqp=CAU', 'ef');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKHO-lGAE1y4Og7P5M40fhXuAklK6ze8mx1Q&usqp=CAU', 'pe');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG38grFPpCfmvxvi08k8C4aX4PT25kYL9DCw&usqp=CAU', 'ef');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSfTqLPG9SJFuimfOIHPPl2YdcCeh8vBEdZw&usqp=CAU', 'ef');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSfTqLPG9SJFuimfOIHPPl2YdcCeh8vBEdZw&usqp=CAU', 'ef');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSfTqLPG9SJFuimfOIHPPl2YdcCeh8vBEdZw&usqp=CAU', 'ef');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR95aEZeu-yM3gRtTrZKl9qTdRz6ZjhTEr1ow&usqp=CAU', 'pe');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR95aEZeu-yM3gRtTrZKl9qTdRz6ZjhTEr1ow&usqp=CAU', 'pe');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR95aEZeu-yM3gRtTrZKl9qTdRz6ZjhTEr1ow&usqp=CAU', 'pe');
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR-aYGLL6YDBAS5TxGGiAW5S30L5o06fvHvw&usqp=CAU', 'ef');
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrAwcgv3_bYLDUVeLChFHBLDWkdjeRcIwoNQ&usqp=CAU', 'ef');
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuReISh0Fv99uF6VMP0teV7DwWC8pkG8zaZQ&usqp=CAU', 'xy');
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYLEfl3iMGo7Kmv65wP_IHimIqmYuNPf3h8w&usqp=CAU', 'ef');
        createCardElement('card27', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSZUmRfEQzzr8MM8pZL7Jg808KcSV67Rsv_A&usqp=CAU', 'li');
        createCardElement('card28', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_IAgFAo3F8Lp1P5dSfUCyCR_rR387wNI9YQ&usqp=CAU', 'sp');
        createCardElement('card29', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA_GXsFas04ZGnpJV6zSicBKcSxq8OzxoPqg&usqp=CAU', 'sp');
        createCardElement('card30', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1M9PlhoCNGCF1puRKjR9LJHuOZZTGdpfGBQ&usqp=CAU', 'ef');
        createCardElement('card31', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeSE_SDro9QMWWHnjSVP7DJdJJljUI9fEA3A&usqp=CAU', 'ef');
        createCardElement('card32', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR-aYGLL6YDBAS5TxGGiAW5S30L5o06fvHvw&usqp=CAU', 'ef');
        createCardElement('card33', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtDBIrVxTcFaORxMUMc_ZWYP4eUOJgZxNg9Q&usqp=CAU', 'sp');
        createCardElement('card34', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_-9ev6urGh-Hp7rdKGCj7SzedloUl_c7ZzA&usqp=CAU', 'ef');
        createCardElement('card35', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuReISh0Fv99uF6VMP0teV7DwWC8pkG8zaZQ&usqp=CAU', 'xy');
        createCardElement('card36', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQItaX5BY8kqqZtd6X8yk0Hr9FavveWuyMnIA&usqp=CAU', 'xy');
        createCardElement('card37', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqvRiCC-Mj4ybAF0zf-h6hetcJSUPkmUvwNw&usqp=CAU', 'xy');
        createCardElement('card38', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx7MBkkgWiNCXlMVYTL2Ni_lT-j5xyTXUA7A&usqp=CAU', 'li');
        createCardElement('card39', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdsQgTRxHWbMItHJbfvL-uY_a3kogV-v5CCQ&usqp=CAU', 'li');
        createCardElement('card40', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMkyyYjZjJOU4gAxCxZlMH9w8ISUkIi3CWIg&usqp=CAU', 'xy');
        createCardElement('card41', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrntknGA5KZypORHWWQsdD3hVaPr-4bP8TTw&usqp=CAU', 'ef');
        createCardElement('card42', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjtr0WKTr9XK8nndtlau7XVvhEVa3S5WZ-MA&usqp=CAU', 'li');
        createCardElement('card43', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1Sai5R6BPumX_s6TWZxFkp9v7S2evkHhWIQ&usqp=CAU', 'tr');
        createCardElement('card44', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTR6ba-BwUijYu3z-jYBAUnm-Gka_xbeJaIg&usqp=CAU', 'ef');
        createCardElement('card45', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU_ir1DwHBNazGrVSZyRFikI5L9oBny2GQCA&usqp=CAU', 'ef');
        createCardElement('card46', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdR--uBeGrLMIq3BFYRhRnc8s5CA5SEvXQNQ&usqp=CAU', 'ef');
        createCardElement('card47', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDi8s9fdagYo8adT91URu7qm35t4NkHtNx3A&usqp=CAU', 'ef');
        createCardElement('card48', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpa_Js8jdV8aIHWyuilwpXpvFGne8kd-HNPA&usqp=CAU', 'xy');
        createCardElement('card49', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpa_Js8jdV8aIHWyuilwpXpvFGne8kd-HNPA&usqp=CAU', 'xy');
        createCardElement('card50', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1jZOWeRsCyzqruMjuyELi2wwKnjNJmu9g6w&usqp=CAU', 'xy');
        createCardElement('card51', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgI_J5tnZfhiK0fY1KBi2Huf3j8YgjCzvpBw&usqp=CAU', 'xy');
        createCardElement('card52', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJo4S1twk1C7O6bl2JWOEtCt33ErLise6pNg&usqp=CAU', 'sp');
        createCardElement('card53', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQejXYM35WjmkC_k8eLOvC7nXlcSYWfzQUYgw&usqp=CAU', 'ef');
        createCardElement('card54', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL7baPWhU7rtAJvaW8NXx2OqqnAvHL_1r2Uw&usqp=CAU', 'sp');
        createCardElement('card55', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5OR2FNTqRu1odcBfkEC3tv_79ZWwKXYHznA&usqp=CAU', 'xy');
        createCardElement('card56', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr2Pdkw8DfkHK8IRWn0WNKBuKfJ8WDz7G4iw&usqp=CAU', 'xy');
        createCardElement('card57', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYGKwmF4F8Mt-QLG-YSzjS-Zw1rbeH-_q_Fg&usqp=CAU', 'xy');
        createCardElement('card58', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSobGcnFeUNGJ8CUD3C1i7RUM9H6HjAe47VwQ&usqp=CAU', 'xy');
        createCardElement('card59', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmCVRjXyEpK9OlBJzxTta-rbfzK3c9TJEzgQ&usqp=CAU', 'ef');
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAfLYAT-XU3vb8GKwf3nNRNm_AbwIlwZ1ymA&usqp=CAU';
        sessionStorage.setItem('selectedProtectorUrl', optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi2pXLoS2guM3gYAkN1lav7G320wcZdkierg&usqp=CAU';
        sessionStorage.setItem('selectedBackgroundUrl', optionalBackgroundUrl);
        location.reload();
      }
      break;
    //六武衆
    case 'sixSamurai':
      {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRldUAO6y86OytXzSPlmOofP7RaC8ncn42t_Q&usqp=CAU', 'sy');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrXnGBmCxZC4RUI5Q5xsYEi2Rw1Ikbo5q60g&usqp=CAU', 'fu');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU-H_X3FDQQ9yy_5zpCVqsNREiTUYazY9qJg&usqp=CAU', 'xy');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg5UO4mMrUEfVG7bWU-64vV3yEXhnQl4AjEw&usqp=CAU', 'ef');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCDqfzeFY3hSrASxvz8lbbNY48s8JLyv_2Kw&usqp=CAU', 'sp');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT738xDah_2AGqaD4xhbF7cUXdCvk29MONEMA&usqp=CAU', 'ef');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3aPwzPsr-COoLW5Uqj9uJcKEGX11BAjvs2A&usqp=CAU', 'ef');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgxA8m2Eo74mPub3ipcoeimm0fL3L8RxIPpg&usqp=CAU', 'li');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm7FrJBe2ulMYNMKcMDj0XEfxihXUdHLEa9Q&usqp=CAU', 'ef');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm7FrJBe2ulMYNMKcMDj0XEfxihXUdHLEa9Q&usqp=CAU', 'ef');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm7FrJBe2ulMYNMKcMDj0XEfxihXUdHLEa9Q&usqp=CAU', 'ef');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLhtvqjIiVS2mE_aW3sU042fFhFd8ISxwt1w&usqp=CAU', 'sp');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSebRQZ5yNWj79mkZV6KwKzU1E91qeBWvXLYw&usqp=CAU', 'sp');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVwZ_v9W0l-Td7j8K8dwxiPEl6Ft1xfojdpA&usqp=CAU', 'xy');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWNTtZsDWibz6i7w4TP_4mIOterebrxom9NA&usqp=CAU', 'xy');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWNTtZsDWibz6i7w4TP_4mIOterebrxom9NA&usqp=CAU', 'xy');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgxA8m2Eo74mPub3ipcoeimm0fL3L8RxIPpg&usqp=CAU', 'li');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK2sBSwQ3oL_X08t8q4KFHBdbydmV_s81VZQ&usqp=CAU', 'li');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1ZgAxkjwNI7kHD2z1_8sY46wZDe-bJFbFAw&usqp=CAU', 'fu');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSugvlWcVPPZrJA4hVBSkyqCAtDFB9wkQyJ-g&usqp=CAU', 'xy');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzryUmVjpfhkyKUBdeUGk599mnlIyCwPug0A&usqp=CAU', 'xy');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEjGkbCDdCKORe07hjs_MLoJwf6BSkUM2wVA&usqp=CAU', 'li');
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCiTpdf1XOhlTAsZMvljXiWZUerkO8rJQvOA&usqp=CAU', 'xy');
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrkLfRbFJQiIuVbOPMg81Ak3m8yG5zHZsGSQ&usqp=CAU', 'ef');
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTQR2ki5238S-htTuCn-WaoPNHCImdgMHyrw&usqp=CAU';
        sessionStorage.setItem('selectedProtectorUrl', optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI-SrSvNGNCuA_4vsscBd_Uvg0NnwATqqleQ&usqp=CAU';
        sessionStorage.setItem('selectedBackgroundUrl', optionalBackgroundUrl);
        location.reload();
      }
      break;
    //ふわんだりぃず
    case 'Floowandereeze':
      {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR41F5q53Qw45OjKHMQJh8mm8FhlXfAZMpNg&usqp=CAU', 'ef')
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5kARfkO-DXYxaDF26veX7uBPHvIPyKjZdFQ&usqp=CAU', 'ef');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWdpeVa7R-cgBSDTjJYrdoLEWI1ATPJ-H6DA&usqp=CAU', 'ef');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFkDAGIH5VPa-jbE8HrJjg0QjEnqX7WVEIWQ&usqp=CAU', 'tr');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkVo6pTaa3R6Dk7s3Rxikyv-w8pJgKNHrgjw&usqp=CAU', 'ef');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNKd7hYe8TvQsM7FKYN4iIs7cZoBK3Ub_KEw&usqp=CAU', 'sp');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTgjvAFY9dtfefCIqVa6i3ui2hb9KT9GXr3A&usqp=CAU', 'ef');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmMu3THpYEr89zusCOboKnB--GEVXRRQaF6g&usqp=CAU', 'tr');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmU32ZMdx1RoCAvRmA4jIaejxSfUCyu_qSxw&usqp=CAU', 'sp');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS19XtJz3gh0UWvfZ-4TiS4TKU20gB3Tvth1g&usqp=CAU', 'ef');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcdO9XNds071uMg9rSb4l-RbPLQrWVSAuRvA&usqp=CAU', 'ef');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHLH39x2rasl3P83khxO0bMzZaUfFky05wrQ&usqp=CAU', 'sp');
        const optionalProtectorUrl = 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTruJlnQ0-e-QRW0FeaNWgpGnJC_nE0DD89vm_qnmYEWK9xg5Um&usqp=CAc';
        sessionStorage.setItem('selectedProtectorUrl', optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://pbs.twimg.com/media/FOeCzcRVkAYXX4Z.jpg';
        sessionStorage.setItem('selectedBackgroundUrl', optionalBackgroundUrl);
        location.reload();
      }
      break;
    //魔界劇団
    case 'abyssActor':
      {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjZbrG8OIF1pc6H9DhYPpjrVGJrLrtP5BCwA&usqp=CAU', 'pe');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGzYKZr7gJ2ioVbUThJ_h_Xm2y7MK5pP5sUw&usqp=CAU', 'pe');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq1EsSV6ZgrzwzHg1eu1OWF8q5INpfV_6vaw&usqp=CAU', 'pe');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqWGRBoaORCtcit_QTElBAqQIzQOOigoc02A&usqp=CAU', 'pe');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNnCrNVhK2zlT0Q9pD5TT2ULwPMPfqWO0nWw&usqp=CAU', 'li');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxtkC9qlMCvFYFfBVM5lT2T4loHiZHcgGDzA&usqp=CAU', 'pe');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLsr7GCY_hRNRMbAa0qVONv1XNaZRSKlQQ8Q&usqp=CAU', 'tr');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ417E7hcnNBY2Po1CrxwGpVQhxew06TieGdg&usqp=CAU', 'tr');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh1__1vz971Z44gwJQK6Oc9hlDu4FNXV0J6w&usqp=CAU', 'pe');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5OoUREo5cIbvNOiKfieOxsH3e6ESTZPw5JQ&usqp=CAU', 'pe');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgKLAd9csjoqTqvN8EnvhflOD531Sd-Bq4VQ&usqp=CAU', 'pe');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDLEe_YFcgmtETdng3G26-qa73f4FXp0lb_Q&usqp=CAU', 'pe');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReQhZGaZo2TGNoMxREDMmmrb3YR44hgEb5qg&usqp=CAU', 'sp');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKLEKWfRH9GXp-VpoLAyN0ZPo2igz7N2IFlA&usqp=CAU', 'li');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxqnqYPRxr2szOcBI1KFlAgX6JimvDfPUa_g&usqp=CAU', 'pe');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVqUd087-HCYGYz9ROChvJVW_YaEjvZT4jNA&usqp=CAU', 'pe');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRGq_7SBpDGT_wsMuEABsdI72WBf7JAr0u4w&usqp=CAU', 'sp');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWC3lzrzlWasI0WBgU2vPeoiNVt-VyahqS_g&usqp=CAU', 'sp');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYHV3f_Zj4x6g7ZvO8JnhznXweGw1gzbh3Bg&usqp=CAU', 'sp');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjnuquSG5qIuMGuIt3Nq_68hU0J6BDPqujCQ&usqp=CAU', 'sp');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHfRaarsMmVUm8-b2LHvJrp_TeZoyHSmTC3A&usqp=CAU', 'sp');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAKaIrh716BDE-PlvlxqN8nKG4ZHHpzfQqBA&usqp=CAU', 'sp');
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtVsaXSqYAtPbGUF0eGyGk6iplJxUYjFPktg&usqp=CAU', 'sp');
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA8YLzex51-rtUFPMPXfHPtNi1nnzMcMW8vw&usqp=CAU', 'pe');
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4MMYYHhA4yI57O8b_0xwAEeoB3s8KvI4AqQ&usqp=CAU', 'sp');
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4M1H26Jsvyc9WEt0ALPzFeXeQNEyuhYNbyQ&usqp=CAU', 'pe');
        createCardElement('card27', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiN0SDmQ_FbleRsEmArXedEGqbuiCt81uBJQ&usqp=CAU', 'sp');
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0U4ZxzGvPCTmJHxzBL0zenmhJBMJwgzMviw&usqp=CAU';
        sessionStorage.setItem('selectedProtectorUrl', optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVgJwLghTXcQrmcOWEb6maoIvZcsF7aQJQTQ&usqp=CAU';
        sessionStorage.setItem('selectedBackgroundUrl', optionalBackgroundUrl);
        location.reload();
      }
      break;
    //ジャックナイツ
    case 'mekkKnight':
      {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFcwlMeC6orwlTEQoRiEDqsmOtHXrxe8KvVw&usqp=CAU', 'ef');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT468e2FwcFesr2nDWZtXqNYd5S23VfdCAv7A&usqp=CAU', 'ef');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3wUzlaVHR3re2oYmJp9gKEboUpiGo2zx0wA&usqp=CAU', 'ef');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_K-3GzlhGtQ96wlnUNt7HnwMtQqkfHLgckA&usqp=CAU', 'sp');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmi3k_EotzQl9a2xDMGMYvpNStEU7B1utmbA&usqp=CAU', 'sp');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlG7VQPDJ9-ORK6uNXAAMrkgik4Li74VpCwg&usqp=CAU', 'sp');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHHbuaLhy3cMoMzrxtLAqiSjtVQJ0XKzGiSw&usqp=CAU', 'sp');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToX9LZKoacPChjKBLFbxp-UdYlzvJroblTLQ&usqp=CAU', 'sp');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZBAUauaoN-bjD8ZYBR7TRxg5ivJEKdHj-8g&usqp=CAU', 'sp');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGyVniegqRIRvuXyCvVNm-PG4S7y5eJ4RZvg&usqp=CAU', 'li');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzIkHUdhDvEIhcjCTgFFtujhGwZTdlkXWQPQ&usqp=CAU', 'ot');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzIkHUdhDvEIhcjCTgFFtujhGwZTdlkXWQPQ&usqp=CAU', 'ot');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA_v24Mglw1s2QP3KLbzuWBumtFUlVdutOiw&usqp=CAU', 'ef');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm-jyX20MAkyn7wDxFEGAvF9QlIMAsDj5k4g&usqp=CAU', 'ef');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQilFD9I3c7ViMj3tNMEpq6pZ9lYGd3XRCg1w&usqp=CAU', 'ef');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQo_ksKJDXHlwTik4Ua4OvWjI9EUlnIqh5VNw&usqp=CAU', 'ef');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0VpoKyvz7pD-VLqWCCKoorF50jm7NMyYcvw&usqp=CAU', 'no');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZM2yTRff5USRRcb113Uu8H2lXpaFw0O1XkQ&usqp=CAU', 'li');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt01npp-EIegxgtpyBSEFnu77W0cRY-c0d9Q&usqp=CAU', 'ef');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ2DJ7BeSRymIViIGSL833yzwdpfkQzbaawg&usqp=CAU', 'li');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ2DJ7BeSRymIViIGSL833yzwdpfkQzbaawg&usqp=CAU', 'li');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSog8JIYLfrUB-pfsJuPrk-ENvgF01VyYLF5Q&usqp=CAU', 'li');
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3BLkpcB6fh6CtHZtIlgzo34sHHLsDM4zTew&usqp=CAU', 'ef');
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVddN5LCz-aSqOp0FzFZrG6DVhL970He7rVQ&usqp=CAU', 'ef');
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqH--iDdAkzw3EphvEM_cH9lrso7bErm2VbQ&usqp=CAU', 'tr');
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ-Vamo4Mo7zmoHkAoC36mX1DS12IihqwXnQ&usqp=CAU', 'sp');
        createCardElement('card27', 'https://img07.shop-pro.jp/PA01339/386/product/147980144.jpg?cmsp_timestamp=20200216063626', 'ef');
        createCardElement('card28', 'https://img07.shop-pro.jp/PA01339/386/product/147980144.jpg?cmsp_timestamp=20200216063626', 'ef');
        createCardElement('card29', 'https://img07.shop-pro.jp/PA01339/386/product/147980144.jpg?cmsp_timestamp=20200216063626', 'ef');
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL2Scrj3-JFWB8QIMH_xdmMTbzAsS29e4uRA&usqp=CAU';
        sessionStorage.setItem('selectedProtectorUrl', optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhBqFTdE3uAv-ACpLeVZccvmz5vxL3g5y9lg&usqp=CAU';
        sessionStorage.setItem('selectedBackgroundUrl', optionalBackgroundUrl);
        location.reload();
      }
      break;
    //マリンセス
    case 'Marincess':
      {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRin79-Tgn9uoI7hOqWoemQ6h_f3Vh5T7sgVw&usqp=CAU', 'sp');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5sL0yEyrdBDG1yHIs3rjYJ-iETDyIRAt-Qg&usqp=CAU', 'tr');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAjAIEwKvt_HHV9eE0ZTJErl1El0UELPilBw&usqp=CAU', 'ef');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw-kHJnh-5PclheALddc9ic1RRCkakpqmGgA&usqp=CAU', 'li');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTM-E5OyQ_J5aWVkBKLytr3b8Ax1weuKyKbg&usqp=CAU', 'ef');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQvY8mGn8ogqtY9KiRALfRAo5IlpK1M118ig&usqp=CAU', 'tr');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPxAXu4X0GwUwLHYtyhP-M5BuB1O7N2_Mw1g&usqp=CAU', 'tr');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTv2hZT2J3hB0PBrB5vTWD6IvnRlSZlXbjgw&usqp=CAU', 'li');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStGz1iawh5SYXgw1u8QY7jLZ2QB4V8gl10MQ&usqp=CAU', 'tr');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuiAMBv9TcCahoFUgQwqM20N8sy_FZ8MrXNw&usqp=CAU', 'sp');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCBL0Mzkc4wkCHtIjPeDZ4SsLYyStH82kl9Q&usqp=CAU', 'li');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3REVgabDKUFQw3_J8CoH-rkLfTWyjrHcy4w&usqp=CAU', 'ef');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUsMPtO1_HXebQ3UNfpdF_4KZnQfSq90MXgw&usqp=CAU', 'li');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFEVs23tTUkK_NJCJ67kp7jxX5b8Ebnambcw&usqp=CAU', 'tr');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMkTYwjK7kFRhTc67b_pg6voY-T8OR6ChQOA&usqp=CAU', 'ef');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUcNC2ZVLSWMiGNxUCX6A84MHFCpyJraJ9MQ&usqp=CAU', 'ef');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8SPhrkbEZqQHQwhAuZxjqbsaVt4vVv0ZZ3g&usqp=CAU', 'li');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDs0x_ildPtH__1fhIuacvrJLuJwjXjHTSjA&usqp=CAU', 'li');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlgY700_7YcgKpIKBGK48TwbxTVDCyfWmhOA&usqp=CAU', 'li');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7UkLorGs1qkGr5_5Ads9PR-4ICg0mRLLxAQ&usqp=CAU', 'ef');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAOWKgPJ3JOxgelTWOqH7NiLz0MtA7NT-RUA&usqp=CAU', 'ef');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDc8LoWK1VSFOuXCXH6Go-eqCuIL4ivs8MIw&usqp=CAU', 'tr');
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLKcgPU1hNus5si3RxfUUtJ13XIJy3iuBsvw&usqp=CAU', 'li');
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6oAqAPjvJDsNPjb8fevQqKLvjnfjOBRI3gg&usqp=CAU', 'li');
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEsBqwlRDiqSNVB7JpR61oTDWvKdgBt4ewlw&usqp=CAU', 'ef');
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd-owG1WpdYkU_8lILoTYiYgj-fEIgSzXTsA&usqp=CAU', 'ef');
        createCardElement('card27', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTljzpia5V4sG7fWNlSNFAj3PXBDo7g2vwWhA&usqp=CAU', 'sp');
        createCardElement('card28', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT43FNC4KHb0IeS-8QsA6kSJeDXV0SdUnLNDA&usqp=CAU', 'li');
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQBspoRMh-9tJ7PgXJ7V-8Nh5Xjm35kiZ2-w&usqp=CAU';
        sessionStorage.setItem('selectedProtectorUrl', optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://ms.yugipedia.com//d/d9/MarincessDive-MADU-EN-VG-artwork.png';
        sessionStorage.setItem('selectedBackgroundUrl', optionalBackgroundUrl);
        location.reload();
      }
      break;
    //ヴァレット
    case 'rokket':
      {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyVvL4v3zkPIYfdHT13xR2BO2-ZOdPhS9O5g&usqp=CAU', 'li');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLlXUL8fjUP1Z1CWYe73faO1q5v0jFt5m3zw&usqp=CAU', 'li');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAKBttNU9t3oTIDqBAjcPYT56NxkTGJg9Ydg&usqp=CAU', 'sp');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9UgTBGKVdL4olflAyzGSOuJCEzAQ-oRwpKQ&usqp=CAU', 'tr');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIShNEv_DLrwFUA4OuOegwOnwk64L6fX2QqQ&usqp=CAU', 'sp');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbC4eqSNIsPT7uh3YpGJMTtgmamTBsg0g-6Q&usqp=CAU', 'xy');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJyD2S2_3SsMI13k6DYM5p9Omr3sMqZL1d7w&usqp=CAU', 'li');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH5hjG9k62PYM1ipvbTBjFsFJMqnh0NxQbvw&usqp=CAU', 'sp');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQaWs5VQ04SjwGsSwQHS6o1VuBcI_e7UPE8g&usqp=CAU', 'sp');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiTF14cDktKNiLrkBnardlo6MbpVNHQJeowA&usqp=CAU', 'tr');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSiQ5A0rnm08MpIR5OxXMKWeil5_9V93JjSg&usqp=CAU', 'tr');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0_36ee9IjSruk6rUcRJGKYrO0xv-Jp9IEJg&usqp=CAU', 'ef');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXnLFvlAx_rPfkWdHAQuD7c-e8eGEqIEpdWA&usqp=CAU', 'li');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu1bUBVrePmGIIwBXDVS6Msh58hooyvrK8WQ&usqp=CAU', 'sp');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQTT593vSL4up6NgkCzUjtKOUw6dy3J-ysKg&usqp=CAU', 'ri');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu-gt2dL5Q7rGTqeJAmXfgFBHpWpB8BYbCow&usqp=CAU', 'sp');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3WYf5MQGBVBb6TQnsw-KE-fCCiJZPQDDXew&usqp=CAU', 'ef');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWnMV9hjI5_mMaLbOsUTa5MozmPixf-j8eTg&usqp=CAU', 'sp');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDMpmJbkNr4ydLMLZulEP_dVyYZQC32wAbMQ&usqp=CAU', 'sp');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6oVKAj_f2pK7sHtGpW7A_9tf9c6wMnX77xA&usqp=CAU', 'ef');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4O6RKYzaT4A9qeOZssrqX9-_SGO_iH11cTw&usqp=CAU', 'ef');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJNQU5o5AC2ve_Asum0ptoalNwYFOMifJLzw&usqp=CAU', 'ef');
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRHkHOSxmV4BKZL4EjKWR6DQmCHIGxCvHTuA&usqp=CAU', 'ef');
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ53GD2uEqy_GSofCbeY9_26CaSiYSHc7A2w&usqp=CAU', 'ef');
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVTkAk633H51wY6mglSpxHgG0w4XJAZflXjw&usqp=CAU', 'ef');
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxasivhx7dH08PW49SiwZs3OsyvQ-WdEg7fg&usqp=CAU', 'ef');
        createCardElement('card27', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj5TNZZsTmOtpczZOdyWmYpDnw-0GCUB4JRQ&usqp=CAU', 'ef');
        createCardElement('card28', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_9Kb3V43jjGcIbuG76D9yi64NQ38xRqP9Zw&usqp=CAU', 'ef');
        createCardElement('card29', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStpgSB3ZA09BbKx-n_oe9YYBwJeWg1-doCjQ&usqp=CAU', 'li');
        createCardElement('card30', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPKi_s1jBFm0PNa5csyHAKjMQOH4xy80jXRQ&usqp=CAU', 'fu');
        createCardElement('card31', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6AIyvZXpEaEQx2ANvS-XxZMcKOpAU49Rt6g&usqp=CAU', 'li');
        createCardElement('card32', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR65ZKxm84dESeH_OBhHemok44MwjasFaSjw&usqp=CAU', 'sy');
        createCardElement('card33', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSseyOZ4dNAbUSF03LbEU87rhTgWTeGC-Q-NA&usqp=CAU', 'li');
        createCardElement('card34', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH7y-5-Lma1kPHX-1O8jrkpVcSNRYIPR9OJg&usqp=CAU', 'li');
        createCardElement('card35', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9Sux6jEAxm2TL5MR_jxjTaxqX7UKvkTSwgA&usqp=CAU', 'li');
        createCardElement('card36', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQILAcdU7sgOzu_Jo0jQVHR3Pu1t2LPvrc18A&usqp=CAU', 'sp');
        createCardElement('card37', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXa2XeID634NASHtUVy7TGMlfLo99uF5xm-Q&usqp=CAU', 'li');
        createCardElement('card38', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiRchCOQhMwkejiNl1MhAJ-e6MJX1NKG4S9w&usqp=CAU', 'li');
        createCardElement('card39', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStvPCKZGv4bZGiMn4FzYXn9G6OmJwOqV2rWw&usqp=CAU', 'li');
        createCardElement('card40', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyX2kC8rnTmvbnEk6fxjdYmiuvG3VbZ3igCg&usqp=CAU', 'li');
        createCardElement('card41', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ3AZFGba6fnIOWkvhQGAdAqR7uF6EpN4z0g&usqp=CAU', 'li');
        createCardElement('card42', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm1PXxI2J3E0xT17K_fOpCAcUbZ-rVpU_ehg&usqp=CAU', 'ef');
        createCardElement('card43', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlCTRp_VCAmPa4TlZgYCLc2wQdFJ6yB6PHQ&usqp=CAU', 'ef');
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsPCJTQu6F-3nkNz8ik_9wXNcrcsPKtDq38Q&usqp=CAU';
        sessionStorage.setItem('selectedProtectorUrl', optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDfb2n0AmzLnLFcXeHfrhL1Nt1qB6WytoLXA&usqp=CAU';
        sessionStorage.setItem('selectedBackgroundUrl', optionalBackgroundUrl);
        location.reload();
      }
      break;
    //魔術師
    case 'magician':
      {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRovzwdDC6zS3sLWAgJoG83rJMTGWpKfMwV_w&usqp=CAU', 'tr');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXkWoJwMtIKrKO7K2jbL2RNCXwVJp0Un809w&usqp=CAU', 'li');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShLHE_B4eZfu_VkdkPRTY_RRemVcTefCVXdw&usqp=CAU', 'pe');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsWdKcFcaTr5ltANa_5En83UrG6OLO4ufsyw&usqp=CAU', 'pe');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHUymFcAiI9-uqHmYwppSW-p_-mLW2SaAxpQ&usqp=CAU', 'pe');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_cP8VYwKOvj6jPHd5uuMZZrHY2JgoNtEyKw&usqp=CAU', 'pe');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfmKL9b-_MDE6WMwzajExGXeeWVLpREEGetw&usqp=CAU', 'pe');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT4ns9btJ7M-v7jh5hSD0IC0oXCpFKhpqE6Q&usqp=CAU', 'pe');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX8p6BxrOSEr2gupWLYcTPIy2zTMv1LzX_3Q&usqp=CAU', 'pe');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTFmZXDQloArFiO5A6Fy3h1RpMW-c4UaxkUQ&usqp=CAU', 'pe');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmL2DfrMa-lmxiQtodY8sIInh8HP33_h4F3Q&usqp=CAU', 'pe');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyWoCS33u8cIZvcYXfrzHz8Jh161gKHfYFsQ&usqp=CAU', 'li');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAa20Sqz0qN8OJ3EjKBm3jnX4U9pkTCVuSoQ&usqp=CAU', 'pe');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKPpAeQZyTO2lX1vRjlI3rEk546Dd8fsB89A&usqp=CAU', 'pe');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-bQQSvaZ5AR3QBGqg-u9QvxA75j8qRl4vwg&usqp=CAU', 'li');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOFmhGIEs53B5T2LVELh54bDAJhrQSCfqKVg&usqp=CAU', 'pe');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzc4at9WpqBR-ydvJS8_fZ9vz0Rff0JGwHuA&usqp=CAU', 'pe');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZPjm8NgYycmRudEWniCHNda64Y2p3EfMR-g&usqp=CAU', 'pe');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTcJd3O2L0IRG2JT6X07zUvO9_a7wSmT7IGA&usqp=CAU', 'pe');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV--Lr-SkayvMkC2ZQeNPeSHgRkU9Mbwe5zw&usqp=CAU', 'fu');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJCaVXABjoLf9muT_F2r7RAQGVMoxuAsjVNw&usqp=CAU', 'xy');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFH4RIbdAEyU96ebRtdXdB4uIWMyVXGs9qrA&usqp=CAU', 'ri');
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkHhQsC83TkPsDHNH8lSjIb2daL-rIzJcoSQ&usqp=CAU', 'pe');
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKTEuOGHjNycGoCfS1Iq_d2slIG4wi96yXcQ&usqp=CAU', 'sy');
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEJ9fptPLhLWYoAVlp5JNbK0eNO2wacapFVw&usqp=CAU', 'pe');
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHgIjUaxHscaL3o-EwJJoCKt9ec4ZqNar7Yw&usqp=CAU', 'pe');
        createCardElement('card27', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSe-UT-YEhdMwkIIdkMa7Tmhyln2APjMqD7A&usqp=CAU', 'pe');
        createCardElement('card28', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLatGeXhSczp228Qkn1C7kcQWnvsg1Y3q06g&usqp=CAU', 'pe');
        createCardElement('card29', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDQcO3EbKduHjBLC0ERNM8Abld2EfQK8b6-w&usqp=CAU', 'pe');
        createCardElement('card30', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi2xvbGK0LQ4SS9llc_BEanbrA39YzppcBbg&usqp=CAU', 'pe');
        createCardElement('card31', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2DQPOMC75d6mHolGjNi_SYWP1E1cJhWb5TQ&usqp=CAU', 'pe');
        createCardElement('card32', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxCpKg9FPTFKY0rI4BX4LpWSziC1S3qezCUQ&usqp=CAU', 'pe');
        createCardElement('card33', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtJqOt59yZyw_UghqKstP5lUFNNVcnGExptQ&usqp=CAU', 'pe');
        createCardElement('card34', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaT_NA2iGo4gxtp7YmELy3Rdlx2vBkHxMa2A&usqp=CAU', 'sp');
        createCardElement('card35', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzTI8bccQ5QJ7u8kBzvmHhUSjlpAnEqQxBog&usqp=CAU', 'pe');
        createCardElement('card36', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhCxUIl0o4ojXRe5hVu2zqfjn4ZvdbciSlQw&usqp=CAU', 'pe');
        createCardElement('card37', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDIuNIdQ9Wsw1q0XeHxmwQuC7g2nb9KLabBg&usqp=CAU', 'fu');
        createCardElement('card38', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW6ikRD5_thNMtil82riiM6JqNbASNi7NEWNtVIjfpDel0ouY6v58GMZ0&s=10', 'pe');
        createCardElement('card39', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNbsfYLHp9XfTIz6ZW7Q4S7EqDtAOh72D0FCYiNJVumFLdoXbquXnu7fc&s=10', 'sp');
        createCardElement('card40', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWW6asnQNleKTBxxGWYM_oZN4_0Fp10SJQkg&usqp=CAU', 'tr');
        createCardElement('card41', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCr8WnVFhkepdyn7QZ4-_Fge0wHIrKjfT2ng&usqp=CAU', 'pe');
        createCardElement('card42', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuW8QoqYzgXh_ZcPXKE1D3bTLBEV-W3VlsCA&usqp=CAU', 'li');
        createCardElement('card43', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW6ikRD5_thNMtil82riiM6JqNbASNi7NEWNtVIjfpDel0ouY6v58GMZ0&s=10', 'pe');
        createCardElement('card44', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW6ikRD5_thNMtil82riiM6JqNbASNi7NEWNtVIjfpDel0ouY6v58GMZ0&s=10', 'pe');
        createCardElement('card45', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDIuNIdQ9Wsw1q0XeHxmwQuC7g2nb9KLabBg&usqp=CAU', 'fu');
        createCardElement('card46', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDIuNIdQ9Wsw1q0XeHxmwQuC7g2nb9KLabBg&usqp=CAU', 'fu');
        createCardElement('card47', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlvh1ynDsiwmNl2bz4_aMVRL7lo2MtSdzQnQ&usqp=CAU', 'pe');
        createCardElement('card48', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBKlfttC8jFgKuguzxl1vnch6nMM9p3og1Qw&usqp=CAU', 'sy');
        createCardElement('card49', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGOLd1kwRZRnynqb9rN26KypIrz_0AeSyvdg&usqp=CAU', 'sp');
        createCardElement('card50', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStrGGAnacJX-xii_aZgsSipZa2DUHpImxbDQ&usqp=CAU', 'fu');
        createCardElement('card51', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKegv-NvkFDHmVLLET6pDunS6bRrzh3VSF4w&usqp=CAU', 'pe');
        createCardElement('card52', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3fG5BzrMgrLGeE3p-miL3K2_BJG7p03aTbw&usqp=CAU', 'sp');
        createCardElement('card53', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWuWVA3SmiFjsMsVXtaiHyjdHLXQwHo1PkEw&usqp=CAU', 'pe');
        createCardElement('card54', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToy2l-YB6WLtgM8IGnq_40nz8qtJnCYk-BQw&usqp=CAU', 'pe');
        createCardElement('card55', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhCxUIl0o4ojXRe5hVu2zqfjn4ZvdbciSlQw&usqp=CAU', 'pe');
        createCardElement('card56', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOQCDDBqcvgtN1zv-O0VT9tBLh_x7yy8qayg&usqp=CAU', 'li');
        createCardElement('card57', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1Y6JFseL-w1aPfQhN9TolKeKEMji2gbLsOA&usqp=CAU', 'li');
        createCardElement('card58', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1jDx6IFOgXh9Wwhxg9fIOX_CXF8HgVB-QSw&usqp=CAU', 'li');
        createCardElement('card59', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfNM8EJ679dJAqpHDO9xQfcL_JNXquw98GAw&usqp=CAU', 'ef');
        createCardElement('card60', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIsgWo-0U5OLs6KiR_tW8z6Z5gLI0FbTAQNg&usqp=CAU', 'xy');
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXKsq-_fYqKJoxkJBYLhDcpEwp-Bmj-cBPKw&usqp=CAU';
        sessionStorage.setItem('selectedProtectorUrl', optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTSQjzHYf2QcEbTz4upRywI9Iasy15FBLMjIEGRkv4cym5g3jd1';
        sessionStorage.setItem('selectedBackgroundUrl', optionalBackgroundUrl);
        location.reload();
      }
      break;
    //転生炎獣
    case 'Salamangreat':
      {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1SEYqBnc_IQJ2LxBVdFuLAn7SvJHak_BnIg&usqp=CAU', 'ef');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfz5fxeBkK_GDOrN0XxNbfvqbNvEzoVYylzw&usqp=CAU', 'li');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFH7m8tsasB05nCENhJSxRDJ1Yf-6a4BiW9A&usqp=CAU', 'sy');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8WywFHT2rT2AKj1hQLwsT-iGDwXXqgieMMg&usqp=CAU', 'sp');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_Orekh0MZx-vOaM-sRs34fQ9GQokBLKtAGg&usqp=CAU', 'xy');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoSQ8qFbgEeQPgRpuTOD7esld8ChRckTpdpQ&usqp=CAU', 'ef');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQlxGgAFhQ6VkMbvlml92-I9ghZaEtRcfhTA&usqp=CAU', 'tr');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbj9jn2bH6C8-0i3ITOLR7X7kQ5-Id02GYtQ&usqp=CAU', 'tr');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8CCt8qI5Dx3113K8Ts6g0tvIMeCsJqnpzdQ&usqp=CAU', 'tr');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvjVdrDHQwWL7DbbDZGF7RRLpMmPQy2pzhqA&usqp=CAU', 'sp');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpSQD2734cnxJcJ3xUMBuGYz9uE4ZHoCdkoA&usqp=CAU', 'sp');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXdeQ6H-gCmXUhsGHFvsEcq6lHEUc0PTa9hw&usqp=CAU', 'sp');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8plEzBK-vZ8bMutUPxhyXkqPe3h-kDskRWw&usqp=CAU', 'ef');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqJ6sK70qksumGniYr6Rg4Ptxc3dXpTlV-0Q&usqp=CAU', 'ef');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtPiOxiR0th1vR0XdnHJ8UWtAaOlhtXxfnlw&usqp=CAU', 'ef');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBWZ8x1MhMXw45wO4H69HyM89Xeld1-BjB2A&usqp=CAU', 'li');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe6YgEpl8BYqWnAqSjQoYnAGHwKeHwK90Bsw&usqp=CAU', 'ef');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ73bN-M-EJ-wIMY9QZCl6hVspwF9w_cnfLzw&usqp=CAU', 'li');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQafSgsC5JlbS5nOH8Q2my89ATqjhh87-AUUQ&usqp=CAU', 'ef');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6noR7edpne7q0fZ8Y_6wvkKYIZEoToOrxHg&usqp=CAU', 'ef');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_NWJlmte5pnEHJNhRaHsu7bOjV9axKdFwbQ&usqp=CAU', 'li');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb2uzkknaCX-xRDHCLGelu4xp1XqMEpPbRvQ&usqp=CAU', 'ef');
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkvtQqMhiLQt7Rr3KgkpCmsLAbV4k36ktcxQ&usqp=CAU', 'li');
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpFlx6B2GlJnBfRcOKkszB4xiO0vlOR9lZ8A&usqp=CAU', 'ef');
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQY_2u-0oZtKIrdwnTfTP8mDRrMGXVOJGSSA&usqp=CAU', 'ef');
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnklJ5PUvoetwX992CGtNfDfbfSGsgAxnVtQ&usqp=CAU', 'ri');
        createCardElement('card27', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKRHhyKdrDu6fRp0HCedfyR_4ogXSpM8coPg&usqp=CAU', 'xy');
        createCardElement('card28', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoSQ8qFbgEeQPgRpuTOD7esld8ChRckTpdpQ&usqp=CAU', 'ef');
        createCardElement('card29', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST4JcRCzyFf1-M5eOr-p3VxhTzSxfGFM3oxw&usqp=CAU', 'sp');
        createCardElement('card30', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6YEzONukU7ahufQPNLqUkL2TyEwJ7cbvsfw&usqp=CAU', 'ef');
        createCardElement('card31', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSETF1QSiVuXXtwKrPp8sAKFatmX7FoB7ss-g&usqp=CAU', 'sp');
        createCardElement('card32', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvucenWLa8lxKDS08Fy1FKPKX1GTkYtgVqwQ&usqp=CAU', 'ef');
        createCardElement('card33', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_LJs0iXgsXpQxOQQ_os1icl5exww9C7X0-g&usqp=CAU', 'li');
        createCardElement('card34', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSG4ty95hIBgotrHqrCtiQT7bvLRE-LX_gug&usqp=CAU', 'sp');
        createCardElement('card35', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYF-28afXKiwjFoCROUhecIsXnLNsimf8nOw&usqp=CAU', 'sp');
        createCardElement('card36', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS492eKbecq-3NrzYhuD9ZA6Utwu9pvbGj9GQ&usqp=CAU', 'sp');
        createCardElement('card37', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmk_F2xMu5tPFKy_DAna4XEZfaKcijaTiUoQ&usqp=CAU', 'sp');
        createCardElement('card38', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs-Vtf_L5_1-KThYbldc6J_RLUVCvwoe9a2w&usqp=CAU', 'sp');
        createCardElement('card39', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmzVIWvWmpnm-TYw271PsKLwUjN1Rq_pYDhg&usqp=CAU', 'sp');
        createCardElement('card40', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf1rZ_wGCqk8DVxmVC_KEwGigZmdCDzd1L1w&usqp=CAU', 'tr');
        createCardElement('card41', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF7FofLPkRlyaVZwnNPO-Tnk8cvUFOh7m0EQ&usqp=CAU', 'ef');
        createCardElement('card42', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_Qwyl6cf86ItPf_CLsof0vX-TnogzmO_t4Q&usqp=CAU', 'fu');
        createCardElement('card43', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH3ltuXfA-CP8ow8jaytJlXsI4tqV7HlQqSg&usqp=CAU', 'ef');
        createCardElement('card44', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmnw9H1LGe2DdW6K2DQaLUuS0zNQOxK4xZUA&usqp=CAU', 'ef');
        createCardElement('card45', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs-Vtf_L5_1-KThYbldc6J_RLUVCvwoe9a2w&usqp=CAU', 'sp');
        createCardElement('card46', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRcpwqcsJ1TWNBxRkrCXCt_ndnHuolQ4F1xA&usqp=CAU', 'ef');
        createCardElement('card47', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPBBzr_NsD6wD12fRGEr5hKHd3RUyP5Z1tGg&usqp=CAU', 'ef');
        createCardElement('card48', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMUh1WRFba2WSDXPa3F57Qt53BPHCGG03TDg&usqp=CAU', 'sp');
        createCardElement('card49', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwB-veL7vbPiowIEvdWVE6I-MJ0V3l8608HA&usqp=CAU', 'ef');
        createCardElement('card50', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfz5fxeBkK_GDOrN0XxNbfvqbNvEzoVYylzw&usqp=CAU', 'li');
        createCardElement('card51', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBWZ8x1MhMXw45wO4H69HyM89Xeld1-BjB2A&usqp=CAU', 'li');
        createCardElement('card52', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ73bN-M-EJ-wIMY9QZCl6hVspwF9w_cnfLzw&usqp=CAU', 'li');
        createCardElement('card53', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkvtQqMhiLQt7Rr3KgkpCmsLAbV4k36ktcxQ&usqp=CAU', 'li');
        createCardElement('card54', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_LJs0iXgsXpQxOQQ_os1icl5exww9C7X0-g&usqp=CAU', 'li');
        createCardElement('card55', 'https://ms.yugipedia.com//thumb/b/b1/CodeofSoul-QCDB-JP-OP.png/300px-CodeofSoul-QCDB-JP-OP.png', 'ef');
        createCardElement('card56', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnsHapVHvjlIFRIZG2EIMmgzaTI11p2kVapA&usqp=CAU', 'ef');
        createCardElement('card57', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOghUzobpxBqpjfyIUGVGao0nWRwl5HKkvtQ&usqp=CAU', 'li');
        createCardElement('card58', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9D06n9LqLm_GQHRiKW2182um7zqKSwze2Ug&usqp=CAU', 'sy');
        createCardElement('card59', 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRI8KQcWHGcJroE9iM6vCzKScmLphaIbNm3Lv-i5fTHJuPKhs0nXuC4sAkkmkHHODMiYbEAptI97-0l5n4AOgiBeoGy7CWRa4gkyT4RjbHQOWPMOV3Hqpo9&usqp=CAE', 'li');
        const optionalProtectorUrl = 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcStPa6-0jJrawX4vxVhKdVBGsujeHmoF2lze_qZGYIdfQEcIqlgFabTy0JhHszckQWGJ-yAaNyLcEyAJ2J0QFym5j0ssqmcS87yT1Aj2oqS&usqp=CAE';
        sessionStorage.setItem('selectedProtectorUrl', optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4vITrDZ6gwyPpgachBMmyEGX-mi_478PrMA&usqp=CAU';
        sessionStorage.setItem('selectedBackgroundUrl', optionalBackgroundUrl);
        location.reload();
      }
      break;
    //ドレミコード
    case 'Solfachord':
      {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKzLZSkF1HXYNEGEk-eYh8Z969T45cpp59uw&usqp=CAU', 'sp');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMv6tcX0rObQaXbLF34Mr1NaoVjlnll_fcBg&usqp=CAU', 'sp');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZkT4nU2MaM6_MpnTY9GB-5NUWEQ7oLktJtQ&usqp=CAU', 'tr');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5-ynNdbjxFz12Hwfd1Nr42IG2BPAQsodbGA&usqp=CAU', 'pe');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVlGW1JhKX9D0xRwoB12BFIJF63nGlBDvVLg&usqp=CAU', 'pe');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5HVFLmtmnsPAKAudDgi788OSIk2nJPQfXbg&usqp=CAU', 'sp');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxj_gcASPFd4TRHbabIcbudybNTtdihxCSOA&usqp=CAU', 'pe');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWxBAtHwaCKsgyVRA0f3Iw-wtVID5pGr3xRQ&usqp=CAU', 'tr');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToBTWQIc5-35jJXEInYS6Uf1vnkciDGaRaFw&usqp=CAU', 'pe');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTB3jFCMFAuBb4ncNZ_u7g4EdOlg69y1kqrw&usqp=CAU', 'pe');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIWBL7btPCnYDuwqy29G9S3w0H7hLfBjg6Dw&usqp=CAU', 'pe');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-_4eqa3cvKNxFNoTsM6gqwmtNGGH8B5HjwA&usqp=CAU', 'pe');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiQYD-NXTvnu83OICBnxcfxAer9nfhxsRnDw&usqp=CAU', 'pe');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlXJ5q7cPJsKlAMwu2myieqkm4AiCZ1yqrqQ&usqp=CAU', 'li');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlFO2LYXnY9JzMqyfEZAb7SXOevVnbCz9vng&usqp=CAU', 'sp');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjYxkfURBKkgdGTnVXcLw3NvbB4mKnssj0YA&usqp=CAU', 'pe');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGcaIvKwwhjXaM5xHHRrVC2yuj6V2E0s1n6A&usqp=CAU', 'li');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzx-0m5gddpSUZm3-A6p_lm8npesIBkseO9g&usqp=CAU', 'fu');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuabdUQGrHzSPG4vHK33Ga9ON97imOpr50zw&usqp=CAU', 'tr');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWuWVA3SmiFjsMsVXtaiHyjdHLXQwHo1PkEw&usqp=CAU', 'pe');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbV-FsOiTmUmGysY4Y4kJZRKkm4X22Tt5IEg&usqp=CAU', 'pe');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSULWcqM2rSav2QvZcUFcltxQxegzsTyCg8Rw&usqp=CAU', 'pe');
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS24nhGnEuztkBzfdNZrRnDWJUVuJJXvW9Oqw&usqp=CAU', 'pe');
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcayhBvLQq61IWmCL1f_2W_BO0PLJGv1j5pw&usqp=CAU', 'pe');
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3-VTBJlgeYdVWyw95IBYaeinpaBQfPTDIxA&usqp=CAU', 'pe');
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv8XPkbmTub55t-H8_0r82UFEIH9SJ1jXp3w&usqp=CAU', 'li');
        createCardElement('card27', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXkWoJwMtIKrKO7K2jbL2RNCXwVJp0Un809w&usqp=CAU', 'li');
        createCardElement('card28', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAyhkUeJMQ4TMZHbcQrqtW1qYn1LNH6s2AGw&usqp=CAU', 'li');
        createCardElement('card29', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZSyT-LZ4-jLpANJ-abnv0DuTLmhIDwaUAHw&usqp=CAU', 'sp');
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiwmFIV6puSuDVdlNEW95p-7U91rxK78Z63w&usqp=CAUNyLcEyAJ2J0QFym5j0ssqmcS87yT1Aj2oqS&usqp=CAE';
        sessionStorage.setItem('selectedProtectorUrl', optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://pbs.twimg.com/media/F3VbnQyaAAAO2T9?format=jpg&name=medium';
        sessionStorage.setItem('selectedBackgroundUrl', optionalBackgroundUrl);
        location.reload();
      }
      break;
    //植物族
    case 'Plant':
      {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZUw1GstOL5B1GWv1meE1kc4b_Em372_veoA&usqp=CAU', 'ef');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9XeX0u46-R-RdLP1goqFPluW-U9ypTAJDPg&usqp=CAU', 'li');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW_w68sjP3PyBeWKuuHYeKyxPqFlRZmktd5Q&usqp=CAU', 'ef');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTac1VDjnd0dQOB4UQzqLiODHgsQZ0sBrBh2g&usqp=CAU', 'ef');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFEN4LpFxT3EeIhv4oP1xusgwCAf5YnZi_Xw&usqp=CAU', 'ef');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAJ3-hW0-yZIkQBjaC1BS2PCZnjlGOovEbqQ&usqp=CAU', 'ef');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQswyus8Pez8s-bSvE9UbDsJgbzLGaMQPVRXw&usqp=CAU', 'ef');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-09t3CTMNrXr1YsLxPuo1yjXsWI-tyWhGGg&usqp=CAU', 'ef');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4Bj2Umy4FqpYgv3Myi1GwfscjYh34Yf62lQ&usqp=CAU', 'tr');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo4DOXfIOG4y6Lot9NFeiYkCX7GfesMsTt7g&usqp=CAU', 'tr');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJJ42wt-lMyoCEKor3yx-i8OXsLPV38E0XNw&usqp=CAU', 'sp');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVimtGZOJ6k2WETalkrYuzTjVI6eNMLzWkcw&usqp=CAU', 'ef');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9ODkla-h_DAFxD6xqTVw7fzEaNUhjaZm9bA&usqp=CAU', 'xy');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWj7XFoPreeySxoRbxaK5e05w9tHXciQDrAg&usqp=CAU', 'xy');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNXx96LNTxL_s595FoL9MD1YpexwhfMupThQ&usqp=CAU', 'sp');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQddlVll7LR09RU91JKjSBhP3kCatGFR_U0Pw&usqp=CAU', 'ef');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY87XrEVH8Bo29RTBUfMYywZ4eAz_rXtjKmQ&usqp=CAU', 'sp');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0qQARn1MZL5mUoVt3Dn89EJJLjod_2Qhh8Q&usqp=CAU', 'li');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYlVVQvj9G1rzZROH3XGtDoHKnUj3FTidXvw&usqp=CAU', 'tr');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7sbKEjodh2g4gD74t9xYIJETrn7zI4zzzTA&usqp=CAU', 'li');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrjO3WchQrsxbN6zuMI4OAHNrYJCNhMf1Sdw&usqp=CAU', 'sp');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlYc7cnI54JTyF1BJjyCPcaB8MnHoN-e_Ikw&usqp=CAU', 'ef');
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTzUT1EZYRNg_Y5fu51GgEytmZoluBP4Vf1g&usqp=CAU', 'li');
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8bxSXC8PvT-RHdtdV3b5DTyLHf1LYPEkHNw&usqp=CAU', 'sp');
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAmc9UImb6355gMsFBAWghN4koV4HSqiarLw&usqp=CAU', 'no');
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnjFg1UEkZeR7er9rCXAxVd5MxzWOmCV-84g&usqp=CAU', 'xy');
        createCardElement('card27', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvGGUCy1BI9Ihk8WInuPwRPAV3KQefkLpZ0A&usqp=CAU', 'sy');
        createCardElement('card28', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnhyqiAy1Wi4GaLGeuazU6W7kJeygO5FImqQ&usqp=CAU', 'ef');
        createCardElement('card29', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsbsMOJ9BxrOr8uye50QjEPXv_2ddr93etxA&usqp=CAU', 'ef');
        createCardElement('card30', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl3OmpJF0r_hO3ZAOtZeJgNsrxA4py_zBDlw&usqp=CAU', 'ef');
        createCardElement('card31', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNG94QdVdxloIhHnHWG-X-4py5CyrSxHt2cw&usqp=CAU', 'li');
        createCardElement('card32', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiYjJpoX3hqtVgD5gs2HvPDc3FD1PRJj8jFQ&usqp=CAU', 'ef');
        createCardElement('card33', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUeI5xYaDo_phzNEd2v1bvUZMQ7hVIly7UPw&usqp=CAU', 'sp');
        createCardElement('card34', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK22jIsuwDFvE0GhkmRNHVNJS4tpgxpAuuIg&usqp=CAU', 'ef');
        createCardElement('card35', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwuAYzsDy8JY4CrD-KBwJQsHxj62CrmrH9Pw&usqp=CAU', 'tr');
        createCardElement('card36', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCTxuhTurFiE4UHfmeEdCKiosNu1H_yQ6kvg&usqp=CAU', 'ef');
        createCardElement('card37', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMccQ0eONj5paNHJuMU2QTA2_gYuI4gxky5w&usqp=CAU', 'sp');
        createCardElement('card38', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE7pNNmogUjJHRytfjcj26_JpJHjd15lL4CA&usqp=CAU', 'ef');
        createCardElement('card39', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTul9r_ZLxcbNAeK0m-GR8vOYPQcMnCYyZioA&usqp=CAU', 'tr');
        createCardElement('card40', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb4tm7LzaofnAqnTm0HmWtBZicc5Hj-5qyrQ&usqp=CAU', 'ef');
        createCardElement('card41', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXNu1dhSJTYX1vHHAVLqlNLxESt_36ULY9Ag&usqp=CAU', 'sp');
        createCardElement('card42', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6uIjPoHfouRCF-5GhzeEJx9JMP5zmLv9IAg&usqp=CAU', 'tr');
        createCardElement('card43', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlNfAt-kGToIHcrRSamCvpaLx6Ta-f7Ea6Zg&usqp=CAU', 'ef');
        createCardElement('card44', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkOSCv3raozAPYzUSdJxgoG7Mfu71CzXdOfA&usqp=CAU', 'ef');
        createCardElement('card45', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFMukoKgkckmUo8sgqLmxS3HqJDTGfFEW1qQ&usqp=CAU', 'ef');
        createCardElement('card46', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-BECCd8NdM8owdpj48eOihdyjQvsoWphw9w&usqp=CAU', 'ef');
        createCardElement('card47', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5R_jy7wLjQwnu2_VNJvx6G2wb9TKJrPBuTA&usqp=CAU', 'sp');
        createCardElement('card48', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6rkyIjbxChV7bq_qahtcsOGKEWWaIDIo4UQ&usqp=CAU', 'sp');
        createCardElement('card49', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRIUlt0Cya1PusuF_8n3JmcwTRxpGDhD60dg&usqp=CAU', 'ef');
        createCardElement('card50', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX11CkntCNrxqB4ULKdVHZkTJcTlC4x2La9Q&usqp=CAU', 'tr');
        createCardElement('card51', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXoA1lu9KtL3b6-24AnhjyVA7LxcWPedFwhA&usqp=CAU', 'ef');
        createCardElement('card52', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLd0KdtqtnCFs0BszIvXitFx8wJfAiOy1Euw&usqp=CAU', 'ef');
        createCardElement('card53', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe3tkX9BaBfD2gVLdOkFzLUPjluF_KJqFunw&usqp=CAU', 'ef');
        createCardElement('card54', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsR_nFrBejKk78x5ps4rsLVodp2rWdUSsi6w&usqp=CAU', 'ef');
        createCardElement('card55', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOlPY8WTgch7F7fi-Jlz9mp0jfxj_IJITAbw&usqp=CAU', 'ef');
        createCardElement('card56', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKV0DUW1uPHyfY2ELlDWK074W-LfNw51eYMQ&usqp=CAU', 'sy');
        createCardElement('card57', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl4cgFtyAGLdr8EZQ03pPgkagMvem2ocua5g&usqp=CAU', 'sy');
        createCardElement('card58', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTkMxKic353L1cpbKj--181CzwdmihHGhR8A&usqp=CAU', 'sy');
        createCardElement('card59', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA5BdjsmLwtHGQvbSnSAH04ISp88q5cIz6-g&usqp=CAU', 'ef');
        createCardElement('card60', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNUYzAJUE3edEM-Ym5369mtTcp-cAdSs2wJA&usqp=CAU', 'ef');
        createCardElement('card61', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT31pKAOUXDXPrA6R5WdmGNSLCY6d1_ywT9-w&usqp=CAU', 'ef');
        createCardElement('card62', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3Ec9hPgOkrElZhGQe7xK_dvVsVJbeaO2myg&usqp=CAU', 'li');
        createCardElement('card63', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsP7gKziQYnAjgIhQ5aFKaUSgPrBvTzHPB5w&usqp=CAU', 'li');
        createCardElement('card64', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsP7gKziQYnAjgIhQ5aFKaUSgPrBvTzHPB5w&usqp=CAU', 'li');
        createCardElement('card65', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsP7gKziQYnAjgIhQ5aFKaUSgPrBvTzHPB5w&usqp=CAU', 'li');
        createCardElement('card66', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2Fyj5jsZj8RmdCy3loa1pyiXhg-1OzXmYUg&usqp=CAU', 'li');
        createCardElement('card67', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg6p7_sobwOrNSfGL8XkVIqOYUlySX9l829w&usqp=CAU', 'li');
        createCardElement('card68', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL2yoBQBgWDbnmBULlmR1Ax6XfcdMuqZpRNQ&usqp=CAU', 'ef');
        createCardElement('card69', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjm6bXtZ6p1eIFsHQnnLdXg9uv4UGgwDzvtw&usqp=CAU', 'li');
        createCardElement('card70', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjm6bXtZ6p1eIFsHQnnLdXg9uv4UGgwDzvtw&usqp=CAU', 'li');
        createCardElement('card71', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjm6bXtZ6p1eIFsHQnnLdXg9uv4UGgwDzvtw&usqp=CAU', 'li');
        createCardElement('card72', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi6dqj2XRKsOyjMe4W8QDI0c1IHkD6rnnbzIlBp5WJhqdGJTKERaGi3huS&s=10', 'li');
        createCardElement('card73', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi6dqj2XRKsOyjMe4W8QDI0c1IHkD6rnnbzIlBp5WJhqdGJTKERaGi3huS&s=10', 'li');
        createCardElement('card74', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi6dqj2XRKsOyjMe4W8QDI0c1IHkD6rnnbzIlBp5WJhqdGJTKERaGi3huS&s=10', 'li');
        createCardElement('card75', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4MDmcaEWQVD2Mj2hrw-wgpvvLT4vK3C4u13_hTNnW88cVnVivAq9582ci&s=10', 'li');
        createCardElement('card76', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKrwtY-YGTEgHc3Wr7L70MJix5IrZgpa59Mg&usqp=CAU', 'xy');
        createCardElement('card77', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz44lJyA44BPKC5I8JMhzX5FyHP_oqZbE3l1d1utAK8V2pezwdC-5nBuDu&s=10', 'ef');
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSgMR-hgtyN0vufSh4rQzo0x4mXYAgRNAM-g&usqp=CAU';
        sessionStorage.setItem('selectedProtectorUrl', optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ4lRsHy40REiRCsVj8ueLtItfePflrLlR3A&usqp=CAU';
        sessionStorage.setItem('selectedBackgroundUrl', optionalBackgroundUrl);
        location.reload();
      }
      break;
    //マジェスペクター
    case 'Majespecter':
      {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGCndftQUlvjXf_NHmfAvwfY3j_6TsWUG7Dw&usqp=CAU', 'pe');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReodDYaI4zugYfobppIthwlRq18l5q9praPQ&usqp=CAU', 'tr');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6HxL2en1RVrnYhMrEhwGIZIPmwW8RlLdQmQ&usqp=CAU', 'pe');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS8bmw88gWviyuHLuUoOIBu28_eRuclXpWfw&usqp=CAU', 'pe');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkYAKI55OGvACv2wqcuphrvg7qjkaNZm3qpw&usqp=CAU', 'pe');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9uqz-T99sDW3REfEyZ3WpksH8d2T7YFdDvA&usqp=CAU', 'pe');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3PQ32A3YQnY1bGYeYWcD_KVBav5-obWXcKg&usqp=CAU', 'pe');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNmsFpJXwL3at9A57gQ-nvZKwNCxWOlRzUcQ&usqp=CAU', 'tr');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2MVVQZnWlj6_cw_-REyQRWOMqh9tdccvVQA&usqp=CAU', 'tr');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRee4k7g6T36EMT-BptKNm1OpeNgwdAoi4wzw&usqp=CAU', 'sp');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1QLWTWDebjRfsTsM69kk0jzrOpjYC9Yi7Aw&usqp=CAU', 'sp');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScUGSmJbyqgRH4MYm1G_97rYtVrLJO6O4WLQ&usqp=CAU', 'tr');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIighhx703SJM4VzzYU3EiGZT9JYfHnh9Wbw&usqp=CAU', 'sp');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfbK8CA0J0mykXwej2NE0FolVtFabAxWIp9w&usqp=CAU', 'sp');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmOMy-Vj-Ay81snZH2cb6aUR1U-Dn_cKp-Zw&usqp=CAU', 'pe');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWeX_GbWg0OxbGJ0XHcHXziBtF-T6JIThf5Q&usqp=CAU', 'pe');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3JKhBVGgwFB1E-GMVAi7jRlZ0vomVHW_phw&usqp=CAU', 'xy');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7o3FBbL4dvr8AmUOPQrW87hAPSLqXrGLQYw&usqp=CAU', 'pe');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkHhQsC83TkPsDHNH8lSjIb2daL-rIzJcoSQ&usqp=CAU', 'pe');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlNNeROEcM7EvVYnD1Azjls5aN-4p70CBecA&usqp=CAU', 'sy');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSB4gVYuo1-f_IX1bQrggu1lk5IxbQAQlJVwg&usqp=CAU', 'pe');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6ZOspO-Po0Q9PdgLffAMbplw7gw4g_JTPkQ&usqp=CAU', 'pe');
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCmJkn8OzAI8EVDtlCB5blHJX39XoX41YQmA&usqp=CAU', 'fu');
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrknW_8qDdak19QHluPnDA2nK0yMEG-DxRwA&usqp=CAU', 'li');
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvj8BTIHfiS_Rs2hGlU8HMMg--aWHHmhe8xA&usqp=CAU', 'li');
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-bQQSvaZ5AR3QBGqg-u9QvxA75j8qRl4vwg&usqp=CAU', 'li');
        createCardElement('card27', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlcY9nDYSlkawIt0CAAlopZPqKOANOV54XBA&usqp=CAU', 'pe');
        createCardElement('card28', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE6uvxsJ6TEBJ7jS0jHs-Xc3MnxDghEeiz7A&usqp=CAU', 'sp');
        createCardElement('card29', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4s5d8TaSdjf3dWvJ5nxe1tyIk3mEBmuGKIQ&usqp=CAU', 'pe');
        createCardElement('card30', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrxmh6uTUXvqYaIP3xozOHb-6U7g97ScAVoQ&usqp=CAU', 'sp');
        createCardElement('card31', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzmM8IjMC9bBYvQB0oTg3iKjrjhF-h30WDmQ&usqp=CAU', 'xy');
        createCardElement('card32', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzmM8IjMC9bBYvQB0oTg3iKjrjhF-h30WDmQ&usqp=CAU', 'xy');
        createCardElement('card33', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzmM8IjMC9bBYvQB0oTg3iKjrjhF-h30WDmQ&usqp=CAU', 'xy');
        createCardElement('card34', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScMGLITo0OMbvShvvC7KhNsaQ2D1yvPWB6HA&usqp=CAU', 'pe');
        createCardElement('card35', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScMGLITo0OMbvShvvC7KhNsaQ2D1yvPWB6HA&usqp=CAU', 'pe');
        createCardElement('card36', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScMGLITo0OMbvShvvC7KhNsaQ2D1yvPWB6HA&usqp=CAU', 'pe');
        createCardElement('card37', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXwvfUq7FlU5Hb3NwIolHsS95cUPoE8EtjQg&usqp=CAU', 'li');
        createCardElement('card38', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXwvfUq7FlU5Hb3NwIolHsS95cUPoE8EtjQg&usqp=CAU', 'li');
        createCardElement('card39', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXwvfUq7FlU5Hb3NwIolHsS95cUPoE8EtjQg&usqp=CAU', 'li');
        createCardElement('card40', 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRxENDpKDkE6uAhm5L3FQZP1AEPIEi9KOv5DR9a0CtyL9KejJkKybvU3WpF6zTuapm_L2fLOlEISCSAlvVBYbI45y48iK3uf0qRfROevZc&usqp=CAE', 'sp');
        createCardElement('card41', 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRxENDpKDkE6uAhm5L3FQZP1AEPIEi9KOv5DR9a0CtyL9KejJkKybvU3WpF6zTuapm_L2fLOlEISCSAlvVBYbI45y48iK3uf0qRfROevZc&usqp=CAE', 'sp');
        createCardElement('card42', 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRxENDpKDkE6uAhm5L3FQZP1AEPIEi9KOv5DR9a0CtyL9KejJkKybvU3WpF6zTuapm_L2fLOlEISCSAlvVBYbI45y48iK3uf0qRfROevZc&usqp=CAE', 'sp');
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-s7b9GEUOO0Bu3idFsQTOJWzKTDMmNbdsiw&usqp=CAU';
        sessionStorage.setItem('selectedProtectorUrl', optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUAk_QPdi7mFpxUhw_iVvT85DqOen4iblx2A&usqp=CAU';
        sessionStorage.setItem('selectedBackgroundUrl', optionalBackgroundUrl);
        location.reload();
      }
      break;
    //DD
    case 'DD':
      {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJYrA1k2FnUA5Z55uL1KXvAwFQ_VzteLkSZA&usqp=CAU', 'pe')
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzIxysCWdEdydT_Mei4QgDfvvmqrtOTdhaRQ&usqp=CAU', 'pe')
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPtFkbu0Pm7XIwoeOC7l7Ag2sWP4ylzroxUA&usqp=CAU', 'pe')
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVR1gNfW95vUo8gp_zMm1vh9EQgoNlVWFxsw&usqp=CAU', 'ef')
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCXehsvTvY8q-y6uHP8YNWpx5fv8gD3-WMFg&usqp=CAU', 'pe')
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWLzE1Uu4I83aGTXROG3INPqs6WpnrRAzNMw&usqp=CAU', 'pe')
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0mCdLLwDtPaZwSrvWh61jRCFv_JOgAQtaYQ&usqp=CAU', 'pe')
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOMzu6lZ_t1Z15Q5bHoVheFQfZDj1Akxl2_g&usqp=CAU', 'pe')
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1N3ce14m3VXUrWaSkwX4ubKxj_keFq702og&usqp=CAU', 'tr')
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9EZdkzB4hxdvsCRBdv9ohqm46DD3-kmUYaw&usqp=CAU', 'ef')
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjM5o3FFYo2bKlmCyJpPkj8D3i45d2OASzrw&usqp=CAU', 'ef')
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUT2n78SjXDrJ7kxEJSnRfEga_IoO2BdGcLw&usqp=CAU', 'ef')
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1cX5j8VnNXv4M0hkXY1nBSSkaI4B5sFMKnQ&usqp=CAU', 'pe')
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQK2ovlgW_cZ_CFQIQgD_mbfiET-8tiax4Xg&usqp=CAU', 'pe')
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3HfDR3-DbnxBS_n3vWiNSBSVM3OYDrpVhMQ&usqp=CAU', 'pe')
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMhG9FXNCALr34Yit7xhOLyb2iTEpFn9_95A&usqp=CAU', 'ef')
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZdTFp4RyX-AAUnuEDNKVc2oE1pbTedrivCQ&usqp=CAU', 'pe')
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfsyYQZl_VkOfVd-GKw_K-evlA9wkCtAiv0g&usqp=CAU', 'ef')
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn5IGTISeu9q-Sh1NPjmeXY8yD8DEtji7-yA&usqp=CAU', 'pe')
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQH7m9PelcHF43HrzCzR-6hZdI5nlSfNIkPQ&usqp=CAU', 'pe')
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcUd3RKdyOw8b-givIzYjAVtUzBEsSP9xrcw&usqp=CAU', 'ef')
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdDWh_9uBJB1Ibajj30aZmoYLX3FQ7AM7mzw&usqp=CAU', 'pe')
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGe8CHJFijp6BCvZwodYzl-58ItvP3v_h7Wg&usqp=CAU', 'tr')
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqyNFwqqIm3VsgRUBelia-PSGyfGFXEr6j0A&usqp=CAU', 'xy')
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3HaM5_MbDyREkDaJ2wSEVNxwS1OwMWfgVEw&usqp=CAU', 'xy')
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz41PhUrxQyYznM3OGzckYQTgTN_vs631sbA&usqp=CAU', 'tr')
        createCardElement('card27', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFTpnLwLD-S8Drj_xPYq1b--_6G-mvLuKLnw&usqp=CAU', 'pe')
        createCardElement('card28', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3MtNDf5X6D1fZs7uuouj-_Uis03zuBLUDmQ&usqp=CAU', 'pe')
        createCardElement('card29', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP-qvtva8h-WYjxy3d1CFTDKdz31mmR0sHvQ&usqp=CAU', 'pe')
        createCardElement('card30', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWMeeMwPCf4BymzmTbuywNF75eR3k-tr_rxQ&usqp=CAU', 'pe')
        createCardElement('card31', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyy4D3pGXtsR8YPE-2TmF_zQVp30bMzUzUuA&usqp=CAU', 'sy')
        createCardElement('card32', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7sC5JyjgPQYQxws2hdkF_lmxsmAPN2knSCA&usqp=CAU', 'pe')
        createCardElement('card33', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtVSv8e3VMtnqN6lIdmOtPprT1aSy976LZ7A&usqp=CAU', 'xy')
        createCardElement('card34', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSJuJTnBTDagprOOxYBpbZN6mV6cn-MzvRxA&usqp=CAU', 'xy')
        createCardElement('card35', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvBu-j6UvbNdmsFtPU3oTfrnoje4O-dpHH1A&usqp=CAU', 'pe')
        createCardElement('card36', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG-guq281qsICgXE6q-2fudctOdGZiXNMy8A&usqp=CAU', 'tr')
        createCardElement('card37', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsKj1AePENpUBIzQdBPaeN0grWboQbCXYOgw&usqp=CAU', 'fu')
        createCardElement('card38', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZpCND0BBqEqkfhANzucJhj7PiJhRAYKsS7Q&usqp=CAU', 'sy')
        createCardElement('card39', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDyYQPLCqEUEHnrNmB1Fk9MTDshkNGLBEy_A&usqp=CAU', 'fu')
        createCardElement('card40', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTqrMjxtRrJ9R-OjTZrUPc-99ssy_ptsX5HQ&usqp=CAU', 'pe')
        createCardElement('card41', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSUUPfALqd9rYXyeI3W7NXfWMILnXY9d6isw&usqp=CAU', 'xy')
        createCardElement('card42', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHgv4yqecAXyH63PDxC3wq2quJG-Fqtl4MdQ&usqp=CAU', 'fu')
        createCardElement('card43', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpmVOWpBfEOvygnyUcs3ipZ7bygdU8MNLdag&usqp=CAU', 'xy')
        createCardElement('card44', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR16hGHAds4vWl9L7UBXEeVeetxZMDR-mEcqw&usqp=CAU', 'fu')
        createCardElement('card45', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_elMjqsj12Vrd8VvqWf6K-xjss_AixXoafA&usqp=CAU', 'pe')
        createCardElement('card46', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXBplUnIJjrpWTEvi9V3Kjr8SoLoH8et1tPA&usqp=CAU', 'xy')
        createCardElement('card47', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn8Mf8TCQT9R2qMOqBgxQKd5EcYi0qZYLBOw&usqp=CAU', 'fu')
        createCardElement('card48', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSE1Mn1IdQetsoQ7f7HA8swQFQqoAV5wGisg&usqp=CAU', 'tr')
        createCardElement('card49', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb41c2uL-VBy9VZoheb3lZogtSPOGOn4MeXg&usqp=CAU', 'sy')
        createCardElement('card50', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1rpx8SmIxnyWoFEnSUXrNc6ZeNDMSjIVk_w&usqp=CAU', 'ef')
        createCardElement('card51', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbCBtwJpBR9hLZCo-XgL5STeQRC8mJeErDNw&usqp=CAU', 'sp')
        createCardElement('card52', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBoiLvW-i-HYRv9cwvHXqTjMMRhtTe8KkVAQ&usqp=CAU', 'tr')
        createCardElement('card53', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8sUMTRHNKpge_P-9ZVNISPwAXSM44teclpQ&usqp=CAU', 'tr')
        createCardElement('card54', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEBhw6MYwR6UhJjozlgHZLHOfcV81aNOYvrA&usqp=CAU', 'sp')
        createCardElement('card55', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPxZqLVzXDIlGc5GZ7ItG6G_lxVUxSmOgJMw&usqp=CAU', 'tr')
        createCardElement('card56', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROT3roMvy7NNGQdl70HKtOgT55m7SiH6OIPA&usqp=CAU', 'sp')
        createCardElement('card57', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP1rP1G-oIk58gYW3Ng6G4evvp6qHE4tPZYA&usqp=CAU', 'sp')
        createCardElement('card58', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRewo9MGt5swBJtQ8swJ3_ez0TFOm-bnos_3w&usqp=CAU', 'tr')
        createCardElement('card59', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2YKxMrv2s4oKNCpOFXt9SwNmUY5ievArYFA&usqp=CAU', 'li')
        createCardElement('card60', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj436Q-QiyZaw1l67wOsCeEkw9SJBoWXRAFA&usqp=CAU', 'fu')
        createCardElement('card61', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9vfptGIv5QD0siq4on-AIND5Fg5t2_nKlig&usqp=CAU', 'sy')
        createCardElement('card62', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSd0FTNsWJ_AslGGtB9MteEMahBnk9nd_HtA&usqp=CAU', 'sp')
        createCardElement('card63', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjTe9T9EIhDpPr1uQhkUSPw7MqXpWKvbnFiw&usqp=CAU', 'sp')
        createCardElement('card64', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-4ijl7VzrGVOpHvkDca1cBAsbkarD-Ur-xA&usqp=CAU', 'li')
        createCardElement('card65', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3oE561LY9hzUzIQAko9mGMe4vjMQ2GyjuBg&usqp=CAU', 'ef')
        createCardElement('card66', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTso3EqPfhmZnEuy4n7xL4vvvZEmG5fHrKvdA&usqp=CAU', 'ef')
        createCardElement('card67', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJWvQJl3L1SmKWXL8dDYz8_UrbGW_NeVONYg&usqp=CAU', 'sy')
        createCardElement('card68', 'あ', 'い')
        createCardElement('card69', 'あ', 'い')
        createCardElement('card70', 'あ', 'い')
        createCardElement('card71', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2YKxMrv2s4oKNCpOFXt9SwNmUY5ievArYFA&usqp=CAU', 'li')
        const optionalProtectorUrl = 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSdvgw7QWehtPaMTqP3tHjsyOwsIJCAPLVBuhEnn7IrN_ob8Hsq6sUZe0tE43FDhGpJnfadmmjpQ3VqXXhGN011Q-1EECCOrHfMh7RgCG9gch2e2VITdXjHhA&usqp=CAE';
        sessionStorage.setItem('selectedProtectorUrl', optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVd_CuP2J2uwyaSsRlwOCfSDurCJPI4EgVnw&usqp=CAU';
        sessionStorage.setItem('selectedBackgroundUrl', optionalBackgroundUrl);
        location.reload();
      }
      break;
    //恐竜族
    case 'dinosaur':
      {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHJdC6alof9EdWn5LHcX4dpAekNAQ1tDGVFQ&usqp=CAU', 'tr')
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQkHnoooM0ZEXxmjf985h4isdYJAp8RP0StQ&usqp=CAU', 'tr')
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsouiGOsVXETNCdzdo3UJRAiPTPQWyz6XV3Q&usqp=CAU', 'tr')
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHq5jSYNrBBEqdKklQ9LLM86G6WbNR_Y69sw&usqp=CAU', 'tr')
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIJaZg8aQgsl7sH-COEHzfKA0p_NVedRI4xA&usqp=CAU', 'tr')
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRleyqcE24mlxxLHmp8P70hvr0fuaO9-mY9zw&usqp=CAU', 'tr')
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAcMBCEBQeVyg2qY_nc-Tmla9eTne6aWcOBg&usqp=CAU', 'sp')
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT1PRZEK_GGDSFnOu6sLzcm1w0CNLgFfv0ig&usqp=CAU', 'sp')
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFtceueIW_Xf1E_AIAGD9V1SxOJ1v046B_1Q&usqp=CAU', 'sp')
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIT8oNuLyoSTcHWLlXzxTzaN4vY10ast79aw&usqp=CAU', 'sp')
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQEOAwC473MKMOKZJXPefD6ldehoUF-mhzyA&usqp=CAU', 'sp')
        createCardElement('card12', 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTu_BYR83wIbYz-MAsrU9XH_t0Z_MiMcN8v-3FStj9x7n6l5VreQev6dvCldpapwSNj3KWOURpT6at7UMvvfUQOSgSxMnBQOXE3_czUd5b8&usqp=CAE', 'li')
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatcSbIv8jtjO3NQy-U-yr4LAzfXaX8bE59g&usqp=CAU', 'xy')
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAhImVIUrXUGMWdNrMsv-hVyzwohy7pH6CRg&usqp=CAU', 'sy')
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0Gd3laulWRJtmSlkwQwpjkZq3T0_OcDZwbg&usqp=CAU', 'fu')
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzp2ac4tzljLufMkjnbc6-hdrNlc8XvJCAAA&usqp=CAU', 'fu')
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbrn_rUfS76AefLyNoHWylo7O-HuStDAtJxw&usqp=CAU', 'ef')
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWEVyd1eltWzQh0UZ_Dq2kJ6FklYFsLgvP7Q&usqp=CAU', 'ef')
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiH4eP-y1KQOjBQPhncrkhVsin6b8zfjN6yw&usqp=CAU', 'ef')
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUEL4MFrqMvaZhCrjCfTyY6r2gT8BUQfSgxg&usqp=CAU', 'ef')
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUEL4MFrqMvaZhCrjCfTyY6r2gT8BUQfSgxg&usqp=CAU', 'ef')
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUEL4MFrqMvaZhCrjCfTyY6r2gT8BUQfSgxg&usqp=CAU', 'ef')
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuzuFy9TVuHxReZ_mDs1thhZdvNrqBZxNRKw&usqp=CAU', 'ef')
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmqjnff4ofDhr__owFcCkBH3puUBeGpuJveg&usqp=CAU', 'ef')
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS46laRIB7JziX6SiIzRYwZXn6sBTr6i9auOg&usqp=CAU', 'ef')
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaU2gMz7Sdbd9GatdFT8hx5UU72f5mKYFLPg&usqp=CAU', 'ef')
        createCardElement('card27', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuMT-zkWz3lcop6Bvi43lZSB5nF3FRvzlVVA&usqp=CAU', 'ef')
        createCardElement('card28', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3mrZHBYYnyDek7Uazld5iWmAM44EhtRFnww&usqp=CAU', 'ef')
        createCardElement('card29', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3mrZHBYYnyDek7Uazld5iWmAM44EhtRFnww&usqp=CAU', 'ef')
        createCardElement('card30', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3mrZHBYYnyDek7Uazld5iWmAM44EhtRFnww&usqp=CAU', 'ef')
        createCardElement('card31', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ257oKYBfkOpiEH8vojyRaC21HI_0el33jpA&usqp=CAU', 'ef')
        createCardElement('card32', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqy1wfojl-trsdgStz1UFx7GyaHnGxZ25-Ew&usqp=CAU', 'fu')
        createCardElement('card33', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5zE1DDuzgM5fnkeKOUk1BOgapwIIHmfTB7Q&usqp=CAU', 'sp')
        createCardElement('card34', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8RpSGzcZmY8IMuDgWgwiRiukzg8_PMnNTDg&usqp=CAU', 'li')
        createCardElement('card35', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsuRdGz1urzuh27mTydvjC8se4YLo99yp8Jg&usqp=CAU', 'ef')
        createCardElement('card36', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWuNYUGWE75Sxr8J8IS5-wlmzezoxPKlSctg&usqp=CAU', 'pe')
        createCardElement('card37', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb3qoBW-vkc3QZtnMgBmoFzSFugxffPqkM-A&usqp=CAU', 'ef')
        createCardElement('card38', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsKxxT56Ibrt_bHO4IIfPsVJEksfbR8dCMSw&usqp=CAU', 'ef')
        createCardElement('card39', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxLJeM4zBAKSAtlWlBEeD1JNbmmydK2CDo3g&usqp=CAU', 'ef')
        createCardElement('card40', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-ZUiTOgLDEQ-Dwjx-b5CNYDpAN36UvufOPA&usqp=CAU', 'ef')
        createCardElement('card41', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkhW2lR-aXWeXf1CzzcPZ-nV0MGgUWrQhETA&usqp=CAU', 'pe')
        createCardElement('card42', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKySpVH9eEya4Pwc3igBzCNTJlh0_2lgNmMA&usqp=CAU', 'to')
        createCardElement('card43', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS0VVgp29Au66MXmHRYhQR5Fq4w7oCC-1sKg&usqp=CAU', 'ef')
        createCardElement('card44', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpSBoYHyN93WlviJL0HtpZP21NyJLSPBiwQQ&usqp=CAU', 'sp')
        createCardElement('card45', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ5EGq2ANTxl-2lsKceHoGAb-Tu-ZyscMxVg&usqp=CAU', 'ef')
        createCardElement('card46', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZqjdYZhvwdkcJadpYmyagJr1inE3gCWPFZA&usqp=CAU', 'ef')
        createCardElement('card47', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpuwA0-D8-kFDA7meUwhuRARE3DoBvGmzZ-w&usqp=CAU', 'li')
        createCardElement('card48', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1JH8AIq3QUzjep6lCOVZR7r48aH7cRLJINg&usqp=CAU', 'ef')
        createCardElement('card49', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL3DZOUiZPdjY2hs6CK38PHf_7j-i9gKiUGQ&usqp=CAU', 'sp')
        createCardElement('card50', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd0M4MnjyfqH6UV1dCxTyj8_EWh_U9emLzFw&usqp=CAU', 'ef')
        createCardElement('card51', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf-iOTVxge4xMpJsZzGDJgodxafHcZpGyfmw&usqp=CAU', 'ef')
        createCardElement('card52', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUJLbaMT2ytdlWv47ZIDyC1ooio_vL669TQg&usqp=CAU', 'fu')
        createCardElement('card53', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7tlF0uqjjM8USRLMcn7JIE8KqQ7dtxLShVg&usqp=CAU', 'tr')
        createCardElement('card54', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK41_xdvtIaoKM23rVhOGJNb64GNK8euuV1A&usqp=CAU', 'ef')
        createCardElement('card55', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK41_xdvtIaoKM23rVhOGJNb64GNK8euuV1A&usqp=CAU', 'ef')
        createCardElement('card56', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDRfAKViqwp3NaTfF34QQFnVEZ7wr46xIFhw&usqp=CAU', 'fu')
        createCardElement('card57', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBVbrXedBw9ydqf6k2RqdzmXUh4Zw_VPIz6Q&usqp=CAU', 'xy')
        createCardElement('card58', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-EuJYSqHfEbk3VfQD_fvy5sjlv4v59D_N6w&usqp=CAU', 'xy')
        createCardElement('card59', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbVOBQV8Ogtg_AMLoV9vQDZpXS2D2SPdi4ww&usqp=CAU', 'sy')
        createCardElement('card60', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO0poeFnymCoX36NYOeaeZelhOwQHt4-mZmw&usqp=CAU', 'ef')
        createCardElement('card61', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO0poeFnymCoX36NYOeaeZelhOwQHt4-mZmw&usqp=CAU', 'ef')
        createCardElement('card62', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO0poeFnymCoX36NYOeaeZelhOwQHt4-mZmw&usqp=CAU', 'ef')
        createCardElement('card63', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa14OLX-zf-O_b4ZT4FtHUdPm-nkUJoQTvXg&usqp=CAU', 'xy')
        createCardElement('card64', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl2l2HM7yLLYIo13Dy9GsDk4ZH4J3dc0j1sA&usqp=CAU', 'li')
        createCardElement('card65', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR00cWaaeNnsBRmnla1Jv3yJuU8OwjUbr0Drg&usqp=CAU', 'ef')
        createCardElement('card66', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtxrEEP6_tYCqRmXj9NHs94aIiUmiJqf1Miw&usqp=CAU', 'xy')
        createCardElement('card67', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSM2D13OuCVT71StSW1R_AVIMzfHmE46L_qQ&usqp=CAU', 'li')
        createCardElement('card68', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKI58tyOy87Q7UviaNT8e_DFNQCakQ7yJo-g&usqp=CAU', 'xy')
        createCardElement('card69', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiec2O0Nc01Th_WW-jZkZjDk0jXuPWwgceYwq94KQISOMtCJ-TZVIBYacW&s=10', 'xy')
        createCardElement('card70', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRnXlCft1j335C06UsZ1JOyC0ej5mqjv-z-g&usqp=CAU', 'sp')
        createCardElement('card71', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaU2gMz7Sdbd9GatdFT8hx5UU72f5mKYFLPg&usqp=CAU', 'ef')
        createCardElement('card72', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaU2gMz7Sdbd9GatdFT8hx5UU72f5mKYFLPg&usqp=CAU', 'ef')
        createCardElement('card73', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuMT-zkWz3lcop6Bvi43lZSB5nF3FRvzlVVA&usqp=CAU', 'ef')
        createCardElement('card74', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuMT-zkWz3lcop6Bvi43lZSB5nF3FRvzlVVA&usqp=CAU', 'ef')
        createCardElement('card75', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLt4V7A8T2k4vnm7wD-LwO_i9iJr1AVcUmaw&usqp=CAU', 'ef')
        createCardElement('card76', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuc3pKTfj66YwSvHlGzyQ8WDAcq91Vqs0sGQ&usqp=CAU', 'ef')
        createCardElement('card77', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4XG4aGR0g_mv1wy2-bsjxjhwslJzVR154pA&usqp=CAU', 'xy')
        createCardElement('card78', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6HHnAhmzDLCPJsqdPuckYWF89-ya5rVZikA&usqp=CAU', 'xy')
        createCardElement('card79', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStopXGMVutYC1gHh9doVr2orWwaA1PP-Mk0g&usqp=CAU', 'xy')
        createCardElement('card80', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgXnJnudRo-_M82WkEqSSzsPL4bVJPlIXFY7PEL8-Gdhiq5nj9YEcZjJPg&s=10', 'li')
        createCardElement('card81', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfI4GLscTGvbtTyTsieJq-CgLbTeBajodtIw&usqp=CAU', 'xy')
        createCardElement('card82', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvg50qFJxrHK1yeJt1O2Z_CvD2_dLgxAbbcAIvqT9xYAsJryoKWtKcdVw&s=10', 'xy')
        createCardElement('card83', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVGSUWLI8STyv9Odf0o7qW-u61QEKLJDEv8A&usqp=CAU', 'xy')
        createCardElement('card84', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeVANUqpLQXsrDr2nRTZanuli1guALU_QsJA&usqp=CAU', 'li')
        createCardElement('card85', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1KctbpjfbqvVAvCz2KvyGL0Kc8VmNh03oFw&usqp=CAU', 'li')
        createCardElement('card86', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSttgrSz-lEjVM1PxEdycx_l9FEQUQcC426xg&usqp=CAU', 'ef')
        createCardElement('card87', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjzWWQT7AOtATFIM7cfjzHQzuJjoMYI1G2Zw&usqp=CAU', 'ot')
        createCardElement('card88', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjzWWQT7AOtATFIM7cfjzHQzuJjoMYI1G2Zw&usqp=CAU', 'ot')
        createCardElement('card89', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjzWWQT7AOtATFIM7cfjzHQzuJjoMYI1G2Zw&usqp=CAU', 'ot')
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQuazzDy5VPtQDDP2LduBhs1KdGZKEL1H5YA&usqp=CAU';
        sessionStorage.setItem('selectedProtectorUrl', optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQobLymRAYOFhteV4IIAYlWOimGhxA25g1oDw&usqp=CAU';
        sessionStorage.setItem('selectedBackgroundUrl', optionalBackgroundUrl);
        location.reload();
      }
      break;
    //霊獣
    case 'rituralBeast':
      {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTkg_x-hxPQ89jL6kPEz3hPsmJt0UQ3c3Zyw&usqp=CAU', 'sp');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTkg_x-hxPQ89jL6kPEz3hPsmJt0UQ3c3Zyw&usqp=CAU', 'sp');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTkg_x-hxPQ89jL6kPEz3hPsmJt0UQ3c3Zyw&usqp=CAU', 'sp');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTON010-VfcKhjEEz7Ug07QfUC5nXGhbg6sxg&usqp=CAU', 'ef');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTON010-VfcKhjEEz7Ug07QfUC5nXGhbg6sxg&usqp=CAU', 'ef');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTON010-VfcKhjEEz7Ug07QfUC5nXGhbg6sxg&usqp=CAU', 'ef');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHzsQJZuCFD-INe1uWkgPpsJyvdnoHjgdjtA&usqp=CAU', 'tr');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0MfUiLFupSNSSN9jk2twnqFjfmbXqZlX6Xg&usqp=CAU', 'sp');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0MfUiLFupSNSSN9jk2twnqFjfmbXqZlX6Xg&usqp=CAU', 'sp');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0MfUiLFupSNSSN9jk2twnqFjfmbXqZlX6Xg&usqp=CAU', 'sp');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnbsDp9OHTB6znDxXt7iudo466GAd8ZPj2tA&usqp=CAU', 'tr');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnbsDp9OHTB6znDxXt7iudo466GAd8ZPj2tA&usqp=CAU', 'tr');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnbsDp9OHTB6znDxXt7iudo466GAd8ZPj2tA&usqp=CAU', 'tr');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0z7KjgSws16J0HwSB0Lg1ghJgHEA3pX5Ofw&usqp=CAU', 'ef');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0z7KjgSws16J0HwSB0Lg1ghJgHEA3pX5Ofw&usqp=CAU', 'ef');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0z7KjgSws16J0HwSB0Lg1ghJgHEA3pX5Ofw&usqp=CAU', 'ef');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRneTcBf_YfhsPDMswDAR8fpiTJ7QF83YzC8g&usqp=CAU', 'ef');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl3eUGPIF-e1hByoLwI1UjNhW1t9_LKYxS_A&usqp=CAU', 'pe');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSETSrQ49B6qWfBzQX4u_RUbrvdttSYzTX6Ww&usqp=CAU', 'pe');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3iCQBLxjaOuj0CmVL2wiH8jXWVjKu5ekC4g&usqp=CAU', 'fu');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL6fkllT2FBwl0FqD2NyL8Lw4_S-AzrhyHLQ&usqp=CAU', 'li');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpI82lCclbV2qJSKA5pFEZAueYxX9LmcBg3A&usqp=CAU', 'fu');
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpI82lCclbV2qJSKA5pFEZAueYxX9LmcBg3A&usqp=CAU', 'fu');
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpI82lCclbV2qJSKA5pFEZAueYxX9LmcBg3A&usqp=CAU', 'fu');
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVo_V3iWbXgplFAwFO6oI9OGSlz_Dkvqy3aA&usqp=CAU', 'ef');
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT19bxVV0V_YKYbO6-Poa-S-mxQRm0AHAShDw&usqp=CAU', 'fu');
        createCardElement('card27', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz0gek4QtZNv5RCRYEc-TrjwK5fTjbMwiC1Q&usqp=CAU', 'ef');
        createCardElement('card28', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz0gek4QtZNv5RCRYEc-TrjwK5fTjbMwiC1Q&usqp=CAU', 'ef');
        createCardElement('card29', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz0gek4QtZNv5RCRYEc-TrjwK5fTjbMwiC1Q&usqp=CAU', 'ef');
        createCardElement('card30', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqcvcXJfr-9hO7oFQc1GzLO5HUPgVedk1IOg&usqp=CAU', 'ef');
        createCardElement('card31', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqcvcXJfr-9hO7oFQc1GzLO5HUPgVedk1IOg&usqp=CAU', 'ef');
        createCardElement('card32', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqcvcXJfr-9hO7oFQc1GzLO5HUPgVedk1IOg&usqp=CAU', 'ef');
        createCardElement('card33', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQTu-sVT3ODpbghY4Hd7woLBkmvO51XgARQQ&usqp=CAU', 'fu');
        createCardElement('card34', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQTu-sVT3ODpbghY4Hd7woLBkmvO51XgARQQ&usqp=CAU', 'fu');
        createCardElement('card35', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQTu-sVT3ODpbghY4Hd7woLBkmvO51XgARQQ&usqp=CAU', 'fu');
        createCardElement('card36', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbZyvxcaWEW_NS9LNAAhVLvOi3uwk54oJsVA&usqp=CAU', 'ef');
        createCardElement('card37', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbZyvxcaWEW_NS9LNAAhVLvOi3uwk54oJsVA&usqp=CAU', 'ef');
        createCardElement('card38', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbZyvxcaWEW_NS9LNAAhVLvOi3uwk54oJsVA&usqp=CAU', 'ef');
        createCardElement('card39', 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQzruhXGATwwRVQnVTry8XxJVHc0LLPfuAUmAY_K-ZU5DvjDI_zvPqRnf4lmZooDmA2xBQZKaDLBpbVS9CqCkBDNgrDmR1CSJvlxtmMvE0i&usqp=CAE', 'fu');
        createCardElement('card40', 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTiMcTvstO7mYOyAoary_wBTnlTjC40BG-mK939KgwuCgC4sw_qJhTtCFLqvETIhjQdx43iCVyCVJ29jaacd5deoU8xbcECsLA9MkcU8wzK&usqp=CAE', 'li');
        createCardElement('card41', 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSEYT7OrYuwVFBH9FdgXiYgzuIifrjmbqJe1dNNP2g8IfyKYFshHS_J-znhwNFG--R8Dgs6RC2pgDG439QT2ZA0yRf0TYtw8c3AIULLcJ5i&usqp=CAE', 'sp');
        createCardElement('card42', 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSG7YKMmAvtx6a89OPj_-lak95jEe2PO09r_oYiGyNMaRLJEApR_uf13wGOzREwQFm5YvFhX0ASbmCnZmurr9i6kc9oGLg_BD_7tAyyA-s&usqp=CAE', 'ef');
        createCardElement('card43', 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSG7YKMmAvtx6a89OPj_-lak95jEe2PO09r_oYiGyNMaRLJEApR_uf13wGOzREwQFm5YvFhX0ASbmCnZmurr9i6kc9oGLg_BD_7tAyyA-s&usqp=CAE', 'ef');
        createCardElement('card44', 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSG7YKMmAvtx6a89OPj_-lak95jEe2PO09r_oYiGyNMaRLJEApR_uf13wGOzREwQFm5YvFhX0ASbmCnZmurr9i6kc9oGLg_BD_7tAyyA-s&usqp=CAE', 'ef');
        createCardElement('card45', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo2nXrTyv_Gp257VF31-_RCC_vgyuz38pIzA&usqp=CAU', 'ef');
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2SJddq-mhaNd2rs-SLhg63FlHe_b8SibHRQ&usqp=CAU';
        sessionStorage.setItem('selectedProtectorUrl', optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdjcvUa9mFPPFLFD6h4zSQ52MA5-52OqrYzA&usqp=CAU';
        sessionStorage.setItem('selectedBackgroundUrl', optionalBackgroundUrl);
        location.reload();
      }
      break;
    //インフェルノイド
    case 'Infernoid':
      {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgOp-uqcwZiL_V9IiGk1bXSscTfQZ6qSyBGQ&usqp=CAU', 'sp');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHI85qBRewxGcFzh0iI0MKw3Kdq8RDN17HuQ&usqp=CAU', 'ef');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2pmwJjdYpCjNwHWq-u72vNLCbdqNeuTZhBQ&usqp=CAU', 'fu');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNcFZvzoxZVnsCFEmPBiRNVNndNqJ58o8jeA&usqp=CAU', 'ef');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGEudFlLDrrDqAdFiOd8_G88v4psX5WKKq7Q&usqp=CAU', 'ef');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpHnUy-_74NFriN8rUDkOXA3YGcl5ziFPs4w&usqp=CAU', 'ef');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTji6Ams13300c8AYc2bodZFuTM3zMbxQZzcA&usqp=CAU', 'ef');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDeMRZnasC2G9maCK-SqU6XSywejHVP736Sw&usqp=CAU', 'ef');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJTvXDJgfjItirhppoMCLKcL5ht3uEIe1kHw&usqp=CAU', 'ef');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0aCbD87HtVXP3luz2Iyw4MtaB9AQzPRodfg&usqp=CAU', 'ef');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUFlpr_zV7_JcFkC7S14YAVo-PdUFDHFYWTg&usqp=CAU', 'sp');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6Ub4QVvxLn1RyyDGSXLhlFihwkaPf4YveGg&usqp=CAU', 'sp');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8GM3jUha9qS-L7MDD_QjHH1LIeqfGoc0-oQ&usqp=CAU', 'tr');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI-ReUE7mPUGymoAjUUD4KnKFO4baSi51_CQ&usqp=CAU', 'tr');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwJPBHoqWrhrz9UsCTc8KH2WrWBHGpC9rpKA&usqp=CAU', 'sp');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzRkNNpm1JHvBYHe4CixnM1r1J2JgUycgpCQ&usqp=CAU', 'sp');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROIVI0dj8dIpCEkge9qgTuQqzMJHqXeVYdhg&usqp=CAU', 'tr');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShdcLz-Kf7QANj_m6sEHIaOLHBejZRmWEl8A&usqp=CAU', 'sp');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4w44UEsc81z9dgzIAcv3LhFcaG56fg0cSNw&usqp=CAU', 'ef');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzijIZrnH8--Eywh5LfE3PnRtfkCldyBcsbQ&usqp=CAU', 'ef');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTXE1VsvwfzJ8SXe-KiIZzRDI9kAc8_hSpzQ&usqp=CAU', 'ef');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgQwmz7oJ5hrFeCksXnFc9xr5TYFz-tusmqA&usqp=CAU', 'ef');
        createCardElement('card23', 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSnk0eKbQxNx8yHtyrpmabvVMQCbtKGFoCUotzo1E-VrILxDBb2F1CcLC2_wSvL2BpZtWe4Q-smQ6S7ebEzzoDEXTYfb3CgYfelcefwKmw0&usqp=CAE', 'fu');
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE2_6SCvJTus9rxvUyi1x24KYWiPM4A5I1Tw&usqp=CAU', 'li');
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5GehX6VykqrKyrD9ZwcizPaOs1sKl4QODhA&usqp=CAU', 'sp');
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMf7r1z5-kxVrMp3dZuMIFtWyVVrjKnp65Rw&usqp=CAU', 'sp');
        createCardElement('card27', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk4_0TtK_0KS_4p4vpCqoVia3pjhM3QiXIsA&usqp=CAU', 'li');
        createCardElement('card28', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSj442ksdiNoJJjo0i61qaW6VfWq6f1Yh38Tw&usqp=CAU', 'li');
        createCardElement('card29', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZbkMRe6pCXPL_ZyBd1ExmGx8vo54E4U61iw&usqp=CAU', 'ef');
        createCardElement('card30', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLxo5jvNJllx0kMZFlwmRT0bK6mgbmnmcZzw&usqp=CAU', 'li');
        createCardElement('card', 'あ', 'い');
        createCardElement('card', 'あ', 'い');
        createCardElement('card', 'あ', 'い');
        createCardElement('card', 'あ', 'い');
        createCardElement('card', 'あ', 'い');
        createCardElement('card', 'あ', 'い');

        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2SJddq-mhaNd2rs-SLhg63FlHe_b8SibHRQ&usqp=CAU';
        sessionStorage.setItem('selectedProtectorUrl', optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe22fYsktvPbiSOrfrJW2SJFiFDrw4E6gY9g&usqp=CAU';
        sessionStorage.setItem('selectedBackgroundUrl', optionalBackgroundUrl);
        location.reload();
      }
      break;
    //オルターガイスト
    case 'Altergeist':
      {
        sessionStorage.clear();
        createCardElement('card1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQgKErtdVHHZSpIol5adTcAJDPSJvuqqQuEw&usqp=CAU', 'li');
        createCardElement('card2', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7zItuLEXG6NUIbPU8GkTQQGdw3FfWg1dHXg&usqp=CAU', 'li');
        createCardElement('card3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7zItuLEXG6NUIbPU8GkTQQGdw3FfWg1dHXg&usqp=CAU', 'li');
        createCardElement('card4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaTl9VTcFpUn7eBQzpYNHKkHDCt61fWDn-IA&usqp=CAU', 'ef');
        createCardElement('card5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaTl9VTcFpUn7eBQzpYNHKkHDCt61fWDn-IA&usqp=CAU', 'ef');
        createCardElement('card6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaTl9VTcFpUn7eBQzpYNHKkHDCt61fWDn-IA&usqp=CAU', 'ef');
        createCardElement('card7', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj5l_Vv6R8ogiJumnvD25NNmur9jpXipWMvw&usqp=CAU', 'ef');
        createCardElement('card8', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj5l_Vv6R8ogiJumnvD25NNmur9jpXipWMvw&usqp=CAU', 'ef');
        createCardElement('card9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj5l_Vv6R8ogiJumnvD25NNmur9jpXipWMvw&usqp=CAU', 'ef');
        createCardElement('card10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE4YIVvZCQq7s_ZvvOthNw0MPdzzRn1pDOKg&usqp=CAU', 'ef');
        createCardElement('card11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPFcbHktbhD4p-hqPbx5J9SJZ6EpJ4IRRKZQ&usqp=CAU', 'sy');
        createCardElement('card12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH3sUlfFEWxgfbsIrYPQV6pobkcRajUfrs1Q&usqp=CAU', 'li');
        createCardElement('card13', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6IkMiy_KMeYAk316AyQawFmSthu3nCT7aaA&usqp=CAU', 'ef');
        createCardElement('card14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTK7-FW2wzAENkQ5fhP2SS7ryNbFeZUjLlBg&usqp=CAU', 'tr');
        createCardElement('card15', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS85VgVlMIKtoioX8TdOuGShD_yJyrshUnhHg&usqp=CAU', 'ef');
        createCardElement('card16', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS85VgVlMIKtoioX8TdOuGShD_yJyrshUnhHg&usqp=CAU', 'ef');
        createCardElement('card17', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS85VgVlMIKtoioX8TdOuGShD_yJyrshUnhHg&usqp=CAU', 'ef');
        createCardElement('card18', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqZlYPzsmH47pZJVkpGwtdTZqc0Wnfr-Z_YA&usqp=CAU', 'li');
        createCardElement('card19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQejv32Cgs8_HzxekMHGkW76O5sS9YimHjtvQ&usqp=CAU', 'tr');
        createCardElement('card20', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTecgiS7VpH_9t5aY-cbH5BTaFuOeTmBjgndw&usqp=CAU', 'tr');
        createCardElement('card21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbeZFgbEq6h8-MJFM_6q4pY0aJAf-2i0GDOA&usqp=CAU', 'ef');
        createCardElement('card22', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbeZFgbEq6h8-MJFM_6q4pY0aJAf-2i0GDOA&usqp=CAU', 'ef');
        createCardElement('card23', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbeZFgbEq6h8-MJFM_6q4pY0aJAf-2i0GDOA&usqp=CAU', 'ef');
        createCardElement('card24', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7OwWDcW5UIgki7JmPBKXwaUcqZbaDMTxTow&usqp=CAU', 'ef');
        createCardElement('card25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLLP-nEMF4nFAas8fHBUrPit4z7D_L1hjZEA&usqp=CAU', 'tr');
        createCardElement('card26', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLLP-nEMF4nFAas8fHBUrPit4z7D_L1hjZEA&usqp=CAU', 'tr');
        createCardElement('card27', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLLP-nEMF4nFAas8fHBUrPit4z7D_L1hjZEA&usqp=CAU', 'tr');
        createCardElement('card28', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSBtGN9A8oRw7JBl9sZhrtOf3OA6qJex0mQg&usqp=CAU', 'tr');
        createCardElement('card29', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSi_O2tpxWEWYKilDBCOgcW0KZPmqravbx71Q&usqp=CAU', 'ef');
        createCardElement('card30', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXu1kyURoVM8a4Fe-W9VeNgjjUYP8zCL4s0g&usqp=CAU', 'li');
        createCardElement('card31', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYUi0qtCoNZaDQU-9xTu3HXWa-1mhl_V5LyA&usqp=CAU', 'ef');
        createCardElement('card32', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAA8oP0Ab2XGtr1bZzir_bcvgy8ng1XB-wZg&usqp=CAU', 'ef');
        createCardElement('card33', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK8-8SCFDBIMLaPqkF1rhw3bfSHpEIBDylnA&usqp=CAU', 'ef');
        createCardElement('card34', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSqXBMMp8wnHQaCQazoa9_U-Ap6pmY260bFQ&usqp=CAU', 'tr');
        createCardElement('card35', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSqXBMMp8wnHQaCQazoa9_U-Ap6pmY260bFQ&usqp=CAU', 'tr');
        createCardElement('card36', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSqXBMMp8wnHQaCQazoa9_U-Ap6pmY260bFQ&usqp=CAU', 'tr');
        createCardElement('card37', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYeRu81ukJ7LK14A_lUkjZxvC3xqWydYOXcQ&usqp=CAU', 'tr');
        createCardElement('card38', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYeRu81ukJ7LK14A_lUkjZxvC3xqWydYOXcQ&usqp=CAU', 'tr');
        createCardElement('card39', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYeRu81ukJ7LK14A_lUkjZxvC3xqWydYOXcQ&usqp=CAU', 'tr');
        createCardElement('card40', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnrD_2yRPzPf2tdlRW_NrfDTVcKS4gzRAUaA&usqp=CAU', 'tr');
        createCardElement('card41', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiFi_FCNkzob7fSQXTo7u-jCuc-TtUJrvjYw&usqp=CAU', 'sp');
        createCardElement('card42', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl2l2HM7yLLYIo13Dy9GsDk4ZH4J3dc0j1sA&usqp=CAU', 'li');
        createCardElement('card43', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrtE8JbAXXvkVCFpiaaWayOHb1HTVQ9zHJmQ&usqp=CAU', 'li');
        const optionalProtectorUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3FbsJdlfOoocmaWxbaiBkQQouGEbk-4sILQ&usqp=CAU';
        sessionStorage.setItem('selectedProtectorUrl', optionalProtectorUrl);
        const optionalBackgroundUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8xGdZdnbC6fqCoMLDzHVrTfxdIdrp3rp0Xw&usqp=CAU';
        sessionStorage.setItem('selectedBackgroundUrl', optionalBackgroundUrl);
        location.reload();
      }
      break;
  }
});
//APIでカードを出現させる
const inputTextBox = document.getElementById('inputTextBox'); // input要素を取得する
const cardBoard = document.getElementById('cardBoard'); // img要素を作成するためのdiv
const searchButton = document.getElementById('searchButton');
async function fetchData() {
  const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(inputTextBox.value)}&searchType=image`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('エラーが発生しました');
    }
    const data = await response.json();
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
  } catch (error) {
    alert('カード生成ができませんでした。以下の点をご確認ください。○正しいAPIキーが登録されているか ○正しい検索エンジンIDが登録されているか  ○検索結果が1件以上あるか');
  }
}
searchButton.addEventListener('click', () => {
  fetchData();
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
    let maxZIndex = Math.max(...Array.from(document.querySelectorAll('.cards')).map(obj => obj.style.zIndex));
    card.style.zIndex = ++maxZIndex;
    card.style.opacity = 0.5;
  } else if (!document.querySelector('.clickedCard') && !document.querySelector('.clickedZone')) {
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
        if (zone.style.opacity === '0.75') {
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
        const howManyCardsInOneRow = 6; // 1列の中で表示したいカードの数
        const howManyRows = Math.ceil(overlappingObjects.length / howManyCardsInOneRow); // 列の数
        let topOffset = zoneRect.top + 10; //微調整
        let leftOffset = zoneRect.left + 22; //微調整
        let howManyCardsInOneRowCounter = 0;
        let howManyRowsCounter = 1;
        overlappingObjects.sort((first, second) => first.style.zIndex - second.style.zIndex) //overlappingObjects配列内のimgタグをzIndexが小さい順に並び替えておく
        if (zoneRect.left > 460) {
          //対象ゾーンが右側のときは一覧表示は左下方向に広がる
          for (const object of overlappingObjects) {
            let maxZIndex = Math.max(...Array.from(document.querySelectorAll('.cards')).map(obj => obj.style.zIndex));
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
            let maxZIndex = Math.max(...Array.from(document.querySelectorAll('.cards')).map(obj => obj.style.zIndex));
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
    playSound(soundMoveBuffer);
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
    let maxZIndex = Math.max(...Array.from(document.querySelectorAll('.cards')).map(obj => obj.style.zIndex));
    clickedCard.style.zIndex = ++maxZIndex;
    setTimeout(() => {
      playSound(soundActivateBuffer);
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
          zIndex: clickedCard.style.zIndex,
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
      },
        1000);
    }, 300);
  }
});
//カード発光（効果発動）
const actionActivateEffect = document.getElementById('actionActivateEffect');
actionActivateEffect.addEventListener('click', () => {
  if (document.querySelector('.clickedCard') && !document.querySelector('.clickedZone')) {
    const clickedCard = document.querySelector('.clickedCard');
    playSound(soundActivateBuffer);
    let maxZIndex = Math.max(...Array.from(document.querySelectorAll('.cards')).map(obj => obj.style.zIndex));
    clickedCard.style.zIndex = ++maxZIndex;
    clickedCard.style.opacity = '1';
    //現在の transform の値を取得する
    const currentTransform = clickedCard.style.transform;
    //ログに移動情報を追加
    const log = {
      actionType: 'glowCard',
      cardId: clickedCard.id,
      zIndex: clickedCard.style.zIndex,
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
      },
        1000);
    }, 150);
  }
});
//カード移動＆拡大（モンスター召喚）
const actionMoveAndZoom = (imageUrl, rotation) => {
  if (document.querySelector('.clickedCard') && document.querySelector('.clickedZone')) {
    //音を鳴らす
    playSound(soundSummonBuffer);
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
    let maxZIndex = Math.max(...Array.from(document.querySelectorAll('.cards')).map(obj => obj.style.zIndex));
    clickedCard.style.zIndex = ++maxZIndex;
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
          zIndex: clickedCard.style.zIndex,
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
      },
        400);
    }, 300);
  }
};
document.getElementById('action0FaceupMoveAndZoom').addEventListener('click', () => {
  const clickedCard = document.querySelector('.clickedCard');
  actionMoveAndZoom(clickedCard.dataset.src,
    0);
});
document.getElementById('action90FaceupMoveAndZoom').addEventListener('click', () => {
  const clickedCard = document.querySelector('.clickedCard');
  actionMoveAndZoom(clickedCard.dataset.src,
    -90);
});
document.getElementById('action180FaceupMoveAndZoom').addEventListener('click', () => {
  const clickedCard = document.querySelector('.clickedCard');
  actionMoveAndZoom(clickedCard.dataset.src,
    -180);
});
document.getElementById('action0FacedownMoveAndZoom').addEventListener('click', () => {
  actionMoveAndZoom(reversedCardUrl,
    0);
});
document.getElementById('action90FacedownMoveAndZoom').addEventListener('click', () => {
  actionMoveAndZoom(reversedCardUrl,
    -90);
});
document.getElementById('action180FacedownMoveAndZoom').addEventListener('click', () => {
  actionMoveAndZoom(reversedCardUrl,
    -180);
});
//カード移動
const actionMove = (imageUrl, rotation) => {
  if (document.querySelector('.clickedCard') && document.querySelector('.clickedZone')) {
    //音を鳴らす
    playSound(soundMoveBuffer);
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
    let maxZIndex = Math.max(...Array.from(document.querySelectorAll('.cards')).map(obj => obj.style.zIndex));
    clickedCard.style.zIndex = ++maxZIndex;
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
        zIndex: clickedCard.style.zIndex,
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
    },
      500);
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
  playSound(soundMessageBuffer);
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
commentArea.addEventListener('input', ()=> {
  const textLength = commentArea.value.length;
  let fontSize = 25; // デフォルトのフォントサイズ
  if (textLength > 120) {
    fontSize = 25;
  } else if (textLength > 185) {
    fontSize = 20;
  }
  commentArea.style.fontSize = fontSize + 'px';
});
//注意喚起などの永続的な文を保存する
const saveAttentionButton = document.getElementById('saveAttentionButton');
const attentionArea = document.getElementById('attentionArea');
saveAttentionButton.addEventListener('click', () => {
  //音を鳴らす
  playSound(soundMessageBuffer);
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
attentionArea.addEventListener('input', () => {
  const textLength = attentionArea.value.length;
  let fontSize = 25; // デフォルトのフォントサイズ
  if (textLength > 120) {
    fontSize = 25;
  } else if (textLength > 185) {
    fontSize = 20;
  }
  attentionArea.style.fontSize = fontSize + 'px';
});
//操作ミスして戻したいとき
const undoButton = document.getElementById('undoButton');
undoButton.addEventListener('click', () => {
  playSound(soundUndoBuffer);
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
      let maxZIndex = Math.max(...Array.from(document.querySelectorAll('.cards')).map(obj => obj.style.zIndex));
      const undoZIndex = ++maxZIndex;
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
    //一時的なコメントがずっと表示されるのを防ぐ関数
    const hideComment = () => {
      if (
        index >= 4 && logs[index - 4].actionType === "saveComment" && logs[index - 3].actionType !== "saveComment" && logs[index - 2].actionType !== "saveComment" && logs[index - 1].actionType !== "saveComment"
      ) {
        commentArea.value = '';
      }
    }
    //指定した時間間隔でログ再生する
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
        hideComment();
        playSound(soundMoveBuffer);
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
        hideComment();
        playSound(soundSummonBuffer);
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
        hideComment();
        playSound(soundMoveBuffer);
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
          playSound(soundActivateBuffer);
          // 時間をおいてからcardを表示させる
          replayedCard.style.opacity = '1';
          // 光らせる
          replayedCard.classList.add(animationType);
          setTimeout(() => {
            replayedCard.classList.remove(animationType);
          }, 1000);
        }, 300);
      } else if (actionType === 'glowCard') {
        hideComment();
        playSound(soundActivateBuffer);
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
        playSound(soundMessageBuffer);
        commentArea.value = ''; //一度点滅させる
        commentArea.value = text;
        const textLength = commentArea.value.length;
        let fontSize = 25; // デフォルトのフォントサイズ
        if (textLength > 120) {
          fontSize = 25;
        } else if (textLength > 185) {
          fontSize = 20;
        }
        commentArea.style.fontSize = fontSize + 'px';
        //setTimeOut(()=> {
        //  commentArea.value = ''; //一時的なコメントを一定期間後に見えなくする
        //}, index * secValue * 2) //1.4秒区切りなら2.8秒後に消えるようにする
      } else if (actionType === 'attentionComment') {
        hideComment();
        playSound(soundMessageBuffer);
        attentionArea.value = '';
        attentionArea.value = text;
        const textLength = attentionArea.value.length;
        let fontSize = 25; // デフォルトのフォントサイズ
        if (textLength > 120) {
          fontSize = 25;
        } else if (textLength > 185) {
          fontSize = 20;
        }
        attentionArea.style.fontSize = fontSize + 'px';
      } else if (actionType === 'displayMyLifePoint') {
        hideComment();
        myLifePointBox.style.opacity = '0';
        setTimeout(() => {
          myLifePointBox.innerHTML = text;
          myLifePointBox.style.opacity = '1';
        }, 500);
      } else if (actionType === 'displayOpponentLifePoint') {
        hideComment();
        opponentLifePointBox.style.opacity = '0';
        setTimeout(() => {
          opponentLifePointBox.innerHTML = text;
          opponentLifePointBox.style.opacity = '1';
        }, 500);
      }
    },
      index * secValue);
  }
});