/**
 * App.js
 * This file contains Enemy and Player classes
 */
(function() {
    /**
     * Data common to Enemy and Player
     * @type {{
     * loc: {stoneTop: {y: number}, stoneBottom: {y: number}, stoneMiddle: {y: number}},
     * size: {width: number, height: number}
     * }}
     */
    const DATA_CHAR = {
        'size': {
            'width': 101,
            'height': 171,
        },
        'loc': {
            'stoneBottom': {
                'y': 238
            },
            'stoneMiddle': {
                'y': 155
            },
            'stoneTop': {
                'y': 72
            }
        }
    };

    /**
     * Enemy data
     * @type {{
     * loc: {start: {x: number}, end: {x: number}, adjustment: {y: number}},
     * speed: {min: number, max: number}
     * }}
     */
    const DATA_ENEMY = {
        'speed': {
            'min': 80,
            'max': 400
        },
        'loc': {
            'start': {
                'x': -101
            },
            'end': {
                'x': 505
            },
            'adjustment': {
                'y': 12
            }
        }
    };

    /**
     * Player data
     * @type {{
     * loc: {min: {x: number, y: number}, max: {x: number, y: number}, start: {x: number, y: number}},
     * name: {catGirl: string, princessGirl: string, hornGirl: string, boy: string, pinkGirl: string},
     * step: {x: number, y: number}
     * }}
     */
    const DATA_PLAYER = {
        'name': {
            'boy': 'boy',
            'catGirl': 'cat-girl',
            'hornGirl': 'horn-girl',
            'pinkGirl': 'pink-girl',
            'princessGirl': 'princess-girl'
        },
        'loc': {
            'start': {
                'x': 202,
                'y': 404
            },
            'min': {
                'x': 0,
                'y': 0
            },
            'max': {
                'x': 404,
                'y': 404
            },
        },
        'step': {
            'x': 101,
            'y': 83
        }
    };

    /**
     * Class representing the enemy
     */
    class Enemy {
        /**
         * Create an enemy
         * @param {number} x - The x value
         * @param {number} y - The y value
         * @param {number} speed - The speed value of the first pass
         */
        constructor(x, y, speed) {
            this.sprite = 'images/enemy-bug.png';
            this.speed = speed;
            this.x = x;
            this.y = y;
        }

        /**
         * Check if the enemy and the player collide
         * @returns {boolean}
         */
        checkCollisions() {
            let enemyLeft = (Math.floor(this.x) > PLAYER.x - DATA_CHAR.size.width * 0.7);
            let enemyNotPassed = (Math.floor(this.x) < PLAYER.x + DATA_CHAR.size.width * 0.7);
            let samePath = (this.y === PLAYER.y - DATA_ENEMY.loc.adjustment.y);

            return (enemyLeft && enemyNotPassed && samePath);
        }

        /**
         * Update the location on the enemy
         * @param {number} dt - The time delta
         */
        update(dt) {
            /*
            You should multiply any movement by the dt parameter
            which will ensure the game runs at the same speed for
            all computers.
             */
            this.x += this.speed * dt;

            /*
             When enemy is offscreen, reset start position and random speed
             */
            if (this.x > DATA_ENEMY.loc.end.x) {
                this.x = DATA_ENEMY.loc.start.x;
                this.speed = Util.getRandomInt(DATA_ENEMY.speed.min, DATA_ENEMY.speed.max);
            }
        }

        /**
         * Render the enemy
         */
        render() {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }
    }

    /**
     * Class representing the player
     */
    class Player {
        /**
         * Create the player
         * @param {string} name - The player name, used to load the corresponding image
         */
        constructor(name) {
            this.sprite = 'images/char-' + name + '.png';
            this.x = DATA_PLAYER.loc.start.x;
            this.y = DATA_PLAYER.loc.start.y;
            this.winner = false;
        }

        /**
         * Reset the player location to the starting point
         */
        reset() {
            this.x = DATA_PLAYER.loc.start.x;
            this.y = DATA_PLAYER.loc.start.y;
        }

        /**
         * Render the player
         */
        render() {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }

        /**
         * Update player location according to user input
         * @param {string} key - The direction of movement
         */
        handleInput(key) {
            /*
            Do not allow movement if the player won the game
             */
            if (this.winner) { return; }

            /*
            Update player location if the movement is within screen size
             */
            if(key === 'left' && this.x > DATA_PLAYER.loc.min.x) {
                this.x -= DATA_PLAYER.step.x;
            } else if(key === 'right' && this.x < DATA_PLAYER.loc.max.x) {
                this.x += DATA_PLAYER.step.x;
            } else if (key === 'up' && this.y > DATA_PLAYER.loc.min.y) {
                this.y -= DATA_PLAYER.step.y;
            } else if (key === 'down' && this.y < DATA_PLAYER.loc.max.y) {
                this.y += DATA_PLAYER.step.y;
            }

            /*
            Update winner status and show message
             */
            if (this.y <= DATA_PLAYER.loc.min.y) {
                this.winner = true;
                this.showMessage();
            }
        }

        /**
         * Show winner message
         * @returns {HTMLDivElement}
         */
        showMessage() {
            /*
            Create var 'playerInst' to pass the context to the event handler registered on the button element
             */
            const playerInst = this;
            const body = document.querySelector('body');
            const frag = document.createDocumentFragment();
            const msg = document.createElement('div');
            const para = document.createElement('p');
            const btn = document.createElement('button');
            para.textContent = 'You won the game!';
            btn.textContent = 'Play again';
            msg.classList.add('msg', 'msg--show');
            btn.classList.add('restart');
            msg.appendChild(para);
            msg.appendChild(btn);
            frag.appendChild(msg);
            body.appendChild(frag);


            /*
            If another game is played, reset winner status and player location
             */
            btn.addEventListener('click', function () {
                playerInst.winner = false;
                playerInst.reset();
                body.removeChild(msg);
            });

            return msg;
        };
    }


    /**
     * @type {Enemy[]}
     */
    const ALL_ENEMIES = [
        new Enemy(DATA_ENEMY.loc.start.x, DATA_CHAR.loc.stoneTop.y - DATA_ENEMY.loc.adjustment.y, 200),
        new Enemy(DATA_ENEMY.loc.start.x, DATA_CHAR.loc.stoneMiddle.y - DATA_ENEMY.loc.adjustment.y, 100),
        new Enemy(DATA_ENEMY.loc.start.x, DATA_CHAR.loc.stoneBottom.y - DATA_ENEMY.loc.adjustment.y, 300)
    ];

    /**
     * @type {Player}
     */
    const PLAYER = new Player(DATA_PLAYER.name.catGirl);


    /**
     * Register the event handler to control player movement
     */
    document.addEventListener('keyup', function(e) {
        const allowedKeys = {
            'ArrowLeft': 'left',
            'ArrowUp': 'up',
            'ArrowRight': 'right',
            'ArrowDown': 'down'
        };

        PLAYER.handleInput(allowedKeys[e.key]);
    });

    /**
     * Export enemies and player instances
     * @type {{allEnemies: Enemy[], player: Player}}
     */
    window.App = {
        'allEnemies': ALL_ENEMIES,
        'player': PLAYER
    }

})();
