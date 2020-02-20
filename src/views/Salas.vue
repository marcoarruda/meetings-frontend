<template>
  <v-card
    max-width="500"
    class="mx-auto"
  >
    <v-toolbar>

      <v-toolbar-title>Salas</v-toolbar-title>

      <v-spacer />

      <v-btn icon :disabled="disabled" @click="addSala">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-toolbar>
    <v-list>
      <v-list-item
        v-for="item in salas"
        :key="item.nome"
      >
        <template v-if="item.id === ''">
          <v-list-item-content>
            <v-text-field
              v-model="nome"
              label="Nome da Sala"
            />
          </v-list-item-content>

          <v-list-item-icon @click="confirmar">
            <v-btn icon>
              <v-icon> mdi-check</v-icon>
            </v-btn>
          </v-list-item-icon>

          <v-list-item-icon @click="cancelar">
            <v-btn icon>
              <v-icon> mdi-cancel</v-icon>
            </v-btn>
          </v-list-item-icon>
        </template>

        <template v-else>
          <v-list-item-content>
            <v-list-item-title v-text="item.nome" />
          </v-list-item-content>

          <v-list-item-icon>
            <v-btn icon :disabled="disabled" @click="editarSala(item.id)">
              <v-icon> mdi-pencil</v-icon>
            </v-btn>
          </v-list-item-icon>

          <v-list-item-icon>
            <v-btn icon :disabled="disabled" @click="removerSala(item.id)">
              <v-icon> mdi-delete</v-icon>
            </v-btn>
          </v-list-item-icon>

        </template>

      </v-list-item>
    </v-list>
  </v-card>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data(){
    return {
      disabled: false,
      nome: '',
      id: '',
    }
  },
  computed: {
    ...mapGetters({
      getUser: 'getUser',
      salas: 'getSalas',
    })
  },
  mounted(){
    this.listarSalas
    // eslint-disable-next-line no-console
    console.log(this.salas)
  },
  methods: {
    ...mapActions(['listarSalas', 'alterarSala', 'excluirSala', 'adicionarSala']),
    addSala(){
      this.disabled = true
      this.salas.push({
        id: '',
        nome: '',
      })
    },
    editarSala(id){
      this.disabled = true
      // eslint-disable-next-line no-console
      console.log(id)
      this.id = id
      for(let i in this.salas){
        if(this.salas[i].id == id){
          this.nome = this.salas[i].nome
          this.salas[i].id = ''
          break
        }
      }
    },
    removerSala(id){
      this.excluirSala(id)
    },
    confirmar(){
      if(this.id == ''){
        let params = {
          id: (Math.random() * this.salas.length) + this.nome,
          nome: this.nome
        }
        this.adicionarSala(params)
      }else {
        let params = {
          id: this.id,
          nome: this.nome
        }
        this.alterarSala(params)
      }
      this.cancelar()
    },
    cancelar(){
      this.nome = ''
      if(this.id == ''){
        for(let i in this.salas){
          if(this.salas[i].id == ''){
            this.salas.splice(i,1)
          }
        }
      }else {
        for(let i in this.salas){
          if(this.salas[i].id == ''){
            this.salas[i].id = this.id
          }
        }
        this.id = ''
      }
      // eslint-disable-next-line no-console
      console.log(this.salas)
      this.disabled = false
    }
  }
}
</script>