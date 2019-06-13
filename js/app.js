const CHAR = {
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

const ENEMY = {
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

const PLAYER = {
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

// Enemies our player must avoid
const Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.speed = speed; // speed of the first pass
    this.x = x;
    this.y = y;
};

Enemy.prototype.checkCollisions = function() {
    let enemyLeft = (Math.floor(this.x) > player.x - CHAR.size.width * 0.7);
    let enemyNotPassed = (Math.floor(this.x) < player.x + CHAR.size.width * 0.7);
    let samePath = (this.y === player.y - ENEMY.loc.adjustment.y);

    return (enemyLeft && enemyNotPassed && samePath);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    /*
     When enemy is offscreen, reset start position and random speed
     */
    if (this.x > ENEMY.loc.end.x) {
        this.x = ENEMY.loc.start.x;
        this.speed = Util.getRandomInt(ENEMY.speed.min, ENEMY.speed.max);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
const Player = function(name) {
    this.sprite = 'images/char-' + name + '.png';
    this.x = PLAYER.loc.start.x;
    this.y = PLAYER.loc.start.y;
    this.winner = false;
};

// Player.prototype.update = function() {
// };

Player.prototype.reset = function() {
    player.x = PLAYER.loc.start.x;
    player.y = PLAYER.loc.start.y;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    if (this.winner) { return; }

    if(key === 'left' && this.x > PLAYER.loc.min.x) {
        this.x -= PLAYER.step.x;
    } else if(key === 'right' && this.x < PLAYER.loc.max.x) {
        this.x += PLAYER.step.x;
    } else if (key === 'up' && this.y > PLAYER.loc.min.y) {
        this.y -= PLAYER.step.y;
    } else if (key === 'down' && this.y < PLAYER.loc.max.y) {
        this.y += PLAYER.step.y;
    }

    if (this.y <= PLAYER.loc.min.y) {
        this.winner = true;
        Player.prototype.showMessage();
    }
};

Player.prototype.showMessage = function() {
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
        player.winner = false;
        player.reset();
        body.removeChild(msg);
    });
    return msg;

};




// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const allEnemies = [
    new Enemy(ENEMY.loc.start.x, CHAR.loc.stoneTop.y - ENEMY.loc.adjustment.y, 200),
    new Enemy(ENEMY.loc.start.x, CHAR.loc.stoneMiddle.y - ENEMY.loc.adjustment.y, 100),
    new Enemy(ENEMY.loc.start.x, CHAR.loc.stoneBottom.y - ENEMY.loc.adjustment.y, 300)
];

const player = new Player(PLAYER.name.catGirl);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        'ArrowLeft': 'left',
        'ArrowUp': 'up',
        'ArrowRight': 'right',
        'ArrowDown': 'down'
    };

    player.handleInput(allowedKeys[e.key]);
});
