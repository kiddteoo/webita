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
        birthdate: null,
        date: null,
        selectedDate: null,
        showPicker: false,
        dateFormat: "yyyy-MM-dd",
        confirm_pass: ''
    },
})
