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
        error_email: '',
        error_username: '',
        info: { values: [] },
        infoDialog: false,
        otp: ''

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
    },
    methods: {
        register: function (name, surname, username, email, pass) {
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
                    console.log("hola")
                    return (response.json());
                }
            ).then(
                (data) => {
                    console.log(data);
                    if(data == 'existe'){
                        console.log("hola")
                        this.error_username = "user";
                    }
                    else{
                        vue_app.sendCode(name, surname, username, email, pass)
                        
                    }
/*                     if(data == 'both')
                        this.error_username = "user";
                    if (data == 'user')
                        this.error_username = "user";
                    if (data == 'email') {
                        this.error_email = 'email';
                    }
                    if (data != 'user' && data != 'email') {
                        /* const redirectUrl = data.redirectUrl;
                        window.location.href = redirectUrl; 
                        vue_app.sendCode(name, surname, username, email, pass)
                    } */
                    
                }
            ).catch(
                (error) => {
                    console.log(error);
                }
            );
        },
        sendCode: function (name, surname, username, email, pass) {
            this.info.values = []
            this.info.values.push(name);
            this.info.values.push(surname);
            this.info.values.push(username);
            this.info.values.push(email);
            this.info.values.push(pass);
            console.log("ho")
            fetch("http://localhost:4000/sendCode",
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
                    console.log(data);
                    if(data.redirectUrl){
                        this.infoDialog = true;
                    }
                   
                }
            ).catch(
                (error) => {
                    console.log(error);
                }
            );
        }
    }
})
