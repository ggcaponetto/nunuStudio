"use strict";

function SkyInspector(parent, object)
{
	ObjectInspector.call(this, parent, object);

	var self = this;

	//Sky color
	this.form.addText(Locale.skyColor);
	this.form.nextRow();

	function updateSky()
	{
		self.object.updateSky();
	}

	//Top color
	this.form.addText("Top color");
	this.colorTop = new ColorGradientChooser(this.form);
	this.colorTop.size.set(190, 18);
	this.colorTop.setOnChange(function(color, index)
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object.colorTop, index, color.clone()), updateSky));
	});
	this.form.add(this.colorTop);
	this.form.nextRow();

	//Bottom color
	this.form.addText("Bottom color");
	this.colorBottom = new ColorGradientChooser(this.form);
	this.colorBottom.size.set(190, 18);
	this.colorBottom.setOnChange(function(color, index)
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object.colorBottom, index, color.clone()), updateSky));
	});
	this.form.add(this.colorBottom);
	this.form.nextRow();

	//Sun color
	this.form.addText("Sun Color");
	this.sunColor = new ColorChooser(this.form);
	this.sunColor.size.set(80, 18);
	this.sunColor.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "sunColor", self.sunColor.getValueHex()), updateSky));
	});
	this.form.add(this.sunColor);
	this.form.nextRow();

	//Moon color
	this.form.addText("Moon Color");
	this.moonColor = new ColorChooser(this.form);
	this.moonColor.size.set(80, 18);
	this.moonColor.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "moonColor", self.moonColor.getValueHex()), updateSky));
	});
	this.form.add(this.moonColor);
	this.form.nextRow();

	//Intensity
	this.form.addText(Locale.intensity);
	this.intensity = new Slider(this.form);
	this.intensity.size.set(160, 18);
	this.intensity.setStep(0.01);
	this.intensity.setRange(0, 1);
	this.intensity.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "intensity", self.intensity.getValue()));
	});
	this.form.add(this.intensity);
	this.form.nextRow();

	//Day time
	this.form.addText("Day time");
	this.form.nextRow();

	//Auto update
	this.form.addText(Locale.autoUpdate);
	this.autoUpdate = new CheckBox(this.form);
	this.autoUpdate.size.set(18, 18);
	this.autoUpdate.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "autoUpdate", self.autoUpdate.getValue()));
	});
	this.form.add(this.autoUpdate);
	this.form.nextRow();

	//Day time
	this.form.addText("Day duration");
	this.dayTime = new NumberBox(this.form);
	this.dayTime.size.set(60, 18);
	this.dayTime.setStep(0.1);
	this.dayTime.setOnChange(function()
	{
		//Check and set day time
		var dayTime = self.dayTime.getValue();
		if(dayTime < 0)
		{
			dayTime = 0;
			self.dayTime.setValue(dayTime);
		}
		Editor.addAction(new ChangeAction(self.object, "dayTime", dayTime));

		//Check actual time
		if(self.object.time > dayTime)
		{
			Editor.addAction(new ChangeAction(self.object, "time", dayTime));
			self.time.setValue(dayTime);
		}

		self.time.setRange(0, dayTime);
		self.object.updateSky();
	});
	this.form.add(this.dayTime);
	this.form.addText("s", true);
	this.form.nextRow();

	//Actual time 
	this.form.addText(Locale.time);
	this.time = new NumberBox(this.form);
	this.time.size.set(60, 18);
	this.time.setStep(0.1);
	this.time.setOnChange(function()
	{
		var time = self.time.getValue();

		if(time < 0)
		{
			time = 0;
			self.time.setValue(time);
		}
		else if(time > self.object.dayTime)
		{
			time = self.object.dayTime;
			self.time.setValue(time);
		}

		Editor.addAction(new ChangeAction(self.object, "time", time));
		self.object.updateSky();
	});
	this.form.add(this.time);
	this.form.addText("s", true);
	this.form.nextRow();

	//Sun distance
	this.form.addText(Locale.sunDistance);
	this.sunDistance = new NumberBox(this.form);
	this.sunDistance.size.set(60, 18);
	this.sunDistance.setStep(10);
	this.sunDistance.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "sunDistance", self.sunDistance.getValue()), updateSky));
	});
	this.form.add(this.sunDistance);
	this.form.nextRow();

	//Shadow map
	this.form.addText(Locale.shadows);
	this.form.nextRow();

	//Cast shadow
	this.castShadow = new CheckBox(this.form);
	this.form.addText(Locale.castShadows);
	this.castShadow.size.set(18, 18);
	this.castShadow.position.set(5, 85);
	this.castShadow.updateInterface();
	this.castShadow.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.sun, "castShadow", self.castShadow.getValue()));
	});
	this.form.add(this.castShadow);
	this.form.nextRow();

	//Shadow resolution
	this.form.addText(Locale.resolution);
	this.shadowWidth = new DropdownList(this.form);
	this.shadowWidth.size.set(60, 18);
	this.shadowWidth.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.sun.shadow.mapSize, "width", self.shadowWidth.getValue()));
		self.object.sun.updateShadowMap();
	});
	this.form.add(this.shadowWidth);
	this.form.addText("x", true);
	this.shadowHeight = new DropdownList(this.form);
	this.shadowHeight.size.set(60, 18);
	this.shadowHeight.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.sun.shadow.mapSize, "height", self.shadowHeight.getValue()));
		self.object.sun.updateShadowMap();
	});
	this.form.add(this.shadowHeight);
	this.form.nextRow();

	for(var i = 5; i < 13; i++)
	{
		var size = Math.pow(2, i);
		this.shadowWidth.addValue(size.toString(), size);
		this.shadowHeight.addValue(size.toString(), size);
	}

	//Shadowmap camera near
	this.form.addText(Locale.near);
	this.shadowNear = new NumberBox(this.form);
	this.shadowNear.size.set(60, 18);
	this.shadowNear.setStep(0.1);
	this.shadowNear.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.sun.shadow.camera, "near", self.shadowNear.getValue()));
		self.object.sun.updateShadowMap();
	});
	this.form.add(this.shadowNear);
	this.form.nextRow();
	
	//Shadowmap camera far
	this.form.addText(Locale.near);
	this.shadowFar = new NumberBox(this.form);
	this.shadowFar.size.set(60, 18);
	this.shadowFar.setStep(0.1);
	this.shadowFar.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.sun.shadow.camera, "far", self.shadowFar.getValue()));
		self.object.sun.updateShadowMap();
	});
	this.form.add(this.shadowFar);
	this.form.nextRow();

	//Shadowmap camera left
	this.form.addText(Locale.left);
	this.shadowLeft = new NumberBox(this.form);
	this.shadowLeft.size.set(60, 18);
	this.shadowLeft.setStep(0.1);
	this.shadowLeft.setOnChange(function()
	{
		self.object.sun.shadow.camera.left = self.shadowLeft.getValue();
		self.object.sun.updateShadowMap();
	});
	this.form.add(this.shadowLeft);
	this.form.nextRow();

	//Shadowmap camera right
	this.form.addText(Locale.right);
	this.shadowRight = new NumberBox(this.form);
	this.shadowRight.size.set(60, 18);
	this.shadowRight.setStep(0.1);
	this.shadowRight.setOnChange(function()
	{
		self.object.sun.shadow.camera.right = self.shadowRight.getValue();
		self.object.sun.updateShadowMap();
	});
	this.form.add(this.shadowRight);
	this.form.nextRow();

	//Shadowmap camera top
	this.form.addText(Locale.top);
	this.shadowTop = new NumberBox(this.form);
	this.shadowTop.size.set(60, 18);
	this.shadowTop.setStep(0.1);
	this.shadowTop.setOnChange(function()
	{
		self.object.sun.shadow.camera.top = self.shadowTop.getValue();
		self.object.sun.updateShadowMap();
	});
	this.form.add(this.shadowTop);
	this.form.nextRow();

	//Shadowmap camera bottom
	this.form.addText(Locale.bottom);
	this.shadowBottom = new NumberBox(this.form);
	this.shadowBottom.size.set(60, 18);
	this.shadowBottom.setStep(0.1);
	this.shadowBottom.setOnChange(function()
	{
		self.object.sun.shadow.camera.bottom = self.shadowBottom.getValue();
		self.object.sun.updateShadowMap();
	});
	this.form.add(this.shadowBottom);
	this.form.nextRow();
}

