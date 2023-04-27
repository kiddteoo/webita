var vue_app = new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  data: {
    info: { values: [] },
    publicacion: {},
    publicacion_length: 0,
    comment: '',
    id: '',
    username: '',
    url_img: '',
    perfil: {}
  },
  created() {
    let url = window.location.href;
    url = new URL(url);
    let search_params = url.searchParams;
    let id = search_params.get('id');
    this.id = id;
    this.info.values = []
    this.info.values.push(id)
    fetch("http://localhost:4000/getPublis",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(this.info),
        mode: "cors",
        cache: "default"
      }
    ).then(
      (response) => {
        return (response.json());
      }
    ).then(
      (data) => {
        console.log(data)
        this.publicacion = data
        this.publicacion_length = data.comentaris.length;

      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );
      fetch("http://localhost:4000/getMyProfil",
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: "include",
          body: '',
          mode: "cors",
          cache: "default"
        }
      ).then(
        (response) => {
          return (response.json());
        }
      ).then(
        (data) => {
          this.perfil = data
          
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      );
  },
  mounted() {

    const menu = document.querySelector('ul');


    const icon = document.getElementById('icon-new');

    // Get the button
    const menuToggle = document.querySelector('#menu-toggle');
    const spanToggle = menuToggle.querySelector('span');



    spanToggle.addEventListener('click', () => {
      console.log("hola")
      menu.classList.toggle('active');
    });


    document.addEventListener('click', function (event) {
      if (( event.target != spanToggle) && event.target != icon && !menu.contains(event.target)) {
        // Hide the ul element or remove the active class
        menu.classList.remove('active');
      }
    });
  },
  methods: {

    sendComment: function () {
      this.url_img = this.perfil.url_img;
      this.username = this.perfil.username;
      let comentari = {
        user_img: this.url_img,
        user: this.username,
        coment_text: this.comment,
      }
      this.info.values = []
      this.info.values.push(this.id)
      this.info.values.push(comentari);
      fetch("http://localhost:4000/addComment",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(this.info),
        mode: "cors",
        cache: "default"
      }
    ).then(
      (response) => {
        return (response.json());
      }
    ).then(
      (data) => {
        this.publicacion = data;
        this.publicacion_length = data.comentaris.length;
        this.comment = ''

      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );
    },
    async tryShare() {
      try {
        await navigator.share({
          title: "Tenarse App",
          text: "Welcome To Tenarse, join now!!!",
          url:  window.location.href
        });
        console.log("Content shared successfully!");
      } catch (error) {
        console.error("Error sharing content:", error);
      }
    },

  }
})
