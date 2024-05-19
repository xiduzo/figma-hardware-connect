export enum FIGMA_VARIABLE_TYPE {
  COLOR = "COLOR",
  STRING = "STRING",
  NUMBER = "FLOAT",
  BOOLEAN = "BOOLEAN",
}

export type Link = {
  topic: string;
  name: string;
  id?: string;
  type: FIGMA_VARIABLE_TYPE;
};
