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
      return reuniao

    } catch (error) {
      let erro = 'Houve um erro, tente novamente mais tarde'
      if(error.data != '' ){
        erro = error.data.message.message
      }
      throw new Error(erro)
    }
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
      return reuniao

    } catch (error) {
      let erro = 'Houve um erro, tente novamente mais tarde'
      if(error.data != '' ){
        erro = error.data.message.message
      }
      throw new Error(erro)
    }
  },
  async deletarReuniao(id) {
    let reuniaoDeletada = null
    try {
      let response = await Vue.http.delete(`reuniao/excluir/${id}`,
        store.getters.getRequestParams
      )
      reuniaoDeletada =  await response.json()
      return reuniaoDeletada

    } catch (error) {
      let erro = 'Houve um erro, tente novamente mais tarde'
      if(error.data != '' ){
        erro = error.data.message.message
      }
      throw new Error(erro)
    }
  },
  async listarReuniao(ano, mes){
    let reunioes = []
    try {
      let response = await Vue.http.get(`reuniao/listar/${ano}/${mes}`,
        store.getters.getRequestParams
      )
      reunioes = await response.json()
      return reunioes

    } catch (error) {
      let erro = 'Houve um erro, tente novamente mais tarde'
      if(error.data != '' ){
        erro = error.data.message.message
      }
      throw new Error(erro)
    }
  },
  async listarRelatorio(user, ano, mes){
    let relatorio = []
    try {
      let response = await Vue.http.get(`reuniao/relatorio/${user}/${ano}/${mes}`,
        store.getters.getRequestParams
      )
      relatorio = await response.json()

      return relatorio

    } catch (error) {
      let erro = 'Houve um erro, tente novamente mais tarde'
      if(error.data != '' ){
        erro = error.data.message.message
      }
      throw new Error(erro)
    }
  },
  async listarSalas(){
    let salas = []
    try {
      let response = await Vue.http.get('sala/listar',
        store.getters.getRequestParams
      )
      salas = await response.json()
      return salas

    } catch (error) {
      let erro = 'Houve um erro, tente novamente mais tarde'
      if(error.data != '' ){
        erro = error.data.message.message
      }
      throw new Error(erro)
    }
  },
}