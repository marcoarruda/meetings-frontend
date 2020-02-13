<template>
  <v-row justify="center">
    <v-dialog v-model="open" max-width="600px">
      <v-form ref="form" v-model="form.valid">
        <v-card color="grey lighten-4" min-width="350px" @close="openChanged">
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
                <v-col v-show="error" cols="12" md="12" lg="12" xl="12">
                  <v-alert dense outlined type="error">{{ errorMessage }}</v-alert>
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
  props: ['open', 'dataDia', 'evento'],
  data() {
    return {
      mask: '##:##',
      loading: false,
      ready: false,
      // salas: '',
      error: false,
      errorMessage: '',
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
          ruleNotEmpty: [v => !!v || 'Campo não pode ser vazio']
        }
      },
      menu2: false,
      modal2: false
    }
  },
  computed: {
    ...mapGetters(['getUser', 'getRequestParams', 'getReuniao', 'getError', 'getSalas']),
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
    }
  },
  watch: {
    dataDia() {
      if (this.dataDia != '') {
        this.formData.dataI = this.dataDia
        this.formData.dataF = this.dataDia
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
    this.listarSalas()
  },
  methods: {
    ...mapActions(['criarReuniao', 'alterarReuniao', 'deletarReuniao', 'listarSalas']),
    openChanged() {
      // eslint-disable-next-line no-console
      console.log('openChanged')
      this.error = false
      this.formData.id = ''
      this.formData.nome = ''
      this.formData.fim = null
      this.formData.inicio = null
      this.formData.sala = ''
      this.dataDia = ''
      this.open = false
      this.$emit('openChanged', this.open)
    },
    async dadosEvento() {
      try {
        this.loading = true

        this.error = false
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

        // eslint-disable-next-line no-console
        console.log(params)
        if (this.formData.id == '') {
          await this.criarReuniao(params)
        } else {
          await this.alterarReuniao(params)
        }

        this.loading = false
        this.formData.id = ''
        this.formData.nome = ''
        this.formData.fim = null
        this.formData.inicio = null
        this.formData.sala = ''
        this.dataDia = ''
        this.open = false
        this.$emit('dadosEvento')
      } catch (err) {
        this.loading = false
        this.error = true
        // eslint-disable-next-line no-console
        console.log(err)
        // if (this.getError.data.message != undefined) {
        //   this.errorMessage = this.getError.data.message.message
        // } else {
        //   this.errorMessage = 'Houve um erro, tente novamente mais tarde'
        // }
      }
    },
    async listarSala() {
      // try {
      //   this.loading = true
      //   this.error = false
      //   const response = await this.$http.get(
      //     'sala/listar',
      //     this.getRequestParams
      //   )
      //   let t = await response.json()
      //   this.salas = t.salas
      //   this.loading = false
      //   // eslint-disable-next-line no-console
      //   console.log(this.salas)
      // } catch (err) {
      //   this.loading = false
      //   this.error = true
      //   if (err.data != undefined) {
      //     this.errorMessage = err.data.message.message
      //   } else {
      //     this.errorMessage = 'Houve um erro, tente novamente mais tarde'
      //   }
      // }
    },
    async deletar() {
      if (this.formData.id != '') {
        // eslint-disable-next-line no-console
        console.log('entrei no deletar')
        try {
          this.loading = true
          this.error = false

          let params = {
            id: this.formData.id,
            data: {
              ano: this.dataDia.split('-')[0],
              mes: this.dataDia.split('-')[1]
            }
          }

          await this.deletarReuniao(params)

          this.$emit('deletar', this.formData.id)
          this.openChanged()
          this.loading = false
        } catch (err) {
          this.loading = false
          this.error = true
          if (err.data != undefined) {
            this.errorMessage = err.data.message.message
          } else {
            this.errorMessage = 'Houve um erro, tente novamente mais tarde'
          }
        }
      }
    }
  }
}
</script>