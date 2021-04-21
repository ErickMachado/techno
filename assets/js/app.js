const vue = new Vue({
  el: '#app',
  created() {
    this.getProducts();
  },
  data: {
    cart: [],
    products: [],
    product: false
  },
  computed: {
    totalInCart() {
      return this.cart.length;
    },
    totalPurchase() {
      let total;

      if (this.cart.length > 0) {
        total = this.cart
          .map(({ price }) => price)
          .reduce((accumulator, next) => accumulator + next);
      } else {
        total = 0;
      }

      return total;
    }
  },
  filters: {
    formatNumberToCurrency(value) {
      return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    }
  },
  methods: {
    getProducts() {
      try {
        fetch('./api/products.json')
          .then((response) => response.json())
          .then((data) => (this.products = data));
      } catch (error) {
        console.log(error);
      }
    },
    getProduct(productName) {
      try {
        fetch(`./api/products/${productName.toLowerCase()}/data.json`)
          .then((response) => response.json())
          .then((data) => (this.product = data));
      } catch (error) {
        console.log(error);
      }
    },
    openModal(productName) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      this.getProduct(productName.toLowerCase());
    },
    closeModal() {
      this.product = false;
    },
    addProductToCart() {
      this.product.stock--;
      const { id, name, price } = this.product;
      this.cart.push({ id, name, price });
    },
    removeProductFromCart(productIndex) {
      this.cart.splice(productIndex, 1);
    }
  }
});
