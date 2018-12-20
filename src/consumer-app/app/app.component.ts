import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var device;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'app';
    hideNav = false;
    acutalURL: string;

    constructor(private route: Router) { }

    ngOnInit() {
        document.addEventListener("deviceready", function() {
            console.log(device.platform);
        }, false);
        this.urlManipulation();
    }

    urlManipulation() {
        this.acutalURL = location.href;
        if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
            let customURL = `${'mykala://' + this.acutalURL}`
            location.replace(customURL);
        }
        else if ((navigator.userAgent.match(/android/i)) || (navigator.userAgent.match(/Android/i))) {
            let customURL = `${'mykala://' + this.acutalURL}`
            location.replace(customURL);
        }
        else {
            this.route.navigateByUrl(this.acutalURL);
        }
        return false;
    }
}
