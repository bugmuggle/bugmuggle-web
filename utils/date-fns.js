import { format } from 'date-fns'

export const formatDateMinimal = (date) => {
  return format(date, 'hh:mm a')
}

