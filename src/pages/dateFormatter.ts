export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Present';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return dateString;
  }
};