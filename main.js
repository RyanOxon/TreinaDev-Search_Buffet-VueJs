const app = Vue.createApp({
  data(){
    return{
      currentPage: 'home',
      searchText: '',
      detailedBuffet: {} ,
      buffetList: [],
      event_id: -1,
      isActive: false,
      formData: {
        date: '',
        peopleCount: 1
      },
      available: null,
      reason: '',
      error: '',
    }
  },
  computed: {
    listResult(){
      if(this.searchText){
        return this.buffetList.filter(buffet => {
          return buffet.brand_name.toLowerCase().includes(this.searchText.toLowerCase());
        })
      } else{
        return this.buffetList
      }
    }
  },

  async mounted(){
    this.listResult = await this.getData();
  },

  methods: {
    async getData(){
      let response = await fetch('http://localhost:3000/api/v1/buffets');
      const data = await response.json();

      this.buffetList = data;
    },

    async goBuffet(id){
      this.currentPage = 'buffet';

      let buffetResponse = await fetch(`http://localhost:3000/api/v1/buffets/${id}`);
      let eventsResponse = await fetch(`http://localhost:3000/api/v1/buffets/${id}/events`);

      const buffet = await buffetResponse.json();
      const events = await eventsResponse.json();

      buffet.events = events;
      this.detailedBuffet = buffet;

    },

    goHome(){
      this.currentPage = 'home';
      this.detailedBuffet = {};
    },

    openModal(id) {
      this.event_id = id
      this.isActive = true;
    },
    closeModal() {
      this.event_id = -1
      this.isActive = false;
    },
    async submitForm() {
      let response = await fetch(`http://localhost:3000/api/v1/buffets/${this.detailedBuffet.id}/events/${this.event_id}/availability?date=${this.formData.date}&num_people=${this.formData.peopleCount}`);
      const data = await response.json();
      console.log(data)

      if ('available' in data) {
        this.available = data.available;
        if(data.reason){
          this.reason = data.reason;
        }
      }

      if ('error' in data){
        this.error = data.error;
      }



    }

  }

})

app.component("modal", {
  template: "#modal-template",
})

app.mount('#app');