const fs = require('fs');
const glob = require('fs').readdirSync; // not real glob, just doing it manually

const fixMapping = {
    "BiCodeSlash": "FaCode",
    "BiBadge3dFill": "FaCube",
    "BiHexagonFill": "FaDiceD6",
    "BiDiagram2Fill": "FaProjectDiagram",
    "BiGraphUp": "FaChartLine",
    "BiCpuFill": "FaMicrochip",
    "BiTriangleFill": "FaPlay",
    "BiLightningChargeFill": "FaBolt",
    "BiBoxFill": "FaBox",
    "BiVectorPen": "FaPenNib",
    "BiArchiveFill": "FaArchive",
    "BiFilm": "FaFilm",
    "BiMusicNoteBeamed": "FaMusic",
    "BiSoundwave": "FaWaveSquare",
    "BiSliders": "FaSlidersH",
    "BiMicrosoft": "FaMicrosoft",
    "BiFileEarmarkWordFill": "FaFileWord",
    "BiFileEarmarkSlidesFill": "FaFilePowerpoint",
    "BiFileEarmarkSpreadsheetFill": "FaFileExcel",
    "BiBarChartFill": "FaChartBar",
    "BiDatabaseFill": "FaDatabase",
    "BiBuilding": "FaBuilding",
    "FaAdobe": "FaPalette",
    "BiTriangle": "FaPlay",
    "BiCameraReels": "FaVideo",
    "BiHddNetwork": "FaNetworkWired",
    "BiCpu": "FaMicrochip",
    "BiAwardFill": "FaAward",
    "BiMortarboardFill": "FaGraduationCap"
};

const files = [
    'src/data/technologies.ts',
    'src/data/workExperience.ts',
    'src/data/otherExperience.ts',
    'src/data/education.ts',
    'src/data/awards.ts',
    'src/components/ui/AwardBadge.tsx',
    'src/components/ui/EducationCard.tsx'
];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace icon names
    for (const [bad, good] of Object.entries(fixMapping)) {
        content = content.split(bad).join(good);
    }
    
    // Fix imports
    content = content.replace(/import \{([^}]+)\} from "react-icons\/bi";/g, (match, imports) => {
        return '';
    });
    content = content.replace(/import \{([^}]+)\} from "react-icons\/fa";/g, (match, imports) => {
        return '';
    });

    const matches = content.match(/Fa[a-zA-Z0-9]+/g) || [];
    const uniqueFa = [...new Set(matches.filter(m => m !== 'Fa'))].sort();
    
    if (uniqueFa.length > 0) {
        // filter out keywords if any
        const toImport = uniqueFa.filter(x => x !== 'False');
        if (toImport.length > 0) {
            content = `import { ${toImport.join(', ')} } from "react-icons/fa";\n` + content;
        }
    }

    fs.writeFileSync(file, content);
}
console.log('Fixed imports');
