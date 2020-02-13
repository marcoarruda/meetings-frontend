import Vue from 'vue'
import store from '../src/store/index.js'

export default {
  async agendarReuniao(nome, sala_id, inicio, fim) {
    let params = { nome, sala_id, inicio, fim }
    let reuniao = null
    try {
      let response = await Vue.http.post('reuniao/agendar',
        params,
        store.getters.getRequestParams
      )
      reuniao =  await response.json()
      // eslint-disable-next-line no-console
      console.log(reuniao)

    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
      reuniao = error
    }
    return reuniao
  },
  async alterarReuniao(id, nome, sala_id, inicio, fim) {
    let params = { id, nome, sala_id, inicio, fim }
    let reuniao = null
    try {
      let response = await Vue.http.put('reuniao/alterar',
        params,
        store.getters.getRequestParams
      )
      reuniao =  await response.json()
      // eslint-disable-next-line no-console
      console.log(reuniao)

    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
      reuniao = error
    }
    return reuniao
  },
  async deletarReuniao(id) {
    let reuniaoDeletada = null
    try {
      let response = await Vue.http.delete(`reuniao/excluir/${id}`,
        store.getters.getRequestParams
      )
      reuniaoDeletada =  await response.json()
      // eslint-disable-next-line no-console
      console.log(reuniaoDeletada)

    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
      reuniaoDeletada = error
    }
    return reuniaoDeletada
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
    let relatorio = []
    try {
      let response = await Vue.http.get(`reuniao/relatorio/${user}/${ano}/${mes}`,
        store.getters.getRequestParams
      )
      relatorio = await response.json()
      // eslint-disable-next-line no-console
      console.log(relatorio)

    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
    return relatorio
  },
  async listarSalas(){
    let salas = []
    try {
      let response = await Vue.http.get('sala/listar',
        store.getters.getRequestParams
      )
      salas = await response.json()
      // eslint-disable-next-line no-console
      console.log(salas)

    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
    return salas
  },
}