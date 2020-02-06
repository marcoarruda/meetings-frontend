import { Auth } from 'aws-amplify'
import router from '../../router/index'

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
    router.push({path: '/login'})
  },
}

const actions = {
  actionUserLogin: async (context, payload) => {
    // eslint-disable-next-line no-console
    console.log(payload)
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