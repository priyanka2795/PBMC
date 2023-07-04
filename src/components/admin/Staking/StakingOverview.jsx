import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';


function StakingOverview() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
   const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display:false
    },
    title: {
        display: false,
        // text: 'Free Gala Area Chart ',
    },
    },
  };
  
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  
   const data = {
    labels,
    datasets: [
      {
        label: 'PBM',
        data: [0,50,100,150,200,250],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };

  return (
    <>
      <div className="staking_overview_section">
          <div className="head">
            <h6>Staking / Generating Overview</h6>
            <div className="staking_dropdown">
              <div>
                <select className=''>
                  <option value="">Staked</option>
                  <option value="">Unstaked</option>
                  <option value="">Claiming</option>
                </select>
              </div>
              <div>
                <select className=''>
                  <option value="">1 Week</option>
                  <option value="">1 Month</option>
                  <option value="">6 Months</option>
                  <option value="">1 Year</option>
                </select>
              </div>
            </div>
          </div>



          <div className="staking_overview_chart">
            <h2>35,532.01 <span>/PBMC staked</span></h2>
          <div className='line_chart_div'>
          <Line options={options} data={data} />
          </div>
          </div>
      </div>
    </>
  )
}

export default StakingOverview











