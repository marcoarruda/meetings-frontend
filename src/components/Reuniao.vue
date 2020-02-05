<template>
  <v-row justify="center">
    <v-dialog v-model="open" persistent max-width="600px">
      <v-form ref="form" v-model="form.valid">
        <v-card color="grey lighten-4" min-width="350px">
          <v-toolbar color="blue">
            <v-toolbar-title>Reservar Sala</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.nome" label="Nome" 
                    :rules="[...form.rules.ruleNotEmpty, ...ruleLength]"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="formData.sala"
                    :items="['01', '02', '03']"
                    label="Sala"
                    :rules="form.rules.ruleSelect"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-menu
                    v-model="formData.menuDataI"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="formData.dataI"
                        label="Data inicio"
                        :rules="form.rules.ruleNotEmpty"
                        readonly
                        v-on="on"
                      />
                    </template>
                    <v-date-picker v-model="formData.dataI" @input="formData.menuDataI = false" />
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-menu
                    v-model="formData.menuDataF"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="formData.dataF"
                        label="Data fim"
                        :rules="[...form.rules.ruleNotEmpty, ...ruleFimData]"
                        readonly
                        v-on="on"
                      />
                    </template>
                    <v-date-picker v-model="formData.dataF" @input="formData.menuDataF = false" />
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
                    :return-value.sync="formData.inicio"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="formData.inicio"
                        label="Inicio"
                        :rules="form.rules.ruleNotEmpty"
                        readonly
                        v-on="on"
                      />
                    </template>
                    <v-time-picker
                      v-if="menu2"
                      v-model="formData.inicio"
                      full-width
                      @click:minute="$refs.menu.save(formData.inicio)"
                    />
                  </v-menu>
                </v-col>
                <v-col cols="11" sm="5">
                  <v-menu
                    ref="menu2"
                    v-model="modal2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="formData.fim"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="formData.fim"
                        label="Fim"
                        :rules="[...form.rules.ruleNotEmpty, ...ruleFimData]"
                        readonly
                        v-on="on"
                      />
                    </template>
                    <v-time-picker
                      v-if="modal2"
                      v-model="formData.fim"
                      full-width
                      @click:minute="$refs.menu2.save(formData.fim)"
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
  props: ['open', 'dataDia', 'evento'],
  data() {
    return {
      ready: false,
      formData: {
        id:'',
        inicio: null,
        fim: null,
        nome: '',
        sala: '',
        dataI:null,
        menuDataI: false,
        dataF: null,
        menuDataF: false
      },
      form: {
        valid: false,
        rules: {
          ruleSelect: [v => !!v || 'Selecione um dos itens abaixo'],
          ruleNotEmpty: [v => !!v || 'Campo não pode ser vazio']
        }
      },
      menu2: false,
      modal2: false
    }
  },
  computed: {
    ruleFimData() {
      // eslint-disable-next-line no-console
      // console.log(new Date(this.formData.dataI + ' ' + this.inicio).getTime())
      // eslint-disable-next-line no-console
      // console.log(new Date(this.formData.dataF + ' ' + this.fim).getTime())
      return [
        v =>
          new Date(this.formData.dataI + ' ' + this.formData.inicio).getTime() <
            new Date(this.formData.dataF + ' ' + this.formData.fim).getTime() ||
          'Inicio deve ser menor que fim'
      ]
    },
    ruleLength() {
      return [
        v => this.formData.nome.length > 3 || 'Nome deve ter no minimo 4 caracteres'
      ]
    }
  },
  watch:{
    dataDia(){
      if(this.dataDia != ''){
        this.formData.dataI = this.dataDia
        this.formData.dataF = this.dataDia
      }
    },
    evento(){
      if(this.evento != ''){
        this.formData.id = this.evento.id
        this.formData.sala = this.evento.sala
        this.formData.inicio = this.evento.inicio
        this.formData.fim = this.evento.fim
        this.formData.dataI = this.evento.dataI
        this.formData.dataF = this.evento.dataF
        this.formData.nome = this.evento.nome
      }
    },
    formData:{
      deep: true,
      handler(to, from) {
        this.$refs.form != undefined && this.$refs.form.validate()
      }
    }
  },
  mounted(){
    this.ready = true
  },
  methods: {
    openChanged() {
      this.formData.id = ''
      this.formData.nome = ''
      this.formData.fim = null
      this.formData.inicio = null
      this.formData.sala = ''
      this.dataDia = ''
      this.open = false
      this.$emit('openChanged', this.open)
    },
    dadosEvento() {
      let evento = {
        id: this.formData.id,
        nome: this.formData.nome,
        inicio: this.formData.dataI + ' ' + this.formData.inicio,
        fim: this.formData.dataI + ' ' + this.formData.fim,
        sala: this.formData.sala
      }
      this.formData.id=''
      this.formData.nome = ''
      this.formData.fim = null
      this.formData.inicio = null
      this.formData.sala = ''
      this.dataDia = ''
      this.open = false
      this.$emit('dadosEvento', evento)
    }
  }
}
</script>