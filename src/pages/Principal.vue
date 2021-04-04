<template>
  <q-page>
    <div class="row justify-end q-mr-md q-mt-sm">
      <q-avatar>
        <img src="" id="imagemUsuario">
      </q-avatar>
    </div>
    <q-page-container>
    <div class="row justify-center text-h5 q-mb-md" style="color: green">
      Agendamentos
    </div>
      <div class="q-px-md">
        <div v-if="novoAgendamentoIniciado === false">
          <q-list bordered separator>
            <q-item v-for="(item, index) in listaAgendamentos" :key="index">
              <q-item-section>
                <q-item-label v-html="item.usuario" />
                <q-item-label caption v-html="item.descricao" />
                <!-- Formatação de data quando a data for salva como timestamp -->
                <q-item-label v-html="(new Date(item.data.seconds * 1000).toLocaleDateString())"/>
                <div class="row justify-end">
                  <q-btn
                    round
                    class="q-ma-sm"
                    color="positive"
                    icon="done_outline"
                    size="10px"
                    @click="marcarConcluido(index, item.id)"
                  />
                  <q-btn
                    round
                    class="q-ma-sm"
                    color="negative"
                    icon="delete"
                    size="10px"
                    @click="removerAgendamento(index, item.id)"
                  />
                </div>
              </q-item-section>
            </q-item>

            <div class="flex flex-center" v-if="listaAgendamentos.length == 0">
              <h6>Não a agendamentos lançados!</h6>
            </div>
          </q-list>

          <q-btn
            round
            class="q-ma-sm"
            color="blue"
            icon="post_add"
            size="15px"
            @click="iniciarNovoAgendamento()"
          />
        </div>

        <div class="row justify-end" v-else>
          <q-input
            rounded
            outlined
            v-model="dadosInformados.usuarioDigitado"
            label="Usuário"
            class="col-md-12 col-sm-12 col-xs-12 q-mb-md q-mt-md"
            color="green-5"
            clearable
            clear-icon="close"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input
            rounded
            outlined
            v-model.number="dadosInformados.descricaoDigitada"
            label="Descrição"
            class="col-md-12 col-sm-12 col-xs-12 q-mb-md"
            color="green-5"
            clearable
            clear-icon="close"
          >
            <template v-slot:prepend>
              <q-icon name="description" />
            </template>
          </q-input>

          <q-input
            rounded
            outlined
            v-model="dadosInformados.dataDigitada"
            label="Data do agendamento"
            mask="date"
            class="col-md-12 col-sm-12 col-xs-12 q-mb-md"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="dadosInformados.dataDigitada">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <div class="row justify-between">
            <q-btn
              round
              class="q-ma-sm"
              color="positive"
              icon="done"
              size="15px"
              @click="novoAgendamento()"
            />

            <q-btn
              round
              class="q-ma-sm"
              color="negative"
              icon="close"
              size="15px"
              @click="cancelarNovoAgendamento()"
            />
          </div>
        </div>
      </div>
    </q-page-container>
    <q-footer elevated class="row justify-between">
      <q-toolbar>
        <q-toolbar-title>HouseWork</q-toolbar-title>
        <q-btn
          round
          color="negative"
          icon="logout"
          size="12px"
          @click="sairSistema()"
        />
      </q-toolbar>
    </q-footer>
  </q-page>
</template>

<script>
import { db } from 'boot/firebase'
import firebase from 'firebase'

