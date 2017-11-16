import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit, OnDestroy, ComponentFactoryResolver, ViewChildren, QueryList } from '@angular/core';
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
export class ConversationalComponent implements OnInit, AfterViewInit, OnDestroy {
  conversations: Array<Conversation>;
  @ViewChild(cuiDirective) cuiDir: cuiDirective;
  @ViewChildren(cuiDirective) cuiDirs: QueryList<cuiDirective>;
  currentAddIndex: number = -1;
  subscription: any;
  interval: any;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private cservice: ConversationalService) { }

  ngOnInit() {
    this.conversations = new Array<Conversation>();
    this.cservice.addGreetings();
    this.conversations = this.cservice.conversations;
  }

  ngAfterViewInit() {
    // this.loadComponent();
    // this.getAds();
    this.loadConversations();
  }
  loadConversations() {
    this.cuiDirs.forEach((item, index) => {
      let conversation = this.conversations[index];

      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(conversation.component);
      let viewContainerRef = item.viewContainerRef;
      viewContainerRef.clear();
  
      let componentRef = viewContainerRef.createComponent(componentFactory);
      (<CuiComponent>componentRef.instance).data = conversation.data;
  
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

}
