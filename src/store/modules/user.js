import { Auth } from 'aws-amplify'
import router from '../../router/index'
import api from '../../api'

const state = {
  user: null,
  users: []
}

const getters = {
  'getUser': state => {
    return state.user
  },
  'getUsers': state => {
    return state.users
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
  'mListarUsuarios': async (state) => {
    try {
      let users = await api.listarUsuarios()
      state.users = await users.users
    } catch (error) {
      state.error = error.toString().split(': ')[1]

    } finally {
      state.loading = false

    }
  }
}

const actions = {
  actionUserLogin: async (context, payload) => {
    // eslint-disable-next-line no-console
    console.log(payload.signInUserSession.idToken.jwtToken)
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
  listarUsuarios: async (context) => {
    await context.commit('mListarUsuarios')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}