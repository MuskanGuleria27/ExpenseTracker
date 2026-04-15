const xlsx=require('xlsx');
const Expense=require('../models/Expense');

const formatDateForExcel = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

//Add Expense Source
exports.addExpense=async(req,res)=>{
const userId=req.user.id;
try{
    const {icon,category,amount,date}=req.body;
    if(!category || !amount||!date){
      return res.status(400).json({message:"All fields are required"});
}

const newExpense=new Expense({
    userId,
    icon,
    category,
    amount,
    date:new Date(date)
});
await newExpense.save();
res.status(200).json(newExpense);
}catch(error){
  console.log("ERROR:", error); // 👈 add this
  res.status(500).json({
    message: "Server error",
    error: error.message
  });
}
}


//Get all Expense Source
exports.getAllExpense=async(req,res)=>{
const userId=req.user.id;
try{
    const expense=await Expense.find({userId}).sort({date:-1});
    res.json(expense);
}catch(error){
  res.status(500).json({message:"Server error"});
}
};

//Delete Expense Source
exports.deleteExpense=async(req,res)=>{
try{
  const expense = await Expense.findById(req.params.id);
  if (!expense) {
    return res.status(404).json({message:"Expense not found"});
  }
  if (expense.userId.toString() !== req.user.id) {
    return res.status(403).json({message:"Not authorized to delete this expense"});
  }
  await Expense.findByIdAndDelete(req.params.id);
  res.json({message:"Expense deleted successfully"});
}catch(error){
  console.log("ERROR:", error);
  res.status(500).json({message:"Server error"});
}

};

//Download expense data in excel format
exports.downloadExpenseExcel=async(req,res)=>{
  const userId=req.user.id;
  try{
    const expense=await Expense.find({userId}).sort({date:-1});
    const data=expense.map(item=>({
      Source:item.category,
      Amount:item.amount,
      Date:formatDateForExcel(item.date),
    }));
    const wb=xlsx.utils.book_new();
    const ws=xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb,ws,"Expenses");
    xlsx.writeFile(wb,"expense_details.xlsx");
    res.download("expense_details.xlsx");
  }catch(error){
    res.status(500).json({message:"Server error"});
  }
};
