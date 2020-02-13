import Vue from 'vue'
import store from '../src/store/index.js'

export default {
  async agendarReuniao(nome, sala_id, inicio, fim) {
    let params = { nome, sala_id, inicio, fim }
    let reuniao = null
    try {
      reuniao = await Vue.http.post('reuniao/agendar',
        params,
        store.getters.getRequestParams
      )
      // eslint-disable-next-line no-console
      console.log(reuniao)
      store.actions.setReuniao(reuniao.data)

    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
      reuniao = error
    }
    return reuniao
  },
  async alterarReuniao(id, nome, sala_id, inicio, fim) {
    let params = { id, nome, sala_id, inicio, fim }
    try {
      let response = await Vue.http.post('reuniao/alterar',
        params,
        store.getters.getRequestParams
      )
      let reuniao = response
      // eslint-disable-next-line no-console
      console.log(reuniao)

    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
  },
  async deletarReuniao(id) {
    try {
      let response = await Vue.http.delete(`reuniao/excluir/${id}`,
        store.getters.getRequestParams
      )
      let reuniao = response
      // eslint-disable-next-line no-console
      console.log(reuniao)

    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
  },
  async listarReuniao(ano, mes){
    let reunioes = []
    try {
      let response = await Vue.http.get(`reuniao/listar/${ano}/${mes}`,
        store.getters.getRequestParams
      )
      reunioes = await response.json()
      // eslint-disable-next-line no-console
      console.log(reunioes)

    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
    return reunioes
  },
  async listarRelatorio(user, ano, mes){
    try {
      let response = await Vue.http.get(`reuniao/relatorio/${user}/${ano}/${mes}`,
        store.getters.getRequestParams
      )
      let reuniao = response
      // eslint-disable-next-line no-console
      console.log(reuniao)

    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
  }
}