import { Editor } from "tinymce";
import { DialogChangeApi, isData } from "../types/plugin";
import { imageSize, readImageDataFromSelection } from "./utils";

export const Dialog = (editor: Editor): { open: () => void } => {
  const open = () => {
    const image = readImageDataFromSelection(editor);
    editor.windowManager.open({
      title: "Sett inn bilde",
      size: "normal",
      body: {
        type: "panel",
        items: [
          {
            type: "input",
            name: "src",
            label: "Url til bildet",
          },
          {
            type: "input",
            name: "alt",
            label: "Beskrivelse av bildet (alt)",
          },
          // {
          //   type: "input",
          //   name: "caption",
          //   label: "Tekst under bildet (caption)",
          // },
          {
            type: "sizeinput", // component type
            name: "size", // identifier
            label: "Størrelse",
            enabled: true, // enabled state
          },
        ],
      },
      initialData: image,
      buttons: [
        {
          type: "cancel",
          name: "cancel",
          text: "Avbryt",
        },
        {
          type: "submit",
          name: "save",
          text: "Lagre",
          primary: true,
        },
      ],
      onSubmit: (api) => {
        editor.execCommand("geoUpdateImage", false, api.getData());
        api.close();
      },
      onChange: (api, e) => {
        switch (e.name) {
          case "src":
            srcChange(api);
            break;

          default:
            break;
        }
      },
    });
  };
  return { open };
};

function srcChange(api: DialogChangeApi): void {
  const data = api.getData();
  if (isData(data)) {
    imageSize(data.src).then((size) => {
      api.setData({ size });
    });
  }
}
