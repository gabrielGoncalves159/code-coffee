<template>
  <div class="login">
    <img class="logo" src="../assets/logo-1.png" alt="Logo da empresa" />
    <form class="login-form" @submit.prevent="login">
      <h1 class="title">Login</h1>
      <div class="field">
        <label class="label">CPF</label>
        <div class="control has-icons-left">
          <input class="input is-success" type="text" />
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>
        </div>
      </div>
      <div class="field">
        <label class="label">Senha</label>
        <div class="control has-icons-left">
          <input class="input" type="password" />
          <span class="icon is-small is-left">
            <i class="fas fa-lock"></i>
          </span>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button class="button is-primary is-fullwidth" type="submit" @click="login()">Entrar</button>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <a href="#" class="has-text-grey">Esqueci minha senha</a>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { defineComponent } from "vue"

export default defineComponent({
  name: "LoginPage",
  data() {
    return {
      cpf: "",
      senha: "",
    };
  },
  methods: {
    login() {
      // fazer a validação do CPF e senha e redirecionar para a página principal
      this.$router.push("/home-page");
    },
  },
});
</script>

<style>
h1 {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.logo {
  width: 230px;
  height: 80px;
  margin-bottom: 2rem;
}

.login-form {
  width: 400px;
  padding: 2rem;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.has-icons-left .icon {
  z-index: 2;
  margin-top: -2.25rem;
}

.has-icons-left .input {
  padding-left: 2.5rem;
}
</style>
