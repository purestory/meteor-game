const { Client } = require('pg');

// PostgreSQL 연결 설정
const client = new Client({
    host: 'svc.sel4.cloudtype.app',
    port: 31291,
    user: 'root',
    password: '11111',
    database: 'postgres'
});

// 테이블 생성 함수
async function createTable() {
    try {
        // DB 연결
        await client.connect();
        console.log('PostgreSQL 연결 성공!');

        // 테이블 생성 쿼리
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS game_records (
                id SERIAL PRIMARY KEY,
                player_name VARCHAR(50),
                score INTEGER NOT NULL,
                survival_time DECIMAL(10,3) NOT NULL,
                difficulty_level INTEGER NOT NULL,
                meteor_count INTEGER NOT NULL,
                ip_address VARCHAR(45),
                played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- 순위표 인덱스 생성
            CREATE INDEX IF NOT EXISTS idx_game_records_score ON game_records(score DESC);
            CREATE INDEX IF NOT EXISTS idx_game_records_played_at ON game_records(played_at DESC);
        `;

        await client.query(createTableQuery);
        console.log('테이블 생성 성공!');

        // 테이블 확인
        const checkTableQuery = `
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'game_records'
            );
        `;
        const result = await client.query(checkTableQuery);
        console.log('테이블 존재 여부:', result.rows[0].exists);

    } catch (err) {
        console.error('오류 발생:', err);
    } finally {
        // 연결 종료
        await client.end();
    }
}

async function checkTable() {
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

        // 테이블 구조 확인
        const tableInfoQuery = `
            SELECT 
                column_name, 
                data_type, 
                character_maximum_length,
                column_default,
                is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'game_records'
            ORDER BY ordinal_position;
        `;

        // 인덱스 정보 확인
        const indexInfoQuery = `
            SELECT 
                indexname,
                indexdef
            FROM pg_indexes
            WHERE tablename = 'game_records';
        `;

        console.log('\n=== 테이블 구조 ===');
        const tableResult = await client.query(tableInfoQuery);
        console.table(tableResult.rows);

        console.log('\n=== 인덱스 정보 ===');
        const indexResult = await client.query(indexInfoQuery);
        console.table(indexResult.rows);

    } catch (err) {
        console.error('오류 발생:', err);
    } finally {
        await client.end();
    }
}

// 테이블 생성 실행
createTable();

// 테이블 정보 확인 실행
checkTable(); 