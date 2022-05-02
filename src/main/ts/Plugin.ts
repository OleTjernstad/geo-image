import { Editor, TinyMCE } from 'tinymce';

declare const tinymce: TinyMCE;

const setup = (editor: Editor, url: string): void => {
  editor.ui.registry.addButton('image-plugin', {
    text: 'image-plugin button',
    onAction: () => {
      editor.setContent('<p>content added from image-plugin</p>');
    }
  });
};

export default (): void => {
  tinymce.PluginManager.add('image-plugin', setup);
};
