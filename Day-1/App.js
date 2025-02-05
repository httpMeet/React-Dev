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

const parent = React.createElement(
  "div",
  { id: "parent" },
  React.createElement("div", { id: "child" }, [
    React.createElement("h1", {}, "Hello I am an H1 Tag"),
    React.createElement("h1", {}, "Hello I am an H2 Tag"),
  ]),
  React.createElement("div", { id: "child2" }, [
    React.createElement("h1", {}, "Hello I am an H1 Tag"),
    React.createElement("h1", {}, "Hello I am an H2 Tag"),
  ])
);

/* const heading = React.createElement(
  "h1",
  { id: "heading" },
  "Hello From React"
); */

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(parent);
