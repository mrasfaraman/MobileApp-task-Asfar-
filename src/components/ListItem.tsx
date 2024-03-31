import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
   flex-direction: row;
   align-items: center;
   padding: 10px;
   border-bottom-width: 1px;
   border-bottom-color: #eee;
   width: 94%;
   align-self: center;
`;

const ReminderImage = styled.Image`
   width: 48px;
   height: 48px;
   border-radius: 3px;
`;

const PlaceholderImage = styled.View`
   width: 48px;
   height: 48px;
   border-radius: 3px;
   background-color: #ccc;
   justify-content: center;
   align-items: center;
`;

const PlaceholderText = styled.Text`
   color: #fff;
   font-size: 18px;
   font-family: Rubik-Medium;
`;

const TextContainer = styled.View`
   flex: 1;
   margin-left: 10px;
`;

const ScheduleView = styled.View`
   flex-direction: row;
   align-items: center;
`;

const ReminderName = styled.Text`
   font-size: 15px;
   color: black;
   font-family: Rubik-Medium;
`;

const ScheduleText = styled.Text`
   font-size: 14px;
   color: #1a1c1e;
   margin-left: 5px;
   font-family: Rubik-Regular;
`;

const Icon = styled.Image`
   width: 18px;
   height: 18px;
   bottom: 1px;
`;

const ArrowIcon = styled.Image`
   width: 16px;
   height: 16px;
`;

interface ListItemProps {
   name: string;
   schedule: {[key: string]: string | null};
   imageSource: string;
}

const ListItem: React.FC<ListItemProps> = ({name, schedule, imageSource}) => {
   const [imageError, setImageError] = useState<boolean>(false);

   const key = useRef(Math.random()).current.toString();

   if (!schedule) {
      return null;
   }

   useEffect(() => {
      setImageError(false);
   }, [imageSource]);

   const currentDate = new Date();
   const currentDay = currentDate.toLocaleString('en-us', {weekday: 'short'});
   const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes();

   let nearestDay: string | null = null;
   let nearestTime: number | null = null;

   Object.entries(schedule).forEach(([day, time]) => {
      if (time !== null && time !== undefined) {
         const dayIndex = [
            'Sun',
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat',
         ].indexOf(day);
         const scheduledTime =
            parseInt(time.slice(0, 2)) * 60 + parseInt(time.slice(3, 5));
         if (
            dayIndex === currentDate.getDay() &&
            scheduledTime >= currentTime
         ) {
            if (!nearestTime || scheduledTime < nearestTime) {
               nearestDay = day;
               nearestTime = scheduledTime;
            }
         } else if (dayIndex > currentDate.getDay()) {
            if (!nearestTime || scheduledTime < nearestTime) {
               nearestDay = day;
               nearestTime = scheduledTime;
            }
         }
      }
   });

   let scheduleText = '';
   if (nearestDay && nearestTime !== null) {
      const firstLetterOfDay = nearestDay[0];
      scheduleText = `${firstLetterOfDay} at ${schedule[nearestDay]}`;
   } else {
      scheduleText = 'Anytime';
   }

   let iconSource = require('../assets/task_done.png');
   if (Object.values(schedule).some(time => time !== null)) {
      iconSource = require('../assets/reminder.png');
   } else if (scheduleText.toLowerCase().includes('running now')) {
      iconSource = require('../assets/circle.png');
   } else if (Object.values(schedule).some(time => time === null)) {
      iconSource = require('../assets/eye.png');
   }

   return (
      <Container>
         {imageSource && !imageError ? (
            <ReminderImage
               key={key}
               source={{uri: imageSource}}
               onError={() => setImageError(true)}
            />
         ) : (
            <PlaceholderImage>
               <PlaceholderText>{name.charAt(0).toUpperCase()}</PlaceholderText>
            </PlaceholderImage>
         )}
         <TextContainer>
            <ReminderName>{name}</ReminderName>
            <ScheduleView>
               <Icon source={iconSource} />
               <ScheduleText>{scheduleText}</ScheduleText>
            </ScheduleView>
         </TextContainer>
         <ArrowIcon
            source={require('../assets/right_arrow.png')}
            resizeMode="contain"
         />
      </Container>
   );
};

export default ListItem;
