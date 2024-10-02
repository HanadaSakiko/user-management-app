// server/routes/userRoutes.js

// Expressモジュールをインポートして、ルーター機能を使用可能にする
const express = require('express');

// ユーザー関連のコントローラをインポートする（このファイルは後で追加します。）
const userController = require('../controllers/userController');

// Expressのルーターオブジェクトを作成する
//Routerは、Expressアプリのルーティングをモジュール化するためのミドルウェア
//ルーティングを他で使用できるようにするための機能　express.Router()
const router = express.Router();

// ユーザーを作成するためのルートを設定する (POSTリクエスト)
router.post('/users', userController.createUser);

// すべてのユーザーを取得するためのルートを設定する (GETリクエスト)
router.get('/users', userController.getUsers);

// 指定されたIDのユーザーを更新するためのルートを設定する (PUTリクエスト)
router.put('/users/:id', userController.updateUser);

// 指定されたIDのユーザーを削除するためのルートを設定する (DELETEリクエスト)
router.delete('/users/:id', userController.deleteUser);

// ログイン機能のルートを設定する (POSTリクエスト)
router.post('/login', userController.loginUser);

//ユーザー名を使用して検索するためのルートを設定する
//TODO:userController.の後にController側での検索メソッドを記載する
// router.get('/users/search', userController.メソッド);

// ルーターオブジェクトをエクスポートして、他のモジュールで使用できるようにする
module.exports = router;
