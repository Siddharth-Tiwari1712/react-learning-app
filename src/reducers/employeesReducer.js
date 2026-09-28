// STAGE 7: useReducer.
// A reducer is a PURE function: (state, action) => newState.
// No API calls, no mutation, no randomness in here.
//
//   UI event -> dispatch(action) -> reducer -> new state -> re-render
//
// Why not many useState calls? Here items/status/error/query/filter change
// together (e.g. FETCH_START touches status AND error). One reducer keeps
// those transitions in one place and easy to test.

export const initialState = {
  items: [],
  status: "idle", // "idle" | "loading" | "success" | "error"
  error: null,
  query: "",
  activeFilter: "all", // "all" | "active" | "inactive"
};

export function employeesReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, status: "loading", error: null };
    case "FETCH_SUCCESS":
      return { ...state, status: "success", items: action.payload };
    case "FETCH_ERROR":
      return { ...state, status: "error", error: action.error };
    case "ADD":
      return { ...state, items: [action.payload, ...state.items] };
    case "DELETE":
      return { ...state, items: state.items.filter((e) => e.id !== action.id) };
    case "TOGGLE_ACTIVE":
      // Always create NEW objects/arrays: React compares by reference.
      return {
        ...state,
        items: state.items.map((e) => (e.id === action.id ? { ...e, isActive: !e.isActive } : e)),
      };
    case "RESTORE": // used to roll back an optimistic delete
      return { ...state, items: action.items };
    case "SET_QUERY":
      return { ...state, query: action.query };
    case "SET_ACTIVE_FILTER":
      return { ...state, activeFilter: action.value };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}
