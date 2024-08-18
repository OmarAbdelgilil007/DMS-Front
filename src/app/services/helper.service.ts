import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  textDirection: string = '';
  lang: any= localStorage.getItem('lang');

  constructor(private _HttpClient: HttpClient, private _TranslateService:TranslateService) { 
    // _TranslateService.onLangChange.subscribe((event:LangChangeEvent)=>{
    //   console.log(event.lang);
    //   this.lang=event.lang
    // });
  //  _TranslateService.onLangChange.subscribe((event: LangChangeEvent) => {
  //     event.lang==='en'?this.textDirection = 'ltr' : this.textDirection = 'rtl'
  //   })
  if(localStorage.getItem('lang') !==null){
    this.onChangelang(this.lang)
  }
  else{
    this.onChangelang('en')
  }

  }

  onChangelang(lang:any){

    this._TranslateService.setDefaultLang(lang);
    this._TranslateService.use(lang);
    localStorage.setItem("lang", lang)
    console.log(lang)
    this.updateDirection(lang);
  }
  private updateDirection(lang: string) {
    this.textDirection = lang === 'en' ? 'ltr' : 'rtl';
    
  }
}
