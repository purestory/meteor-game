const { Client } = require('pg');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        const client = new Client({
            host: 'svc.sel4.cloudtype.app',
            port: 31291,
            user: 'root',
            password: '11111',
            database: 'postgres'
        });

        try {
            await client.connect();
            const result = await client.query('SELECT NOW()');
            await client.end();
            
            res.status(200).json({ status: 'connected' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
} 