import { Editor, TinyMCE } from "tinymce";
import { Data } from "../types/plugin";

declare const tinymce: TinyMCE;

const DOM = tinymce.DOM;

export const create = (data: Data): HTMLImageElement | HTMLElement => {
  const image = document.createElement("img");
  image.src = data.src;
  image.alt = data.alt;
  // write(
  //   normalizeCss,
  //   {
  //     ...data,
  //     caption: false,
  //   },
  //   image
  // );
  // setAlt(image, data.alt, data.isDecorative);
  if (data.caption) {
    const figure = DOM.create("figure", { class: "image" });
    figure.appendChild(image);
    figure.appendChild(DOM.create("figcaption", {}, data.caption));

    return figure;
  } else {
    return image;
  }
};

export const insertImageAtCaret = (editor: Editor, data: Data): void => {
  const elm = create(data);
  //editor.dom.setAttrib(elm, "data-geo-id", "__geonew");
  editor.focus();
  editor.selection.setContent(elm.outerHTML);
  // const insertedElm = editor.dom.select('*[data-geo-id="__geonew"]')[0];
  // editor.dom.setAttrib(insertedElm, "data-geo-id", null);
};
