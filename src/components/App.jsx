import React from "react";

class App extends React.Component {
  state = {
    myStateVariable: ""
  }
  
  render() {
    return (
      <div>
      <h1>TEST</h1>
      <style>
        {`
          .my-css-class {

          }
        `}
      </style>
    </div>
    );
  }
}

export default App;
