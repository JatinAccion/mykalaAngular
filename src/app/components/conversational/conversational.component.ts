// tslint:disable-next-line:max-line-length
import { Component, OnChanges, OnInit, ViewEncapsulation, AfterViewChecked, ViewChild, AfterViewInit, OnDestroy, ComponentFactoryResolver, ViewChildren, AfterContentInit, QueryList, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { ConversationalService } from './conversational.service';
import { Conversation, ConversationInput } from '../../models/conversation';
import { cuiDirective } from './cui.directive';
import { CuiComponent, MsgDirection } from './cui.interface';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';



@Component({
  selector: 'app-conversational',
  templateUrl: './conversational.component.html',
  styleUrls: ['./conversational.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ConversationalComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild(cuiDirective) cuiDir: cuiDirective;
  inputComponent: ConversationInput;
  subscription: Subscription;

  conversations: Array<Conversation>;
  conversation: Conversation = new Conversation(MsgDirection.In, 'home');

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
    private cservice: ConversationalService,
    private cd: ChangeDetectorRef) {
    this.subscription = this.cservice.getComponent().subscribe(data => {
      this.inputComponent = data;
      this.loadInputComponent();
    });
  }

  ngOnInit() {
    this.conversations = new Array<Conversation>();
    this.cservice.initializeConversation();
    this.conversations = this.cservice.conversations;
  }

  ngAfterViewChecked() { this.cd.detectChanges(); }

  ngOnDestroy() { }

  loadInputComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.inputComponent.component);
    const viewContainerRef = this.cuiDir.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<CuiComponent>componentRef.instance).data = this.inputComponent.data;
    (<CuiComponent>componentRef.instance).clicked.subscribe((msg) => {
      this.conversation = msg;
      this.addConversation();
    });
  }
  addConversation() {
    this.cservice.addConversation(this.conversation);
    setTimeout(() => {
      this.conversations = null;
      this.conversations = this.cservice.conversations;
    }, 1);
  }
}
