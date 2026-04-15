import moment from 'moment';
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
export const getInitials = (name)=>{
  if(!name)return"";
  const words =name.split(" ");
  let initials = "";
  for(let i=0;i<Math.min(2,words.length);i++){
    initials+=words[i][0];
  }
  return initials.toUpperCase();
}
export const addThousandSeparator=(num)=>{if(num===null||isNaN(num))return"";
  const[integerPart,fractionalPart]=num.toString().split(".");
  const formattedInteger=integerPart.replace(/\B(?=(\d{3})+(?!\d))/g,",");
  return fractionalPart?`${formattedInteger}.${fractionalPart}`:formattedInteger;
};

export const prepareExpenseDataForChart=(data=[])=>{
  const chartData=data.map((item)=>({
    category:item?.category,
    amount:item?.amount,
  }));
  return chartData;
};

export const prepareExpenseBarChartData=(data=[])=>{
  const groupedByDay = data.reduce((acc, item) => {
    const dayLabel = moment(item?.date).format('Do MMM');
    if (!acc[dayLabel]) {
      acc[dayLabel] = {
        month: dayLabel,
        amount: 0,
        category: 'Total Expense',
        entries: [],
      };
    }
    const expenseAmount = Number(item?.amount || 0);
    acc[dayLabel].amount += expenseAmount;
    acc[dayLabel].entries.push({
      category: item?.category || 'Other',
      amount: expenseAmount,
    });
    return acc;
  }, {});

  return Object.values(groupedByDay).sort((a, b) =>
    moment(a.month, 'Do MMM').toDate() - moment(b.month, 'Do MMM').toDate()
  );
};

export const prepareIncomeBarChartData=(data=[])=>{
  const sortedData=[...data].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const chartData=sortedData.map((item)=>({ month:moment(item?.date).format('Do MMM'), 
    amount:item?.amount,
    source:item?.source,
  }));
  return chartData;
};
export const prepareExpenseLineChartData=(data=[])=>{
  const sortedData=[...data].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const chartData=sortedData.map((item)=>({ month:moment(item?.date).format('Do MMM'),
    amount:item?.amount,
    category:item?.category,
  }));
  return chartData;
};