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
        isLike: 0,
        noLike: 0,deleteLike: 0,
        isLikeNew: 0,
    },
    created() {
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
                window.location.href = "http://localhost:4000/sign"
            }
                
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

                this.publicacions.forEach(publi =>{
                    publi.likes.forEach(like =>{
                        if(like == this.perfil._id)
                            publi.isLike = 1;
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


        const btn = document.querySelectorAll('.btn-up');
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
        });
        /*  */


    },

    methods: {

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
                    window.location.reload();

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
                    this.publicacions.forEach(publi =>{
                        if(publi._id == id)
                        {
                            delete publi.isLike;
                            this.isLike = 0;
                            window.location.reload();
                        }
                    })
                }
            ).catch(
                (error) => {
                    console.log(error);
                }
            );
            
        },

    }
})
