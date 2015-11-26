;(function() {

	if (!document.createElement('audio').canPlayType) {
		return;
	}

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

	function miniAudio(oTag) {
		this.oTag = oTag;
		var src = oTag.getAttribute('src');
		if (!src) return;
		window.hahha = this.audio = new Audio(src);
		this.init();
	}
	miniAudio.prototype.init = function() {
		var self = this;
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
		this.mACtrl.classList.add('pause');
		this.mACtrl.classList.remove('play');
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

	var mAs = [].slice.apply(document.getElementsByTagName('miniAudio'));
	var len = mAs.length;
	for (var i = 0; i < len; i++) {
		new miniAudio(mAs[i]);
	}

})();