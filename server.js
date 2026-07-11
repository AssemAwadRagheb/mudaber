const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const server = http.createServer((req, res) => {
    // Enable CORS for local development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle CMS Save Request
    if (req.method === 'POST' && req.url.includes('save_cms.php')) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                // Validate JSON before saving
                JSON.parse(body);
                fs.writeFileSync(path.join(__dirname, 'content.json'), body, 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: "success", message: "Saved directly to content.json" }));
                console.log("[SUCCESS] content.json updated successfully.");
            } catch (err) {
                console.error("[ERROR] Invalid JSON or write error:", err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: "error", message: err.message }));
            }
        });
        return;
    }

    // Serve Static Files
    let filePath = '.' + req.url;
    if (filePath === './' || filePath === './?') filePath = './index.html';

    // Strip query parameters from file path
    filePath = filePath.split('?')[0];

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(path.join(__dirname, filePath), (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`🚀 Mudaber CMS Local Server is running!`);
    console.log(`========================================`);
    console.log(`👉 Open this link in your browser:`);
    console.log(`   http://localhost:${PORT}/admin.html`);
    console.log(`----------------------------------------`);
    console.log(`Press Ctrl+C to stop the server.`);
});
