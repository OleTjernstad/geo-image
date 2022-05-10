import { Editor, TinyMCE } from "tinymce";
import { Dialog } from "./core/dialog";
import { insertOrUpdateImage } from "./core/element";

import { isFigure, isImage } from "./core/utils";

declare const tinymce: TinyMCE;

const register = (editor: Editor) => {
  editor.ui.registry.addToggleButton("geo-image", {
    icon: "image",
    tooltip: "Insert/edit image",
    onAction: Dialog(editor).open,
  });

  editor.ui.registry.addMenuItem("image", {
    icon: "image",
    text: "Bilde...",
    onAction: Dialog(editor).open,
  });

  editor.ui.registry.addContextMenu("image", {
    update: (element) =>
      isFigure(element) || isImage(element) ? ["image"] : [],
  });
};

const register$1 = (editor: Editor) => {
  editor.addCommand("geoUpdateImage", (_ui, data) => {
    editor.undoManager.transact(() => insertOrUpdateImage(editor, data));
  });
  editor.addCommand("alertInvalidUrl", () => {
    editor.notificationManager.open({
      text: "Geocaching.com begrenser steder man kan bruke bilder ifra. Anbefaler at bilder lastes opp i cache beskrivelsen",
      type: "warning",
    });
  });
};

export default (): void => {
  tinymce.PluginManager.add("geo-image", (editor) => {
    register(editor);
    register$1(editor);
  });
};
