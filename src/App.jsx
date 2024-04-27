import "./App.css";
import Canvas from "./Canvas";
import template from "./template.json";

function App() {
  // console.log(template);
  return (
    <div>
      <Canvas templateData={template} />
    </div>
  );
}

export default App;
