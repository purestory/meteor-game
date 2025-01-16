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
        console.log('DB 연결 시도...');
        await client.connect();
        console.log('DB 연결 성공');

        if (req.method === 'POST') {
            try {
                console.log('받은 요청 헤더:', req.headers);
                console.log('받은 요청 바디:', req.body);
                
                const { score, time } = req.body;
                const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                
                if (!score || !time) {
                    console.error('필수 데이터 누락:', { score, time });
                    throw new Error('점수와 시간은 필수값입니다.');
                }

                const scoreNum = parseInt(score);
                const timeNum = parseFloat(time);

                if (isNaN(scoreNum) || isNaN(timeNum)) {
                    console.error('잘못된 데이터 형식:', { score, time });
                    throw new Error('잘못된 데이터 형식입니다.');
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
                console.log('실행할 쿼리:', { query, values });

                const result = await client.query(query, values);
                console.log('쿼리 실행 결과:', result);

                res.status(200).json({ 
                    message: "Score saved successfully",
                    data: {
                        score: scoreNum,
                        time: timeNum,
                        ip: ip
                    }
                });
            } catch (error) {
                console.error('저장 중 에러:', error);
                res.status(500).json({ 
                    error: error.message,
                    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
                });
            }
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