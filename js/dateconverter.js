// Assuming all necessary functions from ./main.js are imported correctly
import { ethTime, toEthiopianDateTime, toEthiopianDateTimeString, toEuropeanDate, toEuropeanDateString } from './main.js';

function updateCalculatedEthDateOnPage() {
  const europeanDateValueArray = document.getElementById('EuropeanDate').value.split('-');
  const eurYear = parseInt(europeanDateValueArray[0]); // Ensure proper parsing
  const eurMonth = parseInt(europeanDateValueArray[1]); // Ensure proper parsing
  const eurDate = parseInt(europeanDateValueArray[2]); // Ensure proper parsing

  // Add validation for date input (e.g., ensure dates are within valid range)

  const ethDate = toEthiopianDateTime(new Date(Date.UTC(eurYear, eurMonth - 1, eurDate)));
  document.getElementById('EthDayScroll').value = ethDate.date;
  document.getElementById('EthMonthScroll').value = ethDate.month;
  document.getElementById('EthYearScroll').value = ethDate.year;

  const europeanDate = toEuropeanDateString(ethDate);
  document.getElementById('EuropeanDate').value = europeanDate;
  document.getElementById('EurDayTextArea').innerHTML = europeanDate;
  document.getElementById('ethDayTextArea').innerHTML = ethDate.dateWithDayString;
}

function updateCalculatedEurDateOnPage() {
  const ethDate_Year = parseInt(document.getElementById('EthYearScroll').value);
  const ethDate_Month = parseInt(document.getElementById('EthMonthScroll').value);
  const ethDate_Day = parseInt(document.getElementById('EthDayScroll').value);

  // Add validation for date input (e.g., ensure dates are within valid range)

  const ethDate = new ethTime(ethDate_Day, ethDate_Month, ethDate_Year, 0, 0, 0); // Assuming 'ethTime' constructor exists
  const europeanDate = toEuropeanDate(ethDate);
  document.getElementById('EuropeanDate').value = europeanDate.toJSON().slice(0, 10);
  document.getElementById('EurDayTextArea').innerHTML = toEuropeanDateString(ethDate);
  document.getElementById('ethDayTextArea').innerHTML = ethDate.dateWithDayString;
}

function initDates() {
  const currentDate = new Date();
  const dateAtGMT = new Date(currentDate.valueOf() + currentDate.getTimezoneOffset() * 60000);
  document.getElementById('EuropeanDate').value = dateAtGMT.toJSON().slice(0, 10);
  updateCalculatedEthDateOnPage();
  updateCalculatedEurDateOnPage();
  window.onfocus = () => { ethTodayTextArea.liveRefreshEnabled = true; };
  window.onblur = () => { ethTodayTextArea.liveRefreshEnabled = false; };
}

function createEventListnersHTML() {
  document.querySelector('body').onload = initDates;
  document.querySelector('#EuropeanDate').onchange = updateCalculatedEthDateOnPage;
  document.querySelector('#EthMonthScroll').onchange = updateCalculatedEurDateOnPage;
  document.querySelector('#EthDayScroll').onchange = updateCalculatedEurDateOnPage;
  document.querySelector('#EthYearScroll').onchange = updateCalculatedEurDateOnPage;
}

var ethTodayTextArea = new Vue({
  el: '#ethTodayTextArea',
  data: {
    ethTodayDateText: '...',
    ethTodayTimeText: '...',
    liveRefreshEnabled: false,
    liveRefreshObj: null,
  },
  methods: {
    refreshEthDateOnPage: function () {
      [this.ethTodayDateText, this.ethTodayTimeText] = toEthiopianDateTimeString(new Date());
    },
    liveDateRefresh: function () {
      this.liveRefreshObj = setInterval(this.refreshEthDateOnPage, 1000);
    },
  },
  watch: {
    liveRefreshEnabled: function (enabled) {
      if (enabled) {
        this.liveDateRefresh();
      } else {
        clearInterval(this.liveRefreshObj);
      }
    },
  },
  created: function () {
    this.refreshEthDateOnPage();
    this.liveRefreshEnabled = true;
  },
});

export {
  createEventListnersHTML
}