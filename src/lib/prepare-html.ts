import { parse } from "node-html-parser";
import * as css from "css";

function isRule(node: css.Node): node is css.Rule {
  return node.type === "rule";
}

function isDeclaration(node: css.Node): node is css.Declaration {
  return node.type === "declaration";
}

function insertStyles(
  inlineStyle: string,
  nodes: (css.Declaration | css.Comment)[]
) {
  inlineStyle = inlineStyle.trim();
  if (inlineStyle && !inlineStyle.endsWith(";")) inlineStyle += ";";
  inlineStyle = `*{${inlineStyle}}`;

  const rule = css.parse(inlineStyle).stylesheet?.rules[0];

  const map: { [prop: string]: string } = {};

  if (rule && isRule(rule) && rule.declarations)
    for (const dec of rule.declarations)
      if (isDeclaration(dec) && dec.property && dec.value)
        map[dec.property] = dec.value;

  for (const dec of nodes)
    if (isDeclaration(dec) && dec.property && dec.value)
      map[dec.property] = dec.value;

  const declarations = Object.entries(map).map(([property, value]) => ({
    type: "declaration",
    property,
    value,
  }));

  const stylesheet: css.Stylesheet = {
    stylesheet: {
      rules: [{ type: "rule", selectors: ["*"], declarations }],
    },
  };

  const style = css
    .stringify(stylesheet)
    .split("\n")
    .slice(1, -1)
    .map((line) => line.trim())
    .join("")
    .replaceAll('"', '\\"');

  return style;
}

export function prepareHTML(
  html: string,
  filterProperties: (prop: string) => boolean
) {
  const dom = parse(html);

  const { stylesheet } = css.parse(dom.querySelector("style")?.innerHTML ?? "");

  if (stylesheet && stylesheet.rules) {
    for (const rule of stylesheet.rules) {
      if (!isRule(rule) || !rule.selectors || !rule.declarations) continue;

      for (const sel of rule.selectors) {
        // TODO: Handle :before and :after. Ignoring them for now
        if (sel.match(/\b(?:\:before|\:after)\b/)) continue;

        for (const el of dom.querySelectorAll(sel)) {
          const style = insertStyles(
            el.getAttribute("style") ?? "",
            rule.declarations.filter(
              (dec) =>
                isDeclaration(dec) &&
                dec.property &&
                filterProperties(dec.property)
            )
          );

          el.removeAttribute("class");
          if (style) el.setAttribute("style", style);
        }
      }
    }
  }

  while (true) {
    const els = dom
      .querySelectorAll("*")
      .filter((el) => !el.innerHTML && !el.tagName.match(/^(?:img|td|tr)$/));
    if (els.length === 0) break;
    els.forEach((els) => els.remove());
  }

  return dom.querySelector("body")?.innerHTML ?? "";
}
