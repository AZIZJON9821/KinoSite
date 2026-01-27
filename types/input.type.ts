import React from "react";
import { type Control } from "react-hook-form";

export type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "checkbox"

export enum InputVariant {
  input = "input",
  select = "select",
}


export interface InputProps {
  name: string;
  type?: InputType;
  variant: InputVariant;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  defaultValue?: string;
  id?: string;
  style?: React.CSSProperties;
  options?: { label: string; value: string | number }[];
  control: Control<any>;
  onChange?: () => void;
  onInput?: () => void;
}
