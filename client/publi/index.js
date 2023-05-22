var vue_app = new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  data() {
    return {
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
      publi_user_img: '',
      publi_user_username: '',
      likes_users: []
    } 
  },
  created() {
    fetch("https://tenarse.online/getProfiles/",
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


/*     fetch("http://tenarse.online:4000/getPublis",
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
        this.publicacion.likes.forEach(id_like => {
          this.perfiles.forEach(perfil => {
            if (id_like == perfil._id) {
              var lik_us = {
                user_img: perfil.url_img,
                username: perfil.username
              }
              this.likes_users.push(lik_us)
            }
          })
        })
        this.perfiles.forEach(perfil => {
          if (perfil._id == this.publicacion.owner) {
            this.publi_user_img = perfil.url_img;
            this.publi_user_username = perfil.username;
          }
        })

        this.publicacion.comentaris.forEach(coment => {
          this.perfiles.forEach(perfil => {
            if (perfil._id == coment.user) {
              coment.user_img = perfil.url_img;
              coment.username = perfil.username;
            }
          })
        })

      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );

    fetch("http://tenarse.online:4000/getMyProfil2",
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
        console.log("HHHH ")
        console.log(this.perfil)
        console.log(this.publicacion)
        this.publicacion.likes.forEach(id_like => {
          console.log(data)
          if (id_like == this.perfil._id)
            this.isLike = 1;
        });
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    ); */






    const firstFetch = fetch("https://tenarse.online/getPublis", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify(this.info),
      mode: "cors",
      cache: "default"
    }).then((response) => response.json());

    const secondFetch = fetch("https://tenarse.online/getMyProfil2", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: "include",
      body: '',
      mode: "cors",
      cache: "default"
    }).then((response) => response.json());

    Promise.all([firstFetch, secondFetch])
      .then(([firstData, secondData]) => {

               

        this.publicacion = firstData
        console.log(this.publicacion.text)
        this.publicacion_length =  this.publicacion.comentaris.length;
        this.likes_length =  this.publicacion.likes.length;
        this.publicacion.likes.forEach(id_like => {
          this.perfiles.forEach(perfil => {
            if (id_like == perfil._id) {
              var lik_us = {
                user_img: perfil.url_img,
                username: perfil.username
              }
              this.likes_users.push(lik_us)
            }
          })
        })
        this.perfiles.forEach(perfil => {
          if (perfil._id == this.publicacion.owner) {
            this.publi_user_img = perfil.url_img;
            this.publi_user_username = perfil.username;
          }
        })

        this.publicacion.comentaris.forEach(coment => {
          this.perfiles.forEach(perfil => {
            if (perfil._id == coment.user) {
              coment.user_img = perfil.url_img;
              coment.username = perfil.username;
            }
          })
        })


        this.perfil = secondData
        console.log("HHHH ")
          if(!this.publi_user_img){
                window.location.reload();
            }
        console.log(this.perfil)
        console.log(this.publicacion)
        this.publicacion.likes.forEach(id_like => {
          if (id_like == this.perfil._id)
            this.isLike = 1;
        });
     
      })
      .catch((error) => {
        console.log(error);
      });








  },
  mounted() {

    
    
    const main = document.createElement('div');
    main.classList.add('circle-main');
    document.body.appendChild(main);

    const second = document.createElement('div');
    second.classList.add('second-circle');
    document.body.appendChild(second);


    document.addEventListener('mousemove', function (e) {
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
    const menu2 = document.querySelector('.ul-parent3');

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

    menuToggle4.addEventListener('click', () => {
      menu2.classList.toggle('active');
    })

    document.addEventListener('click', function (event) {
      if ((event.target != spanToggle) && (event.target != menuToggle4) && event.target != icon && !menu.contains(event.target) && !menu2.contains(event.target)) {
        // Hide the ul element or remove the active class
        menu.classList.remove('active');
        menu2.classList.remove('active');
      }
    });


  },
  methods: {
    goBack: function()
    {
      window.history.back();
    },
    sendComment: function () {
      this.id_user = this.perfil._id;
      let comentari = {
        user: this.id_user,
        coment_text: this.comment,
      }
      this.info.values = []
      this.info.values.push(this.id)
      this.info.values.push(comentari);
      fetch("https://tenarse.online/addComment",
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
          this.publicacion.comentaris.forEach(coment => {
            if (coment.user == this.perfil._id) {
              coment.user_img = this.perfil.url_img;
              coment.username = this.perfil.username;
            }
          })
          this.publicacion_length = data.comentaris.length;
          this.comment = ''

          this.publicacion.comentaris.forEach(coment => {
            this.perfiles.forEach(perfil => {
              if (perfil._id == coment.user) {
                coment.user_img = perfil.url_img;
                coment.username = perfil.username;
              }
            })
          })
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
          url: window.location.href
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
      fetch("https://tenarse.online/addLike/",
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
          this.likes_users.forEach(like => {
            counter++;
          })

          if (counter == this.likes_users.length) {
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
      fetch("https://tenarse.online/removeLike/",
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

          if (this.publicacion._id == id) {

            this.isLike = 3;
          }



          const index = this.likes_users.findIndex(user => user.username === this.perfil.username);

          if (index !== -1) {
            this.likes_users.splice(index, 1);

          }

          console.log(this.likes_users)
          console.log(index)

          /*                   this.likes_users.forEach(like =>{
                              if(like.username == this.perfil.username)
                                this.likes_users.pop(like)
                            }) */

          this.likes_length = this.likes_users.length;





        }
      ).catch(
        (error) => {
          console.log(error);
        }
      );

    },
    showPerfil: function (id) {
      console.log(id);
      this.perfiles.forEach(perfil => {
        if (perfil.username == id)
          id = perfil._id;
      })
      fetch("https://tenarse.online/app/profile/" + id,
        {
          method: "GET",
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
          return (window.location.href = response.url);
/*                     return (response.json());
*/                }
      ).then(
        (data) => {
          console.log(data)
        }
      ).catch(
        (error) => {
          window.location.href = "https://tenarse.online/app/profile";
          console.log(error);
        }
      );
    },

  }
})
