"use strict";

function MeshPhysicalMaterialEditor(parent, closeable, container, index)
{
	MeshStandardMaterialEditor.call(this, parent, closeable, container, index);

	var self = this;

	//Clear coat
	this.form.addText("Clear coat");
	this.clearcoat = new Slider(this.form);
	this.clearcoat.size.set(160, 18);
	this.clearcoat.setRange(0, 1);
	this.clearcoat.setStep(0.01);
	this.clearcoat.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "clearcoat", self.clearcoat.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.clearcoat);
	this.form.nextRow();

	//Clear coat roughness
	this.form.addText("Clear coat roughness");
	this.clearcoatRoughness = new Slider(this.form);
	this.clearcoatRoughness.size.set(160, 18);
	this.clearcoatRoughness.setRange(0, 1);
	this.clearcoatRoughness.setStep(0.01);
	this.clearcoatRoughness.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "clearcoatRoughness", self.clearcoatRoughness.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.clearcoatRoughness);
	this.form.nextRow();

	//Reflectivity
	this.form.addText("Reflectivity");
	this.reflectivity = new Slider(this.form);
	this.reflectivity.size.set(160, 18);
	this.reflectivity.setRange(0, 1);
	this.reflectivity.setStep(0.01);
	this.reflectivity.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "reflectivity", self.reflectivity.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.reflectivity);
	this.form.nextRow();

	//Transparency
	this.form.addText("Transparency");
	this.transparency = new Slider(this.form);
	this.transparency.size.set(160, 18);
	this.transparency.setRange(0, 1);
	this.transparency.setStep(0.01);
	this.transparency.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "transparency", self.transparency.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.transparency);
	this.form.nextRow();

	//Clear coat normal map
	this.form.addText("Clearcoat normal map");
	this.clearcoatNormalMap = new TextureForm(this.form);
	this.clearcoatNormalMap.size.set(0, 100);
	this.clearcoatNormalMap.setOnChange(function(file)
	{
		Editor.addAction(new ChangeAction(self.material, "clearcoatNormalMap", self.clearcoatNormalMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.clearcoatNormalMap);
	this.form.nextRow();

	//Clear coat normal map scale
	this.form.addText("Clearcoat normal Scale");
	this.clearcoatNormalScale = new VectorBox(this.form);
	this.clearcoatNormalScale.size.set(0, 18);
	this.clearcoatNormalScale.setType(VectorBox.VECTOR2);
	this.clearcoatNormalScale.setValue(1, 1, 0);
	this.clearcoatNormalScale.setOnChange(function()
	{
		self.material.clearcoatNormalScale.copy(self.clearcoatNormalScale.getValue());
		self.material.needsUpdate = true;
	});
	this.form.add(this.clearcoatNormalScale);
	this.form.nextRow();
}

MeshPhysicalMaterialEditor.prototype = Object.create(MeshStandardMaterialEditor.prototype);

MeshPhysicalMaterialEditor.prototype.attach = function(material, asset)
{
	MeshStandardMaterialEditor.prototype.attach.call(this, material, asset);

	this.clearcoat.setValue(material.clearcoat);
	this.clearcoatRoughness.setValue(material.clearcoatRoughness);
	this.reflectivity.setValue(material.reflectivity);
};
