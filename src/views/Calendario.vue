/* eslint-disable vue/attribute-hyphenation */
<template>
  <v-row class="fill-height">
    <v-col>
      <!-- {{ teste }} -->
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">Today</v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer />
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn outlined color="grey darken-2" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-alert v-show="error" dense outlined type="error">{{ errorMessage }}</v-alert>
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :now="today"
          :type="type"
          @click:day="openFormCriar"
          @click:event="openFormEditar"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        />
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name" />
              <v-spacer />
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details" />
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
        <!-- eslint-disable-next-line vue/attribute-hyphenation -->
        <app-form
          :open="open"
          :data-dia="dataDia"
          :evento="evento"
          @openChanged="limparDados()"
          @dadosEvento="open=false; teste=$event; criarEvento(teste)"
          @deletar="teste=$event; deletarEvento(teste)"
        />
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import ReuniaoForm from '../components/Reuniao.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    appForm: ReuniaoForm
  },
  data: () => ({
    error: false,
    errorMessage: '',
    evento: '',
    dataDia: '',
    open: false,
    teste: 'teste',
    focus: '',
    today: new Date().toISOString().split('T')[0],
    type: 'month',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
      '4day': '4 Days'
    },
    start: null,
    end: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: [
      'blue',
      'indigo',
      'deep-purple',
      'cyan',
      'green',
      'orange',
      'grey darken-1'
    ],
    names: [
      'Meeting',
      'Holiday',
      'PTO',
      'Travel',
      'Event',
      'Birthday',
      'Conference',
      'Party'
    ]
  }),
  computed: {
    ...mapGetters(['getUser', 'getRequestParams']),
    title() {
      const { start, end } = this
      if (!start || !end) {
        return ''
      }

      const startMonth = this.monthFormatter(start)
      const endMonth = this.monthFormatter(end)
      const suffixMonth = startMonth === endMonth ? '' : endMonth

      const startYear = start.year
      const endYear = end.year
      const suffixYear = startYear === endYear ? '' : endYear

      const startDay = start.day + this.nth(start.day)
      const endDay = end.day + this.nth(end.day)

      switch (this.type) {
        case 'month':
          return `${startMonth} ${startYear}`
        case 'week':
        case '4day':
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`
        case 'day':
          return `${startMonth} ${startDay} ${startYear}`
      }
      return ''
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: 'UTC',
        month: 'long'
      })
    }
  },
  mounted() {
    this.$refs.calendar.checkChange()
  },
  methods: {
    viewDay({ date }) {
      this.focus = date
      this.type = 'day'
    },
    async listarReuniao() {

      try {
        this.error = false
        const response = await this.$http.get(
          'reuniao/listar/' + this.start.year + '/' + this.start.month,
          this.getRequestParams
        )
        let t = await response.json()
        // eslint-disable-next-line no-console
        console.log(this.getUser.username)
        this.events = []
        for (let i = 0; i < t.reunioes.length; i++) {
          this.events.push({
            id: t.reunioes[i].id,
            sala: t.reunioes[i].SalaId,
            name: t.reunioes[i].nome,
            start:
              t.reunioes[i].inicio.split('T')[0] +
              ' ' +
              t.reunioes[i].inicio.split('T')[1].split(':00.000Z')[0],
            end:
              t.reunioes[i].fim.split('T')[0] +
              ' ' +
              t.reunioes[i].fim.split('T')[1].split(':00.000Z')[0],
            color:
              this.getUser.username == t.reunioes[i].UserId
                ? this.colors[0]
                : this.colors[6]
          })
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('erro')
        this.errorMessage = err
        this.error = true
      }
    },
    openFormCriar({ date }) {
      this.dataDia = date
      this.open = true
    },
    openFormEditar({ event }) {
      this.evento = {
        id: event.id,
        sala: event.sala,
        dataI: event.start.split(' ')[0],
        dataF: event.end.split(' ')[0],
        inicio: event.start.split(' ')[1],
        fim: event.end.split(' ')[1],
        nome: event.name
      }
      this.open = true
    },
    limparDados() {
      this.dataDia = ''
      this.open = false
      this.evento = ''
      this.error = false
    },
    criarEvento(teste) {
      let evento = this.events.find(e => e.id == teste.id)
      if (evento != undefined) {
        evento.name = this.teste.nome
        evento.sala = this.teste.sala
        evento.start = this.teste.inicio
        evento.end = this.teste.fim
        evento.color = this.colors[0]
      } else {
        this.events.push({
          id: this.teste.id,
          sala: this.teste.sala,
          name: this.teste.nome,
          start: this.teste.inicio,
          end: this.teste.fim,
          color: this.colors[0]
        })
      }
      this.listarReuniao()
    },
    deletarEvento(id){
      let evento = this.events.filter(function(e){
        return e.id != id
      })
      this.events = evento
      this.listarReuniao()
    },
    getEventColor(event) {
      return event.color
    },
    setToday() {
      this.focus = this.today
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => (this.selectedOpen = true), 10)
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    updateRange({ start, end }) {
      this.start = start
      this.end = end
      this.listarReuniao()
    },
    nth(d) {
      return d > 3 && d < 21
        ? 'th'
        : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    formatDate(a, withTime) {
      return withTime
        ? `${a.getFullYear()}-${a.getMonth() +
            1}-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`
        : `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`
    }
  }
}
</script>