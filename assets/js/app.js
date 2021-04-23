const vue = new Vue({
  el: '#app',
  created() {
    this.getProducts();
    this.redirect();
    this.checkStorageProducts();
  },
  data: {
    alertMessage: '',
    alertActive: false,
    cart: [],
    cartModalActive: false,
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
    openCartModal() {
      this.cartModalActive = true;
    },
    closeCartModal() {
      this.cartModalActive = false;
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
    },
    redirect() {
      const hash = document.location.hash.replace('#', '');

      if (hash) {
        this.getProduct(hash);
      }
    },
    compareStock() {
      const products = this.cart.filter((product) => {
        return product.id === this.product.id ? true : false;
      });

      this.product.stock -= products.length;
    }
  },
  watch: {
    cart() {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
    product() {
      document.title = this.product.name || 'Techno | Comércio de eletrônicos';
      const hash = this.product.name || '';
      history.pushState(null, null, `#${hash}`);

      this.compareStock();
    }
  }
});
