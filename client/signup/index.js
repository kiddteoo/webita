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
     
    methods: {
        register: function(name, surname, username, email, pass){
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
