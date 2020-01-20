/* Validate Mapbox Token */
if ((MAPBOX_TOKEN || '') === '' || MAPBOX_TOKEN === 'PROVIDE_MAPBOX_TOKEN') {
  alert(WARNING_MESSAGE);
}

/** STORE **/
const reducers = (function createReducers(redux, keplerGl) {
  return redux.combineReducers({
    // mount keplerGl reducer
    keplerGl: keplerGl.keplerGlReducer.initialState({
      uiState: {
        readOnly: true
      }
    })
  });
}(Redux, KeplerGl));

const middleWares = (function createMiddlewares(keplerGl) {
  return keplerGl.enhanceReduxMiddleware([
    // Add other middlewares here
  ]);
}(KeplerGl));

const enhancers = (function craeteEnhancers(redux, middles) {
  return redux.applyMiddleware(...middles);
}(Redux, middleWares));

const store = (function createStore(redux, enhancers) {
  const initialState = {};

  return redux.createStore(
    reducers,
    initialState,
    redux.compose(enhancers)
  );
}(Redux, enhancers));
/** END STORE **/

/** COMPONENTS **/
var KeplerElement = (function makeKeplerElement(react, keplerGl, mapboxToken) {
  

  return function App() {
    var rootElm = react.useRef(null);
    var _useState = react.useState({
      width: document.getElementById('app').offsetWidth,
      height: document.getElementById('app').offsetHeight
    });
    console.log(document.getElementById('app'));
    var windowDimension = _useState[0];
    var setDimension = _useState[1];
    react.useEffect(function sideEffect(){
      function handleResize() {
        setDimension({width: window.innerWidth, height: window.innerHeight});
      };
      window.addEventListener('resize', handleResize);
      return function() {window.removeEventListener('resize', handleResize);};
    }, []);
    return react.createElement(
      'div',
      {style: {position: 'absolute', left: 0, width: '100%', height: '100%'}},

      react.createElement(keplerGl.KeplerGl, {
        mapboxApiAccessToken: mapboxToken,
        id: "map",
        width: windowDimension.width,
        height: windowDimension.height
      })
    )
  }
}(React, KeplerGl, MAPBOX_TOKEN));

const app = (function createReactReduxProvider(react, reactRedux, KeplerElement) {
  return react.createElement(
    reactRedux.Provider,
    {store},
    react.createElement(KeplerElement, null)
  )
}(React, ReactRedux, KeplerElement));
/** END COMPONENTS **/

/** Render **/
(function render(react, reactDOM, app) {
  reactDOM.render(app, document.getElementById('app'));
}(React, ReactDOM, app));