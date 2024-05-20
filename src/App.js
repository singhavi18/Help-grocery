import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return (list = JSON.parse(localStorage.getItem("list")));
  } else {
    return [];
  }
};

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, "ENTER A VALUE", "danger");
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id == editId) return { ...item, title: name };
          return item;
        })
      );
      setEditId(null);
      setIsEditing(false);
      showAlert(true, "edited", "success");
      setName("");
    } else {
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      showAlert(true, "value added", "success");
      setName("");
    }
  };
  const editItem = (id) => {
    const specificItem = list.find((item) => item.id == id);
    setIsEditing(true);
    setEditId(id);
    setName(specificItem.title);
  };
  const removeItem = (id) => {
    showAlert(true, "value deleted", "danger");
    setList(list.filter((item) => item.id != id));
  };
  const clearList = () => {
    setList([]);
  };

  const showAlert = (show = false, msg = "", type = "") => {
    setAlert({ show, type, msg });
  };
  const removeAlert = () => {
    showAlert(false, "", "");
  };

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  return (
    <section className="section-center">
      <form action="" className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={removeAlert} />}
        <h3>grocery bud</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="eg. eggs"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="submit-btn" type="submit">
            submit
          </button>
        </div>
      </form>
      {list && (
        <div className="grocery-container">
          <List items={list} editItem={editItem} removeItem={removeItem} />
          <button className="clear-btn" onClick={clearList}>
            clear items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
