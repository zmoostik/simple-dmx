//see: enttec dmx_usb_pro_api.pdf

var SerialPort = require("serialport");

function EnttecUSBDMXPRO(device_id) {
	this.channels = new Buffer(512);
	this.channels.fill(0);
	this.port = new SerialPort(device_id, {
		'baudRate': 250000,
		'dataBits': 8,
		'stopBits': 2,
		'parity': 'none',
		'autoOpen': false
	});
	this.init();
}

EnttecUSBDMXPRO.prototype.DMX_STARTCODE = 0x00;
EnttecUSBDMXPRO.prototype.START_OF_MSG = 0x7e;
EnttecUSBDMXPRO.prototype.END_OF_MSG = 0xe7;
EnttecUSBDMXPRO.prototype.SEND_DMX_RQ = 0x06;
EnttecUSBDMXPRO.prototype.RECV_DMX_PKT = 0x05;

EnttecUSBDMXPRO.prototype.sendMessage = function(label, data) {
	if (!this.port.isOpen) {
		console.log("serial port is not opened");
		return;
	}

	var header = Buffer([
		this.START_OF_MSG,
		label,
		data.length & 0xff,
		(data.length >> 8) & 0xff
	]);

	var buf = Buffer.concat([
		header,
		data,
		Buffer([this.END_OF_MSG])
	]);

	console.log("write", buf);
	this.port.write(buf);
}

EnttecUSBDMXPRO.prototype.send = function() {
	var msg = Buffer.concat([
		Buffer([this.DMX_STARTCODE]),
		this.channels
	]);
	this.sendMessage(this.SEND_DMX_RQ, msg);
}

EnttecUSBDMXPRO.prototype.on = function(name, cb) {
	this.port.on(name, cb);
};

EnttecUSBDMXPRO.prototype.init = function() {
	this.port.on("error", function(err) {
		console.log("serial port error", err);
	});

	this.port.on("open", function() {
		console.log("serial port opened");
	});

	this.port.on("close", function() {
		console.log("serial port closed");
	});
}

EnttecUSBDMXPRO.prototype.isOpen = function() {
	return this.port.isOpen;
};

EnttecUSBDMXPRO.prototype.open = function(cb) {
	this.port.open(cb);
};

EnttecUSBDMXPRO.prototype.close = function(cb) {
	this.port.close(cb);
}

EnttecUSBDMXPRO.prototype.set = function(channel, value) {
	this.channels[channel - 1] = value;
	this.send();
}

EnttecUSBDMXPRO.prototype.setChannels = function(arr) {
	for(var channel in arr) {
		this.channels[channel - 1] = arr[channel];
	}
	this.send();
}

EnttecUSBDMXPRO.prototype.setAll = function(value){
	for(var i = 0; i <= this.channels.length; i++) {
		this.channels[i] = value;
	}
	this.send();
}

EnttecUSBDMXPRO.prototype.get = function(channel) {
	return this.channels[channel - 1];
}

module.exports = EnttecUSBDMXPRO;
