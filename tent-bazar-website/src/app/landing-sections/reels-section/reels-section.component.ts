import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

// ⚠️ IMPORTANT: Declare the global Instagram object
declare var instgrm: any;

@Component({
  selector: 'app-reels-section',
  imports: [CommonModule],
  templateUrl: './reels-section.component.html',
  styleUrl: './reels-section.component.scss'
})
export class ReelsSectionComponent implements OnInit, AfterViewChecked {
  InstagramList: any;
  private embedsProcessed = false; 
constructor(private dataService:DataService,  private sanitization:DomSanitizer){}

  ngOnInit(): void {
    this.getInstagramList();
  }
  getInstagramList() {
    const url = 'urls/fetch?type=instagram';
    this.dataService.getAPICall(url).subscribe(
      (res:any) => {
        this.InstagramList = res.data;
        this.embedsProcessed = false; 
      },
      (err) => {
        console.error(err);
      }
    );
  }

  photoURL(url:any) {
    return url;
  }
  ngAfterViewChecked(): void {
    // Check if the list has data, the instgrm object exists, and processing hasn't run yet
    if (this.InstagramList && this.InstagramList.length > 0 && typeof instgrm !== 'undefined' && !this.embedsProcessed) {
      // Manually trigger the Instagram embed script to convert blockquotes
      instgrm.Embeds.process();
      this.embedsProcessed = true; // Set flag to prevent constant reprocessing
  }
}

}
