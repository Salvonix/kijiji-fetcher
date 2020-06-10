import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import {Location} from '../models/location.model';

@Component({
  selector: 'app-scraper',
  templateUrl: './scraper.component.html',
  styleUrls: ['./scraper.component.css'],
})


export class ScraperComponent implements OnInit {

  public apiURL = 'https://www.kijiji.ca/b-jeux-video-consoles/';
  public proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  public categorie = 'c141';
  public location: Location = new Location('Mauricie', 'b-mauricie/', 'l1700147');

  public locations: Location[] = [
    new Location('Mauricie', 'b-mauricie/', 'l1700147'),
    new Location('Tout le Québec', 'quebec/', 'l9001'),
    new Location('Montréal', 'b-ville-de-montreal/', 'l1700281')
  ];
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

  public changeLocation() {
    if ( this.location !== undefined) {
      this.getAds();
    }
  }

  getAds() {
    console.log('----------------');
    console.log('fetch to -> ' + this.location.path);
    fetch(this.proxyUrl + this.apiURL + this.location.path + this.categorie + this.location.id)
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

  public strip(html) {
    let regexTitle = /<div.*class="title">(.*?(\n))+?<\/div>/g, result, indices = [];
    // let regexReplaceImg = /<picture>(.*?(\n)(\s*))+?<\/picture>/g;
    const regexReplaceDetail = /<div.*class="details">(.*?(\n)(\s*))+?<\/div>/g;
    // let regexDivDebToTab = /<\s*div[^>]*>/g;
    // let regexDivFinToTab = /<\/div>/g;
    const regexHREFCor = /<\s*a[^>]*?"/g;
    // let newString = '';

    let oldTable = document.getElementsByTagName('table'), index;

    for (index = oldTable.length - 1; index >= 0; index--) {
        oldTable[index].parentNode.removeChild(oldTable[index]);
    }

    const table = this.document.createElement('table');
    table.setAttribute('border', '1');
    table.setAttribute('width', '50%');
    table.align = 'center';

    // tslint:disable-next-line: no-conditional-assignment
    while ( result = regexTitle.exec(html) ) {

      const newS = result[0].replace(regexReplaceDetail, '')
                         .replace(/\n/g, '')
                         .replace(regexHREFCor, '<a href="https://www.kijiji.ca');



      const row = this.document.createElement('tr');
      const cell = this.document.createElement('td');
      cell.innerHTML = newS;
      row.appendChild(cell);
      table.appendChild(row);
    }
    this.document.getElementById('content').appendChild(table);
  }

}
