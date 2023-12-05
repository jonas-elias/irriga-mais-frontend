import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { Share } from '@capacitor/share';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild(IonModal) modal: IonModal;

  public message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  public name: string = '';
  public eventos: Array<any> = []
  public pivos: Array<any> = []
  public pivo: string = ''
  public duracao: string = ''
  public data_inicial: string = ''

  isActionSheetOpen = false;
  public actionSheetButtons = [
    {
      text: 'Cancelar evento',
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
    {
      text: 'Compartilhar',
      data: {
        action: 'share',
      },
    },
    {
      text: 'Fechar',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ]

  private action: string = ''
  private evento_id: string = ''

  constructor(private alertController: AlertController) { }

  setOpen(isOpen: boolean, evento_id: any) {
    this.evento_id = evento_id
    this.isActionSheetOpen = isOpen;
  }

  ionWillEnter() {
    this.getPivos()
    this.getEventos()
  }

  async setAction(event: any) {
    this.isActionSheetOpen = false
    const action = event.detail['data']['action']

    if (action === 'share') {
      await this.shareEvento()
    } else if (action === 'delete') {
      const status = this.deleteEvento()
      this.getPivos()
      this.getEventos()
    }
  }

  async shareEvento() {
    let evento: any = ''
    this.eventos.forEach(element => {
      if (element['id'] == this.evento_id) {
        evento = element
      }
    });

    await Share.share({
      title: 'Compartilhar evento',
      text:
        'Pivo: ' + evento['pivo_nome'] + '\n' +
        'Data início: ' + evento['data_hora_inicio'] + '\n' +
        'Duração: ' + evento['duracao'] + '\n' +
        'Status: ' + evento['status'] + '\n',
      dialogTitle: 'Compartilhar evento',
    });
  }

  deleteEvento() {
    const options = {
      url: environment.urlPath + '/irrigacao/deleteEvento/' + this.evento_id + '/',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' },
    }

    CapacitorHttp.delete(options)
    alert('Evento removido com sucesso!')
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  ngOnInit(): void {
    this.getEventos()
    this.getPivos()
  }

  async getPivos() {
    const options = {
      url: environment.urlPath + '/irrigacao/getAllPivos',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*', 'fazendaId': await this.getFazendaId() },
    };

    const response: HttpResponse = await CapacitorHttp.get(options);

    if (response.status === 200) {
      this.pivos = response.data['response']
    } else if (response.status === 404) { }
    else {
      alert('Ocorreu algum erro ao recuperar os pivos!')
    }
  }

  async getModal() {
    this.clearValues()
    await this.getPivos()
    if (this.pivos[0] == null) {
      alert('Nenhum pivô foi encontrado na base de dados!')
    } else {
      await this.modal.present();
    }
  }

  clearValues() {
    this.pivo = ''
    this.duracao = ''
    this.data_inicial = ''
  }

  async getEventos() {
    const options = {
      url: environment.urlPath + '/irrigacao/getIrrigacaoEvento',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*', 'fazendaId': await this.getFazendaId() },
    };

    const response: HttpResponse = await CapacitorHttp.get(options);

    if (response.status === 200) {
      this.eventos = response.data['response']
    } else if (response.status === 404) { }
    else {
      alert('Ocorreu algum erro ao recuperar os eventos!')
    }
  }

  async confirmEvento() {
    const options = {
      url: environment.urlPath + '/irrigacao/createEvento',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' },
      params: {
        'pivo_id': this.pivo, 'duracao': this.duracao,
        'data_inicial': this.data_inicial, 'fazenda_id': await this.getFazendaId()
      }
    };

    const response: HttpResponse = await CapacitorHttp.post(options);

    if (response.status === 201) {
      alert('O evento foi inserido com sucesso!')
      this.modal.dismiss(null, 'confirm')
      this.getPivos()
      this.getEventos()
    } else {
      alert('Ocorreu algum erro ao inserir o evento!')
    }
  }

  async getFazendaId() {
    const { value } = await Preferences.get({ key: 'identification' })
    return value as string
  }
}
