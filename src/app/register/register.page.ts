import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(
    private route: Router
  ) {
    this.username = ''
    this.email = ''
    this.password = ''
  }

  ngOnInit() {
  }

  public username: string = '';
  public email: string = '';
  public password: string = '';

  async register() {
    const coordinates = await Geolocation.getCurrentPosition();

    const options = {
      url: environment.urlPath  + '/irrigacao/createFazenda',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' },
      params: {
        email: this.email,
        nome: this.username,
        senha: this.password,
        latitude: JSON.stringify(coordinates['coords']['latitude']),
        longitude: JSON.stringify(coordinates['coords']['longitude'])
      },
    };

    const response: HttpResponse = await CapacitorHttp.post(options);
    
    if (response.status === 201) {
      alert('Sucesso no registro da fazenda!')
    } else {
      alert('Ocorreu um erro ao inserir a fazenda!')
    }

    this.route.navigateByUrl('/')
  }

}
