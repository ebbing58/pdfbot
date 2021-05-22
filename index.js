"use strict";

//LINE Developers上で作成したLINEloginチャネルのLIFFID
const myLiffId = "1656016374-B3R46pwP";

//
// 全体定義
//
window.onload = () => {
  // LIFFアプリを初期化
  initializeLiff(myLiffId);
};

/**
 * LIFFアプリの初期化
 */
function initializeLiff(myLiffId) {
  // liff.initにより初期化
  liff
    .init({
      liffId: myLiffId,
    })
    .then(() => {
      // promise返却後、各種初期化処理を実行
      initializeApp();
      // OKボタン押下時の処理
      document.getElementById("registBtn").onclick = sendMessage;
      // キャンセルボタン押下時の処理
      document.getElementById("cancelBtn").onclick = () => {
        liff
          .sendMessages([
            {
              type: "text",
              text: liff.getIDToken(),
            },
          ])
          .then(() => {
            liff.closeWindow();
          });
      };
    })
    .catch((err) => {
      // エラーメッセージを表示して停止
      const msg = document.getElementById("message");
      msg.innerText = "エラーが発生しました";
      msg.classList.remove("alert-info");
      msg.classList.add("alert-denger");
      const btn = document.getElementById("registBtn");
      btn.disabled = true;
    });
}

/**
 * 初期化処理、LINEアプリ以外からの起動の場合エラー
 */
function initializeApp() {
  if (liff.isInClient() && liff.isLoggedIn()) {
  } else {
    // LINEからの利用でない場合に、次に進めなくする
    const msg = document.getElementById("message");
    msg.innerText = "LINEアプリから操作する必要があります。";
    msg.classList.remove("alert-info");
    msg.classList.add("alert-denger");
    const btn = document.getElementById("registBtn");
    btn.disabled = true;
  }
}

/**
 * LINEトークルーム上にメッセ―ジを送信
 */
function sendMessage() {
  // LINE公式アカウントからの送信
  sendFromOfficialAccount()
    // トークルームにユーザメッセージを表示
    .then((response) => sendByUser())
    // 正常終了すれば閉じる
    .then(() => {
      liff.closeWindow();
    })
    .catch((error) => {
      console.error("Error:", error);
      let msg = document.createElement("DIV");
      msg.setAttribute("role", "alert");
      msg.classList.value = "alert alert-danger";
      msg.innerText = "エラーが発生";
      document.getElementById("msgArea").appendChild(msg);
    });
}

/**
 * LINE公式アカウントからの送信
 */
function sendFromOfficialAccount() {
  alert("3");
  let url =
    "https://asia-northeast2-kintonetoline.cloudfunctions.net/gmailRegistConfirmation";

  // メッセージを作成
  const gmailAddress =
    document.getElementById("gmailAddress").value + "@gmail.com";
  const body = JSON.stringify({
    IDToken: liff.getIDToken(),
    gmailAddress: gmailAddress,
  });
  const headers = {
    "Content-Type": "application/json",
  };
  const method = "POST";

  // 実行
  return fetch(url, { method: method, headers: headers, body: body }).then(
    (response) => {
      if (!response.ok) {
        return Promise.reject(
          new Error(`${response.status}: ${response.statusText}`)
        );
      } else {
        // JSONオブジェクトで解決されるPromiseを返す
        return response.json();
      }
    }
  );
}

/**
 * トークルームにユーザメッセージを表示
 */
function sendByUser() {
  return liff
    .sendMessages([
      {
        type: "text",
        text: "gmailのアドレスを送信",
      },
    ])
    .then(() => {
      return "success";
    })
    .catch((err) => {
      return err;
    });
}
