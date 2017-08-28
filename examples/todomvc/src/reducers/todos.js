import Immutable from 'immutable'
import { ADD_TODO, DELETE_TODO, EDIT_TODO, COMPLETE_TODO, COMPLETE_ALL, CLEAR_COMPLETED } from '../constants/ActionTypes'

const initialState = Immutable.fromJS([
  {
    text: 'Use Redux',
    completed: false,
    id: 0
  }
])
// const initialState = [
//   {
//     text: 'Use Redux',
//     completed: false,
//     id: 0
//   }
// ]

export default function todos(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO:
      const newTodo = Immutable.Map({
        id: state.reduce((maxId, todo) => Math.max(todo.get('id'), maxId), -1) + 1,
        completed: false,
        text: action.text
      })
      return state.push(newTodo)

    case DELETE_TODO:
      // return state
      return state.filter(todo =>
        todo.get('id') !== action.id
      )

    case EDIT_TODO:
      return state.map(todo =>
        todo.id === action.id ?
          { ...todo, text: action.text } :
          todo
      )

    case COMPLETE_TODO:
      return state.map(todo =>
        todo.get('id') === action.id
        // ? { ...todo, completed: !todo.completed }
        ? todo.set('completed', !todo.get('completed')) // 直接SET就好，不用新对象
        : todo
      )

    case COMPLETE_ALL:
      const areAllMarked = state.every(todo => todo.get('completed'))
      // return state.map(todo => ({
      //   ...todo,
      //   completed: !areAllMarked
      // }))
      return state.map(todo => (
        todo.set('completed', !areAllMarked)
      ))

    case CLEAR_COMPLETED:
      return state.filter(todo => todo.get('completed') === false)

    default:
      return state
  }
}
