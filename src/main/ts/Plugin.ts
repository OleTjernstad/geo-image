import { Editor, TinyMCE } from "tinymce";
import { Dialog } from "./core/dialog";
import { insertImageAtCaret } from "./core/element";

declare const tinymce: TinyMCE;

const register = (editor: Editor) => {
  editor.ui.registry.addToggleButton("geo-image", {
    icon: "image",
    tooltip: "Insert/edit image",
    onAction: Dialog(editor).open,
  });
};

const register$1 = (editor: Editor) => {
  editor.addCommand("geoUpdateImage", (_ui, data) => {
    editor.undoManager.transact(() => insertImageAtCaret(editor, data));
  });
};

export default (): void => {
  tinymce.PluginManager.add("geo-image", (editor) => {
    register(editor);
    register$1(editor);
  });
};
