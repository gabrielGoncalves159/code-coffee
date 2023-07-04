export default {
    formatarCPF(value) {
        if (!value) return '';
      
        // Remove qualquer caractere não numérico do value
        const valueLimpo = value.replace(/\D/g, '');
      
        // Verifica se o value possui 11 dígitos
        if (valueLimpo.length !== 11) return value;
      
        // Formata o value para o formato CPF
        return valueLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    },

    formatarTelefone(value) {
      // Remove todos os caracteres não numéricos do valor
      const valueLimpo = value.replace(/\D/g, '');
    
      // Verifica se o número possui o formato completo de telefone (11 dígitos)
      if (valueLimpo.length === 11) {
        // Formata o número no formato (XX) XXXXX-XXXX
        return `(${valueLimpo.slice(0, 2)}) ${valueLimpo.slice(2, 7)}-${valueLimpo.slice(7)}`;
      } else {
        // Retorna o value original se não estiver no formato esperado
        return value;
      }
    },

    formatarValorEmReal(value) {
      const numero = parseFloat(value);
      if (isNaN(numero)) {
        return '';
      }
    
      const formatoReais = {
        minimumFractionDigits: 2,
        style: 'currency',
        currency: 'BRL',
      };
    
      return numero.toLocaleString('pt-BR', formatoReais);
    },

    removeMascara(value) {
      return value.replace(/\D/g, '');
    },

    removerFormat(value) {
      return value.replace(/[^\d.,]/g, '')
                  .replace(/\s/g, '')
                  .replace(/\./g, '')
                  .replace(',', '.')
    }
}
