<template>
  <div class="about">
    <h1 class="title is-1">Finalização Venda</h1>
    <div class="card">
      <header class="modal-card-head">
        <div class="field is-grouped">
          <div class="control">
            <InputData :label="'Data'" />
          </div>
          <div class="control">
            <Input :label="'Nº Comanda'" :type="'text'" />
          </div>
          <div>
            <Select :label="'Status comanda'" />
          </div>
          <div class="control buttom-margin">
            <div class="field is-grouped">
              <div class="control">
                <button class="button is-info">Pesquisar</button>
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
      <footer class="modal-card-foot footer"></footer>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({});
</script>
>
