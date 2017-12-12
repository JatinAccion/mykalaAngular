import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ConsumerInterestService } from '../../services/consumer-interest.service';
import { userMessages } from './interest.message';
import { CoreService } from '../../services/core.service';
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

  constructor(private interest: ConsumerInterestService, private core: CoreService) { }

  ngOnInit() {
    this.loadInterest = true;
    this.core.show();
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
    this.postInterest.consumerId = JSON.parse(window.localStorage['userInfo']).userid;
    this.postInterest.consumerInterest = this.getInterest;
    console.log(this.postInterest)
    this.interest.postInterest(this.postInterest).subscribe(res => {
      this.loader = false;
      this.resStatus = true;
      this.resMessage = userMessages.success;
      this.resType = "success";
      console.log(res);
    }, err => {
      this.loader = false;
      this.resStatus = true;
      this.resMessage = userMessages.fail;
      this.resType = "fail";
      console.log(err);
    });
  }

}
