const fs = require("fs");
const path = require("path");

const packagePath = path.join(__dirname, "package.json");
const package = require(packagePath);

const [major, minor] = package.version.split(".").map(Number);
const newMinor = minor + 0.1;

package.version = `${major}.${newMinor.toFixed(1)}`;

fs.writeFileSync(packagePath, JSON.stringify(package, null, 2));

console.log(`버전이 ${package.version}로 업데이트되었습니다.`);
