import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-reels-section',
  imports: [CommonModule],
  templateUrl: './reels-section.component.html',
  styleUrl: './reels-section.component.scss'
})
export class ReelsSectionComponent implements OnInit {
  InstagramList: any;
constructor(private dataService:DataService,  private sanitization:DomSanitizer){}
  ngOnInit(): void {
    this.getInstagramList();
  }
  getInstagramList() {
    const url = 'urls/fetch?type=instagram';
    this.dataService.getAPICall(url).subscribe(
      (res:any) => {
        this.InstagramList = res.data;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  photoURL(url:any) {
    return this.sanitization.bypassSecurityTrustResourceUrl(url);
  }

}
