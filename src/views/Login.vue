<template>
  <div>
    <!-- State -1 - Loading -->
    <v-card v-if="state == -1" class="mx-auto" light>
      <br>
      <p class="text-center">Autenticando..</p>
      <br>
    </v-card>

    <!-- State 0 - Login -->
    <v-card v-if="state==0" class="mx-auto" light>
      <v-card-title class="text-center">Login</v-card-title>
      <v-form v-model="valid" @keyup.native.enter="signIn">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="email" :rules="emailRules" label="E-mail" required />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                :type="'password'"
                name="input-10-1"
                label="Senha"
                hint="Pelo menos 8 caracteres"
                counter
              />
            </v-col>
            <v-col v-if="error" cols="12">
              <div class="text-center" style="color:red;">{{ error }}</div>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <v-card-actions>
        <v-btn color="primary" :loading="loading" @click.prevent="signIn">Login</v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-btn text small @click.prevent="state=1">Criar conta</v-btn>
        <v-btn text small @click.prevent="state=3">Esqueci a senha</v-btn>
      </v-card-actions>
    </v-card>

    <!-- State 1 - Cadastro -->
    <v-card v-if="state==1" class="mx-auto" light>
      <v-card-title class="text-center">Cadastre-se</v-card-title>
      <v-form v-model="valid" @keyup.native.enter="signUp">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="nome" :rules="nomeRules" label="Nome" required />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="email" :rules="emailRules" label="E-mail" required />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                :type="'password'"
                name="input-10-1"
                label="Senha"
                hint="Pelo menos 8 caracteres"
                counter
              />
            </v-col>
            <v-col v-if="error" cols="12">
              <div class="text-center" style="color:red;">{{ error }}</div>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <v-card-actions justify-center>
        <v-btn color="success" :loading="loading" @click.prevent="signUp">Registrar</v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-btn text small @click.prevent="state=0">Já tenho uma conta</v-btn>
      </v-card-actions>
    </v-card>

    <!-- State 2 - Confirmar e-mail -->
    <v-card v-if="state==2" class="mx-auto" light>
      <v-card-title class="text-center">Confirme seu e-mail!</v-card-title>
      <v-card-text class="text-center">
        Enviamos uma mensagem com um código de verificação
        <br>Confirme o recebimento preenchendo o código abaixo
      </v-card-text>
      <v-form v-model="valid" @keyup.native.enter="emailConfirm">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="emailCodigo" label="Código de verificação" required />
            </v-col>
            <v-col v-if="error2" cols="12">
              <div class="text-center" style="color:red;">{{ error2 }}</div>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <v-card-actions justify-center>
        <v-btn color="success" :loading="loading" @click.prevent="emailConfirm">Confirmar</v-btn>
      </v-card-actions>
    </v-card>

    <!-- State 3 - Esqueci a senha -->
    <v-card v-if="state==3" class="mx-auto" light>
      <v-card-title class="text-center">Digite seu e-mail para definir uma nova senha</v-card-title>
      <v-card-text class="text-center">
        Vamos enviar um e-mail com um código de verificação
      </v-card-text>
      <v-form v-model="valid" @keyup.native.enter="forgetPassword">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="email" :rules="emailRules" label="E-mail" required />
            </v-col>
            <v-col v-if="error3" cols="12">
              <div class="text-center" style="color:red;">{{ error3 }}</div>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <v-card-actions justify-center>
        <v-btn color="primary" :loading="loading" @click.prevent="forgetPassword">Redefinir senha</v-btn>
      </v-card-actions>
      <v-card-actions justify-center>
        <v-btn text small @click.prevent="state=0">Voltar</v-btn>
      </v-card-actions>
    </v-card>

    <!-- State 4 - Redefinir senha -->
    <v-card v-if="state==4" class="mx-auto" light>
      <v-card-title class="text-center">Defina uma nova senha para {{ email }}</v-card-title>
      <v-card-text class="text-center">
        E o código de verificação que enviamos para seu e-mail
      </v-card-text>
      <v-form v-model="valid" @keyup.native.enter="resetPassword">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="password4" type="password" label="Nova senha" required />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="codigo4" label="Código enviado no e-mail" required />
            </v-col>
            <v-col v-if="error4" cols="12">
              <div class="text-center" style="color:red;">{{ error4 }}</div>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <v-card-actions justify-center>
        <v-btn color="primary" :loading="loading" @click.prevent="resetPassword">Redefinir senha</v-btn>
      </v-card-actions>
      <v-card-actions justify-center>
        <v-btn text small @click.prevent="state=0">Voltar</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style lang="scss">
