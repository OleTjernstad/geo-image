export const imageSize = (
  url: string
): Promise<{
  width: string;
  height: string;
}> => {
  return getImageSize(url).then((dimensions) => ({
    width: String(dimensions.width),
    height: String(dimensions.height),
  }));
};

const getImageSize = (
  url: string
): Promise<{
  width: string;
  height: string;
}> =>
  new Promise((callback) => {
    const img = document.createElement("img");
    const done = (dimensions) => {
      img.onload = img.onerror = null;
      if (img.parentNode) {
        img.parentNode.removeChild(img);
      }
      callback(dimensions);
    };
    img.onload = () => {
      const width = parseIntAndGetMax(img.width, img.clientWidth);
      const height = parseIntAndGetMax(img.height, img.clientHeight);
      const dimensions = {
        width,
        height,
      };
      done(Promise.resolve(dimensions));
    };
    img.onerror = () => {
      done(Promise.reject(`Failed to get image dimensions for: ${url}`));
    };
    const style = img.style;
    style.visibility = "hidden";
    style.position = "fixed";
    style.bottom = style.left = "0px";
    style.width = style.height = "auto";
    document.body.appendChild(img);
    img.src = url;
  });

const parseIntAndGetMax = (val1: string | number, val2: string | number) =>
  Math.max(parseInt(String(val1), 10), parseInt(String(val2), 10));

export const isFigure = (elm: Element): boolean => elm.nodeName === "FIGURE";
export const isImage = (elm: Element): boolean => elm.nodeName === "IMG";
