<template>
  <div class="about">
    <h1 class="title is-1">Caixa</h1>
    <div class="card">
      <header class="modal-card-head">
        <div class="field is-grouped group">
          <div class="control">
            <div class="field">
              <label class="title is-6">Data:</label>
              <div class="control">
                <input class="input" type="date" v-model="form.data" />
              </div>
            </div>
          </div>
          <div class="control">
            <div class="container">
              <div class="field">
                <label class="title is-6">Nº Comanda:</label>
                <div class="control">
                  <input class="input" type="text" v-model="form.comanda" />
                </div>
              </div>
            </div>
          </div>
          <div class="control is-expanded">
            <label class="title is-6">Status comanda:</label>
            <div class="control is-expanded">
              <div class="select is-link">
                <select v-model="form.statusComanda" @change="selected()">
                  <option
                    v-for="option in statusComanda"
                    :value="option.value"
                    :key="option.value"
                  >
                    {{ option.title }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="control">
            <div class="field is-grouped">
              <div class="control">
                <button class="button is-info" @click="listarComandas()">
                  <span class="icon is-small is-left">
                    <i class="fa fa-search" aria-hidden="true"></i>
                  </span>
                  <span>
                    Pesquisar
                  </span>
                </button>
              </div>
              <div class="control">
                <button class="button is-link is-light">
                  <router-link to="/venda">Nova Venda</router-link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div class="card-content">
        <ag-grid-vue
          class="ag-theme-material"
          style="height: 250px"
          :columnDefs="columnDefs"
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
    <modal-pagamento 
      v-if="showModalPagamento" 
      :showModal="showModalPagamento" 
      @update:showModal="showModalPagamento = $event"
      :params="dadosVenda" 
      :visualizar="visualizar"
      @look:visualizar="visualizar = $event"
    />
  </div>
</template>
<script>
import moment from "moment";
import { defineComponent } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import { reactive, ref } from "vue";
import comandaVenda from "../services/comandaVenda";
import ModalPagamento from "../components/modal/ModalPagamento";
import format from "../store/format";


export default defineComponent({
  name: "CaixaPagamento",
  components: { AgGridVue, ModalPagamento },
  data() {
    return {
      form: {
        data: "",
        comanda: "",
        statusComanda: "",
      },
      visualizar: false,
      showModalPagamento: false,
      dadosVenda: {},
      statusComanda: [
        { value: '', title: "Todos" },
        { value: "P", title: "Pago" },
        { value: "PP", title: "Pendente Pagamento" },
        { value: "C", title: "Cancelada" },
      ],
      columnDefs: [
        { headerName: "Comanda", field: "comanda" },
        { headerName: "Data", field: "data" },
        { headerName: "Valor Total", field: "valor_total" },
        { headerName: "Status", field: "status_comanda" },
        {
          headerName: 'Ação',
          cellRenderer: this.buttonsActions,
        },
      ],
    };
  },
  mounted() {
    this.listarComandas();
    this.$options.components.buttonsActions = this.buttonsActions;
  },
  methods: {
    buttonsActions(params) {
      const wrapper = document.createElement("div");
      wrapper.classList.add('a-button')

      if(params.data.status_comanda === 'Pendente Pagamento') {
      // Botão de pagamento comanda
        const payButton = document.createElement("button");
        payButton.innerHTML = '<span class="icon is-small"><i class="fa fa-usd" aria-hidden="true" style="color: #0dbf43;"></i></span>';
        payButton.classList.add("button"); // Adiciona a classe "payButton"
        payButton.addEventListener("click", () => this.modalPagamento(params.data));
        wrapper.appendChild(payButton);

      // Botão de cancelamento comanda
        const cancelButton = document.createElement("button");
        cancelButton.innerHTML = '<span class="icon is-small"><i class="fa fa-ban" aria-hidden="true" style="color: #ff0000;"></i></span>';
        cancelButton.classList.add("button"); // Adiciona a classe "cancelButton"
        cancelButton.addEventListener("click", () => this.cancelarComanda(params.data));
        wrapper.appendChild(cancelButton);
      }

      // Botão de visualizar
      const eyeButton = document.createElement("button");
      eyeButton.innerHTML = '<span class="icon is-small"><i class="fa fa-eye" aria-hidden="true"></i></span>';
      eyeButton.classList.add("button"); // Adiciona a classe "eye-button"
      eyeButton.addEventListener("click", () => this.visualizarComanda(params.data));
      wrapper.appendChild(eyeButton);

      return wrapper;
    },
    async listarComandas() {
      const payload = {
        id_comanda: this.form.comanda !== "" ? this.form.comanda : 0,
        status_comanda: this.form.statusComanda,
        data: this.form.data,
      };
      const response = await comandaVenda.listarComandaVenda(payload);
      const values = response.map((x) => ({
        ...x,
        data: moment(x.data_venda).format('DD/MM/YYYY'),
        valor_total: format.formatarValorEmReal(x.valor_total)
      }))
      this.rowData.value = values;
    },

    async visualizarComanda(params) {
      this.modalPagamento(params)
      this.visualizar = true;
    },

    async cancelarComanda(params) {
      const payload = {idComanda: params.comanda, statusComanda: 'C'}
      await comandaVenda.alterarStatusComanda(payload);
      this.listarComandas();
    },
    modalPagamento(params) {
      this.dadosVenda = params;
      this.showModalPagamento = true;

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
    }

    
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
