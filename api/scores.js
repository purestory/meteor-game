let scores = [];  // 실제로는 데이터베이스를 사용해야 합니다

export default async function handler(req, res) {
    // CORS 헤더 설정 수정
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');  // 모든 도메인 허용
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // OPTIONS 요청 처리 (preflight)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        // 최고 점수 조회
        res.status(200).json({ scores: scores.slice(0, 10) });  // 상위 10개만 반환
    } 
    else if (req.method === 'POST') {
        // 새로운 점수 저장
        const { score, time } = req.body;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        
        scores.push({
            score,
            time,
            ip,
            date: new Date().toISOString()
        });
        
        // 점수로 정렬
        scores.sort((a, b) => b.score - a.score);
        
        res.status(200).json({ message: "Score saved successfully" });
    }
} 