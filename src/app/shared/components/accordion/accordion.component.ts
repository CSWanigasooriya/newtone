/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, Input } from '@angular/core';

export interface AccordionData {
  key: string;
  content: any[];
  actions: Partial<AccordionAction>[];
}

export interface AccordionAction {
  text: string;
  icon: string;
  event: () => void;
}

@Component({
  selector: 'newtone-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent {
  @Input() data!: AccordionData;
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  transformCamelCaseToWords(value: unknown) {
    return (value as string)
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }
}
