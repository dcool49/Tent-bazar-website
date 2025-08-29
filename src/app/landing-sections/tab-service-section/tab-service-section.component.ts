import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';   // <-- import this for ngClass/ngIf

@Component({
  selector: 'app-tab-service-section',
  imports: [
    CommonModule
  ],
  templateUrl: './tab-service-section.component.html',
  styleUrl: './tab-service-section.component.scss'
})
export class TabServiceSectionComponent {
 tabs = [
    { id: 'taber1', label: 'Decorative Sofa' },
    { id: 'taber2', label: 'Top Celling' },
    { id: 'taber3', label: 'Flower Decoration' },
    { id: 'taber4', label: 'Weds Background' }
  ];
  activeTab = 'taber1';

  setActive(tabId: string) {
    this.activeTab = tabId;
  }
}
