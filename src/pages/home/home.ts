import {Component} from '@angular/core';
import {FabContainer, NavController} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {Http, Headers, RequestOptions, RequestMethod} from '@angular/http';

import {FileTransfer, FileTransferObject} from '@ionic-native/file-transfer';

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
    public imageBlob: any;
    public predicao: string = '';
    public probabilidade: number = 0;
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

    takePicture(source: number, fab: FabContainer) {
        this.options.sourceType = source;
        fab.close();
        location.reload();

        this.camera.getPicture(this.options).then((imageData) => {
            this.image = imageData;
            this.testaSementes();
        }, (err) => {
            console.log(err);
        });
    }

    testaSementes() {

        let imagem = this.image.split('/');
        let fileName = imagem[imagem.length - 1];

        (<any>window).resolveLocalFileSystemURL(this.image, (fileEntry) => {
            fileEntry.file((resFile) => {
                let reader = new FileReader();
                reader.readAsArrayBuffer(resFile);
                reader.onloadend = (evt: any) => {
                    this.imageBlob = new Blob([evt.target.result], {type: 'image/jpeg'});
                    this.imageBlob.name = fileName;
                    this.enviaImagem();
                };
                reader.onerror = (e) => {
                    console.log('Erro ao ler arquivo: ' + e.toString());
                };
            })
        })
    }

    enviaImagem() {

        let body = new FormData();
        body.append('image', this.imageBlob);

        let headers = new Headers({
            'Content-Type': 'application/octet-stream',
            // 'Content-Type': 'multipart/form-data',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Prediction-Key': 'c70f08c36c6b467a97633e3198b325ff',
            // 'Authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjI2NDEsImlhdCI6MTUwNjkxMjM3NCwiZXhwIjoxNTE0Njg4Mzc0fQ.erxhx1_KOSDMTBAJ1gAv0szO7oGAqa4TMp9O9NHf3O8'
        });

        let options = new RequestOptions({method: RequestMethod.Post, headers: headers});

        // this.http.post('http://cl-api.vize.ai/2732', body, options)
        this.http.post('https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/a5bbe90c-954a-4f55-9273-b9d0b99f7f0d/image?iterationId=22863e45-17e0-4eaa-ab49-d9d6508dfec6',
            this.imageBlob, options)
            .map(res => res.json())
            .subscribe(data => {
                //this.response = data.data.children;
                this.response = data;
                this.getPredicao(this.response);
            });
    }

    getPredicao(data) {
        data.Predictions.forEach(item => {
            if (item.Probability > this.probabilidade) {
                this.probabilidade = item.Probability * 100;
                this.predicao = item.Tag;
            }
        });
        console.log(this.probabilidade);
        console.log(this.predicao);
    }
}
