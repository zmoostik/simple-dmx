function Debug() {
	this.channels = new Buffer(512);
	this.channels.fill(0);
}

Debug.prototype.show = function() {
	console.log(this.channels);
};

Debug.prototype.open = function(cb) {
	var self = this;
	self.timeout = setInterval(function() {
		self.show();
	}, 1000);
	if (cb) cb();
}

Debug.prototype.close = function(cb) {
	clearInterval(this.timeout);
	if (cb) cb(null);
}

Debug.prototype.set = function(channel, value) {
	this.channels[channel] = value;
}

Debug.prototype.setChannels = function(arr) {
	for(var channel in arr) {
		this.channels[channel] = arr[channel];
	}
}

Debug.prototype.setAll = function(value){
	for(var i = 0; i <= this.channels.length; i++) {
		this.channels[i] = value;
	}
}

Debug.prototype.get = function(channel) {
	return this.channels[channel];
}

module.exports = Debug;
