const fs = require('fs');

const filepath = 'src/data/technologies.ts';
let content = fs.readFileSync(filepath, 'utf8');

const iconMapping = {
    "fab fa-html5": "FaHtml5",
    "fab fa-css3": "FaCss3",
    "fab fa-js": "FaJs",
    "fab fa-java": "FaJava",
    "fab fa-python": "FaPython",
    "fas fa-database": "FaDatabase",
    "fab fa-react": "FaReact",
    "fas fa-wind": "FaWind",
    "fab fa-node-js": "FaNodeJs",
    "fab fa-angular": "FaAngular",
    "fab fa-git-alt": "FaGitAlt",
    "fab fa-usb": "FaUsb",
    "fab fa-adobe": "FaAdobe",
    "fab fa-salesforce": "FaSalesforce",
    "fab fa-figma": "FaFigma",
    "bi bi-code-slash": "BiCodeSlash",
    "bi bi-badge-3d-fill": "BiBadge3dFill",
    "bi bi-hexagon-fill": "BiHexagonFill",
    "bi bi-diagram-2-fill": "BiDiagram2Fill",
    "bi bi-graph-up": "BiGraphUp",
    "bi bi-cpu-fill": "BiCpuFill",
    "bi bi-triangle-fill": "BiTriangleFill",
    "bi bi-lightning-charge-fill": "BiLightningChargeFill",
    "bi bi-box-fill": "BiBoxFill",
    "bi bi-vector-pen": "BiVectorPen",
    "bi bi-archive-fill": "BiArchiveFill",
    "bi bi-film": "BiFilm",
    "bi bi-music-note-beamed": "BiMusicNoteBeamed",
    "bi bi-soundwave": "BiSoundwave",
    "bi bi-sliders": "BiSliders",
    "bi bi-microsoft": "BiMicrosoft",
    "bi bi-file-earmark-word-fill": "BiFileEarmarkWordFill",
    "bi bi-file-earmark-slides-fill": "BiFileEarmarkSlidesFill",
    "bi bi-file-earmark-spreadsheet-fill": "BiFileEarmarkSpreadsheetFill",
    "bi bi-bar-chart-fill": "BiBarChartFill",
    "bi bi-database-fill": "BiDatabaseFill",
    "bi bi-building": "BiBuilding"
};

const faImports = new Set();
const biImports = new Set();

content = content.replace(/icon:\s*"([^"]+)"/g, (match, iconStr) => {
    if (iconMapping[iconStr]) {
        const iconComp = iconMapping[iconStr];
        if (iconComp.startsWith("Fa")) faImports.add(iconComp);
        else biImports.add(iconComp);
        return `icon: ${iconComp}`;
    }
    return match;
});

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
console.log('Done mapping technologies.ts');
