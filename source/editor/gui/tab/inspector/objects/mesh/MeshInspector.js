"use strict";

function MeshInspector(parent, object)
{
	DrawableInspector.call(this, parent, object);

	this.geometry = GeometryForm.create(this.form, this.object);
}

MeshInspector.prototype = Object.create(DrawableInspector.prototype);

MeshInspector.prototype.updateInspector = function()
{
	DrawableInspector.prototype.updateInspector.call(this);
	
	if(this.geometry !== null)
	{
		try
		{
			this.geometry.updateValues();
		}
		catch(e)
		{
			this.geometry.destroy();
			this.geometry = GeometryForm.create(this.form, this.object);
		}
	}
};
