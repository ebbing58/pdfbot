(function () {
  "use strict";

  //LINE Developers上で作成したLINEloginチャネルのLIFFID
  const myLiffId = "1656016374-B3R46pwP";

  //
  // 全体定義
  //
  window.onload = () => {
    // LIFFアプリを初期化
    initializeLiff(myLiffId);
    // OKボタン押下時の処理
    document.getElementById("registBtn").onclick = sendMessage();
    // キャンセルボタン押下時の処理
    document.getElementById("cancelBtn").onclick = () => {
      liff.closeWindow();
    };
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
      })
      .catch((err) => {
        // エラーメッセージを表示して停止
        showErrorAndStop(err);
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
   * LINEトークルーム上にユーザ発言のメッセ―ジを返す
   */
  function sendMessage() {
    // メッセージを作成
    const gmailAddress =
      document.getElementById("gmailAddress").value + "@gmail.com";
    const flexMessage = createFlexMessage(gmailAddress);

    // メッセージを送信
    liff
      .sendMessages([flexMessage])
      .then(() => {
        console.log("message sent");
        alert("message sent");
      })
      .catch((err) => {
        console.log("error", err);
        alert(err);
      })
      .finally(() => {
        liff.closeWindow();
      });
  }

  function createFlexMessage(gmailAddress) {
    const bodyText = `${gmailAddress}を登録してよろしいですか？`;

    let flexMessage = {
      type: "flex",
      altText: "this is a flex message",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "登録確認",
            },
          ],
        },
        // TODO: gmailのアイコンを表示したら素敵
        // hero: {
        //   type: "image",
        //   url: "https://example.com/flex/images/image.jpg",
        // },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: bodyText,
            },
          ],
        },
        footer: {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "button",
              action: {
                type: "postback",
                label: "登録する",
                data: "action=regist&confirm=true",
                text: "登録する",
              },
              style: "primary",
              color: "#0000ff",
            },
            {
              type: "button",
              action: {
                type: "postback",
                label: "キャンセル",
                data: "action=regist&confirm=false",
                text: "キャンセル",
              },
              style: "secondary",
              color: "#0000ff",
            },
          ],
        },
      },
    };

    return flexMessage;
  }
})();
