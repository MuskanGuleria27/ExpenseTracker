import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
const CustomBarChart = ({ data }) => {
  const getBarColor=(index)=>{
    return index%2===0?"#875cf5":"#cfbefb";
  };
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return(
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
          <p className="text xs font-semibold text-purple-800 mb-1">{item.category}</p>
          <p className="text-sm text-gray-600">
            Amount:<span className="text-sm font-medium text-gray-900">${payload[0].payload.amount}</span>
          </p>
          {Array.isArray(item.entries) && item.entries.length > 0 ? (
            <div className="mt-2 border-t border-gray-200 pt-2">
              {item.entries.map((entry, index) => (
                <p key={index} className="text-xs text-gray-700">
                  {entry.category}: <span className="font-medium">${entry.amount}</span>
                </p>
              ))}
            </div>
          ) : null}
        </div>
      );
    }
    return null;
  }
  return (
    <div className="bg-white mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="none" />
          <XAxis dataKey="month" tick={{fontSize:12,fill:"#555"}} stroke="none" />
          <YAxis tick={{fontSize:12,fill:"#555"}} stroke="none" />
          <Tooltip content={CustomTooltip} />
          
          <Bar dataKey="amount" fill="#FF8042" 
          radius={[10,10,0,0]}
          activeDot={{ r: 8, fill: "yellow" }}
          activeStyle={{ fill: "green" }}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(index)}/>
            ))}
          </Bar>
          
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CustomBarChart