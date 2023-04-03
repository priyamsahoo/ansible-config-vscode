import { ansibleConfigOptions } from "./ansibleConfigOptions";

export function getAllOptionsForSection(name: string): string[] {
  return ansibleConfigOptions
    .filter((x) => x.Section === name)
    .map((x) => x.Name);
}

export function getAllOptionsWithoutSection(): string[] {
  return ansibleConfigOptions.filter((x) => !x.Section).map((x) => x.Name);
}

export function getAllSections(): string[] {
  return ansibleConfigOptions
    .map((x) => x.Section)
    .filter((x, i, self): x is string => x !== null && self.indexOf(x) === i);
}
