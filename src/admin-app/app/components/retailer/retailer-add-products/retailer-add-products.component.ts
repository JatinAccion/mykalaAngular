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
import { ProductService } from '../../product/product.service';

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
    private productService: ProductService,
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

    // this.places = [
    //   new IdNameParent('1', 'Home & Garden (546)', '', ''),
    //   new IdNameParent('2', 'Electronics', '', ''),
    //   new IdNameParent('3', 'Health & Fitness (321)', '', ''),
    //   new IdNameParent('4', 'Travel', '', ''),
    // ];
    // this.selectedPlaces = [
    //   new IdNameParent('2', 'Electronics', '', ''),
    // ];
    this.productService.getProductPlaces().subscribe(res =>
      this.places = res.map(p => new IdNameParent(p.PlaceId, p.PlaceName, '', ''))
    );
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
    this.categories = [];
    this.subCategories = [];
    this.productTypes = [];
    if (this.selectedPlaces.length > 0) {
      this.productService.getProductCategories(this.selectedPlaces.map(p => p.id)).subscribe(res => {
        this.categories = res.map(p => new IdNameParent(p.CategoryId, p.CategoryName, p.PlaceId, p.PlaceName));
      });
    }
  }
  onPlaceSelect(item: any) { this.refreshCategories(); }
  onPlaceDeSelect(item: any) { this.refreshCategories(); }
  onPlaceSelectAll(items: any) { this.refreshCategories(); }
  onPlaceDeSelectAll(items: any) { this.refreshCategories(); }

  refreshSubCategories() {
    this.subCategories = [];
    this.productTypes = [];
    if (this.selectedCategories.length > 0) {
      this.productService.getProductSubCategories(this.selectedCategories.map(p => p.id)).subscribe(res => {
        this.subCategories = res.map(p => new IdNameParent(p.SubCategoryId, p.SubCategoryName, p.CategoryId, p.CategoryName));
      });
    }
  }
  onCategorySelect(item: any) { this.refreshSubCategories(); }
  onCategoryDeSelect(item: any) { this.refreshSubCategories(); }
  onCategorySelectAll(items: any) { this.refreshSubCategories(); }
  onCategoryDeSelectAll(items: any) { this.refreshSubCategories(); }

  refreshProductTypes() {
    this.productTypes = [];
    if (this.selectedSubCategories.length > 0) {
      this.productService.getProductTypes(this.selectedSubCategories.map(p => p.id)).subscribe(res => {
        this.productTypes = res.map(p => new IdNameParent(p.TypeId, p.TypeName, p.SubCategoryId, p.SubCategoryName));
      });
    }
  }
  onSubCategorySelect(item: any) { this.refreshProductTypes(); }
  onSubCategoryDeSelect(item: any) { this.refreshProductTypes(); }
  onSubCategorySelectAll(items: any) { this.refreshProductTypes(); }
  onSubCategoryDeSelectAll(items: any) { this.refreshProductTypes(); }



}
