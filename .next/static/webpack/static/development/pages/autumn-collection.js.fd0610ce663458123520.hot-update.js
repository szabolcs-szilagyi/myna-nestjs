webpackHotUpdate("static/development/pages/autumn-collection.js",{

/***/ "./components/Header.js":
/*!******************************!*\
  !*** ./components/Header.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var _babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/classCallCheck */ \"./node_modules/@babel/runtime/helpers/esm/classCallCheck.js\");\n/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ \"./node_modules/@babel/runtime/helpers/esm/createClass.js\");\n/* harmony import */ var _babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/assertThisInitialized */ \"./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js\");\n/* harmony import */ var _babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inherits */ \"./node_modules/@babel/runtime/helpers/esm/inherits.js\");\n/* harmony import */ var _babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/esm/possibleConstructorReturn */ \"./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js\");\n/* harmony import */ var _babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/esm/getPrototypeOf */ \"./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! next/head */ \"./node_modules/next/dist/next-server/lib/head.js\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_7__);\n\n\n\n\n\n\nvar _jsxFileName = \"/home/balazs/ReactJs/myna/components/Header.js\";\n\nvar __jsx = react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement;\n\nfunction _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = Object(_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__[\"default\"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = Object(_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__[\"default\"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return Object(_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__[\"default\"])(this, result); }; }\n\nfunction _isNativeReflectConstruct() { if (typeof Reflect === \"undefined\" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === \"function\") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }\n\n\n\nvar HeadElement = /*#__PURE__*/function (_React$Component) {\n  Object(_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(HeadElement, _React$Component);\n\n  var _super = _createSuper(HeadElement);\n\n  function HeadElement(props) {\n    var _this;\n\n    Object(_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(this, HeadElement);\n\n    _this = _super.call(this, props);\n    _this.state = {\n      currentUrl: '',\n      title: ''\n    };\n    _this.setTitle = _this.setTitle.bind(Object(_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(_this));\n    _this.resetZoom = _this.resetZoom.bind(Object(_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(_this));\n    return _this;\n  }\n\n  Object(_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(HeadElement, [{\n    key: \"setTitle\",\n    value: function setTitle() {\n      var title;\n      var cpn = window.location.pathname;\n\n      if (cpn == '/') {\n        title = 'MYNA Home';\n      }\n\n      if (cpn == '/my-account') {\n        title = 'MYNA My Account';\n      }\n\n      if (cpn == '/checkout') {\n        title = 'MYNA Checkout';\n      }\n\n      if (cpn == '/size-measurement') {\n        title = 'MYNA Sizes and Measurements';\n      }\n\n      if (cpn == '/privacy-contact') {\n        title = 'MYNA Privacy and Contact';\n      }\n\n      if (cpn == '/sustainability') {\n        title = 'MYNA Sustainability';\n      }\n\n      if (cpn == '/shipping') {\n        title = 'MYNA Shipping';\n      }\n\n      if (cpn == '/love-and-light') {\n        title = 'MYNA Love & Light';\n      }\n\n      if (cpn == '/lookbook') {\n        title = 'MYNA Lookbook';\n      }\n\n      if (cpn == '/our-story') {\n        title = 'MYNA Our Story';\n      }\n\n      if (cpn == '/nolia-dustpink') {\n        title = 'MYNA | Nolia Dustpink';\n      }\n\n      if (cpn == '/lotus-sand') {\n        title = 'MYNA | Lotus Sand';\n      }\n\n      if (cpn == '/aster-sand') {\n        title = 'MYNA | Aster Sand';\n      }\n\n      if (cpn == '/aster-green') {\n        title = 'MYNA | Aster Green';\n      }\n\n      if (cpn == '/calla-cream') {\n        title = 'MYNA | Calla Cream';\n      }\n\n      if (cpn == '/ivy-cream') {\n        title = 'MYNA | Ivy Cream';\n      }\n\n      if (cpn == '/gea-cream') {\n        title = 'MYNA | Gea Cream';\n      }\n\n      if (cpn == '/autumn-collection') {\n        title = 'MYNA Autumn Collection';\n      }\n\n      if (cpn == '/alyss-dress') {\n        title = 'MYNA | Alyss Dress';\n      }\n\n      if (cpn == '/tilja-top') {\n        title = 'MYNA | Tilia Top';\n      }\n\n      if (cpn == '/magna-scarf') {\n        title = 'MYNA | Magna Scarf';\n      }\n\n      this.setState({\n        currentUrl: cpn\n      });\n      this.setState({\n        title: title\n      });\n    }\n  }, {\n    key: \"resetZoom\",\n    value: function resetZoom() {}\n  }, {\n    key: \"componentDidMount\",\n    value: function componentDidMount() {\n      setTimeout(this.setTitle, 250);\n    }\n  }, {\n    key: \"render\",\n    value: function render() {\n      return __jsx(next_head__WEBPACK_IMPORTED_MODULE_7___default.a, {\n        __self: this,\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 47,\n          columnNumber: 16\n        }\n      }, __jsx(\"title\", {\n        __self: this,\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 48,\n          columnNumber: 9\n        }\n      }, this.state.title), __jsx(\"meta\", {\n        charSet: \"utf-8\",\n        __self: this,\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 49,\n          columnNumber: 9\n        }\n      }), __jsx(\"meta\", {\n        name: \"viewport\",\n        content: \"width=device-width, initial-scale=1.0\",\n        __self: this,\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 50,\n          columnNumber: 9\n        }\n      }), __jsx(\"script\", {\n        src: \"https://unpkg.com/react/umd/react.production.min.js\",\n        crossOrigin: \"true\",\n        __self: this,\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 51,\n          columnNumber: 9\n        }\n      }), __jsx(\"script\", {\n        src: \"https://unpkg.com/react-dom/umd/react-dom.production.min.js\",\n        crossOrigin: \"true\",\n        __self: this,\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 52,\n          columnNumber: 9\n        }\n      }), __jsx(\"script\", {\n        src: \"https://unpkg.com/react-bootstrap@next/dist/react-bootstrap.min.js\",\n        crossOrigin: \"true\",\n        __self: this,\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 53,\n          columnNumber: 9\n        }\n      }), __jsx(\"link\", {\n        rel: \"stylesheet\",\n        href: \"https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css\",\n        integrity: \"sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk\",\n        crossOrigin: \"anonymous\",\n        __self: this,\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 54,\n          columnNumber: 9\n        }\n      }));\n    }\n  }]);\n\n  return HeadElement;\n}(react__WEBPACK_IMPORTED_MODULE_6___default.a.Component);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (HeadElement);\n\n;\n    var _a, _b;\n    // Legacy CSS implementations will `eval` browser code in a Node.js context\n    // to extract CSS. For backwards compatibility, we need to check we're in a\n    // browser context before continuing.\n    if (typeof self !== 'undefined' &&\n        // AMP / No-JS mode does not inject these helpers:\n        '$RefreshHelpers$' in self) {\n        var currentExports_1 = module.__proto__.exports;\n        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n        // This cannot happen in MainTemplate because the exports mismatch between\n        // templating and execution.\n        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports_1, module.i);\n        // A module can be accepted automatically based on its exports, e.g. when\n        // it is a Refresh Boundary.\n        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports_1)) {\n            // Save the previous exports on update so we can compare the boundary\n            // signatures.\n            module.hot.dispose(function (data) {\n                data.prevExports = currentExports_1;\n            });\n            // Unconditionally accept an update to this module, we'll check if it's\n            // still a Refresh Boundary later.\n            module.hot.accept();\n            // This field is set when the previous version of this module was a\n            // Refresh Boundary, letting us know we need to check for invalidation or\n            // enqueue an update.\n            if (prevExports !== null) {\n                // A boundary can become ineligible if its exports are incompatible\n                // with the previous exports.\n                //\n                // For example, if you add/remove/change exports, we'll want to\n                // re-execute the importing modules, and force those components to\n                // re-render. Similarly, if you convert a class component to a\n                // function, we want to invalidate the boundary.\n                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports_1)) {\n                    module.hot.invalidate();\n                }\n                else {\n                    self.$RefreshHelpers$.scheduleUpdate();\n                }\n            }\n        }\n        else {\n            // Since we just executed the code for the module, it's possible that the\n            // new exports made it ineligible for being a boundary.\n            // We only care about the case when we were _previously_ a boundary,\n            // because we already accepted this update (accidental side effect).\n            var isNoLongerABoundary = prevExports !== null;\n            if (isNoLongerABoundary) {\n                module.hot.invalidate();\n            }\n        }\n    }\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL0hlYWRlci5qcz82ZjRhIl0sIm5hbWVzIjpbIkhlYWRFbGVtZW50IiwicHJvcHMiLCJzdGF0ZSIsImN1cnJlbnRVcmwiLCJ0aXRsZSIsInNldFRpdGxlIiwiYmluZCIsInJlc2V0Wm9vbSIsImNwbiIsIndpbmRvdyIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJzZXRTdGF0ZSIsInNldFRpbWVvdXQiLCJSZWFjdCIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztJQUVNQSxXOzs7OztBQUNKLHVCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUE7O0FBQ2pCLDhCQUFNQSxLQUFOO0FBQ0EsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGdCQUFVLEVBQUUsRUFERDtBQUVYQyxXQUFLLEVBQUU7QUFGSSxLQUFiO0FBSUEsVUFBS0MsUUFBTCxHQUFnQixNQUFLQSxRQUFMLENBQWNDLElBQWQseUdBQWhCO0FBQ0EsVUFBS0MsU0FBTCxHQUFpQixNQUFLQSxTQUFMLENBQWVELElBQWYseUdBQWpCO0FBUGlCO0FBUWxCOzs7OytCQUNhO0FBQ1YsVUFBSUYsS0FBSjtBQUNBLFVBQUlJLEdBQUcsR0FBR0MsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxRQUExQjs7QUFDQSxVQUFJSCxHQUFHLElBQUksR0FBWCxFQUFnQjtBQUFFSixhQUFLLEdBQUcsV0FBUjtBQUFzQjs7QUFDeEMsVUFBSUksR0FBRyxJQUFJLGFBQVgsRUFBMEI7QUFBRUosYUFBSyxHQUFHLGlCQUFSO0FBQTRCOztBQUN4RCxVQUFJSSxHQUFHLElBQUksV0FBWCxFQUF3QjtBQUFFSixhQUFLLEdBQUcsZUFBUjtBQUEwQjs7QUFDcEQsVUFBSUksR0FBRyxJQUFJLG1CQUFYLEVBQWdDO0FBQUVKLGFBQUssR0FBRyw2QkFBUjtBQUF3Qzs7QUFDMUUsVUFBSUksR0FBRyxJQUFJLGtCQUFYLEVBQStCO0FBQUVKLGFBQUssR0FB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UyxFQUFDLHlFQUE5RztBQUF3TCxtQkFBVyxFQUFDLFdBQXBNO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFQTyxDQUFQO0FBU0g7Ozs7RUFyRHFCVSw0Q0FBSyxDQUFDQyxTOztBQXdEakJmLDBFQUFmIiwiZmlsZSI6Ii4vY29tcG9uZW50cy9IZWFkZXIuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSGVhZCBmcm9tICduZXh0L2hlYWQnO1xuXG5jbGFzcyBIZWFkRWxlbWVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBjdXJyZW50VXJsOiAnJyxcbiAgICAgIHRpdGxlOiAnJ1xuICAgIH07XG4gICAgdGhpcy5zZXRUaXRsZSA9IHRoaXMuc2V0VGl0bGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlc2V0Wm9vbSA9IHRoaXMucmVzZXRab29tLmJpbmQodGhpcyk7XG4gIH1cbiAgICBzZXRUaXRsZSAoKSB7XG4gICAgICBsZXQgdGl0bGU7XG4gICAgICBsZXQgY3BuID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuICAgICAgaWYgKGNwbiA9PSAnLycpIHsgdGl0bGUgPSAnTVlOQSBIb21lJzsgfVxuICAgICAgaWYgKGNwbiA9PSAnL215LWFjY291bnQnKSB7IHRpdGxlID0gJ01ZTkEgTXkgQWNjb3VudCc7IH1cbiAgICAgIGlmIChjcG4gPT0gJy9jaGVja291dCcpIHsgdGl0bGUgPSAnTVlOQSBDaGVja291dCc7IH1cbiAgICAgIGlmIChjcG4gPT0gJy9zaXplLW1lYXN1cmVtZW50JykgeyB0aXRsZSA9ICdNWU5BIFNpemVzIGFuZCBNZWFzdXJlbWVudHMnOyB9XG4gICAgICBpZiAoY3BuID09ICcvcHJpdmFjeS1jb250YWN0JykgeyB0aXRsZSA9ICdNWU5BIFByaXZhY3kgYW5kIENvbnRhY3QnOyB9XG4gICAgICBpZiAoY3BuID09ICcvc3VzdGFpbmFiaWxpdHknKSB7IHRpdGxlID0gJ01ZTkEgU3VzdGFpbmFiaWxpdHknOyB9XG4gICAgICBpZiAoY3BuID09ICcvc2hpcHBpbmcnKSB7IHRpdGxlID0gJ01ZTkEgU2hpcHBpbmcnOyB9XG4gICAgICBpZiAoY3BuID09ICcvbG92ZS1hbmQtbGlnaHQnKSB7IHRpdGxlID0gJ01ZTkEgTG92ZSAmIExpZ2h0JzsgfVxuICAgICAgaWYgKGNwbiA9PSAnL2xvb2tib29rJykgeyB0aXRsZSA9ICdNWU5BIExvb2tib29rJzsgfVxuICAgICAgaWYgKGNwbiA9PSAnL291ci1zdG9yeScpIHsgdGl0bGUgPSAnTVlOQSBPdXIgU3RvcnknOyB9XG4gICAgICBpZiAoY3BuID09ICcvbm9saWEtZHVzdHBpbmsnKSB7IHRpdGxlID0gJ01ZTkEgfCBOb2xpYSBEdXN0cGluayc7IH1cbiAgICAgIGlmIChjcG4gPT0gJy9sb3R1cy1zYW5kJykgeyB0aXRsZSA9ICdNWU5BIHwgTG90dXMgU2FuZCc7IH1cbiAgICAgIGlmIChjcG4gPT0gJy9hc3Rlci1zYW5kJykgeyB0aXRsZSA9ICdNWU5BIHwgQXN0ZXIgU2FuZCc7IH1cbiAgICAgIGlmIChjcG4gPT0gJy9hc3Rlci1ncmVlbicpIHsgdGl0bGUgPSAnTVlOQSB8IEFzdGVyIEdyZWVuJzsgfVxuICAgICAgaWYgKGNwbiA9PSAnL2NhbGxhLWNyZWFtJykgeyB0aXRsZSA9ICdNWU5BIHwgQ2FsbGEgQ3JlYW0nOyB9XG4gICAgICBpZiAoY3BuID09ICcvaXZ5LWNyZWFtJykgeyB0aXRsZSA9ICdNWU5BIHwgSXZ5IENyZWFtJzsgfVxuICAgICAgaWYgKGNwbiA9PSAnL2dlYS1jcmVhbScpIHsgdGl0bGUgPSAnTVlOQSB8IEdlYSBDcmVhbSc7IH1cbiAgICAgIGlmIChjcG4gPT0gJy9hdXR1bW4tY29sbGVjdGlvbicpIHsgdGl0bGUgPSAnTVlOQSBBdXR1bW4gQ29sbGVjdGlvbic7IH1cbiAgICAgIGlmIChjcG4gPT0gJy9hbHlzcy1kcmVzcycpIHsgdGl0bGUgPSAnTVlOQSB8IEFseXNzIERyZXNzJzsgfVxuICAgICAgaWYgKGNwbiA9PSAnL3RpbGphLXRvcCcpIHsgdGl0bGUgPSAnTVlOQSB8IFRpbGlhIFRvcCc7IH1cbiAgICAgIGlmIChjcG4gPT0gJy9tYWduYS1zY2FyZicpIHsgdGl0bGUgPSAnTVlOQSB8IE1hZ25hIFNjYXJmJzsgfVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRVcmw6IGNwbiB9KTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB0aXRsZTogdGl0bGUgfSk7XG4gICAgfVxuICAgIHJlc2V0Wm9vbSAoKSB7XG4gICAgfVxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgc2V0VGltZW91dCh0aGlzLnNldFRpdGxlLCAyNTApO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIDxIZWFkPlxuICAgICAgICA8dGl0bGU+eyB0aGlzLnN0YXRlLnRpdGxlIH08L3RpdGxlPlxuICAgICAgICA8bWV0YSBjaGFyU2V0PVwidXRmLThcIiAvPlxuICAgICAgICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMFwiIC8+XG4gICAgICAgIDxzY3JpcHQgc3JjPVwiaHR0cHM6Ly91bnBrZy5jb20vcmVhY3QvdW1kL3JlYWN0LnByb2R1Y3Rpb24ubWluLmpzXCIgY3Jvc3NPcmlnaW49XCJ0cnVlXCI+PC9zY3JpcHQ+XG4gICAgICAgIDxzY3JpcHQgc3JjPVwiaHR0cHM6Ly91bnBrZy5jb20vcmVhY3QtZG9tL3VtZC9yZWFjdC1kb20ucHJvZHVjdGlvbi5taW4uanNcIiBjcm9zc09yaWdpbj1cInRydWVcIj48L3NjcmlwdD5cbiAgICAgICAgPHNjcmlwdCBzcmM9XCJodHRwczovL3VucGtnLmNvbS9yZWFjdC1ib290c3RyYXBAbmV4dC9kaXN0L3JlYWN0LWJvb3RzdHJhcC5taW4uanNcIiBjcm9zc09yaWdpbj1cInRydWVcIj48L3NjcmlwdD5cbiAgICAgICAgPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCJodHRwczovL21heGNkbi5ib290c3RyYXBjZG4uY29tL2Jvb3RzdHJhcC80LjUuMC9jc3MvYm9vdHN0cmFwLm1pbi5jc3NcIiBpbnRlZ3JpdHk9XCJzaGEzODQtOWFJdDJuUnBDMTJVazlnUzliYURsNDExTlFBcEZtQzI2RXdBT0g4V2dabDVNWVl4RmZjK05jUGIxZEtHajdTa1wiIGNyb3NzT3JpZ2luPVwiYW5vbnltb3VzXCIgLz5cbiAgICAgICAgPC9IZWFkPlxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSGVhZEVsZW1lbnRcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./components/Header.js\n");

/***/ })

})