const { Client } = require('pg');

async function clearAllScores() {
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

        // 삭제 전 현재 레코드 수 확인
        const beforeCount = await client.query('SELECT COUNT(*) FROM game_records');
        console.log(`삭제 전 레코드 수: ${beforeCount.rows[0].count}`);

        // 확인 메시지 출력
        console.log('\n경고: 모든 게임 기록이 삭제됩니다!');
        console.log('3초 후에 삭제가 진행됩니다...');
        
        // 3초 대기
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 모든 레코드 삭제
        const result = await client.query('DELETE FROM game_records');
        
        console.log(`\n삭제 완료: ${result.rowCount}개의 레코드가 삭제되었습니다.`);

        // 삭제 후 레코드 수 확인
        const afterCount = await client.query('SELECT COUNT(*) FROM game_records');
        console.log(`삭제 후 레코드 수: ${afterCount.rows[0].count}`);

    } catch (error) {
        console.error('에러 발생:', error);
    } finally {
        await client.end();
        console.log('\nDB 연결 종료');
    }
}

// 실행 전 확인 프롬프트 추가
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('정말로 모든 게임 기록을 삭제하시겠습니까? (yes/no): ', (answer) => {
    if (answer.toLowerCase() === 'yes') {
        clearAllScores();
    } else {
        console.log('작업이 취소되었습니다.');
    }
    readline.close();
}); 