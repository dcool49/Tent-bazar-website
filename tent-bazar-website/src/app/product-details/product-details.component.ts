import { Component, Inject, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { SeoService } from '../services/seo.service';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  productId: any;
  productDetals: any;
  quantity: number = 1;
  localStorageData: any[] = JSON.parse(localStorage.getItem("addedProduct") as any) ?? [];
  cartAdded = false;
  selectedImage: any;
  adminView = false;
  constructor(
    private route: Router,
    private dataService: DataService,
    private seoService: SeoService,
    @Optional() @Inject(MAT_DIALOG_DATA) dialogData: any,
  ) {
    this.adminView = !!dialogData?.adminView;
    this.productId = localStorage.getItem('productId');
    const index = this.localStorageData.findIndex((prod: any) => prod._id === this.productId)
    if (index != -1) {
      this.cartAdded = true;
    }
  }
  ngOnInit(): void {
    this.getProductDetails();
  }
  urlRout(path: any) {
    this.route.navigate(['/' + path])
  }
  getProductDetails() {
    const url = 'product/fetchbyid?_id=' + this.productId;
    this.dataService.getAPICall(url).subscribe({
      next: (res: any) => {
        this.productDetals = res?.data?.[0];
        this.selectedImage = this.productDetals?.image?.[0].img_name;
        if (this.productDetals && !this.adminView) {
          this.seoService.setPage({
            title: this.productDetals.productName,
            description: this.productDetals.summery
              || `Buy ${this.productDetals.productName} from Aditya Agency & Tent Bazar. Delivery in 3–5 business days.`,
            path: '/details',
            image: this.productDetals.image?.[0]?.img_name,
            keywords: `${this.productDetals.productName}, tent, event supplies, tent bazar`,
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: this.productDetals.productName,
              description: this.productDetals.summery,
              image: this.productDetals.image?.map((img: any) => img.img_name),
              offers: {
                '@type': 'Offer',
                priceCurrency: 'INR',
                price: this.productDetals.price,
                availability: 'https://schema.org/InStock',
                seller: { '@type': 'Organization', name: 'Aditya Agency & Tent Bazar' }
              }
            }
          });
        }
      },
      error: (err) => console.error(err)
    });
  }
  addcart() {
    let localStorageData = JSON.parse(localStorage.getItem("addedProduct") as any);
    let addedProduct: any = [];
    const productDetals = { ...this.productDetals, quantity: this.quantity }
    if (localStorageData) {
      const index = localStorageData.findIndex((prod: any) => prod._id === this.productId)
      if (index !== -1) {
        return;
      }
      localStorageData.push(productDetals)
      localStorage.setItem("addedProduct", JSON.stringify(localStorageData));
    } else {
      addedProduct.push(productDetals)
      localStorage.setItem("addedProduct", JSON.stringify(addedProduct));
    }
    this.cartAdded = true;
  }

  removecart() {
    let localStorageData = JSON.parse(localStorage.getItem("addedProduct") as any);
    const index = localStorageData.findIndex((prod: any) => prod._id === this.productId);
    if (index !== -1) {
      localStorageData.splice(index, 1);
      localStorage.setItem("addedProduct", JSON.stringify(localStorageData));
      this.cartAdded = false;
    }
  }
}
