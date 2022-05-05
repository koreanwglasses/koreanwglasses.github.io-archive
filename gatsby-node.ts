import { SourceNodesArgs } from "gatsby";
import fetch from "node-fetch";
import { prepareHTML } from "./src/lib/prepare-html";
import { parse } from "node-html-parser";

export const sourceNodes: (args: SourceNodesArgs) => void = async ({
  createNodeId,
  store,
  cache,
  reporter,
  actions,
  createContentDigest,
}) => {
  const { createNode } = actions;

  // Extract data from CV/Resume on GDocs
  const url = `https://docs.google.com/document/u/1/d/1n-r0qla4d5aVM4oY-JcQNjbxmcguMa-11W72-pcK6n8/export?format=html`;
  const res = await fetch(url);
  const html = await res.text();

  // Prepare html
  const filterProperties = (prop: string) =>
    !!prop.match(/^(?:text-align|font-weight|font-style)$/);
  const doc = parse(prepareHTML(html, filterProperties));

  // Remove the first table
  doc.querySelectorAll("table")?.[0].remove();
  // Remove styles on headers
  doc
    .querySelectorAll("h1 > span")
    .forEach((el) => el.removeAttribute("style"));
  // Remove the last paragraph
  doc
    .querySelectorAll("p")
    .find((el) => el.text.includes("This page is left unintentionally blank."))
    ?.remove();
  // Indent skills
  doc
    .querySelectorAll("h1")
    .find((el) => el.text.includes("Skills"))
    ?.nextElementSibling.querySelectorAll("ul + p")
    .forEach((el) => el.setAttribute("style", "margin-left: 60px"));

  createNode({
    id: createNodeId("cv-source"),
    internal: {
      type: "Custom",
      contentDigest: createContentDigest(doc.outerHTML),
    },
    name: "cv-source",
    html: doc.outerHTML,
  });
};
