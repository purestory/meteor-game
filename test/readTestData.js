const { Client } = require('pg');

async function readTestData() {
    const client = new Client({
        host: 'svc.sel4.cloudtype.app',
        port: 31291,
        user: 'root',
        password: '11111',
        database: 'postgres'
    });

    try {
        await client.connect();
        console.log('PostgreSQL 연결 성공!');

        // 전체 레코드 수 확인
        const countResult = await client.query('SELECT COUNT(*) FROM game_records');
        console.log('\n총 레코드 수:', countResult.rows[0].count);

        // 상위 10개 기록 조회
        console.log('\n=== 상위 10개 기록 ===');
        const topScores = await client.query(`
            SELECT 
                player_name,
                score,
                survival_time,
                difficulty_level,
                meteor_count,
                ip_address,
                played_at
            FROM game_records 
            ORDER BY score DESC 
            LIMIT 10
        `);

        topScores.rows.forEach((record, index) => {
            console.log(`\n${index + 1}위:`);
            console.log(`플레이어: ${record.player_name}`);
            console.log(`점수: ${record.score}`);
            console.log(`생존 시간: ${record.survival_time}초`);
            console.log(`난이도: ${record.difficulty_level}`);
            console.log(`운석 수: ${record.meteor_count}`);
            console.log(`IP: ${record.ip_address}`);
            console.log(`플레이 시간: ${record.played_at.toLocaleString()}`);
        });

        // 통계 정보
        console.log('\n=== 통계 정보 ===');
        const stats = await client.query(`
            SELECT 
                MAX(score) as max_score,
                MIN(score) as min_score,
                AVG(score)::numeric(10,2) as avg_score,
                MAX(survival_time) as max_time,
                MIN(survival_time) as min_time,
                AVG(survival_time)::numeric(10,2) as avg_time
            FROM game_records
        `);

        console.log('최고 점수:', stats.rows[0].max_score);
        console.log('최저 점수:', stats.rows[0].min_score);
        console.log('평균 점수:', stats.rows[0].avg_score);
        console.log('최장 생존 시간:', stats.rows[0].max_time, '초');
        console.log('최단 생존 시간:', stats.rows[0].min_time, '초');
        console.log('평균 생존 시간:', stats.rows[0].avg_time, '초');

    } catch (error) {
        console.error('에러 발생:', error);
    } finally {
        await client.end();
        console.log('\nDB 연결 종료');
    }
}

readTestData(); 