export default {
  name: 'Principal',
  data () {
    return {
      listaAgendamentos: [],
      novoAgendamentoIniciado: false,
      dadosInformados: {
        usuarioDigitado: '',
        descricaoDigitada: '',
        estadoDigitado: false,
        dataDigitada: '',
        urlFotoUsuarioCapturada: ''
      }
    }
  },
  async created () {
    await this.listarAgendamento()
  },
  mounted () {
    setTimeout(() => this.recuperaFotoUsuario(), 1000)
  },
  async updated () {
    await this.recuperaFotoUsuario()
  },
  methods: {
    async recuperaFotoUsuario () {
      this.dadosInformados.urlFotoUsuarioCapturada = await this.$store.getters.getUrlFotoUsuario
      console.log('URL QUE CHEGOU NA PRINCIPAL', this.dadosInformados.urlFotoUsuarioCapturada)
      document.getElementById('imagemUsuario').src = [this.dadosInformados.urlFotoUsuarioCapturada]
    },
    iniciarNovoAgendamento () {
      this.novoAgendamentoIniciado = true
    },
    cancelarNovoAgendamento () {
      this.novoAgendamentoIniciado = false
    },
    async novoAgendamento () {
      try {
        if (this.dadosInformados.usuarioDigitado !== '' && this.dadosInformados.descricaoDigitada !== '' && this.dadosInformados.dataDigitada !== '') {
          const resDb = await db.collection('agendamento').add({
            usuario: this.dadosInformados.usuarioDigitado,
            descricao: this.dadosInformados.descricaoDigitada,
            data: new Date(this.dadosInformados.dataDigitada),
            estado: this.dadosInformados.estadoDigitado
          })

          this.listaAgendamentos.push({
            usuario: this.dadosInformados.usuarioDigitado,
            descricao: this.dadosInformados.descricaoDigitada,
            data: new Date(this.dadosInformados.dataDigitada),
            estado: this.dadosInformados.estadoDigitado,
            id: resDb.id
          })

          this.limparDados()

          this.$q.notify({
            message: 'Item salvo no banco de dados',
            color: 'positive',
            textColor: 'white',
            icon: 'cloud'
          })
        } else {
          this.$q.notify({
            message: 'Não foi possível salvar o item, verifique os campos e tente novamente',
            color: 'negative',
            textColor: 'white',
            icon: 'error_outline'
          })
        }
      } catch (error) {
        this.$q.notify({
          message: 'Não foi possível salvar o item, verifique sua conexão',
          color: 'negative',
          textColor: 'white',
          icon: 'error_outline'
        })
      }
    },
    async listarAgendamento () {
      try {
        const resDb = await db.collection('agendamento').get()
        resDb.forEach(res => {
          if (res.data().estado === false) {
            const itemBd = {
              id: res.id,
              data: res.data().data,
              descricao: res.data().descricao,
              estado: res.data().estado,
              usuario: res.data().usuario
            }
            this.listaAgendamentos.push(itemBd)
          }
        })
      } catch (error) {
        this.$q.notify({
          message:
            'Não foi possível listar os agendamentos, verifique sua conexão',
          color: 'negative',
          textColor: 'white',
          icon: 'error_outline'
        })
      }
    },
    marcarConcluido (index, id) {
      this.$q
        .dialog({
          title: 'Confirmar',
          message: 'Deseja realmente marcar o item como concluído ?',
          cancel: true,
          persistent: true
        })
        .onOk(async () => {
          try {
            await db.collection('agendamento').doc(id).update({
              estado: true
            })

            this.listaAgendamentos.splice(index, 1)

            this.$q.notify({
              message: 'Item marcado como concluído',
              color: 'positive',
              textColor: 'white',
              icon: 'done_all'
            })
          } catch (error) {
            this.$q.notify({
              message:
                'Não foi possível marcar o item como concluído, verifique sua conexão',
              color: 'negative',
              textColor: 'white',
              icon: 'error_outline'
            })
          }
        })
    },
    removerAgendamento (index, id) {
      this.$q
        .dialog({
          title: 'Confirmar',
          message: 'Deseja realmente remover o item ?',
          cancel: true,
          persistent: true
        })
        .onOk(async () => {
          try {
            await db.collection('agendamento').doc(id).delete()

            this.listaAgendamentos.splice(index, 1)

            this.$q.notify({
              message: 'O item foi removido com sucesso do banco de dados',
              color: 'positive',
              textColor: 'white',
              icon: 'cloud_off'
            })
          } catch (error) {
            this.$q.notify({
              message: 'Não foi possível remover o item, verifique sua conexão',
              color: 'negative',
              textColor: 'white',
              icon: 'error_outline'
            })
          }
        })
    },
    limparDados () {
      this.dadosInformados.usuarioDigitado = ''
      this.dadosInformados.descricaoDigitada = ''
      this.dadosInformados.dataDigitada = ''
      this.dadosInformados.estadoDigitado = false
      this.novoAgendamentoIniciado = false
    },
    async sairSistema () {
      await firebase.auth().signOut()
      this.$router.push({ path: '/' }).catch(e => {})
    }
  }
}
</script>

<style lang="scss">
  .div-sair {
    height: 100%;
    width: 100%;
    background-color: $red;
  }
</style>
