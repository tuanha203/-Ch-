
    var state = history.state || {};
    var reloadCount = state.reloadCount || 0;
    if (performance.navigation.type === 1) { // Reload
        state.reloadCount = ++reloadCount;
        history.replaceState(state, null, document.URL);
    } else if (reloadCount) {
        delete state.reloadCount;
        reloadCount = 0;
        history.replaceState(state, null, document.URL);
    }
    if (reloadCount >= 2) {
        // Now, do whatever you want...
        document.querySelector('.eee').parentNode.removeChild(document.querySelector('.eee'))
    }
    console.log(document.querySelector('.eee'))
    document.querySelector('button.start').addEventListener('click', function () {
        if (document.querySelector('.eee')) {
            setTimeout(function () { startGame() }, 6000)
            setTimeout(function () { document.querySelector('canvas').click() }, 6100)
        }
        else {
            startGame()
            setTimeout(function () { document.querySelector('canvas').click() }, 100)
        }

        this.style.display = 'none'
        document.querySelector('h2').style.visibility = 'hidden'
        document.querySelector('.eee iframe').src += '?autoplay=1'
        document.querySelector('.eee').style.visibility = 'visible'
        setTimeout(function () { document.querySelector('.eee').style.display = 'none' }, 5000)
    })

    let myGamePiece
    let myScore
    let myBackground
    let myMusic
    let soundFail
    function startGame() {
        myGameArea.start()
        myMusic = new sound('Age Of Empires- The Rise of Rome - Music Soundtracks.mp3')
        soundFail = new sound('Quack Sound Effect.mp3')
        myMusic.play()
        myBackground = new component(820, 600, 'https://trovetuoitho.com/wp-content/uploads/2020/03/Webp.net-compress-image-16.jpg', 0, 0, 'background')
        myGamePiece = new component(40, 50, 'daihrjx-36dae718-d26d-4001-9192-f8a8e6318e89.png', 20, 100, 'image')
        myScore = new component(700, 'Arial', 'red', 20, 100, 'text')
    }
    let myGameArea = {
        canvas: document.createElement('canvas'),
        start: function () {

            this.context = this.canvas.getContext('2d')
            this.canvas.width = 820
            this.canvas.height = 500
            document.body.insertBefore(this.canvas, document.body.childNodes[0])
            this.interval = setInterval(gameUpdate, 20)
            myGameArea.intervalGravity = setInterval(myGravity, 20)
            document.querySelector('canvas').addEventListener('click', function (e) {
            })
            this.count = 1
            window.addEventListener('click', function (e) {
                if (e.target != document.querySelector('canvas')) {
                    window.removeEventListener('keydown', eventKey)
                } else {
                    window.addEventListener('keydown', eventKey)
                    window.addEventListener('keyup', function (e) {
                        myGameArea.keys[e.keyCode] = false
                        myGamePiece.changeSpeed()
                        if (myGameArea.count == 1) {
                            myGameArea.intervalGravity = setInterval(myGravity, 20)
                            myGameArea.count++
                        }
                    })
                }
            })
            this.fall = setInterval(function(){ 
                myGameArea.myThrow = new component(40, 50, 'd3fpssn-8880a67b-e0f3-4a19-89b8-08f1221fc660.png', 820, 300, 'image')
                },4000)

        },
        score: 0,
        myObstaclesBottom: [],
        myObstaclesTop: [],
        frame: 0,
        clear: function () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        },
        stopGame: function () {
            clearInterval(this.interval)
        }

    }
    function myGravity() {
        myGamePiece.speedY += myGamePiece.gravity
    }
    function eventKey(e) {
        e.preventDefault()
        myGameArea.keys = (myGameArea.keys || [])
        myGameArea.keys[e.keyCode] = true
        myGameArea.count = 1
        clearInterval(myGameArea.intervalGravity)
        myGamePiece.changeSpeed()
    }
    function component(width, height, color, x, y, type) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.type = type
        this.speedX = 0
        this.speedY = 0
        if (this.type == 'text') {
            this.update = function () {

                ctx = myGameArea.context
                ctx.font = '25px ' + height
                ctx.fillStyle = 'black'
                ctx.fillText('Score: ' + myGameArea.score, this.width, 30)
            }
        } else if (this.type == 'image' || this.type == 'background') {
            this.image = new Image()
            this.image.src = color
            this.update = function () {
                ctx = myGameArea.context

                ctx.drawImage(this.image, this.x, this.y, this.width, this.height)

            }
            this.gravity = 0.2
            this.changeSpeed = function () {
                this.speedY = 0
                this.speedX = 0
                if (myGameArea.keys && myGameArea.keys[37]) {
                    this.speedX = -4
                }
                if (myGameArea.keys && myGameArea.keys[39]) {
                    this.speedX = 4
                }
                if (myGameArea.keys && myGameArea.keys[38]) {
                    this.speedY = -4
                }
                if (myGameArea.keys && myGameArea.keys[40]) {
                    this.speedY = 4
                }

            }
            this.newPos = function () {
                this.x += this.speedX
                this.y += this.speedY
            }
            this.crash = function (otherObj) {
                let myTop = this.y
                let myBottom = this.y + this.height
                let myLeft = this.x
                let myRight = this.x + this.width
                let otherTop = otherObj.y
                let otherBottom = otherObj.y + otherObj.height
                let otherLeft = otherObj.x
                let otherRight = otherObj.x + otherObj.width
                if (myTop > otherBottom || myBottom < otherTop || myLeft > otherRight || myRight < otherLeft) {
                    return false
                } else {
                    return true
                }
            }
          

        }
        else {
            this.update = function () {
                ctx = myGameArea.context
                ctx.fillStyle = color
                ctx.fillRect(this.x, this.y, this.width, this.height)
            }
            this.changeSpeed = function () {
                this.speedY = 0
                this.speedX = 0
                if (myGameArea.keys && myGameArea.keys[37]) {
                    this.speedX = -4
                }
                if (myGameArea.keys && myGameArea.keys[39]) {
                    this.speedX = 4
                }
                if (myGameArea.keys && myGameArea.keys[38]) {
                    this.speedY = -4

                }
                if (myGameArea.keys && myGameArea.keys[40]) {
                    this.speedY = 4
                }

            }
            this.newPos = function () {
                this.x += this.speedX
                this.y += this.speedY
            }
            this.crash = function (otherObj) {
                let myTop = this.y
                let myBottom = this.y + this.height
                let myLeft = this.x
                let myRight = this.x + this.width
                let otherTop = otherObj.y
                let otherBottom = otherObj.y + otherObj.height
                let otherLeft = otherObj.x
                let otherRight = otherObj.x + otherObj.width
                if (myTop > otherBottom || myBottom < otherTop || myLeft > otherRight || myRight < otherLeft) {
                    return false
                } else {
                    return true
                }
            }

        }
    }
    function createObstacle() {
        myGameArea.frame++
        gap = Math.floor(Math.random() * 70 + 90)
        myBottom = Math.floor(Math.random() * 200) + 100

        if ((myGameArea.frame / 50) % 1 == 0 || myGameArea.frame == 1) {
            let obstacleBottom = new component(10, myBottom, "#16820f", 820, 500 - myBottom);
            let obstacleTop = new component(10, 500 - (gap + myBottom), "#16820f", 820, 0);
            myGameArea.myObstaclesBottom.push(obstacleBottom)
            myGameArea.myObstaclesTop.push(obstacleTop)
        }
    }
    function sound(src) {
        this.sound = document.createElement('audio')
        this.sound.src = src
        this.play = function () {
            this.sound.play()
        }
        this.stop = function () {
            this.sound.pause()
        }
    }

    function clearMove() {
        myGamePiece.speedX = 0
        myGamePiece.speedY = 0
    }
    let count = false
    function gameUpdate() {
        console.log(1);
        createObstacle()
        myGameArea.clear()
        /* -----myBackground----- */

        myBackground.update()

        /* --------Score----------- */
        if (myGameArea.myThrow){
        myGameArea.myThrow.x -= 10
        myGameArea.myThrow.update()
        }
        /* ------------------------------ */
        myScore.update()
        /* if (myGameArea.myObstaclesBottom.length == 5) {
            myGameArea.myObstaclesBottom.shift()
            myGameArea.myObstaclesTop.shift()
            count = false;
        } */
        for (let i = 0; i < myGameArea.myObstaclesBottom.length; i++) {
            if (myGameArea.myObstaclesBottom[i].crash(myGamePiece) || myGameArea.myObstaclesTop[i].crash(myGamePiece) || myGamePiece.y > 900) {
                if (i >= 15 && i <= 19) {
                    document.querySelector('.cursing').style.visibility = 'visible'
                    document.querySelector('.cursing iframe').src += '?autoplay=1'
                    console.log(1)
                } else if (i >= 8) {

                }
                myGameArea.stopGame()
                soundFail.play()
                myMusic.stop()
                document.querySelector('h1').style.visibility = 'visible'
            }
            if ((myGameArea.myObstaclesBottom[i].x + myGameArea.myObstaclesBottom[i].width) < myGamePiece.x) {
                myGameArea.score = i + 1
                if (myGameArea.score == 20) {
                    document.querySelector('.gift').style.visibility = 'visible'
                    document.querySelector('.gift iframe').src += '?autoplay=1'
                    myGameArea.stopGame()
                    myMusic.stop()
                    document.querySelector('.pass').style.visibility = 'visible'
                }
            }

            myGameArea.myObstaclesBottom[i].x -= 3
            myGameArea.myObstaclesBottom[i].update()
            myGameArea.myObstaclesTop[i].x -= 3
            myGameArea.myObstaclesTop[i].update()
        }
        myGamePiece.newPos()
        myGamePiece.update()


    }
