var Dmx = require("./simple-dmx");

var dmx = new (Dmx("enttec-usb-dmx-pro"))("/dev/serial/by-id/usb-ENTTEC_DMX_USB_PRO_EN224003-if00-port0");
dmx.open();


var value = true;
setInterval(function() {
	dmx.setAll(value ? 255 : 0);
	console.log(value ? "on" : "off");
	value = !value;
}, 1000);

