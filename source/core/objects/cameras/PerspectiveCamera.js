"use strict";

/**
 * Perspective camera, used for 3D scenes with objects getting smaller as they get away from the camera.
 * 
 * Based on THREE.PerspectiveCamera, original documentation available at https://threejs.org/docs/index.html#Reference/Cameras/PerspectiveCamera.
 * 
 * @class PerspectiveCamera
 * @extends {PerspectiveCamera}
 * @module Cameras
 * @param {Number} fov Field of view
 * @param {Number} aspect Aspect ratio
 * @param {Number} near Near projection plane (how closer can be objects visible by this camera)
 * @param {Number} far Far projection plane (how far can be objects visible by this camera)
 */
/**
 * Camera field of view in degrees.
 * 
 * @property fov
 * @default 50
 * @type {Number}
 */
/**
 * Camera aspect ratio X/Y.
 * 
 * @property aspect
 * @default 1.0
 * @type {Number}
 */
/**
 * Camera zoom.
 * 
 * @property zoom
 * @default 1.0
 * @type {Number}
 */
function PerspectiveCamera(fov, aspect, near, far)
{
	/**
	 * Camera viewport indicates where the image is drawn on the screen.
	 * 
	 * @property viewport
	 * @type {Viewport}
	*/
	this.viewport = new Viewport();
	
	THREE.PerspectiveCamera.call(this, fov, aspect, near, far);

	this.name = "camera";

	/**
	 * Clear screen color flag.
	 * 
	 * @property clearColor
	 * @default false
	 * @type {boolean}
	*/
	this.clearColor = true;

	/**
	 * Clear depth flag.
	 * 
	 * @property clearDepth
	 * @default false
	 * @type {boolean}
	*/
	this.clearDepth = true;

	/**
	 * Clear stencil buffer flag.
	 * 
	 * @property clearDepth
	 * @default false
	 * @type {boolean}
	*/
	this.clearStencil = true;

	/**
	 * Camera draw order preference.
	 * 
	 * If more than one camera has the same order value the draw order is undefined for those cameras.
	 * 
	 * @property order
	 * @default 0
	 * @type {Number}
	*/
	this.order = 0;

	/**
	 * Effect composed of this camera. Is used to render the scene to the screen and apply effects.
	 *
	 * It is inialized with a RenderPass attached to it.
	 * 
	 * @property composer
	 * @type {EffectComposer}
	 */
	this.composer = new EffectComposer();

	var renderPass = new RenderPass();
	renderPass.renderToScreen = true;
	this.composer.addPass(renderPass);
}

PerspectiveCamera.prototype = Object.create(THREE.PerspectiveCamera.prototype);

/**
 * Prepare the renderer to render the frame using the camera settings.
 *
 * Should be called before the render() method to setup clear configuration and viewport.
 *
 * @method setupRenderer
 * @param {WebGLRenderer} renderer WebGL renderer to configure.
 */
PerspectiveCamera.prototype.setupRenderer = function(renderer)
{
	this.viewport.enable(renderer);
	renderer.clear(this.clearColor, this.clearDepth, this.clearStencil);
};

/**
 * Render a scene using this camera and the internal EffectComposer.
 *
 * @method render
 * @param {WebGLRenderer} renderer WebGL renderer to use.
 * @param {Scene} scene Scene to be rendered.
 */
PerspectiveCamera.prototype.render = function(renderer, scene)
{
	this.composer.render(renderer, scene, this, 0.016);
};

/**
 * Resize this camera, should be called every time after resizing the screen.
 *
 * @method resize
 * @param {Number} x Width.
 * @param {Number} y Height.
 */
PerspectiveCamera.prototype.resize = function(x, y)
{
	if(this.viewport.mode === Viewport.RELATIVE)
	{
		this.composer.setSize(x * this.viewport.size.x, y * this.viewport.size.y);
	}
	else if(this.viewport.mode === Viewport.ABSOLUTE)
	{
		this.composer.setSize(this.viewport.size.x, this.viewport.size.y);
	}
};

/**
 * Destroy camera object and remove it from the scene.
 * 
 * @method destroy
 */
PerspectiveCamera.prototype.destroy = function()
{
	var scene = this.getScene();
	if(scene !== null)
	{
		scene.removeCamera(this);
	}
	
	THREE.Object3D.prototype.destroy.call(this);
};

/**
 * Update camera projection matrix.
 * 
 * Should be called after chaging projection parameters.
 * 
 * @method updateProjectionMatrix
 */
PerspectiveCamera.prototype.updateProjectionMatrix = function()
{
	var top = this.near * Math.tan(THREE.Math.DEG2RAD * 0.5 * this.fov) / this.zoom;
	var height = 2 * top;
	var width = this.aspect * height * this.viewport.getAspectRatio();
	var left = -0.5 * width;

	if(this.filmOffset !== 0)
	{
		left += this.near * this.filmOffset / this.getFilmWidth();
	}

	this.projectionMatrix.makePerspective(left, left + width, top, top - height, this.near, this.far);
};

PerspectiveCamera.prototype.toJSON = function(meta)
{
	var data = THREE.PerspectiveCamera.prototype.toJSON.call(this, meta);

	data.object.clearColor = this.clearColor;
	data.object.clearDepth = this.clearDepth;
	data.object.clearStencil = this.clearStencil;

	data.object.viewport = this.viewport.toJSON();

	data.object.order = this.order;
	data.object.composer = this.composer.toJSON();

	return data;
};
