import { Diagnostic, DiagnosticSeverity, integer } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
  getAllOptionsForSection,
  getAllSections,
} from "../utils/ansibleConfigGetters";
import {
  Item,
  getPresentOptionsForSection,
  getPresentSections,
  parseItems,
} from "../utils/newParser";
import _ from "lodash";

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

      // // 3. invalidate if duplicate options are found
      const uniqueOptions = _.uniqBy(currentOptions, "label");
      const duplicateOptions = currentOptions.filter(
        (x) => !uniqueOptions.includes(x)
      );

      duplicateOptions.forEach((option) => {
        diagnostics.push({
          range: option.range,
          severity: DiagnosticSeverity.Error,
          message: `Option already present in the section: '${option.label}'`,
        });
      });
    }
  });

  return diagnostics;
}
