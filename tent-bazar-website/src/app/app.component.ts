import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ReactiveFormComponent } from './checkout/checkout.component';
import { DataService } from './service/data.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    HeaderComponent,
    FooterComponent,
    RouterModule,
    ReactiveFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tent-bazar-website';
  
  profileForm = new FormGroup({
    name : new FormControl(),
    mobileNumber: new FormControl(),
    address: new FormControl(),
    address_city: new FormControl(),
    address_state: new FormControl(),
    address_pincode: new FormControl(),
  })
  onSubmit(){
    console.log(this.profileForm.value);    
  }

  dataInfo:{
    name: string;
    brand: string;
    price: number;
}[]|undefined;

  constructor(private dataService:DataService){}

  getDataService(){
    // this.dataInfo=this.dataService.getDataService();

    console.log(this.dataInfo);
    
  }
}
