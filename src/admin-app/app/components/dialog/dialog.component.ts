import { Component, OnInit, ViewEncapsulation, ViewChild, TemplateRef } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DialogComponent implements OnInit {
  message: string;
  title: string;
  subscription: Subscription;
  closeResult: string;
  @ViewChild('content') content: TemplateRef<any>;
  constructor(public core: CoreService, private modalService: NgbModal) { }

  ngOnInit() {
    this.subscription = this.core.dialogVisible.subscribe(p => {
      this.title = p.title;
      this.message = p.message;
      this.open(this.content);
    });
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.core.setDialogResponse(result);
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.core.setDialogResponse('no');
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
