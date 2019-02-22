const app = new Vue({
  el: '#app',
  data: {
    brand: "THERE'S HOLES IN YOUR",
    product: 'Socks',
    selectedVariant: 0,
    link: 'https://www.youtube.com/watch?v=bp_39m9k1AE',
    // inventory: 0,
    // inStock: true,
    onSale: true,
    details: ['80% cotton', '20% polyester', 'XL'],
    variants: [
      {
        variantId: 2234,
        variantColor: 'green',
        variantImage: './assets/socks-green.jpeg',
        variantQuantity: 10
      },
      {
        variantId: 2235,
        variantColor: 'blue',
        variantImage: './assets/socks-blue.jpeg',
        variantQuantity: 0,
      }
    ],
    sizes: ['XS', 'S', 'M', 'XM', 'L', 'XL', 'XXL', 'DAMN SON YOU BIG FOOT!!!'],
    cart: 0,
  },
  methods: {
    addToCart: function() {
      this.cart += 1;
    },
    updateProduct: function(index) {
      this.selectedVariant = index;
      console.log(index);
    },
    removeFromCart: function() {
      if (this.cart === 0) {
        return
      } else {
        this.cart -= 1;
      }
    }
  },
  computed: {
    title() {
      return this.brand + ' ' + this.product
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    onSaleInfo() {
      return this.brand + ' ' + this.product
    },
    sale() {
      if (this.onSale && this.inStock) {
        return this.brand + ' ' + this.product + ' are on sale!'
      } else {
        return this.brand + ' ' + this.product + ' are not on sale.'
      }
    },
  }
})
