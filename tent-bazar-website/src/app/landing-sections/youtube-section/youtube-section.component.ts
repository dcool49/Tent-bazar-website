import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
@Component({
  selector: 'app-youtube-section',
  imports: [CommonModule],
  templateUrl: './youtube-section.component.html',
  styleUrl: './youtube-section.component.scss',
})
export class YoutubeSectionComponent implements OnInit {
  youtubeList: any;
  constructor(private dataService: DataService, private sanitization:DomSanitizer) {
  }
  ngOnInit(): void {
    this.getYoutubelist();
  }
  getYoutubelist() {
    const url = 'urls/fetch?type=youtube';
    this.dataService.getAPICall(url).subscribe(
      (res: any) => {
        this.youtubeList = res.data;
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
