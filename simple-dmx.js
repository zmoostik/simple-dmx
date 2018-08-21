function DMX(driver) {
	var drivers   = {
		'debug': './drivers/debug',
		'enttec-usb-dmx-pro': './drivers/enttec-usb-dmx-pro'
	};
	return require(drivers[driver]);
}

module.exports = DMX;
