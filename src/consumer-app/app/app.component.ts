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
    }
}
