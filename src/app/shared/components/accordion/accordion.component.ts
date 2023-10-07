import { Component, Input } from '@angular/core';

export interface AccordionData {
  title: string;
  description: string;
  actions: AccordionAction[];
}

export interface AccordionAction {
  text: string;
  event: () => void;
}

@Component({
  selector: 'newtone-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent {
  @Input() data: AccordionData[] | undefined;
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
}
