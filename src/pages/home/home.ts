import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {Http, Headers, RequestOptions, RequestMethod} from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    public image: string;
    private response: any;

    private options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.NATIVE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 500,
        targetHeight: 500,
        saveToPhotoAlbum: false
    }

    constructor(public navCtrl: NavController,
                private camera: Camera,
                private http: Http) {
    }

    takePicture(source) {
        this.options.sourceType = source;
        this.camera.getPicture(this.options).then((imageData) => {
            this.image = imageData;
            this.testaSementes();
        }, (err) => {
            console.log(err);
        });
    }

    testaSementes() {

        let body = {'image': this.image};
        let headers = new Headers({
            'Content-Type': 'multipart/form-data;',
            'Authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjI2NDEsImlhdCI6MTUwNjkxMjM3NCwiZXhwIjoxNTE0Njg4Mzc0fQ.erxhx1_KOSDMTBAJ1gAv0szO7oGAqa4TMp9O9NHf3O8'
        });
        let options = new RequestOptions({method: RequestMethod.Post, headers: headers});

        this.http.post('http://cl-api.vize.ai/2732', body, options).map(res => res.json()).subscribe(data => {
            //this.response = data.data.children;
            this.response = data.data;
            console.log(this.response);
        });
    }
}
