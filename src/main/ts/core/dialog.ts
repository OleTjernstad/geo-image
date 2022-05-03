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
            type: "bar", // component type
            items: [
              {
                type: "button", // component type
                icon: "align-left",
                text: "Venstre",
                buttonType: "toolbar",
                name: "left",
                enabled: true,
              },
              {
                type: "button", // component type
                icon: "align-left",
                text: "Venstre",
                buttonType: "toolbar",
                name: "center",
                enabled: true,
              },
              {
                type: "button", // component type
                icon: "align-left",
                text: "Venstre",
                buttonType: "toolbar",
                name: "right",
                enabled: true,
              },
            ], // array of panel components
          },
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
          {
            type: "input",
            name: "caption",
            label: "Tekst under bildet (caption)",
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
        editor.execCommand("geoUpdateImage", false, api.getData());
        api.close();
      },
      onChange: (api) => {
        console.log(api);
      },
    });
  };
  return { open };
};
