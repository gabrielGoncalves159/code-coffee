<template>
  <div class="about">
    <h1 class="title is-1">Cadastro de Produto</h1>
    <div class="card">
      <header class="modal-card-head">
        <div class="field is-grouped group">
          <div class="control">
            <div class="container">
              <div class="field">
                <label class="title is-6">Código:</label>
                <div class="control">
                  <input class="input" type="text" v-model="formPesquisa.codigo" style="width: 80px"/>
                </div>
              </div>
            </div>
          </div>
          <div class="control">
            <div class="container">
              <div class="field">
                <label class="title is-6">Produto:</label>
                <div class="control">
                  <input class="input" type="text" v-model="formPesquisa.nomeProduto" style="width: 400px"/>
                </div>
              </div>
            </div>
          </div>
          <div class="control">
            <div class="field is-grouped">
              <div class="control">
                <button class="button is-info" @click="listarProdutos()">
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
                  Novo Produto
                </button>
              </div>
            </div>
          </div>
        </div>
        <modal-padrao :showModal="showModal">
          <template v-slot:header>
            <p class="modal-card-title">Cadastro Novo Produto</p>
            <button class="delete" aria-label="close" @click="fecharModal()"></button>
          </template>
          <template v-slot:body>

            <div class="container">
              <div class="field">
                <label class="title is-6">Nome Produto:</label>
                <div class="control">
                  <input 
                  class="input"
                  :class="{ 'is-danger': !formProduto.nomeProduto && formValid}"
                  type="text" 
                  v-model="formProduto.nomeProduto"/>
                </div>
                <p v-if="!formProduto.nomeProduto && formValid" class="help is-danger">Preenchimento Obrigatório!!</p>
              </div>
            </div>

            <div class="container">
              <div class="field">
                <label class="title is-6">Valor Unitário:</label>
                <div class="control">
                  <input 
                  class="input" 
                  type="text" 
                  v-model="formProduto.valorUnitario"
                  :class="{ 'is-danger': !formProduto.valorUnitario && formValid}"
                  @input="formatarValor"
                  />
                </div>
                <p v-if="!formProduto.valorUnitario && formValid" class="help is-danger">Preenchimento Obrigatório!!</p>
              </div>
            </div>

            <div class="control is-expanded">
              <label class="title is-6">Unidade Medida:</label>
              <div class="control is-expanded">
                <div class="select is-link" :class="{ 'is-danger': !formProduto.unidadeMedida && formValid}">
                  <select v-model="formProduto.unidadeMedida" :style="{ width: '200px' }">
                    <option v-for="option in unidadeMedida" :value="option.title" :key="option.value">
                      {{ option.title }}
                    </option>
                  </select>
                </div>
                <p v-if="!formProduto.unidadeMedida && formValid" class="help is-danger">Preenchimento Obrigatório!!</p>
              </div>
            </div>
          </template>
          <template v-slot:footer>
            <button class="button is-success" type="submit" @click="cadastrarProduto()">Salvar</button>
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
import produto from "../services/produto"
import format from "../store/format";

import ModalPadrao from "@/components/modal/ModalPadrao.vue";

export default defineComponent({
  name: "VendaBalcao",
  components: { AgGridVue, ModalPadrao },
  emits: ["eventAbrirModal"],
  data() {
    return {
      formProduto: {
        id_produto: 0,
        nomeProduto: '',
        valorUnitario: '',
        unidadeMedida: '',
        ativo: 1,
      },
      formPesquisa: {
        codigo: '',
        nomeProduto: '',
      },
      showModal: false,
      formValid: false,
      optionSelect: [],
      unidadeMedida: [
        {
          value: 1,
          title: "UN"
        },
        {
          value: 2,
          title: "KG"
        },
        {
          value: 3,
          title: "L"
        },
        {
          value: 4,
          title: "CX"
        },
      ],
      columnDefs: [
        { headerName: "Código", field: "id_produto" },
        { headerName: "Produto", field: "nome" },
        { headerName: "Unid. Medida", field: "unidade_medida" },
        { headerName: "Valor", field: "valor_produto" },
        { headerName: "Ação", cellRenderer: this.buttonsActions },
      ],
    };
  },
  mounted(){
    this.listarProdutos();
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
      deleteButton.addEventListener("click", () => this.delete(params.data));
      wrapper.appendChild(deleteButton);

      // Botão de edição
      const editButton = document.createElement("button");
      editButton.innerHTML = '<span class="icon is-small"><i class="fa fa-pencil"></i></span>';
      editButton.classList.add("button"); // Adiciona a classe "edit-button"
      editButton.addEventListener("click", () => this.edit(params.data));
      wrapper.appendChild(editButton);

      return wrapper;
    },

    abrirModal() {
      this.showModal = true
    },

    fecharModal() {
      this.formProduto = {
        id_produto: 0,
        nomeProduto: '',
        valorUnitario: '',
        unidadeMedida: '',
        ativo: 1,
      }
      this.showModal = false;
      this.formValid = false;
    },

    async cadastrarProduto() {
      this.formValid = true;

      if (!this.formProduto.unidadeMedida || !this.formProduto.nomeProduto || !this.formProduto.valorUnitario) {
        return; // Se algum campo estiver vazio, não executa o algoritmo
      }
      const payload = {
        id_produto: this.formProduto.id_produto,
        nomeProduto: this.formProduto.nomeProduto,
        valorUnitario: format.removerFormat(this.formProduto.valorUnitario),
        unidadeMedida: this.formProduto.unidadeMedida,
        ativo: this.formProduto.ativo,
      }
      await produto.inserirProduto(payload)
      this.fecharModal()
      this.listarProdutos()
    },

    async listarProdutos() {
      const response = await produto.listarProdutos(
        {
          id_produto: this.formPesquisa.codigo == '' ? 0 : parseInt(this.formPesquisa.codigo),
          nome: this.formPesquisa.nomeProduto
        }
      );
      this.rowData.value = response.map((x) => ({
        ...x,
        valor_produto: format.formatarValorEmReal(x.valor_produto)
      }));
    },

    async edit(params) {
      this.showModal = true
      this.formProduto = {
        id_produto: params.id_produto,
        nomeProduto: params.nome,
        valorUnitario: params.valor_produto,
        unidadeMedida: params.unidade_medida,
      }
    },

    async delete(params) {
      const payload = {id: params.id_produto}
      await produto.excluirProduto(payload);
      this.listarProdutos()
    },

    formatarValor() {
      const valor = this.formProduto.valorUnitario.replace(/\D/g, '');
      const valorFormatado = Number(valor) / 100;
      this.formProduto.valorUnitario = valorFormatado.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    },
    
  },
  setup() {
    const gridApi = ref(null);
    const rowData = reactive({});

    // Obtain API from grid's onGridReady event
    const onGridReady = (params) => {
      gridApi.value = params.api;
    };

    const defaultColDef = {
      sortable: true,
      filter: true,
      flex: 1,
    };

    return {
      onGridReady,
      rowData,
      defaultColDef,
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
