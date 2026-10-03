import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    icon_mapping = {
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
    }

    fa_imports = set()
    bi_imports = set()

    def replace_icon(match):
        icon_str = match.group(1)
        if icon_str in icon_mapping:
            icon_comp = icon_mapping[icon_str]
            if icon_comp.startswith("Fa"):
                fa_imports.add(icon_comp)
            else:
                bi_imports.add(icon_comp)
            return f'icon: {icon_comp}'
        return match.group(0)

    new_content = re.sub(r'icon:\s*"([^"]+)"', replace_icon, content)

    imports_str = ""
    if fa_imports:
        imports_str += f'import {{ {", ".join(sorted(fa_imports))} }} from "react-icons/fa";\n'
    if bi_imports:
        imports_str += f'import {{ {", ".join(sorted(bi_imports))} }} from "react-icons/bi";\n'

    # Insert imports after existing imports
    if imports_str:
        import_end_idx = new_content.rfind('import ')
        if import_end_idx != -1:
            newline_idx = new_content.find('\n', import_end_idx)
            new_content = new_content[:newline_idx+1] + imports_str + new_content[newline_idx+1:]
        else:
            new_content = imports_str + new_content

    with open(filepath, 'w') as f:
        f.write(new_content)

process_file("src/data/technologies.ts")
