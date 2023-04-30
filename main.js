enchant(); // ライブラリーの初期化
window.onload = function(){
  //box2dのための変数の追加
  var world;
  var gty=100/10; //Gravity works firmly by setting to 100

  var game = new Game(240, 320); // 240×320画面(Canvas)を作成
  game.fps = 30; // フレームレートの設定。30fpsに設定
  game.preload("images/pad.png","images/soccer.jpg","images/soccer_stadium.jpg"); // 画像データをあらかじめ読み込ませる
  game.rootScene.backgroundColor = "#33cc33";  // ゲームの背景色を設定
  game.score = 0;  // スコアを入れる変数を用意する
  game.se = Sound.load("se8.wav"); //sound load
  game.se1 = Sound.load("se6.wav"); //sound load se1!!!

  // スコアを表示するラベルを作成1
  var scoreLabel = new Label("SCORE [スコア]: 0");
  scoreLabel.font = "20px Tahoma";
  scoreLabel.color = "blue";
  scoreLabel.x = 10; // X座標
  scoreLabel.y = 5; // Y座標
  game.rootScene.addChild(scoreLabel);

  // 傾きを表示するラベルを作成
  var sensorLabel = new Label("0");
  sensorLabel.font = "10px Tahoma";
  sensorLabel.color = "white";
  sensorLabel.x = 222;  // X座標
  sensorLabel.y = -100; // Y座標
  game.rootScene.addChild(sensorLabel);
  // データの読み込みが完了したら処理
  game.onload = function(){
    //box2dの世界の生成
    world = new PhysicsWorld(0, gty);

    // ボールの設定
    //box2dオブジェクトに変更
    //var ball = new Sprite(16, 16);
    var ball = new PhyCircleSprite(16, enchant.box2d.DYNAMIC_SPRITE, 1, 0, 1.001, true);

    ball.image = game.assets["images/soccer.jpg"];
    ball.x =200;  // X座標  //I right justified so that it would not be difficult to start.
    ball.y =0;  // Y座標
    ball.applyImpulse(new b2Vec2(gty*-0.2*Math.random(), 0));  //Falling from the right! No longer rely on the left wall!!
    ball.dx = -100; // X方向の移動量
    ball.dy = -100; // Y方向の移動量
    game.rootScene.addChild(ball);

    
    
    

    // パドルの設定
    //box2dオブジェクトに変更
    //var pad1 = new Sprite(32, 16);
    var pad1 = new PhyBoxSprite(45,45, enchant.box2d.STATIC_SPRITE, 1, 0, 1.01, true); //1.1 will gradually increase the repelling height
    pad1.image = game.assets["images/pad.png"];
    pad1.x = /*game.width/2*/111; // X座標 //I left justified so that it would not be difficult to start.
    pad1.y = /*game.height - 40*/270; // Y座標
    game.rootScene.addEventListener('touchstart', function(e) {
        pad1.x = e.x-16;
    });
    game.rootScene.addEventListener('touchmove', function(e) {
        pad1.x = e.x-16;
    });
    game.rootScene.addChild(pad1);

    //box2d用に壁の作成
    {
                var floor = new PhyBoxSprite(10, game.height*10000 , enchant.box2d.STATIC_SPRITE, 0, 0, 1.01, false); //The more you *, the higher the wall
                floor.backgroundColor = "green";
                floor.position = {
                        x: game.width,
                        y: game.height/20 
                }
                game.rootScene.addChild(floor);
                var floor = new PhyBoxSprite(10, game.height*10000, enchant.box2d.STATIC_SPRITE, 0, 0, 1.01, false);  //By changing from 1 to 1.01, the repelling strength is gradually increased
                floor.backgroundColor = "green";                                                                      //It disappears as the height rises, and the falling speed gradually increases
                floor.position = {
                        x: 0,
                        y: game.height/20
                }
                
                game.rootScene.addChild(floor);
    }

    // フレームイベントが発生したら処理
    game.rootScene.addEventListener(Event.ENTER_FRAME, function(){
      world.step(game.fps);
/*ballの移動はbox2dに任せる。
      ball.x = ball.x + ball.dx; // X方向の移動量を加算
      ball.y = ball.y + ball.dy; // Y方向の移動量を加算
*/
/*壁を作ったので画面外判定は不要
      // 画面外かどうか調べる
      if ((ball.x < 0) || (ball.x > (game.width-ball.width))){ ball.dx = -ball.dx; }
      if (ball.y < 0){ ball.dy = -ball.dy; }
*/
      // ボールが下まで行ったらゲームオーバー
      if(ball.y > game.height){
        game.stop();
        game.se1.play();
        alert("スコアは"+game.score+"です！！！!(^^)!");
      }
      // パドルを移動させる
      var n = game.input.analogX / 4;
      if(!isNaN(n)){
          pad1.x = pad1.x + n; // パドルを移動
          if (pad1.x < 0){ pad1.x = 0; }  // 左端かどうか調べる
          if (pad1.x > (game.width-pad1.width)){ pad1.x = game.width-pad1.width; }  // 右端かどうか調べる
      }
      // パドルとボールの接触判定
      if (ball.within(pad1,47.5)){
        ball.dy = -ball.dy;  // 接触した場合はボールのY方向の移動量を逆にする
        game.score = game.score+5; // スコアを加算(1点)It was set to 0.5 because it was judged twice due to a bug
        game.se.play();
        scoreLabel.text = "SCORE[スコア] : "+game.score;
      }
    });
  }
  // 傾きセンサーを設定
  if (!window.DeviceOrientationEvent) {
    alert("NoOrientationDevice");
  }
  window.addEventListener("deviceorientation", function(evt){
    var x = evt.gamma; // 横方向の傾斜角度
    game.input.analogX = x;
    sensorLabel.text = game.input.analogX;
  }, false);
  // ゲーム処理開始
  game.start();
}
