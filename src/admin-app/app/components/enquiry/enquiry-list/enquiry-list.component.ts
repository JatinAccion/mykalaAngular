import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Enquiry } from '../../../../../models/enquiry';
import { EnquiryService } from '../enquiry.service';

@Component({
  selector: 'app-enquiry-list',
  templateUrl: './enquiry-list.component.html',
  styleUrls: ['./../enquiry.css'],
  encapsulation: ViewEncapsulation.None
})
export class EnquiryListComponent implements OnInit {
  enquirys: Array<Enquiry>;
  isCollapsed = true;
  constructor(private enquiryService: EnquiryService) {
    this.enquirys = new Array<Enquiry>();
  }

  ngOnInit() {
    this.getData();

  }
  getData() {
    this.enquiryService.get(null).subscribe((res) => {
      return res.forEach(obj => { this.enquirys.push(new Enquiry(obj)); });
    });
  }
}
