import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[cui]',
})
export class cuiDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
