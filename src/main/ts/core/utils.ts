import { Editor, TinyMCE } from "tinymce";
import { Data } from "../types/plugin";

import approvedDomains from "./approvedDomains";

declare const tinymce: TinyMCE;

const DOM = tinymce.DOM;

export const imageSize = (
  url: string
): Promise<{
  width: string;
  height: string;
}> => {
  if (isValidUrl(url))
    return getImageSize(url).then((dimensions) => ({
      width: String(dimensions.width),
      height: String(dimensions.height),
    }));
};

const getImageSize = (
  url: string
): Promise<{
  width: string;
  height: string;
}> =>
  new Promise((callback) => {
    const img = document.createElement("img");
    const done = (dimensions) => {
      img.onload = img.onerror = null;
      if (img.parentNode) {
        img.parentNode.removeChild(img);
      }
      callback(dimensions);
    };
    img.onload = () => {
      const width = parseIntAndGetMax(img.width, img.clientWidth);
      const height = parseIntAndGetMax(img.height, img.clientHeight);
      const dimensions = {
        width,
        height,
      };
      done(Promise.resolve(dimensions));
    };
    img.onerror = () => {
      done(Promise.reject(`Failed to get image dimensions for: ${url}`));
    };
    const style = img.style;
    style.visibility = "hidden";
    style.position = "fixed";
    style.bottom = style.left = "0px";
    style.width = style.height = "auto";
    document.body.appendChild(img);
    img.src = url;
  });

const parseIntAndGetMax = (val1: string | number, val2: string | number) =>
  Math.max(parseInt(String(val1), 10), parseInt(String(val2), 10));

export function validateImageUrl(url: string): boolean {
  const a = document.createElement("a");
  a.setAttribute("href", url);
  return approvedDomains.includes(a.hostname);
}

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
  } catch (e) {
    console.error(e);
    return false;
  }
  return true;
};

export const isFigure = (elm: Element | ParentNode): boolean =>
  elm.nodeName === "FIGURE";
export const isImage = (elm: Element): boolean => elm.nodeName === "IMG";

export const getSelectedImage = (editor: Editor): HTMLImageElement => {
  const imgElm = editor.selection?.getNode();
  if (!imgElm) return;
  const figureElm = editor.dom.getParent(imgElm, "figure.image");
  if (figureElm) {
    return editor.dom.select("img", figureElm)[0];
  }
  if (imgElm && imgElm.nodeName !== "IMG") {
    return null;
  }
  return imgElm as HTMLImageElement;
};

export const readImageDataFromSelection = (editor: Editor): Data => {
  const image = getSelectedImage(editor);
  return image ? read(editor, image) : defaultData();
};

export const defaultData = (): Data => ({
  src: "",
  alt: "",
  title: "",
  size: {
    width: "",
    height: "",
  },
  class: "",
  style: "",
  caption: "",
  hspace: "",
  vspace: "",
  border: "",
  borderStyle: "",
  isDecorative: false,
});

export const read = (editor: Editor, image: HTMLImageElement): Data => ({
  src: getAttrib(image, "src"),
  alt: getAlt(image),
  title: getAttrib(image, "title"),
  size: { width: getSize(image, "width"), height: getSize(image, "height") },
  class: getAttrib(image, "class"),
  style: normalizeCss(editor, getAttrib(image, "style")),
  caption: getCaption(image),
  hspace: getHspace(image),
  vspace: getVspace(image),
  border: getBorder(image),
  borderStyle: getStyle(image, "borderStyle"),
  isDecorative: getIsDecorative(image),
});

const write = (editor: Editor, newData: Data, image: HTMLImageElement) => {
  const oldData = read(editor, image);
  updateProp(image, oldData, newData, "caption", updateCaption);
  updateProp(image, oldData, newData, "src", updateAttrib);
  updateProp(image, oldData, newData, "title", updateAttrib);
  updateSize(image, oldData, newData, "width", setSize(editor));
  updateSize(image, oldData, newData, "height", setSize(editor));
  updateProp(image, oldData, newData, "class", updateAttrib);
  updateProp(
    image,
    oldData,
    newData,
    "style",
    normalized(editor, (image, value) => updateAttrib(image, "style", value))
  );
  updateProp(image, oldData, newData, "hspace", normalized(editor, setHspace));
  updateProp(image, oldData, newData, "vspace", normalized(editor, setVspace));
  updateProp(image, oldData, newData, "border", normalized(editor, setBorder));
  updateProp(
    image,
    oldData,
    newData,
    "borderStyle",
    normalized(editor, setBorderStyle)
  );
  updateProp(image, oldData, newData, "alt", updateAttrib);
};

export const normalizeCss = (editor: Editor, cssText: string): string => {
  const css = editor.dom.styles.parse(cssText);
  const mergedCss = mergeMargins(css);
  const compressed = editor.dom.styles.parse(
    editor.dom.styles.serialize(mergedCss)
  );
  return editor.dom.styles.serialize(compressed);
};

