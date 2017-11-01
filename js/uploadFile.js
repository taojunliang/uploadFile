var UploadImage = (function() {
	return function(config) {
		this.options = {
			fileDom: '',
			viewDom: '',
			maxSize: 99999999999, 	// kb
			uri    : 'http://openact.busi.inke.cn/upload/image_test'
		};

		if(!config['fileDom']) {
			throw new Error('fileDom 为必传参数');
		}

		if(!config['viewDom']) {
			throw new Error('viewDom 为必传参数');
		}

		for(var i in config) {
			typeof config[i] !== 'undefined' ? this.options[i] = config[i] : null;
		}

		this.init();
	};
})();

UploadImage.prototype = {
	init: function() {
		var self = this;

		this.options.fileDom.addEventListener('change', self.handleChange.bind(self));
	},
	handleChange: function(e) {
		var options  = this.options;
		var files    = [].slice.call(e.target.files);
		var fileType = ['image/jpeg', 'image/png', 'image/gif'];
		var len = options.viewDom.getElementsByTagName('li').length;

		if(len + files.length > 9) {
			alert('最多上传9张图片');
			return;
		}

		if(len + files.length === 9) {
			document.querySelector('.upload-box').style.display = 'none';
		}

		files.forEach(function(item) {

			// 类型判断
			if(fileType.indexOf(item.type) === -1) {
				alert('仅限上传jpg,png,gif格式的图片');
				options.fileDom.value = '';
				return;
			}

			// 大小判断
			if(item.size > options.maxSize * 1000) {
				alert(item.name + '不能超过' + options.maxSize + 'kb');
				options.fileDom.value = '';
				return;
			}

			var formData = new FormData();
			var xhr      = new XMLHttpRequest();
			var li       = document.createElement('li');
			var span  	 = document.createElement('span');
			var img  		 = new Image();

			li.appendChild(img);
			li.appendChild(span);
			
			img.src = '//img2.inke.cn/MTQ5NDMxMTI0MjU5NCMzMTUjanBn.jpg';

			options.viewDom.appendChild(li);

			formData.append('file', item);

			xhr.open('post', options.uri);

			xhr.send(formData);

			xhr.onreadystatechange = function() {
				if(xhr.readyState === 4) {
					li.style.background = 'transparent';

					options.fileDom.value = '';

					xhr.status === 200 ? img.src = JSON.parse(xhr.responseText).data.file.url : null;
				}
			};

		});
	}
};