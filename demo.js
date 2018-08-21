//process.setgid("souffleur");


var Dmx = require("./simple-dmx");
//var dmx = new (Dmx("debug"))();
var dmx = new (Dmx("enttec-usb-dmx-pro"))("/dev/serial/by-id/usb-ENTTEC_DMX_USB_PRO_EN224003-if00-port0");
//process.setuid("souffleur");

dmx.open();

//process.setuid("souffleur");

var value = true;
setInterval(function() {
	//dmx.setAll(value ? 255 : 0);
	dmx.setChannels({9: value ? 255 : 0});
	console.log(value ? "on" : "off");
	value = !value;
}, 1000);

