export const addDaysToDate = (date: string | Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);

  return newDate;
};
