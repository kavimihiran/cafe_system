import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  icon: string;
  role: string;
}

const MENUITEMS = [
  { state: 'dashboard', name: 'Dashboard', icon: 'dashboard', role: '' },
  {
    state: 'category',
    name: 'Manage Category',
    icon: 'category',
    role: '',
  },
  {
    state: 'product',
    name: 'Manage product',
    icon: 'inventory_2',
    role: '',
  },
];

@Injectable()
export class MenuItems {
  getMenuItems(): Menu[] {
    return MENUITEMS;
  }
}
