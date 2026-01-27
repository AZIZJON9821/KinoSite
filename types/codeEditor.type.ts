import React from "react";

import { Control } from "react-hook-form";

export interface CodeEditorType {
  style?: React.CSSProperties;
  name:string;
  control: Control<any>;
  id?:string;  
  onChange?: () => void;
  onInput?: () => void;
}
