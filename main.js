const app = new Vue({
  el: '#app',
  data: {
    product: 'Socks',
    image: './assets/socks-green.jpeg',
    link: 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks',
    inventory: 6,
    inStock: false,
    onSale: true,
  }
})
