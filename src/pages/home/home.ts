import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {Http, Headers, RequestOptions, RequestMethod} from '@angular/http';

import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';

import 'rxjs/add/operator/map';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(public navCtrl: NavController,
                private camera: Camera,
                private http: Http,
                private transfer: FileTransfer) {
    }

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

    private fileTransfer: FileTransferObject = this.transfer.create();

    takePicture(source) {
        this.options.sourceType = source;
        this.camera.getPicture(this.options).then((imageData) => {
            this.image = imageData;
            this.upload();
        }, (err) => {
            console.log(err);
        });
    }

    upload() {
        let imagem = this.image.split('/');
        let fileName = imagem[imagem.length - 1];

        let headers = new Headers({
            // 'Content-Type': undefined,
            'Content-Type': 'multipart/form-data',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjI2NDEsImlhdCI6MTUwNjkxMjM3NCwiZXhwIjoxNTE0Njg4Mzc0fQ.erxhx1_KOSDMTBAJ1gAv0szO7oGAqa4TMp9O9NHf3O8'
        });

        let options: FileUploadOptions = {
            fileKey: 'image',
            fileName: fileName,
            mimeType: 'image/jpeg',
            chunkedMode: false,
            headers: headers
        }

        this.fileTransfer.upload(this.image, 'http://cl-api.vize.ai/2732', options)
            .then((data) => {
                // success
                console.log(data);
            }, (err) => {
                // error
                console.log(err);
            });
    }

    testaSementes() {

        let imagem = this.image.split('/');
        let fileName = imagem[imagem.length - 1];
        console.log(fileName);

        let body = new FormData();
        body.append('image', this.image);

        let headers = new Headers({
            // 'Content-Type': undefined,
            // 'Content-Type': 'multipart/form-data',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjI2NDEsImlhdCI6MTUwNjkxMjM3NCwiZXhwIjoxNTE0Njg4Mzc0fQ.erxhx1_KOSDMTBAJ1gAv0szO7oGAqa4TMp9O9NHf3O8'
        });

        let options = new RequestOptions({method: RequestMethod.Post, headers: headers});

        this.http.post('http://cl-api.vize.ai/2732', body, options)
            .map(res => res.json())
            .subscribe(data => {
                //this.response = data.data.children;
                this.response = data.data;
                console.log(this.response);
            });
    }
}
