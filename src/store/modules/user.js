import { Auth } from 'aws-amplify'

const state = {
  user: null
}

const getters = {
  'getUser': state => {
    return state.user
  },
  'getUserIsAuth': state => {
    return state.user != null
  },
  'getRequestParams': state => {
    return {
      headers: {
        Authorization:
            `Bearer ${state.user.signInUserSession.idToken.jwtToken}`,
      },
    }
  }
}

const mutations = {
  'mutUserLogin': (state, payload) => {
    state.user = payload
  },
  'mutUserLogout': (state) => {
    state.user = null
  },
}

const actions = {
  actionUserLogin: async (context, payload) => {
    context.commit('mutUserLogin', payload)
  },
  // actionUserLogout: (context, payload) => {
  actionUserLogout: (context) => {
    Auth.signOut()
      .then(data => {
        context.commit('mutUserLogout', null)
      })
      .catch(err => {
        context.commit('mutUserLogout', null)
      })
  },
}

export default {
  state,
  getters,
  mutations,
  actions
}