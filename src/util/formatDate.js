const formatDate = (dateString) => {
  if (!dateString) return "Date unknown"; // Fallback for missing data
  const date = new Date(dateString);
  
  // Check if the date is actually valid
  if (isNaN(date.getTime())) return "Invalid date"; 
  
  return date.toLocaleDateString(undefined, { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });
};

export default formatDate;