</style>

<script>
import { Auth } from 'aws-amplify'
import { AmplifyEventBus } from 'aws-amplify-vue'

import { mapState, mapActions, mapGetters } from 'vuex'

/*
states
1 - login/register
2 - confirm e-mail
3 - forget password
*/
export default {
  name: 'Login',
  data: () => ({
    // form state
    state: -1,
    loading: false,
    // 0,1 - register/login
    valid: false,
    nome: '',
    nomeRules: [
      v => !!v || 'Deve ser preenchido',
      v => /(?=.{3,})/.test(v) || 'Senha deve conter pelo menos 3 caracteres'
    ],
    email: '',
    emailRules: [
      v => !!v || 'Deve ser preenchido',
      v => /.+@.+/.test(v) || 'E-mail inválido'
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Deve ser preenchido',
      v => /(?=.{8,})/.test(v) || 'Senha deve conter pelo menos 8 caracteres'
    ],
    error: '',
    // 2 - confirm registration
    registeredUser: null,
    emailCodigo: '',
    error2: '',
    // 3 - forgot password
    error3: '',
    // 4 - new password
    codigo4: '',
    password4: '',
    error4: ''
  }),
  computed: {
    ...mapGetters(['getUser', 'getUserIsAuth'])
  },
  methods: {
    ...mapActions({
      actionUserLogin: 'actionUserLogin',
    }),
    async signIn(event) {
      this.loading = true
      this.error = ''
      try {
        let user = await Auth.signIn({ username: this.email, password: this.password })
        await this.actionUserLogin(user)
        this.$router.push('/')
      } catch (err) {
        switch (err.code) {
          case 'UserNotFoundException':
            this.error = 'Usuário não encontrado'
            break
          case 'UserNotConfirmedException':
            this.state = 2
            break
          default:
            this.error = 'Algo deu errado, tente novamente ou entre em contato conosco'
            break
        }
      } finally {
        this.loading = false
      }
    },
    signUp(event) {
      this.loading = true
      this.error = ''
      Auth.signUp({
        username: this.email,
        password: this.password,
        attributes: {
          name: this.nome
        }
      })
        .then((data) => {
          this.registeredUser = data.user
          if(data.user != null) {
            this.state = 2
          }
        })
        .catch((err) => {
          switch(err.code) {
            case 'UsernameExistsException':
              this.error = 'E-mail já cadastrado, verifique o formulário'
              break
            case 'InvalidParameterException':
              this.error = 'E-mail/Senha inválidos, verifique o formulário'
              break
            default:
              this.error = err.message
              break
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    emailConfirm(event) {
      this.loading = true
      Auth.confirmSignUp(this.email, this.emailCodigo).then((data) => {
        this.signIn()
      }).catch((err) => {
        this.error3 = 'Algo deu errado, tente novamente ou entre em contato conosco'
      }).finally(() => {
        this.loading = false
      })
    },
    forgetPassword() {
      this.loading = true
      Auth.forgotPassword(this.email)
        .then(() => {
          this.state = 4
        })
        .catch((err) => {
          switch(err.code) {
            case 'UserNotFoundException':
              this.error3 = 'E-mail não encontrado, verifique o formulário'
              break
            default:
              this.error3 = 'Algo deu errado, tente novamente ou entre em contato conosco'
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    resetPassword() {
      this.loading = true
      Auth.forgotPasswordSubmit(this.email, this.codigo4, this.password4)
        .then(() => {
          this.state = 0
        })
        .catch((err) => {
          switch(err.code) {
            case 'CodeMismatchException':
              this.error4 = 'Código incorreto, verifique o formulário'
              break
            default:
              this.error4 = 'Algo deu errado, tente novamente ou entre em contato conosco'
              break
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  mounted() {
    Auth.currentAuthenticatedUser().then(user => {
      this.actionUserLogin(user).then(() => {
        this.$router.push('/')
      })
    }).catch(err => {
      this.state = 0
    }).finally(() => {
    })
  }
}
</script>
