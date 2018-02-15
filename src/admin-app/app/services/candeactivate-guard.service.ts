import { Injectable } from '@angular/core';
import { CanDeactivate, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
// import { ConfirmService } from './confirm-modal.service';

export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
    constructor(
        // private dialogService: ConfirmService
    ) { }

    canDeactivate(component: CanComponentDeactivate,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot) {
        const canLeave = true;

        // If the user wants to go to home component
        // if (nextState.url === '/') {
        //     canLeave = window.confirm("You have unsaved changes. Still want to go home?");
        // }
        return canLeave;

        // if (!component.canDeactivate) {
        //     return new Promise<boolean>(resolve => resolve(true));
        // }

        // const retValue = component.canDeactivate();

        // if (retValue instanceof Observable) {
        // return this.intercept(Observable.of(false));
        // } else {
        //     return retValue;
        // }
    }

    private intercept(observable: Observable<any>): Observable<any> {
        return observable
            .map((res) => {
                if (res === false) {
                    return new Promise(resolve => {
                        // this.dialogService.confirm({ title: 'Confirm', message: 'Are you sure you want to cancel the changes?' }).then(
                        //     () => {
                        // resolve(true);
                        // }, () => {
                        //     resolve(false);
                        // });
                    });
                } else {
                    return Observable.of(res);
                }
            });
    }
}
