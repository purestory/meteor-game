const { Client } = require('pg');

async function insertFiveScores() {
    const client = new Client({
        host: 'svc.sel4.cloudtype.app',
        port: 31291,
        user: 'root',
        password: '11111',
        database: 'postgres'
    });

    const testData = [
        {
            player_name: "챔피언",
            score: 185,
            survival_time: 52.345,
            difficulty_level: 5,
            meteor_count: 18,
            ip_address: "123.456.789.001"
        },
        {
            player_name: "마스터",
            score: 156,
            survival_time: 45.234,
            difficulty_level: 4,
            meteor_count: 15,
            ip_address: "123.456.789.002"
        },
        {
            player_name: "다이아",
            score: 132,
            survival_time: 38.901,
            difficulty_level: 3,
            meteor_count: 13,
            ip_address: "123.456.789.003"
        },
        {
            player_name: "플래티넘",
            score: 98,
            survival_time: 31.789,
            difficulty_level: 2,
            meteor_count: 9,
            ip_address: "123.456.789.004"
        },
        {
            player_name: "골드",
            score: 76,
            survival_time: 25.678,
            difficulty_level: 1,
            meteor_count: 7,
            ip_address: "123.456.789.005"
        }
    ];

    try {
        await client.connect();
        console.log('PostgreSQL 연결 성공!');

        for (const data of testData) {
            const query = `
                INSERT INTO game_records (
                    player_name,
                    score,
                    survival_time,
                    difficulty_level,
                    meteor_count,
                    ip_address,
                    played_at
                ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
            `;

            const values = [
                data.player_name,
                data.score,
                data.survival_time,
                data.difficulty_level,
                data.meteor_count,
                data.ip_address
            ];

            await client.query(query, values);
            console.log(`${data.player_name}의 데이터 삽입 성공 (점수: ${data.score})`);
        }

        console.log('\n5개의 테스트 데이터 삽입 완료!');

        // 삽입된 데이터 확인
        const result = await client.query(`
            SELECT player_name, score, survival_time 
            FROM game_records 
            ORDER BY score DESC 
            LIMIT 5
        `);

        console.log('\n현재 상위 5개 기록:');
        result.rows.forEach((row, index) => {
            console.log(`${index + 1}. ${row.player_name}: ${row.score}점 (${row.survival_time}초)`);
        });

    } catch (error) {
        console.error('에러 발생:', error);
    } finally {
        await client.end();
        console.log('\nDB 연결 종료');
    }
}

insertFiveScores(); 