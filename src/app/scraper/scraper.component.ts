import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-scraper',
  templateUrl: './scraper.component.html',
  styleUrls: ['./scraper.component.css'],
})


export class ScraperComponent implements OnInit {

  public apiURL = 'https://www.kijiji.ca/b-jeux-video-consoles/';
  public proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  public categorie = 'c141';
  public locationVille = 'b-mauricie/';
  public location = 'l1700147';
  //b-ville-de-montreal l1700281
  public interval;
  public count = 0;
  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document ) { }

  ngOnInit(): void {
    this.getAds();
    this.interval = setInterval(() => {
      this.count++;
      console.log(this.count);
      this.getAds();
    }, 300000);

  }

  public changeLocation(newLocation: string) {

    if ( newLocation != null) {
      newLocation = newLocation.replace(/ /g, '-');
      console.log(newLocation);
      this.locationVille = newLocation.toLowerCase() + '/';
    }
  }

  getAds() {
    console.log('----------------');
    console.log('fetch to -> '+this.locationVille);
    fetch(this.proxyUrl + this.apiURL + this.locationVille + this.categorie + this.location)
    .then(blob => blob.text())
    .then(html => {
      this.strip(html);
    })

    .catch(e => {
      console.log(e);
      return e;
    });

    console.log('----------------');
  }

  public strip(html): string {
    let regexTitle = /<div.*class="title">(.*?(\n))+?<\/div>/g, result, indices = [];
    let regexReplaceImg = /<picture>(.*?(\n)(\s*))+?<\/picture>/g;
    let regexReplaceDetail = /<div.*class="details">(.*?(\n)(\s*))+?<\/div>/g;
    let regexDivDebToTab = /<\s*div[^>]*>/g;
    let regexDivFinToTab = /<\/div>/g;
    let regexHREFCor = /<\s*a[^>]*?"/g;
    let newString = '';

    let oldTable = document.getElementsByTagName('table'), index;

    for (index = oldTable.length - 1; index >= 0; index--) {
        oldTable[index].parentNode.removeChild(oldTable[index]);
    }

    let table = this.document.createElement('table');
    table.setAttribute('border', '1');
    table.setAttribute('width', '50%');
    table.align = 'center';

    while( (result = regexTitle.exec(html)) ) {

      let newS = result[0].replace(regexReplaceDetail, '')
                         .replace(/\n/g, '')
                         .replace(regexHREFCor,'<a href="https://www.kijiji.ca');



      let row = this.document.createElement("tr");
      let cell = this.document.createElement("td");
      cell.innerHTML = newS;
      row.appendChild(cell);
      table.appendChild(row);
    }
    this.document.body.appendChild(table);
    return newString ;
  }

}
