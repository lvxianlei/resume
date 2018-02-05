var flag = false;
function selectFileImage(fileObj) {
	var file = fileObj.files['0'];
	var file_len = fileObj.files.length;
	for (var i = 0; i < file_len; i++) {
		FileImageControl(fileObj.files[i]);
	}
	var Orientation = null;

}
var ImageFile = [];
function FileImageControl(file){
	if (file) {
		console.log("正在上传,请稍后...");
		var rFilter = /^(image\/jpeg|image\/png)$/i;
		if (!rFilter.test(file.type)) {
			return;
		}
		EXIF.getData(file, function() {
		    EXIF.getAllTags(this);
		    Orientation = EXIF.getTag(this, 'Orientation');
		});
		
		var oReader = new FileReader();
		var expectWidth,expectHeight;
		oReader.onload = function(e) {
			var image = new Image();
			image.src = e.target.result;
			image.onload = function() {
				var expectWidth = this.naturalWidth;
				var expectHeight = this.naturalHeight;
				if (this.naturalWidth > this.naturalHeight && this.naturalWidth > 750) {
					expectWidth = 750;
					expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;
				} else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > 1330) {
					expectHeight = 1330;
					expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;
				}
				var canvas = document.createElement("canvas");
				var ctx = canvas.getContext("2d");
				canvas.width = expectWidth;
				canvas.height = expectHeight;
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
				var base64 = null;
				base64 = canvas.toDataURL("image/jpeg", 0.6);
				if (navigator.userAgent.match(/iphone/i)) {
					if(Orientation !== "" && Orientation !== 1){
						switch(Orientation){
						 	case 6:
						 		rotateImg(this,'left',canvas,expectWidth,expectHeight);
						 		break;
						 	case 8:
						 		rotateImg(this,'right',canvas,expectWidth,expectHeight);
						 		break;
						 	case 3:
								rotateImg(this,'right',canvas,expectWidth,expectHeight);
								rotateImg(this,'right',canvas,expectWidth,expectHeight);
								break;
						}		
					}

					base64 = canvas.toDataURL("image/jpeg", 0.6);
				}else if (navigator.userAgent.match(/Android/i)) {
					base64 = canvas.toDataURL("image/jpeg", 0.6);
				}else{
					if(Orientation !== "" && Orientation !== 1){
						switch(Orientation){
						 	case 6:
						 		rotateImg(this,'left',canvas,expectWidth,expectHeight);
						 		break;
						 	case 8:
						 		rotateImg(this,'right',canvas,expectWidth,expectHeight);
						 		break;
						 	case 3:
								rotateImg(this,'right',canvas,expectWidth,expectHeight);
								rotateImg(this,'right',canvas,expectWidth,expectHeight);
								break;
						}		
					}
					
					base64 = canvas.toDataURL("image/jpeg", 0.6);
				}

				ImageFile[0]=base64;
                console.log(ImageFile);
                $(".uploadImage>img").attr("src",ImageFile[0]);
                flag = true;
			};
		};
		oReader.readAsDataURL(file);
	}
}

function rotateImg(img, direction,canvas,expectWidth,expectHeight) {
        var min_step = 0;  
        var max_step = 3;
        if (img == null) return;
        var width = expectWidth;
        var height = expectHeight;
        var step = 2;  
        if (step == null) {  
            step = min_step;  
        }  
        if (direction == 'right') {  
            step++;
            step > max_step && (step = min_step);  
        } else {  
            step--;  
            step < min_step && (step = max_step);  
        }

        var degree = step * 90 * Math.PI / 180;  
        var ctx = canvas.getContext('2d');  
        switch (step) {  
            case 0:  
                canvas.width = width;  
                canvas.height = height;  
                ctx.drawImage(img, 0, 0, expectWidth, expectHeight);  
                break;  
            case 1:  
                canvas.width = height;  
                canvas.height = width;  
                ctx.rotate(degree);  
                ctx.drawImage(img, 0, -height, expectWidth, expectHeight);  
                break;  
            case 2:  
                canvas.width = width;  
                canvas.height = height;  
                ctx.rotate(degree);  
                ctx.drawImage(img, -width, -height, expectWidth, expectHeight);  
                break;  
            case 3:  
                canvas.width = height;  
                canvas.height = width;  
                ctx.rotate(degree);  
                ctx.drawImage(img, -width, 0, expectWidth, expectHeight);  
                break;  
        }  
    }  