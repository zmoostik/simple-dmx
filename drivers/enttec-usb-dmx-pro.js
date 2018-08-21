var SerialPort = require("serialport");
//http://peterelsea.com/Maxtuts_advanced/Controlling_DMX.pdf

var ENTTEC_PRO_DMX_STARTCODE = 0x00;
var ENTTEC_PRO_START_OF_MSG = 0x7e;
var ENTTEC_PRO_END_OF_MSG = 0xe7;
var ENTTEC_PRO_SEND_DMX_RQ = 0x06;
var ENTTEC_PRO_RECV_DMX_PKT = 0x05;

function EnttecUSBDMXPRO(device_id) {
	this.channels = new Buffer(512);
	this.channels.fill(0);
	this.device = null;
	this.device_id = device_id;
}

EnttecUSBDMXPRO.prototype.sendMessage = function(label, data) {
        if(!this.dev || !this.dev.writable) {
                return;
        }
        var header = Buffer([
                ENTTEC_PRO_START_OF_MSG,
                label,
                data.length & 0xff,
                (data.length >> 8) & 0xff
        ]);

	var buf = Buffer.concat([
		header,
		data,
        	Buffer([ENTTEC_PRO_END_OF_MSG])
        ]);

        console.log("write", buf);
        this.dev.write(buf);
}


EnttecUSBDMXPRO.prototype.send = function() {
	var msg = Buffer.concat([
		Buffer([ENTTEC_PRO_DMX_STARTCODE]),
		this.channels
	]);
	this.sendMessage(ENTTEC_PRO_SEND_DMX_RQ, msg);
}

EnttecUSBDMXPRO.prototype.open = function(cb) {
	var self = this;
	console.log("open", this.device_id);

	this.dev = new SerialPort(this.device_id, {
		'baudRate': 250000,
		'dataBits': 8,
		'stopBits': 2,
		'parity': 'none'
	}, function(err) {
		if (err) {
			console.log("could not connect");
			return false;
		}	

		console.log("connected");
		self.send();
		if (cb) cb(err);
	});
}

EnttecUSBDMXPRO.prototype.close = function(cb) {
	this.dev.close(cb);
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
