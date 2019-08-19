import React from "react";
import moment from "moment";
const date = "2019-08-19T17:00:00.312Z";

function App() {
  return (
    <section>
      <h1>react test</h1>

      <h2>UTC OFFSET: {moment().utcOffset()}</h2>

      <p>NORMAL:</p>
      <p>{moment(date).format("MM/D/YYYY h:mm A")}</p>
      <p>UTC:</p>
      <p>{moment.utc(date).format("MM/D/YYYY h:mm A")}</p>
    </section>
  );
}

export default App;
