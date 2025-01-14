const fs = require('fs');
const path = require('path');

try {
    // package.json 읽기
    const packagePath = path.join(__dirname, 'package.json');
    const package = require(packagePath);

    console.log('현재 버전:', package.version);  // 디버깅용

    // 버전 분리
    const [major, minor, patch] = package.version.split('.').map(Number);
    
    // minor 버전을 0.1 증가
    const newMinor = minor + 1;  // 정수로 처리
    
    // 새 버전 설정
    package.version = `${major}.${newMinor}.0`;
    
    console.log('새 버전:', package.version);  // 디버깅용

    // 업데이트된 package.json 저장
    fs.writeFileSync(packagePath, JSON.stringify(package, null, 2));

    // docs 폴더의 package.json도 업데이트
    const docsPackagePath = path.join(__dirname, 'docs', 'package.json');
    fs.writeFileSync(docsPackagePath, JSON.stringify(package, null, 2));

    console.log(`버전이 ${package.version}로 업데이트되었습니다.`);
} catch (error) {
    console.error('버전 업데이트 중 오류 발생:', error);
    process.exit(1);  // 에러 발생시 종료
} 