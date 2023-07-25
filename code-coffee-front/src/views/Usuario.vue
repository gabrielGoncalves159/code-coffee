<template>
  <div class="about">
    <h1 class="title is-1">Cadastro de Usuario</h1>
    <div class="card">
      <header class="modal-card-head">
        <div class="field is-grouped group">
          <div class="control">
            <div class="container">
              <div class="field">
                <label class="title is-6">Matricula:</label>
                <div class="control">
                  <input class="input" type="text" v-model="formPesquisa.matricula" style="width: 80px"/>
                </div>
              </div>
            </div>
          </div>
          <div class="control">
            <div class="container">
              <div class="field">
                <label class="title is-6">Nome:</label>
                <div class="control">
                  <input class="input" type="text" v-model="formPesquisa.nomeUsuario" style="width: 400px"/>
                </div>
              </div>
            </div>
          </div>
          <div class="control">
            <div class="field is-grouped">
              <div class="control">
                <button class="button is-info" @click="this.listarUsuarios()">
                  <span class="icon is-small is-left">
                    <i class="fa fa-search" aria-hidden="true"></i>
                  </span>
                  <span>
                    Pesquisar
                  </span>
                </button>
              </div>
              <div class="control">
                <button class="button is-primary" @click="abrirModal()">
                  Novo Usuario
                </button>
              </div>
            </div>
          </div>
        </div>
        <modal-padrao :showModal="showModal">
          <template v-slot:header>
            <p class="modal-card-title">Cadastro Novo Usuario</p>
            <button class="delete" aria-label="close" @click="fecharModal()"></button>
          </template>
          <template v-slot:body>
            <div class="container" v-if="formUsuario.idUsuario !== 0">
              <!-- ...código anterior... -->
            </div>

            <div class="control is-expanded">
              <label class="title is-6">Tipo de Usuário:</label>
              <div class="control is-expanded">
                <div class="select is-link" :class="{ 'is-danger': !formUsuario.idTipoUsuario && formValid}">
                  <select v-model="formUsuario.idTipoUsuario" :style="{ width: '200px' }">
                    <option disabled value="">Selecione um tipo de usuário</option>
                    <option v-for="option in tipoUsuario.value" :value="option.value" :key="option.value">
                      {{ option.title }}
                    </option>
                  </select>
                </div>
                <p v-if="!formUsuario.idTipoUsuario && formValid" class="help is-danger">Preenchimento Obrigatório!!</p>
              </div>
            </div>

            <div class="container">
              <div class="field">
                <label class="title is-6">Nome:</label>
                <div class="control">
                  <input class="input" type="text" v-model="formUsuario.nome" :class="{ 'is-danger': !formUsuario.nome &&  formValid}"/>
                </div>
                <p v-if="!formUsuario.nome && formValid" class="help is-danger">Preenchimento Obrigatório!!</p>
              </div>
            </div>

            <div class="container">
              <div class="field">
                <label class="title is-6">CPF:</label>
                <div class="control">
                  <input class="input" type="text" v-model="formUsuario.cpf" v-mask="'###.###.###-##'" :class="{ 'is-danger': !formUsuario.cpf && formValid || formUsuario.cpf.length < 11 && formValid}"/>
                </div>
                <p v-if="!formUsuario.cpf && formValid" class="help is-danger">Preenchimento Obrigatório!!</p>
                <p v-if="formUsuario.cpf.length < 11 && formValid" class="help is-danger">Quantidade de caracter invalido!!</p>
              </div>
            </div>

            <div class="container">
              <div class="field">
                <label class="title is-6">Telefone:</label>
                <div class="control">
                  <input class="input" type="text" v-model="formUsuario.telefone" v-mask="'(##) #####-####'"  :class="{ 'is-danger': !formUsuario.telefone && formValid || formUsuario.telefone.length < 11 && formValid}"/>
                </div>
                <p v-if="!formUsuario.telefone && formValid" class="help is-danger">Preenchimento Obrigatório!!</p>
                <p v-if="formUsuario.telefone.length < 11 && formValid" class="help is-danger">Quantidade de caracter invalido!!</p>
              </div>
            </div>

            <div class="container">
              <div class="field">
                <label class="title is-6">Senha:</label>
                <div class="control">
                  <input class="input" type="password" v-model="formUsuario.senha" :class="{ 'is-danger': !formUsuario.senha && formValid}"/>
                </div>
                <p v-if="!formUsuario.senha && formValid" class="help is-danger">Preenchimento Obrigatório!!</p>
              </div>
            </div>
          </template>
          <template v-slot:footer>
            <button class="button is-success" type="submit" @click="cadastrarUsuario()">Salvar</button>
            <button class="button" @click="fecharModal()">Cancelar</button>
          </template>
        </modal-padrao>
      </header>
      <div class="card-content">
        <ag-grid-vue
          class="ag-theme-material"
          style="height: 250px"
          :columnDefs="columnDefs"
          :rowData="rowData.value"
          :defaultColDef="defaultColDef"
          @grid-ready="onGridReady"
        >
        </ag-grid-vue>
      </div>
      <footer class="modal-card-foot footer"></footer>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import { reactive, ref } from "vue";

import ModalPadrao from "@/components/modal/ModalPadrao.vue";
import usuario from '../services/usuario';
import format from '../store/format';

