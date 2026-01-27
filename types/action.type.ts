import { ReactNode } from "react";

export type ActionType = 'light' | 'dark'

export interface ActionProps {
  className?: string;
  mode:ActionType;
  children:ReactNode;
  id?: string;
}