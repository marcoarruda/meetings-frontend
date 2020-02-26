/* eslint-disable vue/attribute-hyphenation */
<template>
  <v-row class="fill-height">
    <v-col>
      <!-- Menu superior -->
      <v-sheet height="100">
        <v-toolbar flat color="white" height="100">
          <v-container>
            <v-row>
              <v-col cols="6" sm="2" md="1" lg="1" xl="1" align="right" order="1" order-lg="1" order-sm="1">
                <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">Hoje</v-btn>

              </v-col>
              <v-col cols="2" align="center" order="3" order-lg="2" order-sm="2">
                <v-btn fab text small color="grey darken-2" @click="prev">
                  <v-icon small>mdi-chevron-left</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="7" sm="3" md="3" lg="2" xl="4" align="center" order="4" order-lg="3" order-sm="3">
                <v-toolbar-title>{{ title }}</v-toolbar-title>
              </v-col>
              <v-col cols="2" align="center" order="5" order-lg="4" order-sm="4">
                <v-btn fab text small color="grey darken-2" @click="next">
                  <v-icon small>mdi-chevron-right</v-icon>
                </v-btn>

              </v-col>
              <v-col cols="6" sm="2" md="1" lg="1" xl="1" align="left" order="2" order-lg="5" order-sm="5">
                <v-menu bottom right>
                  <template v-slot:activator="{ on }">
                    <v-btn outlined color="grey darken-2" v-on="on">
                      <span>{{ typeToLabel[type] }}</span>
                      <v-icon right>mdi-menu-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="type = 'day'">
                      <v-list-item-title>Dia</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="type = 'week'">
                      <v-list-item-title>Semana</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="type = 'month'">
                      <v-list-item-title>Mês</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="type = '4day'">
                      <v-list-item-title>4 dias</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>

              </v-col>

            </v-row>

          </v-container>
        </v-toolbar>
      </v-sheet>
      <!-- Calendario -->
      <v-sheet height="600">
        <v-progress-linear v-show="loading" indeterminate color="light-blue" />
        <v-alert v-show="erro != ''" dense outlined type="error">{{ erro }}</v-alert>
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          locale="pt"
          :events="events"
          :event-color="getEventColor"
          :now="today"
          :type="type"
          :loading="true"
          @click:time="openFormCriarTime"
          @click:day="openFormCriar"
          @click:event="openFormEditar"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        />
        <!-- eslint-disable-next-line vue/attribute-hyphenation -->
      </v-sheet>

      <!-- Form -->
      <app-form :open="open" :data-dia="dataDia" :hora="hora" :evento="formEvento" @closed="limparDados" />
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
    formEvento: { },
    dataDia: '',
    hora: '',
    open: false,
    focus: '',
    today: new Date().toISOString().split('T')[0],
    type: 'week',
    typeToLabel: {
      month: 'Mês',
      week: 'Semana',
      day: 'Dia',
      '4day': '4 dias'
    },
    start: null,
    end: null,
    colors: [
      'blue',
      'indigo',
      'deep-purple',
      'cyan',
      'green',
      'orange',
      'grey darken-1'
    ],
  }),
  computed: {
    ...mapGetters([
      'getUser',
      'getReunioes',
      'getError',
      'getLoading'
    ]),
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
    },
    erro() {
      return this.getError
    },
    events() {
      return this.getReunioes.map(r => ({
        id: r.id,
        sala: r.SalaId,
        name: r.nome,
        start:
          r.inicio.split('T')[0] +
          ' ' +
          r.inicio.split('T')[1].split(':00.000Z')[0],
        end:
          r.fim.split('T')[0] + ' ' + r.fim.split('T')[1].split(':00.000Z')[0],
        color:
          this.getUser.username == r.UserId ? this.colors[0] : this.colors[6]
      }))
    },
    loading() {
      return this.getLoading
    }
  },
  mounted() {
    this.$refs.calendar.checkChange()
  },
  methods: {
    ...mapActions(['listarReunioes', 'setLoading']),
    viewDay({ date }) {
      this.focus = date
      this.type = 'day'
    },
    openFormCriarTime({ date, hour }) {
      this.dataDia = date
      this.hora = hour
      if(hour == 0){
        this.hora = '0'
      }
      this.open = true
    },
    openFormCriar({ date }) {
      this.dataDia = date
      this.open = true
    },
    openFormEditar({ event }) {
      this.formEvento = {
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
      this.hora = ''
      this.formEvento = {
        id: '',
        sala: '',
        dataI: '',
        dataF: '',
        inicio: '',
        fim: '',
        nome: ''
      }
      this.open = false
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
    async updateRange({ start, end }) {
      this.setLoading(true)
      this.start = start
      this.end = end
      let params = {
        ano: this.start.year,
        mes: this.start.month
      }
      await this.listarReunioes(params)
      // eslint-disable-next-line no-console
      console.log('apos listar')
    },
    nth(d) {
      return d > 3 && d < 21
        ? 'th'
        : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
    },
  }
}
</script>