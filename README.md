# alphavid

Play video on your website with transparency (no audio, video needs alpha layer).
A jQuery plugin that mirrors the effects explained here: http://www.sciencelifeny.com/transparency/transparency.html#

See sample video for how to format your vid.

Must be applied to video element:

	$("#video").alphavid({
		responsive: true, // default
		preserveAspect: true, //default
		aspectRatio: {
			width: 16, // default
			height: 9
		},
		dimensions: {
			width: 500,
			height: 600
		}
	});
	
  This is currently in pre-alpha. Pull requests welcome.u
