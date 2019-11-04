"use strict";

/**
 * Canvas textures can be used to draw content to the texture during runtime, using the context property.
 * 
 * Canvas textures always start with black background and a red text "Canvas Texture".
 * 
 * @class CanvasTexture
 * @extends {Texture}
 * @module Textures
 * @param {Number} width Canvas width
 * @param {Number} height Canvas height
 * @param {Number} mapping
 * @param {Number} wrapS
 * @param {Number} wrapT
 * @param {Number} magFilter
 * @param {Number} minFilter
 * @param {Number} format
 * @param {Number} type
 * @param {Number} anisotropy
 * @param {Number} encoding
 */
function CanvasTexture(width, height, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding)
{
	/**
	 * Image is used to store a DOM canvas element.
	 * 
	 * @property image
	 * @type {DOM}
	 */
	THREE.Texture.call(this, document.createElement("canvas"), mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);

	this.name = "canvas";
	this.category = "Canvas";
	this.format = THREE.RGBAFormat;

	Object.defineProperties(this,
	{
		/**
		 * Canvas width, internal resolution of the canvas texture.
		 * 
		 * @property width
		 * @type {Number}
		 */
		width:
		{
			get: function(){return this.image.width;},
			set: function(value){this.image.width = value;}
		},

		/**
		 * Canvas height, internal resolution of the canvas texture.
		 * 
		 * @property height
		 * @type {Number}
		 */
		height:
		{
			get: function(){return this.image.height;},
			set: function(value){this.image.height = value;}
		}
	});

	this.width = (width !== undefined) ? width : 1;
	this.height = (height !== undefined) ? height : 1;

	/**
	 * Canvas context 2D, can be used to draw content do the canvas texture.
	 * 
	 * @property context
	 * @type {Context2D}
	 */
	this.context = this.image.getContext("2d");
}

CanvasTexture.prototype = Object.create(THREE.Texture.prototype);
CanvasTexture.prototype.isCanvasTexture = true;

/**
 * Draw a placeholder figure into the canvas texture.
 * 
 * @method placeholder
 */
CanvasTexture.prototype.placeholder = function()
{	
	this.context.fillStyle = "#000000";
	this.context.fillRect(0, 0, this.width, this.height);
	this.context.font = "Normal " + Math.round(this.width / 12) +  "px Arial";
	this.context.textAlign = "center";
	this.context.fillStyle = "#FF0000";
	this.context.fillText("Canvas Texture", this.width/2, this.height/2);
	this.needsUpdate = true;
};

/**
 * Clear canvas texture with a background color.
 *
 * Uses the internal context to draw a rect to fill the canvas.
 *
 * @method clear
 * @param {String} color
 */
CanvasTexture.prototype.clear = function(color)
{
	if(color === undefined)
	{
		this.context.clearRect(0, 0, width, height);
	}
	else
	{
		this.context.fillStyle = color;
		this.context.fillRect(0, 0, this.width, this.height);
	}
};

/**
 * Create JSON description for canvas texture, canvas image is not serialized.
 * 
 * @param {Object} meta
 * @method toJSON
 */
CanvasTexture.prototype.toJSON = function(meta)
{
	var data = THREE.Texture.prototype.toJSON.call(this, meta);

	data.width = this.width;
	data.height = this.height;

	return data;
};
