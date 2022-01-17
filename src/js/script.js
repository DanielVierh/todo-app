window.onload = init;

function init() {
    // Lade Daten aus dem LocalStorage
    app.load_Todos();
}

var app = new Vue({
    el: "#app",
    data: {
        todos: [],
        newTodo: ''
    },

    computed: {
        doneTodo() {
            return this.todos.filter(todo => todo.done);
        },
        openTodo() {
            return this.todos.filter(todo => !todo.done);
        },
    },

    methods: {
        // Aufgabe hinzufügen
        addTodo() {
            this.todos.push({ description: this.newTodo, done: false });
            this.newTodo = '';
            // Aufgabe auf Gerät speichern
            this.store_Todos();
        },


        store_Todos() {
            localStorage.setItem("storedToDo", JSON.stringify(this.todos));
        },

        // Lädt abgespeichertes Array aus dem LocalStorage
        load_Todos() {
            if (localStorage.getItem('storedToDo') != null) {
                this.todos = JSON.parse(localStorage.getItem('storedToDo'));
            }
        },

        // Status in doneTodo ändern
        changeStatus(index) {
            this.todos[index].done = this.todos[index].done ? false : true;
            // Änderung abspeichern
            this.store_Todos();
        },

        // Aufgabe löschen, inkl. Sicherheitsabfrage
        deleteTodo(index) {
            // Sicherheitsabfrage
            const res = window.confirm(`Das ToDo: "${this.todos[index].description}" wirklich löschen?`);
            // Wenn mit ok bestätigt, löschen
            if (res) {
                this.todos.splice(index, 1);
                this.store_Todos();
            }
        }
    }
});


window.addEventListener("keydown", (e) => {
    if(e.key === 'Enter') {
        app.addTodo();
    }
})