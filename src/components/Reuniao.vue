<template>
  <v-row justify="center">
    <v-dialog v-model="open" persistent max-width="600px">
      <v-form v-model="form.valid">
        <v-card color="grey lighten-4" min-width="350px">
          <v-toolbar color="blue">
            <v-toolbar-title>Reservar Sala</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="nome" label="Nome" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="sala"
                    :items="['01', '02', '03']"
                    label="Sala"
                    :rules="form.rules.ruleSelect"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-menu
                    v-model="menuDataI"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="dataI"
                        label="Data inicio"
                        :rules="[...form.rules.ruleNotEmpty, ...ruleFimData]"
                        readonly
                        v-on="on"
                      />
                    </template>
                    <v-date-picker v-model="dataI" @input="menuDataI = false" />
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-menu
                    v-model="menuDataF"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="dataF"
                        label="Data fim"
                        :rules="[...form.rules.ruleNotEmpty, ...ruleFimData]"
                        readonly
                        v-on="on"
                      />
                    </template>
                    <v-date-picker v-model="dataF" @input="menuDataF = false" />
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="11" sm="5">
                  <v-menu
                    ref="menu"
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="inicio"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="inicio"
                        label="Inicio"
                        :rules="[...form.rules.ruleNotEmpty, ...ruleFimData]"
                        readonly
                        v-on="on"
                      />
                    </template>
                    <v-time-picker
                      v-if="menu2"
                      v-model="inicio"
                      full-width
                      @click:minute="$refs.menu.save(inicio)"
                    />
                  </v-menu>
                </v-col>
                <v-col cols="11" sm="5">
                  <v-menu
                    ref="menu2"
                    v-model="modal2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="fim"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="fim"
                        label="Fim"
                        :rules="[...form.rules.ruleNotEmpty, ...ruleFimData]"
                        readonly
                        v-on="on"
                      />
                    </template>
                    <v-time-picker
                      v-if="modal2"
                      v-model="fim"
                      full-width
                      @click:minute="$refs.menu2.save(fim)"
                    />
                  </v-menu>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="secondary" @click="openChanged">Cancelar</v-btn>
            <v-btn text color="blue darken-1" :disabled="!form.valid" @click="dadosEvento">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: ['open', 'data', 'inicio', 'fim', 'nome', 'op'],
  data: () => ({
    dataI: new Date().toISOString().substr(0, 10),
    menuDataI: false,
    dataF: new Date().toISOString().substr(0, 10),
    menuDataF: false,
    form: {
      valid: false,
      rules: {
        ruleSelect: [v => !!v || 'Selecione um dos itens abaixo'],
        ruleNotEmpty: [v => !!v || 'Campo não pode ser vazio'],
      }
    },
    sala: '',
    menu2: false,
    modal2: false
  }),
  computed: {
    ruleFimData() {
      // eslint-disable-next-line no-console
      console.log(new Date(this.dataI+' '+this.inicio).getTime())
      // eslint-disable-next-line no-console
      console.log(new Date(this.dataF+' '+this.fim).getTime())
      return [
        v => (new Date(this.dataI+' '+this.inicio).getTime() < new Date(this.dataF+' '+this.fim).getTime()) || 'Inicio deve ser menor que fim'
      ]
    }
  },
  methods: {
    openChanged() {
      this.nome = ''
      this.fim = null
      this.inicio = null
      this.sala = ''
      this.data = ''
      this.open = false
      this.$emit('openChanged', this.open)
    },
    dadosEvento() {
      let evento = {
        nome: this.nome,
        inicio: this.data + ' ' + this.inicio,
        fim: this.data + ' ' + this.fim,
        sala: this.sala
      }
      this.nome = ''
      this.fim = null
      this.inicio = null
      this.sala = ''
      this.data = ''
      this.open = false
      this.$emit('dadosEvento', evento)
    }
  }
}
</script>