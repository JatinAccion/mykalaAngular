// tslint:disable-next-line:max-line-length
import { Component, OnChanges, OnInit, ViewEncapsulation, AfterViewChecked, ViewChild, AfterViewInit, OnDestroy, ComponentFactoryResolver, ViewChildren, AfterContentInit, QueryList, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { ConversationalService } from './conversational.service';
import { Conversation } from '../../models/conversation';
import { cuiDirective } from './cui.directive';
import { CuiComponent } from './cui.interface';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';



@Component({
  selector: 'app-conversational',
  templateUrl: './conversational.component.html',
  styleUrls: ['./conversational.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ConversationalComponent implements OnInit, OnDestroy {
  dummy: boolean;
  @ViewChild(cuiDirective) cuiDir: cuiDirective;
  inputComponent: Conversation;
  subscription: Subscription;
  @ViewChildren(cuiDirective) cuiDirs: QueryList<cuiDirective>;
  conversations: Array<Conversation>;
  msgType: string = "home";
  // tslint:disable-next-line:max-line-length
  constructor(private componentFactoryResolver: ComponentFactoryResolver, private cservice: ConversationalService, private cd: ChangeDetectorRef) {
    this.subscription = this.cservice.getComponent().subscribe(data => {
      this.inputComponent = data;
      this.loadComponent();
    });
  }

  ngOnInit() {
    this.conversations = new Array<Conversation>();
    this.cservice.addGreetings();
    this.conversations = this.cservice.conversations;
  }

  ngAfterViewChecked() { this.cd.detectChanges(); }

  ngOnDestroy() { }
  loadComponent() {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.inputComponent.component);
    let viewContainerRef = this.cuiDir.viewContainerRef;
    viewContainerRef.clear();
    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<CuiComponent>componentRef.instance).data = this.inputComponent.data;
    (<CuiComponent>componentRef.instance).clicked.subscribe((msg) => {
      this.msgType = msg;
      this.add();
    });

  }


  add() {
    this.cservice.addComponent(this.msgType);
    setTimeout(() => {
      this.conversations = null;
      this.conversations = this.cservice.conversations;
    }, 1);
  }
}
