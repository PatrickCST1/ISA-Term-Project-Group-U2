const express = require('express');
const router = express.Router();

// Helper to generate a UUID (simple version)
function generateUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

async function getDevices(apiKey) {
	const url = 'https://openapi.api.govee.com/router/api/v1/user/devices';
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Govee-API-Key': apiKey
		}
	});
	if (!response.ok) {
		throw new Error(`Failed to fetch devices: ${response.status} ${response.statusText}`);
	}
	return response.json();
}

async function sendColorCommand(apiKey, deviceInfo, color) {
	const url = 'https://openapi.api.govee.com/router/api/v1/device/control';
	// Convert separate RGB values (0-255) into a single integer 0-16777215
	const rgbInt = (color.r << 16) + (color.g << 8) + color.b;
	const body = {
		requestId: generateUUID(),
		payload: {
			sku: deviceInfo.sku,
			device: deviceInfo.device,
			capability: {
				type: 'devices.capabilities.color_setting',
				instance: 'colorRgb',
				value: rgbInt
			}
		}
	};

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Govee-API-Key': apiKey
		},
		body: JSON.stringify(body)
	});

	if (!response.ok) {
		throw new Error(`Failed to send color command: ${response.status} ${response.statusText}`);
	}
	return response.json();
}

// Exported router: takes an API key and an RGB color,
// grabs the first device, and uses it to send the color command.
router.post('/', async (req, res) => {
	const { apiKey, color } = req.body;

	if (!apiKey) {
		return res.status(400).json({ error: 'API key is required' });
	}

	if (!color || typeof color.r !== 'number' || typeof color.g !== 'number' || typeof color.b !== 'number') {
		return res.status(400).json({ error: 'color must be an object with numeric r, g, b properties' });
	}

	try {
		const devicesResponse = await getDevices(apiKey);
		const devices = devicesResponse && devicesResponse.data;

		if (!Array.isArray(devices) || devices.length === 0) {
			return res.status(404).json({ error: 'No devices found for this account' });
		}

		const firstDevice = devices[0];
		if (!firstDevice || !firstDevice.sku || !firstDevice.device) {
			return res.status(500).json({ error: 'First device is missing sku or device identifier' });
		}

		const deviceInfo = {
			sku: firstDevice.sku,
			device: firstDevice.device
		};

		const result = await sendColorCommand(apiKey, deviceInfo, color);
		return res.json(result);
	} catch (err) {
		console.error('Light bulb fetch error:', err.message);
		return res.status(503).json({ error: 'Lightbulb service unavailable' });
	}
});

module.exports = router;
