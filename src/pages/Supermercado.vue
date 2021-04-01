<template>
  <div class="q-pa-md q-gutter-sm">
    <q-editor v-if="!modoEdicao"
      v-model="textoDigitado"
      :definitions="{
        save: {
          tip: 'Salvar item',
          icon: 'save',
          label: 'Salvar',
          handler: salvarDados
        }
      }"
      :toolbar="[
        ['bold', 'italic', 'strike', 'underline'],
        ['save']
      ]"
    />

    <q-editor v-else
      v-model="textoDigitado"
      :definitions="{
        save: {
          tip: 'Atualizar item',
          icon: 'app_registration',
          label: 'Atualizar',
          handler: atualizarDados
        }
      }"
      :toolbar="[
        ['bold', 'italic', 'strike', 'underline'],
        ['save']
      ]"
    />

    <q-card
      flat bordered
      v-for="(item,index) in listaSupermercado" :key="index"
    >
        <div class="row items-center">
          <q-card-section class="col" v-html="item.texto"/>
          <q-btn
            round
            class="q-ma-sm"
            color="positive"
            icon="done_outline"
            size="10px"
            @click="finalizar(index, item.id)"
          />
          <q-btn
            round
            class="q-ma-sm"
            color="blue"
            icon="create"
            size="10px"
            @click="editar(index, item.id)"
          />
          <q-btn
            round
            class="q-ma-sm"
            color="negative"
            icon="delete"
            size="10px"
            @click="remover(index, item.id)"
          />
        </div>
    </q-card>

    <div class="flex flex-center" v-if="listaSupermercado.length == 0">
      <h6> Não a itens cadastrados</h6>
    </div>

  </div>
</template>

<script>

import { db } from 'boot/firebase'

export default {
  name: 'Supermercado',
  data () {
    return {
      textoDigitado: '',
      listaSupermercado: [],
      indexEdicao: null, // Necessário para a edição
      modoEdicao: false, // Necessário para a edição
      idEdicao: null // Necessário para a edição
    }
  },
  created () {
    this.listarSupermercado()
  },
  methods: {
    async listarSupermercado () {
      try {
        const resDb = await db.collection('supermercado').get()
        resDb.forEach(res => {
          if (res.data().estado === false) {
            const itemBd = {
              id: res.id,
              texto: res.data().texto,
              estado: res.data().estado
            }
            this.listaSupermercado.push(itemBd)
          }
        })
      } catch (error) {
        this.$q.notify({
          message: 'Não foi possível listar os itens, verifique sua conexão',
          color: 'negative',
          textColor: 'white',
          icon: 'error_outline'
        })
      }
    },
    async salvarDados () {
      try {
        const resDb = await db.collection('supermercado').add({
          texto: this.textoDigitado,
          estado: false
        })

        this.listaSupermercado.push({
          texto: this.textoDigitado,
          estado: false,
          id: resDb.id
        })

        this.textoDigitado = ''

        this.$q.notify({
          message: 'Item salvo no banco de dados',
          color: 'positive',
          textColor: 'white',
          icon: 'cloud'
        })
      } catch (error) {
        this.$q.notify({
          message: 'Não foi possível salvar o item, verifique sua conexão',
          color: 'negative',
          textColor: 'white',
          icon: 'error_outline'
        })
      }
    },
    editar (index, id) {
      this.modoEdicao = true
      this.indexEdicao = index
      this.idEdicao = id
      this.textoDigitado = this.listaSupermercado[index].texto
    },
    async atualizarDados () {
      try {
        await db.collection('supermercado').doc(this.idEdicao).update({
          texto: this.textoDigitado
        })

        this.listaSupermercado[this.indexEdicao].texto = this.textoDigitado

        this.$q.notify({
          message: 'O item foi atualizado com sucesso no banco de dados',
          color: 'positive',
          textColor: 'white',
          icon: 'cloud_done'
        })
      } catch (error) {
        this.$q.notify({
          message: 'Não foi possível atualizar o item, verifique sua conexão',
          color: 'negative',
          textColor: 'white',
          icon: 'error_outline'
        })
      } finally {
        this.modoEdicao = false
        this.indexEdicao = null
        this.idEdicao = null
        this.textoDigitado = ''
      }
    },
    finalizar (index, id) {
      this.$q.dialog({
        title: 'Confirmar',
        message: 'Deseja realmente marcar o item como finalizado ?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await db.collection('supermercado').doc(id).update({
            estado: true
          })

          this.listaSupermercado.splice(index, 1)

          this.$q.notify({
            message: 'Item marcado como finalizado',
            color: 'positive',
            textColor: 'white',
            icon: 'done_all'
          })
        } catch (error) {
          this.$q.notify({
            message: 'Não foi possível marcar o item como finalizado, verifique sua conexão',
            color: 'negative',
            textColor: 'white',
            icon: 'error_outline'
          })
        }
      })
    },
    remover (index, id) {
      this.$q.dialog({
        title: 'Confirmar',
        message: 'Deseja realmente remover o item ?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await db.collection('supermercado').doc(id).delete()

          this.listaSupermercado.splice(index, 1)
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
    }
  }
}
</script>
