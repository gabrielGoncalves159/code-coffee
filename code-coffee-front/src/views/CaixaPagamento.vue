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
                <button class="button is-info" @click="listarComandas()">Pesquisar</button>
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
import moment from "moment";
import { defineComponent } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import { reactive, ref } from "vue";
import comandaVenda from "../services/comandaVenda";
import deleteUpdateVue from "../components/grid/deleteUpdate.vue";

export default defineComponent({
  name: "VendaBalcao",
  components: { AgGridVue },
  data() {
    return {
      form: {
        data: "",
        comanda: "",
        statusComanda: "",
      },
      statusComanda: [
        { value: '', title: "Todos" },
        { value: "P", title: "Pago" },
        { value: "PP", title: "Pendente Pagamento" },
        { value: "C", title: "Cancelada" },
      ],
    };
  },
  mounted() {
    this.listarComandas();
  },
  methods: {
    async listarComandas() {
      const payload = {
        id_comanda: this.form.comanda !== "" ? this.form.comanda : 0,
        status_comanda: this.form.statusComanda,
        data: this.form.data,
      };
      const response = await comandaVenda.listarComandaVenda(payload);
      const values = response.map((x) => ({
        ...x,
        data: moment(x.data_venda).format('DD/MM/YYYY')
      }))
      this.rowData.value = values;
    },
  },
  setup() {
    const gridApi = ref(null);
    const rowData = reactive({});

    // Obtain API from grid's onGridReady event
    const onGridReady = (params) => {
      gridApi.value = params.api;
    };

    const poundFormatter = (params) => {
      return (
        'R$' +
        Math.floor(params.value)
          .toString()
          .replace(/(\d)(?=(\d{3})+(?!\d))/g)
      )
    };

    const defaultColDef = {
      sortable: true,
      filter: true,
      flex: 1,
    };

    const columnDefs = reactive({
      value: [
        { headerName: "Comanda", field: "comanda" },
        { headerName: "Data", field: "data" },
        { headerName: "Valor Total", field: "valor_total", valueFormatter: poundFormatter },
        { headerName: "Status", field: "status_comanda" },
        { headerName: "Ação", cellRenderer: deleteUpdateVue },
      ],
    });

    return {
      onGridReady,
      columnDefs,
      rowData,
      defaultColDef,
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
@import "ag-grid-community/styles/ag-grid.css";
@import "ag-grid-community/styles/ag-theme-material.css";

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
