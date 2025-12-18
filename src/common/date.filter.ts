import { format } from "date-fns";

export default (date: Date | string | number): string => {
  return format(new Date(date), "MMMM d, yyyy");
};
