import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private route: Router
  ) {
    this.email = ''
    this.password = ''
  }

  ngOnInit() {
  }

  public email: string = '';
  public password: string = '';

  async login() {
    const options = {
      url: environment.urlPath + '/irrigacao/loginFazenda',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' },
      params: {
        email: this.email,
        senha: this.password,
      },
    };

    const response: HttpResponse = await CapacitorHttp.post(options);

    if (response.status === 201) {
      await this.setPreferenceId(response.data['id'])
      await this.setPreferenceToken(response.data['token'])
      alert('Sucesso no login!')
      this.route.navigateByUrl('/tabs')
    } else if (response.status === 401) {
      alert(response.data['message'])
    }
  }

  async setPreferenceToken(token: string) {
    await Preferences.set({
      key: 'bearerToken',
      value: token,
    });
  }

  async setPreferenceId(id: string) {
    id = id.toString()
    await Preferences.set({'key': 'identification', value: id})
  }
}
