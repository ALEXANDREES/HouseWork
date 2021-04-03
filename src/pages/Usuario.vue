<template>
  <q-page class="div-fundo column justify-center items-center">
    <div>Cadastro de novo usuário</div>
    <div class="row justify-between">
      <q-input
        rounded
        outlined
        v-model="dadosInformados.emailDigitado"
        label="E-mail"
        class="col-xs-12 q-mb-md q-mt-md q-px-md"
        color="green-5"
        clearable
        clear-icon="close"
      >
        <template v-slot:prepend>
          <q-icon name="mail" />
        </template>
      </q-input>

      <q-input
        rounded
        outlined
        v-model.number="dadosInformados.senhaDigitada"
        label="Senha"
        class="col-xs-12 q-mb-md q-px-md"
        color="green-5"
        clearable
        clear-icon="close"
      >
        <template v-slot:prepend>
          <q-icon name="lock" />
        </template>
      </q-input>

      <q-input
        rounded
        outlined
        v-model.number="dadosInformados.confirmacaoSenhaDigitada"
        label="Confirmação de senha"
        class="col-xs-12 q-mb-md q-px-md"
        color="green-5"
        clearable
        clear-icon="close"
      >
        <template v-slot:prepend>
          <q-icon name="lock" />
        </template>
      </q-input>

      <q-btn
        round
        class="q-ma-sm q-mx-md"
        color="positive"
        icon="done"
        size="15px"
        @click="novoUsuario()"
        to="/"
      />

      <q-btn
        round
        class="q-ma-sm q-mx-md"
        color="negative"
        icon="close"
        size="15px"
        to="/"
        @click="limparDados()"
      />
    </div>
  </q-page>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Login',
  data () {
    return {
      listaUsuarios: [],
      usuarioLogando: false,
      dadosInformados: {
        emailDigitado: '',
        senhaDigitada: '',
        confirmacaoSenhaDigitada: ''
      }
    }
  },
  methods: {
    async novoUsuario () {
      try {
        if (this.dadosInformados.emailDigitado !== '' && this.dadosInformados.senhaDigitada !== '' && this.dadosInformados.confirmacaoSenhaDigitada !== '') {
          if (this.dadosInformados.senhaDigitada === this.dadosInformados.confirmacaoSenhaDigitada) {
            await firebase.auth().createUserWithEmailAndPassword(this.dadosInformados.emailDigitado, this.dadosInformados.senhaDigitada)

            this.listaUsuarios.push({
              email: this.dadosInformados.emailDigitado,
              senha: this.dadosInformados.senhaDigitada
            })

            this.limparDados()

            this.$q.notify({
              message: 'Usuário salvo no banco de dados',
              color: 'positive',
              textColor: 'white',
              icon: 'cloud'
            })
          } else {
            this.$q.notify({
              message:
                'Não foi possível salvar o usuário, as senhas não correspondem',
              color: 'negative',
              textColor: 'white',
              icon: 'error_outline'
            })
          }
        } else {
          this.$q.notify({
            message:
              'Não foi possível salvar o usuário, verifique os campos e tente novamente',
            color: 'negative',
            textColor: 'white',
            icon: 'error_outline'
          })
        }
      } catch (error) {
        console.log(error)
        this.$q.notify({
          message: 'Não foi possível salvar o usuário, verifique sua conexão',
          color: 'negative',
          textColor: 'white',
          icon: 'error_outline'
        })
      }
    },
    limparDados () {
      this.dadosInformados.emailDigitado = ''
      this.dadosInformados.senhaDigitada = ''
      this.dadosInformados.confirmacaoSenhaDigitada = ''
    }
  }
}
</script>

<style lang="scss">
.div-fundo {
  height: 100%;
  width: 100%;
}
.div-red {
  background-color: $red;
}
</style>
