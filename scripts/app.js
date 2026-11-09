const card = document.querySelector(".code-card");
const codeContent = document.querySelector(".code-content");
const codeInput = document.querySelector(".code-input");
const codeHighlight = document.querySelector(".code-highlight code");
const fileNameInput = document.querySelector(".file-name");
const fileExtension = document.querySelector(".file-extension");
const languageSelect = document.querySelector(".language-select");
const exportButtons = document.querySelectorAll("[data-export-format]");
const exportStatus = document.querySelector(".export-status");
const editorStatus = document.querySelector(".editor-status");

const languages = {
    css: { label: "CSS", extension: ".css" },
    csharp: { label: "C#", extension: ".cs" },
    html: { label: "HTML", extension: ".html" },
    java: { label: "Java", extension: ".java" },
    javascript: { label: "JavaScript", extension: ".js" },
    python: { label: "Python", extension: ".py" },
    sql: { label: "SQL", extension: ".sql" },
    typescript: { label: "TypeScript", extension: ".ts" }
};

let highlighter;
let highlightRevision = 0;
let currentLanguage = "csharp";

async function exportCard(format) {
    if (!card || !exportStatus) {
        throw new Error("Não foi possível encontrar o card para exportação.");
    }

    if (!window.htmlToImage) {
        exportStatus.textContent = "Não foi possível carregar a biblioteca de exportação.";
        console.error("html-to-image is not available.");
        return;
    }

    const buttons = Array.from(exportButtons);
    buttons.forEach((button) => {
        button.disabled = true;
    });
    exportStatus.textContent = "Preparando imagem...";
    card.classList.add("is-exporting");

    try {
        await document.fonts.ready;

        const image = format === "svg"
            ? await window.htmlToImage.toSvg(card)
            : await window.htmlToImage.toPng(card);
        const downloadLink = document.createElement("a");
        downloadLink.download = `code-block.${format}`;
        downloadLink.href = image;
        downloadLink.click();
        exportStatus.textContent = `Card exportado como ${format.toUpperCase()}.`;
    } catch (error) {
        exportStatus.textContent = `Falha ao exportar o card como ${format.toUpperCase()}.`;
        console.error("Failed to export code card.", error);
    } finally {
        card.classList.remove("is-exporting");
        buttons.forEach((button) => {
            button.disabled = false;
        });
    }
}

function updateCodeHeight() {
    if (!codeContent || !codeInput) {
        return;
    }

    codeInput.style.height = "auto";
    codeInput.style.height = `${codeInput.scrollHeight}px`;
}

async function renderCode() {
    if (!codeInput || !codeHighlight) {
        return;
    }

    const revision = ++highlightRevision;
    const source = codeInput.value;

    if (!highlighter || source.length === 0) {
        codeHighlight.textContent = source;
        return;
    }

    try {
        const html = highlighter.codeToHtml(source, {
            lang: currentLanguage,
            theme: "dark-plus"
        });

        if (revision !== highlightRevision) {
            return;
        }

        const template = document.createElement("template");
        template.innerHTML = html;
        const highlightedCode = template.content.querySelector("code");

        if (!highlightedCode) {
            throw new Error("Shiki did not return a code element.");
        }

        codeHighlight.replaceChildren(...highlightedCode.childNodes);
        editorStatus.textContent = "";
    } catch (error) {
        if (revision === highlightRevision) {
            codeHighlight.textContent = source;
            editorStatus.textContent = `O realce de sintaxe para ${languages[currentLanguage].label} está indisponível; você ainda pode editar e exportar o código.`;
            console.error(`Failed to highlight ${languages[currentLanguage].label} code.`, error);
        }
    }
}

async function initializeHighlighter() {
    try {
        const { createHighlighter } = await import("https://esm.sh/shiki@1.29.2");
        highlighter = await createHighlighter({
            langs: Object.keys(languages),
            themes: ["dark-plus"]
        });
        await renderCode();
    } catch (error) {
        editorStatus.textContent = "O realce de sintaxe está indisponível; você ainda pode editar e exportar o código.";
        console.error("Failed to load Shiki for C# highlighting.", error);
    }
}

if (codeInput && codeContent && codeHighlight && editorStatus) {
    codeInput.addEventListener("input", () => {
        updateCodeHeight();
        void renderCode();
    });

    window.addEventListener("resize", updateCodeHeight);
    void document.fonts.ready.then(updateCodeHeight);
    updateCodeHeight();
    void initializeHighlighter();
}

exportButtons.forEach((button) => {
    button.addEventListener("click", () => {
        void exportCard(button.dataset.exportFormat);
    });
});

if (fileNameInput instanceof HTMLInputElement) {
    fileNameInput.addEventListener("input", () => {
        fileNameInput.size = Math.max(fileNameInput.value.length, 1);
        fileNameInput.setAttribute("value", fileNameInput.value);
    });
}

if (
    codeInput instanceof HTMLTextAreaElement
    && codeHighlight instanceof HTMLElement
    && editorStatus instanceof HTMLElement
    && fileExtension instanceof HTMLElement
    && languageSelect instanceof HTMLSelectElement
) {
    languageSelect.addEventListener("change", () => {
        const language = languages[languageSelect.value];

        if (!language) {
            editorStatus.textContent = "A linguagem selecionada não é suportada.";
            console.error(`Unsupported language selected: ${languageSelect.value}`);
            return;
        }

        currentLanguage = languageSelect.value;
        fileExtension.textContent = language.extension;
        codeInput.setAttribute("aria-label", `Código ${language.label}`);
        void renderCode();
    });
}