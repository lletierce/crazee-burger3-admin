import type { IconType } from 'react-icons';

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface SecondaryAction {
  label: string;
  href: string;
  icon: IconType;
}