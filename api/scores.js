const { Client } = require('pg');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const client = new Client({
        host: 'svc.sel4.cloudtype.app',
        port: 31291,
        user: 'root',
        password: '11111',
        database: 'postgres'
    });

    try {
        await client.connect();

        if (req.method === 'GET') {
            // 상위 10개 기록 조회
            const result = await client.query(`
                SELECT score, survival_time, played_at 
                FROM game_records 
                ORDER BY score DESC 
                LIMIT 10
            `);
            res.status(200).json({ scores: result.rows });
        } 
        else if (req.method === 'POST') {
            const { score, time } = req.body;
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            
            // 새로운 기록 저장
            await client.query(`
                INSERT INTO game_records (
                    score, 
                    survival_time, 
                    difficulty_level, 
                    meteor_count, 
                    ip_address
                ) VALUES ($1, $2, $3, $4, $5)
            `, [score, time, 1, Math.floor(score/10), ip]);
            
            res.status(200).json({ message: "Score saved successfully" });
        }
    } catch (error) {
        console.error('DB 오류:', error);
        res.status(500).json({ error: error.message });
    } finally {
        await client.end();
    }
} 