SkyInspector.prototype = Object.create(ObjectInspector.prototype);

SkyInspector.prototype.updateInspector = function()
{
	ObjectInspector.prototype.updateInspector.call(this);
	
	this.colorTop.setValue(this.object.colorTop);
	this.colorBottom.setValue(this.object.colorBottom);
	
	this.sunColor.setValueHex(this.object.sunColor);
	this.moonColor.setValueHex(this.object.moonColor);
	this.intensity.setValue(this.object.intensity);

	this.autoUpdate.setValue(this.object.autoUpdate);
	this.dayTime.setValue(this.object.dayTime);
	this.time.setValue(this.object.time);
	this.sunDistance.setValue(this.object.sunDistance);

	this.castShadow.setValue(this.object.sun.castShadow);
	this.shadowWidth.setValue(this.object.sun.shadow.mapSize.width);
	this.shadowHeight.setValue(this.object.sun.shadow.mapSize.height);
	this.shadowNear.setValue(this.object.sun.shadow.camera.near);
	this.shadowFar.setValue(this.object.sun.shadow.camera.far);
	this.shadowLeft.setValue(this.object.sun.shadow.camera.left);
	this.shadowRight.setValue(this.object.sun.shadow.camera.right);
	this.shadowTop.setValue(this.object.sun.shadow.camera.top);
	this.shadowBottom.setValue(this.object.sun.shadow.camera.bottom);
};
