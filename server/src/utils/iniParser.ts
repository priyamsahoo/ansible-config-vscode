import { parse } from "ini";
import * as _ from "lodash";

/* Returns the ini config as an object after parsing */
function parseIniConfig(doc: string) {
  const parsedConfig: {
    [key: string]: any;
  } = parse(doc);

  console.log("config -> ", parsedConfig);

  return parsedConfig;
}

/* Returns all the sections present in the doc */
export function getSections(doc: string): string[] {
  const parsedConfig = parseIniConfig(doc);

  const sections = Object.keys(parsedConfig);
  return sections;
}

/* Returns all the options present in the doc under the mentioned section */
export function getOptionsInSection(doc: string, section: string): string[] {
  const parsedConfig = parseIniConfig(doc);

  const options = Object.keys(parsedConfig[section]);
  return options;
}

/* Returns the active section in the doc */
export function getCurrentSection(doc: string) {
  const parsedConfig = parseIniConfig(doc);

  const sections = Object.keys(parsedConfig);
  const currentSection = sections[sections.length - 1];
  return currentSection;
}