export default defineComponent({
  name: "CadastroUsuario",
  components: { AgGridVue, ModalPadrao },
  data() {
    return {
      formUsuario: {
        idUsuario: 0,
        idTipoUsuario: '',
        nome: '',
        cpf: '',
        telefone: '',
        senha: '',
      },
      formPesquisa: {
        matricula: '',
        nomeUsuario: '',
      },
      formValid: false,
      showModal: false,
      selectedOption: null,
      columnDefs: [
        { headerName: 'Matricula', field: "id_usuario" },
        { headerName: 'Nome do Usuario', field: "nome" },
        { headerName: 'Telefone', field: "telefone" },
        { headerName: 'CPF', field: "CPF" },
        { headerName: 'Tipo', field: "descricao" },
        { 
          headerName: "Ação", 
          cellRenderer: this.buttonsActions
        },
      ],
    }
  },
  mounted() {
    this.listarUsuarios()
    this.listarTipoUsuario()
    this.$options.components.buttonsActions = this.buttonsActions;
  },
  methods: {
    buttonsActions(params){
      const wrapper = document.createElement("div");
      wrapper.classList.add('a-button')

      // Botão de exclusão
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = '<span class="icon is-small"><i class="fa fa-trash" style="color: #ff0000;"></i></span>';
      deleteButton.classList.add("button"); // Adiciona a classe "delete-button"
      deleteButton.addEventListener("click", () => this.deleteUser(params.data));
      wrapper.appendChild(deleteButton);

      // Botão de edição
      const editButton = document.createElement("button");
      editButton.innerHTML = '<span class="icon is-small"><i class="fa fa-pencil"></i></span>';
      editButton.classList.add("button"); // Adiciona a classe "edit-button"
      editButton.addEventListener("click", () => this.editUser(params.data));
      wrapper.appendChild(editButton);

      return wrapper;
    },
    
    abrirModal() {
      this.showModal = true;
    },

    fecharModal() {
      this.showModal = false;
      this.formValid = false;
      this.formUsuario = {
        idUsuario: 0,
        idTipoUsuario: '',
        nome: '',
        cpf: '',
        telefone: '',
        senha: '',
      }
    },

    async cadastrarUsuario() {
      this.formValid = true;

      if (!this.formUsuario.idTipoUsuario  || !this.formUsuario.nome || !this.formUsuario.cpf || (this.formUsuario.cpf.length < 11 ) || !this.formUsuario.telefone || (this.formUsuario.telefone.length < 11 ) || !this.formUsuario.senha) {
        return; // Se algum campo estiver vazio, não executa o algoritmo
      }
      const payload = {
        idUsuario: this.formUsuario.idUsuario,
        nome: this.formUsuario.nome, 
        cpf: format.removeMascara(this.formUsuario.cpf), 
        senha: this.formUsuario.senha, 
        telefone: format.removeMascara(this.formUsuario.telefone), 
        idTipoUsuario: this.formUsuario.idTipoUsuario
      }
      await usuario.inserirUsuario(payload)
      this.fecharModal()
      this.listarUsuarios()
    },

    async editUser(params) {
      this.showModal = true;

      this.formUsuario = {
        idUsuario: params.id_usuario,
        idTipoUsuario: params.descricao == 'administrador' ? 1 : params.descricao == 'caixa' ? 2 : 3,
        nome: params.nome,
        cpf: params.CPF,
        telefone: params.telefone,
        senha: params.senha ? params.senha : '' ,
      }
    },

    async deleteUser(params) {
      const payload = {id: params.id_usuario}
      await usuario.excluirUsuario(payload);
      this.listarUsuarios()
    },

    async listarUsuarios() {
      const response = await usuario.listarUsuarios(
        {
          id_usuario: this.formPesquisa.matricula == '' ? 0 : parseInt(this.formPesquisa.matricula),
          nome: this.formPesquisa.nomeUsuario
        }
      );
      this.rowData.value = response.map((x) => ({
        ...x,
        telefone: format.formatarTelefone(x.telefone),
        CPF: format.formatarCPF(x.CPF)
      }));
    },
  },
  setup() {
    const gridApi = ref(null);
    const gridColumnApi = ref(null);
    const rowData = reactive({});
    const tipoUsuario = [];

    const listarTipoUsuario = async () => {
      const response = await usuario.listarTipoUsuario();
      tipoUsuario.value = response.map((x) => ({
        value: x.id_tipo_usuario,
        title: x.descricao
      }))
    };

    const onGridReady = (params) => {
      gridApi.value = params.api;
      gridColumnApi.value = params.columnApi;
    };

    const defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
    };

    return {
      listarTipoUsuario,
      onGridReady,
      rowData,
      defaultColDef,
      tipoUsuario,
      deselectRows: () => {
        gridApi.value.deselectAll();
      },
    };
  },
});
</script>

<style>
@import "ag-grid-community/styles/ag-grid.css";
@import "ag-grid-community/styles/ag-theme-material.css";
@import "../../node_modules/@fortawesome/fontawesome-free/css/all.css";

.teste {
  display: flex;
}

.group {
  align-items: flex-end;
}

.footer {
  display: flex;
  justify-content: space-between;
}

.botao {
  padding-top: 20px;
}

h1 {
  margin: 20px;
}

.a-button {
  display: flex;
  justify-content: space-evenly;
}
</style>
