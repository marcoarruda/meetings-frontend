<template>
  <div>
    <v-alert v-show="erro != '' " dense outlined type="error">{{ erro }}</v-alert>
    <v-row>
      <v-col cols="12" sm="3" md="3" lg="2" xl="4" align="center">
        <v-select
          v-model="user"
          :items="users"
          item-text="nome"
          item-value="id"
          label="Usuarios"
          prepend-icon="mdi-account"
          class="mt-4"
        />
      </v-col>
      <v-col cols="2" sm="2" md="1" lg="1" xl="1" align="right">
        <button class="mt-8" @click.prevent="prevMonth">
          <v-icon>mdi-arrow-left</v-icon>
        </button>
      </v-col>
      <v-col cols="8" sm="3" md="3" lg="2" xl="4" align="center">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="date"
              label="Selecionar data"
              prepend-icon="mdi-calendar"
              readonly
              class="mt-4"
              v-on="on"
            />
          </template>
          <v-date-picker v-model="date" type="month" locale="pt-br" @input="menu = false" />
        </v-menu>
      </v-col>
      <v-col cols="2" sm="2" md="1" lg="1" xl="1" align="left">
        <button class="mt-8" @click.prevent="nextMonth">
          <v-icon>mdi-arrow-right</v-icon>
        </button>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="itens"
      :items-per-page="5"
      :loading="loading"
      class="elevation-1"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Relatorio',
  data() {
    return {
      headers: [
        { text: 'Sala', value: 'sala' },
        { text: 'Tempo utilizado', value: 'tempo' }
      ],
      menu: false,
      user: '',
      date: new Date().getFullYear() + '-' + (new Date().getMonth() + 1)
    }
  },
  computed: {
    ...mapGetters({
      getUser: 'getUser',
      getUsers: 'getUsers',
      getRequestParams: 'getRequestParams',
      reunioes: 'getRelatorio',
      salas: 'getSalas',
      erro: 'getError',
      loading: 'getLoading'
    }),
    itens() {
      return this.organizeTable()
    },
    users(){
      return this.getUsers.map(e => ({
        id: e.id,
        nome: e.name
      }))
    }
  },
  watch: {
    user() {
      this.setLoading(true)
      let [ano, mes] = this.date.split('-')
      let params = {
        user: this.user,
        ano,
        mes
      }
      this.listarRelatorio(params)
    },
    date() {
      this.setLoading(true)
      let [ano, mes] = this.date.split('-')
      let params = {
        user: this.user,
        ano,
        mes
      }
      this.listarRelatorio(params)
    }
  },
  mounted() {
    this.setLoading(true)
    this.user = this.getUser.username
    this.listarUsuarios()
    let [year, month] = this.yearMonth()
    this.date = this.normalize(year, month)
    this.listarSalas()
    let [ano, mes] = this.date.split('-')
    let params = {
      user: this.user,
      ano,
      mes
    }
  },
  methods: {
    ...mapActions(['listarRelatorio', 'listarSalas', 'setLoading', 'listarUsuarios']),
    organizeTable() {
      let itens = []
      for (let i = 0; i < this.salas.length; i++) {
        let duracao = 0
        for (let j = 0; j < this.reunioes.length; j++) {
          if (
            this.salas[i].id == this.reunioes[j].SalaId &&
            this.reunioes[i].UserId == this.user
          ) {
            duracao += this.calculaTempo(
              this.reunioes[i].inicio,
              this.reunioes[i].fim
            )
          }
        }
        duracao = this.convertTempo(duracao)
        itens.push({
          sala: this.salas[i].nome,
          tempo: duracao
        })
      }
      return itens
    },
    calculaTempo(inicio, fim) {
      return new Date(fim).getTime() - new Date(inicio).getTime()
    },
    convertTempo(duracao) {
      let segundos = Math.floor((duracao / 1000) % 60)
      let minutos = Math.floor((duracao / (1000 * 60)) % 60)
      let horas = Math.floor((duracao / (1000 * 60 * 60)) % 24)
      horas = horas < 10 ? '0' + horas : horas
      minutos = minutos < 10 ? '0' + minutos : minutos
      segundos = segundos < 10 ? '0' + segundos : segundos
      return horas + ':' + minutos + ':' + segundos
    },
    async exibirRelatorio() {

    },
    async listarSala() {

    },
    yearMonth: function() {
      let year_month = this.date.split('-')
      let year = parseInt(year_month[0])
      let month = parseInt(year_month[1])
      let arr = [year, month]
      return arr
    },
    prevMonth() {
      let [year, month] = this.yearMonth()
      month -= 1
      this.date = this.normalize(year, month)
    },
    nextMonth() {
      let [year, month] = this.yearMonth()
      month += 1
      this.date = this.normalize(year, month)
    },
    normalize(year, month) {
      // fix values
      if (month == 0) {
        month = 12
        year -= 1
      }
      if (month == 13) {
        month = 1
        year += 1
      }

      // format string
      month = month.toString()
      if (month.length == 1) {
        month = '0' + month
      }
      return `${year}-${month}`
    }
  }
}
</script>
