// ======
// Weapon
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Airstrike(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    
    this.initAngle = this.rotation - Math.PI / 2;
    this.initX = this.cx;
    this.initY = this.cy;
    this.ammo = 1;

    this.sprite = g_sprites.Grenade;
    this.weaponSprite = g_sprites.airstrike;
    this.weaponSprite.scale = 0.8;
    this.weaponSprite.offsetY = -8;
    this.weaponSprite.offsetX = 8;

    this.scalablePower = false;
}

Airstrike.prototype = new Weapon();

// HACKED-IN AUDIO (no preloading)
Airstrike.prototype.fireSound = new Audio("sounds/airstrike.wav");
Airstrike.prototype.explosionSound = new Audio("sounds/airstrikeExplosion2.wav");
    
// Initial, inheritable, default values
Airstrike.prototype.damageRadius = 40;
Airstrike.prototype.t = 0;

Airstrike.prototype.fire = function(cx, cy, rotation) {
    if(this.ammo <= 0) return;
    g_mouseAim = true;
    this.ammo--;
}

Airstrike.prototype.update = function (du) {
    spatialManager.unregister(this);
    
    // did it hit something?
    var mapHit = this.checkIfHitMap();
    console.log(mapHit);
    if(mapHit) {
        this.explosionSound.play();
        this.damageMap();
        this.damageWorms();
        return entityManager.KILL_ME_NOW;
    }

    // has it left the frame?
    if(this.cx - OFFSET_X > g_canvas.width || this.cx < 0 || 
        this.cy - OFFSET_Y > g_canvas.height)
        return entityManager.KILL_ME_NOW;

    this.t += du;
    this.cx = this.initX + this.initVel*this.t*Math.cos(this.initAngle);
    this.cy = this.initY + this.initVel*this.t*Math.sin(this.initAngle) + 
                    0.5*NOMINAL_GRAVITY*util.square(this.t);
  
    
    // Handle collisions
    //
    var hitEntity = this.findHitEntity();
    if (hitEntity && this.age > 3*du) {
        var canTakeHit = hitEntity.takeWeaponHit;
        if (canTakeHit) 
            hitEntity.takeDamage(this.cx, this.cy, this.damageRadius) 
        
        return entityManager.KILL_ME_NOW;
    }
    
    
    spatialManager.register(this);

};
