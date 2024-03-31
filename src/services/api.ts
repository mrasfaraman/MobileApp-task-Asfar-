import {API_URL, AUTH_TOKEN} from '@env';
import axios from 'axios';

const fetchReminders = async (page: number, pageSize: number) => {
   try {
      const response = await axios.get(API_URL, {
         params: {
            page,
            pageSize,
         },
         headers: {
            Authorization: AUTH_TOKEN,
         },
      });
      console.log(response.data);
      
      return response.data;
   } catch (error) {
      console.error('Error fetching reminders:', error);
      throw error;
   }
};

export {fetchReminders};
