import { Editor, TinyMCE } from "tinymce";
import { Dialog } from "./core/dialog";

declare const tinymce: TinyMCE;

const register = (editor: Editor) => {
  editor.ui.registry.addToggleButton("geo-image", {
    icon: "image",
    tooltip: "Insert/edit image",
    onAction: Dialog(editor).open,
  });
};

export default (): void => {
  tinymce.PluginManager.add("geo-image", (editor) => {
    register(editor);
  });
};
