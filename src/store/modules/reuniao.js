import api from '../../api'

const state = {
  reuniao: null,
  reunioes: [],
  relatorio: [],
  salas: [],
  error: null
}

const getters = {
  getReuniao(state){
    return state.reuniao
  },
  getError(state) {
    return state.error
  },
  getReunioes(state){
    // eslint-disable-next-line no-console
    console.log('entrei getReunioes')
    return state.reunioes
  },
  getRelatorio(state){
    // eslint-disable-next-line no-console
    console.log('entrei getRelatorio')
    return state.relatorio
  },
  getSalas(state){
    // eslint-disable-next-line no-console
    console.log('entrei getSalas')
    return state.salas
  }
}

const mutations = {
  async mCriarReuniao(state, reuniao){
    let nome = reuniao.nome
    let sala_id = reuniao.sala_id
    let inicio = reuniao.inicio
    let fim = reuniao.fim

    try {
      let resposta = await api.agendarReuniao(nome, sala_id, inicio, fim)
      state.reuniao = resposta
      // eslint-disable-next-line no-console
      console.log('nao entrei no catch')
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.log(ex)
      state.error = ex
    }
  },
  async mAlterarReuniao(state, reuniao){
    let id = reuniao.id
    let nome = reuniao.nome
    let sala_id = reuniao.sala_id
    let inicio = reuniao.inicio
    let fim = reuniao.fim

    try {
      let resposta = await api.alterarReuniao(id, nome, sala_id, inicio, fim)
      state.reuniao = resposta
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.log(ex)
      state.error = ex
    }
  },
  mDeletarReuniao(state, id){
    api.deletarReuniao(id).then((resposta) => {
      state.reuniao = resposta
      // eslint-disable-next-line no-console
      console.log(state.reuniao)
    }).catch(ex => {
      // eslint-disable-next-line no-console
      console.log(ex)
      state.error = ex
    })
  },
  async mListarReunioes(state, params){
    try {
      let reunioes = await api.listarReuniao(params.ano, params.mes)
      state.reunioes = await reunioes.reunioes
      // eslint-disable-next-line no-console
      // console.log(state.reunioes)
    } catch (error) {
      state.error = error
    }
  },
  async mListarRelatorio(state, params){
    try {
      let relatorio = await api.listarRelatorio(params.user, params.ano, params.mes)
      state.relatorio = await relatorio.reunioes
      // eslint-disable-next-line no-console
      console.log(state.relatorio)

    } catch (error) {
      state.error = error
    }
  },
  async mListarSalas(state){
    try {
      let salas = await api.listarSalas()
      state.salas = await salas.salas
      // eslint-disable-next-line no-console
      console.log(state.salas)

    } catch (error) {
      state.error = error
    }
  }
}

const actions = {
  async criarReuniao(context, params){
    await context.commit('mCriarReuniao', params.reuniao)
    await context.commit('mListarReunioes', params.data)
  },
  async alterarReuniao(context, params){
    await context.commit('mAlterarReuniao', params.reuniao)
    await context.commit('mListarReunioes', params.data)
  },
  async deletarReuniao(context, params){
    // eslint-disable-next-line no-console
    console.log(params)
    await context.commit('mDeletarReuniao', params.id)
    await context.commit('mListarReunioes', params.data)
  },
  async listarReunioes(context, params){
    await context.commit('mListarReunioes',params)
  },
  async listarRelatorio(context, params){
    await context.commit('mListarRelatorio', params)
  },
  async listarSalas(context){
    await context.commit('mListarSalas')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}