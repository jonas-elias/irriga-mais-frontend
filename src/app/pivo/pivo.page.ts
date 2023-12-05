import { Component, OnInit, ViewChild } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pivo',
  templateUrl: './pivo.page.html',
  styleUrls: ['./pivo.page.scss'],
})
export class PivoPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  public pivos: Array<any> = []

  public nome: string = ''

  public descricao: string = ''

  public tipo: string = ''

  public pivo: string = ''

  isActionSheetOpen = false;
  public actionSheetButtons = [
    {
      text: 'Sim',
      data: {
        action: 'sim',
      },
    },
    {
      text: 'Não',
      data: {
        action: 'nao',
      },
    },
  ]

  ngOnInit(): void {
    this.getPivos()
  }

  setOpen(isOpen: boolean, pivo_id: any) {
    this.pivo = pivo_id
    this.isActionSheetOpen = isOpen;
  }

  async setAction(event: any) {
    const action = event.detail['data']['action']

    if (action === 'sim') {
      this.deletePivo()
      this.getPivos()
    }

    this.isActionSheetOpen = false
  }

  clearValues() {
    this.pivo = ''
    this.descricao = ''
    this.tipo = ''
  }

  setPivo(id: string) {
    this.pivo = id
  }

  deletePivo() {
    const options = {
      url: environment.urlPath + '/irrigacao/deletePivo/' + this.pivo + '/',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' },
    }

    CapacitorHttp.delete(options)
    alert('Pivô removido com sucesso!')
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async getPivos() {
    const options = {
      url: environment.urlPath + '/irrigacao/getAllPivos',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' },
    };

    const response: HttpResponse = await CapacitorHttp.get(options);

    if (response.status === 200) {
      this.pivos = response.data['response']
    } else {
      alert('Ocorreu algum erro ao recuperar os pivos!')
    }
  }

  async confirm() {
    const options = {
      url: environment.urlPath + '/irrigacao/createPivo',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' },
      params: {
        'nome': this.nome,
        'descricao': this.descricao,
        'fazenda_id': await this.getFazendaId(),
        'tipo': this.tipo
      }
    };

    const response: HttpResponse = await CapacitorHttp.post(options);

    if (response.status === 201) {
      this.modal.dismiss(null, 'confirm')
      this.getPivos()
      alert('Pivô inserido com sucesso!')
    } else {
      alert('Ocorreu algum erro ao inserir o pivô!')
    }
  }

  async getFazendaId() {
    const { value } = await Preferences.get({ key: 'identification' })
    return value as string
  }
}
