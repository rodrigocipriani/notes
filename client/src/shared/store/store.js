import { combineReducers, createStore, compose, applyMiddleware } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import storage from "redux-persist/lib/storage";
import reducers from "../reducers";
import readyStatePromiseMiddleware from "./readyStatePromiseMiddleware";

const reducer = combineReducers(reducers);

const persistConfig = { key: "root", storage };
const persistedReducer = persistReducer(persistConfig, reducer);

const loggerMiddleware = createLogger({ predicate: () => true });

const middlewares = [thunk, readyStatePromiseMiddleware, loggerMiddleware];

const initialState = {};

let store = createStore(
  persistedReducer,
  initialState,
  compose(applyMiddleware(...middlewares))
);

let persistor = persistStore(store);

export { store, persistor };
