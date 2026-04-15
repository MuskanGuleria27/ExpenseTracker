const xlsx=require('xlsx');
const Income=require('../models/Income');

const formatDateForExcel = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

//Add income Source
exports.addIncome=async(req,res)=>{
const userId=req.user.id;
try{
    const {icon,source,amount,date}=req.body;
    if(!source || !amount||!date){
      return res.status(400).json({message:"All fields are required"});
}

const newIncome=new Income({
    userId,
    icon,
    source,
    amount,
    date:new Date(date)
});
await newIncome.save();
res.status(200).json(newIncome);
}catch(error){
  console.log("ERROR:", error); // 👈 add this
  res.status(500).json({
    message: "Server error",
    error: error.message
  });
}
}


//Get all income Source
exports.getAllIncome=async(req,res)=>{
const userId=req.user.id;
try{
    const income=await Income.find({userId}).sort({date:-1});
    res.json(income);
}catch(error){
  res.status(500).json({message:"Server error"});
}
};

//Delete income Source
exports.deleteIncome=async(req,res)=>{
try{
  const income = await Income.findById(req.params.id);
  if (!income) {
    return res.status(404).json({message:"Income not found"});
  }
  if (income.userId.toString() !== req.user.id) {
    return res.status(403).json({message:"Not authorized to delete this income"});
  }
  await Income.findByIdAndDelete(req.params.id);
  res.json({message:"Income deleted successfully"});
}catch(error){
  console.log("ERROR:", error);
  res.status(500).json({message:"Server error"});
}

};
//Download income data in excel format
exports.downloadIncomeExcel=async(req,res)=>{
  const userId=req.user.id;
  try{
    const income=await Income.find({userId}).sort({date:-1});
    const data=income.map(item=>({
      Source:item.source,
      Amount:item.amount,
      Date:formatDateForExcel(item.date),
    }));
    const wb=xlsx.utils.book_new();
    const ws=xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb,ws,"Income");
    xlsx.writeFile(wb,"income_details.xlsx");
    res.download("income_details.xlsx");
  }catch(error){
    res.status(500).json({message:"Server error"});
  }
};
