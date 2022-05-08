import { Editor } from "tinymce";
import { Data } from "../types/plugin";
import { addPixelSuffix, normalizeCss } from "./utils";

export const updateProp = (
  image: HTMLImageElement,
  oldData: Data,
  newData: Data,
  name: string,
  set: (image: HTMLImageElement, name: string, value: string) => void
): void => {
  if (newData[name] !== oldData[name]) {
    set(image, name, newData[name]);
  }
};
export const updateSize = (
  image: HTMLImageElement,
  oldData: Data,
  newData: Data,
  name: string,
  set: (image: HTMLImageElement, name: string, value: string) => void
): void => {
  if (newData.size[name] !== oldData.size[name]) {
    set(image, name, newData.size[name]);
  }
};

export const updateAttrib = (
  image: HTMLImageElement,
  name: string,
  value: string
): void => {
  if (value === "") {
    image.removeAttribute(name);
  } else {
    image.setAttribute(name, value);
  }
};

export const updateCaption = (
  image: HTMLImageElement,
  name: string,
  value: string
): void => {
  if (value === "") {
    const parent = image.parentElement;
    parent.replaceWith(image);
  } else {
    const sibling = image.nextSibling;
    console.log({ sibling });
    if (sibling.nodeName === "FIGCAPTION") {
      sibling.textContent = value;
    }
  }
};

export const setSize =
  (editor: Editor) =>
  (image: HTMLImageElement, name: string, value: string): void => {
    if (image.style[name]) {
      image.style[name] = addPixelSuffix(value);
      normalizeStyle(editor, image);
    } else {
      updateAttrib(image, name, value);
    }
  };

const normalizeStyle = (editor: Editor, image: HTMLImageElement) => {
  const attrValue = image.getAttribute("style");
  const value = normalizeCss(editor, attrValue !== null ? attrValue : "");
  if (value.length > 0) {
    image.setAttribute("style", value);
    image.setAttribute("data-mce-style", value);
  } else {
    image.removeAttribute("style");
  }
};

export const deleteImage = (editor: Editor, image: HTMLImageElement): void => {
  if (image) {
    const elm = editor.dom.is(image.parentNode, "figure.image")
      ? image.parentNode
      : image;
    editor.dom.remove(elm);
    editor.focus();
    editor.nodeChanged();
    if (editor.dom.isEmpty(editor.getBody())) {
      editor.setContent("");
      editor.selection.setCursorLocation();
    }
  }
};
