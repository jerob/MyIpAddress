const express = require('express');
const app = express();

/**
 * 1. Proxy Configuration
 * Enabling 'trust proxy' allows Express to automatically parse the 
 * 'x-forwarded-for' header when the app is behind a load balancer (Heroku, Nginx, etc.)
 */
app.set('trust proxy', true);

/**
 * 2. IP Retrieval Utility
 * Fallback logic to ensure we get an IP even if 'trust proxy' isn't used.
 */
const getIp = (req) => req.ip || req.socket.remoteAddress;

// Root Route: Returns only the client's IP address
app.get('/', (req, res) => {
    res.send(getIp(req));
});

// API Route: Returns detailed request metadata in JSON format
app.get('/api/ipaddress.json', (req, res) => {
    res.json({
        userAgent: req.headers['user-agent'],
        method: req.method,
        fresh: req.fresh,
        xhr: req.xhr,
        protocol: req.protocol,
        ipAddress: getIp(req),
        // Included for debugging purposes
        forwarded: req.headers['x-forwarded-for'] || null 
    });
});

/**
 * 3. Server Public IP Logger
 * Fetches the server's own public IP address using the native fetch API (Node.js 18+)
 */
const logServerPublicIp = async () => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        console.log(`>>> Server Public IP: ${data.ip}`);
    } catch (err) {
        console.error("Could not retrieve server public IP:", err.message);
    }
};

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    logServerPublicIp();
});
