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
        console.log('DB 연결 시도...');
        await client.connect();
        console.log('DB 연결 성공');

        if (req.method === 'POST') {
            console.log('받은 요청 데이터:', req.body);
            
            const { score, time } = req.body;
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            
            if (!score || !time) {
                throw new Error(`필수 데이터 누락 - score: ${score}, time: ${time}`);
            }

            const scoreNum = parseInt(score);
            const timeNum = parseFloat(time);

            if (isNaN(scoreNum) || isNaN(timeNum)) {
                throw new Error(`잘못된 데이터 형식 - score: ${score}, time: ${time}`);
            }

            const query = `
                INSERT INTO game_records (
                    player_name,
                    score, 
                    survival_time, 
                    difficulty_level, 
                    meteor_count, 
                    ip_address
                ) VALUES ($1, $2, $3, $4, $5, $6)
            `;

            const values = ['익명', scoreNum, timeNum, 1, Math.floor(scoreNum/10), ip];
            
            console.log('실행할 쿼리:', query);
            console.log('쿼리 파라미터:', values);

            const result = await client.query(query, values);
            console.log('쿼리 실행 결과:', result);
            
            res.status(200).json({ 
                message: "Score saved successfully",
                result: result
            });
        } 
        else if (req.method === 'GET') {
            const result = await client.query(`
                SELECT player_name, score, survival_time, difficulty_level, meteor_count, played_at
                FROM game_records 
                ORDER BY score DESC 
                LIMIT 10
            `);
            res.status(200).json({ scores: result.rows });
        }
    } catch (error) {
        console.error('에러 발생:', {
            message: error.message,
            stack: error.stack,
            query: error.query,
            parameters: error.parameters
        });
        
        res.status(500).json({ 
            error: error.message,
            details: {
                code: error.code,
                query: error.query,
                parameters: error.parameters
            }
        });
    } finally {
        try {
            await client.end();
            console.log('DB 연결 종료');
        } catch (err) {
            console.error('DB 연결 종료 중 에러:', err);
        }
    }
} 