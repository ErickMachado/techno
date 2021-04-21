const vue = new Vue({
  el: '#app',
  created() {
    this.getProducts();
    this.checkStorageProducts();
  },
  data: {
    alertMessage: '',
    alertActive: false,
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
      this.showAlert(`${this.product.name} adicionado ao carrinho 🎉`);
      this.product.stock--;
      const { id, name, price } = this.product;
      this.cart.push({ id, name, price });
    },
    removeProductFromCart(productIndex) {
      this.cart.splice(productIndex, 1);
    },
    checkStorageProducts() {
      const storageProducts = localStorage.getItem('cart');

      if (storageProducts) {
        this.cart = JSON.parse(storageProducts);
      }
    },
    showAlert(message) {
      this.alertActive = true;
      this.alertMessage = message;
      setTimeout(() => (this.alertActive = false), 2000);
    }
  },
  watch: {
    cart() {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }
});
