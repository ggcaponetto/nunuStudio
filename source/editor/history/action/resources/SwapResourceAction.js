"use strict";

/**
 * Swap resource in the resource manager. The new resource is used to replace the old one.
 *
 * Usages of the old resource are replaced with the new one as well.
 *
 * @class SwapResourceAction
 * @param {Resource} oldResource Resource to remove.
 * @param {Resource} newResource Resource to add.
 * @param {ResourceManager} manager Manager to insert the resource into.
 * @param {String} category Category of the resource.
 */
function SwapResourceAction(oldResource, newResource, manager, category)
{
	Action.call(this);
	
	this.oldResource = oldResource;
	this.newResource = newResource;
	this.manager = manager;
	this.category = category;
}

SwapResourceAction.prototype.apply = function()
{
	ResourceUtils.swapResource(this.manager, this.category, this.oldResource, this.newResource);
	
	if(this.oldResource.dispose !== undefined)
	{
		this.oldResource.dispose();
	}

	SwapResourceAction.updateGUI();
};

SwapResourceAction.prototype.revert = function()
{
	ResourceUtils.swapResource(this.manager, this.category, this.newResource, this.oldResource);

	if(this.newResource.dispose !== undefined)
	{
		this.newResource.dispose();
	}

	SwapResourceAction.updateGUI();
};

SwapResourceAction.updateGUI = function()
{
	Editor.updateObjectsViewsGUI();
};