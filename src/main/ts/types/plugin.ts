export interface Data {
  src: string;
  alt: string;
  title: string;
  class: string;
  style: string;
  hspace: string;
  vspace: string;
  border: string;
  borderStyle: string;
  isDecorative: boolean;
  caption?: string;
  size: {
    width: string;
    height: string;
  };
}

export interface DialogChangeApi {
  getData: () => unknown;
  setData: (data: Partial<unknown>) => void;
  setEnabled: (name: string, state: boolean) => void;
  focus: (name: string) => void;
  showTab: (name: string) => void;
  redial: (nu: unknown) => void;
  block: (msg: string) => void;
  unblock: () => void;
  close: () => void;
}

export function isData(obj: unknown): obj is Data {
  return (
    (obj as Data).src !== undefined && typeof (obj as Data).src === "string"
  );
}
