(function( $ ){
	
// jQuery plugin alphavid
// Author: Matt Habermehl
// Special thanks to http://www.sciencelifeny.com/transparency/transparency.html#
// Note: Does not work on mobile devices
	
/*
	Syntax/defaults:
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
	
	
	
*/
	
	$.fn.alphavid = function( options ){
		// Variables
		var video = this.get(0); // The video element we are applying this function to.
		var videoWidth = $(video).outerWidth();
		var videoHeight = $(video).outerHeight();
		var width = videoWidth;
	    var height = Math.floor(videoHeight / 2);
	    var interval;
	    var autoplay = false;
	    var responsive = true;
		var preserveAspect = true;
		var heightMultiplier = 0.5625; // defaults to 16x9
		
		// make sure we're dealing with a video element
		if ( !$(video).is("video") ){
			console.error('Error: alphavid() can only be applied to video elements: $("#video").alphavid()');
			return;
		}
		
		// Modify variables
		if ( $(video).attr('autoplay') ){ // Sets to play automatically if the vid has autoplay attribute
		    autoplay = true;
	    }
	    
	    if ( options && options.responsive === false){ // If options.responsive are set, override
			responsive = options.responsive;
		}
		if (options && options.preserveAspect === false){ // If options.preserveAspect is set, override
			preserveAspect = options.preserveAspect;
		}
		if ( options && options.aspectRatio && options.aspectRatio.width && options.aspectRatio.height ){ // If aspect ratio options are set, override heightMultiplier
			heightMultiplier = options.aspectRatio.height / options.aspectRatio.width;
		}
		
		// Create the buffer canvas
		var bufferCanvas = document.createElement('canvas');
		bufferCanvas.id = "ac-buffer";
		bufferCanvas.style.position = "absolute";
		bufferCanvas.style.top = "-9999px";
		bufferCanvas.style.left = "-9999px";
		var buffer = bufferCanvas.getContext('2d');
		
		// Create the output canvas		
		var outputCanvas = document.createElement('canvas');
		outputCanvas.id = "ac-output";
		
		var output = outputCanvas.getContext('2d');
		
		// Put the output canvas where the video used to be
		var tempVid = $(video).replaceWith(outputCanvas);
		
		// Deal with sizing and resizing the elements on window resize
		// First set up a acResizeEnd event for when resizing completes.
		$(window).resize(function() {
	        if(this.resizeTO) clearTimeout(this.resizeTO);
	        this.resizeTO = setTimeout(function() {
		        if ( this.resizing ){
			        $(this).trigger('acResizeEnd');
		        }
	        }, 1000);
	    });
		
		// Bind a function to the event defined above
		$(window).bind('acResizeEnd', function() {
	       	if ( options && options.dimensions ){
		       	if ( options.dimensions.width ){
			       	width = options.dimensions.width;
		       	}
		       	if ( options.dimensions.height ){
			       	height = options.dimensions.height;
		       	}
	       	}
	       	
	       	if ( responsive ){
		       	if ( !options || !options.dimensions || !options.dimensions.width ){
			       	outputCanvas.style.width = "100%";
			       	width = $("#ac-output").outerWidth();
		       	}
		       	if ( preserveAspect && ( !options.dimensions || !options.dimensions.height) ){
			       	height = Math.floor(width * heightMultiplier);
		       	}
	       	}
	       	
	        bufferCanvas.width = width;
			bufferCanvas.height = height * 2;
			outputCanvas.width = width;
			outputCanvas.height = height;
		});
		
		$(window).trigger('acResizeEnd'); // Run the function above once at start to get sizes
		
		tempVid.css('display', 'none');
		$("body").append(tempVid);
		$("body").append(bufferCanvas);
		
		function processFrame() {
		    buffer.drawImage(video, 0, 0, width, height * 2);
		 
		     // this can be done without alphaData, except in Firefox which doesn't like it when image is bigger than the canvas
		    var image = buffer.getImageData(0, 0, width, height),
		    imageData = image.data,
		    alphaData = buffer.getImageData(0, height, width, height).data;
		 
			// More info on this algorithm: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas#The_ImageData_object
		    for (var i = 3, len = imageData.length; i < len; i = i + 4) {
		    	imageData[i] = alphaData[i-1];
		    }
		 
			output.putImageData(image, 0, 0, 0, 1, width, height);
		}
		
		video.addEventListener('play', function() {
			clearInterval(interval);
			interval = setInterval(processFrame, 40)
		}, false);
		
		if ( autoplay ){
			video.play();
		}
	}

})(jQuery);
