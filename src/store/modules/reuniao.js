import api from '../../api'

const state = {
  reuniao: null,
  reunioes: [],
  relatorio: [],
  salas: [],
  error: null,
  errorForm: null,
  open: false,
}

const getters = {
  getReuniao(state){
    return state.reuniao
  },
  getOpen(state){
    return state.open
  },
  getError(state) {
    // eslint-disable-next-line no-console
    console.log('entrei getError')
    return state.error
  },
  getErrorForm(state) {
    // eslint-disable-next-line no-console
    console.log('entrei getError')
    return state.errorForm
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
  async mCriarReuniao(state, params){
    let nome = params.reuniao.nome
    let sala_id = params.reuniao.sala_id
    let inicio = params.reuniao.inicio
    let fim = params.reuniao.fim
    let ano = params.data.ano
    let mes = params.data.mes

    try {
      let resposta = await api.agendarReuniao(nome, sala_id, inicio, fim)
      state.reuniao = resposta
      let reunioes = await api.listarReuniao(ano, mes)
      state.reunioes = reunioes.reunioes
      state.errorForm = 'OK'

    } catch (error) {
      state.errorForm = error.toString().split(': ')[1]
      // eslint-disable-next-line no-console
      console.log(state.error)
      // throw new Error(error)

    }
  },
  async mAlterarReuniao(state, params){
    let id = params.reuniao.id
    let nome = params.reuniao.nome
    let sala_id = params.reuniao.sala_id
    let inicio = params.reuniao.inicio
    let fim = params.reuniao.fim
    let ano = params.data.ano
    let mes = params.data.mes

    try {
      let resposta = await api.alterarReuniao(id, nome, sala_id, inicio, fim)
      state.reuniao = resposta
      let reunioes = await api.listarReuniao(ano, mes)
      state.reunioes = reunioes.reunioes
      state.errorForm = 'OK'
    } catch (error) {
      state.errorForm = error.toString().split(': ')[1]

    }
  },
  async mDeletarReuniao(state, params){
    try {
      let resposta = await api.deletarReuniao(params.id)
      state.reuniao = resposta
      let reunioes = await api.listarReuniao(params.data.ano, params.data.mes)
      state.reunioes = reunioes.reunioes
      state.errorForm = 'OK'
    } catch (error) {
      state.errorForm = error.toString().split(': ')[1]

    }
  },
  async mListarReunioes(state, params){
    try {
      let reunioes = await api.listarReuniao(params.ano, params.mes)
      state.reunioes = await reunioes.reunioes
      state.error = ''
      // eslint-disable-next-line no-console
      // console.log(state.reunioes)
    } catch (error) {
      state.error = error.toString().split(': ')[1]
      // eslint-disable-next-line no-console
      console.log(error)

    }
  },
  async mListarRelatorio(state, params){
    try {
      let relatorio = await api.listarRelatorio(params.user, params.ano, params.mes)
      state.relatorio = await relatorio.reunioes
      state.error = ''

    } catch (error) {
      state.error = error.toString().split(': ')[1]

    }
  },
  async mListarSalas(state){
    try {
      let salas = await api.listarSalas()
      state.salas = await salas.salas
      // eslint-disable-next-line no-console
      console.log(state.salas)

    } catch (error) {
      state.error = error.toString().split(': ')[1]

    }
  },
  mSetError(state){
    state.error = ''
  },
  mSetErrorForm(state){
    state.errorForm = ''
  },
  mSetOpen(state, value){
    state.open = value
  }
}

const actions = {
  async criarReuniao(context, params){
    await context.commit('mCriarReuniao', params)
  },
  async alterarReuniao(context, params){
    await context.commit('mAlterarReuniao', params)
  },
  async deletarReuniao(context, params){
    await context.commit('mDeletarReuniao', params)
  },
  async listarReunioes(context, params){
    await context.commit('mListarReunioes',params)
  },
  async listarRelatorio(context, params){
    await context.commit('mListarRelatorio', params)
  },
  async listarSalas(context){
    await context.commit('mListarSalas')
  },
  setError(context){
    context.commit('mSetError')
  },
  setErrorForm(context){
    context.commit('mSetErrorForm')
  },
  setOpen(context, value){
    context.commit('mSetOpen', value)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}