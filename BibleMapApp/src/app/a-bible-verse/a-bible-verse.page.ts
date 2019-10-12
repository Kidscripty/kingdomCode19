import { Component, OnInit } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';


@Component({
  selector: 'app-a-bible-verse',
  templateUrl: './a-bible-verse.page.html',
  styleUrls: ['./a-bible-verse.page.scss'],
})
export class ABibleVersePage implements OnInit {

  constructor(private tts: TextToSpeech) { }

  ttspeak() {
    this.tts.speak('Hello World')
      .then(() => console.log('Success'))
      .catch((reason: any) => console.log(reason));
  }

  ngOnInit() {
  }

}