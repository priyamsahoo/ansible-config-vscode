import { ConfigIniParser } from "config-ini-parser";
import {
  CompletionItem,
  CompletionItemKind,
  integer,
  Position,
} from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
  getAllOptionsForSection,
  getAllOptionsWithoutSection,
  getAllSections,
} from "../utils/ansibleConfigGetters";
import {
  getSections,
  getOptionsInSection,
  getCurrentSection,
} from "../utils/iniParser";

export function doCompletion(
  document: TextDocument,
  position: Position
): CompletionItem[] | null {
  const docTextTillCursorLine = document.getText({
    start: { line: 0, character: 0 },
    end: { line: position.line, character: integer.MAX_VALUE },
  });

  const previousLine = document.getText({
    start: { line: position.line - 1, character: 0 },
    end: { line: position.line - 1, character: integer.MAX_VALUE },
  });

  if (isDocStarting(position) || previousLine === "\n") {
    // provide completion for sections
    const allSections = getAllSections();

    // get provided sections
    const providedSections = getSections(docTextTillCursorLine);
    const remainingSections = allSections.filter(
      (item) => !providedSections.includes(item)
    );

    const sectionCompletionItems: CompletionItem[] = remainingSections.map(
      (item) => {
        const completionItem: CompletionItem = {
          label: item,
          kind: CompletionItemKind.Class,
          data: { documentUri: document.uri },
        };

        return completionItem;
      }
    );

    // Now provide completion for options without section
    const allOptionsWithoutSection = getAllOptionsWithoutSection();

    // get provided options (without section)
    // TODO

    const optionsWithoutSectionCompletionItems: CompletionItem[] =
      allOptionsWithoutSection.map((item) => {
        const completionItem: CompletionItem = {
          label: item,
          kind: CompletionItemKind.Keyword,
          data: { documentUri: document.uri },
        };

        return completionItem;
      });

    return [...sectionCompletionItems, ...optionsWithoutSectionCompletionItems];
  }

  if (previousLine !== "\n") {
    // get completion for options under the current section
    const currentSection = getCurrentSection(docTextTillCursorLine);
    const allOptions = getAllOptionsForSection(currentSection);
    const providedOptions = getOptionsInSection(
      docTextTillCursorLine,
      currentSection
    );

    const remainingSections = allOptions.filter(
      (item) => !providedOptions.includes(item)
    );
    const optionsCompletionItems: CompletionItem[] = remainingSections.map(
      (item) => {
        const completionItem: CompletionItem = {
          label: item,
          kind: CompletionItemKind.Keyword,
          data: { documentUri: document.uri },
        };

        return completionItem;
      }
    );
    return optionsCompletionItems;
  }

  return null;
}

export function doCompletionResolve(
  completionItem: CompletionItem
): CompletionItem {
  // const item: CompletionItem = { label: "Test" };
  if (completionItem.kind === CompletionItemKind.Class) {
    completionItem.insertText = `[${completionItem.label}]`;
    // completionItem.documentation = "TypeScript documentation";
    // completionItem.label = "Typescript is good";
  } else if (completionItem.data === 2) {
    completionItem.detail = "JavaScript details";
    completionItem.documentation = "JavaScript documentation";
  }

  return completionItem;
  // return item;
}

function isDocStarting(position: Position) {
  return position.line === 0 && position.character === 0;
}
