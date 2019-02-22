Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    },
  },
  template: `
    <div class="product">

      <div class="product-image">
        <img v-bind:src="image" >
      </div>

      <div class="product-info">

        <h1>{{ title }}</h1>

        <!-- <h2 :class="{ noSale: !onSale }" >{{ onSaleInfo }} END OF YEAR SALE!!!</h2> -->

        <p v-if="inStock">In Stock</p>
        <p v-else >Out of Stock</p>
        <p>{{ sale }}</p>
        <!-- <p v-if="inventory > 10">In Stock</p> -->
        <!-- <p v-else-if="inventory <= 10 && inventory > 0">Almost Sold Out!</p> -->
        <!-- <p v-else>Out of Stock</p> -->
        <a v-bind:href="link" >More Products Like This</a>

        <p>Shipping: {{ shipping }}</p>

        <ul>
          <li v-for="detail in details">{{ detail }}</li>
        </ul>

        <div
          v-for="(variant, index) in variants"
          :key="variant.variantId"
          class="color-box"
          :style="{ backgroundColor: variant.variantColor }"
          @mouseover="updateProduct(index)"
        >
        </div>

        <h3>Sizes</h3>
        <ul>
          <li
          v-for="size in sizes">{{ size }}</li>
        </ul>

        <button
          v-on:click="addToCart"
          :disabled="!inStock"
          :class="{ disabledButton: !inStock }"
        >
        Add to Cart
        </button>
        <button v-on:click="removeFromCart">Remove from Cart</button>

        <div class="cart">
          <p>Cart: {{ cart }}</p>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
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
    }
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
    sale() {
      if (this.onSale && this.inStock) {
        return this.brand + ' ' + this.product + ' are on sale!'
      } else {
        return this.brand + ' ' + this.product + ' are not on sale.'
      }
    },
    shipping() {
      if (this.premium) {
        return "Free";
      } else {
        return "$2.99";
      }
    }
  }
})

const app = new Vue({
  el: '#app',
  data: {
    premium: true,
  }
})
