<template>
  <v-row justify="center">
    <v-dialog v-model="open" max-width="600px" @click:outside="openChanged">
      <v-form ref="form" v-model="form.valid">
        <v-card color="grey lighten-4" min-width="350px">
          <v-toolbar color="blue">
            <v-toolbar-title>Reservar Sala</v-toolbar-title>
            <v-spacer />

            <v-btn icon :disabled="formData.id == '' || loading" @click="deletar">
              <v-icon color="white">mdi-delete</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col v-show="erro != ''" cols="12" md="12" lg="12" xl="12">
                  <v-alert dense outlined type="error">{{ erro }}</v-alert>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.nome"
                    label="Nome"
                    :rules="[...form.rules.ruleNotEmpty, ...ruleLength]"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="formData.sala"
                    :items="salas"
                    item-text="nome"
                    item-value="id"
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
                        prepend-icon="mdi-calendar"
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
                        prepend-icon="mdi-calendar"
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
                        prepend-icon="mdi-clock"
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
                  <!-- <v-card-text>
                    <v-text-field v-model="formData.fim" v-mask="mask" label="Value"></v-text-field>
                  </v-card-text>-->
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
                        prepend-icon="mdi-clock"
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
            <v-btn text color="secondary" :disabled="loading" @click="openChanged">Cancelar</v-btn>
            <v-btn
              text
              color="blue darken-1"
              :disabled="!form.valid"
              :loading="loading"
              @click="dadosEvento"
            >Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-row>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { mask } from 'vue-the-mask'

export default {
  directives: {
    mask
  },
  props: ['open', 'dataDia', 'hora', 'evento'],
  data() {
    return {
      mask: '##:##',
      ready: false,
      salvar: '',
      formData: {
        id: '',
        inicio: null,
        fim: null,
        nome: '',
        sala: '',
        dataI: null,
        menuDataI: false,
        dataF: null,
        menuDataF: false
      },
      form: {
        valid: false,
        rules: {
          ruleSelect: [v => !!v || 'Selecione um dos itens abaixo'],
          ruleNotEmpty: [v => !!v || 'Campo não pode ser vazio'],
        }
      },
      menu2: false,
      modal2: false
    }
  },
  computed: {
    ...mapGetters(['getUser', 'getRequestParams', 'getErrorForm', 'getSalas', 'getLoading']),
    ruleFimData() {
      return [
        v =>
          new Date(this.formData.dataI + ' ' + this.formData.inicio).getTime() <
            new Date(this.formData.dataF + ' ' + this.formData.fim).getTime() ||
          'Inicio deve ser menor que fim'
      ]
    },
    ruleLength() {
      return [
        v =>
          this.formData.nome.length > 3 ||
          'Nome deve ter no minimo 4 caracteres'
      ]
    },
    salas(){
      return this.getSalas
    },
    erro(){
      return this.getErrorForm
    },
    loading(){
      return this.getLoading
    }
  },
  watch: {
    erro(){
      if(this.erro == 'OK' && this.salvar){
        this.openChanged()
      }
    },
    dataDia() {
      if(this.evento.id == ''){
        if (this.dataDia != '') {
          this.formData.dataI = this.dataDia
          this.formData.dataF = this.dataDia
        }
        if(this.hora != ''){
          if(this.hora == '0'){
            this.formData.inicio = '00:00'
            this.hora = 0
          }else{
            this.formData.inicio = this.hora < 10 ? '0'+this.hora+':'+'00':this.hora+':'+'00'
          }
          let fim = this.hora + 1
          if((this.hora+1) == 24){
            fim = 0
            this.formData.dataF = new Date(new Date(this.dataDia).getTime()+(24*60*60*1000)).toISOString().split('T')[0]
          }
          this.formData.fim = fim < 10 ? '0'+fim+':'+'00':fim+':'+'00'
        }
        if(this.$refs.form !== undefined){
          this.$refs.form.resetValidation()
        }
      }
    },
    evento() {
      if (this.evento != '') {
        this.formData.id = this.evento.id
        this.formData.sala = this.evento.sala
        this.formData.inicio = this.evento.inicio
        this.formData.fim = this.evento.fim
        this.formData.dataI = this.evento.dataI
        this.formData.dataF = this.evento.dataF
        this.formData.nome = this.evento.nome
      }
    },
    formData: {
      deep: true,
      handler(to, from) {
        this.$refs.form != undefined && this.$refs.form.validate()
      }
    }
  },
  mounted() {
    this.ready = true
    this.salvar = false
    this.listarSalas()
    this.setErrorForm()
  },
  methods: {
    ...mapActions(['criarReuniao', 'alterarReuniao', 'deletarReuniao', 'listarSalas', 'setErrorForm', 'setLoading']),
    openChanged() {
      this.setErrorForm()
      this.salvar = false
      this.open = false
      this.$emit('closed')
    },
    async dadosEvento() {
      this.setLoading(true)
      let reuniaoParams = {
        id: this.formData.id,
        nome: this.formData.nome,
        sala_id: this.formData.sala,
        inicio: this.formData.dataI + 'T' + this.formData.inicio + 'Z',
        fim: this.formData.dataF + 'T' + this.formData.fim + 'Z'
      }

      let params = {
        reuniao: reuniaoParams,
        data: {
          ano: this.dataDia.split('-')[0],
          mes: this.dataDia.split('-')[1]
        }
      }

      if (this.formData.id == '') {
        await this.criarReuniao(params)
      } else {
        await this.alterarReuniao(params)
      }

      this.salvar = true
    },
    async deletar() {
      this.setLoading(true)
      if (this.formData.id != '') {

        let params = {
          id: this.formData.id,
          data: {
            ano: this.dataDia.split('-')[0],
            mes: this.dataDia.split('-')[1]
          }
        }

        await this.deletarReuniao(params)

        this.salvar = true
      }
    }
  }
}
</script>