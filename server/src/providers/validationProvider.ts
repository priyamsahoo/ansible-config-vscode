import { Diagnostic, DiagnosticSeverity, integer } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { getSections } from "../utils/iniParser";
import {
  getAllOptionsForSection,
  getAllSections,
} from "../utils/ansibleConfigGetters";
// import { getCurrentSection } from "../utils/iniParser";
import {
  getPresentOptionsForSection,
  getPresentSections,
  parseItems,
} from "../utils/newParser";

export function doValidation(document: TextDocument): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];

  const docText = document.getText();
  const items = parseItems(docText);

  // 1. invalidate unknown sections
  const currentSections = getPresentSections(items);
  const allSections = getAllSections();

  const extraSections = currentSections.filter((x) => !allSections.includes(x));

  if (extraSections.length > 0) {
    extraSections.forEach((section) => {
      const item = items.find((x) => x.label === section);

      if (item) {
        diagnostics.push({
          range: item.range,
          severity: DiagnosticSeverity.Error,
          message: `Unknown section '${item.label}'`,
        });
      }
    });
  }

  // 2. invalidate unknown options
  currentSections.forEach((section) => {
    const item = items.find((x) => x.label === section);

    if (item) {
      const currentOptions = getPresentOptionsForSection(item.label, items);
      const allOptions = getAllOptionsForSection(item.label);

      const extraOptions = currentOptions.filter(
        (x) => !allOptions.includes(x.label)
      );

      extraOptions.forEach((option) => {
        diagnostics.push({
          range: option.range,
          severity: DiagnosticSeverity.Error,
          message: `Unknown option '${option.label}'`,
        });
      });
    }
  });

  return diagnostics;
}
