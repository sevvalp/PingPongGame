(function () {
    var CSS = {
        arena: {
            width: 900,
            height: 600,
            background: '#62247B',
            position: 'fixed',
            top: '50%',
            left: '50%',
            zIndex: '999',
            transform: 'translate(-50%, -50%)'
        },
        ball: {
            width: 15,
            height: 15,
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: 50,
            background: '#C6A62F'
        },


        line: {
            width: 0,
            height: 600,
            borderLeft: '2px dashed #C6A62F',
            position: 'absolute',
            top: 0,
            left: '50%'
        },
        stick: {
            width: 12,
            height: 85,
            position: 'absolute',
            background: '#C6A62F'
        },
        stick1: {
            left: 0,
            top: 150,
        },

        stick2: {
            right: 0,
            top: 150,
        },
        score1: {
            left: 215,
            top: 100,
            position: 'absolute',
            color: '#C6A62F',
            fontSize: 60

        },
        score2: {
            left: 645,
            top: 100,
            position: 'absolute',
            color: '#C6A62F',
            fontSize: 60

        },
        restart: {
            left: 850,
            top: 100,
            color: '#C6A62F',
            fontSize: 20
        },
        pause: {
            left: 850,
            top: 90,
            color: '#C6A62F',
            fontSize: 20
        },
        resume: {
            left: 850,
            top: 80,
            color: '#C6A62F',
            fontSize: 20
        }

    };

    var CONSTS = {
    	gameSpeed: 15,
        stick1Speed: 0,
        stick2Speed: 0,
        ballTopSpeed: 0,
        ballLeftSpeed: 0,
        topScore: 5,
        savedLeftSpeed: 0,
        savedTopSpeed: 0,
    };

    function start() {
        draw();
        setEvents();
        roll();
        loop();
    }

    localStorage.setItem('score1', JSON.stringify(0));
    localStorage.setItem('score2', JSON.stringify(0));
    var isPaused=0;

    function draw() {
        $('<div/>', {id: 'pong-game'}).css(CSS.arena).appendTo('body');
        $('<div/>', {id: 'pong-line'}).css(CSS.line).appendTo('#pong-game');
        $('<div/>', {id: 'pong-ball'}).css(CSS.ball).appendTo('#pong-game');
        $('<div/>', {id: 'stick-1'}).css($.extend(CSS.stick1, CSS.stick))
        .appendTo('#pong-game');
        $('<div/>', {id: 'stick-2'}).css($.extend(CSS.stick2, CSS.stick))
        .appendTo('#pong-game');
        $('<div/>', {id: 'pong-score1'}).css(CSS.score1).appendTo('#pong-game');
        $('<div/>', {id: 'pong-score2'}).css(CSS.score2).appendTo('#pong-game');
        $('#pong-score1').text(parseInt(localStorage.getItem("score1")));
        $('#pong-score2').text(parseInt(localStorage.getItem("score2")));
        $('<h1>Press r to restart</h1>', {id: 'restart'}).css(CSS.restart).appendTo('#pong-game');
        $('<h1>Press p to pause</h1>', {id: 'pause'}).css(CSS.pause).appendTo('#pong-game');
        $('<h1>Press enter to resume</h1>', {id: 'resume'}).css(CSS.resume).appendTo('#pong-game');
    }


    function setEvents() {

        $(document).on('keydown', function (e) {
            if (e.keyCode == 87) {
                CONSTS.stick1Speed = -10;
            }
            if (e.keyCode == 83) {
                CONSTS.stick1Speed = 10;
            }
            if (e.keyCode == 38) {
                CONSTS.stick2Speed = -10;
            }
            if (e.keyCode == 40) {
                CONSTS.stick2Speed = 10;
            }
            if (e.keyCode == 82) {
                restartGame();
                scoreUpdate();
            }
            if (e.keyCode == 80) {
                if (isPaused==0){
                    saveGame();
                    pauseGame();
                    isPaused=1;
                }
                
            }
            if (e.keyCode == 13) {
                if(isPaused==1){
                    resumeGame();
                    isPaused=0;
                }
            }
        });

        $(document).on('keyup', function (e) {
            if (e.keyCode == 87 || e.keyCode == 83) {
                CONSTS.stick1Speed = 0;
            }

            if (e.keyCode == 38 || e.keyCode == 40) {
                CONSTS.stick2Speed = 0;
            }
        });
    }

    function loop() {
        window.pongLoop = setInterval(function () {
            CSS.stick1.top += CONSTS.stick1Speed;
            $('#stick-1').css('top', CSS.stick1.top);
            CSS.stick2.top += CONSTS.stick2Speed;
            $('#stick-2').css('top', CSS.stick2.top);

            CSS.ball.top += CONSTS.ballTopSpeed;
            CSS.ball.left += CONSTS.ballLeftSpeed;

            borderCheck(CSS.stick1);
            borderCheck(CSS.stick2);

            if (CSS.ball.top <= 0 ||
                CSS.ball.top >= CSS.arena.height - CSS.ball.height) {
                CONSTS.ballTopSpeed = CONSTS.ballTopSpeed * -1;
            }

            if (CSS.ball.left <= 0) {
                scoreUpdate("score2");
            }

            if (CSS.ball.left >= CSS.arena.width) {
                scoreUpdate("score1");
            }

            if (CSS.stick1.top <= 0 || CSS.stick1.top >= CSS.arena.height - CSS.stick1.height) {
                CONSTS.stick1Speed = CONSTS.stick1Speed * -1;
            }
            if (CSS.stick2.top <= 0 || CSS.stick2.top >= CSS.arena.height - CSS.stick2.height) {
                CONSTS.stick2Speed = CONSTS.stick2Speed * -1;
            }
            $('#pong-ball').css({top: CSS.ball.top,left: CSS.ball.left});

            if (CSS.ball.left <= CSS.stick.width) {
            	CSS.ball.top > CSS.stick1.top && CSS.ball.top < CSS.stick1.top + CSS.stick.height && (CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1);
            }
            if (CSS.ball.left >= CSS.arena.width - CSS.ball.width - CSS.stick.width){
                CSS.ball.top > CSS.stick2.top && CSS.ball.top < CSS.stick2.top + CSS.stick.height && (CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1);
            }

        }, CONSTS.gameSpeed);
    }

    function scoreUpdate(playerScore){
        localStorage.setItem(playerScore, JSON.stringify(parseInt(localStorage.getItem(playerScore)) + 1))

        $('#pong-score1').text(parseInt(localStorage.getItem("score1")));
        $('#pong-score2').text(parseInt(localStorage.getItem("score2")));

        if (parseInt(localStorage.getItem(playerScore)) >= CONSTS.topScore) {
            CONSTS.ballTopSpeed=0;
            CONSTS.ballLeftSpeed=0;
            CSS.ball.top = CSS.arena.height/2;
            CSS.ball.left = CSS.arena.width/2;
        }else {
            roll();
        }
    }

    function borderCheck(currentStick){
        if(currentStick.top <= 0){
            currentStick.top=0;
        }
        else if (currentStick.top >= CSS.arena.height - CSS.stick.height) {
            currentStick.top = CSS.arena.height - CSS.stick.height;
        }
    }

    function restartGame(){
        localStorage.setItem('score1', JSON.stringify(0));
        localStorage.setItem('score2', JSON.stringify(0));
        CSS.stick1.left = 0;
        CSS.stick1.top = 150;
        CSS.stick2.left = 0;
        CSS.stick2.top = 150;
        roll();
    }

    function saveGame(){
        CONSTS.savedLeftSpeed=CONSTS.ballLeftSpeed;
        CONSTS.savedTopSpeed=CONSTS.ballTopSpeed;
    }
    function pauseGame(){
        CONSTS.ballLeftSpeed=0;
        CONSTS.ballTopSpeed=0;
    }

    function resumeGame(){
        CONSTS.ballLeftSpeed=CONSTS.savedLeftSpeed;
        CONSTS.ballTopSpeed=CONSTS.savedTopSpeed;
    }

    function roll() {
        CSS.ball.top = CSS.arena.height/2;
        CSS.ball.left = CSS.arena.width/2;

        var side = -1;

        if (Math.random() < 0.5) {
            side = 1;
        }

        CONSTS.ballTopSpeed = Math.random() * -2 - 3;
        CONSTS.ballLeftSpeed = side * (Math.random() * 2 + 3);
    }

    start();
})();
