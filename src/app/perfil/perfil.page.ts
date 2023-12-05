import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  public fazenda: Array<any> = []

  constructor(
    private route: Router
  ) { }

  async ngOnInit() {
    this.getPerfil()
  }

  async getPerfil() {
    let fazendaId = await this.getFazendaId()
    const options = {
      url: environment.urlPath + '/irrigacao/getFazendaById/' + fazendaId + '/',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' },
    };

    const response: HttpResponse = await CapacitorHttp.get(options);

    if (response.status === 200) {
      this.fazenda = response.data['response']
    } else {
      alert('Ocorreu algum erro ao recuperar a fazenda!')
    }
  }

  async getFazendaId() {
    const { value } = await Preferences.get({ key: 'identification' })
    return value as string
  }

  async voltar() {
    await Preferences.remove({ key: 'identification' })
    await Preferences.remove({ key: 'bearerToken' })
    this.route.navigateByUrl('/')
  }

}
