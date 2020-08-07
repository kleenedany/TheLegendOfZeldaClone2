namespace LegendofZelda {
    import f = FudgeCore;
    import fAid = FudgeAid;

    window.addEventListener("load", hndLoad);

    let game: f.Node = new f.Node("LegendofZelda");
    let viewport: f.Viewport;
    let enemy: Enemy;
    let offer: string;
    let jsonData: Object[];
    let map: f.Node;
    let cmpAudioBackground: f.ComponentAudio;
    let audioBackground: f.Audio;
    let cmpAudioEffects: f.ComponentAudio;
    let audioEffects: f.Audio;
    let controlScreen: HTMLDivElement;
    let titleScreen: HTMLDivElement;
    let gameScreen: HTMLDivElement;
    let settingsScreen: HTMLDivElement;
    let gameOverScreen: HTMLDivElement;
    let gameWonScreen: HTMLDivElement;
    let rangeAudioBackground: HTMLInputElement;
    let rangeAudioEffects: HTMLInputElement;
    let obj: MapObjects;
    let cmpCamera: f.ComponentCamera;
    let player: Player;
    let floor: Floor;
    let terrainNode: f.Node;
    let endboss: Endboss;
    
 
    function hndLoad(): void { 

        loadJSONFiles();

        titleScreen = <HTMLDivElement>document.getElementById("titleScreen");
        gameScreen = <HTMLDivElement>document.getElementById("gameScreen");
        controlScreen = <HTMLDivElement>document.getElementById("controlsScreen");
        settingsScreen = <HTMLDivElement>document.getElementById("settingsScreen");
        gameOverScreen = <HTMLDivElement>document.getElementById("gameOverScreen");
        gameWonScreen = <HTMLDivElement>document.getElementById("gameWonScreen");

        let startBtn: HTMLDivElement = <HTMLDivElement>document.getElementById("btn_startGame");
        startBtn.addEventListener("click", startGame);

        let controlBtn: HTMLCollectionOf<Element> = document.getElementsByClassName("btn_showControls");
        for (let i: number = 0; i < controlBtn.length; i ++) {
            controlBtn[i].addEventListener("click", showControls);
        }

        let backToTitleScreenBtn: HTMLCollectionOf<Element> = document.getElementsByClassName("btn_backToTitleScreen");
        for (let i: number = 0; i < backToTitleScreenBtn.length; i ++) {
            backToTitleScreenBtn[i].addEventListener("click", backToTitleScreen);
        }
        
        let settingsBtn: HTMLCollectionOf<Element> = document.getElementsByClassName("btn_showSettings");
        for (let i: number = 0; i < settingsBtn.length; i ++) {
            settingsBtn[i].addEventListener("click", showSettings);
        }

        let restartBtn: HTMLCollectionOf<Element> = document.getElementsByClassName("btn_restartGame");
        for (let i: number = 0; i < restartBtn.length; i++) {
            restartBtn[i].addEventListener("click", restartGame);
        }
    }

    async function loadJSONFiles(): Promise<void> {
        let response: Response = await fetch("gameInfo.json");
        offer = await response.text();
        jsonData = JSON.parse(offer);
    }

    function startGame(): void {

        audio();

        rangeAudioBackground = <HTMLInputElement>document.getElementById("rangeMusic");
        rangeAudioBackground.addEventListener("click", changeAudioVolumne);

        rangeAudioEffects = <HTMLInputElement>document.getElementById("rangeSoundEffects");
        rangeAudioEffects.addEventListener("click", changeAudioVolumne);

        gameScreen.style.display = "block";
        titleScreen.style.display = "none";
        controlScreen.style.display = "none";
        settingsScreen.style.display = "none";

        const canvas: HTMLCanvasElement = document.querySelector("canvas");
        let img = document.querySelectorAll("img");
        let spritesheet: f.CoatTextured = fAid.createSpriteSheet("Player", img[0]);
        let arrowSheet: f.CoatTextured = fAid.createSpriteSheet("Arrow", img[1]);
        let enemySheet: f.CoatTextured = fAid.createSpriteSheet("Enemy", img[2]);
        let pelletSheet: f.CoatTextured = fAid.createSpriteSheet("Pellet", img[3]);
        let floorSheet: f.CoatTextured = fAid.createSpriteSheet("Floor", img[4]);
        let objectSheet: f.CoatTextured = fAid.createSpriteSheet("Object", img[5]);
        let objectEndBoss: f.CoatTextured = fAid.createSpriteSheet("Endboss", img[6]);
        let objectHeart: f.CoatTextured = fAid.createSpriteSheet("Heart", img[7]);

        Player.generateSprites(spritesheet);
        Arrow.generateSprites(arrowSheet);
        Enemy.generateSprites(enemySheet);
        Shoot.generateSprites(pelletSheet);
        Floor.generateSprites(floorSheet);
        MapObjects.generateSprites(objectSheet);
        Endboss.generateSprites(objectEndBoss);
        LifePoints.generateSprites(objectHeart);

        document.addEventListener("keypress", hndKeypress);

        map = new f.Node("MapTile01");
        player = new Player("Player");
        player.cmpTransform.local.translate(new f.Vector3(-1, 0 , 0));

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

        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
        f.Loop.start(f.LOOP_MODE.TIME_GAME, 60);
    }

    async function audio(): Promise<void> {
        audioBackground = await f.Audio.load("BackgroundMusic.mp3");
        cmpAudioBackground = new f.ComponentAudio(audioBackground, true, true);
        cmpAudioBackground.connect(true);
        changeAudioVolumne();
        cmpAudioBackground.play(true);
    }

    async function soundEffects(_audioFile: string): Promise<void> {
        audioEffects = await f.Audio.load(_audioFile);
        cmpAudioEffects = new f.ComponentAudio(audioEffects, false, false);
        cmpAudioEffects.connect(true);
        cmpAudioEffects.play(true);
    }


    function update(_event: f.Eventƒ): void {
        defineKeyboardControls();
        collisionArrow();
        collisionPlayer();
        collisionShootEnemy();
        collisionShootBoss();
        viewport.draw(); 
    }

    function detectHit(_node1: f.Node, _node2: f .Node): boolean {
        let sclRect1: f.Vector3 = _node1.getComponent(f.ComponentMesh).pivot.scaling.copy;
        let posRect1: f.Vector3 = _node1.cmpTransform.local.translation.copy;
        let rect1: f.Rectangle = new f.Rectangle(posRect1.x, posRect1.y, sclRect1.x, sclRect1.y, f.ORIGIN2D.CENTER);

        let sclRect2: f.Vector3 = _node2.getComponent(f.ComponentMesh).pivot.scaling.copy;
        let posRect2: f.Vector3 = _node2.cmpTransform.local.translation.copy;
        let rect2: f.Rectangle = new f.Rectangle(posRect2.x, posRect2.y, sclRect2.x, sclRect2.y, f.ORIGIN2D.CENTER);
        return rect1.collides(rect2);
    }

    function collisionArrow(): void {
        let hit: boolean = false;


        for (let node of map.getChildren()) {
            for (let arrow of player.getChildren()) {
                hit = detectHit(node, arrow);
                
                if (node.name == "Enemy") {
                    if (hit) {
                        map.removeChild(node);
                        player.removeChild(arrow);
                        console.log("HIT Enemy");
                        soundEffects("EnemyDie.wav");
                    }
                }
   
                else if (node.name == "Endboss") {
                    if (hit) {
                        map.removeChild(node);
                        player.removeChild(arrow);
                        showGameWon();
                        soundEffects("EnemyDie.wav");
                    }
                }

            }
        }
    }

    function collisionShootBoss(): void {
        let hit: boolean = false;

        for (let node of endboss.getChildren()) {
            hit = detectHit(node, player);

            if (hit) {
                    player.removeLife(1);
                    console.log(player);
                    soundEffects("EnemyDie.wav");
                     
                    if (player.getLife() == 0) {
                        showGameOver();
                    }
                }
        }


    }

    function collisionShootEnemy(): void {
        let hit: boolean = false;

        for (let node of enemy.getChildren()) {
            hit = detectHit(node, player);

            if (hit) {
                    player.removeLife(1);
                    console.log(player);
                    soundEffects("EnemyDie.wav");
                     
                    if (player.getLife() == 0) {
                        showGameOver();
                    }
                }
        }


    }

    function collisionPlayer(): void {
        let hit: boolean = false;

        for (let node of map.getChildren()) {
            hit = detectHit(node, player);

            if (node.name == "Enemy") {
                if (hit) {
                    player.removeLife(1);
                    console.log(player);
                    soundEffects("EnemyDie.wav");
                     
                    if (player.getLife() == 0) {
                        showGameOver();
                    }
                }
            }

            else if (node.name == "Endboss") {
                if (hit) {
                    player.removeLife(1);
                    console.log(player);
                    soundEffects("EnemyDie.wav");
                     
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

    function defineKeyboardControls(): void {
        
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.A])) {
            player.act(ACTION.WALK, DIRECTION.LEFT);
            if (player.cmpTransform.local.translation.x <= 2.5 && player.cmpTransform.local.translation.x >= 2.25) {
                cmpCamera.pivot.translateX(4.7);
            }
        }
            
        else if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.D])) {
            player.act(ACTION.WALK, DIRECTION.RIGHT);
            if (player.cmpTransform.local.translation.x >= 2.25 && player.cmpTransform.local.translation.x <= 2.5) {
                cmpCamera.pivot.translateX(-4.7);
            }
        }

        else if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.S])) {
            player.act(ACTION.WALKSOUTH);
        }
            
        else if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.W])) {
            player.act(ACTION.WALKNORTH); 
        }

        else
            player.act(ACTION.IDLE);
    }  

    function hndKeypress(_event: f.EventKeyboard): void {
        switch (_event.code) {
            case f.KEYBOARD_CODE.SPACE:
                endboss.shootBoss();
                enemy.shootEnemy();
                soundEffects("BowArrow.wav");
                player.shootArrow();
                break;
        }
    }


    function createMap(): f.Node {
        console.log(jsonData);

        for (let i: number = 0; i < jsonData[0].maptile1.mapObjects.length; i++) {
            let object = jsonData[0].maptile1.mapObjects[i];

            switch (object.objectname) {
                case "Enemy":
                    enemy = new Enemy("Enemy");
                    enemy.cmpTransform.local.translate(new f.Vector3(object.positionX, object.positionY, 0));
                    map.appendChild(enemy);
                    break;

                case "Object":
                    obj = new MapObjects("MapObjects", object.type);
                    obj.cmpTransform.local.translate(new f.Vector3(object.positionX, object.positionY, 0));
                    map.appendChild(obj);
                    break;
                
                case "Floor":
                    floor = new Floor("Floor", object.type);
                    floor.cmpTransform.local.translate(new f.Vector3(object.positionX, object.positionY, 0));
                    map.appendChild(floor);
                    break;

                case "Endboss":
                    endboss = new Endboss("Endboss");
                    endboss.cmpTransform.local.translate(new f.Vector3(object.positionX, object.positionY, 0));
                    map.appendChild(endboss);
                    break;
            }
        }
        return map;
    } 

    function createTerrain(): f.Node {
        terrainNode = new f.Node("Terrain");

        for (let i: number = -2.5; i < 2.5 ; i = i + 0.2) {
            for (let j: number = -2.5; j < 2.5; j = j + 0.2) {
                floor = new Floor("Floor", FLOOR_TYPE.GRASS);
                floor.cmpTransform.local.translate(new f.Vector3(i, j , 0));
                terrainNode.appendChild(floor);
           }
            
        }
        
        return terrainNode;
    }

    function restartGame(): void {
        location.reload();
    }

    function showControls(): void {
        controlScreen.style.display = "block";
        titleScreen.style.display = "none";
        gameScreen.style.display = "none";
        settingsScreen.style.display = "none";
        gameWonScreen.style.display = "none";
        gameOverScreen.style.display = "none";
    }

    function backToTitleScreen(): void {
        titleScreen.style.display = "block";
        gameScreen.style.display = "none";
        controlScreen.style.display = "none";
        settingsScreen.style.display = "none";
        gameWonScreen.style.display = "none";
        gameOverScreen.style.display = "none";
    }

    function showSettings(): void {
        settingsScreen.style.display = "block";
        titleScreen.style.display = "none";
        gameScreen.style.display = "none";
        controlScreen.style.display = "none";
        gameWonScreen.style.display = "none";
        gameOverScreen.style.display = "none";
    }

    function showGameOver(): void {
        gameOverScreen.style.display = "block";
        settingsScreen.style.display = "none";
        titleScreen.style.display = "none";
        gameScreen.style.display = "none";
        controlScreen.style.display = "none";
        gameWonScreen.style.display = "none";
        cmpAudioEffects.volume = 0;
        cmpAudioBackground.volume = 0;
        
    }

    function showGameWon(): void {
        gameWonScreen.style.display = "block";
        settingsScreen.style.display = "none";
        titleScreen.style.display = "none";
        gameScreen.style.display = "none";
        controlScreen.style.display = "none";
        gameWonScreen.style.display = "none";
        cmpAudioEffects.volume = 0;
        cmpAudioBackground.volume = 0;
    }

    function changeAudioVolumne(): void {
        cmpAudioBackground.volume = parseInt(rangeAudioBackground.value);
        cmpAudioEffects.volume = parseInt(rangeAudioEffects.value);
    }
}






