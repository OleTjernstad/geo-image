import { Editor } from "tinymce";

export const Dialog = (editor: Editor): { open: () => void } => {
  const open = () => {
    editor.windowManager.open({
      title: "Sett inn bilde",
      size: "normal",
      body: {
        type: "panel",
        items: [
          {
            type: "input",
            name: "imgurl",
            label: "Url til bildet",
          },
        ],
      },
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
        console.log(api.getData());
      },
    });
  };
  return { open };
};
