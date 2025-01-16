const { Client } = require('pg');

async function insertTestData() {
    const client = new Client({
        host: 'svc.sel4.cloudtype.app',
        port: 31291,
        user: 'root',
        password: '11111',
        database: 'postgres'
    });

    const testData = [
        {
            player_name: "플레이어1",
            score: 156,
            survival_time: 45.234,
            difficulty_level: 5,
            meteor_count: 15,
            ip_address: "123.456.789.001"
        },
        {
            player_name: "게이머2",
            score: 143,
            survival_time: 42.567,
            difficulty_level: 4,
            meteor_count: 14,
            ip_address: "123.456.789.002"
        },
        {
            player_name: "테스터3",
            score: 128,
            survival_time: 38.901,
            difficulty_level: 4,
            meteor_count: 12,
            ip_address: "123.456.789.003"
        },
        {
            player_name: "유저4",
            score: 115,
            survival_time: 35.432,
            difficulty_level: 3,
            meteor_count: 11,
            ip_address: "123.456.789.004"
        },
        {
            player_name: "게스트5",
            score: 98,
            survival_time: 31.789,
            difficulty_level: 3,
            meteor_count: 9,
            ip_address: "123.456.789.005"
        },
        {
            player_name: "익명6",
            score: 87,
            survival_time: 28.345,
            difficulty_level: 2,
            meteor_count: 8,
            ip_address: "123.456.789.006"
        },
        {
            player_name: "플레이어7",
            score: 76,
            survival_time: 25.678,
            difficulty_level: 2,
            meteor_count: 7,
            ip_address: "123.456.789.007"
        },
        {
            player_name: "게이머8",
            score: 65,
            survival_time: 22.123,
            difficulty_level: 2,
            meteor_count: 6,
            ip_address: "123.456.789.008"
        },
        {
            player_name: "테스터9",
            score: 54,
            survival_time: 18.456,
            difficulty_level: 1,
            meteor_count: 5,
            ip_address: "123.456.789.009"
        },
        {
            player_name: "유저10",
            score: 42,
            survival_time: 15.789,
            difficulty_level: 1,
            meteor_count: 4,
            ip_address: "123.456.789.010"
        }
    ];

    try {
        await client.connect();
        console.log('PostgreSQL 연결 성공!');

        for (const data of testData) {
            await client.query(`
                INSERT INTO game_records (
                    player_name,
                    score,
                    survival_time,
                    difficulty_level,
                    meteor_count,
                    ip_address,
                    played_at
                ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
            `, [
                data.player_name,
                data.score,
                data.survival_time,
                data.difficulty_level,
                data.meteor_count,
                data.ip_address
            ]);
            console.log(`${data.player_name}의 데이터 삽입 성공`);
        }

        console.log('모든 테스트 데이터 삽입 완료!');

    } catch (error) {
        console.error('에러 발생:', error);
    } finally {
        await client.end();
        console.log('DB 연결 종료');
    }
}

insertTestData(); 