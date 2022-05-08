import { Editor, TinyMCE } from "tinymce";
import { Data } from "../types/plugin";
import { deleteImage } from "./save";
import {
  defaultData,
  getSelectedImage,
  read,
  writeImageDataToSelection,
} from "./utils";

declare const tinymce: TinyMCE;

const DOM = tinymce.DOM;

export const create = (data: Data): HTMLImageElement | HTMLElement => {
  const image = document.createElement("img");
  image.src = data.src;
  image.alt = data.alt;
  if (data.size) {
    image.width = Number(data.size.width);
    image.height = Number(data.size.height);
  }

  if (data.caption) {
    const figure = DOM.create("figure", { class: "image" });
    figure.appendChild(image);
    figure.appendChild(DOM.create("figcaption", {}, data.caption));

    return figure;
  } else {
    return image;
  }
};

const insertImageAtCaret = (editor: Editor, data: Data): void => {
  const elm = create(data);
  //editor.dom.setAttrib(elm, "data-geo-id", "__geonew");
  editor.focus();
  editor.selection.setContent(elm.outerHTML);
  // const insertedElm = editor.dom.select('*[data-geo-id="__geonew"]')[0];
  // editor.dom.setAttrib(insertedElm, "data-geo-id", null);
};

export const insertOrUpdateImage = (
  editor: Editor,
  partialData: Partial<Data>
): void => {
  const image = getSelectedImage(editor);
  if (image) {
    const selectedImageData = read(editor, image);
    const data = {
      ...selectedImageData,
      ...partialData,
    };
    // const sanitizedData = sanitizeImageData(editor, data);
    if (data.src) {
      writeImageDataToSelection(editor, data);
    } else {
      deleteImage(editor, image);
    }
  } else if (partialData.src) {
    insertImageAtCaret(editor, {
      ...defaultData(),
      ...partialData,
    });
  }
};
