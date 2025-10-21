import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  FlatList,
  StatusBar,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DRAWER_HEIGHT = SCREEN_HEIGHT * 0.7;

interface CalendarDrawerProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function CalendarDrawer({ visible, onClose, selectedDate, onDateSelect }: CalendarDrawerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [slideAnim] = useState(new Animated.Value(-DRAWER_HEIGHT));

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -DRAWER_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const handleDatePress = (date: Date) => {
    onDateSelect(date);
    onClose();
  };

  const renderDay = (date: Date, index: number) => {
    const isCurrentMonthDay = isCurrentMonth(date);
    const isTodayDay = isToday(date);
    const isSelectedDay = isSelected(date);

    return (
      <TouchableOpacity
        key={index}
        style={{
          width: SCREEN_WIDTH / 7,
          height: 48,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isSelectedDay ? Colors.light.primary500 : 'transparent',
          borderRadius: isSelectedDay ? 24 : 0,
        }}
        onPress={() => handleDatePress(date)}
        activeOpacity={0.7}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'PublicSans-Medium',
            color: isSelectedDay
              ? 'white'
              : isTodayDay
              ? Colors.light.primary500
              : isCurrentMonthDay
              ? Colors.light.neutral900
              : Colors.light.neutral400,
            fontWeight: isTodayDay ? 'bold' : 'normal',
          }}
        >
          {date.getDate()}
        </Text>
        {isTodayDay && !isSelectedDay && (
          <View
            style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: Colors.light.primary500,
              marginTop: 2,
            }}
          />
        )}
      </TouchableOpacity>
    );
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={{ flex: 1 }}>
        {/* Overlay */}
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Drawer */}
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: DRAWER_HEIGHT,
            backgroundColor: 'white',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            transform: [{ translateY: slideAnim }],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 12,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingTop: (StatusBar.currentHeight || 0) + 20,
              paddingBottom: 20,
              borderBottomWidth: 1,
              borderBottomColor: Colors.light.neutral200,
            }}
          >
            <TouchableOpacity onPress={() => navigateMonth('prev')}>
              <MaterialIcons name="chevron-left" size={24} color={Colors.light.neutral900} />
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: Colors.light.neutral900,
                fontFamily: 'PublicSans-Bold',
              }}
            >
              {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>

            <TouchableOpacity onPress={() => navigateMonth('next')}>
              <MaterialIcons name="chevron-right" size={24} color={Colors.light.neutral900} />
            </TouchableOpacity>
          </View>

          {/* Days of week header */}
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 16,
              backgroundColor: Colors.light.neutral100,
            }}
          >
            {DAYS_OF_WEEK.map((day) => (
              <View
                key={day}
                style={{
                  width: SCREEN_WIDTH / 7,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: Colors.light.neutral500,
                    fontFamily: 'PublicSans-Medium',
                  }}
                >
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={{ flex: 1, paddingHorizontal: 0 }}>
            <FlatList
              data={Array.from({ length: Math.ceil(days.length / 7) })}
              keyExtractor={(_, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ index: weekIndex }) => (
                <View style={{ flexDirection: 'row' }}>
                  {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) =>
                    renderDay(day, weekIndex * 7 + dayIndex)
                  )}
                </View>
              )}
            />
          </View>

          {/* Close button */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 20,
              borderTopWidth: 1,
              borderTopColor: Colors.light.neutral200,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: Colors.light.primary500,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={onClose}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: '600',
                  fontFamily: 'PublicSans-Medium',
                }}
              >
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}