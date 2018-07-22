<template>
  <div class="date-select-container">
    <div class="">
      <div class="mounth-wrap">
        <div class="last" @click="lastMounth"></div>
        <div>{{year}}年{{mounth}}月</div>
        <div class="next" @click="nextMounth"></div>
      </div>
      <div class="week-wrap font-size-12">
        <div class="week-item" v-for="(week, i) in weeks" :key="i">{{week}}</div>
      </div>
      <div class="day-wrap font-size-14">
        <div class="day" @click="selectDate(day.day)" :class="{'today': (day.day == today && mounth == thisMounth), 'active': (day.day == activeDay && mounth == activeMounth), 'disable': day.disable}" v-for="(day, i) in getDays" :key="i">
          <div class="day-text">{{day.day}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Moment from 'moment'
import _ from 'underscore'

export default {
  props: ['startDate', 'endDate', 'dates'],
  data () {
    return {
      year: parseInt(Moment().format('YYYY')),
      mounth: parseInt(Moment().format('MM')),
      thisMounth: parseInt(Moment().format('MM')),
      today: parseInt(Moment().format('DD')),
      weeks: ['日', '一', '二', '三', '四', '五', '六'],
      activeDay: null,
      activeMounth: null,
      selectDay: []
    }
  },
  created () {
    Moment.locale('zh-cn')
  },
  computed: {
    startDateFormat () {
      return Moment(this.startDate).subtract(1, 'days').format('YYYY-MMDD')
    },
    endDateFormat () {
      return Moment(this.endDate).add(1, 'days').format('YYYY-MMDD')
    },
    datesFormat () {
      return _.map(this.dates, date => {
        return Moment(date).format('YYYY-MMDD')
      })
    },
    mounthFormat () {
      if (this.mounth.length === 1) {
        return '0' + this.mounth
      } else {
        return this.mounth
      }
    },
    getDays () {
      let days = []
      let thisMounthFirstDay = this.year.toString() + '-' + this.mounthFormat + '-01'
      let firstDayWeek = _.indexOf(this.weeks, Moment(thisMounthFirstDay).format('dd'))
      alert(thisMounthFirstDay)
      alert(Moment(thisMounthFirstDay.toString()).format('dd'))
      alert(Moment('2018-7-20').format('dd'))
      alert(firstDayWeek)
      let thisMounthDayCount = Moment(this.year + '-' + this.mounth).daysInMonth()
      let lastMounthDays = _.range(firstDayWeek)
      _.each(lastMounthDays, () => {
        days.push(
          {
            day: '',
            disable: true
          }
        )
      })
      let thisMounthDays = _.range(1, thisMounthDayCount + 1)
      _.each(thisMounthDays, day => {
        days.push(
          {
            day: day,
            disable: !this.isBetween(day)
          }
        )
      })
      return days
    }
  },
  methods: {
    lastMounth () {
      if (this.mounth > 1) {
        this.mounth -= 1
      } else {
        this.year -= 1
        this.mounth = 12
      }
    },
    nextMounth () {
      if (this.mounth < 12) {
        this.mounth += 1
      } else {
        this.year += 1
        this.mounth = 1
      }
    },
    isBetween (day) {
      if (this.startDate && this.endDate) {
        return Moment(this.year + '-' + this.mounth + '-' + day).isBetween(this.startDateFormat, this.endDateFormat)
      } else if (this.dates && this.dates.length > 0) {
        let dayDate = Moment(this.year + '-' + this.mounth + '-' + day).format('YYYY-MMDD')
        return _.indexOf(this.datesFormat, dayDate) > -1
      } else {
        return true
      }
    },
    selectDate (day) {
      if (day) {
        if (this.startDate && this.endDate) {
          if (Moment(this.year + '-' + this.mounth + '-' + day).isBetween(this.startDateFormat, this.endDateFormat)) {
            this.activeDay = day
            this.activeMounth = this.mounth
            this.$emit('selectedDate', Moment(this.year + '-' + this.activeMounth + '-' + this.activeDay).format('YYYY-MMDD'))
          }
        } else if (this.dates && this.dates.length > 0) {
          let dayDate = Moment(this.year + '-' + this.mounth + '-' + day).format('YYYY-MMDD')
          if (_.indexOf(this.datesFormat, dayDate) > -1) {
            this.activeDay = day
            this.activeMounth = this.mounth
            this.$emit('selectedDate', Moment(this.year + '-' + this.activeMounth + '-' + this.activeDay).format('YYYY-MMDD'))
          }
        } else {
          this.activeDay = day
          this.activeMounth = this.mounth
          this.$emit('selectedDate', Moment(this.year + '-' + this.activeMounth + '-' + this.activeDay).format('YYYY-MMDD'))
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.date-select-container {
  .mounth-wrap {
    text-align: center;
    display: flex;
    justify-content: center;
    padding: 13px 0;
    .last,
    .next {
      flex: 1;
      position: relative;
      &::after {
        content: " ";
        display: inline-block;
        height: 10px;
        width: 10px;
        border-width: 1px 1px 0 0;
        border-color: red;
        border-style: solid;
        position: absolute;
        top: 50%;
        right: 2px;
      }
    }
    .last {
      width: 50px;
      margin-left: 27px;
      &::after {
        left: 2px;
        transform: translateY(-50%) rotate(225deg);
      }
    }
    .next {
      width: 30px;
      margin-right: 27px;
      &::after {
        transform: translateY(-50%) rotate(45deg);
      }
    }
  }
  .week-wrap {
    display: flex;
    background-color: #eee;
    text-align: center;
    padding: 8px 0;
    margin-bottom: 10px;
    .week-item {
      flex: 1;
    }
  }
  .day-wrap {
    display: flex;
    flex-wrap: wrap;
    text-align: center;
    color: #000;
    .day {
      width: 14.28%;
      padding: 10px 0;
      .day-text {
        margin: auto;
        border-radius: 100%;
        width: 32px;
        height: 32px;
        line-height: 32px;
      }
    }
    .today {
      .day-text {
        border: 1px solid red;
      }
    }
    .active {
      .day-text {
        background: red;
        color: #fff;
      }
    }
    .disable {
      .day-text {
        color: #ccc;
      }
    }
  }
}
</style>
