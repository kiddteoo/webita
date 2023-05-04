var vue_app = new Vue({
    el: "#app",
    vuetify: new Vuetify(),
    components: {
        vuejsDatepicker
    },
    data: {
        showPassword: false,
        pass: '',
        email: '',
        confirm_pass: '',
        username: '',
        surname: '',
        name: '',
        info: { values: [] },

    },
     mounted(){
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
     },
    methods: {
        register: function(name, surname, username, email, pass){
            this.info.values = []
            this.info.values.push(name);
            this.info.values.push(surname);
            this.info.values.push(username);
            this.info.values.push(email);
            this.info.values.push(pass);
            console.log(this.info)
            fetch("http://localhost:4000/createNew",
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
                    const redirectUrl = data.redirectUrl;
                    window.location.href = redirectUrl;
                }
            ).catch(
                (error) => {
                    console.log(error);
                }
            );
        }
    }
})
