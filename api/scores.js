const { Client } = require('pg');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
        console.log('DB 연결 시도...');
        await client.connect();
        console.log('DB 연결 성공');

        if (req.method === 'POST') {
            try {
                const { score, time, difficulty_level, meteor_count } = req.body;
                
                if (score === undefined || time === undefined) {
                    throw new Error('점수와 시간이 제대로 전달되지 않았습니다.');
                }

                const scoreNum = Number(score);
                const timeNum = Number(time);

                if (isNaN(scoreNum) || isNaN(timeNum)) {
                    throw new Error('잘못된 점수 또는 시간 형식입니다.');
                }

                const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

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

                const values = [
                    '익명', 
                    scoreNum, 
                    timeNum, 
                    difficulty_level || 1, 
                    meteor_count || Math.floor(scoreNum/10), 
                    ip
                ];

                console.log('실행할 쿼리:', { query, values });
                const result = await client.query(query, values);

                res.status(200).json({ 
                    message: "점수가 성공적으로 저장되었습니다.",
                    data: {
                        score: scoreNum,
                        time: timeNum
                    }
                });
            } catch (error) {
                console.error('저장 중 에러:', error);
                res.status(400).json({ error: error.message });
            }
        } 
        else if (req.method === 'GET') {
            try {
                const result = await client.query(`
                    SELECT 
                        player_name, 
                        score, 
                        survival_time, 
                        difficulty_level, 
                        meteor_count, 
                        played_at
                    FROM game_records 
                    ORDER BY score DESC 
                    LIMIT 20
                `);
                
                res.status(200).json({ scores: result.rows });
                
            } catch (error) {
                console.error('순위 조회 중 에러:', error);
                res.status(500).json({ 
                    error: '순위 데이터 조회 실패',
                    details: error.message 
                });
            }
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
        try {
            await client.end();
            console.log('DB 연결 종료');
        } catch (err) {
            console.error('DB 연결 종료 중 에러:', err);
        }
    }
} 