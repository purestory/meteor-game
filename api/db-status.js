const { Client } = require('pg');

// DB 상태 확인을 위한 API 엔드포인트
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
            console.log('DB 연결 시도...');
            await client.connect();
            console.log('DB 연결 성공');
            
            const result = await client.query('SELECT NOW()');
            console.log('쿼리 실행 결과:', result.rows[0]);
            
            await client.end();
            console.log('DB 연결 종료');
            
            res.status(200).json({ 
                status: 'connected',
                time: result.rows[0].now
            });
        } catch (error) {
            console.error('DB 연결 오류:', error);
            res.status(500).json({ 
                status: 'error', 
                message: error.message,
                stack: error.stack
            });
        }
    }
} 