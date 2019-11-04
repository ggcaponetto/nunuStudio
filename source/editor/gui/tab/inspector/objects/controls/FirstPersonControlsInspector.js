"use strict";

function FirstPersonControlsInspector(parent, object)
{
	ObjectInspector.call(this, parent, object);

	var self = this;

	//Needs button pressed
	this.form.addText("Require button");
	this.needsButtonPressed = new CheckBox(this.form);
	this.needsButtonPressed.size.set(18, 18);
	this.needsButtonPressed.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "needsButtonPressed", self.needsButtonPressed.getValue()));
	});
	this.form.add(this.needsButtonPressed);
	this.form.nextRow();
	
	//Sensitivity
	this.form.addText("Sensitivity");
	this.sensitivity = new Slider(this.form);
	this.sensitivity.size.set(140, 18);
	this.sensitivity.setStep(0.0001);
	this.sensitivity.setRange(0, 0.05);
	this.sensitivity.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "sensitivity", self.sensitivity.getValue()));
	});
	this.form.add(this.sensitivity);
	this.form.nextRow();

	//Movement
	this.form.addText("Movement");
	this.movementEnabled = new CheckBox(this.form);
	this.movementEnabled.size.set(18, 18);
	this.movementEnabled.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "movementEnabled", self.movementEnabled.getValue()));
	});
	this.form.add(this.movementEnabled);
	this.form.nextRow();

	//Move speed
	this.form.addText("Move speed");
	this.moveSpeed = new Slider(this.form);
	this.moveSpeed.size.set(140, 18);
	this.moveSpeed.setStep(0.01);
	this.moveSpeed.setRange(0, 0.5);
	this.moveSpeed.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "moveSpeed", self.moveSpeed.getValue()));
	});
	this.form.add(this.moveSpeed);
	this.form.nextRow();

	//Move on plane
	this.form.addText("Move plane");
	this.moveOnPlane = new CheckBox(this.form);
	this.moveOnPlane.size.set(18, 18);
	this.moveOnPlane.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "moveOnPlane", self.moveOnPlane.getValue()));
	});
	this.form.add(this.moveOnPlane);
	this.form.nextRow();
}

FirstPersonControlsInspector.prototype = Object.create(ObjectInspector.prototype);

FirstPersonControlsInspector.prototype.updateInspector = function()
{
	ObjectInspector.prototype.updateInspector.call(this);
	
	this.needsButtonPressed.setValue(this.object.needsButtonPressed);
	this.movementEnabled.setValue(this.object.movementEnabled);
	this.sensitivity.setValue(this.object.sensitivity);
	this.moveSpeed.setValue(this.object.moveSpeed);
	this.moveOnPlane.setValue(this.object.moveOnPlane);
};
