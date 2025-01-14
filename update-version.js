const fs = require('fs');
const path = require('path');

// package.json 읽기
const packagePath = path.join(__dirname, 'package.json');
const package = require(packagePath);

// 버전 분리 (1.0.1 형식도 처리)
const versionParts = package.version.split('.');
const major = Number(versionParts[0]);
const minor = Number(versionParts[1]);
const patch = Number(versionParts[2] || 0);

// minor 버전을 0.1 증가
const newMinor = minor + 0.1;

// 새 버전 설정 (소수점 1자리로 고정)
package.version = `${major}.${newMinor.toFixed(1)}`;

// 업데이트된 package.json 저장
fs.writeFileSync(packagePath, JSON.stringify(package, null, 2));

// docs 폴더의 package.json도 업데이트
const docsPackagePath = path.join(__dirname, 'docs', 'package.json');
fs.writeFileSync(docsPackagePath, JSON.stringify(package, null, 2));

console.log(`버전이 ${package.version}로 업데이트되었습니다.`); 