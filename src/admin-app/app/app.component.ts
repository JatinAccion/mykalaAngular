import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  hideNav = false;
  constructor(private router: Router) {

    // router.events.subscribe((event: Event) => {

    //   if (event instanceof NavigationStart) {
    //     // Show loading indicator
    //     if (!confirm('are you sure')) {
    //       (event as NavigationError).preventDefault();
    //     }
    //   }

    //   if (event instanceof NavigationEnd) {
    //     // Hide loading indicator
    //   }

    //   if (event instanceof NavigationError) {
    //     // Hide loading indicator
    //     // Present error to user
    //     console.log(event.error);
    //   }
    // });

  }
  ngOnInit() {
    // tslint:disable-next-line:no-unused-expression
    // this.disableBack(window);
  }

  disableBack(global) {

    if (typeof (global) === 'undefined') {
      throw new Error('window is undefined');
    }

    const _hash = '!';
    const noBackPlease = function () {
      global.location.href += '#';

      // making sure we have the fruit available for juice (^__^)
      global.setTimeout(function () {
        global.location.href += '!';
      }, 50);
    };

    global.onhashchange = function () {
      if (global.location.hash !== _hash) {
        global.location.hash = _hash;
      }
    };

    global.onload = function () {
      noBackPlease();

      // disables backspace on page except on input fields and textarea..
      document.body.onkeydown = function (e) {
        const elm = e.type.toLowerCase();
        if (e.which === 8 && (elm !== 'input' && elm !== 'textarea')) {
          e.preventDefault();
        }
        // stopping event bubbling up the DOM tree..
        e.stopPropagation();
      };
    };
  }
}