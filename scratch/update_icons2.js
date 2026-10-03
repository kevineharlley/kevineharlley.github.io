const fs = require('fs');

const iconMapping = {
    "bi bi-building": "BiBuilding",
    "bi bi-triangle": "BiTriangle",
    "bi bi-google": "FaGoogle",
    "bi bi-camera-reels": "BiCameraReels",
    "bi bi-hdd-network": "BiHddNetwork",
    "bi bi-cpu": "BiCpu",
    "bi bi-award-fill": "BiAwardFill",
    "bi bi-mortarboard-fill": "BiMortarboardFill"
};

function processFile(filepath) {
    if (!fs.existsSync(filepath)) return;
    let content = fs.readFileSync(filepath, 'utf8');
    
    const faImports = new Set();
    const biImports = new Set();

    let replaced = false;
    content = content.replace(/icon:\s*"([^"]+)"/g, (match, iconStr) => {
        if (iconMapping[iconStr]) {
            replaced = true;
            const iconComp = iconMapping[iconStr];
            if (iconComp.startsWith("Fa")) faImports.add(iconComp);
            else biImports.add(iconComp);
            return `icon: ${iconComp}`;
        }
        return match;
    });

    if (!replaced) return;

    let importsStr = "";
    if (faImports.size > 0) importsStr += `import { ${Array.from(faImports).sort().join(", ")} } from "react-icons/fa";\n`;
    if (biImports.size > 0) importsStr += `import { ${Array.from(biImports).sort().join(", ")} } from "react-icons/bi";\n`;

    if (importsStr) {
        const importEndIdx = content.lastIndexOf('import ');
        if (importEndIdx !== -1) {
            const newlineIdx = content.indexOf('\n', importEndIdx);
            content = content.slice(0, newlineIdx + 1) + importsStr + content.slice(newlineIdx + 1);
        } else {
            content = importsStr + content;
        }
    }

    fs.writeFileSync(filepath, content);
    console.log('Done mapping', filepath);
}

processFile('src/data/workExperience.ts');
processFile('src/data/otherExperience.ts');
processFile('src/data/education.ts');
processFile('src/data/awards.ts');
