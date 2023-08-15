import { defineStore } from '@music163/tango-boot';

const counter = defineStore({
  number: 10,

  add() {
    this.number++;
  },

  decrement() {
    this.number--;
  },
});

export default counter;
