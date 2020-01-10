import React from 'react'
import ReactDOM from 'react-dom'
import '@atlaskit/css-reset'
import { DragDropContext } from 'react-beautiful-dnd'
import styled from 'styled-components'
import { Button, Modal, Input } from 'antd';
import initialData from './model'
import Column from './task/column'
import 'antd/dist/antd.css';
import './index.css';

const Container = styled.div`
  display:flex;
`

class App extends React.Component {
  state = {...initialData, visible: false, addTitle: ''};

  onDragEnd = result => {
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const start = this.state.columns[source.droppableId]
    const finish = this.state.columns[destination.droppableId]

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...start,
        taskIds: newTaskIds
      }

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn
        }
      }

      this.setState(newState)
      return
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds)
    startTaskIds.splice(source.index, 1)
    const newStart = {
      ...start,
      taskIds: startTaskIds
    }

    const finishTaskIds = Array.from(finish.taskIds)
    finishTaskIds.splice(destination.index, 0, draggableId)
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds
    }

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    }
    this.setState(newState)
  }

  openAddTaskModal = () => {
    this.setState({visible: true});
  }

  handleCancel = () => {
    this.setState({visible: false});
  }

  addTask = () => {
    // const this.state.count = Object.keys(this.state.tasks).length;
    const key = 'task-' + this.state.count + 1;
    const taskIds = [
      ...this.state.columns['column-1'].taskIds
    ];
    taskIds.push(key);
    const newState = {
      ...this.state,
      tasks: {
        ...this.state.tasks,
        [key] : { id: key, content: this.state.addTitle}
      },
      columns: {
        ...this.state.columns,
        'column-1': {
          ...this.state.columns['column-1'],
          taskIds
        }
      },
      count: this.state.count++,
    }
    this.setState(newState);
  }

  handleTextChange = e => {
    if (e.target.value) {
      this.setState({
        addTitle: e.target.value
      })
    }
  }

  handleOk = () => {
    this.handleCancel();
    this.setState({
      visible:false
    }, () =>  this.addTask())
  }

  deleteTask = (task, index) =>  {
    console.log(task, index);
    // const taskIds = [
    //   ...this.state.columns['column-1'].taskIds
    // ];
    // const tasks = [...this.state.tasks.keys()];
    // tasks = tasks.keys().filter(key => key != index);
    // const newState = {
    //   ...this.state,
    //   count: this.state.count--
    // }
    // this.setState(newState);
  }

  render() {
    return (
      <div className="container">
        <Button className="add-btn" type="primary" onClick={this.openAddTaskModal}>Add task</Button>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Container>
            {this.state.columnOrder.map(columnId => {
              const column = this.state.columns[columnId]
              const tasks = column.taskIds.map(
                taskId => this.state.tasks[taskId]
              )

              return (
                <Column key={column.id} column={column} tasks={tasks} deleteTask={this.deleteTask}/>
              )
            })}
          </Container>
        </DragDropContext>
        <Modal
          title="Add Task"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Input placeholder="task title" value={this.state.addTitle} onChange={this.handleTextChange}/>
        </Modal>
      </div>
    )
  }
}

export default App;
