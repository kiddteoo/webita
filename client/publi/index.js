var vue_app = new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  data() {
    return{
    info: { values: [] },
    publicacion: {},
    perfiles: [],
    publicacion_length: 0,
    likes_length: 0,
    comment: '',
    id: '',
    username: '',
    url_img: '',
    perfil: {},
    isLike: 3,
    likes_users: []
    }
  },
  created() {
    fetch("http://localhost:4000/getProfiles/",
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    credentials: "include",
                    mode: "cors",
                    cache: "default"
                }
            ).then(
                (response) => {
                    return (response.json());
                }
            ).then(
                (data) => {
                    this.perfiles = data;
                    console.log(this.perfiles);
                }
            ).catch(
                (error) => {
                    console.log(error);
                }
            );
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
        this.likes_length = data.likes.length;
        this.publicacion.likes.forEach(id_like =>{
          this.perfiles.forEach(perfil =>{
            if(id_like == perfil._id){
              var lik_us = {
                user_img: perfil.url_img,
                username: perfil.username
              }
              this.likes_users.push(lik_us)
            }
          })
        })

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
          this.publicacion.likes.forEach(id_like => {
            console.log(data)
            if(id_like == this.perfil._id)
              this.isLike = 1;
          });
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      );

  },
  mounted() {
    const main = document.createElement('div');
        main.classList.add('circle-main');
        document.body.appendChild(main);
        
        const second = document.createElement('div');
        second.classList.add('second-circle');
        document.body.appendChild(second);
        
        
        document.addEventListener('mousemove', function(e){
            const x = e.clientX;
            const y = e.clientY;
        
            second.style.transform = `translate(${x}px, ${y}px)`;
            main.style.transform = `translate(${x}px, ${y}px)`;
        
            const hvr = document.querySelectorAll('.hoverable');
        
            Array.from(hvr).forEach((hvrEL) => {
                hvrEL.addEventListener('mouseover', (e) => {
                    main.classList.add('circle-hide');
                    second.classList.add('circle-scale');
                })
            })
        
            Array.from(hvr).forEach((hvrEL) => {
                hvrEL.addEventListener('mouseout', (e) => {
                    main.classList.remove('circle-hide');
                    second.classList.remove('circle-scale');
                })
            });
        
        });
    const menu = document.querySelector('.ul-parent2');
    const menu2 =  document.querySelector('.ul-parent3');

    const icon = document.getElementById('icon-new');

    // Get the button
    const menuToggle = document.querySelector('#menu-toggle');
    const menuToggle3 = document.querySelector('#menu-toggle3');

    const spanToggle = menuToggle.querySelector('span');

    const menuToggle4 = document.querySelector("#like-toggle")
    const menuToggle5 = document.querySelector("#like-toggle2")


    

    spanToggle.addEventListener('click', () => {
      menu.classList.toggle('active');
    });

    menuToggle3.addEventListener('click', () => {
      menu.classList.remove('active');
    });
    menuToggle5.addEventListener('click', () => {
      menu2.classList.remove('active');
    });

    menuToggle4.addEventListener('click', () =>{
      menu2.classList.toggle('active');
    })

    document.addEventListener('click', function (event) {
      if (( event.target != spanToggle) && (event.target != menuToggle4) && event.target != icon && !menu.contains(event.target) && !menu2.contains(event.target)) {
        // Hide the ul element or remove the active class
        menu.classList.remove('active');
        menu2.classList.remove('active');
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
    
    addLike: function (id) {
      console.log(id);
      console.log(this.perfil._id)
      this.info.values = [];
      this.info.values.push(id);
      this.info.values.push(this.perfil._id);
      fetch("http://localhost:4000/addLike/",
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
              this.isLike = 1;
              var counter = 0;
              this.likes_users.forEach(like =>{
                counter++;
              })

              if(counter == this.likes_users.length){
                var lik_us = {
                  user_img: this.perfil.url_img,
                  username: this.perfil.username
                }
                this.likes_users.push(lik_us)
              }
              this.likes_length = this.likes_users.length;
           
          }
      ).catch(
          (error) => {
              console.log(error);
          }
      );
      
  },        
  removeLike: function (id) {
      console.log(id);
      console.log(this.perfil._id)
      this.info.values = [];
      this.info.values.push(id);
      this.info.values.push(this.perfil._id);
      fetch("http://localhost:4000/removeLike/",
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
              
                  if(this.publicacion._id == id)
                  {
                      
                      this.isLike = 3;
                  }

                  this.likes_users.forEach(like =>{
                    if(like.username == this.perfil.username)
                      this.likes_users.pop(like)
                  })

                  this.likes_length = this.likes_users.length;

    
      
           
             
          }
      ).catch(
          (error) => {
              console.log(error);
          }
      );
      
  },

  }
})
