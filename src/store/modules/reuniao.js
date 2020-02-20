import api from '../../api'

const state = {
  reuniao: null,
  reunioes: [],
  relatorio: [],
  salas: [],
  error: '',
  errorForm: null,
  loading: true,
}

const getters = {
  getReuniao(state){
    return state.reuniao
  },
  getLoading(state){
    return state.loading
  },
  getError(state) {
    return state.error
  },
  getErrorForm(state) {
    return state.errorForm
  },
  getReunioes(state){
    return state.reunioes
  },
  getRelatorio(state){
    return state.relatorio
  },
  getSalas(state){
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

    } finally {
      state.loading = false

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

    } finally {
      state.loading = false

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

    } finally {
      state.loading = false

    }
  },
  async mListarReunioes(state, params){
    try {
      let reunioes = await api.listarReuniao(params.ano, params.mes)
      state.reunioes = await reunioes.reunioes
      state.error = ''
    } catch (error) {
      state.error = error.toString().split(': ')[1]
    } finally {
      state.loading = false
      // chamar mSetLoading ?
    }
  },
  async mListarRelatorio(state, params){
    try {
      let relatorio = await api.listarRelatorio(params.user, params.ano, params.mes)
      state.relatorio = await relatorio.reunioes
      state.error = ''
    } catch (error) {
      state.error = error.toString().split(': ')[1]

    } finally {
      state.loading = false

    }
  },
  async mListarSalas(state){
    try {
      let salas = await api.listarSalas()
      state.salas = await salas.salas
    } catch (error) {
      state.error = error.toString().split(': ')[1]

    } finally {
      state.loading = false

    }
  },
  async mAdicionarSala(state, params){
    try {
      // let salas = await api.adicionarSala(params.nome)
      //state.salas = await salas.salas
      state.salas.push({
        id: params.id,
        nome: params.nome
      })
    } catch (error) {
      state.error = error.toString().split(': ')[1]

    } finally {
      state.loading = false

    }
  },
  async mAlterarSala(state, params){
    try {
      // let salas = await api.alterarSala(params.id, params.nome)
      //state.salas = await salas.salas
      let index = state.salas.map(e => {
        return e.id
      }).indexOf('')

      state.salas[index].nome = params.nome

    } catch (error) {
      state.error = error.toString().split(': ')[1]

    } finally {
      state.loading = false

    }
  },
  async mExcluirSala(state, params){
    try {
      // let salas = await api.excluirSala(params.id)
      //state.salas = await salas.salas

      state.salas = state.salas.filter(e => {
        return e.id != params
      })

    } catch (error) {
      state.error = error.toString().split(': ')[1]

    } finally {
      state.loading = false

    }
  },
  mSetLoading(state, valor){
    state.loading = valor
  },
  mSetError(state){
    state.error = ''
  },
  mSetErrorForm(state){
    state.errorForm = ''
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
  async adicionarSala(context, params){
    await context.commit('mAdicionarSala', params)
  },
  async alterarSala(context, params){
    await context.commit('mAlterarSala', params)
  },
  async excluirSala(context, params){
    await context.commit('mExcluirSala', params)
  },
  setLoading(context, valor){
    context.commit('mSetLoading', valor)
  },
  setError(context){
    context.commit('mSetError')
  },
  setErrorForm(context, valor){
    context.commit('mSetErrorForm', valor)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}