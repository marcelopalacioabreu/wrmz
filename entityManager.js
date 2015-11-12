/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA
_worms   : [],
_worms2  : [],
_map : [],
_weapons : [],
_activeWorm: 0,
_initTimer : 60,
_timer : 60,
shakeEffectTimer: -1,
_animations: [],

// "PRIVATE" METHODS

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._map, this._worms2, this._worms, this._weapons, this._animations];
},

init: function() {
    this.generateMap();
    //this._generateRocks();
    //this._generateShip();
},

selectNextWorm: function() {
    this._worms[this._activeWorm].isActive = false;
    this._activeWorm = ++this._activeWorm % this._worms.length;
    this._worms[this._activeWorm].isActive = true;
    console.log("currently active: worm " + this._activeWorm);
},

destroyMap: function(cx, cy, r) {
    this._map[0].destroy(cx, cy, r);
},

damageWorms: function(cx, cy, r) {
    for(var i = 0; i < this._worms.length; i++) {
        this._worms[i].takeDamage(cx, cy, r);
        console.log("damaging worm #"+i+"at: "+this._worms[i].cx+" , "+this._worms[i].cy);
        this._worms[i].shockWave(cx, cy, r);
    }
},

fireWeapon: function(cx, cy, velX, velY, rotation, weapon) {
    // the worm's weapon is passed to the function as a string
    // this is a fix so the appropriate weapon can be created
    var fn = window[weapon];
    this._weapons.push(new fn({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,

        rotation : rotation,
        initVel : 10
    }));
    this._timer = this._initTimer;
    this.selectNextWorm();
},

fireAirstrike: function(cx) {
    var fn = window['Airstrike'];
    for(var i = 0; i < 5; i++) {
        this._weapons.push(new fn({
            cx   : cx+(i-2)*20,
            cy   : 0,
            velX : 0.2,
            velY : 0.2,

            rotation : 0,
            initVel : 0.03
        }));
    }
    this._timer = this._initTimer;
    this._selectNextWorm();
},

generateWorm : function(descr) {
    this._worms.push(new Worm(descr));
},

generateMap : function(descr) {
    this._map.push(new Map(descr)); // TODO fix parameter to map image variable

},

update: function(du) {

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {

            var status = aCategory[i].update(du);

            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                
                if(!(aCategory[i] instanceof Animation)) {
                    var animation = new Animation(g_images.explosion, 4, 4);
                    animation.setPos(aCategory[i].getPos());
                    animation.setSpeed(0.5);
                    animation.setScale(2);

                    this._animations.push(animation);
                }

                aCategory.splice(i,1);
            }
            else {
                ++i;
            }
        }
    }
    if(this._timer > 0) {
        this._timer -= du/SECS_TO_NOMINALS;
    } else {
        this.selectNextWorm();
        this._timer = this._initTimer;
    }
    this.shakeEffectTimer -=du/SECS_TO_NOMINALS;
},

render: function(ctx) {
    ctx.save();

    if(this.shakeEffectTimer > 0){
        var dx = Math.random()*4*this.shakeEffectTimer;
        var dy = Math.random()*10*this.shakeEffectTimer;
        ctx.translate(dx, dy);
    }

    var debugX = 10, debugY = 100;

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        if (!this._bShowRocks && 
            aCategory == this._rocks)
            continue;

        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);

        }
        debugY += 10;
    }

    ctx.restore();

    if(this.doAnimation) {

    }

    ctx.save();
    ctx.font = '20pt Arial Bold';
    ctx.fillText(Math.ceil(this._timer), 20, 40);
    ctx.restore();
    
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

