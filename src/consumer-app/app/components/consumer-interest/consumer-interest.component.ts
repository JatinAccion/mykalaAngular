import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ConsumerInterestService } from '../../services/consumer-interest.service';
import { userMessages } from './interest.message';
import { CoreService } from '../../services/core.service';
import { Router, RouterOutlet } from '@angular/router';
import { PostInterest, ConsumerInterest } from '../../../../models/consumer-interest';

@Component({
  selector: 'app-consumer-interest',
  templateUrl: './consumer-interest.component.html',
  styleUrls: ['./consumer-interest.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ConsumerInterestComponent implements OnInit {
  interestImages: any;
  getInterest = [];
  postInterest = new PostInterest;
  selectImg: boolean;
  loader: boolean;
  loadInterest: boolean;
  @Input() hideNavi: string;
  consumerId: any;
  resStatus: boolean;
  resMessage: string;
  resType: string;
  headerMessage: string;

  constructor(private routerOutlet: RouterOutlet, private router: Router, private interest: ConsumerInterestService, private core: CoreService) { }

  ngOnInit() {
    /**Clearing the Logged In Session */
    localStorage.removeItem('token');
    this.core.clearUser();
    this.core.hideUserInfo(true);
    /**Clearing the Logged In Session */
    this.core.headerScroll();
    this.core.searchMsgToggle();
    this.core.pageLabel();
    this.loadInterest = true;
    this.headerMessage = 'Almost done! Just one more step to go.';
    this.core.show(this.headerMessage);
    this.interest.getInterest().subscribe(res => {
      this.loadInterest = false;
      this.interestImages = res;
    });
  }

  selectInterest(e, obj) {
    obj.selectImg = !obj.selectImg;
    this.getInterest.push(new ConsumerInterest(e.currentTarget.id, e.currentTarget.title));
    this.getInterest = this.getInterest.filter((elem, index, self) => self.findIndex((img) => {
      return (img.consumerInterestsImageId === elem.consumerInterestsImageId && img.consumerInterestsImageName === elem.consumerInterestsImageName)
    }) === index);

    if (obj.selectImg == false) {
      for (var i = 0; i < this.getInterest.length; i++) {
        if (this.getInterest[i].consumerInterestsImageId == obj.consumerInterestsImageId) this.getInterest.splice(i, 1)
      }
    }
  }

  saveInterest() {
    this.loader = true;
    this.resStatus = false;
    this.postInterest.consumerId = JSON.parse(window.localStorage['userInfo']).userId;
    this.postInterest.consumerInterest = this.getInterest;
    console.log(this.postInterest)
    this.interest.postInterest(this.postInterest).subscribe(res => {
      console.log(res);
      this.loader = false;
      this.resStatus = true;
      this.resType = "success";
      this.resMessage = userMessages.success;
      setTimeout(() => {
        if (this.routerOutlet.isActivated) this.routerOutlet.deactivate();
        this.router.navigateByUrl('/home');
      }, 2000);
    }, err => {
      this.loader = false;
      this.resStatus = true;
      this.resType = "fail";
      this.resMessage = userMessages.fail;
      console.log(err);
    });
  }

}
