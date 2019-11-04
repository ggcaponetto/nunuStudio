"use strict";

function RingGeometryForm(form, object)
{
	this.form = form;
	this.object = object;
	
	var self = this;

	var updateGeometry = function()
	{
		self.updateGeometry();
	};

	this.form.addText("Ring Geometry");
	this.form.nextRow();
	
	//Inner radius
	this.form.addText("Inner radius");
	this.innerRadius = new NumberBox(this.form);
	this.innerRadius.size.set(60, 18);
	this.innerRadius.setStep(0.1);
	this.innerRadius.setRange(0, Number.MAX_SAFE_INTEGER);
	this.innerRadius.setOnChange(updateGeometry);
	this.form.add(this.innerRadius);
	this.form.nextRow();

	//Outer radius
	this.form.addText("Outer radius");
	this.outerRadius = new NumberBox(this.form);
	this.outerRadius.size.set(60, 18);
	this.outerRadius.setStep(0.1);
	this.outerRadius.setRange(0, Number.MAX_SAFE_INTEGER);
	this.outerRadius.setOnChange(updateGeometry);
	this.form.add(this.outerRadius);
	this.form.nextRow();

	//Theta segments
	this.form.addText("Theta segments");
	this.thetaSegments = new NumberBox(this.form);
	this.thetaSegments.size.set(60, 18);
	this.thetaSegments.setStep(1.0);
	this.thetaSegments.setRange(3, Number.MAX_SAFE_INTEGER);
	this.thetaSegments.setOnChange(updateGeometry);
	this.form.add(this.thetaSegments);
	this.form.nextRow();

	//Phi segments
	this.form.addText("Phi segments");
	this.phiSegments = new NumberBox(this.form);
	this.phiSegments.size.set(60, 18);
	this.phiSegments.setStep(1.0);
	this.phiSegments.setRange(3, Number.MAX_SAFE_INTEGER);
	this.phiSegments.setOnChange(updateGeometry);
	this.form.add(this.phiSegments);
	this.form.nextRow();

	//Theta start
	this.form.addText("Theta start");
	this.thetaStart = new NumberBox(this.form);
	this.thetaStart.size.set(60, 18);
	this.thetaStart.setStep(0.1);
	this.thetaStart.setOnChange(updateGeometry);
	this.form.add(this.thetaStart);
	this.form.nextRow();

	//Theta length
	this.form.addText("Theta length");
	this.thetaLength = new NumberBox(this.form);
	this.thetaLength.size.set(60, 18);
	this.thetaLength.setStep(0.1);
	this.thetaLength.setOnChange(updateGeometry);
	this.form.add(this.thetaLength);
	this.form.nextRow();

	//Buffer
	this.buffer = new CheckBox(this.form);
	this.form.addText("Buffered");
	this.buffer.size.set(18, 18);
	this.buffer.setOnChange(updateGeometry);
	this.form.add(this.buffer);
	this.form.nextRow();
}

RingGeometryForm.prototype.updateGeometry = function()
{
	this.object.geometry.dispose();
	var GeometryConstructor = this.buffer.getValue() ? THREE.RingBufferGeometry : THREE.RingGeometry;
	Editor.addAction(new ChangeAction(this.object, "geometry", new GeometryConstructor(this.innerRadius.getValue(), this.outerRadius.getValue(), this.thetaSegments.getValue(), this.phiSegments.getValue(), this.thetaStart.getValue(), this.thetaLength.getValue())));
};

RingGeometryForm.prototype.updateValues = function()
{
	this.innerRadius.setValue(this.object.geometry.parameters.innerRadius || 0.5);
	this.outerRadius.setValue(this.object.geometry.parameters.outerRadius || 1);
	this.thetaSegments.setValue(this.object.geometry.parameters.thetaSegments || 8);
	this.phiSegments.setValue(this.object.geometry.parameters.phiSegments || 8);
	this.thetaStart.setValue(this.object.geometry.parameters.thetaStart || 0);
	this.thetaLength.setValue(this.object.geometry.parameters.thetaLength || Math.PI * 2);
	this.buffer.setValue(this.object.geometry instanceof THREE.BufferGeometry);
};