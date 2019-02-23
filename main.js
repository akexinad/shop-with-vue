const eventBus = new Vue()

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

        <h2>{{ productName }}</h2>

        <p v-if="inStock">In Stock</p>
        <p v-else >Out of Stock</p>
        <p>{{ sale }}</p>
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
          v-for="detail in technicalInfo">{{ detail }}</li>
        </ul>

        <div class="cart-buttons-container">
          <button
            class="cart-buttons"
            v-on:click="addToCart"
            :disabled="!inStock"
            :class="{ disabledButton: !inStock }"
          >
          Add to Cart
          </button>
          <button
            class="cart-buttons"
            v-on:click="removeFromCart"
          >
          Remove from Cart
          </button>
        </div>

      </div>

      <product-tabs :reviews="reviews"></product-tabs>

    </div>
  `,
  data() {
    return {
      brand: "SEIKO",
      product: 'SKX Range',
      selectedVariant: 0,
      link: 'https://www.youtube.com/watch?v=bp_39m9k1AE',
      // inventory: 0,
      // inStock: true,
      onSale: true,
      details: ['200m Diver', 'Automatic Movement'],
      variants: [
        {
          variantId: 2234,
          variantName: 'SKX007',
          variantColor: 'black',
          variantImage: './assets/skx007.jpg',
          variantQuantity: 10
        },
        {
          variantId: 2235,
          variantName: 'SKX009',
          variantColor: 'navy',
          variantImage: './assets/skx009.jpg',
          variantQuantity: 0,
        }
      ],
      technicalInfo: ['316L Stainless Steel', '42mm wide', '46mm Lug to Lug', '22mm Lug Width', '7s26c Automatic Movement', '200m Water Resistance'],
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
  },
  computed: {
    title() {
      return this.brand + ' ' + this.product
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    productName() {
      return this.variants[this.selectedVariant].variantName;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    sale() {
      if (this.onSale && this.inStock) {
        return this.brand + ' ' + this.product + ' is on sale!'
      } else {
        return this.brand + ' ' + this.product + ' is not on sale.'
      }
    },
    shipping() {
      if (this.premium) {
        return "Free";
      } else {
        return "$2.99";
      }
    }
  },
  mounted() {
    eventBus.$on('review-submitted', productReview => {
      this.reviews.push(productReview);
    })
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
        eventBus.$emit('review-submitted', productReview)
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

Vue.component('product-tabs', {
  props: {
    reviews: {
      type: Array,
      required: true,
    }
  },

  template: `
    <div>

      <div>
        <span
          class="tab"
          :class="{ activeTab: selectedTab === tab}"
          v-for="(tab, index) in tabs"
          :key ="index"
          @click="selectedTab = tab"
        >
          {{ tab }}
        </span>
      </div>

      <div v-show="selectedTab === 'Reviews'">
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

      <product-review
        v-show="selectedTab === 'Make a Review'"
      >
      </product-review>
    </div>
  `,
  data() {
    return {
      tabs: ['Reviews', 'Make a Review'],
      selectedTab: 'Reviews',
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
