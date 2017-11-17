// tslint:disable-next-line:max-line-length
import { Component, OnChanges, OnInit, ViewEncapsulation, AfterViewChecked, ViewChild, AfterViewInit, OnDestroy, ComponentFactoryResolver, ViewChildren, AfterContentInit, QueryList, ChangeDetectorRef } from '@angular/core';
import { ConversationalService } from './conversational.service';
import { Conversation } from '../../models/conversation';
import { cuiDirective } from './cui.directive';
import { CuiComponent } from './cui.interface';



@Component({
  selector: 'app-conversational',
  templateUrl: './conversational.component.html',
  styleUrls: ['./conversational.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ConversationalComponent implements OnInit, OnDestroy {
  dummy: boolean;
  conversations: Array<Conversation>;
  @ViewChild(cuiDirective) cuiDir: cuiDirective;
  @ViewChildren(cuiDirective) cuiDirs: QueryList<cuiDirective>;
  currentAddIndex: number = -1;
  subscription: any;
  interval: any;
  msgType: string = "home";
  constructor(private componentFactoryResolver: ComponentFactoryResolver, private cservice: ConversationalService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.conversations = new Array<Conversation>();
    this.cservice.addGreetings();
    this.conversations = this.cservice.conversations;
  }

  ngAfterViewInit() {
    this.loadConversations(true);
    // this.cuiDirs.changes.subscribe(() => {
    //   if (this.cuiDirs)
    //     this.loadConversations(true);
    // });
    // if (this.dummy) {
    //   this.dummy = !this.dummy;
    //   this.cservice.addComponent("dummy");
    // }
    // this.cd.detectChanges();
  }
  ngAfterViewChecked(){
    // this.loadConversations(true);
  }
  loadConversations(last: boolean) {
    this.cuiDirs.forEach((item, index) => {
      if (last || this.cuiDirs.length - 1 === index) {
        let conversation = this.conversations[index];

        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(conversation.component);
        let viewContainerRef = item.viewContainerRef;
        viewContainerRef.clear();

        let componentRef = viewContainerRef.createComponent(componentFactory);
        (<CuiComponent>componentRef.instance).data = conversation.data;
      }
    });
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
  loadComponent() {
    this.currentAddIndex = (this.currentAddIndex + 1) % this.conversations.length;
    let conversation = this.conversations[this.currentAddIndex];

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(conversation.component);

    let viewContainerRef = this.cuiDir.viewContainerRef;
    viewContainerRef.clear();

    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<CuiComponent>componentRef.instance).data = conversation.data;
  }

  getAds() {
    this.interval = setInterval(() => {
      this.loadComponent();
    }, 3000);
  }
  add() {
    this.cservice.addComponent(this.msgType);
     this.loadConversations(false);
    //  this.cservice.addComponent("dummy");
    //   if (this.dummy) {
    //   this.dummy = !this.dummy;
    // }
  }
  refresh(){
    console.log(this.cuiDirs.length);
  }

}
