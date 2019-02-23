Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true,
    },
  },
  template: `
    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>
  `,
})

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

        <product-details :details="details"></product-details>

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

      </div>

      <div>
        <h2>See Latest Reviews</h2>
        <p v-if="!reviews.length">No Reviews Yet</p>
        <ul>
          <li v-for="review in reviews">
            <p>{{ review.name }}</p>
            <p>{{ review.rating }} out of 5</p>
            <p>{{ review.text }}</p>
            <p>Does {{ review.name }} recommend this product? {{ review.recommendation }}</p>
          </li>
        </ul>
      </div>

      <product-review @review-submitted="addReview" ></product-review>

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
      details: ['80% cotton', '20% polyester'],
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
      reviews: []
    }
  },
  methods: {
    addToCart: function() {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
    },
    updateProduct: function(index) {
      this.selectedVariant = index;
      console.log(index);
    },
    removeFromCart: function() {
      this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
    },
    addReview(productReview) {
      this.reviews.push(productReview);
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

Vue.component('product-review', {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">

      <p v-if="errors.length">
        <b>Hang On!</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>

      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name" >
      </p>

      <p>
        <label for="text">Review:</label>
        <textarea id="text" v-model="text" ></textarea>
      </p>

      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating" >
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>

      <p>Would you recommend this product?</p>
        <label>
          Yes
          <input type="radio" value="Yes" v-model="recommendation"/>
        </label>
        <label>
          No
          <input type="radio" value="No" v-model="recommendation"/>
        </label>

      <p>
        <input type="submit" value="Submit">
      </p>

    </form>
  `,
  data() {
    return{
      name: null,
      text: null,
      rating: null,
      recommendation: null,
      errors: [],
    }
  },
  methods: {
    onSubmit() {
      this.errors = [];
      if (this.name && this.text && this.rating && this.recommendation) {
        let productReview = {
          name: this.name,
          text: this.text,
          rating: this.rating,
          recommendation: this.recommendation,
        }
        this.$emit('review-submitted', productReview)
        this.name = null;
        this.text = null;
        this.rating = null;
        this.recommendation = null;
      } else {
        if(!this.name) this.errors.push("Your name is required.");
        if(!this.text) this.errors.push("What's the point of leaving a review champ?");
        if(!this.rating) this.errors.push("You're reviewing but not rating it? That's like saying you love Gnocchi but when I make them for you end up going to Maccas!");
        if(!this.recommendation) this.errors.push("Think about it. Would you like it if your gandma wore these socks?");
      }
    }
  }
})

const app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: [],
  },
  methods: {
    addToCart(id) {
      this.cart.push(id);
    },
    removeFromCart(id) {
      if (this.cart.length === 0 || this.cart.indexOf(id) === -1) {
        return
      } else {
        this.cart.splice(this.cart.indexOf(id), 1);
      }
    }
  },
})
