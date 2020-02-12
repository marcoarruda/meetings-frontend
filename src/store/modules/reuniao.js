import api from '../../api'

const state = {
  reuniao: null,
  reunioes: [],
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
    return state.reunioes
  }
}

const mutations = {
  mSetReuniao(state, reuniao){
    state.reuniao = reuniao
  },
  async mCriarReuniao(state, reuniao){
    state.reuniao = reuniao
    let nome = state.reuniao.nome
    let sala_id = state.reuniao.sala_id
    let inicio = state.reuniao.inicio
    let fim = state.reuniao.fim

    try {
      let reuniao = await api.agendarReuniao(nome, sala_id, inicio, fim)
      state.reuniao = reuniao
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.log(ex)
      state.error = ex
    }
  },
  mAlterarReuniao(state, reuniao){
    state.reuniao = reuniao
    let id = state.reuniao.id
    let nome = state.reuniao.nome
    let sala_id = state.reuniao.sala_id
    let inicio = state.reuniao.inicio
    let fim = state.reuniao.fim

    api.alterarReuniao(id, nome, sala_id, inicio, fim).then((resposta) => {
      state.reuniao = resposta
      // eslint-disable-next-line no-console
      console.log(state.reuniao)
    }).catch(ex => {
      // eslint-disable-next-line no-console
      console.log(ex)
      state.error = ex
    })
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
}

const actions = {
  async criarReuniao(context, reuniao){
    await context.commit('mCriarReuniao', reuniao)
  },
  alterarReuniao(context, reuniao){
    context.commit('mAlterarReuniao', reuniao)
  },
  deletarReuniao(context, id){
    context.commit('mDeletarReuniao', id)
  },
  setReuniao(context, reuniao){
    context.commit('mSetReuniao', reuniao)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}