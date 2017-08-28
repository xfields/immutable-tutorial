import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Immuatble from 'immutable'
import TodoItem from './TodoItem'
import Footer from './Footer'
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters'

const TODO_FILTERS = {
  [SHOW_ALL]: () => true,
  [SHOW_ACTIVE]: todo => !todo.get('completed'),
  [SHOW_COMPLETED]: todo => todo.get('completed')
}

export default class MainSection extends Component {
  static propTypes = {
    todos: PropTypes.instanceOf(Immuatble.List).isRequired,
    // todos: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  }

  state = { filter: SHOW_ALL }

  handleClearCompleted = () => {
    this.props.actions.clearCompleted()
  }

  handleShow = filter => {
    this.setState({ filter })
  }

  renderToggleAll(completedCount) {
    const { todos, actions } = this.props
    if (todos.size > 0) {
      return (
        <input className="toggle-all"
               type="checkbox"
               checked={completedCount === todos.size}
               onChange={actions.completeAll} />
      )
    }
  }

  renderFooter(completedCount) {
    const { todos } = this.props
    const { filter } = this.state
    // const activeCount = todos.length - completedCount
    const activeCount = todos.size - completedCount

    if (todos.size) {
      return (
        <Footer completedCount={completedCount}
                activeCount={activeCount}
                filter={filter}
                onClearCompleted={this.handleClearCompleted}
                onShow={this.handleShow} />
      )
    }
  }

  render() {
    const { todos, actions } = this.props
    const { filter } = this.state

    const filteredTodos = todos.filter(TODO_FILTERS[filter]) // 返回的还是Immutable List
    const completedCount = todos.reduce((count, todo) => {
      console.log('todo', todo)
      return todo.get('completed') ? count + 1 : count
      // todo.completed ? count + 1 : count,
      },
      0
    )

    return (
      <section className="main">
        {this.renderToggleAll(completedCount)}
        <ul className="todo-list">
          {filteredTodos.map(todo =>
            <TodoItem key={todo.get('id')} todo={todo} {...actions} />
          )}
        </ul>
        {this.renderFooter(completedCount)}
      </section>
    )
  }
}
