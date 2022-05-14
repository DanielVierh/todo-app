window.onload = init;

function init() {
    // Lade Daten aus dem LocalStorage
    app.load_Todos();
}


// Create current Date
function getCurrentDate() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const currentDate = ` |- ${addZero(day)}.${addZero(month)}.${year}`;
    return currentDate;
}
// Adding a 0 to the value if the value is unter 10
function addZero(val) {
    if(val < 10) {val = `0${val}`;}
    return val;
}

// To replace |- OldDate with |- newDate
function replaceDate(todoTxt) {
    const splittedTodotext = todoTxt.split("|-");
    const todotext_with_current_Date = ` ${splittedTodotext[0] + getCurrentDate()} (Aktualisiert)`;
    return todotext_with_current_Date;
}


var app = new Vue({
    el: '#app',
    data: {
        todos: [],
        newTodo: '',
    },

    computed: {
        doneTodo() {
            return this.todos.filter((todo) => todo.done);
        },
        openTodo() {
            return this.todos.filter((todo) => !todo.done);
        },
        openQuantity() {
            let sum = 0;
            this.todos.forEach((todo) => {
                if (!todo.done) {
                    sum++;
                }
            });
            return sum;
        },

       closedQuantity() {
            let sum = 0;
            this.todos.forEach((todo) => {
                if (todo.done) {
                    sum++;
                }
            });
            return sum;
        },
    },

    methods: {
        // Aufgabe hinzufügen
        addTodo() {
            if (this.newTodo !== '') {
                const todoText = this.newTodo + getCurrentDate() + ' (Neu)';
                this.todos.push({description: todoText, done: false});
                this.newTodo = '';
                this.store_Todos();
            } else {
                alert('Bitte ein To Do eintragen');
            }
        },

        store_Todos() {
            localStorage.setItem('storedToDo', JSON.stringify(this.todos));
        },

        // Lädt abgespeichertes Array aus dem LocalStorage
        load_Todos() {
            if (localStorage.getItem('storedToDo') != null) {
                this.todos = JSON.parse(localStorage.getItem('storedToDo'));
            }
        },

        changeTodoText(index) {
            const pureTodotext = this.todos[index].description.split("|")[0];
            const newTodoText = window.prompt("Ändere Dein Todo", pureTodotext);
            if(newTodoText !== '') {
                this.todos[index].description = ` ${newTodoText + getCurrentDate()} (Aktualisiert)`;
                // Änderung abspeichern
                this.store_Todos();
            }
        },

        // Status in doneTodo ändern
        changeStatus(index) {
            this.todos[index].done = this.todos[index].done ? false : true;
            this.todos[index].description = replaceDate(this.todos[index].description);
            // Änderung abspeichern
            this.store_Todos();
        },

        // Aufgabe löschen, inkl. Sicherheitsabfrage
        deleteTodo(index) {
            // Sicherheitsabfrage
            const res = window.confirm(
                `Das ToDo: "${this.todos[index].description}" wirklich löschen?`,
            );
            // Wenn mit ok bestätigt, löschen
            if (res) {
                this.todos.splice(index, 1);
                this.store_Todos();
            }
        },
    },
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        app.addTodo();
    }
});
