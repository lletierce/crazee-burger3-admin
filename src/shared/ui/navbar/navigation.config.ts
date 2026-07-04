import { LuSearch, LuMapPin } from 'react-icons/lu';
import type { NavItem, SecondaryAction } from './navbar.types';

export const primaryNavItems: NavItem[] = [
  { label: 'Nos engagements', href: '/nos-engagements' },
  { label: 'Les Big Questions', href: '/les-big-questions' },
  { label: 'En famille', href: '/en-famille' },
  { label: 'Nos produits', href: '/nos-produits' },
  { label: 'Ligue 1', href: '/ligue-1' },
];

export const secondaryActions: SecondaryAction[] = [
  { label: 'Rechercher', href: '/recherche', icon: LuSearch },
  { label: 'Trouver un restaurant', href: '/trouver-un-restaurant', icon: LuMapPin },
];