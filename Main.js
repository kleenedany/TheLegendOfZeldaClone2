"use strict";
var LegendofZelda;
(function (LegendofZelda) {
    var f = FudgeCore;
    var fAid = FudgeAid;
    window.addEventListener("load", hndLoad);
    let game = new f.Node("LegendofZelda");
    let viewport;
    let enemy;
    let offer;
    let jsonData;
    let map;
    let cmpAudioBackground;
    let audioBackground;
    let cmpAudioEffects;
    let audioEffects;
    let controlScreen;
    let titleScreen;
    let gameScreen;
    let settingsScreen;
    let gameOverScreen;
    let gameWonScreen;
    let rangeAudioBackground;
    let rangeAudioEffects;
    let obj;
    let cmpCamera;
    let player;
    let floor;
    let terrainNode;
    let endboss;
    function hndLoad() {
        loadJSONFiles();
        titleScreen = document.getElementById("titleScreen");
        gameScreen = document.getElementById("gameScreen");
        controlScreen = document.getElementById("controlsScreen");
        settingsScreen = document.getElementById("settingsScreen");
        gameOverScreen = document.getElementById("gameOverScreen");
        gameWonScreen = document.getElementById("gameWonScreen");
        let startBtn = document.getElementById("btn_startGame");
        startBtn.addEventListener("click", startGame);
        let controlBtn = document.getElementsByClassName("btn_showControls");
        for (let i = 0; i < controlBtn.length; i++) {
            controlBtn[i].addEventListener("click", showControls);
        }
        let backToTitleScreenBtn = document.getElementsByClassName("btn_backToTitleScreen");
        for (let i = 0; i < backToTitleScreenBtn.length; i++) {
            backToTitleScreenBtn[i].addEventListener("click", backToTitleScreen);
        }
        let settingsBtn = document.getElementsByClassName("btn_showSettings");
        for (let i = 0; i < settingsBtn.length; i++) {
            settingsBtn[i].addEventListener("click", showSettings);
        }
        let restartBtn = document.getElementsByClassName("btn_restartGame");
        for (let i = 0; i < restartBtn.length; i++) {
            restartBtn[i].addEventListener("click", restartGame);
        }
    }
    async function loadJSONFiles() {
        let response = await fetch("json/gameInfo.json");
        offer = await response.text();
        jsonData = JSON.parse(offer);
    }
    function startGame() {
        audio();
        rangeAudioBackground = document.getElementById("rangeMusic");
        rangeAudioBackground.addEventListener("click", changeAudioVolumne);
        rangeAudioEffects = document.getElementById("rangeSoundEffects");
        rangeAudioEffects.addEventListener("click", changeAudioVolumne);
        gameScreen.style.display = "block";
        titleScreen.style.display = "none";
        controlScreen.style.display = "none";
        settingsScreen.style.display = "none";
        const canvas = document.querySelector("canvas");
        let img = document.querySelectorAll("img");
        let spritesheet = fAid.createSpriteSheet("Player", img[0]);
        let arrowSheet = fAid.createSpriteSheet("Arrow", img[1]);
        let enemySheet = fAid.createSpriteSheet("Enemy", img[2]);
        let pelletSheet = fAid.createSpriteSheet("Pellet", img[3]);
        let floorSheet = fAid.createSpriteSheet("Floor", img[4]);
        let objectSheet = fAid.createSpriteSheet("Object", img[5]);
        let objectEndBoss = fAid.createSpriteSheet("Endboss", img[6]);
        let objectHeart = fAid.createSpriteSheet("Heart", img[7]);
        LegendofZelda.Player.generateSprites(spritesheet);
        LegendofZelda.Arrow.generateSprites(arrowSheet);
        LegendofZelda.Enemy.generateSprites(enemySheet);
        LegendofZelda.Shoot.generateSprites(pelletSheet);
        LegendofZelda.Floor.generateSprites(floorSheet);
        LegendofZelda.MapObjects.generateSprites(objectSheet);
        LegendofZelda.Endboss.generateSprites(objectEndBoss);
        LegendofZelda.LifePoints.generateSprites(objectHeart);
        document.addEventListener("keypress", hndKeypress);
        map = new f.Node("MapTile01");
        player = new LegendofZelda.Player("Player");
        player.cmpTransform.local.translate(new f.Vector3(-1, 0, 0));
        game.appendChild(player);
        game.appendChild(createMap());
        game.appendChild(createTerrain());
        console.log(player);
        cmpCamera = new f.ComponentCamera();
        cmpCamera.pivot.translateZ(5);
        cmpCamera.pivot.lookAt(f.Vector3.ZERO());
        viewport = new f.Viewport();
        viewport.initialize("Viewport", game, cmpCamera, canvas);
        viewport.draw();
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        f.Loop.start(f.LOOP_MODE.TIME_GAME, 60);
    }
    async function audio() {
        audioBackground = await f.Audio.load("../soundfiles/BackgroundMusic.mp3");
        cmpAudioBackground = new f.ComponentAudio(audioBackground, true, true);
        cmpAudioBackground.connect(true);
        changeAudioVolumne();
        cmpAudioBackground.play(true);
    }
    async function soundEffects(_audioFile) {
        audioEffects = await f.Audio.load(_audioFile);
        cmpAudioEffects = new f.ComponentAudio(audioEffects, false, false);
        cmpAudioEffects.connect(true);
        cmpAudioEffects.play(true);
    }
    function update(_event) {
        defineKeyboardControls();
        collisionArrow();
        collisionPlayer();
        collisionShootEnemy();
        collisionShootBoss();
        viewport.draw();
    }
    function detectHit(_node1, _node2) {
        let sclRect1 = _node1.getComponent(f.ComponentMesh).pivot.scaling.copy;
        let posRect1 = _node1.cmpTransform.local.translation.copy;
        let rect1 = new f.Rectangle(posRect1.x, posRect1.y, sclRect1.x, sclRect1.y, f.ORIGIN2D.CENTER);
        let sclRect2 = _node2.getComponent(f.ComponentMesh).pivot.scaling.copy;
        let posRect2 = _node2.cmpTransform.local.translation.copy;
        let rect2 = new f.Rectangle(posRect2.x, posRect2.y, sclRect2.x, sclRect2.y, f.ORIGIN2D.CENTER);
        return rect1.collides(rect2);
    }
    function collisionArrow() {
        let hit = false;
        for (let node of map.getChildren()) {
            for (let arrow of player.getChildren()) {
                hit = detectHit(node, arrow);
                if (node.name == "Enemy") {
                    if (hit) {
                        map.removeChild(node);
                        player.removeChild(arrow);
                        console.log("HIT Enemy");
                        soundEffects("../soundfiles/EnemyDie.wav");
                    }
                }
                else if (node.name == "Endboss") {
                    if (hit) {
                        map.removeChild(node);
                        player.removeChild(arrow);
                        showGameWon();
                        soundEffects("../soundfiles/EnemyDie.wav");
                    }
                }
            }
        }
    }
    function collisionShootBoss() {
        let hit = false;
        for (let node of endboss.getChildren()) {
            hit = detectHit(node, player);
            if (hit) {
                player.removeLife(1);
                console.log(player);
                soundEffects("../soundfiles/EnemyDie.wav");
                if (player.getLife() == 0) {
                    showGameOver();
                }
            }
        }
    }
    function collisionShootEnemy() {
        let hit = false;
        for (let node of enemy.getChildren()) {
            hit = detectHit(node, player);
            if (hit) {
                player.removeLife(1);
                console.log(player);
                soundEffects("../soundfiles/EnemyDie.wav");
                if (player.getLife() == 0) {
                    showGameOver();
                }
            }
        }
    }
    function collisionPlayer() {
        let hit = false;
        for (let node of map.getChildren()) {
            hit = detectHit(node, player);
            if (node.name == "Enemy") {
                if (hit) {
                    player.removeLife(1);
                    console.log(player);
                    soundEffects("../soundfiles/EnemyDie.wav");
                    if (player.getLife() == 0) {
                        showGameOver();
                    }
                }
            }
            else if (node.name == "Endboss") {
                if (hit) {
                    player.removeLife(1);
                    console.log(player);
                    soundEffects("../soundfiles/EnemyDie.wav");
                    if (player.getLife() == 0) {
                        showGameOver();
                    }
                }
            }
            else {
                console.log("HIT OBJECT");
                continue;
            }
        }
    }
    function defineKeyboardControls() {
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.A])) {
            player.act(LegendofZelda.ACTION.WALK, LegendofZelda.DIRECTION.LEFT);
            if (player.cmpTransform.local.translation.x <= 2.5 && player.cmpTransform.local.translation.x >= 2.25) {
                cmpCamera.pivot.translateX(4.7);
            }
        }
        else if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.D])) {
            player.act(LegendofZelda.ACTION.WALK, LegendofZelda.DIRECTION.RIGHT);
            if (player.cmpTransform.local.translation.x >= 2.25 && player.cmpTransform.local.translation.x <= 2.5) {
                cmpCamera.pivot.translateX(-4.7);
            }
        }
        else if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.S])) {
            player.act(LegendofZelda.ACTION.WALKSOUTH);
        }
        else if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.W])) {
            player.act(LegendofZelda.ACTION.WALKNORTH);
        }
        else
            player.act(LegendofZelda.ACTION.IDLE);
    }
    function hndKeypress(_event) {
        switch (_event.code) {
            case f.KEYBOARD_CODE.SPACE:
                endboss.shootBoss();
                enemy.shootEnemy();
                soundEffects("../soundfiles/BowArrow.wav");
                player.shootArrow();
                break;
        }
    }
    function createMap() {
        console.log(jsonData);
        for (let i = 0; i < jsonData[0].maptile1.mapObjects.length; i++) {
            let object = jsonData[0].maptile1.mapObjects[i];
            switch (object.objectname) {
                case "Enemy":
                    enemy = new LegendofZelda.Enemy("Enemy");
                    enemy.cmpTransform.local.translate(new f.Vector3(object.positionX, object.positionY, 0));
                    map.appendChild(enemy);
                    break;
                case "Object":
                    obj = new LegendofZelda.MapObjects("MapObjects", object.type);
                    obj.cmpTransform.local.translate(new f.Vector3(object.positionX, object.positionY, 0));
                    map.appendChild(obj);
                    break;
                case "Floor":
                    floor = new LegendofZelda.Floor("Floor", object.type);
                    floor.cmpTransform.local.translate(new f.Vector3(object.positionX, object.positionY, 0));
                    map.appendChild(floor);
                    break;
                case "Endboss":
                    endboss = new LegendofZelda.Endboss("Endboss");
                    endboss.cmpTransform.local.translate(new f.Vector3(object.positionX, object.positionY, 0));
                    map.appendChild(endboss);
                    break;
            }
        }
        return map;
    }
    function createTerrain() {
        terrainNode = new f.Node("Terrain");
        for (let i = -2.5; i < 2.5; i = i + 0.2) {
            for (let j = -2.5; j < 2.5; j = j + 0.2) {
                floor = new LegendofZelda.Floor("Floor", LegendofZelda.FLOOR_TYPE.GRASS);
                floor.cmpTransform.local.translate(new f.Vector3(i, j, 0));
                terrainNode.appendChild(floor);
            }
        }
        return terrainNode;
    }
    function restartGame() {
        location.reload();
    }
    function showControls() {
        controlScreen.style.display = "block";
        titleScreen.style.display = "none";
        gameScreen.style.display = "none";
        settingsScreen.style.display = "none";
        gameWonScreen.style.display = "none";
        gameOverScreen.style.display = "none";
    }
    function backToTitleScreen() {
        titleScreen.style.display = "block";
        gameScreen.style.display = "none";
        controlScreen.style.display = "none";
        settingsScreen.style.display = "none";
        gameWonScreen.style.display = "none";
        gameOverScreen.style.display = "none";
    }
    function showSettings() {
        settingsScreen.style.display = "block";
        titleScreen.style.display = "none";
        gameScreen.style.display = "none";
        controlScreen.style.display = "none";
        gameWonScreen.style.display = "none";
        gameOverScreen.style.display = "none";
    }
    function showGameOver() {
        gameOverScreen.style.display = "block";
        settingsScreen.style.display = "none";
        titleScreen.style.display = "none";
        gameScreen.style.display = "none";
        controlScreen.style.display = "none";
        gameWonScreen.style.display = "none";
        cmpAudioEffects.volume = 0;
        cmpAudioBackground.volume = 0;
    }
    function showGameWon() {
        gameWonScreen.style.display = "block";
        settingsScreen.style.display = "none";
        titleScreen.style.display = "none";
        gameScreen.style.display = "none";
        controlScreen.style.display = "none";
        gameWonScreen.style.display = "none";
        cmpAudioEffects.volume = 0;
        cmpAudioBackground.volume = 0;
    }
    function changeAudioVolumne() {
        cmpAudioBackground.volume = parseInt(rangeAudioBackground.value);
        cmpAudioEffects.volume = parseInt(rangeAudioEffects.value);
    }
})(LegendofZelda || (LegendofZelda = {}));
//# sourceMappingURL=Main.js.map