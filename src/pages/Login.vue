<template>
  <q-page class="div-fundo column justify-center items-center">
    <div> HouseWork </div>
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

      <q-btn
        round
        class="q-ma-sm q-mx-md"
        color="blue"
        icon="person"
        size="15px"
        to="Usuario"
      />

      <q-btn
        round
        class="q-ma-sm q-mx-md"
        color="positive"
        icon="forward"
        size="15px"
        @click="realizarLogin()"
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
      dadosInformados: {
        emailDigitado: '',
        senhaDigitada: ''
      }
    }
  },
  methods: {
    async realizarLogin () {
      const instanciaVue = this
      try {
        if (this.dadosInformados.emailDigitado !== '' && this.dadosInformados.senhaDigitada !== '' && this.dadosInformados.confirmacaoSenhaDigitada !== '') {
          await firebase.auth().signInWithEmailAndPassword(this.dadosInformados.emailDigitado, this.dadosInformados.senhaDigitada).then(() => {
            instanciaVue.$router.push({ path: '/Principal' }).catch(e => {})
          })

          this.limparDados()
        } else {
          this.$q.notify({
            message: 'Não foi possível realizar o login, verifique os campos e tente novamente',
            color: 'negative',
            textColor: 'white',
            icon: 'error_outline'
          })
        }
      } catch (error) {
        console.log(error)
        this.$q.notify({
          message: 'Não foi possível realizar o login, verifique sua conexão',
          color: 'negative',
          textColor: 'white',
          icon: 'error_outline'
        })
      }
    },
    limparDados () {
      this.dadosInformados.emailDigitado = ''
      this.dadosInformados.senhaDigitada = ''
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
