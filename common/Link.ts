export enum FIGMA_VARIABLE_TYPE {
  COLOR = "COLOR",
  STRING = "STRING",
  FLOAT = "FLOAT",
  BOOLEAN = "BOOLEAN",
}

export function figmaVariableTypeToString(type: FIGMA_VARIABLE_TYPE) {
  switch (type) {
    case FIGMA_VARIABLE_TYPE.FLOAT:
      return "number";
    case FIGMA_VARIABLE_TYPE.COLOR:
    case FIGMA_VARIABLE_TYPE.STRING:
    case FIGMA_VARIABLE_TYPE.BOOLEAN:
    default:
      return type.toLowerCase();
  }
}

export type Link = {
  topic: string;
  name: string;
  id?: string;
  type: FIGMA_VARIABLE_TYPE;
};
