<template>
  <v-row justify="center">
    <v-dialog v-model="open" persistent max-width="600px">
      <v-card color="grey lighten-4" min-width="350px">
        <v-toolbar color="blue">
          <v-toolbar-title>Agendar Reunião</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row><v-col cols="12" sm="6">{{ data }}</v-col></v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="nome"
                  label="Nome"
                  required
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="sala"
                  :items="['01', '02', '03']"
                  label="Sala"
                  required
                />
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
          <v-btn text color="blue darken-1" @click="dadosEvento">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: ['open', 'data', 'inicio', 'fim', 'nome', 'op'],
  data: () => ({
    sala: '',
    menu2: false,
    modal2: false,
  }),
  methods: {
    openChanged() {
      this.nome=''
      this.fim=null
      this.inicio=null
      this.sala=''
      this.data=''
      this.open = false
      this.$emit('openChanged', this.open)
    },
    dadosEvento(){
      let evento = {
        nome: this.nome,
        inicio: this.data+' '+this.inicio,
        fim: this.data+' '+this.fim,
        sala: this.sala
      }
      this.nome=''
      this.fim=null
      this.inicio=null
      this.sala=''
      this.data=''
      this.open = false
      this.$emit('dadosEvento', evento)
    }
  }
}
</script>