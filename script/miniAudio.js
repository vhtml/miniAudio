;(function() {

	if (!document.createElement('audio').canPlayType) {
		return;
	}

	loadStyle('styles/miniAudio.css');

	var audioHTML = '' +
		'<div class="v-mini-audio">' +
		'<div class="audio-left"><div class="inner"></div></div>' +
		'<div class="audio-right"><div class="inner"></div></div>' +
		'<div class="audio-control play"></div>' +
		'</div>';

	function setCss3Style(el, name, value) {
		el.style['webkit' + name.substring(0, 1).toUpperCase() + name.substring(1)] = value;
		el.style[name] = value;
	}

	function loadStyle(src) {
		var scripts = document.getElementsByTagName('script');
		var path = scripts[scripts.length - 1].src.split('?')[0];
		cssPath = path.split('/').slice(0, -2).join('/') + '/' + src;
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = cssPath;
		document.head.appendChild(link);
	}

	function miniAudio(oTag) {
		this.oTag = oTag;
		var src = oTag.getAttribute('src');
		if (!src) return;
		this.audio = new Audio(src);
		this.init();
	}
	miniAudio.prototype.audioContainer = [];
	miniAudio.prototype.init = function() {
		var self = this;
		this.audioContainer.push(this);
		this.render();
		this.mACtrl = this.mA.querySelector('.audio-control');
		this.mALeftInner = this.mA.querySelector('.audio-left .inner');
		this.mARightInner = this.mA.querySelector('.audio-right .inner');
		this.mACtrl.addEventListener('click', function(e) {
			if (this.classList.contains('play')) {
				self.play();
			} else {
				self.pause();
			}
			e.stopPropagation();
		});
		this.audio.addEventListener('timeupdate', function() {
			if (this.ended) {
				self.end();
			}
			var progress = this.currentTime / this.duration * 360 || 0;
			if (progress <= 180) {
				setCss3Style(self.mARightInner, 'transform', 'rotate(' + progress + 'deg)');
				setCss3Style(self.mALeftInner, 'transform', 'rotate(0deg)');
			} else {
				setCss3Style(self.mARightInner, 'transform', 'rotate(180deg)');
				setCss3Style(self.mALeftInner, 'transform', 'rotate(' + (progress - 180) + 'deg)');
			}
		});
	};
	miniAudio.prototype.render = function() {
		this.oTag.insertAdjacentHTML('afterEnd', audioHTML);
		this.mA = this.oTag.nextSibling;
		this.oTag.parentNode.removeChild(this.oTag);
	};
	miniAudio.prototype.play = function() {
		this.audio.play();
		if(this.audio.paused) return;
		this.mACtrl.classList.add('pause');
		this.mACtrl.classList.remove('play');
		this.pauseOther();
	};
	miniAudio.prototype.pause = function() {
		this.audio.pause();
		this.mACtrl.classList.remove('pause');
		this.mACtrl.classList.add('play');
	};
	miniAudio.prototype.end = function() {
		this.audio.currentTime = 0;
		this.pause();
	};
	miniAudio.prototype.pauseOther = function() {
		var audios = this.audioContainer;
		for(var i = 0; i < audios.length; i++){
			if(audios[i] !== this){
				audios[i].pause();
			}
		}
	}

	var mAs = [].slice.apply(document.getElementsByTagName('miniAudio'));
	var len = mAs.length;
	for (var i = 0; i < len; i++) {
		new miniAudio(mAs[i]);
	}

})();
