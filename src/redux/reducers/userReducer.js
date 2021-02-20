import { SET_USER } from "../types";

const initialState = {
  username: ""
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        username: action.payload,
      };
    default:
      return state;
  }
}
