import { Editor } from "tinymce";

export const isSimpleType = (type) => (value) => typeof value === type;
export const eq = (t) => (a) => t === a;

export const isNull = eq(null);
export const isBoolean = isSimpleType("boolean");
export const isNullable = (a: Element | null | undefined): boolean =>
  a === null || a === undefined;
export const isNonNullable = (a: Element | null | undefined): boolean =>
  !isNullable(a);
export const isFunction = isSimpleType("function");
export const isNumber = isSimpleType("number");

export const getSelectedImage = (editor: Editor): Element => {
  const imgElm = editor.selection.getNode();
  const figureElm = editor.dom.getParent(imgElm, "figure.image");
  if (figureElm) {
    return editor.dom.select("img", figureElm)[0];
  }
  if (imgElm && (imgElm.nodeName !== "IMG" || isPlaceholderImage(imgElm))) {
    return null;
  }
  return imgElm;
};

export const isPlaceholderImage = (imgElm: Element): boolean =>
  imgElm.nodeName === "IMG" &&
  (imgElm.hasAttribute("data-mce-object") ||
    imgElm.hasAttribute("data-mce-placeholder"));
