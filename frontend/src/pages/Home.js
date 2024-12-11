import React from "react";
import FileUpload from "../components/FileUpload";
import "./Home.css";

const Home = ({ onUploadSuccess }) => {
  const [selectedMonth, setSelectedMonth] = React.useState(12);

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  return (
    <div className="home-container">
      <div className="content">
        <h1 className="heading">Welcome to Anomaly Detection</h1>
        <p className="subheading">Upload your CSV file to start the analysis.</p>
3
        <div className="month-selector">
          <label htmlFor="month" className="month-label">Select Month:</label>
          <select
            id="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="month-dropdown"
          >
            <option value={1}>January</option>
            <option value={2}>February</option>
            <option value={3}>March</option>
            <option value={4}>April</option>
            <option value={5}>May</option>
            <option value={6}>June</option>
            <option value={7}>July</option>
            <option value={8}>August</option>
            <option value={9}>September</option>
            <option value={10}>October</option>
            <option value={11}>November</option>
            <option value={12}>December</option>
          </select>
        </div>

        <FileUpload selectedMonth={selectedMonth} onUploadSuccess={onUploadSuccess} />
      </div>
    </div>
  );
};

export default Home;
