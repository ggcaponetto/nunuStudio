"use strict";

/**
 * Particle emitter is a wrapper for SPE particle system.
 *
 * SPE is a threejs based particle emitter engine.
 * 
 * Documentation for SPE particle engine can be found here https://squarefeet.github.io/ShaderParticleEngine/docs/api/index.html
 * 
 * @class ParticleEmitter
 * @extends {Points}
 * @module Particles
 */
function ParticleEmitter(group, emitter)
{
	/**
	 * Particle group instance.
	 * 
	 * @property group
	 * @type {ParticleGroup}
	 */
	this.group = new ParticleGroup(group !== undefined ? group : ParticleEmitter.defaultGroup);

	/**
	 * Emitter instance.
	 * 
	 * Emitter has attributes that can be used to controll the particle system
	 * 
	 * @property emitter
	 * @type {ParticleEmitterControl}
	 */
	this.emitter = new ParticleEmitterControl(emitter !== undefined ? emitter : ParticleEmitter.defaultEmitter);
	this.group.addEmitter(this.emitter);

	THREE.Points.call(this, this.group.geometry, this.group.material);

	this.type = "ParticleEmiter";
	this.name = "particle";
	this.frustumCulled = false;

	/**
	 * A dynamic particle emmiter ignores the position in its transform and applies it directly to the emitter origin.
	 *
	 * @property dinamicEmitter
	 * @type {Boolean} 
	 */
	this.dynamicEmitter = false;

	this.clock = new THREE.Clock();
	this.temp = new THREE.Vector4();

	/**
	 * Texture attached to the group of this particle emitter.
	 *
	 * @property texture
	 * @type {Texture} 
	 */
	var self = this;
	Object.defineProperties(this,
	{
		texture:
		{
			get: function(){return self.group.texture;},
			set: function(value){self.group.texture = value;}
		}
	});
}

/**
 * A map of supported distribution types used by ParticleEmitterControl instances.
 *
 * These distribution types can be applied to an emitter globally, which will affect the position, velocity, and acceleration value calculations for an emitter, or they can be applied on a per-property basis.
 *
 * @class ParticleDistributions
 */
var ParticleDistributions = {
	/**
	 * Values will be distributed within a box.
	 *
	 * @attribute BOX
	 * @type {Number}
	 */
	BOX: 1,

	/**
	 * Values will be distributed on a sphere.
	 *
	 * @attribute SPHERE
	 * @type {Number}
	 */
	SPHERE: 2,

	/**
	 * Values will be distributed on a 2d-disc shape.
	 *
	 * @attribute DISC
	 * @type {Number}
	 */
	DISC: 3,
};


/**
 * Set this value to however many "steps" you want value-over-lifetime properties to have.
 *
 * Its adjustable to fix an interpolation problem:
 *
 * Assuming you specify an opacity value as [0, 1, 0] and the valueOverLifetimeLength is 4, then the opacity value array will be reinterpolated to be [0, 0.66, 0.66, 0].
 * This isn't ideal, as particles would never reach full opacity.
 *
 * This property affects the length of ALL value-over-lifetime properties for ALL  emitters and ALL groups. Only values >= 3 && <= 4 are allowed.
 *
 * @attribute valueOverLifetimeLength
 * @type {Number}
 */
ParticleEmitter.valueOverLifetimeLength = 4;

ParticleEmitter.prototype = Object.create(THREE.Points.prototype);

/**
 * Default particle emitter configuration.
 *
 * @attribute defaultEmitter
 * @type {Object}
 */
ParticleEmitter.defaultEmitter =
{		
	particleCount: 200,
	velocity:
	{
		value: new THREE.Vector3(0, 0, 0),
		spread: new THREE.Vector3(3, 3, 3)
	},
	acceleration:
	{
		value: new THREE.Vector3(0, 0, 0),
		spread: new THREE.Vector3(0, 0, 0)
	}
};

/**
 * Default particle emitter group configuration.
 *
 * @attribute defaultGroup
 * @type {Object}
 */
ParticleEmitter.defaultGroup = 
{
	texture:
	{
		value: null
	},
	maxParticleCount: 200,
	blending: THREE.AdditiveBlending,
	fog: false,
	depthWrite: false,
	depthTest: true,
	transparent: true,
	hasPerspective: true
};

/**
 * Reload internal material and geometry of this particle emitter.
 *
 * Recretes the group and emitter object attached to the particle.
 *
 * May be required after changing material related parameters.
 * 
 * @method reload
 */
ParticleEmitter.prototype.reload = function()
{
	this.dispose();

	var children = this.children;
	this.children = [];
	var particle = new ObjectLoader().parse(this.toJSON());
	this.children = children;

	this.group = particle.group;
	this.emitter = particle.emitter;
	this.geometry = this.group.geometry;
	this.material = this.group.material;
};

/**
 * Update particle object matrix.
 *
 * Ignores the particle position if the moveEmitter attribute is set true.
 * 
 * @method updateMatrix
 */
ParticleEmitter.prototype.updateMatrix = function()
{
	if(this.dynamicEmitter)
	{
		this.matrix.makeRotationFromQuaternion(this.quaternion);
		this.matrix.scale(this.scale);
	}
	else
	{
		this.matrix.compose(this.position, this.quaternion, this.scale);
	}

	this.matrixWorldNeedsUpdate = true;
};

/**
 * Particle emitter state is automatically updated before rendering.
 * 
 * @method onBeforeRender
 */
ParticleEmitter.prototype.onBeforeRender = function(renderer, scene, camera, renderTarget)
{
	this.group.uniforms.scale.value = renderer.getCurrentViewport(this.temp).w;
	this.group.tick(this.clock.getDelta());

	if(this.dynamicEmitter === true)
	{
		this.emitter.position.value = this.position;	
	}
};

/**
 * Dispose particle emitter.
 *
 * Should be called when destroying particle emitter.
 * 
 * @method dispose
 */
ParticleEmitter.prototype.dispose = function()
{
	this.group.dispose();

	THREE.Object3D.prototype.dispose.call(this);
};

/**
 * Serialize object to JSON.
 *
 * @method toJSON
 * @param {Object} meta
 * @return {Object} json
 */
ParticleEmitter.prototype.toJSON = function(meta)
{
	var material = this.material;
	var geometry = this.geometry;
	this.material = undefined;
	this.geometry = undefined;

	var texture = this.group.texture;
	var data = THREE.Object3D.prototype.toJSON.call(this, meta, function(meta, object)
	{	
		texture = texture.toJSON(meta);
	});

	this.material = material;
	this.geometry = geometry;

	//Group 
	data.object.group = this.group.toJSON(meta);
	
	//Emitter
	data.object.emitter = this.emitter.toJSON(meta);

	return data;
};



