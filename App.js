/**
 * <div id="parent">
 *      <div id="child">
 *          <h1>Hello I am an H1 Tag</h1>
 *          <h2>Hello I am an H2 Tag</h2>
 *      </div>
 *            <div id="child2">
 *          <h1>Hello I am an H1 Tag</h1>
 *          <h2>Hello I am an H2 Tag</h2>
 *      </div>
 * </div>
 *
 * ReactElement(Object) => HTML(Browser Understands)
 */

// const parent = React.createElement(
//   "div",
//   { id: "parent" },
//   React.createElement("div", { id: "child" }, [
//     React.createElement("h1", {}, "Hello I am an H1 Tag"),
//     React.createElement("h1", {}, "Hello I am an H2 Tag"),
//   ]),
//   React.createElement("div", { id: "child2" }, [
//     React.createElement("h1", {}, "Hello I am an H1 Tag"),
//     React.createElement("h1", {}, "Hello I am an H2 Tag"),
//   ])
// );

// /* const heading = React.createElement(
//   "h1",
//   { id: "heading" },
//   "Hello From React"
// ); */

// const root = ReactDOM.createRoot(document.getElementById("root"));

// root.render(parent);

import React from "react";
import ReactDOM from "react-dom/client";

// const heading = React.createElement(
//   "h1",
//   { id: "heading" },
//   "Hello From React"
// );

//JSX => Html Like Syntax

//const heading = <h1 className="head">Hello I am Meet!</h1>;

//React Element
const heading = (
  <h1 className="head" tabIndex="5">
    Hello There!
  </h1>
);

// React Functional Component
//Componet-Composition <HeadingComponent />
const HeadingComponent = () => {
  return <h1 className="heading">React Functional Component</h1>;
};

const Number = 10000;

const HeadingComponent2 = () => (
  <div id="container">
    <h1>{Number}</h1>
    <HeadingComponent />
    <h1 className="heading">React Functional Component</h1>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<HeadingComponent2 />);
