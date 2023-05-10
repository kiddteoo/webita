var vue_app = new Vue({
    el: "#app",
    vuetify: new Vuetify(),
    data: {
        publicacions: {},
        perfiles: [],
        info: { values: [] },
        infoDialog: false,
        searchTerm: '',
        perfil: {},
        isLike: 3,
        noLike: false,like: false,
        len_publis: 0,
        
    },
/*     watch:{
        like(newValue) {
            if (newValue) {
              this.isLike = 1;
            }
          },
          noLike(newValue){
            if (newValue) {
                this.isLike = 0;
              }
          }
    }, */
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
            if(this.perfil == null){
                console.log("hola")
/*                 window.location.href = "http://localhost:4000/sign"
 */            }
                
        }
    ).catch(
        (error) => {
            console.log(error);
        }
    );
        fetch("http://localhost:4000/getPublicacions",
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
                this.publicacions = data;
                var count = 0;
                this.publicacions.forEach(publi =>{
                    count = 0;
                    publi.likes.forEach(like =>{
                        if(like != this.perfil._id)
                            count++;
                    })
                    if(count == publi.likes.length)
                        {
                            publi.noLike = 1;
                        }
                })

                

                this.publicacions.forEach(publi =>{
                    this.perfiles.forEach(perfil =>{
                        console.log("ID-PUBLI", publi.owner);
                        console.log("PERFIL ID", perfil._id)
                        if(perfil._id == publi.owner){
                            publi.user_img = perfil.url_img;
                            publi.owner_name = perfil.username;
                        }
                    })
                })
                console.log(this.publicacions)
                console.log(this.perfil._id)
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        );
       
    },
    mounted() {
        const menu = document.querySelector('ul');
        const main = document.createElement('div');
        main.classList.add('circle-main');
        document.body.appendChild(main);
        
        const second = document.createElement('div');
        second.classList.add('second-circle');
        document.body.appendChild(second);
        
        const MyDiv = document.querySelector('.v-application--wrap');

        document.addEventListener('mousemove', function(e){
            const rect = MyDiv.getBoundingClientRect();

            const x = e.clientX -rect.left;
            const y = e.clientY -rect.top;
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

        const icon = document.getElementById('icon-new');
        console.log(icon)
        // Get the button
        const menuToggle = document.querySelectorAll('#menu-toggle');
        menuToggle.forEach((toggle) => {
            toggle.addEventListener('click', () => {
                menu.classList.toggle('active');
            });
        });

        document.addEventListener('click', function (event) {
            if (event.target != menuToggle[0] && event.target != icon && !menu.contains(event.target)) {
                // Hide the ul element or remove the active class
                menu.classList.remove('active');
            }
        });

        logo.addEventListener('click', () => {
            logo.classList.toggle('rotate');
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 1000);;
        });


/*         const btn = document.querySelectorAll('.btn-up');
        console.log(btn);
        window.addEventListener("scroll", function () {
            if (window.scrollY === 0) {
                btn[0].style.display = "none";
            } else {
                btn[0].style.display = "block";
            }
        });

        btn[0].addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }); */
        /*  */


    },

    methods: {

        getPublis: function(){
            fetch("http://localhost:4000/getPublicacions",
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
                this.publicacions = data;
                var count = 0;
                this.publicacions.forEach(publi =>{
                    count = 0;
                    publi.likes.forEach(like =>{
                        if(like != this.perfil._id)
                            count++;
                    })
                    if(count == publi.likes.length)
                        {
                            publi.noLike = 1;
                        }
                })

                

                this.publicacions.forEach(publi =>{
                    this.perfiles.forEach(perfil =>{
                        console.log("ID-PUBLI", publi.owner);
                        console.log("PERFIL ID", perfil._id)
                        if(perfil._id == publi.owner){
                            publi.user_img = perfil.url_img;
                            publi.owner_name = perfil.username;
                        }
                    })
                })
                console.log(this.publicacions)
                console.log(this.perfil._id)
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        );
        },

        showPerfil: function (id) {
            console.log(id);
            fetch("http://localhost:4000/app/profile/" + id,
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
                    window.location.href = "http://localhost:4000/app/profile";
                    console.log(error);
                }
            );
        },
        showMyProfile: function () {
            fetch("http://localhost:4000/app/myprofile/",
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
                    console.log(error);
                }
            );
        },
        logout: function () {
            fetch("http://localhost:4000/logout/",
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
                    var Backlen=history.length;
                    history.go(-Backlen);
                    return (window.location.href = response.url);

   /*                     return (response.json());
    */               }
            ).then(
                (data) => {
                    console.log(data)
                }
            ).catch(
                (error) => {
                    console.log(error);
                }
            );
        },
        filteredPerfiles: function () {
            console.log("filteredPerfiles called");

            return this.perfiles.filter(perfil =>

                perfil.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        },
        getProfiles: function () {
            console.log("hola")
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
                    console.log(this.infoDialog)
                    console.log(this.perfiles);
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
                    url: "http://localhost:4000/public"
                });
                console.log("Content shared successfully!");
            } catch (error) {
                console.error("Error sharing content:", error);
            }
        },

        showPubli: function (id) {
            console.log(id)
            window.location.href = '/app/publicacion_template?id=' + id

        },
        addLike: function (id) {
            console.log("ADD");
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
                    vue_app.getPublis();

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
                    vue_app.getPublis();

                }
            ).catch(
                (error) => {
                    console.log(error);
                }
            );
            
        },

        

    }
})
