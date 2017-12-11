import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ConsumerInterestService } from '../../services/consumer-interest.service';
import { userMessages } from './interest.message';
import { CoreService } from '../../services/core.service';

@Component({
  selector: 'app-consumer-interest',
  templateUrl: './consumer-interest.component.html',
  styleUrls: ['./consumer-interest.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ConsumerInterestComponent implements OnInit {
  interestImages: any;
  getInterest = [];
  selectImg: boolean;
  loader: boolean;
  @Input() hideNavi: string;

  constructor(private interest: ConsumerInterestService, private core: CoreService) { }

  ngOnInit() {
    this.core.show();
    this.interest.getInterest().subscribe(res => {
      this.interestImages = res;
    });
  }

  selectInterest(e, obj) {
    obj.selectImg = !obj.selectImg;
    this.getInterest.push({
      "id": e.currentTarget.id,
      "value": e.currentTarget.title
    });

    this.getInterest = this.getInterest.filter((elem, index, self) => self.findIndex((img) => {
      return (img.id === elem.id && img.value === elem.value)
    }) === index);

    if (obj.selectImg == false) {
      for (var i = 0; i < this.getInterest.length; i++) {
        if (this.getInterest[i].id == obj.id) this.getInterest.splice(i, 1)
      }
    }
  }

  saveInterest() {
    console.log(this.getInterest);
    this.loader = true;
  }

}
