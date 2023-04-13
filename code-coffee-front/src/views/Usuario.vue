<template>
  <div class="about">
    <h1 class="title is-1">Cadastro de Usuario</h1>
    <div class="card">
      <header class="modal-card-head">
        <div class="field is-grouped group">
          <div class="control">
            <Input :label="'Matricula'" :type="'text'" style="width: 80px"/>
          </div>
          <div class="control">
            <Input :label="'Nome'" :type="'text'" style="width: 400px"/>
          </div>
          <div class="control">
            <div class="field is-grouped">
              <div class="control">
                <button class="button is-info" @click="this.listarUsuarios()">Pesquisar</button>
              </div>
              <div class="control">
                <button class="button is-primary" @click="abrirModal()">
                  Novo Usuario
                </button>
              </div>
            </div>
          </div>
        </div>
        <modal-padrao :showModal="showModal" ref="modalUsuario">
          <template v-slot:header>
            <p class="modal-card-title">Cadastro Novo Usuario</p>
            <button class="delete" aria-label="close" @click="fecharModal()"></button>
          </template>
          <template v-slot:body>

            <div class="container">
              <div class="field">
                <label class="title is-6">Matricula:</label>
                <div class="control">
                  <input class="input" type="text" v-model="formUsuario.matricula"/>
                </div>
              </div>
            </div>

            <div class="control is-expanded">
              <label class="title is-6">Tipo de Usuário:</label>
              <div class="control is-expanded">
                <div class="select is-link">
                  <select v-model="formUsuario.idTipoUsuario" :style="{ width: '200px' }">
                    <option v-for="option in tipoUsuario.value" :value="option.value" :key="option.value">
                      {{ option.title }}
                    </option>
                  </select>
                </div>
              </div>
            </div>    

            <div class="container">
              <div class="field">
                <label class="title is-6">Nome:</label>
                <div class="control">
                  <input class="input" type="text" v-model="formUsuario.nome"/>
                </div>
              </div>
            </div>

            <div class="container">
              <div class="field">
                <label class="title is-6">CPF:</label>
                <div class="control">
                  <input class="input" type="text" v-model="formUsuario.cpf"/>
                </div>
              </div>
            </div>

            <div class="container">
              <div class="field">
                <label class="title is-6">Telefone:</label>
                <div class="control">
                  <input class="input" type="text" v-model="formUsuario.telefone"/>
                </div>
              </div>
            </div>

            <div class="container">
              <div class="field">
                <label class="title is-6">Senha:</label>
                <div class="control">
                  <input class="input" type="password" v-model="formUsuario.senha"/>
                </div>
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
          :columnDefs="columnDefs.value"
          :rowData="rowData.value"
          :defaultColDef="defaultColDef"
          rowSelection="multiple"
          animateRows="true"
          @cell-clicked="cellWasClicked"
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
import Input from "@/components/form/Input.vue";
// import Select from "@/components/form/Select.vue";

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-material.css"; // Optional theme CSS
import ModalPadrao from "@/components/modal/ModalPadrao.vue";
import usuario from '../services/usuario'

export default defineComponent({
  name: "CadastroUsuario",
  components: { AgGridVue, Input, ModalPadrao },
  data() {
    return {
      formUsuario: {
        idTipoUsuario: '',
        nome: '',
        cpf: '',
        telefone: '',
        senha: '',
      },
      showModal: false,
      selectedOption: null,
    };
  },
  mounted() {
    this.listarUsuarios()
    this.listarTipoUsuario()
  },
  methods: {
    abrirModal() {
      this.showModal = true;
    },
    fecharModal() {
      this.showModal = false;
    },
    async cadastrarUsuario() {
      const payload = JSON.parse(JSON.stringify(this.formUsuario));
      await usuario.inserirUsuario(payload)
    },
  },
  setup() {
    const gridApi = ref(null);
    const rowData = reactive({});
    const tipoUsuario = [];
    const columnDefs = reactive({
      value: [
        { headerName: 'Matricula', field: "id_usuario" },
        { headerName: 'Nome do Usuario', field: "nome" },
        { headerName: 'Telefone', field: "telefone" },
        { headerName: 'CPF', field: "CPF" },
        { headerName: 'Tipo', field: "descricao" },
        { headerName: 'Ação', field: "acao" },
      ],
    });

    const listarUsuarios = async () => {
      const response = await usuario.listarUsuarios();
      rowData.value = response;
    };

    const listarTipoUsuario = async () => {
      const response = await usuario.listarTipoUsuario();
      tipoUsuario.value = response.map((x) => ({
        value: x.id_tipo_usuario,
        title: x.descricao
      }))
    };

    const onGridReady = (params) => {
      gridApi.value = params.api;
    };

    const defaultColDef = {
      sortable: true,
      filter: true,
      flex: 1,
    };

    return {
      listarUsuarios,
      listarTipoUsuario,
      onGridReady,
      columnDefs,
      rowData,
      defaultColDef,
      tipoUsuario,
      cellWasClicked: (event) => {
        // Example of consuming Grid Event
        console.log("cell was clicked", event);
      },
      deselectRows: () => {
        gridApi.value.deselectAll();
      },
    };
  },
});
</script>

<style>
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
</style>
