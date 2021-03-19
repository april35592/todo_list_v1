import React, { Component } from 'react';
import Form from './components/Form'
import ToDo from './components/ToDo'
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      todo: [],
      modify: {
        mode: false,
        id: 0,
        todo: '',
      },
    }
    this.fetchToDo.bind(this);
  };

  componentWillMount() {
    this.fetchToDo()
  }

  fetchToDo() {
    fetch('http://localhost:8000/todo/list/')
    .then(response => response.json())
    .then((data) => this.setState({
      todo: data,
    }));
  }

  render() {
    const getCookie = (name) => {
      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }

    const todoSubmit = (todo_text) => {
      if(this.state.modify.mode === false) {
        todoAdd(todo_text);
      } else {
        todoModify(todo_text);
      }
    }

    const todoAdd = (todo_text) => {
      const csrftoken = getCookie('csrftoken');
      fetch('http://localhost:8000/todo/create/', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
          id: null,
          todo: todo_text,
          checked: false,
        })
      }).then((response) => {
        this.fetchToDo()
      }).catch(function(error) {
        console.log('ERROR:', error)
      })
    }
    
    const todoModifyStart = (todo) => {
      if (this.state.modify.id === todo.id) {
        EndModify()
      } else {
        this.setState({
          modify: {
            mode: true,
            id: todo.id,
            todo: todo.todo,
          }
        });
      }
    }

    const todoModify = (todo_text) => {
      let csrftoken = getCookie('csrftoken');
      fetch(`http://localhost:8000/todo/update/${this.state.modify.id}/`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
          todo: todo_text,
        })
      }).then(() => {
        this.fetchToDo()
        EndModify()
      })
    }

    const EndModify = () => {     
      this.setState({
        modify:{
          mode: false,
          id: 0,
          todo: '',
        }
      })
    }

    const todoDelete = (todo) => {
      let csrftoken = getCookie('csrftoken');
      fetch(`http://localhost:8000/todo/delete/${todo.id}/`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
      }).then((response) => {
        this.fetchToDo()
      })
    }

    const todoChecked = (todo) => {
      let csrftoken = getCookie('csrftoken');
      todo.checked = !todo.checked;
      fetch(`http://localhost:8000/todo/update/${todo.id}/`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
          todo: todo.todo,
          checked: todo.checked,
        })
      }).then(() => {
        this.fetchToDo()
      })
    }

    const todoSaved = (_todo) => {
      localStorage.setItem(ToDo, JSON.stringify(_todo));
      this.setState({
        todo: _todo,
      });
    }

    return (
      <div id='App'>
        <Form
        todoSubmit={todoSubmit}
        modeModify={this.state.modify}
        />
        <ToDo
          todoList={this.state.todo}
          modeModify={this.state.modify}
          todoModify={todoModifyStart}
          todoDelete={todoDelete}
          todoChecked={todoChecked}
        />
      </div>
    );
  }
}

export default App;