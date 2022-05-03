export interface Data {
  src: string;
  alt: string;
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