const mergeMargins = (css: Record<string, string>) => {
  if (css.margin) {
    const splitMargin = String(css.margin).split(" ");
    switch (splitMargin.length) {
      case 1:
        css["margin-top"] = css["margin-top"] || splitMargin[0];
        css["margin-right"] = css["margin-right"] || splitMargin[0];
        css["margin-bottom"] = css["margin-bottom"] || splitMargin[0];
        css["margin-left"] = css["margin-left"] || splitMargin[0];
        break;
      case 2:
        css["margin-top"] = css["margin-top"] || splitMargin[0];
        css["margin-right"] = css["margin-right"] || splitMargin[1];
        css["margin-bottom"] = css["margin-bottom"] || splitMargin[0];
        css["margin-left"] = css["margin-left"] || splitMargin[1];
        break;
      case 3:
        css["margin-top"] = css["margin-top"] || splitMargin[0];
        css["margin-right"] = css["margin-right"] || splitMargin[1];
        css["margin-bottom"] = css["margin-bottom"] || splitMargin[2];
        css["margin-left"] = css["margin-left"] || splitMargin[1];
        break;
      case 4:
        css["margin-top"] = css["margin-top"] || splitMargin[0];
        css["margin-right"] = css["margin-right"] || splitMargin[1];
        css["margin-bottom"] = css["margin-bottom"] || splitMargin[2];
        css["margin-left"] = css["margin-left"] || splitMargin[3];
    }
    delete css.margin;
  }
  return css;
};

const removePixelSuffix = (value: string) => {
  if (value) {
    value = value.replace(/px$/, "");
  }
  return value;
};

const getHspace = (image: HTMLImageElement) => {
  if (
    image.style.marginLeft &&
    image.style.marginRight &&
    image.style.marginLeft === image.style.marginRight
  ) {
    return removePixelSuffix(image.style.marginLeft);
  } else {
    return "";
  }
};

const getVspace = (image: HTMLImageElement) => {
  if (
    image.style.marginTop &&
    image.style.marginBottom &&
    image.style.marginTop === image.style.marginBottom
  ) {
    return removePixelSuffix(image.style.marginTop);
  } else {
    return "";
  }
};

const getBorder = (image: HTMLImageElement) => {
  if (image.style.borderWidth) {
    return removePixelSuffix(image.style.borderWidth);
  } else {
    return "";
  }
};

const getAttrib = (image: HTMLImageElement, name: string) => {
  if (image.hasAttribute(name)) {
    return image.getAttribute(name);
  } else {
    return "";
  }
};

const getStyle = (image: HTMLImageElement, name: string) =>
  image.style[name] ? image.style[name] : "";

const getIsDecorative = (image: HTMLImageElement) =>
  DOM.getAttrib(image, "alt").length === 0 &&
  DOM.getAttrib(image, "role") === "presentation";

const getAlt = (image: HTMLImageElement) => {
  if (getIsDecorative(image)) {
    return "";
  } else {
    return getAttrib(image, "alt");
  }
};

const getSize = (image: HTMLImageElement, name: string) => {
  if (image.style[name]) {
    return removePixelSuffix(image.style[name]);
  } else {
    return getAttrib(image, name);
  }
};

const getCaption = (image: HTMLImageElement): string => {
  if (image.parentNode !== null && image.parentNode.nodeName === "FIGURE") {
    return image.parentElement.lastChild.textContent;
  }
  return "";
};

export const writeImageDataToSelection = (editor: Editor, data: Data): void => {
  const image = getSelectedImage(editor);
  write(editor, data, image);
  syncSrcAttr(editor, image);
  if (isFigure(image.parentNode)) {
    // const figure = image.parentNode;
    // splitTextBlock(editor, figure);
    editor.selection.select(image.parentNode);
  } else {
    editor.selection.select(image);
    // waitLoadImage(editor, data, image);
  }
};

export const addPixelSuffix = (value: string): string => {
  if (value.length > 0 && /^[0-9]+$/.test(value)) {
    value += "px";
  }
  return value;
};

const setHspace = (image: HTMLImageElement, value: string) => {
  const pxValue = addPixelSuffix(value);
  image.style.marginLeft = pxValue;
  image.style.marginRight = pxValue;
};
const setVspace = (image: HTMLImageElement, value: string) => {
  const pxValue = addPixelSuffix(value);
  image.style.marginTop = pxValue;
  image.style.marginBottom = pxValue;
};
const setBorder = (image: HTMLImageElement, value: string) => {
  const pxValue = addPixelSuffix(value);
  image.style.borderWidth = pxValue;
};
const setBorderStyle = (image: HTMLImageElement, value: string) => {
  image.style.borderStyle = value;
};

const normalized =
  (editor: Editor, set: (image: HTMLImageElement, value: string) => void) =>
  (image: HTMLImageElement, name: string, value: string) => {
    set(image, value);
    normalizeStyle(editor, image);
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

const syncSrcAttr = (editor: Editor, image: HTMLImageElement) => {
  editor.dom.setAttrib(image, "src", image.getAttribute("src"));
};

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
