const xlsx = require('xlsx');
const workbook = xlsx.readFile('ZOO MANAGEMENT SYSTEM - PHÂN CHIA CÔNG VIỆC NHÓM 1.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(worksheet);
console.log(JSON.stringify(data.slice(45, 54), null, 2));
