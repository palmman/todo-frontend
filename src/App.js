import React, { Component } from 'react'
import Modal from "./components/Modal";
import axios from 'axios'; 
import './App.css';
// eslint-disable-next-line
import CustomModal from './components/Modal'




class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewActive : false,
      activeItem: {
        title: "",
        description: "",
        active: false,
      },
      todoList : []
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios   //Axios to send and receive HTTP requests
      .get("http://localhost:8000/api/tasks/")
      .then(res => this.setState({ todoList: res.data }))
      .catch(err => console.log(err));
  };

  toggle = () => {
    this.setState({modal: !this.state.modal});
  };

  handleSubmit = item => {
    this.toggle();
    if (item.id) {
      // if old post to edit and submit
      axios
        .put(`http://localhost:8000/api/tasks/${item.id}/`, item)
        .then(res => this.refreshList())
    }
    axios
      .post("http://localhost:8000/api/tasks/", item)
      .then(res => this.refreshList())
  };

  handleDelete = item => {
    axios
      .delete(`http://localhost:8000/api/tasks/${item.id}/`, item)
      .then(res => this.refreshList())
  };

  // Create item
  createItem = () => {
    const item = { title: "", description: "", active: false };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  //Edit item
  editItem = item => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };
  

  displayCompleted = status => {
    if (status) {
      return this.setState({ viewActive: true });
    }
    return this.setState({ viewActive: false });
  };  

  renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewActive ? "active" : ""}
        >
          Completed
            </span>
        <span
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewActive ? "" : "active"}
        >
          Incompleted
            </span>
      </div>
    )
  };

  // Main variable to render items on the screen
  renderItems = () => {
    const { viewActive } = this.state;
    const newItems = this.state.todoList.filter(
      item => item.active === viewActive
    );
    return newItems.map(item => (

      <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
        
        <span
          className={`todo-title mr-2 ${this.state.viewCompleted ? "completed-todo" : ""
            }`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
        <button
            onClick={() => this.editItem(item)}
            className="btn btn-secondary mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => this.handleDelete(item)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </span>
      </li>
    ))
  };
  // ///////////////////////////////////////////////////////////

  

  render() {
    return (
      <main className="content p-3 mb-2 bg-info">
        <h1 className="text-white text-uppercase text-center my-4">Task Manager</h1>
        <div className="row ">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div>
              <button onClick={this.createItem} className="btn btn-warning">
                  Add task
                    </button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        <footer className="my-3 mb-2 bg-info text-white text-center">
          Copyright 2021 &copy; Pedtech
        </footer>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
      </main>
    );
  }
}



export default App;
