declare module "jspdf" {
  export default class jsPDF {
    constructor(
      orientation?: "p" | "portrait" | "l" | "landscape",
      unit?: string,
      format?: string
    );
    internal: {
      pageSize: {
        getWidth: () => number;
        getHeight: () => number;
      };
    };
    addImage: (
      imageData: any,
      format: string,
      x: number,
      y: number,
      width: number,
      height: number
    ) => void;
    save: (filename: string) => void;
  }
}

declare module "html2canvas" {
  interface Html2CanvasOptions {
    scale?: number;
    useCORS?: boolean;
    logging?: boolean;
    [key: string]: any;
  }

  export default function html2canvas(
    element: HTMLElement,
    options?: Html2CanvasOptions
  ): Promise<HTMLCanvasElement>;
}
