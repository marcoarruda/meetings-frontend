<template>
  <div>
    <v-alert v-show="error" dense outlined type="error">{{ errorMessage }}</v-alert>
    <v-row>
      <v-col cols="8" sm="8" md="3" lg="2" xl="4" align="center">
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
      <v-col cols="8" sm="8" md="3" lg="2" xl="4" align="center">
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
      itens: [],
      loading: false,
      error: false,
      errorMessage: '',
      menu: false,
      // salas: '',
      // reunioes: [],
      user: '',
      users: [],
      date: new Date().getFullYear() + '-' + (new Date().getMonth() + 1)
    }
  },
  computed: {
    ...mapGetters(['getUser', 'getRequestParams', 'getRelatorio', 'getSalas']),
    reunioes() {
      return this.getRelatorio
    },
    salas(){
      return this.getSalas
    }
  },
  watch: {
    user() {
      this.loading = true
      this.exibirRelatorio()
    },
    date() {
      this.loading = true
      this.exibirRelatorio()
    }
  },
  mounted() {
    this.loading = true
    this.user = this.getUser.username
    this.users.push({
      id: this.getUser.username,
      nome: this.getUser.attributes.name
    })
    this.listarSalas()
    let [ano, mes] = this.date.split('-')
    let params = {
      user: this.user,
      ano,
      mes
    }
    this.listarRelatorio(params)
    this.exibirRelatorio()
  },
  methods: {
    ...mapActions(['listarRelatorio', 'listarSalas']),
    organizeTable() {
      this.itens = []
      for (let i = 0; i < this.salas.length; i++) {
        let duracao = 0
        for (let j = 0; j < this.reunioes.length; j++) {
          if (
            this.salas[i].id == this.reunioes[j].SalaId &&
            this.reunioes[i].UserId == this.getUser.username
          ) {
            duracao += this.calculaTempo(
              this.reunioes[i].inicio,
              this.reunioes[i].fim
            )
          }
        }
        duracao = this.convertTempo(duracao)
        this.itens.push({
          sala: this.salas[i].nome,
          tempo: duracao
        })
      }
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
      try {
        this.error = false
        // const response = await this.$http.get(
        //   `reuniao/relatorio/${this.user}/${ano}/${mes}`,
        //   this.getRequestParams
        // )
        // let t = await response.json()
        // this.reunioes = t.reunioes
        // eslint-disable-next-line no-console
        console.log(this.reunioes)
        this.organizeTable()
        this.loading = false
      } catch (err) {
        this.loading = false
        this.error = true
        if (err.data.message != undefined) {
          this.errorMessage = err.data.message.message
        } else {
          this.errorMessage = 'Houve um erro, tente novamente mais tarde'
        }
      }
    },
    async listarSala() {
      // try {
      //   this.error = false
      //   const response = await this.$http.get(
      //     'sala/listar',
      //     this.getRequestParams
      //   )
      //   let t = await response.json()
      //   this.salas = t.salas
      //   // eslint-disable-next-line no-console
      //   console.log(this.salas)
      // } catch (err) {
      //   this.error = true
      //   if (err.data.message != undefined) {
      //     this.errorMessage = err.data.message.message
      //   } else {
      //     this.errorMessage = 'Houve um erro, tente novamente mais tarde'
      //   }
      // }
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
