// public/main.js

// フォームの送信イベントを監視し、`addUser` 関数を実行する
// フォームに入力された情報を取得し、新しいユーザーをサーバーに登録する
document.getElementById('userForm').addEventListener('submit', addUser);

// ユーザーを追加するための関数
// `e` はイベントオブジェクトを表し、フォーム送信時のデフォルト動作を防止するために使用する
function addUser(e) {
    // フォームのデフォルトの送信動作（ページのリロード）を防止
    e.preventDefault();

    // フォーム内の各入力要素の値を取得
    // ユーザーの名前、メールアドレス、パスワードを取得し、それぞれの変数に格納
    const name = document.getElementById('name').value;       // ユーザー名
    const email = document.getElementById('email').value;     // メールアドレス
    const password = document.getElementById('password').value; // パスワード

    // `axios` を使用して、新しいユーザーをサーバーに登録する
    // サーバーに `POST` リクエストを送信し、ユーザー情報をデータベースに保存
    axios.post('http://localhost:3000/api/users', {
        name: name,       // 名前
        email: email,     // メールアドレス
        password: password // パスワード
    })
    .then(response => {
        // サーバーからのレスポンスを受け取ったら、ユーザーが正常に追加されたことを示すメッセージを表示
        alert(response.data.message);

        // 新しいユーザーが追加されたので、最新のユーザーリストを取得して表示
        getUsers();
    })
    .catch(error => {
        // リクエスト中にエラーが発生した場合は、エラーメッセージをコンソールに表示
        console.error('Error:', error);
    });
}

// すべてのユーザーを取得して、ユーザーリストを表示する関数
function getUsers() {
    // `axios` を使用して、サーバーからすべてのユーザー情報を取得する
    // サーバーに `GET` リクエストを送信し、ユーザーリストを取得
    axios.get('http://localhost:3000/api/users')
        .then(response => {
            // サーバーから取得したユーザーリストを `users` 変数に格納
            const users = response.data;

            // HTML 内のユーザーリスト表示用の要素を取得
            const userList = document.getElementById('userList');

            // 現在のユーザーリスト表示をクリア（古いリストを消去）
            userList.innerHTML = '';

            // 各ユーザーの情報をリストアイテムとして表示
            users.forEach(user => {
                // ユーザー情報を格納する `<li>` 要素を作成
                const li = document.createElement('li');

                // リストアイテムの内容を設定
                // ユーザー名、メールアドレス、更新リンク、および削除ボタンを表示
                li.innerHTML = `
                    ${user.name} (${user.email})
                    <a href="update.html?id=${user.id}">Update</a>    <!-- 更新用リンク。クリックすると update.html ページに移動し、指定されたユーザーIDの編集が可能 -->
                    <button onclick="deleteUser(${user.id})">Delete</button>    <!-- 削除ボタン。クリックすると deleteUser 関数が実行され、ユーザーが削除される -->
                `;

                // 作成した `<li>` 要素をユーザーリストの表示要素に追加
                userList.appendChild(li);
            });
        })
        .catch(error => {
            // ユーザー情報の取得中にエラーが発生した場合、エラーメッセージをコンソールに表示
            console.error('Error:', error);
        });
}

// 指定された ID のユーザーを削除する関数
function deleteUser(id) {
    // `axios` を使用して、指定された ID のユーザーを削除する
    // サーバーに `DELETE` リクエストを送信し、該当するユーザーをデータベースから削除
    axios.delete(`http://localhost:3000/api/users/${id}`)
        .then(response => {
            // サーバーから削除成功のレスポンスを受け取ったら、削除完了のメッセージを表示
            alert(response.data.message);

            // ユーザーが削除されたので、最新のユーザーリストを取得して表示
            getUsers();
        })
        .catch(error => {
            // ユーザー削除中にエラーが発生した場合、エラーメッセージをコンソールに表示
            console.error('Error:', error);
        });
}

// ページが最初にロードされたときに `getUsers` 関数を実行し、初期状態でユーザーリストを表示する
// ページ読み込み時にすべてのユーザー情報を取得して、表示を行う
getUsers();

//検索ボタンが押された時にユーザー検索の関数が発火するようにする
searchButton.addEventListener('click', SearchUsers);

//検索ボタンが再び押されたとき、結果をリセットする
searchButton.addEventListener('click', ResetResult);
//検索結果表示エリアのul要素のidを取得
const searchUsers = document.getElementById('searchUsers');

//結果を何度も表示させることを防ぐ（ボタンを押下した際、ulの子要素のliをループさせて削除させる関数）
function ResetResult() {
  while (searchUsers.lastChild) {
    searchUsers.removeChild(searchUsers.lastChild);
  }
}

//ユーザーを検索し、取得されたユーザーをリストで表示する関数
async function SearchUsers() {
  const query = document.getElementById('searchInput').value;
  // //検索リクエストの送信し、検索結果をresponseに格納
  const response = await fetch(`http://localhost:3000/api/users/search?query=${encodeURIComponent(query)}`);
  //格納されたデータをjson形式にし、変数usersとする
  const users = await response.json();

  //@を除く特殊記号
  const reg = new RegExp(/[!"#$%&'()\*\+\-\.,\/:;<=>?\[\\\]^_`{|}~]/);

  //エラーハンドリング
  if (!query) {
    searchUsers.insertAdjacentHTML("beforeend", `<li>検索条件が必要です</li>`);
  } else if (
    reg.test(query)
  ){
    searchUsers.insertAdjacentHTML("beforeend", `<li>検索結果に記号空白を含まないようにしてください</li>`);
  } else if (users.length === 0) {
    searchUsers.insertAdjacentHTML("beforeend", `<li>該当するユーザーが見つかりませんでした</li>`);
  } else {
    //検索されたユーザーをリストで一覧表示
    await users.forEach(user => {
      searchUsers.insertAdjacentHTML("beforeend", `<li>${user.name} ${user.email}</li>`);
    });
  }
}

//検索ボタンが押された際にユーザー検索SearchUsers関数が実行され、リストに表示される
SearchUsers();
