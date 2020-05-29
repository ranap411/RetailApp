({
    doInit : function(component, event, helper) {
        console.log('funation getting called');
        var width = 400; // scale the photo width to this
        var height = 0; // computed based on the input stream

     	var streaming = false;
        var video = null;
        var canvas = null;
        var photo = null;
        var startbutton = null;
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        photo = document.getElementById('photo');
        startbutton = document.getElementById('startbutton');
        var clearbutton = document.getElementById('clearbutton');
        
        navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(function(stream) {
            console.log('In navigation function : ',video);
            video.srcObject = stream;
            video.play();
        })
        .catch(function(err) {
            console.log("An error occurred: " + err);
        });
        
        video.addEventListener('canplay', function(ev){
            if (!streaming) {
                console.log('Can play');
                height = video.videoHeight / (video.videoWidth/width);
                
                // Firefox currently has a bug where the height can't be read from
                // the video, so make assumptions if this happens.
                
                if (isNaN(height)) {
                    height = width / (4/3);
                }
                
                video.setAttribute('width', width);
                video.setAttribute('height', height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                streaming = true;
            }
        }, false);
        
        startbutton.addEventListener('click', function(ev){
            console.log('start button ',ev);
            takepicture();
        }, false);
        
        clearbutton.addEventListener('click', function(ev){
            clearphoto();
        }, false);
        
        
        clearphoto();
      
        function clearphoto() {
            var context = canvas.getContext('2d');
            context.fillStyle = "#AAA";
            context.fillRect(0, 0, canvas.width, canvas.height);
            
            var data = canvas.toDataURL('image/png');
            photo.setAttribute('src', data);
        }
        
      	function takepicture() {
            var context = canvas.getContext('2d');
            console.log('in take picture ',context);
            if (width && height) {
                canvas.width = width;
                canvas.height = height;
                context.drawImage(video, 0, 0, width, height);
                
                var data = canvas.toDataURL('image/png');
                photo.setAttribute('src', data);
            } else {
                clearphoto();
            }
        }
        
    }
})