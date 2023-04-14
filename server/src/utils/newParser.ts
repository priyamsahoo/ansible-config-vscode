/* eslint-disable no-case-declarations */

import { Position } from "vscode-languageserver";

interface Item {
  type: string;
  label: string;
  range: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
  for?: Item;
}

export function parseItems(content: string): Item[] {
  const items: Item[] = [];
  const length = content.length;

  let index = 0;
  let line = 0;
  let character = 0;
  let currentItem: Item | null = null;
  let currentSection: Item | null = null;

  while (index < length) {
    const c = content[index];

    switch (c) {
      case "[":
        currentSection = currentItem = {
          type: "section",
          range: { start: { line, character }, end: { line, character } },
          label: "",
        };
        break;

      case "]":
        currentItem!.range.end = { line, character: character + 1 };
        items.push(currentItem!);
        currentItem = null;
        break;

      case "\n":
        if (currentItem != null) {
          items.push(currentItem);
        }
        currentItem = null;
        line++;
        character = -1;
        break;

      case "=":
        currentItem!.range.end = { line, character };
        items.push(currentItem!);
        const oldItem: any = currentItem!;
        currentItem = {
          type: "value",
          for: oldItem,
          range: { start: { line, character }, end: { line, character } },
          label: "",
        };
        break;

      default:
        if (/[a-zA-Z0-9_]/.test(c)) {
          if (currentItem === null) {
            currentItem = {
              type: "option",
              for: currentSection!,
              range: { start: { line, character }, end: { line, character } },
              label: "",
            };
          }
          currentItem.label += c;
        }
        break;
    }

    index++;
    character++;
  }

  if (currentItem != null) {
    currentItem!.range.end = { line, character };
    items.push(currentItem);
  }

  return items;
}

export function getPresentSections(items: Item[]): string[] {
  return items.filter((x) => x.type == "section").map((x) => x.label);
}

export function getPresentOptionsForSection(
  section: string,
  items: Item[]
): Item[] {
  return items.filter((x) => x.type == "option" && x.for?.label == section);
}

/* Returns an item present at the cursor position */
export function getItemAtPosition(
  items: Item[],
  position: Position
): Item | undefined {
  items.forEach((item) => {
    try {
      if (
        item.range.start.line === position.line &&
        item.range.end.line === position.line
      ) {
        if (
          item.range.start.character <= position.character &&
          item.range.end.character >= position.character
        ) {
          return item;
        }
      }
    } catch (e) {
      console.log(JSON.stringify(item));
      console.log(e);
    }
  });
  return;
}

/* Returns item present at the previous line of the cursor position */
export function getItemPresentAbove(
  items: Item[],
  position: Position
): Item | undefined {
  for (const item of items.slice().reverse()) {
    try {
      if (
        item.range.start.line === position.line &&
        item.range.end.line === position.line
      ) {
        if (
          item.range.start.character <= position.character &&
          item.range.end.character >= position.character
        ) {
          // return item;
          return;
        }
      } else if (
        item.range.start.line === position.line - 1 &&
        item.range.end.line === position.line - 1
      ) {
        return item;
      }
    } catch (e) {
      console.log(JSON.stringify(item));
      console.log(e);
    }
  }
  return;
}

/**
 * Returns options for current section
 */
export function getCurrentSectionTest(
  items: Item[],
  position: Position
): string | undefined {
  let item = getItemPresentAbove(items, position);

  if (!item) return;

  // console.log(
  //   `Item for position ${position.line},${position.character}: ${item?.type}${item?.label}`
  // );
  while (item) {
    if (item.type === "section") {
      // const names = getAllOptionsForSection(item.label);
      // console.log(names.join(", "));
      return item.label;
    }
    item = item.for;
  }
  return;
}
