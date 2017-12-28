// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { Retailer } from '../../../../../models/retailer';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
import { nameValue, IdNameParent } from '../../../../../models/nameValue';

import { RetialerService } from '../retialer.service';
import { IAlert } from '../../../../../models/IAlert';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { inputValidations } from './messages';

@Component({
  selector: 'app-retailer-add-products',
  templateUrl: './retailer-add-products.component.html',
  styleUrls: ['./../retailer.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerAddProductsComponent implements OnInit {
  @Input() retailerId: number;
  @Output() SaveData = new EventEmitter<any>();
  places = new Array<IdNameParent>();
  selectedPlaces = new Array<IdNameParent>();
  allCategories = new Array<IdNameParent>();
  categories = new Array<IdNameParent>();
  selectedCategories = new Array<IdNameParent>();
  allSubCategories = new Array<IdNameParent>();
  subCategories = new Array<IdNameParent>();
  selectedSubCategories = new Array<IdNameParent>();
  allProductTypes = new Array<IdNameParent>();
  productTypes = new Array<IdNameParent>();
  selectedProductTypes = new Array<IdNameParent>();

  placesSettings = {};
  categorySettings = {};
  subCategorySettings = {};
  productTypeSettings = {};
  FG1: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private retialerService: RetialerService,
    private validatorExt: ValidatorExt
  ) {
  }
  ngOnInit() {
    this.FG1 = this.formBuilder.group({
      name: '',
      email: ['', Validators.required],
      place: [[], Validators.required],
      category: [[], Validators.required],
      subCategory: [[], Validators.required],
      productType: [[], Validators.required],
    });

    this.places = [
      new IdNameParent('1', 'Home & Garden (546)', '', ''),
      new IdNameParent('2', 'Electronics', '', ''),
      new IdNameParent('3', 'Health & Fitness (321)', '', ''),
      new IdNameParent('4', 'Travel', '', ''),
    ];
    this.selectedPlaces = [
      new IdNameParent('2', 'Electronics', '', ''),
    ];
    this.placesSettings = {
      singleSelection: false,
      text: 'Select Places',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      searchPlaceholderText: 'Search Fields',
      enableSearchFilter: true,
      badgeShowLimit: 5,
      classes: 'myclass custom-class'
    };
    this.allCategories = [
      new IdNameParent('1', 'Furniture & Patio (162)', '1', 'Home & Garden (546)'),
      new IdNameParent('2', 'Lighting (27)', '1', 'Home & Garden (546)'),
      new IdNameParent('3', 'Lawn & Garden (43)', '1', 'Home & Garden (546)'),
      new IdNameParent('4', 'Supplies (50)', '1', 'Home & Garden (546)'),
      new IdNameParent('5', 'Bedding & Linens (13)', '1', 'Home & Garden (546)'),
      new IdNameParent('6', 'Emergency & Safety (11)', '1', 'Home & Garden (546)'),

      new IdNameParent('7', 'TV and Home Theater (27)', '2', 'Electronics (546)'),
      new IdNameParent('8', 'Movies & Gaming (27)', '2', 'Electronics (546)'),
      new IdNameParent('9', 'Computers (27)', '2', 'Electronics (546)'),
      new IdNameParent('10', 'Tablets (27)', '2', 'Electronics (546)'),
      new IdNameParent('11', 'Phones (27)', '2', 'Electronics (546)'),
      new IdNameParent('12', 'GPS Navigation (27)', '2', 'Electronics (546)'),
      new IdNameParent('13', 'Cameras & Camcorders (27)', '2', 'Electronics (546)'),
      new IdNameParent('14', 'Wearable Technology (27)', '2', 'Electronics (546)'),
      new IdNameParent('15', 'Audio (27)', '2', 'Electronics (546)'),
      new IdNameParent('16', 'Home Automation & Security (27)', '2', 'Electronics (546)'),
      new IdNameParent('17', 'Automotive (27)', '2', 'Electronics (546)'),

    ];
    this.allSubCategories = [
      new IdNameParent('1', 'TVs', '7', 'TV and Home Theater (27)'),
      new IdNameParent('2', 'TV Mounts', '7', 'TV and Home Theater (27)'),
      new IdNameParent('3', 'Blu-Ray & DVD Players', '7', 'TV and Home Theater (27)'),
      new IdNameParent('4', 'Projectors', '7', 'TV and Home Theater (27)'),
      new IdNameParent('5', 'Media Streaming', '7', 'TV and Home Theater (27)'),
      new IdNameParent('6', 'Home Audio', '7', 'TV and Home Theater (27)'),
      new IdNameParent('7', 'Home Theater Accessories', '7', 'TV and Home Theater (27)'),
      new IdNameParent('8', 'Headphones', '15', 'Audio (27)'),
      new IdNameParent('9', 'MP3 Players', '15', 'Audio (27)'),
      new IdNameParent('10', 'Speakers', '15', 'Audio (27)'),
      new IdNameParent('11', 'Receivers & Amps', '15', 'Audio (27)'),
      new IdNameParent('12', 'Docks and Radios', '15', 'Audio (27)'),
      new IdNameParent('13', 'CDs', '15', 'Audio (27)'),
      new IdNameParent('14', 'Vinyl', '15', 'Audio (27)'),
      new IdNameParent('15', 'Digital Music', '15', 'Audio (27)'),
      new IdNameParent('16', 'Accessories', '15', 'Audio (27)'),

      new IdNameParent('17', 'GPS', '17', 'Automotive (27)'),
      new IdNameParent('18', 'Amplifiers', '17', 'Automotive (27)'),
      new IdNameParent('19', 'Receivers', '17', 'Automotive (27)'),
      new IdNameParent('20', 'Subwoofers & Enclosures', '17', 'Automotive (27)'),
      new IdNameParent('21', 'Speakers', '17', 'Automotive (27)'),
      new IdNameParent('22', 'Satellite Radio', '17', 'Automotive (27)'),
      new IdNameParent('23', 'Back-up & Dash Cameras', '17', 'Automotive (27)'),
      new IdNameParent('24', 'Radar Detectors', '17', 'Automotive (27)'),
      new IdNameParent('25', 'Remote Start', '17', 'Automotive (27)'),
      new IdNameParent('26', 'Smartphone & MP3 Connectors', '17', 'Automotive (27)'),
      new IdNameParent('27', 'Bluetooth Car Kits', '17', 'Automotive (27)'),
      new IdNameParent('28', 'Security Systems', '17', 'Automotive (27)'),
      new IdNameParent('29', 'Breathalyzers', '17', 'Automotive (27)'),

    ];

    this.categorySettings = {
      singleSelection: false,
      text: 'Select Categories',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      searchPlaceholderText: 'Search Fields',
      enableSearchFilter: true,
      badgeShowLimit: 5,
      groupBy: 'parent',
      classes: 'myclass custom-class'
    };
    this.subCategorySettings = {
      singleSelection: false,
      text: 'Select Sub Categories',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      searchPlaceholderText: 'Search Fields',
      enableSearchFilter: true,
      badgeShowLimit: 5,
      groupBy: 'parent',
      classes: 'myclass custom-class'
    };
    this.productTypeSettings = {
      singleSelection: false,
      text: 'Select Types',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      searchPlaceholderText: 'Search Fields',
      enableSearchFilter: true,
      badgeShowLimit: 5,
      groupBy: 'parent',
      classes: 'myclass custom-class'
    };
  }
  refreshCategories() {
    if (this.selectedPlaces.length > 0) {
      this.categories = [];
      this.selectedPlaces.forEach(p => {
        return this.allCategories.filter(c => c.parentId === p.id).forEach(res => this.categories.push(res));
      });
    }
  }
  onPlaceSelect(item: any) { this.refreshCategories(); }
  onPlaceDeSelect(item: any) { this.refreshCategories(); }
  onPlaceSelectAll(items: any) { this.refreshCategories(); }
  onPlaceDeSelectAll(items: any) { this.refreshCategories(); }

  refreshSubCategories() {
    if (this.selectedCategories.length > 0) {
      this.subCategories = [];
      this.selectedCategories.forEach(p => {
        return this.allSubCategories.filter(c => c.parentId === p.id).forEach(res => this.subCategories.push(res));
      });
    }
  }
  onCategoryItemSelect(item: any) { this.refreshSubCategories(); }
  onCategoryItemDeSelect(item: any) { this.refreshSubCategories(); }
  onCategorySelectAll(items: any) { this.refreshSubCategories(); }
  onCategoryDeSelectAll(items: any) { this.refreshSubCategories(); }

  refreshProductTypes() {
    if (this.selectedSubCategories.length > 0) {
      this.productTypes = [];
      this.selectedSubCategories.forEach(p => {
        return this.allSubCategories.filter(c => c.parentId === p.id).forEach(res => this.productTypes.push(res));
      });
    }
  }
  onSubCategoryItemSelect(item: any) { this.refreshProductTypes(); }
  onSubCategoryItemDeSelect(item: any) { this.refreshProductTypes(); }
  onSubCategorySelectAll(items: any) { this.refreshProductTypes(); }
  onSubCategoryDeSelectAll(items: any) { this.refreshProductTypes(); }



}
